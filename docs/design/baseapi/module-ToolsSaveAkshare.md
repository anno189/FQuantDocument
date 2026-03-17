# ToolsSaveAkshare 模块文档

## 模块概述

ToolsSaveAkshare 模块提供从Akshare财经数据接口获取各类指数数据并保存到MongoDB数据库的功能。该模块主要用于获取期权波动率指数、大宗商品指数等特殊市场数据。

## 核心功能

- **期权波动率指数**: 获取韭圈儿中国波指（50ETF期权波动率指数）
- **大宗商品指数**: 获取大宗商品指数数据
- **恐惧贪婪指数**: 恐惧贪婪指数（已失效）

## 依赖模块

- akshare
- pymongo
- QAUtil

## 函数列表

| 函数名 | 功能描述 |
|--------|----------|
| save_index_option_50etf_qvix | 保存50ETF期权波动率指数 |
| save_index_cci_cx | 保存大宗商品指数 |
| save_index_fear_greed_funddb | 保存恐惧贪婪指数（已失效） |

---

## 函数详细说明

### save_index_option_50etf_qvix()

保存韭圈儿中国波指（50ETF期权波动率指数）到数据库。

**功能说明:**
- 从Akshare获取index_option_50etf_qvix数据
- 删除旧数据
- 将新数据插入到index_option_50etf_qvix集合
- 创建日期索引

**代码示例:**
```python
from FQMarket.FQUtil.ToolsSaveAkshare import save_index_option_50etf_qvix

# 保存50ETF期权波动率指数
save_index_option_50etf_qvix()
```

### save_index_cci_cx()

保存大宗商品指数到数据库。

**功能说明:**
- 从Akshare获取index_cci_cx数据
- 删除旧数据
- 将新数据插入到index_cci_cx集合
- 创建日期索引

**代码示例:**
```python
from FQMarket.FQUtil.ToolsSaveAkshare import save_index_cci_cx

# 保存大宗商品指数
save_index_cci_cx()
```

### save_index_fear_greed_funddb()

保存韭圈儿恐惧贪婪指数（已失效）。

**注意:** 该函数已注释失效，不可使用。

**功能说明:**
- 从Akshare获取index_fear_greed_funddb数据
- 保存到index_fear_greed_funddb集合
- 目前接口已失效，函数已被注释
