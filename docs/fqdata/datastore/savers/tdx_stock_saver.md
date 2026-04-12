# TDX Stock Saver

股票数据持久化模块，提供股票日线、分钟线、除权除息等数据的保存功能。

## 模块结构

```
tdx_stock_saver.py
```

## 函数

### save\_single\_stock\_day

保存单个股票日线数据。

```python
from FQData import save_single_stock_day

result = save_single_stock_day('600000')
```

**参数：**

| 参数       | 类型       | 说明                              |
| -------- | -------- | ------------------------------- |
| `code`   | str      | 股票代码 (6位)                       |
| `start`  | str      | 开始日期 (YYYY-MM-DD)，默认从1990-01-01 |
| `end`    | str      | 结束日期 (YYYY-MM-DD)，默认今天          |
| `ui_log` | callable | GUI日志回调                         |

**返回：** bool - 保存是否成功

**算法说明：**

1. 查询数据库中该股票已有的最后一条数据
2. 如果存在，从最后一个日期的下一个交易日开始更新
3. 如果不存在，从1990-01-01开始下载
4. 只有当 start\_date != end\_date 时才插入数据

***

### save\_stock\_day

批量保存股票日线数据。

```python
from FQData import save_stock_day

codes = ['600000', '000001', '000002']
result = save_stock_day(codes)
```

**参数：**

| 参数     | 类型   | 说明     |
| ------ | ---- | ------ |
| `code` | list | 股票代码列表 |

***

### save\_stock\_week

保存股票周线数据。

```python
from FQData import save_stock_week

result = save_stock_week('600000')
```

***

### save\_stock\_month

保存股票月线数据。

```python
from FQData import save_stock_month

result = save_stock_month('600000')
```

***

### save\_stock\_year

保存股票年线数据。

```python
from FQData import save_stock_year

result = save_stock_year('600000')
```

***

### save\_stock\_min

保存股票分钟线数据。

```python
from FQData import save_stock_min

result = save_stock_min('600000', freq='5min')
```

**参数：**

| 参数     | 类型        | 说明                               |
| ------ | --------- | -------------------------------- |
| `code` | str       | 股票代码                             |
| `data` | DataFrame | 分钟数据                             |
| `freq` | str       | 频率 (1min/5min/15min/30min/60min) |

***

### save\_single\_stock\_min

保存单只股票分钟线数据。

```python
from FQData import save_single_stock_min

result = save_single_stock_min('600000', data, freq='5min')
```

***

### save\_stock\_xdxr

批量保存除权除息数据。

```python
from FQData import save_stock_xdxr

codes = ['600000', '000001']
result = save_stock_xdxr(codes)
```

***

### save\_stock\_xdxr\_quick

快速保存除权除息数据。

```python
from FQData import save_stock_xdxr_quick

result = save_stock_xdxr_quick('600000')
```

***

### save\_single\_stock\_xdxr

保存单只股票除权除息数据。

```python
from FQData import save_single_stock_xdxr

result = save_single_stock_xdxr('600000')
```

***

### save\_stock\_list

保存股票列表。

```python
from FQData import save_stock_list

result = save_stock_list()
```

***

### save\_stock\_block

保存股票板块数据。

```python
from FQData import save_stock_block

result = save_stock_block()
```

***

### save\_stock\_info

保存股票信息。

```python
from FQData import save_stock_info

codes = ['600000', '000001']
result = save_stock_info(codes)
```

***

## 工具函数

### now\_time

获取当前交易时间。

```python
from FQData.DataStore.savers.tdx_stock_saver import now_time

time_str = now_time()
```

**算法说明：**

- 如果当前时间小于15:00，返回上一个交易日的17:00:00
- 如果当前时间大于等于15:00，返回当前交易日的15:00:00

***

## 相关文档

- [Savers 模块](../README.md)
- [DataStore 模块](../../README.md)

