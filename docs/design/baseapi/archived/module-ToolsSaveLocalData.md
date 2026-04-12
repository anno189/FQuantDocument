# ToolsSaveLocalData 模块文档

## 模块概述

ToolsSaveLocalData 模块提供从本地文件读取板块数据、行业数据等基础信息并保存到MongoDB数据库的功能。该模块主要处理通达信（TDX）格式的本地板块数据文件。

## 核心功能

- **板块文件读取**: 读取通达信板块数据文件
- **研究行业处理**: 处理研究行业数据
- **本地数据保存**: 将本地板块数据保存到数据库

## 依赖模块

- pandas
- direct_redis
- Parameter
- BBlock
- QAUtil

## 函数列表

| 函数名 | 功能描述 |
|--------|----------|
| save_tdx_yjhy_from_csv | 保存研究行业数据从CSV |
| load_yjhy | 加载研究行业数据 |
| GetStockconceptAndHyblock | 获取股票概念和行业板块 |
| get_block_file | 获取板块文件数据 |
| read_file_loc | 读取本地文件 |
| get_block_zs_tdx_loc | 获取板块指数通达信本地数据 |
| get_stock_hyblock_tdx_loc | 获取股票行业板块通达信本地数据 |
| hy_block | 处理行业板块数据 |
| save_block_from_local_data | 从本地数据保存板块数据 |

---

## 函数详细说明

### save_tdx_yjhy_from_csv(client=DATABASE)

保存研究行业数据从CSV文件中。

**参数:**
- `client` (MongoClient, optional): MongoDB客户端，默认为DATABASE

**返回值:**
- `DataFrame`: 保存的研究行业数据

**功能说明:**
- 从code_yjhy.csv读取研究行业代码
- 获取研究行业板块数据
- 合并数据并保存到code_stock_yjhy集合

**代码示例:**
```python
from FQMarket.FQUtil.ToolsSaveLocalData import save_tdx_yjhy_from_csv

# 保存研究行业数据
yjhy_data = save_tdx_yjhy_from_csv()
print(yjhy_data.head())
```

### load_yjhy(client=DATABASE)

加载研究行业数据。

**参数:**
- `client` (MongoClient, optional): MongoDB客户端，默认为DATABASE

**返回值:**
- `DataFrame`: 研究行业数据

**功能说明:**
- 从code_stock_yjhy集合读取数据
- 重命名列名为yjhycode和yjhyname

**代码示例:**
```python
from FQMarket.FQUtil.ToolsSaveLocalData import load_yjhy

# 加载研究行业数据
yjhy_data = load_yjhy()
print(yjhy_data)
```

### GetStockconceptAndHyblock(end_date)

获取股票概念和行业板块数据。

**参数:**
- `end_date` (str): 结束日期

**返回值:**
- `DataFrame`: 股票概念和行业板块数据

**功能说明:**
- 获取股票行业板块数据
- 获取研究行业数据
- 合并概念和行业板块数据
- 添加"近期高标"板块

**代码示例:**
```python
from FQMarket.FQUtil.ToolsSaveLocalData import GetStockconceptAndHyblock

# 获取股票概念和行业板块
data = GetStockconceptAndHyblock(end_date='2024-01-31')
print(data)
```

### get_block_file(block='gn')

获取板块文件数据。

**参数:**
- `block` (str, optional): 板块类型，默认为'gn'（概念）

**返回值:**
- `DataFrame`: 板块数据

**功能说明:**
- 读取通达信板块数据文件
- 支持hy（行业）、gn（概念）、fg（风格）、zs（指数）、yjhy（研究行业）等类型
- 解析二进制格式文件

**代码示例:**
```python
from FQMarket.FQUtil.ToolsSaveLocalData import get_block_file

# 获取概念板块
gn_block = get_block_file(block='gn')

# 获取行业板块
hy_block = get_block_file(block='hy')
print(gn_block)
```

### read_file_loc(file_name, splits)

读取本地文件。

**参数:**
- `file_name` (str): 文件名
- `splits` (str): 分隔符

**返回值:**
- `list`: 文件内容列表

**功能说明:**
- 按GBK编码读取文件
- 按指定分隔符分割每行

**代码示例:**
```python
from FQMarket.FQUtil.ToolsSaveLocalData import read_file_loc

# 读取本地文件
content = read_file_loc('file.txt', splits='|')
print(content)
```

### get_block_zs_tdx_loc(block='hy')

获取板块指数通达信本地数据。

**参数:**
- `block` (str, optional): 板块类型，默认为'hy'

**返回值:**
- `DataFrame`: 板块指数数据

**功能说明:**
- 读取tdxzs3.cfg文件
- 按板块类型筛选数据

**代码示例:**
```python
from FQMarket.FQUtil.ToolsSaveLocalData import get_block_zs_tdx_loc

# 获取行业板块指数
hy_zs = get_block_zs_tdx_loc(block='hy')
print(hy_zs)
```

### get_stock_hyblock_tdx_loc()

获取股票行业板块通达信本地数据。

**返回值:**
- `DataFrame`: 股票行业板块数据

**功能说明:**
- 读取tdxhy.cfg文件
- 解析股票代码、板块、研究行业等信息

**代码示例:**
```python
from FQMarket.FQUtil.ToolsSaveLocalData import get_stock_hyblock_tdx_loc

# 获取股票行业板块
stock_hy = get_stock_hyblock_tdx_loc()
print(stock_hy)
```

### hy_block(blk='hy')

处理行业板块数据。

**参数:**
- `blk` (str, optional): 板块类型，默认为'hy'

**返回值:**
- `DataFrame`: 处理后的行业板块数据

**功能说明:**
- 获取股票行业板块列表
- 获取板块列表
- 关联股票和板块
- 按股票代码排序

**代码示例:**
```python
from FQMarket.FQUtil.ToolsSaveLocalData import hy_block

# 处理行业板块
hy_data = hy_block(blk='hy')
print(hy_data)
```

### save_block_from_local_data(end_date=None, today_=False, client=DATABASE)

从本地数据保存板块数据到数据库。

**参数:**
- `end_date` (str, optional): 结束日期，默认为今日
- `today_` (bool, optional): 是否今日，默认为False
- `client` (MongoClient, optional): MongoDB客户端，默认为DATABASE

**功能说明:**
- 读取行业、概念、风格等板块数据
- 合并所有板块数据
- 添加"近期高标"板块
- 保存到stock_block集合

**代码示例:**
```python
from FQMarket.FQUtil.ToolsSaveLocalData import save_block_from_local_data

# 保存板块数据
save_block_from_local_data()

# 保存今日板块数据
save_block_from_local_data(today_=True)
```
