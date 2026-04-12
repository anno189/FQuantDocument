# Fetcher.py 迁移审计报告

**源文件**: `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QAFetch/Fetcher.py`
**目标文件**: `FQData/FQData/fetch/fetcher.py`
**审计时间**: 2026-03-28
**状态**: ✅ 100% 迁移完成

---

## 一、迁移总览

| 组件 | 原始名称 | 目标名称 | 状态 |
|------|----------|----------|------|
| 数据获取器 | `QA_Fetcher` | `Fetcher` | ✅ |
| Tick获取 | `QA_get_tick` | `get_tick` | ✅ |
| 实时行情 | `QA_get_realtime` | `get_realtime` | ✅ |
| 高级K线 | `QA_quotation_adv` | `quotation_adv` | ✅ |
| 基础K线 | `QA_quotation` | `quotation` | ✅ |
| 异步获取器 | `AsyncFetcher` | `AsyncFetcher` | ✅ |

---

## 二、组件对比

| # | 原始组件 | 目标组件 | 一致性 |
|---|----------|----------|--------|
| 1 | `QA_Fetcher` | `Fetcher` | ✅ |
| 2 | `QA_get_tick` | `get_tick` | ✅ |
| 3 | `QA_get_realtime` | `get_realtime` | ✅ |
| 4 | `QA_quotation_adv` | `quotation_adv` | ✅ |
| 5 | `QA_quotation` | `quotation` | ✅ |
| 6 | `AsyncFetcher` | `AsyncFetcher` | ✅ |

**组件一致性**: 6/6 = **100%**

---

## 三、类结构对比

### 3.1 `Fetcher` vs `Fetcher`

| 项目 | 原始 | 迁移后 |
|------|------|--------|
| 类名 | `QA_Fetcher` | `Fetcher` |
| `__init__` | `uri, username, password` | `uri` |
| 方法 | `change_ip`, `get_quotation` | `change_uri`, `get_quotation` |

**差异**: 简化了参数 (移除了未使用的username/password)

### 3.2 `AsyncFetcher` vs `AsyncFetcher`

| 项目 | 原始 | 迁移后 |
|------|------|--------|
| 类名 | `AsyncFetcher` | `AsyncFetcher` |
| `__init__` | `pass` | `pass` |
| 方法 | `get_quotation` (async) | `get_quotation` (async) |

---

## 四、函数签名对比

| 函数 | 原始签名 | 目标签名 | 一致性 |
|------|----------|----------|-------- |
| `get_tick` | `(code, start, end, market)` | `(code, start, end, market)` | ✅ |
| `get_realtime` | `(code, market)` | `(code, market)` | ✅ |
| `quotation_adv` | `(code, start, end, frequence, market, source, output)` | `(code, start, end, frequence, market, source, output)` | ✅ |
| `quotation` | `(code, start, end, frequence, market, source, output)` | `(code, start, end, frequence, market, source, output)` | ✅ |

**函数签名一致性**: 4/4 = **100%**

---

## 五、架构改进

| 项目 | 原始设计 | 迁移后设计 |
|------|----------|------------|
| 数据源 | `QATdx`, `QAQueryAdv` | `TDX_fetch_*`, `fetch_*_adv` |
| 数据结构 | `QA_DataStruct_*` | `FQBase.FQDataStruct.*` |
| 参数枚举 | `FQParameter` | `FQBase.FQConfig.constants` |
| 数据库连接 | `QA_util_sql_mongo_setting` | `MongoConnection` |
| 时间工具 | `save_tdx.now_time()` | `datetime.datetime.now()` |

---

## 六、核心逻辑验证

| 验证项 | 状态 |
|--------|------|
| 数据源切换 (AUTO/MONGO/TDX) | ✅ |
| 市场类型支持 (STOCK/FUTURE/INDEX/OPTION) | ✅ |
| 频率支持 (DAY/WEEK/1min/5min/15min/30min/60min) | ✅ |
| 输出格式 (DATAFRAME/DATASTRUCT/NDARRAY/JSON/LIST) | ✅ |
| 自动补全逻辑 | ✅ |

---

## 七、审计结论

| 项目 | 结果 |
|------|------|
| **组件一致性** | **100%** (6/6) |
| **函数签名一致性** | **100%** (4/4) |
| **核心逻辑一致性** | ✅ 完全一致 |
| **语法验证** | ✅ 通过 |

### 导出清单

```python
from FQData.fetch.fetcher import (
    Fetcher,           # 同步数据获取器
    AsyncFetcher,      # 异步数据获取器
    get_tick,         # 统一tick获取
    get_realtime,     # 统一实时行情获取
    quotation_adv,     # 高级K线获取
    quotation,         # 基础K线获取
)
```

### 使用示例

```python
from FQData.fetch.fetcher import Fetcher, quotation_adv
from FQBase.FQConfig.constants import MARKET_TYPE, DATASOURCE

# 使用Fetcher类
fetcher = Fetcher()
data = fetcher.get_quotation('000001', '2020-01-01', '2020-02-01', 'day',
                              MARKET_TYPE.STOCK_CN, DATASOURCE.TDX)

# 使用quotation_adv函数
data = quotation_adv('000001', '2020-01-01', '2020-02-01', 'day',
                      market=MARKET_TYPE.STOCK_CN, source=DATASOURCE.AUTO)
```
