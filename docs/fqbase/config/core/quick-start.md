---
title: Core - 快速入门
description: 5分钟快速上手 Core 核心配置模块
tag:
  - fqbase
  - config

summary:
  purpose: quick-start
  complexity: low
---

# Core - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [使用指南](./usage.md) |


## 概述

5分钟快速上手 Core 核心配置模块。

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
from FQBase.Config.core import get_env, SETTING, DATABASE
```

### Step 2: 加载环境变量

```python
from FQBase.Config.core import load_env

# 加载 .env 文件
load_env()
```

### Step 3: 获取配置

```python
from FQBase.Config.core import get_env

# 获取环境变量
db_host = get_env('MONGODB_HOST', 'localhost')

# 获取数据库配置
print(DATABASE)
```

### Step 4: 完成！

恭喜！你已经学会了 Core 的基本用法。

## 下一步

- 学习 [核心概念](./concepts.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
