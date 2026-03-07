# ToolsSaveData 模块文档

## 模块概述

ToolsSaveData 模块是 FQuant 量化交易系统的核心数据保存和更新模块，负责股票、指数、板块等各类数据的获取、保存、更新和分析工作。该模块整合了多种数据源，支持定时任务执行，为交易策略提供完整的数据支持。

### 核心功能分类

1. **数据保存** - 保存股票、指数、板块等基础数据
2. **基金净值计算** - 计算和更新基金组合净值
3. **策略池保存** - 保存各类策略池数据
4. **JSON数据输出** - 生成各类JSON数据供前端展示
5. **指数和市场分析** - 分析指数走势、市场状态等
6. **定时任务** - 支持开盘前、盘中、盘后的数据更新

## 数据保存函数

### `save1600` - 保存当日全量数据
**功能说明**: 保存当日的所有基础数据，包括指数、板块、股票列表、日线数据等，大概需要90-120分钟完成。

**参数说明**:
- `xdxr=True`: 是否更新除权除息数据

**执行流程**:
1. 保存基础代码数据（股票列表、北交所数据、可转债列表等）
2. 保存日线数据（指数、股票、除权除息）
3. 保存扩展数据（市场数据、涨停数据、市值分布等）
4. 发送微信通知

**使用示例**:
```python
# 保存当日全量数据
save1600(xdxr=True)
```

### `updateBaseData` - 更新股票和指数基础数据
**功能说明**: 更新股票和指数的基础数据、因子数据、策略池数据等。

**参数说明**: 无

**返回值**: 成功返回True，失败返回False

**执行流程**:
1. 检查股票日线数据完整性
2. 保存市场股票因子数据
3. 保存指数基础数据和因子数据
4. 更新行业和概念数据
5. 保存各类策略池数据
6. 生成各类分析图表
7. 更新市场状态和涨停统计

**使用示例**:
```python
# 更新基础数据
success = updateBaseData()
if success:
    print("数据更新成功")
else:
    print("数据更新失败")
```

### `save2400` - 保存财务信息
**功能说明**: 保存财务信息，每天凌晨执行。

**参数说明**: 无

**执行流程**:
1. 保存财务文件
2. 保存单个股票数据
3. 更新除权除息数据

**使用示例**:
```python
# 保存财务信息
save2400()
```

### `saveBaseInfo` - 更新基本信息
**功能说明**: 更新基本信息，每天开盘前（约9点）证券公司更新后执行。

**参数说明**: 无

**执行流程**:
1. 保存股票信息
2. 保存指数列表
3. 保存股票列表

**使用示例**:
```python
# 更新基本信息
saveBaseInfo()
```

### `saveFutureDay` - 保存期货日线数据
**功能说明**: 盘前初始化信息，存入Redis。

**参数说明**: 无

**执行流程**:
1. 保存CNTY和ATY期货数据
2. 保存人民币汇率数据

**使用示例**:
```python
# 保存期货日线数据
saveFutureDay()
```

### `saveLhbData` - 保存龙虎榜数据
**功能说明**: 保存龙虎榜数据。

**参数说明**: 无

**执行流程**:
1. 从东方财富保存龙虎榜数据
2. 保存股票龙虎榜日线数据

**使用示例**:
```python
# 保存龙虎榜数据
saveLhbData()
```

### `saveLaterData` - 保存滞后数据
**功能说明**: 盘后更新一些滞后数据。

**参数说明**: 无

**执行流程**:
1. 保存北上资金数据
2. 保存融资融券数据
3. 保存上海同行拆借数据

**使用示例**:
```python
# 保存滞后数据
saveLaterData()
```

### `saveblock` - 保存板块数据
**功能说明**: 保存板块数据。

**参数说明**: 无

**执行流程**:
1. 保存通达信板块数据
2. 修订概念名称，保持概念名一致

**使用示例**:
```python
# 保存板块数据
saveblock()
```

### `save_stock_list_bj` - 保存北交所股票列表
**功能说明**: 保存北交所股票列表数据。

**参数说明**:
- `client=DATABASE`: 数据库连接

**使用示例**:
```python
# 保存北交所股票列表
save_stock_list_bj()
```

### `re_stock_xdxr` - 重新计算除权除息数据
**功能说明**: 每日盘前重算当日除权除息的前复权数据。

**参数说明**:
- `end_date=None`: 结束日期，默认为今日
- `client=DATABASE`: 数据库连接

**执行流程**:
1. 取当日除权除息数据（stock_xdxr）
2. 重新运算adj表
3. 重新运算所有数据

**使用示例**:
```python
# 重新计算除权除息数据
re_stock_xdxr()
```

### `re_check_adj` - 检查复权数据完整性
**功能说明**: 检查每日adj完整性情况，保存的adj数量和全部列表的数量是否一致。

**参数说明**:
- `end_date=None`: 结束日期，默认为今日
- `client=DATABASE`: 数据库连接

**使用示例**:
```python
# 检查复权数据完整性
re_check_adj()
```

### `save_market_open` - 保存市场开盘数据
**功能说明**: 保存市场开盘数据，包括涨跌家数、成交额、换手率等。

**参数说明**:
- `end_date=None`: 结束日期，默认为今日
- `client=DATABASE`: 数据库连接

**使用示例**:
```python
# 保存市场开盘数据
save_market_open()
```

### `save_stock_open_extent` - 保存股票开盘扩展数据
**功能说明**: 保存股票开盘扩展数据，包括竞价成交金额、量比、换手率等。

**参数说明**:
- `end_date=None`: 结束日期，默认为今日
- `client=DATABASE`: 数据库连接

**使用示例**:
```python
# 保存股票开盘扩展数据
save_stock_open_extent()
```

### `save_stock_limit_block_0` - 保存昨曾涨停板块统计
**功能说明**: 统计并保存昨曾涨停股票的板块数据。

**参数说明**:
- `end_date=None`: 结束日期，默认为今日
- `save=True`: 是否保存到数据库

**返回值**: 如果save=False，返回统计数据的DataFrame

**使用示例**:
```python
# 保存昨曾涨停板块统计
save_stock_limit_block_0()

# 获取昨曾涨停板块统计数据
data = save_stock_limit_block_0(save=False)
```

### `save_stock_limit_block_1` - 保存昨日涨停概念统计
**功能说明**: 统计并保存昨日涨停股票的概念数据。

**参数说明**:
- `end_date=None`: 结束日期，默认为今日
- `save=True`: 是否保存到数据库

**返回值**: 如果save=False，返回统计数据的DataFrame

**使用示例**:
```python
# 保存昨日涨停概念统计
save_stock_limit_block_1()

# 获取昨日涨停概念统计数据
data = save_stock_limit_block_1(save=False)
```

## 基金净值计算函数

### `caluFundsNetworth` - 计算基金组合净值
**功能说明**: 更新基金组合净值，包括芝麻开花系列组合。

**参数说明**:
- `renew=False`: 是否重新计算
- `end_date=None`: 结束日期

**执行流程**:
1. 初始化基金组合模拟对象
2. 计算基金净值
3. 写入净值JSON
4. 写入持仓JSON
5. 生成HTML报告

**使用示例**:
```python
# 计算基金组合净值
caluFundsNetworth(renew=False)

# 重新计算基金组合净值
caluFundsNetworth(renew=True, end_date='2026-03-05')
```

### `caluFundsNetworth_ShowPools` - 计算基金净值（展示股票池）
**功能说明**: 计算基金净值，用于展示不同股票池大小的表现。

**参数说明**:
- `renew=False`: 是否重新计算
- `end_date=None`: 结束日期

**使用示例**:
```python
# 计算基金净值（展示股票池）
caluFundsNetworth_ShowPools(renew=False)
```

## 初始化和加载函数

### `loadInitData` - 加载初始化数据
**功能说明**: 加载初始化数据，存入Redis。

**参数说明**:
- `pretreat=False`: 是否预处理

**执行流程**:
1. 修订概念名称
2. 初始化板块数据
3. 初始化概念数据
4. 预处理（如果需要）或正常加载
5. 设置Redis空值
6. 初始化股票列表
7. 初始化指数数据
8. 设置市值分位值

**使用示例**:
```python
# 加载初始化数据
loadInitData(pretreat=False)

# 加载初始化数据并预处理
loadInitData(pretreat=True)
```

## 定时任务函数

### `DoWorks1500` - 尾盘处理
**功能说明**: 尾盘处理，15:00执行。

**参数说明**: 无

**执行流程**:
1. 初始化基金组合模拟对象
2. 执行尾盘处理
3. 发送微信通知

**使用示例**:
```python
# 尾盘处理
DoWorks1500()
```

### `DoWorks0800` - 早盘推送买入信息
**功能说明**: 早盘推送买入信息，08:00执行。

**参数说明**: 无

**执行流程**:
1. 初始化基金组合模拟对象
2. 执行早盘处理
3. 发送微信通知

**使用示例**:
```python
# 早盘推送买入信息
DoWorks0800()
```

## 数据检查和修复函数

### `GetLostStockData` - 获取丢失的股票数据
**功能说明**: 校验新股数据不完整的情况，上市第二天数据重新运算一次。

**参数说明**: 无

**执行流程**:
1. 获取今日日期
2. 获取股票基本信息
3. 找出上市第二天的股票
4. 重新保存这些股票的日线数据
5. 重新保存除权除息数据
6. 重新初始化股票数据

**使用示例**:
```python
# 获取丢失的股票数据
GetLostStockData()
```

## JSON数据输出函数

### `JsonPools` - 输出策略池JSON
**功能说明**: 生成策略池JSON数据。

**参数说明**:
- `end_date=None`: 查询日期，默认为今日

**执行流程**:
1. 获取今日日期
2. 获取各个策略池的股票代码和数量
3. 生成JSON数据
4. 保存为pools.json

**使用示例**:
```python
# 输出策略池JSON
JsonPools()

# 输出指定日期的策略池JSON
JsonPools('2026-03-05')
```

### `JsonMarketStatus` - 输出市场状态JSON
**功能说明**: 生成市场状态JSON数据。

**参数说明**:
- `end_date=None`: 查询日期，默认为今日

**执行流程**:
1. 获取今日日期
2. 获取市场状态数据
3. 生成JSON数据
4. 保存为JsonMarketStatus.json

**使用示例**:
```python
# 输出市场状态JSON
JsonMarketStatus()

# 输出指定日期的市场状态JSON
JsonMarketStatus('2026-03-05')
```

### `JsonAmountTop10` - 输出成交额前10JSON
**功能说明**: 生成成交额前10的JSON数据。

**参数说明**:
- `end_date=None`: 查询日期，默认为今日
- `top=10`: 前多少名

**执行流程**:
1. 获取今日日期
2. 获取成交额前N的股票
3. 生成JSON数据
4. 保存为JsonAmountTop.json

**使用示例**:
```python
# 输出成交额前10JSON
JsonAmountTop10()

# 输出成交额前20JSON
JsonAmountTop10(top=20)
```

## 股票池文件输出函数

### `WriteTDXPoolsFiles` - 写通达信股票池文件
**功能说明**: 写通达信股票池文件（写入后无效果）。

**参数说明**:
- `end_date=None`: 查询日期，默认为今日

**执行流程**:
1. 获取今日日期
2. 获取各个策略池的股票代码
3. 转换为通达信格式
4. 保存为.blk文件
5. 发送微信通知

**使用示例**:
```python
# 写通达信股票池文件
WriteTDXPoolsFiles()

# 写指定日期的通达信股票池文件
WriteTDXPoolsFiles('2026-03-05')
```

### `CsvPools2Joinquant` - 输出CSV股票池到聚宽
**功能说明**: 输出CSV股票池到聚宽。

**参数说明**:
- `end_date=None`: 查询日期，默认为今日

**执行流程**:
1. 获取今日日期
2. 获取strong策略池的股票代码
3. 保存为CSV文件

**使用示例**:
```python
# 输出CSV股票池到聚宽
CsvPools2Joinquant()

# 输出指定日期的CSV股票池到聚宽
CsvPools2Joinquant('2026-03-05')
```

## 指数和市场分析函数

### `indexupdown` - 指数涨跌分析
**功能说明**: 分析指数、行业、概念的涨跌情况。

**参数说明**:
- `end_date=None`: 查询日期，默认为今日
- `type_='INDEX'`: 类型（INDEX/IND/CON）
- `client=DATABASE`: 数据库连接

**返回值**: DataFrame 包含指数涨跌分析数据

**使用示例**:
```python
# 指数涨跌分析
index_data = indexupdown(type_='INDEX')

# 行业涨跌分析
industry_data = indexupdown(type_='IND')

# 概念涨跌分析
concept_data = indexupdown(type_='CON')
```

### `checkstatus_pipeline` - 检查状态流水线
**功能说明**: 检查指数或期货的状态。

**参数说明**:
- `code`: 代码
- `end_date=None`: 结束日期
- `type_='INDEX'`: 类型（INDEX/FUTURE）

**返回值**: 三元组（状态列表，方向，年线位置）

**使用示例**:
```python
# 检查指数状态
status, direction, ma250 = checkstatus_pipeline('000001', type_='INDEX')

# 检查期货状态
status, direction, ma250 = checkstatus_pipeline('5_CNTY', type_='FUTURE')
```

### `getexitslit` - 获取退市股票
**功能说明**: 获取面值退市和退市整理的股票。

**参数说明**:
- `end_date=None`: 查询日期，默认为今日
- `client=DATABASE`: 数据库连接

**执行流程**:
1. 获取今日日期
2. 获取股票列表
3. 找出面值退市股票（价格<1元）
4. 计算连续低于1元的天数
5. 找出退市整理股票（名称含"退"）
6. 生成JSON数据
7. 保存为exitstock.json

**使用示例**:
```python
# 获取退市股票
getexitslit()

# 获取指定日期的退市股票
getexitslit('2026-03-05')
```

### `saveIndexScatter` - 保存指数散点数据
**功能说明**: 创建指数重叠检查DataFrame，分析各指数之间的成分股重叠情况，并生成JSON文件。

**参数说明**:
- `end_date=None`: 查询日期，默认为今日

**执行流程**:
1. 获取各主要指数的成分股列表
2. 计算指数之间的成分股重叠数量
3. 生成指数重叠统计表
4. 保存为GridIndexScatter.json

**分析的指数**:
- 沪深300 (000300)
- 中证500 (000905)
- 中证1000 (000852)
- 上证180 (000009)
- 上证380 (000010)
- 上证150 (000133)
- 深证100 (399009)
- 深证200 (399010)
- 深证700 (399330)
- 科创50 (000688)

**使用示例**:
```python
# 保存指数散点数据
saveIndexScatter()

# 保存指定日期的指数散点数据
saveIndexScatter('2026-03-05')
```

## 工具函数

### `clearXDXRDay` - 清除除权除息日数据
**功能说明**: 清除当日除权除息个股因子，在运算每日因子库之前调用（适用于修复数据的逻辑）。

**参数说明**:
- `date=None`: 日期
- `calu=False`: 是否重新计算
- `client=DATABASE`: 数据库连接

**使用示例**:
```python
# 清除除权除息日数据
clearXDXRDay(date='2026-03-05')

# 清除除权除息日数据并重新计算
clearXDXRDay(date='2026-03-05', calu=True)
```

### `delete_ins_data` - 删除指数数据
**功能说明**: 删除指定代码的指数数据。

**参数说明**:
- `code`: 代码

**使用示例**:
```python
# 删除指数数据
delete_ins_data('000001')
```

### `saveSingleJoin` - 保存单个组合数据
**功能说明**: 保存单个组合数据，用于分析策略表现。

**参数说明**:
- `end_date=None`: 结束日期，默认为今日
- `client=DATABASE`: 数据库连接

**执行流程**:
1. 获取指数数据
2. 获取市场数据
3. 获取策略池数据
4. 保存为CSV文件

**使用示例**:
```python
# 保存单个组合数据
saveSingleJoin()
```

### `save_stock_data_open_from_jq` - 从聚宽保存股票开盘数据
**功能说明**: 从聚宽获取的CSV文件中保存股票开盘数据。

**参数说明**:
- `filename`: CSV文件名

**使用示例**:
```python
# 从聚宽保存股票开盘数据
save_stock_data_open_from_jq('stock_open.csv')
```

### `save_liutonggubenZ` - 保存流通股本数据
**功能说明**: 保存流通股本数据（gubenZ），用于计算市值和换手率。

**参数说明**:
- `ui_log=None`: UI日志对象
- `ui_progress=None`: UI进度对象
- `client=DATABASE`: 数据库连接

**使用示例**:
```python
# 保存流通股本数据
save_liutonggubenZ()
```

### `save_stock_amo_pct_from_csv` - 从CSV保存涨停资金流向数据
**功能说明**: 从CSV文件中保存涨停的资金流向数据。

**参数说明**:
- `filename`: CSV文件名
- `query_id=None`: 查询条件
- `client=DATABASE`: 数据库连接

**返回值**: 保存的数据DataFrame

**使用示例**:
```python
# 从CSV保存涨停资金流向数据
data = save_stock_amo_pct_from_csv('limit_amo.csv')
```

### `save_icfqs_concept` - 保存通达信概念主题详细信息
**功能说明**: 从icfqs网站获取并保存通达信概念主题详细信息。

**参数说明**:
- `end_date=None`: 结束日期，默认为今日
- `client=DATABASE`: 数据库连接

**返回值**: 获取的数据数量

**使用示例**:
```python
# 保存通达信概念主题详细信息
count = save_icfqs_concept()
```

### `save_stock_concept_hot_list_2json` - 保存概念热点列表到JSON
**功能说明**: 获取概念热点列表并保存为JSON文件。

**参数说明**:
- `end_date=None`: 结束日期，默认为今日
- `client=DATABASE`: 数据库连接

**使用示例**:
```python
# 保存概念热点列表到JSON
save_stock_concept_hot_list_2json()
```

### `save_icfqs_concept_year` - 按年份批量保存概念信息
**功能说明**: 按自然年批量保存概念信息。

**参数说明**:
- `year=2025`: 年份
- `delay=10`: 请求间隔（秒）

**使用示例**:
```python
# 按年份批量保存概念信息
save_icfqs_concept_year(year=2025, delay=10)
```

### `save_hot2json` - 保存热点到JSON
**功能说明**: 保存市场热点数据到JSON文件，包括高标、中位、首板等。

**参数说明**: 无

**使用示例**:
```python
# 保存热点到JSON
save_hot2json()
```

### `UpdateTuishiStockDay` - 更新退市股票日线数据
**功能说明**: 从akshare获取并更新退市股票的日线数据。

**参数说明**: 无

**使用示例**:
```python
# 更新退市股票日线数据
UpdateTuishiStockDay()
```

## 综合使用示例

### 完整的数据更新流程
```python
from FQMarket.FQUtil.ToolsSaveData import *

# 1. 开盘前更新基本信息
print("=== 更新基本信息 ===")
saveBaseInfo()

# 2. 保存期货日线数据
print("=== 保存期货日线数据 ===")
saveFutureDay()

# 3. 加载初始化数据
print("=== 加载初始化数据 ===")
loadInitData(pretreat=False)

# 4. 早盘推送
print("=== 早盘推送 ===")
DoWorks0800()

# 5. 尾盘处理
print("=== 尾盘处理 ===")
DoWorks1500()

# 6. 盘后保存全量数据
print("=== 保存全量数据 ===")
save1600(xdxr=True)

# 7. 更新基础数据
print("=== 更新基础数据 ===")
success = updateBaseData()
if success:
    print("数据更新成功！")
else:
    print("数据更新失败！")

# 8. 保存财务信息
print("=== 保存财务信息 ===")
save2400()

# 9. 保存滞后数据
print("=== 保存滞后数据 ===")
saveLaterData()

# 10. 保存龙虎榜数据
print("=== 保存龙虎榜数据 ===")
saveLhbData()
```

### 基金净值计算流程
```python
from FQMarket.FQUtil.ToolsSaveData import *

# 1. 计算基金组合净值
print("=== 计算基金组合净值 ===")
caluFundsNetworth(renew=False)

# 2. 重新计算基金组合净值
print("=== 重新计算基金组合净值 ===")
caluFundsNetworth(renew=True, end_date='2026-03-05')
```

### JSON数据生成流程
```python
from FQMarket.FQUtil.ToolsSaveData import *

# 1. 输出策略池JSON
print("=== 输出策略池JSON ===")
JsonPools()

# 2. 输出市场状态JSON
print("=== 输出市场状态JSON ===")
JsonMarketStatus()

# 3. 输出成交额前10JSON
print("=== 输出成交额前10JSON ===")
JsonAmountTop10(top=10)

# 4. 写通达信股票池文件
print("=== 写通达信股票池文件 ===")
WriteTDXPoolsFiles()

# 5. 输出CSV股票池到聚宽
print("=== 输出CSV股票池到聚宽 ===")
CsvPools2Joinquant()
```

### 指数和市场分析流程
```python
from FQMarket.FQUtil.ToolsSaveData import *

# 1. 指数涨跌分析
print("=== 指数涨跌分析 ===")
index_data = indexupdown(type_='INDEX')
print(index_data)

# 2. 行业涨跌分析
print("=== 行业涨跌分析 ===")
industry_data = indexupdown(type_='IND')
print(industry_data)

# 3. 概念涨跌分析
print("=== 概念涨跌分析 ===")
concept_data = indexupdown(type_='CON')
print(concept_data)

# 4. 检查指数状态
print("=== 检查指数状态 ===")
status, direction, ma250 = checkstatus_pipeline('000001', type_='INDEX')
print(f"状态: {status}")
print(f"方向: {direction}")
print(f"年线位置: {ma250}")

# 5. 获取退市股票
print("=== 获取退市股票 ===")
getexitslit()
```

## 注意事项

1. **执行时间**: save1600() 大概需要90-120分钟完成，请在非交易时间执行
2. **数据完整性**: 执行 updateBaseData() 前会检查股票日线数据完整性
3. **定时任务**: 
   - saveBaseInfo() 每天开盘前（约9点）执行
   - DoWorks0800() 早盘08:00执行
   - DoWorks1500() 尾盘15:00执行
   - save2400() 每天凌晨执行
4. **Redis依赖**: loadInitData() 会将数据存入Redis，确保Redis服务正常运行
5. **微信通知**: 大部分函数执行完成后会发送微信通知
6. **数据修复**: GetLostStockData() 用于修复新股数据不完整的情况
7. **除权除息**: clearXDXRDay() 用于修复除权除息数据，正常情况下不需要调用

## 已注释函数说明

以下函数在代码中已被注释，不再使用：

### `checkwillstoptradeoneday` - 检查明日停牌股票
**功能说明**: 检查可能明日停牌的股票，包括10天涨幅超过100%、30天涨幅超过200%、10日内4次价格异动等情况。

**参数说明**:
- `end_date=None`: 查询日期，默认为今日

### `save_stock_hot_rank_from_wc` - 保存微博股票热度排名
**功能说明**: 从微博获取股票热度排名数据。由于接口变化和反爬限制，此函数已被注释。

**参数说明**:
- `end_date=None`: 查询日期，默认为今日
- `client=DATABASE`: 数据库连接

**注意事项**: 
- 连续爬取不间断会被封IP，建议每日间隔20秒
- 接口可能变化，需要定期更新

## 依赖模块

- `FQMarket.FQUtil.Tools`: 工具函数（SendData2Json, checked_index_change_date）
- `FQMarket.FQUtil.BBlock`: 板块相关功能
- `FQMarket.FQUtil.CMarketData`: 市场数据处理
- `FQMarket.FQUtil.CIndustryData`: 行业数据处理
- `FQMarket.FQUtil.CConceptData`: 概念数据处理
- `FQMarket.FQUtil.CStockData`: 股票数据处理
- `FQMarket.FQUtil.Parameter`: 全局参数
- `FQMarket.FQUtil.CRPSData`: RPS数据处理
- `FQMarket.FQUtil.ToolsGetData`: 数据获取工具
- `FQMarket.FQUtil.ToolsCheckData`: 数据检查工具
- `FQMarket.FQUtil.ToolsGMI`: GMI数据工具
- `FQMarket.FQUtil.ToolsLhbData`: 龙虎榜数据工具
- `FQMarket.FQUtil.ToolsRedisData`: Redis数据工具
- `FQMarket.FQUtil.ToolsJianGuan`: 监管数据工具
- `FQMarket.Simulate.CPoolsSimulate`: 基金组合模拟
- `FQMarket.StrategyPools.*`: 各类策略池
- `FQMarket.AnalysisTools.*`: 各类分析工具
- `FQData.QASU.*`: 数据保存模块
- `FQData.QAFetch.*`: 数据获取模块
- `FQData.QAUtil.*`: 数据工具模块
- `akshare`: 东方财富数据接口
- `pandas`: 数据处理
- `pymongo`: MongoDB数据库
- `dotty_dict`: 字典操作工具