---
title: FQConfig/constants.py 迁移报告
---

# FQConfig/constants.py 迁移报告

本文档记录 `QUANTAXIS.QAUtil.QAParameter` 到 `FQBase.FQConfig.constants` 的迁移差异分析。

## 文档链接

| 文件 | 路径 |
|------|------|
| 原文件 | [QAParameter.py](file:///Users/A.D.189/FQuant/FQuant.Server/_bak/QUANTAXIS/QAUtil/QAParameter.py) (备份) |
| 迁移后 | [constants.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/FQConfig/constants.py) (FQBase) |

---

## 迁移概览

| 对比项 | 原文件 | 迁移后 |
|--------|--------|--------|
| **模块路径** | `QUANTAXIS.QAUtil.QAParameter` | `FQBase.FQConfig.constants` |
| **类数量** | 24 个类 | 16 个类 |
| **常量类保留** | - | 14 个完全保留 |
| **常量类移除** | - | 9 个事件类 |
| **新增常量** | - | 多个实用常量 |

---

## 类/常量对比总表

| 原类/常量 | 迁移后 | 状态 | 说明 |
|-----------|--------|------|------|
| `ORDER_DIRECTION` | `ORDER_DIRECTION` | ✅ 一致 | 订单买卖方向 |
| `TIME_CONDITION` | `TIME_CONDITION` | ✅ 一致 | 时间条件 |
| `VOLUME_CONDITION` | `VOLUME_CONDITION` | ✅ 一致 | 数量条件 |
| `EXCHANGE_ID` | `EXCHANGE_ID` | ✅ 一致 | 交易所 ID |
| `OFFSET` | `OFFSET` | ✅ 一致 | 开平仓属性 |
| `ORDER_MODEL` | `ORDER_MODEL` | ✅ 一致 | 订单模式 |
| `ORDER_STATUS` | `ORDER_STATUS` | ✅ 一致 | 订单状态 |
| `AMOUNT_MODEL` | `AMOUNT_MODEL` | ✅ 一致 | 成交量模式 |
| `RUNNING_ENVIRONMENT` | `RUNNING_ENVIRONMENT` | ✅ 一致 | 运行环境 |
| `TRADE_STATUS` | ❌ | ❌ 移除 | 交易状态常量 |
| `MARKET_ERROR` | ❌ | ❌ 移除 | 市场错误常量 |
| `MARKET_TYPE` | `MARKET_TYPE` | ✅ 一致 | 市场类型 |
| `BROKER_TYPE` | ❌ | ❌ 移除 | Broker 类型 |
| `EVENT_TYPE` | ❌ | ❌ 移除 | 事件类型 |
| `MARKET_EVENT` | ❌ | ❌ 移除 | 市场事件 |
| `ENGINE_EVENT` | ❌ | ❌ 移除 | 引擎事件 |
| `ACCOUNT_EVENT` | ❌ | ❌ 移除 | 账户事件 |
| `BROKER_EVENT` | ❌ | ❌ 移除 | Broker 事件 |
| `ORDER_EVENT` | ❌ | ❌ 移除 | 订单事件 |
| `FREQUENCE` | `FREQUENCE` | ✅ 一致 | 频率常量 |
| `CURRENCY_TYPE` | `CURRENCY_TYPE` | ✅ 一致 | 货币类型 |
| `DATASOURCE` | `DATASOURCE` | ⚠️ 精简 | 仅保留核心数据源 |
| `OUTPUT_FORMAT` | `OUTPUT_FORMAT` | ✅ 一致 | 输出格式 |
| `RUNNING_STATUS` | `RUNNING_STATUS` | ✅ 一致 | 运行状态 |
| `DATABASE_TABLE` | `DATABASE_TABLE` | ⚠️ 精简 | 简化了表映射 |

---

## 详细对比

### ✅ 完全保留的常量类

以下 14 个常量类完全保留，功能完全一致：

| 类名 | 常量数量 | 说明 |
|------|----------|------|
| `ORDER_DIRECTION` | 10 个 | BUY=1, SELL=-1, BUY_OPEN=2, etc. |
| `TIME_CONDITION` | 6 个 | IOC, GFS, GFD, GTD, GTC, GFA |
| `VOLUME_CONDITION` | 3 个 | ANY, MIN, ALL |
| `EXCHANGE_ID` | 12 个 | SSE, SZSE, SHFE, DCE, CZCE, CFFEX, INE, etc. |
| `OFFSET` | 4 个 | OPEN, CLOSE, CLOSETODAY, REVERSE |
| `ORDER_MODEL` | 8 个 | LIMIT, ANY, MARKET, CLOSE, NEXT_OPEN, STRICT, BEST, FIVELEVEL |
| `ORDER_STATUS` | 10 个 | NEW, SUCCESS_ALL, SUCCESS_PART, QUEUED, CANCEL_ALL, etc. |
| `AMOUNT_MODEL` | 2 个 | BY_MONEY, BY_AMOUNT |
| `RUNNING_ENVIRONMENT` | 6 个 | BACKETEST, SIMULATION, TZERO, REAL, RANDOM, TTS |
| `MARKET_TYPE` | 13 个 | STOCK_CN, FUTURE_CN, INDEX_CN, FUND_CN, etc. |
| `FREQUENCE` | 14 个 | YEAR, QUARTER, MONTH, WEEK, DAY, ONE_MIN, FIVE_MIN, etc. |
| `CURRENCY_TYPE` | 10 个 | RMB, USD, EUR, HKD, GBP, BTC, JPY, etc. |
| `OUTPUT_FORMAT` | 6 个 | DATASTRUCT, DATAFRAME, SERIES, NDARRAY, LIST, JSON |
| `RUNNING_STATUS` | 6 个 | PENDING=100, SUCCESS=200, RUNNING=300, etc. |

---

### ⚠️ DATASOURCE 精简

```python
# 原实现 - 12 个数据源
DATASOURCE = {
    'wind', 'tdb', 'ths', 'tushare', 'tdx', 'mongo',
    'eastmoney', 'choice', 'ccxt', 'localfile', 'auto'
}

# 新实现 - 4 个核心数据源
class DATASOURCE:
    TDX = 'tdx'
    MONGO = 'mongo'
    LOCALFILE = 'localfile'
    AUTO = 'auto'
```

| 数据源 | 原 | 新 |
|--------|----|----|
| Wind | ✅ | ❌ 移除 |
| TDB | ✅ | ❌ 移除 |
| THS (同花顺) | ✅ | ❌ 移除 |
| Tushare | ✅ | ❌ 移除 |
| TDX (通达信) | ✅ | ✅ 保留 |
| MongoDB | ✅ | ✅ 保留 |
| EastMoney (东方财富) | ✅ | ❌ 移除 |
| Choice | ✅ | ❌ 移除 |
| CCXT | ✅ | ❌ 移除 |
| LocalFile | ✅ | ✅ 保留 |
| Auto | ✅ | ✅ 保留 |

---

### ⚠️ DATABASE_TABLE 精简

```python
# 原实现 - 详细表映射 (21 条)
DATABASE_TABLE = {
    (MARKET_TYPE.STOCK_CN, FREQUENCE.DAY): 'stock_day',
    (MARKET_TYPE.STOCK_CN, FREQUENCE.ONE_MIN): 'stock_min',
    (MARKET_TYPE.STOCK_CN, FREQUENCE.FIVE_MIN): 'stock_min',
    (MARKET_TYPE.STOCK_CN, FREQUENCE.FIFTEEN_MIN): 'stock_min',
    (MARKET_TYPE.STOCK_CN, FREQUENCE.THIRTY_MIN): 'stock_min',
    (MARKET_TYPE.STOCK_CN, FREQUENCE.SIXTY_MIN): 'stock_min',
    (MARKET_TYPE.STOCK_CN, FREQUENCE.HOUR): 'stock_min',
    (MARKET_TYPE.STOCK_CN, FREQUENCE.TICK): 'stock_transaction',
    (MARKET_TYPE.INDEX_CN, FREQUENCE.DAY): 'index_day',
    (MARKET_TYPE.INDEX_CN, FREQUENCE.ONE_MIN): 'index_min',
    # ... 更多重复映射
}

# 新实现 - 简化表映射 (6 条)
DATABASE_TABLE = {
    (MARKET_TYPE.STOCK_CN, FREQUENCE.DAY): 'stock_day',
    (MARKET_TYPE.STOCK_CN, FREQUENCE.ONE_MIN): 'stock_min',
    (MARKET_TYPE.INDEX_CN, FREQUENCE.DAY): 'index_day',
    (MARKET_TYPE.INDEX_CN, FREQUENCE.ONE_MIN): 'index_min',
    (MARKET_TYPE.FUTURE_CN, FREQUENCE.DAY): 'future_day',
    (MARKET_TYPE.FUTURE_CN, FREQUENCE.ONE_MIN): 'future_min',
}
```

---

### ❌ 移除的常量类

以下 9 个事件常量类已被移除，可能已迁移到独立的 `FQEvent` 模块：

| 移除的类 | 说明 |
|----------|------|
| `TRADE_STATUS` | 交易状态 (SUCCESS, PRICE_LIMIT, NO_MARKET_DATA, FAILED) |
| `MARKET_ERROR` | 市场错误 (ACCOUNT_EXIST, NETWORK_BROKERN, DATABSECONNECT_LOST, VALUE_NOT_FOUND) |
| `BROKER_TYPE` | Broker 类型 (BACKETEST, SIMULATION, REAL, RANDOM, SHIPANE, TTS) |
| `EVENT_TYPE` | 事件类型 (BROKER_EVENT, ACCOUNT_EVENT, MARKET_EVENT, TRADE_EVENT, ENGINE_EVENT, ORDER_EVENT) |
| `MARKET_EVENT` | 市场前置事件 (QUERY_ORDER, QUERY_ASSETS, QUERY_ACCOUNT, etc.) |
| `ENGINE_EVENT` | 引擎事件 (MARKET_INIT, UPCOMING_DATA, BAR_SETTLE, etc.) |
| `ACCOUNT_EVENT` | 账户事件 (UPDATE, SETTLE, MAKE_ORDER) |
| `BROKER_EVENT` | Broker 事件 (LOAD_DATA, TRADE, SETTLE, DAILY_SETTLE, etc.) |
| `ORDER_EVENT` | 订单事件 (CREATE, TRADE, CANCEL, FAIL) |

---

## 🆕 新增的常量

新版本增加了多个实用常量：

```python
# 默认日线 tick 数
defaultDayTicks = defaultdict(lambda: 240)
defaultDayTicks['HSI'] = 330

# 默认品种类型
defaultSType = defaultdict(lambda: '其他')
defaultSType['INDEX'] = '指数'
defaultSType['STOCK'] = '股票'

# 默认评级
defaultGrade = defaultdict(lambda: 0)
defaultGrade['连板'] = 56
defaultGrade['资金量'] = 300
defaultGrade['高标涨幅'] = 20
defaultGrade['封板'] = 1

# 市值相关值
defshizhiValues = [25, 30, 80, 300]

# 年度交易日
DAYOFFSET = 260

# 板块名称列表
n1name_list = ['t_', 'T0', 'T1', 'T2', '交通运输', 'AI', '医疗健康', ...]

# 指数列表
indexListM = ['000001', '399001', '399006', ...]  # 主要指数
indexListN = ['399372', '399373', ...]  # 名称指数
indexListI = ['880301', '880305', ...]  # 行业指数

# 期货指数
FutureIndex = ['IF', 'IC', 'IH', 'IM', 'T', 'TF', 'TS']

# 失效指数
lost_index = ['395000', '395005', ...]

# 独立板块
independent_block_list = ['黄金概念', '白酒概念']

# 债券股票比例
BONDRATIOSTOCK = 0.3

# 股票日历
stockCalendar = []
```

---

## 兼容性

### 使用对比

```python
# 旧代码
from QUANTAXIS.QAUtil.QAParameter import (
    ORDER_DIRECTION,
    MARKET_TYPE,
    FREQUENCE,
    DATABASE_TABLE,
)

# 新代码
from FQBase.FQConfig.constants import (
    ORDER_DIRECTION,
    MARKET_TYPE,
    FREQUENCE,
    DATABASE_TABLE,
)
```

### 重要变化

| 变化 | 说明 |
|------|------|
| `DATASOURCE` | 从 dict 变为 class，保留 TDX/MONGO/LOCALFILE/AUTO |
| `DATABASE_TABLE` | 简化表映射，减少重复 |
| 事件常量 | `TRADE_STATUS`, `MARKET_ERROR`, `EVENT_*` 等已移除 |

---

## 迁移质量评估

| 评估项 | 评分 | 说明 |
|--------|------|------|
| **功能一致性** | ⭐⭐⭐⭐ | 核心常量完全保留 |
| **代码质量** | ⭐⭐⭐⭐⭐ | 类结构更清晰 |
| **API 简化** | ⭐⭐⭐⭐ | DATASOURCE、DATABASE_TABLE 精简 |
| **兼容性** | ⭐⭐⭐⭐ | 大部分兼容，事件常量已移除 |

### 总体评价

> **迁移质量良好**，核心常量类完全保留，DATASOURCE 和 DATABASE_TABLE 进行了合理精简。移除的事件常量可能已迁移到独立的 `FQEvent` 模块。新版本还增加了多个实用常量。

---

## 关联文档

- [FQConfig 配置模块](../fqbase/config) - FQConfig 配置模块完整 API
- [constants.py 源代码](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/FQConfig/constants.py) - 迁移后源代码
- [QAParameter.py 源代码](file:///Users/A.D.189/FQuant/FQuant.Server/_bak/QUANTAXIS/QAUtil/QAParameter.py) - 原源代码
