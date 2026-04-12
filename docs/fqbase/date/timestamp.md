# timestamp 子模块

时间戳与日期时间转换工具模块。

## 模块路径

`FQBase.Date.timestamp`

## 常量

### QATZInfo_CN

```python
QATZInfo_CN: str = 'Asia/Shanghai'
```

北京时区常量，用于时间戳转换时指定时区。

## 快速开始

### datetime 转 Unix 时间戳

```python
from FQBase.Date import util_datetime_to_Unix_timestamp
from datetime import datetime

ts = util_datetime_to_Unix_timestamp(datetime.now())
print(ts)  # 1743600000.0
```

### 时间戳转字符串

```python
from FQBase.Date import util_timestamp_to_str

time_str = util_timestamp_to_str(1743600000)
print(time_str)  # 2026-04-02 12:00:00
```

### 字符串转 datetime

```python
from FQBase.Date import util_str_to_datetime

dt = util_str_to_datetime("2026-04-03")
print(dt)  # 2026-04-03 00:00:00+08:00
```

## 函数列表

| 函数 | 说明 |
|------|------|
| `util_datetime_to_Unix_timestamp` | datetime 转 Unix 时间戳 |
| `util_timestamp_to_str` | 时间戳转字符串 |
| `util_str_to_Unix_timestamp` | 字符串转 Unix 时间戳 |
| `util_str_to_datetime` | 字符串转 datetime |
| `util_print_timestamp` | 打印友好格式 |
| `util_date_stamp` | 日期转时间戳 |
| `util_time_stamp` | 日期时间转时间戳 |
| `util_tdxtimestamp` | 通达信时间戳转换 |
| `util_stamp2datetime` | 时间戳转 datetime |
| `util_ms_stamp` | 直接返回时间戳 |
| `util_time_now` | 获取当前时间 |
| `util_date_today` | 获取当前日期 |
| `util_today_str` | 获取今日字符串 |
| `util_date_str2int` | 日期字符串转整数 |
| `util_date_int2str` | 日期整数转字符串 |
| `util_to_datetime` | 通用字符串转 datetime |
| `util_datetime_to_strdate` | datetime 转日期字符串 |
| `util_datetime_to_strdatetime` | datetime 转日期时间字符串 |
| `util_date_valid` | 日期格式验证 |
| `util_get_date_index` | 获取日期索引 |
| `util_get_index_date` | 根据索引获取日期 |
| `util_select_hours` | 小时选择 |
| `util_select_min` | 分钟选择 |
| `util_time_delay` | 时间延迟 |
| `util_calc_time` | 时间计算 |
| `month_data` | 月度数据列表 |

## API 参考

详细 API 参考请查看 [api.md](api.md)。

## 相关文档

| 文档 | 说明 |
|------|------|
| [README](../README.md) | 模块首页 |
| [api.md](api.md) | 完整 API 参考 |
| [trade.md](trade.md) | 交易日算法 |
| [最佳实践](../best-practices.md) | 开发建议 |