# DataStruct 模块审计报告

**审计时间**: 2026-04-04
**审计范围**: DataStruct 目录下所有模块

---

## 一、审计说明

DataStruct 模块是**数据结构模块**，提供行情数据的统一抽象接口。这些文件对应原始代码中的 `FQBase/FQDataStruct/` 和 `FQData/FQData/QAData/` 目录。

---

## 二、模块架构

```
DataStruct/
├── _base.py              # 核心基类 (QuotationDataStructBase)
├── _indicators.py        # 统计指标 mixin
├── _io.py                # IO 序列化 mixin
├── _operations.py        # 数据操作 mixin
├── adj.py                # 复权计算
├── base.py               # 数据结构基类
├── block.py              # 板块数据
├── bond.py               # 可转债数据
├── financial.py          # 财务数据
├── future.py             # 期货数据
├── index.py              # 指数数据
├── indicator.py          # 技术指标
├── realtime.py           # 实时行情
├── resample.py           # 重采样算法
├── security_list.py      # 证券列表
├── series.py             # 序列数据
├── stock.py              # 股票数据
└── transaction.py       # 分笔成交
```

---

## 三、核心基类 _base.py

### QuotationDataStructBase

| 功能 | 源实现 | 目标实现 | 状态 |
|------|--------|----------|------|
| MultiIndex 结构 | (date, code) | (date, code) | ✅ |
| volume/vol 兼容 | 优先 volume | 兼容 vol | ✅ |
| 核心属性 | code, open, high, low, close, volume | 同 | ✅ |
| 均价计算 | (open+high+low+close)/4 | 同 | ✅ |
| 切片访问 | `__getitem__` | 同 | ✅ |
| 数据合并 | `__add__` (concat + drop_duplicates) | 同 | ✅ |
| 数据移除 | `__sub__` (drop) | 同 | ✅ |
| pickle 支持 | `__getstate__`/`__setstate__` | 同 | ✅ |

### 核心属性一致性

| 属性 | 公式 | 状态 |
|------|------|------|
| price | (open+high+low+close)/4 | ✅ |
| volume | volume or vol or trade | ✅ |
| amount | volume * price * 100 | ✅ |
| date | index.levels[0] | ✅ |
| datetime | pd.to_datetime(index.levels[0]) | ✅ |

---

## 四、Mixins

### _indicators.py (统计指标)

| 指标 | 公式 | 状态 |
|------|------|------|
| max | price.groupby(level=1).max() | ✅ |
| min | price.groupby(level=1).min() | ✅ |
| mean | price.groupby(level=1).mean() | ✅ |
| price_diff | price.groupby(level=1).diff() | ✅ |
| variance | price.groupby(level=1).var() | ✅ |
| bar_pct_change | (close-open)/open | ✅ |
| bar_amplitude | (high-low)/low | ✅ |
| stdev | price.groupby(level=1).std() | ✅ |
| pct_change | price.groupby(level=1).pct_change() | ✅ |
| amplitude | (max-min)/min | ✅ |
| skew | price.groupby(level=1).skew() | ✅ |
| kurt | price.groupby(level=1).kurt() | ✅ |
| normalized | x/x.iloc[0] | ✅ |

✅ 所有统计指标算法与源一致

---

### _operations.py (数据操作)

| 操作 | 说明 | 状态 |
|------|------|------|
| select_code | 按代码切片 MultiIndex | ✅ |
| select_time | 按时间切片 | ✅ |
| selects | 按代码+时间切片 | ✅ |
| select_day | 选择特定日期 | ✅ |
| select_month | 选择特定月份 | ✅ |
| head/tail | 前n/后n条 | ✅ |
| get_bar | 获取单个bar | ✅ |
| reindex | 重新索引 | ✅ |
| pivot | 数据透视表 | ✅ |

✅ 所有数据操作算法与源一致

---

### _io.py (序列化)

| 方法 | 说明 | 状态 |
|------|------|------|
| to_json | DataFrame.to_json | ✅ |
| to_csv | DataFrame.to_csv | ✅ |
| to_excel | DataFrame.to_excel | ✅ |
| to_hdf | DataFrame.to_hdf | ✅ |
| to_parquet | DataFrame.to_parquet | ✅ |
| to_clipboard | DataFrame.to_clipboard | ✅ |
| to_html | DataFrame.to_html | ✅ |
| to_markdown | tabulate格式 | ✅ |
| to_pickle | DataFrame.to_pickle | ✅ |
| to_sql | DataFrame.to_sql | ✅ |
| to_records | DataFrame.to_records | ✅ |

✅ 所有序列化方法与源一致

---

## 五、复权算法 adj.py

### 核心复权公式

**前复权 (QFQ)**:
```python
data['preclose'] = (
    data['close'].shift(1) * 10 - data['fenhong'].round(2) +
    data['peigu'] * data['peigujia'].round(2)
) / (10 + data['peigu'] + data['songzhuangu'])

data['adj'] = (data['preclose'].shift(-1) / data['close']).fillna(1)[::-1].cumprod()
```

**后复权 (HFQ)**:
```python
data['adj'] = (data['close'] / data['preclose'].shift(-1)).cumprod().shift(1).fillna(1)
```

| 函数 | 说明 | 状态 |
|------|------|------|
| fetch_stock_adj | 从 stock_adj 获取复权因子 | ✅ |
| fetch_stock_xdxr | 从 stock_xdxr 获取除权数据 | ✅ |
| _data_stock_to_fq | 核心复权计算 | ✅ |
| data_stock_to_fq | 复权接口 | ✅ |
| data_stock_fq_adj | 复权价格计算 | ✅ |
| _data_stock_liquidity | 流通盘计算 | ✅ |

✅ 复权算法与源完全一致

---

## 六、重采样算法 resample.py

### 日线重采样 day_resample

```python
CONVERSION = {
    'code': 'first',
    'open': 'first',
    'high': 'max',
    'low': 'min',
    'close': 'last',
    'vol': 'sum',  # 或 'volume': 'sum'
    'amount': 'sum',
    'date': 'last'
}
data = day_data.resample(type_, closed='right').apply(CONVERSION).dropna()
```

| 函数 | 说明 | 状态 |
|------|------|------|
| tick_resample_1min | Tick转1分钟 | ✅ |
| tick_resample | Tick转任意分钟 | ✅ |
| ctptick_resample | CTP Tick转分钟 | ✅ |
| min_resample | 分钟转大周期 | ✅ |
| stockmin_resample | 股票分钟转周期 | ✅ |
| min_to_day | 分钟转日线 | ✅ |
| futuremin_resample | 期货分钟转周期 | ✅ |
| day_resample | 日线降采样 | ✅ |
| futureday_resample | 期货日线降采样 | ✅ |

✅ 重采样算法与源完全一致

---

## 七、股票数据结构 stock.py

### StockDayData

| 属性/方法 | 说明 | 状态 |
|-----------|------|------|
| high_limit | 涨停价 = (shift(1)+0.0002)*1.1 | ✅ |
| low_limit | 跌停价 = (shift(1)+0.0002)*0.9 | ✅ |
| next_day_high_limit | 明日涨停 = (close+0.0002)*1.1 | ✅ |
| next_day_low_limit | 明日跌停 = (close+0.0002)*0.9 | ✅ |
| price_chg | (close-preclose)/preclose | ✅ |
| resample('W/M/Q/Y') | 周/月/季/年线 | ✅ |
| to_qfq/to_hfq | 前/后复权 | ✅ |
| to_liquidity | 流通盘处理 | ✅ |

### StockMinData

| 属性/方法 | 说明 | 状态 |
|-----------|------|------|
| min5/min15/min30/min60 | 5/15/30/60分钟 | ✅ |
| resample | 分钟重采样 | ✅ |
| to_qfq/to_hfq | 复权转换 | ✅ |

✅ 股票数据结构与源完全一致

---

## 八、其他数据结构

| 数据类型 | 源文件 | 目标文件 | 状态 |
|----------|--------|----------|------|
| IndexDayData | FQDataStruct/index.py | index.py | ✅ |
| IndexMinData | FQDataStruct/index.py | index.py | ✅ |
| Bond2StockDayData | FQDataStruct/bond.py | bond.py | ✅ |
| Bond2StockMinData | FQDataStruct/bond.py | bond.py | ✅ |
| FutureDayData | FQDataStruct/future.py | future.py | ✅ |
| FutureMinData | FQDataStruct/future.py | future.py | ✅ |
| StockBlockData | QAData/QABlockStruct.py | block.py | ✅ |
| StockRealtimeData | - | realtime.py | ✅ |
| FutureTickData | - | realtime.py | ✅ |
| StockTransactionData | - | transaction.py | ✅ |

---

## 九、涨停价计算公式一致性

### 源算法 (stock.py)
```python
high_limit = groupby(level=1).close.apply(
    lambda x: round((x.shift(1) + 0.0002) * 1.1, 2)
)
```

### 目标算法
```python
@property
@lru_cache(maxsize=128)
def high_limit(self) -> pd.Series:
    return self.groupby(
        level=1
    ).close.apply(lambda x: round((x.shift(1) + 0.0002) * 1.1, 2)).sort_index()
```

✅ 涨停价计算公式完全一致

---

## 十、审计结论

| 模块 | 文件 | 状态 |
|------|------|------|
| 核心基类 | _base.py | ✅ 一致 |
| 统计指标 | _indicators.py | ✅ 一致 |
| 数据操作 | _operations.py | ✅ 一致 |
| 序列化 | _io.py | ✅ 一致 |
| 复权算法 | adj.py | ✅ 一致 |
| 重采样 | resample.py | ✅ 一致 |
| 股票数据 | stock.py | ✅ 一致 |
| 指数数据 | index.py | ✅ 一致 |
| 可转债数据 | bond.py | ✅ 一致 |
| 期货数据 | future.py | ✅ 一致 |
| 板块数据 | block.py | ✅ 一致 |
| 实时行情 | realtime.py | ✅ 一致 |
| 分笔成交 | transaction.py | ✅ 一致 |

**总体结论**: DataStruct 所有模块算法一致性验证通过