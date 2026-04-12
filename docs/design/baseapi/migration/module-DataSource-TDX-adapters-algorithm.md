# DataSource TDX适配器模块迁移算法一致性审计报告

**审计时间**: 2026-04-04
**审计结果**: ✅ 算法一致性通过
**迁移率**: 100%

---

## 1. 审计范围

| 目标文件 | 源文件 | 状态 |
|----------|--------|------|
| `base.py` | `QATdx.py` (基础适配器) | ✅ 一致 |
| `stock.py` | `QATdx.py` (股票数据) | ✅ 一致 |
| `index.py` | `QATdx.py` (指数数据) | ✅ 一致 |
| `bond.py` | `QATdx.py` (债券数据) | ✅ 一致 |
| `future.py` | `QATdx.py` (期货数据) | ✅ 一致 |
| `hkstock.py` | `QATdx.py` (港股数据) | ✅ 一致 |
| `realtime.py` | `QATdx.py` (实时行情) | ✅ 一致 |
| `transaction.py` | `QATdx.py` (分笔数据) | ✅ 一致 |
| `option.py` | `QATdx.py` (期权数据) | ✅ 一致 |
| `exchange.py` | `QATdx.py` (汇率数据) | ✅ 一致 |
| `macro.py` | `QATdx.py` (宏观数据) | ✅ 一致 |
| `extension.py` | `QATdx.py` (扩展市场) | ✅ 一致 |
| `tools.py` | `QATdx.py` (工具函数) | ✅ 一致 |
| `ip_selector.py` | `QATdx.py` (IP选择) | ✅ 一致 |
| `financial.py` | `QAfinancial.py` | ✅ 一致 |

---

## 2. 源目标映射关系

### 2.1 源文件
- `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QAFetch/QATdx.py` (主源文件)
- `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QAFetch/QAfinancial.py` (财务数据)
- `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQBase/FQBase/FQDataSource/tdx_adapter.py` (旧适配器)

### 2.2 目标文件
- `/Users/A.D.189/FQuant/FQuant.Server/FQData/FQData/DataSource/adapters/tdx/*.py`

---

## 3. 核心算法一致性验证

### 3.1 IP选择器算法 (ip_selector.py)

| 检查项 | 源算法 | 目标算法 | 一致性 |
|--------|--------|----------|--------|
| Ping测试超时 | 0.7秒 | 0.7秒 | ✅ |
| IP缓存时间 | 86400秒 | 86400秒 | ✅ |
| 主板市场验证 | 获取800+股票 | 获取800+股票 | ✅ |
| 期货市场验证 | 20000+品种 | 20000+品种 | ✅ |
| 多进程ping | Parallelism | ParallelProcess | ✅ |
| 缓存key格式 | `tdx_ip_list_{type}` | `tdx_ip_list_{type}` | ✅ |

### 3.2 股票日线算法 (stock.py - get_stock_day)

| 检查项 | 源算法 | 目标算法 | 一致性 |
|--------|--------|----------|--------|
| 频率category映射 | 9/day, 5/week, 6/month | 9/day, 5/week, 6/month | ✅ |
| 分页大小 | 800条/页 | 800条/页 | ✅ |
| 市场代码 | 0(深圳), 1(上海) | 0(深圳), 1(上海) | ✅ |
| 空数据过滤 | `data['open'] != 0` | `data['open'] != 0` | ✅ |
| 日期范围 | `[start_date:end_date]` | `[start_date:end_date]` | ✅ |
| datetime转换 | `utc=False` | `utc=False` | ✅ |

### 3.3 股票分钟线算法 (stock.py - get_stock_min)

| 检查项 | 源算法 | 目标算法 | 一致性 |
|--------|--------|----------|--------|
| 1min倍数 | 240倍 | 240倍 | ✅ |
| 5min倍数 | 48倍 | 48倍 | ✅ |
| 15min倍数 | 16倍 | 16倍 | ✅ |
| 30min倍数 | 8倍 | 8倍 | ✅ |
| 60min倍数 | 4倍 | 4倍 | ✅ |
| 最大数据量 | 20800 | 20800 | ✅ |
| 时间格式 | `%Y-%m-%d %H:%M:%S` | `%Y-%m-%d %H:%M:%S` | ✅ |

### 3.4 指数日线算法 (index.py)

| 检查项 | 源算法 | 目标算法 | 一致性 |
|--------|--------|----------|--------|
| 899050特殊处理 | market=2 | market=2 | ✅ |
| ETF使用 | get_security_bars | get_security_bars | ✅ |
| 非ETF使用 | get_index_bars | get_index_bars | ✅ |
| 市场代码判断 | `['0','8','9','5']` | `['0','8','9','5']` | ✅ |

### 3.5 期货数据算法 (future.py)

| 检查项 | 源算法 | 目标算法 | 一致性 |
|--------|--------|----------|--------|
| 分页大小 | 700条/页 | 700条/页 | ✅ |
| category默认 | 6 (除899050为5) | 6 (除899050为5) | ✅ |
| 分钟倍数 | 2.5倍 | 2.5倍 | ✅ |
| datetime处理 | `utc=False` | `utc=False` | ✅ |

### 3.6 实时行情算法 (realtime.py)

| 检查项 | 源算法 | 目标算法 | 一致性 |
|--------|--------|----------|--------|
| 批量大小 | 80个/批 | 80个/批 | ✅ |
| 债券价格除以 | 10 | 10 | ✅ |
| reversed_bytes0 | servertime | servertime | ✅ |
| 字段选择 | 34字段 | 34字段 | ✅ |

### 3.7 分笔数据算法 (transaction.py)

| 检查项 | 源算法 | 目标算法 | 一致性 |
|--------|--------|----------|--------|
| batch_size | 2000 | 2000 | ✅ |
| max_offset | 21 | 21 | ✅ |
| 最大记录数 | 42000 | 42000 | ✅ |
| 倒序获取 | 是 | 是 | ✅ |

### 3.8 除权除息算法 (stock.py - get_stock_xdxr)

| 检查项 | 源算法 | 目标算法 | 一致性 |
|--------|--------|----------|--------|
| category过滤 | `< 15` | `< 15` | ✅ |
| 列重命名 | panhouliutong→liquidity_after | ✅ | ✅ |
| 列重命名 | panqianliutong→liquidity_before | ✅ | ✅ |
| 列重命名 | houzongguben→shares_after | ✅ | ✅ |
| 列重命名 | qianzongguben→shares_before | ✅ | ✅ |

### 3.9 扩展市场列表算法 (extension.py)

| 检查项 | 源算法 | 目标算法 | 一致性 |
|--------|--------|----------|--------|
| 缓存key | `extension_market_list` | `extension_market_list` | ✅ |
| 缓存TTL | 86400秒 | 86400秒 | ✅ |
| 每批数量 | 500 | 500 | ✅ |
| category过滤 | `> 0` | `> 0` | ✅ |

### 3.10 财务数据解析算法 (financial.py)

| 检查项 | 源算法 | 目标算法 | 一致性 |
|--------|--------|----------|--------|
| MD5下载验证 | 是 | 是 | ✅ |
| 文件解析 | HistoryFinancialReader | HistoryFinancialReader | ✅ |
| 列名前缀 | `00{}`格式 | `00{}`格式 | ✅ |

---

## 4. 代码模式对照

### 4.1 pytdx连接模式

**源算法:**
```python
api = TdxHq_API()
with api.connect(ip, port, time_out=0.7):
    data = api.to_df(api.get_security_bars(...))
```

**目标算法:**
```python
api = TdxHq_API()
with api.connect(ip, port, time_out=self._timeout):
    data = api.to_df(api.get_security_bars(...))
```

✅ 一致 (timeout参数化)

### 4.2 重试装饰器

**源算法:**
```python
@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
def QA_fetch_get_stock_day(...)
```

**目标算法:**
```python
@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
def get_stock_day(...)
```

✅ 一致

### 4.3 数据拼接模式

**源算法:**
```python
data = pd.concat([api.to_df(
    api.get_security_bars(category, market, code, (int(lens / 800) - i) * 800, 800))
    for i in range(int(lens / 800) + 1)], axis=0, sort=False)
```

**目标算法:**
```python
data = pd.concat([api.to_df(
    api.get_security_bars(category, market, code, (int(lens / 800) - i) * 800, 800))
    for i in range(int(lens / 800) + 1)], axis=0, sort=False)
```

✅ 一致

---

## 5. 架构改进说明

### 5.1 类结构优化
- **旧架构**: 函数式模块 (`QATdx.py` 包含60+个全局函数)
- **新架构**: 类适配器模式 (每个数据类一个适配器)

### 5.2 接口统一
- **旧架构**: 直接调用pytdx
- **新架构**: 通过 `DataSourceAdapter` 接口统一抽象

### 5.3 IP管理优化
- **旧架构**: 全局变量 `best_ip`
- **新架构**: 单例模式 `TdxIPSelector` 类

### 5.4 异常处理
- **旧架构**: 打印异常后返回
- **新架构**: 抛出特定异常 (`DataSourceConnectionError`, `DataSourceAPIError`)

---

## 6. 总结

| 指标 | 数值 |
|------|------|
| 审计模块数 | 15 |
| 算法一致模块 | 15 |
| 迁移率 | 100% |
| 核心算法一致性 | 100% |

**审计结论**: 所有DataSource TDX适配器模块的算法实现与源文件保持完全一致，符合"算法完全一致"的要求。

---

## 7. 后续建议

1. 建议添加单元测试验证各适配器功能
2. 建议添加集成测试验证整体数据流
3. 建议添加性能基准测试确保优化不损害性能