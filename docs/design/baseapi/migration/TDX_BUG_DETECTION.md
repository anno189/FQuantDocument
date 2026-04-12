# Tdx Adapter Bug 检测报告

**审计时间**: 2026-03-31
**审计路径**: `FQDataSource/adapters/tdx/`
**审计结果**: ✅ Bug风险低

---

## 一、空值处理

### 1.1 检查结果 ✅

| 检查项 | 状态 | 说明 |
|--------|------|------|
| API 返回检查 | ✅ | 所有 API 调用前检查 `is not None` |
| 数据长度检查 | ✅ | 使用 `len() < 1` 检查空列表 |
| DataFrame 检查 | ✅ | 使用 `pd.DataFrame()` 返回空数据 |

**示例**:
```python
if res is not None:
    if len(res) > 800:
        return datetime.now() - __time1
```

---

## 二、边界条件

### 2.1 索引边界 ⚠️

| 检查项 | 位置 | 风险 |
|--------|------|------|
| `index[0]` | tools.py:254 | ⚠️ 可能越界 |
| `index[-1]` | tools.py:260 | ⚠️ 可能越界 |

**代码**:
```python
data.loc[data.index[0], 'ltgbZ'] = liutonggubenZ.ltgbZ.iloc[0]
data.loc[data.index[-1], 'ltgbZ'] = liutonggubenZ.ltgbZ.iloc[-1]
```

**风险**: 如果 `liutonggubenZ` 为空，会抛出 `IndexError`

**修复建议**:
```python
if len(liutonggubenZ) > 0:
    data.loc[data.index[0], 'ltgbZ'] = liutonggubenZ.ltgbZ.iloc[0]
    data.loc[data.index[-1], 'ltgbZ'] = liutonggubenZ.ltgbZ.iloc[-1]
```

---

## 三、逻辑错误

### 3.1 检查结果 ✅

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 循环条件 | ✅ | 使用正确的 range 边界 |
| 日期处理 | ✅ | 正确处理日期格式 |
| 数据拼接 | ✅ | 使用 `pd.concat()` 正确合并 |

---

## 四、资源泄漏

### 4.1 连接管理 ✅

| 检查项 | 状态 | 说明 |
|--------|------|------|
| API 连接 | ✅ | 使用 `with` 语句自动关闭 |
| 文件句柄 | ✅ | 使用 `with` 语句自动关闭 |
| 缓存清理 | ✅ | 使用 TTL 自动过期 |

**示例**:
```python
with api.connect(ip, port, time_out=10):
    ...
# 自动关闭

with open(hy, encoding='GB18030', mode='r') as f:
    ...
# 自动关闭
```

---

## 五、发现的 Bug

### 5.1 低风险 Bug

| 级别 | 文件 | 行号 | 问题 |
|------|------|------|------|
| ⚠️ 低 | tools.py | 254 | `data.index[0]` 可能越界 |
| ⚠️ 低 | tools.py | 260 | `data.index[-1]` 可能越界 |

### 5.2 详细分析

#### Bug 1: 空数据索引越界

**位置**: `tools.py:254-260`

```python
def stock_to_liutonggubenZ(self, code: str, data: pd.DataFrame) -> pd.DataFrame:
    if data is None or len(data) == 0:
        return pd.DataFrame(columns=['date', 'ltgbZ'])

    liutonggubenZ = self.get_stock_liutonggubenZ(code)
    if liutonggubenZ is not None and len(liutonggubenZ) > 0:
        data.loc[data.index[0], 'ltgbZ'] = liutonggubenZ.ltgbZ.iloc[0]
        data.loc[data.index[-1], 'ltgbZ'] = liutonggubenZ.ltgbZ.iloc[-1]
    return data
```

**问题**: 虽然已检查 `liutonggubenZ` 非空，但 `data.index[0]` 和 `data.index[-1]` 可能在空 `data` 时越界

**当前状态**: 由于外层已检查 `data is None or len(data) == 0`，此 Bug 已被防护

---

## 六、测试建议

### 6.1 边界条件测试

| 测试场景 | 输入 | 预期 |
|----------|------|------|
| 空 DataFrame | `pd.DataFrame()` | 返回空 DataFrame |
| 单行 DataFrame | 1行数据 | 正常工作 |
| 大量数据 | 10000+ 行 | 正常分页 |
| 无效日期 | `start > end` | 返回空或错误 |

### 6.2 异常测试

| 测试场景 | 输入 | 预期 |
|----------|------|------|
| 网络断开 | 关闭网络 | 重试后抛出异常 |
| API 超时 | 慢响应 | 超时后重试 |
| 无效代码 | `"INVALID"` | 返回空 DataFrame |

---

## 七、Bug 统计

| 级别 | 数量 |
|------|------|
| 高危 | 0 |
| 中危 | 0 |
| 低危 | 2 (已防护) |

---

## 八、审计结论

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 空值处理 | ✅ | 正确检查 None 和长度 |
| 边界条件 | ⚠️ | 基本正确，有低风险项 |
| 逻辑错误 | ✅ | 无逻辑错误 |
| 资源泄漏 | ✅ | 使用 context manager |

### 总体评估

**✅ Bug风险低**

未发现高危或中危 Bug，仅有 2 个低优先级边界问题，且已被现有代码防护。
