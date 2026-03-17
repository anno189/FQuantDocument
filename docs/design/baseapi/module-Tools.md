# Tools 模块文档

## 模块概述

Tools 模块是 FQuant 量化交易系统的核心运算工具模块，提供时间处理、Redis 操作、文件读写、JSON 数据处理、财务日期计算、指数调整日期计算等基础功能。该模块为整个量化系统提供基础工具支持。

### 全局变量

- `r`: DirectRedis 连接对象，用于 Redis 数据缓存
  - 连接地址：localhost:6379
  - 用于缓存各种数据对象，如股票列表、板块列表等

### 核心功能分类

1. **时间和交易时间处理** - 判断交易时间、计算交易分钟数等
2. **Redis 操作** - 清除和检查 Redis 缓存数据
3. **文件处理** - 读取 CSV 文件、组合数组等
4. **JSON 数据处理** - 保存和读取 JSON 数据、格式化浮点数
5. **财务日期计算** - 获取财务报告周期日期
6. **指数调整日期** - 计算和检查指数成分股调整日期
7. **数据分析** - 离群值判断等统计分析

## 时间和交易时间处理

### `QA_util_if_tradetime_ext` - 判断是否为交易时间
**功能说明**: 判断指定时间是否为交易时间，包含盘前竞价时间和收盘前5分钟。

**参数说明**:
- `_time`: 时间字符串，格式为 'YYYY-MM-DD HH:MM:SS'

**返回值**: 布尔值，True 表示是交易时间，False 表示不是

**交易时间段**:
- 9:15-9:30: 盘前竞价
- 9:30-11:30: 上午交易
- 13:00-15:00: 下午交易
- 15:00-15:05: 收盘后取数据时间段

**使用示例**:
```python
# 判断是否为交易时间
is_trade = QA_util_if_tradetime_ext('2026-03-06 10:30:00')
print(is_trade)  # True

is_trade = QA_util_if_tradetime_ext('2026-03-06 12:00:00')
print(is_trade)  # False
```

### `get_tradetime_min` - 获取交易分钟数
**功能说明**: 计算从开盘开始的交易分钟数，支持盘前、盘中、盘后状态判断。

**参数说明**:
- `_time=None`: 时间对象，默认为当前时间
- `default=None`: 默认值，非交易时间使用

**返回值**: 整数，表示交易分钟数
- -100: 非交易日
- -60: 非交易时间（可自定义）
- -50: 午间休市
- -30~-1: 9:00-9:30 盘前
- 0~240: 交易时间分钟数（9:30为0，15:00为240）

**使用示例**:
```python
# 获取当前交易分钟数
mins = get_tradetime_min()
print(f"当前交易分钟数: {mins}")

# 获取指定时间的交易分钟数
import datetime
time_obj = datetime.datetime(2026, 3, 6, 10, 0, 0)
mins = get_tradetime_min(time_obj)
print(f"交易分钟数: {mins}")  # 30
```

## Redis 操作

### `celery_Redis_Clean` - 清除 Redis 缓存
**功能说明**: 临时工具函数，清除 Redis 中的指定 Key。

**参数说明**:
- `db=None`: Redis 数据库编号，默认为 None（使用默认数据库）

**清除的 Key**:
- Today
- DataFrame_BaseInfoList

**使用示例**:
```python
# 清除 Redis 缓存
celery_Redis_Clean()

# 清除指定数据库的缓存
celery_Redis_Clean(db=1)
```

### `celery_Redis_Check` - 检查 Redis 缓存
**功能说明**: 临时工具函数，打印 Redis 中的 Key 和数据。

**参数说明**:
- `db=None`: Redis 数据库编号，默认为 None

**检查的 Key**:
- YestodaySHAmount
- YestodayKCAmount
- MsgCalculateAmount
- ECalculateAmount
- Positions_YesToday
- DataFrame_StockList
- DataFrame_StockList_KC
- DataFrame_BaseInfoList
- DataFrame_BlockList

**使用示例**:
```python
# 检查 Redis 缓存
celery_Redis_Check()

# 检查指定数据库的缓存
celery_Redis_Check(db=1)
```

## 文件处理

### `readCSVFile` - 读取 CSV 文件
**功能说明**: 读取 CSV 文件，并整理股票代码格式。

**参数说明**:
- `filename`: CSV 文件路径
- `index_col=False`: 是否使用第一列作为索引
- `stockCode=None`: 股票代码列名，如果指定则会格式化为6位字符串

**返回值**: DataFrame，包含 CSV 文件数据

**使用示例**:
```python
# 读取普通 CSV 文件
data = readCSVFile('data.csv')

# 读取带股票代码的 CSV 文件
data = readCSVFile('stocks.csv', stockCode='code')
print(data['code'].head())  # 股票代码会格式化为6位
```

### `mergeArray` - 合并多个数组
**功能说明**: 组合多个字符串数组为一个数组。

**参数说明**:
- `a1`: 第一个数组
- `*args`: 其他数组（可变参数）

**返回值**: numpy 数组，合并后的数组

**使用示例**:
```python
# 合并两个数组
arr1 = ['000001', '000002']
arr2 = ['600000', '600001']
merged = mergeArray(arr1, arr2)
print(merged)  # ['000001' '000002' '600000' '600001']

# 合并多个数组
arr3 = ['300001', '300002']
merged = mergeArray(arr1, arr2, arr3)
```

## JSON 数据处理

### `initTodayRedisJson` - 初始化今日 Redis JSON
**功能说明**: 修改 JSON 库的临时函数，实盘过程中需要。将 today.json 数据更新到 Redis 的 yestoday 键。

**参数说明**: 无

**使用示例**:
```python
# 初始化今日 Redis JSON
initTodayRedisJson()
```

### `modifyjson` - 修改 JSON 数据
**功能说明**: 修改 JSON 库的临时函数，实盘过程中需要。更新 tick 数据的时间分类。

**参数说明**: 无

**使用示例**:
```python
# 修改 JSON 数据
modifyjson()
```

### `SendMessage2HTML` - 保存 Markdown 为 HTML
**功能说明**: 将 Markdown 格式的内容渲染为 HTML 并保存。

**参数说明**:
- `title`: HTML 页面标题
- `body`: Markdown 格式的内容
- `filename='index5min.html'`: 输出文件名

**使用示例**:
```python
# 保存 Markdown 为 HTML
title = "市场分析报告"
body = "# 今日市场分析\n\n市场上涨趋势明显。"
SendMessage2HTML(title, body, 'report.html')
```

### `SendData2Json` - 保存数据为 JSON（保留2位小数）
**功能说明**: 将数据保存为 JSON 文件，浮点数保留2位小数。

**参数说明**:
- `data`: 要保存的数据（通常是 dotty_dict 对象）
- `path`: JSON 文件路径（相对于 GLOBALMAP.JSONDATAPATH）

**使用示例**:
```python
from dotty_dict import dotty

# 准备数据
jsonData = dotty()
jsonData['data.date'] = '2026-03-06'
jsonData['data.value'] = 123.4567

# 保存为 JSON
SendData2Json(jsonData, 'data.json')
```

### `ReadData4Json` - 读取 JSON 文件
**功能说明**: 从 JSON 文件读取数据。

**参数说明**:
- `path`: JSON 文件路径（相对于 GLOBALMAP.JSONDATAPATH）

**返回值**: 解析后的 JSON 数据

**使用示例**:
```python
# 读取 JSON 文件
data = ReadData4Json('data.json')
print(data['data']['date'])
```

### `pretty_floats` - 格式化浮点数（保留2位小数）
**功能说明**: 递归格式化对象中的浮点数，保留2位小数。

**参数说明**:
- `obj`: 要格式化的对象（可以是 float、dict、list、tuple）

**返回值**: 格式化后的对象

**使用示例**:
```python
# 格式化单个浮点数
result = pretty_floats(123.4567)
print(result)  # 123.46

# 格式化字典
data = {'a': 1.2345, 'b': [2.3456, 3.4567]}
result = pretty_floats(data)
print(result)  # {'a': 1.23, 'b': [2.35, 3.46]}
```

### `SendData2Json4` - 保存数据为 JSON（保留4位小数）
**功能说明**: 将数据保存为 JSON 文件，浮点数保留4位小数。

**参数说明**:
- `data`: 要保存的数据
- `path`: JSON 文件路径

**使用示例**:
```python
from dotty_dict import dotty

# 准备数据
jsonData = dotty()
jsonData['data.value'] = 0.123456

# 保存为 JSON（保留4位小数）
SendData2Json4(jsonData, 'data_precise.json')
```

### `pretty_floats4` - 格式化浮点数（保留4位小数）
**功能说明**: 递归格式化对象中的浮点数，保留4位小数。

**参数说明**:
- `obj`: 要格式化的对象

**返回值**: 格式化后的对象

**使用示例**:
```python
# 格式化浮点数（保留4位小数）
result = pretty_floats4(0.123456)
print(result)  # 0.1235
```

## 财务日期计算

### `getfinancialdate` - 获取财务报告日期
**功能说明**: 根据当前日期获取最近9个财务报告周期的日期。

**参数说明**:
- `date`: 日期字符串，格式为 'YYYY-MM-DD'，None 表示今天
- `length=9`: 返回的日期数量

**返回值**: 列表，包含财务报告日期（格式为 'YYYYMMDD'）

**财务报告周期**:
- 3月31日: 一季报
- 6月30日: 半年报
- 9月30日: 三季报
- 12月31日: 年报

**使用示例**:
```python
# 获取今天的财务日期
dates = getfinancialdate(None)
print(dates)

# 获取指定日期的财务日期
dates = getfinancialdate('2026-03-06', length=5)
print(dates)
```

## 指数调整日期

### `get_index_change_date` - 获取指数调整历史日期
**功能说明**: 生成沪深300、中证500等指数的历史调整日期列表。

**参数说明**: 无

**返回值**: 列表，包含指数调整日期（格式为 'YYYY-MM-DD'）

**调整规则**:
- 2005-2013年: 每年1月和7月调整
- 2014年起: 每年6月和12月调整（6月的第二个周五后第一个交易日，12月的第二个周五后第一个交易日）

**使用示例**:
```python
# 获取指数调整历史日期
change_dates = get_index_change_date()
print(f"指数调整日期数量: {len(change_dates)}")
print(change_dates[-5:])  # 最近5个调整日期
```

### `get_index_change_date_lasted` - 获取下一次指数调整日期
**功能说明**: 获取下一次指数成分股调整的日期。

**参数说明**: 无

**返回值**: 字符串，下一次调整日期（格式为 'YYYY-MM-DD'）

**使用示例**:
```python
# 获取下一次指数调整日期
next_change = get_index_change_date_lasted()
print(f"下一次指数调整日期: {next_change}")
```

### `checked_index_change_date` - 检查指数调整日期
**功能说明**: 检查距离指数调整还有多少天，如果临近调整则发送微信通知。

**参数说明**:
- `Today=None`: 今天日期，None 表示使用 GLOBALMAP.TODAY()

**返回值**: 元组 (change_day, days_)
- change_day: 调整日期
- days_: 距离调整的交易日天数

**通知条件**: 距离调整还有 0-4 天时发送微信通知

**使用示例**:
```python
# 检查指数调整日期
change_day, days_ = checked_index_change_date()
print(f"指数调整日期: {change_day}")
print(f"距离调整还有: {days_} 个交易日")
```

## 数据分析

### `data_awaycrowds` - 通过离群值判断市场风格
**功能说明**: 使用四分位距（IQR）方法检测数据中的离群值。

**参数说明**:
- `data`: DataFrame，包含要分析的数据
- `columns`: 字符串，要分析的列名

**返回值**: 元组 (outliers, upper_bound, lower_bound)
- outliers: DataFrame，包含离群值数据
- upper_bound: 上浮阈值
- lower_bound: 下浮阈值

**计算方法**:
- Q1 = 25% 分位数
- Q3 = 75% 分位数
- IQR = Q3 - Q1
- lower_bound = Q1 - 1.5 * IQR
- upper_bound = Q3 + 1.5 * IQR

**使用示例**:
```python
import pandas as pd
import numpy as np

# 准备数据
data = pd.DataFrame({
    'value': np.random.normal(0, 1, 1000)
})
# 添加一些离群值
data.loc[0, 'value'] = 10
data.loc[1, 'value'] = -10

# 检测离群值
outliers, upper, lower = data_awaycrowds(data, 'value')
print(f"上界: {upper}, 下界: {lower}")
print(f"离群值数量: {len(outliers)}")
print(outliers)
```

## 综合使用示例

### 示例1：交易时间判断
```python
from FQMarket.FQUtil.Tools import *
import datetime

# 1. 判断当前是否为交易时间
now = datetime.datetime.now()
is_trade = QA_util_if_tradetime_ext(now.strftime('%Y-%m-%d %H:%M:%S'))
print(f"当前是否交易时间: {is_trade}")

# 2. 获取交易分钟数
mins = get_tradetime_min(now)
print(f"交易分钟数: {mins}")

# 3. 解释交易分钟数
if mins == -100:
    print("今天不是交易日")
elif mins == -60:
    print("现在不是交易时间")
elif mins == -50:
    print("午间休市")
elif mins < 0:
    print(f"盘前时间，距离开盘还有 {-mins} 分钟")
else:
    print(f"已交易 {mins} 分钟")
```

### 示例2：JSON 数据处理
```python
from FQMarket.FQUtil.Tools import *
from dotty_dict import dotty

# 1. 准备数据
jsonData = dotty()
jsonData['data.date'] = '2026-03-06'
jsonData['data.stocks'] = [
    {'code': '000001', 'name': '平安银行', 'price': 12.3456},
    {'code': '600000', 'name': '浦发银行', 'price': 8.9123}
]

# 2. 保存为 JSON（保留2位小数）
SendData2Json(jsonData, 'stocks.json')
print("已保存 stocks.json")

# 3. 保存为 JSON（保留4位小数）
SendData2Json4(jsonData, 'stocks_precise.json')
print("已保存 stocks_precise.json")

# 4. 读取 JSON 文件
read_data = ReadData4Json('stocks.json')
print(f"读取的数据日期: {read_data['data']['date']}")
```

### 示例3：财务和指数日期
```python
from FQMarket.FQUtil.Tools import *

# 1. 获取财务报告日期
print("=== 财务报告日期 ===")
fin_dates = getfinancialdate('2026-03-06', length=5)
for i, date in enumerate(fin_dates, 1):
    print(f"{i}. {date}")

# 2. 获取指数调整历史日期
print("\n=== 指数调整历史日期 ===")
change_dates = get_index_change_date()
print(f"历史调整次数: {len(change_dates)}")
print(f"最近5次调整: {change_dates[-5:]}")

# 3. 获取下一次调整日期
print("\n=== 下一次指数调整 ===")
next_change = get_index_change_date_lasted()
print(f"下一次调整日期: {next_change}")

# 4. 检查距离调整还有多少天
change_day, days_ = checked_index_change_date()
print(f"距离调整还有: {days_} 个交易日")
```

### 示例4：Redis 操作和文件处理
```python
from FQMarket.FQUtil.Tools import *

# 1. 检查 Redis 缓存
print("=== 检查 Redis 缓存 ===")
celery_Redis_Check()

# 2. 读取 CSV 文件
print("\n=== 读取 CSV 文件 ===")
try:
    data = readCSVFile('example.csv', stockCode='code')
    print(f"读取到 {len(data)} 条数据")
    print(data.head())
except Exception as e:
    print(f"读取文件失败: {e}")

# 3. 合并数组
print("\n=== 合并数组 ===")
arr1 = ['000001', '000002', '000003']
arr2 = ['600000', '600001']
arr3 = ['300001', '300002']
merged = mergeArray(arr1, arr2, arr3)
print(f"合并后数组: {merged}")
print(f"数组长度: {len(merged)}")

# 4. 清除 Redis 缓存（谨慎使用）
# celery_Redis_Clean()
# print("已清除 Redis 缓存")
```

### 示例5：离群值检测
```python
from FQMarket.FQUtil.Tools import *
import pandas as pd
import numpy as np

# 1. 生成模拟数据
np.random.seed(42)
data = pd.DataFrame({
    'return': np.random.normal(0, 0.02, 1000)  # 正态分布收益率
})

# 2. 添加一些异常值
data.loc[0, 'return'] = 0.1   # 10% 涨幅
data.loc[1, 'return'] = -0.08  # -8% 跌幅
data.loc[2, 'return'] = 0.15   # 15% 涨幅

# 3. 检测离群值
outliers, upper, lower = data_awaycrowds(data, 'return')

# 4. 输出结果
print("=== 离群值检测 ===")
print(f"正常值范围: [{lower:.4f}, {upper:.4f}]")
print(f"离群值数量: {len(outliers)}")
print("\n离群值数据:")
print(outliers)

# 5. 可视化（可选）
import matplotlib.pyplot as plt
plt.figure(figsize=(10, 6))
plt.hist(data['return'], bins=50, alpha=0.5, label='正常数据')
plt.scatter(outliers['return'], [0]*len(outliers), 
           color='red', s=100, label='离群值')
plt.axvline(upper, color='red', linestyle='--', label='上界')
plt.axvline(lower, color='red', linestyle='--', label='下界')
plt.xlabel('收益率')
plt.ylabel('频数')
plt.title('收益率分布与离群值检测')
plt.legend()
plt.show()
```

## 注意事项

1. **Redis 连接**: 模块使用 DirectRedis 连接 localhost:6379，确保 Redis 服务正常运行
2. **时间格式**: 时间参数通常使用 'YYYY-MM-DD' 或 'YYYY-MM-DD HH:MM:SS' 格式
3. **文件路径**: JSON 和 HTML 文件路径相对于 GLOBALMAP 中定义的路径
4. **临时函数**: celery_Redis_Clean、celery_Redis_Check、initTodayRedisJson、modifyjson 为临时工具函数，生产环境慎用
5. **指数调整**: 指数成分股通常在每年6月和12月调整，注意检查临近调整日期
6. **离群值检测**: data_awaycrowds 使用 IQR 方法，适用于近似正态分布的数据

## 已注释函数说明

### `getindexstocks` - 获取指数成分股（已注释）
**功能说明**: 从聚宽获取指数成分股数据（此函数已被注释，不再使用）。

**参数说明**:
- `index`: 指数代码（如 '000300.XSHG'）
- `type_`: 指数类型标识
- `date`: 查询日期

**返回值**: DataFrame，包含指数成分股数据

**注意事项**:
- 此函数需要聚宽环境支持
- 代码中包含了 2006-2022 年的指数调整日期列表
- 支持沪深300、中证500、中证1000等指数

## 依赖模块

- `numpy`: 数值计算
- `pandas`: 数据处理
- `datetime`: 时间处理
- `direct_redis`: Redis 直接连接
- `simplejson`: JSON 处理
- `dotty_dict`: 字典操作工具
- `redis_json_storage`: Redis JSON 存储
- `jinja2`: HTML 模板渲染
- `markdown`: Markdown 渲染
- `moment`: 日期时间处理
- `FQData`: 数据获取框架
- `FQMarket.FQUtil.Parameter`: 全局参数
- `FQFactor`: 因子计算框架

