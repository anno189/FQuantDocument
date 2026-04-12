# DataStruct realtime 模块

实时行情数据结构模块，提供股票、期货实时行情和 Tick 数据的结构定义。

## 模块结构

```
realtime.py
```

## 类层次结构

```
RealtimeBase
├── StockRealtimeData
└── FutureRealtimeData

RealtimeSeries

FutureTickData
```

---

## RealtimeBase

实时行情基类。

```python
from FQData.DataStruct.realtime import RealtimeBase
```

### 基本属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `open` | float | 开盘价 |
| `price` | float | 最新价 |
| `datetime` | str | 时间 |
| `high` | float | 最高价 |
| `low` | float | 最低价 |
| `code` | str | 证券代码 |
| `name` | str | 证券名称 |
| `last_close` | float | 前收价 |
| `cur_vol` | int | 当前成交量 |

### 买盘属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `bid1` | float | 买一价 |
| `bid_vol1` | int | 买一量 |
| `bid2` | float | 买二价 |
| `bid_vol2` | int | 买二量 |
| `bid3` | float | 买三价 |
| `bid_vol3` | int | 买三量 |
| `bid4` | float | 买四价 |
| `bid_vol4` | int | 买四量 |
| `bid5` | float | 买五价 |
| `bid_vol5` | int | 买五量 |

### 卖盘属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `ask1` | float | 卖一价 |
| `ask_vol1` | int | 卖一量 |
| `ask2` | float | 卖二价 |
| `ask_vol2` | int | 卖二量 |
| `ask3` | float | 卖三价 |
| `ask_vol3` | int | 卖三量 |
| `ask4` | float | 卖四价 |
| `ask_vol4` | int | 卖四量 |
| `ask5` | float | 卖五价 |
| `ask_vol5` | int | 卖五量 |

### 方法

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `to_dict()` | dict | 转换为字典 |

---

## StockRealtimeData

股票实时行情。

```python
from FQData.DataStruct.realtime import StockRealtimeData

stock_realtime = StockRealtimeData(data)
```

**继承自：** RealtimeBase

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `datetime_index` | DatetimeIndex | 时间索引 |
| `code_index` | Index | 代码索引 |

### 方法

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `to_dataframe()` | pd.DataFrame | 转换为 DataFrame |
| `resample(level)` | pd.DataFrame | 重采样 |

---

## FutureRealtimeData

期货实时行情。

```python
from FQData.DataStruct.realtime import FutureRealtimeData

future_realtime = FutureRealtimeData(data)
```

**继承自：** StockRealtimeData

---

## RealtimeSeries

实时行情序列。

```python
from FQData.DataStruct.realtime import RealtimeSeries

series = RealtimeSeries(realtime_list)
```

### 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | DataFrame 格式 |
| `series` | List[RealtimeBase] | 实时行情对象列表 |

### 方法

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `__len__()` | int | 序列长度 |
| `__repr__()` | str | 字符串表示 |

---

## FutureTickData

期货 Tick 数据（CTP 格式）。

```python
from FQData.DataStruct.realtime import FutureTickData

tick = FutureTickData(ctp_data)
```

### CTP 字段

| 字段 | 说明 |
|------|------|
| `TradingDay` | 交易日 |
| `InstrumentID` | 合约代码 |
| `ExchangeID` | 交易所代码 |
| `ExchangeInstID` | 合约在交易所的代码 |
| `LastPrice` | 最新价 |
| `PreSettlementPrice` | 前结算价 |
| `PreClosePrice` | 前收盘价 |
| `PreOpenInterest` | 前持仓量 |
| `OpenPrice` | 开盘价 |
| `HighestPrice` | 最高价 |
| `LowestPrice` | 最低价 |
| `Volume` | 成交量 |
| `Turnover` | 成交金额 |
| `OpenInterest` | 持仓量 |
| `ClosePrice` | 收盘价 |
| `SettlementPrice` | 结算价 |
| `UpperLimitPrice` | 涨停价 |
| `LowerLimitPrice` | 跌停价 |
| `PreDelta` | 昨虚实度 |
| `CurrDelta` | 今虚实度 |
| `BidPrice1-BidPrice5` | 买价1-5 |
| `BidVolume1-BidVolume5` | 买量1-5 |
| `AskPrice1-AskPrice5` | 卖价1-5 |
| `AskVolume1-AskVolume5` | 卖量1-5 |
| `AveragePrice` | 平均价 |
| `ActionDay` | 实际日期 |
| `UpdateTime` | 更新时间 |
| `UpdateMillisec` | 毫秒 |

### 行情属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `trading_day` | str | 交易日 |
| `instrument_id` | str | 合约代码 |
| `exchange_id` | str | 交易所代码 |
| `last_price` | float | 最新价 |
| `open_price` | float | 开盘价 |
| `highest_price` | float | 最高价 |
| `lowest_price` | float | 最低价 |
| `volume` | int | 成交量 |
| `turnover` | float | 成交金额 |
| `open_interest` | float | 持仓量 |
| `bid_price1` | float | 买一价 |
| `bid_vol1` | int | 买一量 |

---

## 使用示例

### 创建实时行情

```python
from FQData.DataStruct.realtime import StockRealtimeData, RealtimeSeries

data = {
    'code': '600000',
    'name': '浦发银行',
    'price': 10.5,
    'open': 10.2,
    'high': 10.8,
    'low': 10.1,
    'volume': 1000000,
    'bid1': 10.4,
    'ask1': 10.5
}

stock = StockRealtimeData(data)
print(f"代码: {stock.code}")
print(f"最新价: {stock.price}")
```

### 批量实时行情

```python
from FQData.DataStruct.realtime import RealtimeSeries, StockRealtimeData

realtime_list = [
    StockRealtimeData({'code': '600000', 'price': 10.5}),
    StockRealtimeData({'code': '000001', 'price': 12.3}),
]

series = RealtimeSeries(realtime_list)
print(f"行情数量: {len(series)}")
print(series.data)
```

### 期货 Tick 数据

```python
from FQData.DataStruct.realtime import FutureTickData

ctp_data = {
    'TradingDay': '2024-01-01',
    'InstrumentID': 'IF2401',
    'ExchangeID': 'CFFEX',
    'LastPrice': 3500.0,
    'Volume': 10000,
    'BidPrice1': 3499.0,
    'AskPrice1': 3501.0,
}

tick = FutureTickData(ctp_data)
print(f"合约: {tick.instrument_id}")
print(f"最新价: {tick.last_price}")
print(f"成交量: {tick.volume}")
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct _base](_base.md)
- [DataStruct resample](resample.md)