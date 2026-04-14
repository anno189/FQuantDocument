---
title: Config - 术语表
description: Config 配置中心术语定义与解释
tag:
  - fqbase
  - config
---

# Config - 术语表

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[术语表](./glossary.md)** → [核心概念](./concepts.md) |


## 概述

Config 配置中心的术语定义。

## 术语

### 环境变量

**定义：** 操作系统级别的变量，用于存储配置信息

**示例：**

```python
import os
# 读取环境变量
value = os.environ.get('MONGODB_HOST')
```

### .env 文件

**定义：** 存储环境变量的配置文件，通常包含敏感信息

**示例：**

```
MONGODB_HOST=localhost
MONGODB_PORT=27017
API_KEY=your_api_key_here
```

### 单例模式

**定义：** 设计模式，确保一个类只有一个实例

**示例：**

```python
from FQBase.Config import get_env
# EnvManager 使用单例模式，全局唯一
```

### 缓存配置

**定义：** 应用程序缓存行为的配置

**示例：**

```python
from FQBase.Config import CacheConfig
config = CacheConfig(cache_type="redis", ttl=3600)
```

### 配置监听

**定义：** 监控配置文件变化并自动更新的机制

**示例：**

```python
from FQBase.Config import ConfigWatcher
watcher = ConfigWatcher('config.yaml')
```

### 交易常量

**定义：** 量化交易中使用的标准枚举值

**示例：**

```python
from FQBase.Config import ORDER_DIRECTION
ORDER_DIRECTION.BUY  # 买入
ORDER_DIRECTION.SELL # 卖出
```

### 数据源

**定义：** 提供数据的来源，如 Tushare、通华财豹等

**示例：**

```python
from FQBase.Config import DATASOURCE
DATASOURCE.TUSHARE
DATASOURCE.TONGHUA
```

### 占位符

**定义：** .env 文件中用于标记未配置值的字符串（被注释的默认值）

**示例：**

```
# API_KEY=your_api_key_here
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
