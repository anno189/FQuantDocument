---
title: Config - 快速入门
description: 5分钟快速上手 Config 配置中心
tag:
  - fqbase
  - config

summary:
  purpose: quick-start
  complexity: low
---

# Config - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

5分钟快速上手 Config 配置中心，掌握基本配置使用方法。

## 前置要求

- Python 3.8+
- pip

## 安装

```bash
pip install fquant-fqbase
```

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Config import get_env, SETTING, DATABASE
```

### Step 2: 加载环境变量

```python
from FQBase.Config import load_env

# 加载 .env 文件
load_env()
```

### Step 3: 获取配置

```python
from FQBase.Config import get_env

# 获取环境变量
db_host = get_env('MONGODB_HOST', 'localhost')
db_port = get_env('MONGODB_PORT', 27017)

# 获取数据库配置
print(DATABASE)
```

### Step 4: 使用交易常量

```python
from FQBase.Config import ORDER_DIRECTION, MARKET_TYPE

# 订单方向
print(ORDER_DIRECTION.BUY)   # 买入
print(ORDER_DIRECTION.SELL)  # 卖出

# 市场类型
print(MARKET_TYPE.SH)        # 上海
print(MARKET_TYPE.SZ)        # 深圳
```

### Step 5: 完成！

恭喜！你已经学会了 Config 的基本用法。

## ⚠️ 常见陷阱

1. **陷阱 1：环境变量未加载**
   - ❌ 错误做法：直接使用 `get_env` 但未调用 `load_env`
   - ✅ 正确做法：先调用 `load_env()` 或在模块导入时自动加载

2. **陷阱 2：使用未定义的常量**
   - ❌ 错误做法：使用不存在的常量名
   - ✅ 正确做法：先查看 `__all__` 列表或 API 文档

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [术语表](./glossary.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [术语表](./glossary.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
