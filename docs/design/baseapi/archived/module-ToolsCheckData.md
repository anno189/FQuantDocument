# ToolsCheckData 模块文档

## 模块概述

ToolsCheckData 模块是 FQuant 量化交易系统的数据校验和检查模块，提供股票日线数据校验、指数和概念代码校验、股票数据完整性检查、时间权重计算、策略池检查等功能。该模块确保系统数据的完整性和正确性。

### 全局变量

- `r`: DirectRedis 连接对象，用于 Redis 数据缓存
  - 连接地址：localhost:6379
  - 用于缓存各种数据对象

### 核心功能分类

1. **股票日线数据校验** - 校验日线数据、因子数据、扩展数据的正确性
2. **指数和概念代码校验** - 检查指数和概念代码同步
3. **股票数据完整性检查** - 检查各数据表数据数量一致性
4. **时间权重计算** - 计算近250天分时成交量权重
5. **策略池检查** - 检查策略池数据上传
6. **可转债检查** - 检查可转债数据
7. **数据修复** - 修复错误数据
8. **服务器数据检查** - 检查服务器数据取数

## 股票日线数据校验

### `check_stock_day_data` - 随机校验日线数据
**功能说明**: 随机选取5只股票校验日线数据与因子数据、扩展数据、复权数据是否一致。

**参数说明**:
- `end_date=None`: 结束日期，默认为今日

**返回值**: 布尔值，True 表示数据正确，False 表示有错误

**校验内容**:
1. 检查 stock_day 与 stock_data_base 数据一致性
2. 检查 stock_day 与 stock_data_extent 数据一致性
3. 检查 stock_adj 数据完整性

**使用示例**:
```python
# 校验日线数据
is_valid = check_stock_day_data()
if is_valid:
    print("日线数据校验通过")
else:
    print("日线数据有错误")
```

### `checkstockdata_dayerror0` - 检查日线数据0错误
**功能说明**: 检查 stock_day 表中是否存在收盘价为0的错误数据。

**参数说明**:
- `end_date=None`: 查询日期

**返回值**: 字符串，检查结果信息

**使用示例**:
```python
# 检查日线数据0错误
result = checkstockdata_dayerror0('2026-03-06')
print(result)
```

### `checkstockdata_extenterror0` - 检查扩展数据0错误
**功能说明**: 检查 stock_data_extent 表中是否存在收盘价为0的错误数据。

**参数说明**:
- `end_date`: 查询日期

**返回值**: 字符串，检查结果信息

**使用示例**:
```python
# 检查扩展数据0错误
result = checkstockdata_extenterror0('2026-03-06')
print(result)
```

### `checkstockdata_factorerror0` - 检查因子数据0错误
**功能说明**: 检查 stock_data_factor 表中是否存在收盘价为0的错误数据。

**参数说明**:
- `end_date`: 查询日期

**返回值**: 字符串，检查结果信息

**使用示例**:
```python
# 检查因子数据0错误
result = checkstockdata_factorerror0('2026-03-06')
print(result)
```

### `checkstockdata_complete` - 检查股票数据完整性
**功能说明**: 检查各股票数据表的数据数量是否一致。

**参数说明**:
- `end_date=None`: 查询日期

**返回值**: 字符串，检查结果信息

**检查内容**:
- stock_data_base 数据数量
- stock_data_extent 数据数量
- stock_data_factor 数据数量

**使用示例**:
```python
# 检查股票数据完整性
result = checkstockdata_complete('2026-03-06')
print(result)
```

### `modifyfactor_error0` - 修复数据因子错误
**功能说明**: 删除并重新计算有错误的因子数据。

**参数说明**:
- `date`: 开始修复的日期

**修复流程**:
1. 删除有错误的股票的所有数据
2. 重新初始化股票数据
3. 重新计算行业数据
4. 重新计算概念数据
5. 删除策略池数据

**使用示例**:
```python
# 修复数据因子错误
modifyfactor_error0('2026-01-01')
```

## 指数和概念代码校验

### `checkindexdata` - 校验指数代码
**功能说明**: 校验指数代码与系统代码是否同步。

**参数说明**:
- `end_date=None`: 查询日期
- `drop=False`: 是否删除不匹配的指数数据

**返回值**: 字符串，检查结果信息

**检查的指数类型**:
- 宽基指数（widthindex.csv）
- 通达信行业
- 通达信概念

**使用示例**:
```python
# 校验指数代码
result = checkindexdata('2026-03-06')
print(result)

# 校验并删除不匹配的数据
checkindexdata('2026-03-06', drop=True)
```

### `checkconceptcode` - 校验概念代码
**功能说明**: 检查概念代码是否有新增或减少。

**参数说明**:
- `end_date=None`: 查询日期

**返回值**: 字符串，检查结果信息

**检查内容**:
- 检查可能新增的概念
- 检查可能减少的概念
- 发送微信通知

**使用示例**:
```python
# 校验概念代码
result = checkconceptcode('2026-03-06')
print(result)
```

### `dailycheckdata` - 每日数据检查
**功能说明**: 执行所有每日数据检查。

**参数说明**:
- `end_date=None`: 查询日期

**返回值**: 字符串，所有检查结果信息

**检查内容**:
1. 指数代码检查
2. 日线数据0错误检查
3. 扩展数据0错误检查
4. 因子数据0错误检查
5. 股票数据完整性检查
6. 概念代码检查

**使用示例**:
```python
# 每日数据检查
result = dailycheckdata('2026-03-06')
print(result)
```

## 可转债检查

### `checkBond2Stockmins` - 检查可转债分钟数据
**功能说明**: 检查可转债分钟数据信号。

**参数说明**:
- `code`: 可转债代码
- `start_date`: 开始日期
- `end_date`: 结束日期
- `ma10`: MA10均线值
- `mins=240`: 分钟数

**返回值**: 元组 (signal, close, sell)
- signal: 信号值
- close: 收盘价
- sell: 卖出价

**技术指标**:
- KDJ指标（34/5/13, 89/8/34, 233/13/89）
- CF01指标
- 多均线系统

**使用示例**:
```python
# 检查可转债分钟数据
signal, close, sell = checkBond2Stockmins('123001', '2026-01-01', '2026-03-06', 100)
print(f"信号: {signal}, 收盘: {close}, 卖出: {sell}")
```

### `checkBund2Stock240` - 检查可转债240分钟
**功能说明**: 检查可转债240分钟数据（此函数未使用）。

**参数说明**:
- `mins=240`: 分钟数

**使用示例**:
```python
# 检查可转债240分钟
checkBund2Stock240(mins=240)
```

## 时间权重计算

### `get_time_weight_5min` - 获取5分钟时间权重
**功能说明**: 计算近250天的分时成交量的累计权重。

**参数说明**:
- `end_date`: 结束日期

**返回值**: 字典，包含各时间点的权重

**时间点**:
- 1分钟、5分钟、15分钟、30分钟、45分钟
- 60分钟、75分钟、90分钟、105分钟、120分钟
- 135分钟、150分钟、165分钟、180分钟、195分钟
- 210分钟、225分钟、240分钟

**使用示例**:
```python
# 获取5分钟时间权重
weights = get_time_weight_5min('2026-03-06')
print(weights)
```

### `get_time_weight` - 获取时间权重
**功能说明**: 获取时间权重并保存到Redis。

**参数说明**:
- `end_date=None`: 结束日期

**Redis Key**:
- AMOUNTRATE: 存储时间权重数据

**使用示例**:
```python
# 获取时间权重
get_time_weight('2026-03-06')
```

## 策略池检查

### `checkPoolsData` - 检查策略池数据
**功能说明**: 检查策略池数据是否上传。

**参数说明**:
- `end_date=None`: 结束日期

**检查内容**:
1. 检查 str60p20.csv 是否存在今日数据
2. 复制文件到Web目录
3. 检查Web目录文件是否存在今日数据
4. 发送微信通知

**使用示例**:
```python
# 检查策略池数据
checkPoolsData('2026-03-06')
```

### `checkStraOneLimit` - 检查策略一票限制
**功能说明**: 检查策略一票限制条件。

**参数说明**:
- `end_date=None`: 结束日期
- `ltsz_threshold=0.30`: 流通市值阈值
- `hot_=False`: 是否包含热度数据

**返回值**: DataFrame，包含过滤和条件信息

**过滤条件**:
- 北交所股票过滤
- 科创板股票过滤
- 流通市值过滤
- 资金流入过滤
- 价格上限过滤
- 换手率过滤
- 涨幅过滤
- 等等...

**条件标记**:
- 趋势多头条件
- 二波预期条件
- 成交前200条件
- CR多头条件

**使用示例**:
```python
# 检查策略一票限制
result = checkStraOneLimit('2026-03-06', ltsz_threshold=0.30)
print(result)

# 包含热度数据
result = checkStraOneLimit('2026-03-06', hot_=True)
print(result)
```

## 服务器数据检查

### `checkdataserver` - 检查服务器取数
**功能说明**: 检查服务器取数是否正常。

**检查内容**:
1. 香港恒生指数（HSI）
2. 880008指数
3. 美国国债（8_ATY）

**使用示例**:
```python
# 检查服务器取数
checkdataserver()
```

## 综合使用示例

### 示例1：每日数据检查完整流程
```python
from FQMarket.FQUtil.ToolsCheckData import *

# 1. 检查日线数据
print("=== 检查日线数据 ===")
is_valid = check_stock_day_data('2026-03-06')
if is_valid:
    print("日线数据校验通过")
else:
    print("日线数据有错误")

# 2. 检查0错误
print("\n=== 检查0错误 ===")
print(checkstockdata_dayerror0('2026-03-06'))
print(checkstockdata_extenterror0('2026-03-06'))
print(checkstockdata_factorerror0('2026-03-06'))

# 3. 检查数据完整性
print("\n=== 检查数据完整性 ===")
print(checkstockdata_complete('2026-03-06'))

# 4. 检查指数和概念
print("\n=== 检查指数和概念 ===")
print(checkindexdata('2026-03-06'))
print(checkconceptcode('2026-03-06'))

# 5. 每日完整检查
print("\n=== 每日完整检查 ===")
print(dailycheckdata('2026-03-06'))
```

### 示例2：时间权重计算
```python
from FQMarket.FQUtil.ToolsCheckData import *

# 1. 获取5分钟时间权重
print("=== 获取5分钟时间权重 ===")
weights = get_time_weight_5min('2026-03-06')
print("1分钟权重:", weights['1'])
print("5分钟权重:", weights['5'])
print("15分钟权重:", weights['15'])
print("30分钟权重:", weights['30'])
print("60分钟权重:", weights['60'])
print("120分钟权重:", weights['120'])
print("240分钟权重:", weights['240'])

# 2. 保存到Redis
print("\n=== 保存到Redis ===")
get_time_weight('2026-03-06')
print("时间权重已保存到Redis")
```

### 示例3：策略池检查
```python
from FQMarket.FQUtil.ToolsCheckData import *

# 1. 检查策略池数据
print("=== 检查策略池数据 ===")
checkPoolsData('2026-03-06')

# 2. 检查策略一票限制
print("\n=== 检查策略一票限制 ===")
result = checkStraOneLimit('2026-03-06', ltsz_threshold=0.30)
print(f"检查结果数量:", len(result))
print("\n前10只股票:")
print(result.head(10))

# 3. 包含热度数据
print("\n=== 包含热度数据 ===")
result_hot = checkStraOneLimit('2026-03-06', hot_=True)
print(f"包含热度的结果数量:", len(result_hot))
```

### 示例4：服务器数据检查
```python
from FQMarket.FQUtil.ToolsCheckData import *

# 1. 检查服务器取数
print("=== 检查服务器取数 ===")
checkdataserver()

# 2. 检查可转债
print("\n=== 检查可转债 ===")
# checkBund2Stock240(mins=240)
```

### 示例5：数据修复流程
```python
from FQMarket.FQUtil.ToolsCheckData import *

# 1. 先检查数据
print("=== 检查数据 ===")
result = dailycheckdata('2026-03-06')
print(result)

# 2. 如果发现错误，进行修复
print("\n=== 修复数据 ===")
# modifyfactor_error0('2026-01-01')
print("数据修复完成")

# 3. 再次检查
print("\n=== 再次检查 ===")
result = dailycheckdata('2026-03-06')
print(result)
```

## 注意事项

1. **数据完整性**: 每日应执行 dailycheckdata() 检查数据完整性
2. **指数同步**: 通达信会不定期维护概念代码，需要定期校验
3. **修复数据**: modifyfactor_error0() 会删除并重新计算数据，谨慎使用
4. **时间权重**: 时间权重基于近250天历史数据计算
5. **Redis依赖**: 模块使用 DirectRedis 连接 localhost:6379
6. **微信通知**: 大部分检查函数会发送微信通知
7. **随机校验**: check_stock_day_data() 随机选取5只股票进行校验
8. **策略池检查**: checkPoolsData() 会自动复制文件到Web目录

## 依赖模块

- `shutil`: 文件操作
- `pymongo`: MongoDB数据库
- `random`: 随机数生成
- `numpy`: 数值计算
- `pandas`: 数据处理
- `pandas._testing`: 数据帧比较
- `direct_redis`: Redis直接连接
- `dotty_dict`: 字典操作工具
- `FQData.QAUtil`: 数据工具
- `FQData.QASU.main`: 数据保存
- `FQData.QAFetch.QATdx`: 通达信数据获取
- `FQMarket.FQUtil.BBlock`: 板块功能
- `FQMarket.FQUtil.CMarket`: 市场数据
- `FQMarket.FQUtil.CIndexData`: 指数数据
- `FQMarket.FQUtil.CIndustryData`: 行业数据
- `FQMarket.FQUtil.CConceptData`: 概念数据
- `FQMarket.FQUtil.CFutureData`: 期货数据
- `FQMarket.FQUtil.Parameter`: 全局参数
- `FQMarket.FQUtil.ToolsGetData`: 数据获取工具
- `FQFactor.BaseFunction`: 基础因子函数
- `FQFactor.Indicator.IKDJ`: KDJ指标
- `FQFactor.Indicator.ICF01`: CF01指标

