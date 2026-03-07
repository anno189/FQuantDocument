# ToolsGetData 模块文档

## 模块概述

ToolsGetData 模块是 FQuant 量化交易系统的核心数据获取与处理模块，提供股票数据获取、市场分析、市值分位点计算、涨停分析、策略选股等功能。该模块整合了多种数据源，支持实时和历史数据分析，为交易策略提供基础数据支持。

### 全局变量

- `r`: Redis 连接对象，用于缓存数据（如板块列表、股票列表等）
  - 连接地址：localhost:6379
  - 主要缓存：DataFrame_StockList（股票列表）、DataFrame_BlockList（板块列表）等

### 核心功能分类

1. **股票数据获取** - 获取股票基础数据、扩展数据、竞价数据等
2. **市值分位点计算** - 计算不同市值区间的分位点和分布
3. **涨停分析** - 分析涨停股票、连板数据、涨停预期等
4. **市场和指数数据** - 获取市场状态、指数数据、期货数据等
5. **策略池和概念分析** - 分析股票概念分布、策略池数据等
6. **竞价选股** - 根据竞价数据进行股票筛选和排序
7. **数据更新** - 更新历史数据CSV文件
8. **数据可视化** - 生成市值分布、连板统计等图表

## 核心功能

### 1. 股票数据获取

#### `fetch_stock_list_bj` - 获取北交所股票列表
**功能说明**: 从数据库获取北交所股票列表

**参数说明**:
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含北交所股票列表

**使用示例**:
```python
# 获取北交所股票列表
bj_stocks = fetch_stock_list_bj()
```

#### `getMarketHighStock` - 获取市场高标股票
**功能说明**: 获取20日、10日、5日涨幅前N的股票

**参数说明**:
- `end_date`: 查询日期
- `count=20`: 每个周期取前多少只股票
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含高标股票数据

**使用示例**:
```python
# 获取市场高标股票
high_stocks = getMarketHighStock('2026-03-05', count=20)
```

#### `getDaysDatas` - 获取纵向切片数据（每股）
**功能说明**: 获取指定股票在指定日期范围内的纵向数据

**参数说明**:
- `end_date=None`: 结束日期，默认为今日
- `start_date=None`: 开始日期，默认为250天前
- `lists=None`: 股票代码列表
- `query_id=None`: 查询条件
- `columns=None`: 指定返回列
- `coll=DATABASE.stock_data_factor`: 数据库集合

**返回值**: DataFrame 包含纵向数据

**使用示例**:
```python
# 获取指定股票的历史数据
codes = ['000001', '000002']
data = getDaysDatas(end_date='2026-03-05', lists=codes)

# 获取指定日期范围的数据
data = getDaysDatas(start_date='2025-01-01', end_date='2026-03-05')
```

#### `getStockExtentDays` - 获取股票扩展数据
**功能说明**: 获取指定日期的股票扩展数据

**参数说明**:
- `end_date=None`: 查询日期
- `lists=None`: 股票代码列表
- `columns=None`: 指定返回列
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含扩展数据

**使用示例**:
```python
# 获取今日股票扩展数据
extent_data = getStockExtentDays()

# 获取指定股票的扩展数据
codes = ['000001', '000002']
extent_data = getStockExtentDays('2026-03-05', lists=codes)
```

#### `GetStockList` - 获取股票列表数据
**功能说明**: 获取指定日期的股票基础数据，支持多种筛选条件

**参数说明**:
- `end_date`: 查询日期，默认为今日
- `extent_=True`: 是否获取扩展数据（市值、流通市值等）
- `limit_=True`: 是否获取涨停数据
- `code_l=None`: 指定股票代码列表
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含股票基础数据、扩展数据、涨停数据

**使用示例**:
```python
# 获取今日股票数据
stock_data = GetStockList(extent_=True, limit_=True)

# 获取指定日期股票数据
stock_data = GetStockList('2026-03-05', extent_=True, limit_=True)

# 获取指定股票列表数据
codes = ['000001', '000002', '600000']
stock_data = GetStockList(code_l=codes, extent_=True)
```

#### `getDayData` - 获取日线数据
**功能说明**: 从指定集合中获取日线数据

**参数说明**:
- `end_date`: 查询日期
- `coll`: 数据库集合
- `columns`: 指定返回列
- `query_id`: 查询条件

**返回值**: DataFrame 包含日线数据

**使用示例**:
```python
# 获取今日基础数据
data = getDayData('2026-03-05', coll=DATABASE.stock_data_base)

# 获取指定列数据
data = getDayData('2026-03-05', coll=DATABASE.stock_data_extent, columns=['code', 'close', 'amount'])
```

### 2. 市值分位点计算

#### `getliutongshizhiZ` - 获取流通市值Z
**功能说明**: 获取或计算股票的流通股本数据，支持从财务数据中获取

**参数说明**:
- `end_date`: 查询日期
- `stocklist_`: 股票列表DataFrame
- `renew=False`: 是否强制重新计算
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含流通股本数据

**使用示例**:
```python
# 获取流通股本数据
stock_data = GetStockList()
stock_data = getliutongshizhiZ('2026-03-05', stock_data)
```

**注**: `getmarketshizhiquantile` 函数已移至 `FQMarket.FQUtil.BBlock` 模块，详细说明请参考 BBlock 模块文档。

#### `draw_bar_marketshizhiquantile` - 绘制市值分布图
**功能说明**: 绘制不同风格板块的市值分布柱状图

**参数说明**:
- `end_date=None`: 计算日期
- `output_='json'`: 输出格式（json/echarts）

**返回值**: JSON数据或ECharts对象

**使用示例**:
```python
# 生成市值分布图
draw_bar_marketshizhiquantile()

# 获取ECharts对象
chart = draw_bar_marketshizhiquantile(output_='echarts')
```

### 3. 涨停分析

#### `get_stock_open_data` - 获取股票开盘数据
**功能说明**: 获取股票开盘竞价数据，包含竞价成交金额、竞价量比等指标

**参数说明**:
- `end_date`: 查询日期
- `data=None`: 股票代码列表或DataFrame
- `index_=True`: 是否包含指数信息
- `extent_=True`: 是否包含扩展数据
- `factor_=True`: 是否包含因子数据
- `yesvol_=True`: 是否包含昨日成交量
- `gubenZ_=True`: 是否包含股本数据
- `limit_=True`: 是否包含涨停数据
- `open_=True`: 是否包含开盘数据
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含开盘竞价数据

**使用示例**:
```python
# 获取今日开盘竞价数据
open_data = get_stock_open_data('2026-03-05')

# 获取指定股票的开盘竞价数据
codes = ['000001', '000002']
open_data = get_stock_open_data('2026-03-05', data=codes)
```

#### `getlimitopen` - 获取涨停开盘数据
**功能说明**: 获取昨日涨停股票的今日开盘数据，用于分析涨停预期

**参数说明**:
- `end_date`: 开盘日期
- `days=15`: N天M板统计天数
- `tomodays=10`: 输出后多少天涨幅
- `day_=True`: 输出列是日期还是T0、T1
- `today=True`: 今日是否有数据
- `filter_=True`: 是否过滤数据
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含涨停股票开盘数据

**使用示例**:
```python
# 获取涨停开盘数据
limit_open = getlimitopen('2026-03-05')

# 获取不过滤的历史数据
limit_open = getlimitopen('2026-03-05', filter_=False, today=False)
```

#### `calu_limit` - 计算涨停预期
**功能说明**: 根据昨日涨停时间和今日开盘情况计算涨停预期

**参数说明**:
- `end_date`: 昨日日期
- `data_open=pd.DataFrame({})`: 今日开盘数据
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含涨停预期数据

**使用示例**:
```python
# 计算涨停预期
limit_expect = calu_limit('2026-03-04')
```

#### `getRstopGene` - 获取涨停基因
**功能说明**: 统计近一年中所有涨停连板两次以上的个股

**参数说明**:
- `end_date=None`: 查询日期，默认为今日

**返回值**: DataFrame 包含股票代码和涨停基因

**使用示例**:
```python
# 获取涨停基因数据
gene_data = getRstopGene()
```

#### `CaluTomo10Rate` - 计算明日10日涨幅
**功能说明**: 计算指定股票在未来10天的涨幅表现

**参数说明**:
- `end_date`: 起始日期
- `data`: 股票数据，需要包括收盘价
- `tomodays=10`: 计算多少天涨幅
- `col_=None`: 额外列
- `days=True`: 输出列是日期还是T0、T1
- `today=True`: 今日是否
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含未来涨幅数据

**使用示例**:
```python
# 计算明日10日涨幅
stock_codes = ['000001', '000002']
rate_data = CaluTomo10Rate('2026-03-05', stock_codes)
```

#### `CaluLimitTomo01Rate` - 计算涨停明日1日涨幅
**功能说明**: 计算涨停股票在明日的涨幅表现

**参数说明**:
- `end_date`: 起始日期
- `data`: 股票数据，需要包括收盘价
- `col_=None`: 额外列
- `days=True`: 输出列是日期还是T0
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含明日涨幅数据

**使用示例**:
```python
# 计算涨停明日1日涨幅
limit_codes = ['000001', '000002']
rate_data = CaluLimitTomo01Rate('2026-03-05', limit_codes)
```

#### `getstockopenlimit` - 获取开盘一字板股票
**功能说明**: 获取开盘即涨停或跌停的股票

**参数说明**:
- `end_date=None`: 查询日期
- `type_='up'`: 类型（'up'涨停/'down'跌停）
- `only=True`: 是否只返回一字板（买一量为0）

**返回值**: DataFrame 包含符合条件的股票数据

**使用示例**:
```python
# 获取开盘一字涨停股票
limit_up = getstockopenlimit(type_='up', only=True)

# 获取所有开盘涨停股票
all_limit_up = getstockopenlimit(type_='up', only=False)

# 获取开盘一字跌停股票
limit_down = getstockopenlimit(type_='down', only=True)
```

#### `get_stock_limit_block` - 获取涨停板块统计
**功能说明**: 获取各板块的涨停股票统计

**参数说明**:
- `end_date=None`: 查询日期
- `json=True`: 是否返回JSON格式

**返回值**: DataFrame或JSON数据

**使用示例**:
```python
# 获取涨停板块统计
df = get_stock_limit_block(json=False)

# 获取JSON格式数据
json_data = get_stock_limit_block(json=True)
```

#### `draw_stock_limit_block` - 绘制连板统计图
**功能说明**: 绘制连板概念统计图

**参数说明**:
- `end_date=None`: 查询日期
- `days=10`: 统计天数

**返回值**: 生成JSON文件

**使用示例**:
```python
# 绘制10日连板统计图
draw_stock_limit_block(days=10)

# 绘制指定日期连板统计图
draw_stock_limit_block('2026-03-05', days=15)
```

### 4. 主线板块识别

#### `GetMarkerOpenSelectBlock` - 获取竞价主线板块
**功能说明**: 基于竞价数据识别主线板块并筛选相关股票

**参数说明**:
- `end_date=None`: 查询日期
- `data=None`: 输入数据
- `block_=True`: 是否使用板块数据
- `stock_len=30`: 返回股票数量

**返回值**: 三元组（股票列表，主线板块，所有相关板块）

**使用示例**:
```python
# 获取竞价主线板块
stocks, main_blocks, all_blocks = GetMarkerOpenSelectBlock()

# 获取指定数量的主线股票
stocks, main_blocks, all_blocks = GetMarkerOpenSelectBlock(stock_len=50)
```

### 5. 策略回测数据

#### `getStraOneLimit` - 获取策略涨停数据
**功能说明**: 获取策略相关的涨停股票数据，用于回测分析

**参数说明**:
- `end_date=None`: 查询日期
- `tomorrow=None`: 次日日期
- `type_='ab'`: 策略类型
- `save=True`: 是否保存结果
- `read=True`: 是否读取缓存
- `show=True`: 是否显示结果

**返回值**: 四元组（策略结果数据，基础数据，二次过滤结果，二次过滤基础数据）

**使用示例**:
```python
# 获取策略涨停数据
r0, base1, r1, base2 = getStraOneLimit()

# 获取指定类型策略数据
r0, base1, r1, base2 = getStraOneLimit(type_='二次过滤')
```

### 6. 市场和指数数据

#### `JsonMarketStatusData` - 获取市场状态数据
**功能说明**: 从数据库获取指定日期的市场状态数据

**参数说明**:
- `end_date=None`: 查询日期，默认为今日
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含市场状态数据

**使用示例**:
```python
# 获取今日市场状态
market_status = JsonMarketStatusData()
```

#### `getMarketDataDays` - 获取市场多日数据
**功能说明**: 获取市场在指定日期范围内的数据

**参数说明**:
- `start_date=None`: 开始日期
- `end_date=None`: 结束日期，默认为今日
- `lt=250`: 如果>0，取start到end；如果=0，只取end_date
- `coll_data=DATABASE.market_data_base`: 数据库集合

**返回值**: DataFrame 包含市场多日数据

**使用示例**:
```python
# 获取最近250天市场数据
market_data = getMarketDataDays()

# 获取指定日期范围的市场数据
market_data = getMarketDataDays(start_date='2025-01-01', end_date='2026-03-05')
```

#### `getIndexExtentWeightDays` - 获取指数扩展权重数据
**功能说明**: 获取指数在指定日期范围内的扩展数据和权重计算

**参数说明**:
- `code`: 指数代码
- `start_date`: 开始日期
- `end_date`: 结束日期
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含指数扩展权重数据

**使用示例**:
```python
# 获取上证指数扩展数据
index_data = getIndexExtentWeightDays('000001', '2025-01-01', '2026-03-05')
```

#### `getIndexFactorDays` - 获取指数因子数据
**功能说明**: 获取指数在指定日期范围内的因子数据

**参数说明**:
- `code`: 指数代码
- `start_date`: 开始日期
- `end_date`: 结束日期
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含指数因子数据

**使用示例**:
```python
# 获取上证指数因子数据
index_factor = getIndexFactorDays('000001', '2025-01-01', '2026-03-05')
```

#### `getIndexCorrDays` - 获取指数相关性数据
**功能说明**: 获取指数在指定日期范围内的相关性数据

**参数说明**:
- `code`: 指数代码
- `start_date`: 开始日期
- `end_date`: 结束日期
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含指数相关性数据

**使用示例**:
```python
# 获取上证指数相关性数据
index_corr = getIndexCorrDays('000001', '2025-01-01', '2026-03-05')
```

#### `get_future_day` - 获取期货日线数据
**功能说明**: 获取指定期货品种的日线数据

**参数说明**:
- `code`: 期货代码，如 '5_CNTY', '8_ATY'
- `start_date=None`: 开始时间
- `end_date=None`: 结束时间

**返回值**: DataFrame 包含期货日线数据

**使用示例**:
```python
# 获取期货日线数据
future_data = get_future_day('5_CNTY', '2025-01-01', '2026-03-05')
```

### 7. 策略池和概念分析

#### `getStrategyPoolsData` - 获取策略池数据
**功能说明**: 获取指定日期和策略代码的策略池数据

**参数说明**:
- `end_date=None`: 查询日期，默认为今日
- `str_code=None`: 策略代码列表
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含策略池数据

**使用示例**:
```python
# 获取今日所有策略池数据
pools_data = getStrategyPoolsData()

# 获取指定策略数据
pools_data = getStrategyPoolsData(str_code=['str60', 'str_tan_ma3'])
```

#### `get_date_strategy_pools` - 获取策略池股票数据
**功能说明**: 获取指定日期和策略的股票列表

**参数说明**:
- `end_date`: 查询日期
- `strategy_code='str60'`: 策略代码
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含股票代码和策略标记

**使用示例**:
```python
# 获取策略池股票
strategy_stocks = get_date_strategy_pools('2026-03-05', 'str60')
```

#### `stock_ana_con` - 股票概念分析
**功能说明**: 分析指定股票列表的概念分布

**参数说明**:
- `data`: 股票数据
- `columns=['code']`: 列名
- `sort_=None`: 排序列
- `ascending_=False`: 是否升序
- `filename=''`: 输出文件名
- `display=False`: 是否显示
- `replace=None`: 替换字典
- `index_name=None`: 索引名称

**返回值**: DataFrame 包含概念分析结果

**使用示例**:
```python
# 分析股票概念
stock_data = GetStockList()
concept_analysis = stock_ana_con(stock_data, index_name='今日股票')
```

#### `stock_ana_con_all` - 全股票概念分析
**功能说明**: 分析所有股票的概念分布，支持竞价数据

**参数说明**:
- `data`: 股票数据
- `columns=['code']`: 列名
- `sort_=None`: 排序列
- `ascending_=False`: 是否升序
- `filename=''`: 输出文件名
- `display=False`: 是否显示
- `replace=None`: 替换字典
- `index_name='竞价'`: 索引名称

**返回值**: DataFrame 包含概念分析结果

**使用示例**:
```python
# 分析全股票概念
stock_data = get_stock_open_data('2026-03-05')
concept_analysis = stock_ana_con_all(stock_data, index_name='竞价')
```

### 8. 竞价选股

#### `get_open_select_stock_list` - 获取竞价选股股票列表
**功能说明**: 根据竞价数据进行股票筛选，用于策略选股

**参数说明**:
- `end_date`: 查询日期
- `re=0`: 模式（0:竞价完成，收盘前；1:收盘后，回测；2:开盘前）
- `ltsz_threshold=0.35`: 流通市值阈值
- `pools=2000`: 股票池大小
- `code=None`: 指定股票代码
- `show=True`: 是否显示结果
- `save=False`: 是否保存结果
- `read=False`: 是否读取缓存
- `block_=True`: 是否使用板块数据

**返回值**: 五元组（股票池1，股票池2，股票池3，股票池4，原始数据）

**使用示例**:
```python
# 获取竞价选股股票列表
stock1, stock2, stock3, stock4, data = get_open_select_stock_list('2026-03-05')
```

#### `get_stock_con` - 获取股票概念统计
**功能说明**: 统计指定股票列表的概念分布

**参数说明**:
- `stockData_`: 股票数据
- `count1=3`: 概念数量阈值1
- `count2=2`: 概念数量阈值2
- `show=False`: 是否显示结果

**返回值**: DataFrame 包含概念统计

**使用示例**:
```python
# 获取股票概念统计
stock_data = GetStockList()
concept_stats = get_stock_con(stock_data, show=True)
```

#### `df_sort_filter` - 数据排序过滤
**功能说明**: 对股票数据进行多维度排序和打分

**参数说明**:
- `stock_base_1`: 股票数据
- `blsort_=True`: 是否使用板块排序

**返回值**: DataFrame 包含排序后的数据

**使用示例**:
```python
# 数据排序过滤
stock_data = GetStockList()
sorted_data = df_sort_filter(stock_data)
```

### 9. 数据更新函数

#### `update_limit_rate_csv` - 更新涨停率CSV
**功能说明**: 更新涨停率CSV文件，用于策略回测

**参数说明**:
- `end_date=None`: 查询日期，默认为今日

**返回值**: 生成更新后的CSV文件

**使用示例**:
```python
# 更新涨停率CSV
update_limit_rate_csv()

# 更新指定日期的涨停率CSV
update_limit_rate_csv('2026-03-05')
```

#### `update_limit_date_recommend` - 更新涨停日期推荐
**功能说明**: 更新涨停日期推荐，用于策略推荐

**参数说明**:
- `end_date=None`: 查询日期，默认为昨日

**返回值**: 生成推荐数据文件

**使用示例**:
```python
# 更新涨停日期推荐
update_limit_date_recommend()
```

### 10. 市值相关函数

#### `getshizhiValues` - 获取市值配置值
**功能说明**: 获取市值分位点的配置值

**参数说明**:
- `end_date=None`: 查询日期

**返回值**: 市值配置值列表

**使用示例**:
```python
# 获取今日市值配置值
values = getshizhiValues()

# 获取指定日期市值配置值
values = getshizhiValues('2026-03-05')
```

## 数据结构说明

### 股票基础数据结构
```python
# 基础数据包含字段
code          # 股票代码
name          # 股票名称
close         # 收盘价
open          # 开盘价
high          # 最高价
low           # 最低价
amount        # 成交额
vol           # 成交量
last_close    # 昨收价
```

### 扩展数据包含字段
```python
# 扩展数据在基础数据基础上增加
liutonggubenZ    # 流通股本（万）
liutongshizhiZ   # 流通市值（亿）
totalgubenZ      # 总股本（万）
totalshizhiZ     # 总市值（亿）
mtype            # 市场类型（ZB主板，CY创业板，KC科创板）
```

### 涨停数据包含字段
```python
# 涨停数据在基础数据基础上增加
limitup      # 涨停价
limitdo      # 跌停价
is_limit_up  # 是否涨停
is_limit_do  # 是否跌停
limit_time   # 涨停时间
```

## 使用示例

### 综合示例：市值分析
```python
from FQMarket.FQUtil.ToolsGetData import *
from FQMarket.FQUtil.BBlock import getmarketshizhiquantile

# 1. 获取全市场股票数据
stock_data = GetStockList(extent_=True, limit_=True)

# 2. 计算市值分位点
market_quantile = getmarketshizhiquantile()
print(f"超大市值分位点: {market_quantile[0]}亿")
print(f"大市值分位点: {market_quantile[1]}亿") 
print(f"小市值分位点: {market_quantile[2]}亿")
print(f"微市值分位点: {market_quantile[3]}亿")

# 3. 获取各市值区间股票数量
print(f"超大市值股票数: {market_quantile[5]}")
print(f"大市值股票数: {market_quantile[6]}")
print(f"中市值股票数: {market_quantile[7]}")
print(f"小市值股票数: {market_quantile[8]}")
print(f"微市值股票数: {market_quantile[9]}")

# 4. 绘制市值分布图
draw_bar_marketshizhiquantile()
```

### 综合示例：涨停分析
```python
# 1. 获取涨停股票
limit_stocks = getstockopenlimit(type_='up', only=False)

# 2. 获取涨停板块统计
limit_blocks = get_stock_limit_block(json=False)

# 3. 分析涨停板块
print("涨停板块统计:")
for _, row in limit_blocks.iterrows():
    if row['acount'] > 5:  # 涨停数大于5的板块
        print(f"板块: {row['blockname']}, 涨停数: {row['acount']}, 炸板数: {row['bcount']}")

# 4. 绘制连板统计图
draw_stock_limit_block(days=10)
```

### 综合示例：主线识别
```python
# 1. 获取竞价主线板块
stocks, main_blocks, all_blocks = GetMarkerOpenSelectBlock()

print("主线板块:")
for block in main_blocks:
    print(f"- {block}")

print("相关股票:")
for stock in stocks[:10]:  # 前10只股票
    print(f"- {stock}")

# 2. 获取策略数据
r0, base1, r1, base2 = getStraOneLimit()

if len(r0) > 0:
    print(f"策略命中数: {len(r0)}, 命中率: {len(r0)/len(base1):.2%}")
```

### 综合示例：竞价选股完整流程
```python
from FQMarket.FQUtil.ToolsGetData import *

# 1. 获取市场状态
print("=== 市场状态 ===")
market_status = JsonMarketStatusData()
print(market_status)

# 2. 获取股票列表
print("\n=== 获取股票列表 ===")
stock_data = GetStockList(extent_=True, limit_=True)
print(f"总股票数: {len(stock_data)}")

# 3. 获取竞价选股结果
print("\n=== 竞价选股 ===")
stock1, stock2, stock3, stock4, data = get_open_select_stock_list('2026-03-05')
print(f"股票池1数量: {len(stock1)}")
print(f"股票池2数量: {len(stock2)}")
print(f"股票池3数量: {len(stock3)}")

# 4. 分析股票池概念
print("\n=== 股票池概念分析 ===")
if len(stock1) > 0:
    concept_stats = get_stock_con(stock1, show=True)
    print(concept_stats)

# 5. 计算市值分位点
print("\n=== 市值分位点 ===")
from FQMarket.FQUtil.BBlock import getmarketshizhiquantile
market_quantile = getmarketshizhiquantile()
print(f"超大市值分位点: {market_quantile[0]}亿")
print(f"小市值分位点: {market_quantile[2]}亿")

# 6. 获取涨停股票
print("\n=== 涨停股票 ===")
limit_stocks = getstockopenlimit(type_='up', only=False)
print(f"今日涨停股票数: {len(limit_stocks)}")

# 7. 绘制图表
print("\n=== 生成图表 ===")
draw_bar_marketshizhiquantile()  # 市值分布图
draw_stock_limit_block(days=10)  # 连板统计图
print("图表生成完成！")
```

### 综合示例：策略回测流程
```python
from FQMarket.FQUtil.ToolsGetData import *

# 1. 准备回测日期
end_date = '2026-03-05'
tomorrow = '2026-03-06'

# 2. 获取竞价选股结果
print("=== 获取竞价选股 ===")
stock1, stock2, stock3, stock4, data = get_open_select_stock_list(end_date)

# 3. 对结果进行排序过滤
print("\n=== 排序过滤 ===")
sorted_stock = df_sort_filter(stock1)
print(f"排序后股票数: {len(sorted_stock)}")

# 4. 获取策略数据
print("\n=== 策略回测 ===")
r0, base1, r1, base2 = getStraOneLimit(end_date)

# 5. 分析策略结果
if len(r0) > 0:
    print(f"\n策略结果:")
    print(f"命中数: {len(r0)}")
    print(f"基础池数量: {len(base1)}")
    print(f"命中率: {len(r0)/len(base1):.2%}")
    
    # 6. 计算明日表现
    print("\n=== 明日表现预测 ===")
    tomorrow_rate = CaluLimitTomo01Rate(tomorrow, r0.code.tolist())
    print(tomorrow_rate)
```

## 注意事项

1. **数据缓存**: 模块使用Redis缓存部分数据（如板块列表），提高查询效率
2. **日期处理**: 支持自动获取交易日，非交易日会自动调整为最近交易日
3. **空值处理**: 函数内部包含完善的空值检查，确保数据稳健性
4. **板块过滤**: 默认过滤北交所股票（代码以9、4、8开头）
5. **市值单位**: 市值相关数据单位为亿元，股本数据单位为万股
6. **性能优化**: 支持批量查询和数据缓存，适合大规模数据分析

## 依赖模块

- `FQMarket.FQUtil.BBlock`: 板块相关功能
- `FQMarket.FQUtil.Tools`: 工具函数（getfinancialdate, SendData2Json, pretty_floats4）
- `FQMarket.FQUtil.ToolsStrategyPools`: 策略池功能（load_strategy_pools）
- `FQMarket.FQUtil.ToolsSaveLocalData`: 本地数据功能（load_yjhy, get_stock_hyblock_tdx_loc）
- `FQMarket.FQUtil.Parameter`: 全局参数
- `FQData`: 数据获取框架
- `QUANTAXIS`: 基础量化框架
- `pandas`: 数据处理
- `numpy`: 数值计算
- `pymongo`: MongoDB数据库
- `redis`: 缓存服务
- `pyecharts`: 数据可视化
- `dotty_dict`: 字典操作工具
- `direct_redis`: Redis直接连接