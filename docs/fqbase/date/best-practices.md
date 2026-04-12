# Date 模块最佳实践

## 目录

1. [日期格式规范](#1-日期格式规范)
2. [性能优化](#2-性能优化)
3. [时区处理](#3-时区处理)
4. [交易系统集成](#4-交易系统集成)
5. [错误处理](#5-错误处理)
6. [维护事宜](#6-维护事宜)

---

## 1. 日期格式规范

### 1.1 统一使用标准格式

在项目内部统一使用 `YYYY-MM-DD` 格式：

```python
GOOD: "2026-04-03"
BAD:  "2026/04/03"
BAD:  "04-03-2026"
BAD:  "20260403"
```

### 1.2 日期字符串输入

使用 `util_format_date2str()` 统一格式化输入：

```python
def process_date(date_input):
    date_str = util_format_date2str(date_input)
    # 后续处理使用标准格式
    return util_if_trade(date_str)
```

### 1.3 日期整数转换

量化交易中常使用 YYYYMMDD 整数格式：

```python
def normalize_date(date_var):
    if isinstance(date_var, int):
        return util_date_int2str(date_var)
    elif isinstance(date_var, str):
        return util_format_date2str(date_var)
    else:
        raise ValueError(f"Unsupported date type: {type(date_var)}")
```

---

## 2. 性能优化

### 2.1 避免重复调用

```python
GOOD:
is_trade = util_if_trade(target_date)
if is_trade:
    next_date = util_get_next_trade_date(target_date)

BAD (重复查询):
if util_if_trade(target_date):
    next_date = util_get_next_trade_date(target_date)
```

### 2.2 批量处理使用列表推导

```python
date_list = ["2026-04-01", "2026-04-02", "2026-04-03", "2026-04-04"]

GOOD:
trade_dates = [d for d in date_list if util_if_trade(d)]

BAD:
trade_dates = []
for d in date_list:
    if util_if_trade(d):
        trade_dates.append(d)
```

### 2.3 复用交易日列表

对于需要多次查询的场景，预加载数据：

```python
from FQBase.Date import trade_date_sse

def batch_check(dates):
    date_set = set(trade_date_sse)
    return [d in date_set for d in dates]
```

### 2.4 二分查找的正确使用

`util_get_real_date()` 已内置二分查找优化，直接使用：

```python
nearest = util_get_real_date(target_date, towards=-1)
```

不要自行实现线性搜索：

```python
BAD:
for d in trade_date_sse:
    if d <= target_date:
        nearest = d
```

---

## 3. 时区处理

### 3.1 默认使用北京时间

```python
from datetime import datetime, timezone, timedelta

QATZ = timezone(timedelta(hours=8))

def get_current_timestamp():
    return util_datetime_to_Unix_timestamp(datetime.now(QATZ))
```

### 3.2 跨时区数据处理

从外部数据源获取的时间戳需明确时区：

```python
def process_external_timestamp(ts, source_tz='UTC'):
    dt = datetime.fromtimestamp(ts, tz=timezone.utc)
    local_dt = dt.astimezone(QATZ)
    return util_datetime_to_Unix_timestamp(local_dt)
```

### 3.3 数据库时间存储

存储时使用 UTC，读取时转换为北京时间：

```python
def store_timestamp(dt: datetime) -> float:
    utc_dt = dt.astimezone(timezone.utc)
    return util_datetime_to_Unix_timestamp(utc_dt)

def read_timestamp(ts: float) -> datetime:
    return util_timestamp_to_str(ts, local_tz=timezone(timedelta(hours=8)))
```

---

## 4. 交易系统集成

### 4.1 交易时间判断

在交易时段执行策略时，先判断是否在交易时间内：

```python
from datetime import datetime
from FQBase.Date import util_if_tradetime
from FQBase.Config.business.constants import MARKET_TYPE

def execute_trading_logic():
    if not util_if_tradetime(datetime.now(), MARKET_TYPE.STOCK_CN):
        return  # 非交易时段跳过

    # 执行交易逻辑
    pass
```

### 4.2 期货夜盘处理

期货夜盘跨越午夜，需要特殊处理：

```python
from datetime import datetime
from FQBase.Date import util_future_to_tradedatetime

def process_future_trade_time(dt: datetime, code: str):
    trade_dt = util_future_to_tradedatetime(dt)
    real_dt = util_future_to_realdatetime(trade_dt)
    return trade_dt, real_dt
```

### 4.3 策略时间框架

根据不同时间框架使用不同的日期函数：

```python
def get_data_range(timeframe: str, reference_date: str):
    if timeframe == '1min':
        return util_date_gap(reference_date, 1, "-"), reference_date
    elif timeframe == '1d':
        return util_date_gap(reference_date, 30, "<"), reference_date
    else:
        raise ValueError(f"Unknown timeframe: {timeframe}")
```

---

## 5. 错误处理

### 5.1 日期格式验证

```python
def safe_get_trade_date(date_str: str) -> str:
    if not util_date_valid(date_str):
        raise ValueError(f"Invalid date format: {date_str}")

    if not util_if_trade(date_str):
        return util_get_real_date(date_str, towards=-1)

    return date_str
```

### 5.2 空值处理

```python
def safe_get_next_trade(date_str: str = None) -> str:
    if not date_str:
        date_str = util_today_str()

    normalized = util_format_date2str(date_str)
    return util_get_next_trade_date(normalized, n=1)
```

### 5.3 边界情况处理

```python
def get_trade_range_safe(start: str, end: str) -> list:
    real_start, real_end = util_get_real_datelist(start, end)

    if real_start is None or real_end is None:
        return []

    return util_get_trade_range(real_start, real_end)
```

---

## 6. 维护事宜

### 6.1 交易日数据更新

`trade_dates_data.py` 包含预生成的 A股交易日历：

- 数据范围：1990-12-19 至今
- 自动更新：每年初补充当年数据
- 手动更新：节假日调整时需重新生成

**更新步骤**：
1. 获取最新交易所交易日历
2. 更新 `trade_dates_data.py` 中的 `TRADE_DATE_SSE`
3. 验证更新后的数据：`python -c "from FQBase.Date import trade_date_sse; print(len(trade_date_sse))"`

### 6.2 新增交易时间段

如交易所调整交易时间：

1. 修改 `util_if_tradetime()` 中的时间段常量
2. 添加对应测试用例
3. 更新文档中交易时间段说明

### 6.3 节假日数据维护

中国节假日（非周末）需要通过交易日历体现：

- 春节：通常7天假期
- 清明节：通常3天假期
- 劳动节：通常3天假期
- 国庆节：通常7天假期
- 端午、中秋：通常3天假期

### 6.4 团队协作规范

```python
DATE_FORMAT = "%Y-%m-%d"

def parse_date(date_input) -> str:
    if isinstance(date_input, str):
        return util_format_date2str(date_input)
    elif isinstance(date_input, int):
        return util_date_int2str(date_input)
    elif hasattr(date_input, 'strftime'):
        return date_input.strftime(DATE_FORMAT)
    else:
        raise TypeError(f"Cannot parse date from {type(date_input)}")
```

### 6.5 检查清单

- [ ] 所有日期字符串使用 `YYYY-MM-DD` 格式
- [ ] 使用 `util_format_date2str()` 规范化输入
- [ ] 交易时间判断使用 `util_if_tradetime()`
- [ ] 日期比较前转换为统一格式
- [ ] 期货夜盘数据使用 `util_future_to_tradedatetime()` 转换
- [ ] 测试覆盖节假日前后的交易日计算
- [ ] 每年初验证并更新交易日历数据
