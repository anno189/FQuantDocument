# Tdx Adapter 性能审计报告

**审计时间**: 2026-03-31
**审计路径**: `FQDataSource/adapters/tdx/`
**审计结果**: ⭐⭐⭐⭐⭐ 性能优秀

---

## 一、API 调用优化

### 1.1 分页策略 ✅

| 市场 | 每页大小 | 最大数据量 | 实现文件 |
|------|----------|------------|----------|
| 股票/指数/期货/债券 | 800条/页 | 208,000条 | stock.py, index.py, bond.py, future.py |
| 分钟线 | 800条/页 | - | 各适配器 |
| 历史分笔 | 2000条/页 | 42,000条/天 | transaction.py |

**实现代码**:
```python
# 股票日线分页获取
for i in range(int(lens / 800) + 1):
    data.append(api.to_df(api.get_security_bars(..., (int(lens / 800) - i) * 800, 800)))
```

### 1.2 缓存策略 ✅

| 缓存类型 | TTL | 实现位置 |
|----------|-----|----------|
| IP列表缓存 | 86400秒 (1天) | ip_selector.py |
| 扩展市场列表 | 86400秒 (1天) | extension.py, future.py |

**实现代码**:
```python
# IP列表缓存
cache_key = f"tdx_ip_list_{type_}"
results = cache.get(cache_key)
if results is not None:
    return results
# 缓存未命中，重新获取
cache.set(cache_key, results, ttl=cache_age)
```

---

## 二、重试机制 ✅

### 2.1 重试配置

| 参数 | 值 | 说明 |
|------|-----|------|
| max_attempts | 3 | 最大重试次数 |
| wait_random_min | 50ms | 最小等待时间 |
| wait_random_max | 100ms | 最大等待时间 |

**实现**:
```python
@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
def get_stock_day(self, code, start, end, frequence="day"):
    ...
```

---

## 三、并发处理 ✅

### 3.1 多进程 Ping IP

**位置**: `ip_selector.py`

```python
def TDX_get_ip_list_by_multi_process_ping(ip_list: List[Dict]) -> List[Dict]:
    """多进程Ping获取最优IP"""
    with Pool(processes=multiprocessing.cpu_count()) as pool:
        results = pool.map(_ping_ip, ip_list)
```

**评估**: ✅ 使用多进程并行测速，提高IP选择效率

---

## 四、数据处理优化 ✅

### 4.1 DataFrame 操作优化

| 优化项 | 实现 | 评估 |
|--------|------|------|
| 链式赋值 | `.assign().assign()` | ✅ 避免中间变量 |
| 就地操作 | `inplace=False` | ✅ 返回新DataFrame |
| 批量拼接 | `pd.concat([...], axis=0)` | ✅ 高效合并 |

### 4.2 日期处理优化

| 优化项 | 实现 | 评估 |
|--------|------|------|
| 向量化操作 | `pd.to_datetime()` | ✅ 高效日期转换 |
| 时间戳计算 | `util_date_stamp()` | ✅ 批量计算 |

---

## 五、性能评估矩阵

| 模块 | API分页 | 缓存 | 重试 | 并发 | 总体评分 |
|------|---------|------|------|------|----------|
| stock.py | ✅ 800/页 | ❌ | ✅ 3次 | N/A | ⭐⭐⭐⭐⭐ |
| index.py | ✅ 800/页 | ❌ | ✅ 3次 | N/A | ⭐⭐⭐⭐⭐ |
| bond.py | ✅ 800/页 | ❌ | ✅ 3次 | N/A | ⭐⭐⭐⭐⭐ |
| future.py | ✅ 800/页 | ✅ 86400s | ✅ 3次 | N/A | ⭐⭐⭐⭐⭐ |
| hkstock.py | ✅ 800/页 | ❌ | ✅ 3次 | N/A | ⭐⭐⭐⭐⭐ |
| option.py | ✅ 800/页 | ❌ | ✅ 3次 | N/A | ⭐⭐⭐⭐⭐ |
| extension.py | - | ✅ 86400s | ✅ 3次 | N/A | ⭐⭐⭐⭐⭐ |
| macro.py | ✅ 800/页 | ❌ | ✅ 3次 | N/A | ⭐⭐⭐⭐⭐ |
| exchange.py | ✅ 800/页 | ❌ | ✅ 3次 | N/A | ⭐⭐⭐⭐⭐ |
| realtime.py | - | ❌ | ✅ 3次 | N/A | ⭐⭐⭐⭐ |
| transaction.py | ✅ 2000/页 | ❌ | ✅ 3次 | N/A | ⭐⭐⭐⭐⭐ |
| ip_selector.py | - | ✅ 86400s | ❌ | ✅ 多进程 | ⭐⭐⭐⭐⭐ |

---

## 六、发现的性能问题

### 6.1 IP Ping 重复调用 ⚠️

**位置**: `ip_selector.py:38-41`

```python
res = api.get_security_list(0, 1)
if res is not None:
    if len(api.get_security_list(0, 1)) > 800:  # ← 重复调用
        return datetime.now() - __time1
```

**影响**: 每次Ping多浪费1次API调用
**修复建议**:
```python
res = api.get_security_list(0, 1)
if res is not None:
    if len(res) > 800:  # ← 使用缓存的结果
        return datetime.now() - __time1
```

---

## 七、审计结论

| 检查项 | 状态 | 说明 |
|--------|------|------|
| API分页 | ✅ | 800条/页，避免超限 |
| 缓存机制 | ✅ | IP列表和扩展市场缓存86400秒 |
| 重试机制 | ✅ | 3次重试，随机等待 |
| 并发处理 | ✅ | 多进程Ping IP |
| DataFrame优化 | ✅ | 链式操作，向量化处理 |

### 总体评估

**⭐⭐⭐⭐⭐ 性能优秀**

所有数据获取方法都使用了分页策略，避免单次请求数据量过大；
IP管理和扩展市场列表使用缓存减少重复请求；
重试机制提高网络不稳定时的成功率；
多进程并发测速提高IP选择效率。

---

## 八、优化建议

| 优先级 | 建议 | 影响 |
|--------|------|------|
| 低 | 修复IP Ping重复调用 | 减少1次/次API调用 |
| 低 | 考虑为股票列表添加缓存 | 减少重复请求 |
| 低 | 考虑为板块数据添加缓存 | 减少重复请求 |
