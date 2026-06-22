---
title: Config - 故障排查
description: Config 常见问题与解决方案
tag:
  - fquant
  - fqbase
  - config

summary:
  purpose: troubleshooting
---

# Config - 故障排查

## 阅读路径

🟡🔵 **运维+开发者**：README → troubleshooting → configuration → best-practices

## 概述

本文档帮助您诊断和解决使用 Config 模块时的常见问题。

## 常见问题

### 问题 1: 环境变量未生效

**症状：**
- get_env() 返回默认值而非配置的值
- .env 文件被忽略

**可能原因：**
- .env 文件路径错误
- 环境变量名拼写错误
- load_env() 未被调用

**解决方案：**

1. 检查 .env 文件位置
```bash
# .env 应在项目根目录
cat .env
```

2. 确保调用 load_env()
```python
from FQBase.Config import load_env, get_env

load_env()  # 先加载
value = get_env("KEY")  # 再获取
```

### 问题 2: MongoDB 连接失败

**症状：**
- SETTING.get_mongo() 返回默认值
- 数据库连接超时

**可能原因：**
- MONGODB_URI 环境变量未设置
- MongoDB 服务未启动

**解决方案：**

1. 检查环境变量
```bash
echo $MONGODB_URI
```

2. 验证 MongoDB 服务
```bash
redis-cli ping  # 检查 MongoDB
```

### 问题 3: 配置监听不工作

**症状：**
- 配置文件变化但回调未触发

**可能原因：**
- 监听的文件路径错误
- 回调函数未正确注册

**解决方案：**

```python
from FQBase.Config import watch_config

watcher = watch_config(["config.ini"])
watcher.add_callback(lambda cfg: print(f"变更: {cfg}"))
```

## FAQ

### Q: 如何查看所有配置？

```python
from FQBase.Config import SETTING, GLOBALMAP, get_cache_config

print(f"MongoDB: {SETTING.get_mongo()}")
print(f"数据路径: {GLOBALMAP.FQDATA_PATH}")
print(f"缓存配置: {get_cache_config()}")
```

### Q: 如何在运行时更改配置？

```python
from FQBase.Config import SETTING

SETTING.change(ip="newhost", port=27017)
```

## 相关文档

- [最佳实践](./best-practices.md)
- [API参考](./api.md)
- [配置指南](./configuration.md)
