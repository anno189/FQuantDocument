# trade 子模块

交易日相关算法模块，提供交易日判断、日期偏移等功能。

## 模块路径

`FQBase.Date.trade`

## 常量

### trade_date_sse

```python
trade_date_sse: List[str]
```

上海证券交易所历年交易日列表，元素格式 "YYYY-MM-DD"。

## 快速开始

### 判断是否为交易日

```python
from FQBase.Date import util_if_trade

result = util_if_trade("2026-04-03")
print(result)  # True

result = util_if_trade("2026-04-05")
print(result)  # False (清明节)
```

### 获取下一个交易日

```python
from FQBase.Date import util_get_next_trade_date

next_day = util_get_next_trade_date("2026-04-03", n=1)
print(next_day)  # 2026-04-07

next_day = util_get_next_trade_date("2026-04-03", n=5)
print(next_day)  # 2026-04-14
```

### 获取前一个交易日

```python
from FQBase.Date import util_get_pre_trade_date

prev_day = util_get_pre_trade_date("2026-04-03", n=1)
print(prev_day)  # 2026-04-02
```

## 核心函数

### util_if_trade

```python
def util_if_trade(day: str) -> bool
```

判断日期是否为交易日。

### util_get_next_trade_date

```python
def util_get_next_trade_date(
    cursor_date: Union[str, pd.Timestamp, datetime.datetime, None] = None,
    n: int = 1
) -> str
```

获取后 n 个交易日。如果当前日期为交易日，则不包含当前日期。

### util_get_pre_trade_date

```python
def util_get_pre_trade_date(
    cursor_date: Union[str, pd.Timestamp, datetime.datetime, None] = None,
    n: int = 1
) -> str
```

获取前 n 个交易日。如果当前日期为交易日，则不包含当前日期。

### util_date_gap

```python
def util_date_gap(date: str, gap: int, methods: str = "+") -> str
```

基于交易日进行日期偏移计算。

**methods 参数说明**：
- `"gt"` 或 `">"`: 向后偏移
- `"gte"`: 向后偏移（含当前）
- `"lt"` 或 `"<"`: 向前偏移
- `"lte"`: 向前偏移（含当前）
- `"eq"` 或 `"="`: 返回当前日期
- `"+"`: 日历日后 gap 天
- `"-"`: 日历日前 gap 天

## 函数列表

| 分类 | 函数 | 说明 |
|------|------|------|
| 交易日判断 | `util_if_trade` | 判断是否为交易日 |
| 交易日判断 | `util_if_tradetime` | 判断是否在交易时间内 |
| 交易日判断 | `util_week_end_day` | 判断是否每周最后一个交易日 |
| 日期偏移 | `util_get_next_trade_date` | 获取下一个交易日 |
| 日期偏移 | `util_get_pre_trade_date` | 获取前一个交易日 |
| 日期偏移 | `util_get_next_day` | 获取后 n 个日历日 |
| 日期偏移 | `util_get_last_day` | 获取前 n 个日历日 |
| 日期偏移 | `util_date_gap` | 交易日偏移计算 |
| 日期偏移 | `util_add_months` | 月份偏移 |
| 日期查询 | `util_get_real_date` | 获取最近的交易日（二分查找） |
| 日期查询 | `util_get_real_datelist` | 获取真实区间 |
| 日期查询 | `util_get_trade_range` | 获取交易日范围 |
| 日期查询 | `util_get_trade_datetime` | 获取交易真实日期 |
| 日期查询 | `util_get_order_datetime` | 获取委托真实日期 |
| 日期查询 | `util_get_trade_gap` | 交易日间隔天数 |
| 周月季 | `util_week_end_day` | 周末最后交易日 |
| 周月季 | `util_getBetweenMonth` | 获取月份区间 |
| 周月季 | `util_getBetweenQuarter` | 获取季度区间 |
| 周月季 | `get_weekday_list` | 获取指定星期的日期列表 |
| 周期 | `util_get_next_period` | 获取下一周期 |
| 周期 | `util_get_last_datetime` | 获取前几天交易日时间 |
| 周期 | `util_get_next_datetime` | 获取几天后交易日时间 |
| 期货 | `util_future_to_tradedatetime` | 真实时间转交易所时间 |
| 期货 | `util_future_to_realdatetime` | 交易所时间转真实时间 |

## API 参考

详细 API 参考请查看 [api.md](api.md)。

## 相关文档

| 文档 | 说明 |
|------|------|
| [README](../README.md) | 模块首页 |
| [api.md](api.md) | 完整 API 参考 |
| [timestamp.md](timestamp.md) | 时间戳转换 |
| [最佳实践](../best-practices.md) | 开发建议 |