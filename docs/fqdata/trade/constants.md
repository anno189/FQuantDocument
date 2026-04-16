---
title: constants - 交易常量定义
description: 包含订单方向、交易所、订单状态等交易相关常量定义
tag:
  - fqdata
  - trade
  - constants

summary:
  type: utility
  complexity: minimal
  maturity: stable
  classes:
    - name: ORDER_DIRECTION
      description: 订单方向常量（买入、卖出、开仓、平仓等）
    - name: TIME_CONDITION
      description: 订单时间条件（IOC、GFD、GTD等）
    - name: VOLUME_CONDITION
      description: 订单成交量条件（任意、最小、全部）
    - name: EXCHANGE_ID
      description: 交易所代码常量
    - name: OFFSET
      description: 订单开平标志
    - name: ORDER_MODEL
      description: 订单类型（限价、市价等）
    - name: ORDER_STATUS
      description: 订单状态
    - name: MARKET_TYPE
      description: 市场类型（A股、期货、期权等）
    - name: FREQUENCE
      description: K线频率常量
    - name: EVENT_TYPE
      description: 事件类型常量
  global_variables:
    - name: DATABASE_TABLE
      description: 市场类型和频率对应的数据库表名映射
    - name: defaultDayTicks
      description: 各交易所每日Ticks数默认配置
    - name: defaultSType
      description: 默认证券类型映射
    - name: defaultGrade
      description: 默认评级配置
  features:
    is_pure_data: true
    is_thread_safe: true
    has_no_side_effect: true
  usage_scenarios:
    - "场景1：定义交易订单的方向、类型、状态"
    - "场景2：指定交易所和市场类型"
    - "场景3：配置K线频率和时间条件"
  warnings:
    - "警告1：常量值一旦定义不应随意修改，可能导致数据不一致"
    - "警告2：部分常量值与外部系统对接时需要确认格式一致性"
  limitations:
    - "限制1：常量类不支持动态扩展，如需新增需修改源代码"
    - "限制2：不提供运行时验证，使用方需自行保证值域正确"

relationships:
  belongs_to:
    - fquant.fqdata.trade
  used_by:
    - fquant.fqdata
    - fquant.fqalgorithm

api:
  signatures:
    ORDER_DIRECTION:
      attributes: "BUY, SELL, BUY_OPEN, BUY_CLOSE, SELL_OPEN, SELL_CLOSE, SELL_CLOSETODAY, BUY_CLOSETODAY, ASK, XDXR, OTHER"
      type: class
    TIME_CONDITION:
      attributes: "IOC, GFS, GFD, GTD, GTC, GFA"
      type: class
    EXCHANGE_ID:
      attributes: "SSE, SZSE, SHFE, DCE, CZCE, CFFEX, INE, HUOBI, BINANCE, BITMEX, BITFINEX, OKEX"
      type: class
    MARKET_TYPE:
      attributes: "STOCK_CN, STOCK_CN_B, STOCK_CN_D, STOCK_HK, STOCK_US, FUTURE_CN, OPTION_CN, STOCKOPTION_CN, INDEX_CN, FUND_CN, BOND_CN"
      type: class
    FREQUENCE:
      attributes: "YEAR, QUARTER, MONTH, WEEK, DAY, ONE_MIN, FIVE_MIN, FIFTEEN_MIN, THIRTY_MIN, HOUR, SIXTY_MIN, TICK, ASKBID, REALTIME_MIN, LATEST"
      type: class
  examples:
    ORDER_DIRECTION: |
      from FQData.Trade.constants import ORDER_DIRECTION
      direction = ORDER_DIRECTION.BUY  # 买入
    EXCHANGE_ID: |
      from FQData.Trade.constants import EXCHANGE_ID
      exchange = EXCHANGE_ID.SSE  # 上海证券交易所
    MARKET_TYPE: |
      from FQData.Trade.constants import MARKET_TYPE
      market = MARKET_TYPE.STOCK_CN  # A股市场

usage:
  quick_example: |
    from FQData.Trade.constants import ORDER_DIRECTION, MARKET_TYPE, FREQUENCE
    
    # 订单方向
    direction = ORDER_DIRECTION.BUY_OPEN
    
    # 市场类型
    market = MARKET_TYPE.STOCK_CN
    
    # K线频率
    freq = FREQUENCE.DAY
---

# constants 交易常量定义

## 一句话总览

📌 **交易相关常量定义，包含订单方向、交易所、市场类型等**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 定义交易订单的方向、类型、状态
- 指定交易所和市场类型
- 配置K线频率和时间条件

❌ **不应该使用**：
- 需要运行时验证常量值合法性
- 需要动态扩展常量集合

### 注意事项

1. **常量值一旦定义不应随意修改**
   - ❌ 错误做法：直接修改常量类中的值
   - ✅ 正确做法：新增常量而非修改现有值

2. **外部系统对接时需确认格式**
   - 不同交易所的常量值格式可能不同
   - 对接前需确认常量值的一致性

### 已知限制

- 常量类不支持动态扩展，如需新增需修改源代码
- 不提供运行时验证，使用方需自行保证值域正确

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | FQBase | 基础模块 |

**TL;DR**：
- 核心能力：订单常量、交易所常量、市场类型常量、频率常量
- 入门难度：🟢 简单
- 依赖：无外部依赖

## 快速开始

```python
from FQData.Trade.constants import ORDER_DIRECTION, MARKET_TYPE, FREQUENCE

# 订单方向
direction = ORDER_DIRECTION.BUY_OPEN

# 市场类型
market = MARKET_TYPE.STOCK_CN

# K线频率
freq = FREQUENCE.DAY
```

## 常量类列表

### ORDER_DIRECTION 订单方向

```python
from FQData.Trade.constants import ORDER_DIRECTION

ORDER_DIRECTION.BUY          # 买入
ORDER_DIRECTION.SELL         # 卖出
ORDER_DIRECTION.BUY_OPEN     # 买入开仓
ORDER_DIRECTION.BUY_CLOSE    # 买入平仓
ORDER_DIRECTION.SELL_OPEN    # 卖出开仓
ORDER_DIRECTION.SELL_CLOSE   # 卖出平仓
ORDER_DIRECTION.SELL_CLOSETODAY  # 卖出平今
ORDER_DIRECTION.BUY_CLOSETODAY   # 买入平今
ORDER_DIRECTION.ASK          # 询价
ORDER_DIRECTION.XDXR         # 除权除息
ORDER_DIRECTION.OTHER        # 其他
```

### TIME_CONDITION 订单时间条件

```python
from FQData.Trade.constants import TIME_CONDITION

TIME_CONDITION.IOC   # 即时成交 (Immediate Or Cancel)
TIME_CONDITION.GFS   # 当日有效 (Good For Session)
TIME_CONDITION.GFD   # 当日有效 (Good For Day)
TIME_CONDITION.GTD   # 指定日期前有效 (Good Till Date)
TIME_CONDITION.GTC   # 取消前有效 (Good Till Cancelled)
TIME_CONDITION.GFA   # 成交前有效 (Good For Auction)
```

### EXCHANGE_ID 交易所代码

```python
from FQData.Trade.constants import EXCHANGE_ID

EXCHANGE_ID.SSE       # 上海证券交易所
EXCHANGE_ID.SZSE     # 深圳证券交易所
EXCHANGE_ID.SHFE     # 上海期货交易所
EXCHANGE_ID.DCE      # 大连商品交易所
EXCHANGE_ID.CZCE     # 郑州商品交易所
EXCHANGE_ID.CFFEX    # 中国金融期货交易所
EXCHANGE_ID.INE      # 上海国际能源交易中心
EXCHANGE_ID.HUOBI    # 火币交易所
EXCHANGE_ID.BINANCE  # 币安交易所
```

### MARKET_TYPE 市场类型

```python
from FQData.Trade.constants import MARKET_TYPE

MARKET_TYPE.STOCK_CN       # A股（沪深）
MARKET_TYPE.STOCK_CN_B     # B股（沪深）
MARKET_TYPE.STOCK_CN_D     # 沪市ETF
MARKET_TYPE.STOCK_HK       # 港股
MARKET_TYPE.STOCK_US       # 美股
MARKET_TYPE.FUTURE_CN     # 国内期货
MARKET_TYPE.OPTION_CN     # 国内期权
MARKET_TYPE.STOCKOPTION_CN # 股票期权
MARKET_TYPE.INDEX_CN      # A股指数
MARKET_TYPE.FUND_CN       # 场内基金
MARKET_TYPE.BOND_CN       # 债券
```

### FREQUENCE K线频率

```python
from FQData.Trade.constants import FREQUENCE

FREQUENCE.YEAR         # 年线
FREQUENCE.QUARTER      # 季线
FREQUENCE.MONTH        # 月线
FREQUENCE.WEEK         # 周线
FREQUENCE.DAY          # 日线
FREQUENCE.ONE_MIN      # 1分钟
FREQUENCE.FIVE_MIN     # 5分钟
FREQUENCE.FIFTEEN_MIN  # 15分钟
FREQUENCE.THIRTY_MIN   # 30分钟
FREQUENCE.HOUR         # 60分钟（1小时）
FREQUENCE.SIXTY_MIN    # 60分钟
FREQUENCE.TICK         # Tick数据
FREQUENCE.ASKBID       # 买卖盘数据
FREQUENCE.REALTIME_MIN # 实时分钟
FREQUENCE.LATEST       # 最新
```

## 全局变量

### DATABASE_TABLE

```python
from FQData.Trade.constants import DATABASE_TABLE

# 市场类型和频率对应的数据库表名映射
DATABASE_TABLE[(MARKET_TYPE.STOCK_CN, FREQUENCE.DAY)]  # 'stock_day'
DATABASE_TABLE[(MARKET_TYPE.STOCK_CN, FREQUENCE.ONE_MIN)]  # 'stock_min'
```

### defaultDayTicks

```python
from FQData.Trade.constants import defaultDayTicks

# 各交易所每日Ticks数默认配置
defaultDayTicks['HSI']  # 330
defaultDayTicks.default_factory()  # 240（默认）
```

## 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| 导入错误 | 模块路径不正确 | 使用 `from FQData.Trade.constants import ...` |
| 值不匹配 | 与外部系统格式不一致 | 对接前确认常量值格式 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本，包含交易常量定义 |
