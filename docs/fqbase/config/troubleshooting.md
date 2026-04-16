---
title: Config - 故障排查
description: FQBase 配置中心常见问题与解决方案
tag:
  - fqbase
  - config
---

# Config - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → **[故障排查](./troubleshooting.md)** → [常见问题](./faq.md) |

## 子模块故障排查

| 子模块 | 故障排查 | 说明 |
|--------|----------|------|
| base | [故障排查](./base/troubleshooting.md) | 基础配置问题 |
| business | [故障排查](./business/troubleshooting.md) | 业务配置问题 |


## 概述

配置中心的常见问题和解决方案。

## 常见问题

### 问题 1: get_env 返回 None

**症状：**
- `get_env('KEY')` 返回 `None`
- 配置值读取失败

**可能原因：**
- 环境变量文件未加载
- 环境变量名称拼写错误
- 配置文件路径不正确

**解决方案：**

1. 确认已调用 load_env()：

```python
from FQBase.Config import load_env, get_env

# 加载环境变量
load_env()

# 然后获取
value = get_env('KEY')
```

2. 检查环境变量名称：

```python
# 确认 .env 文件中的键名
# DEBUG=true (不是 debug=true)
print(get_env('DEBUG'))  # 大小写敏感
```

3. 检查配置文件路径：

```python
# 使用绝对路径
load_env('/absolute/path/to/.env')
```

---

### 问题 2: DATABASE 连接失败

**症状：**
- `DATABASE` 访问报错
- MongoDB 连接超时

**可能原因：**
- MongoDB 服务未运行
- 连接字符串错误
- 网络问题

**解决方案：**

1. 检查 MongoDB 服务：

```bash
# 启动 MongoDB
mongod --dbpath /data/db
```

2. 验证连接字符串：

```python
from FQBase.Config import SETTING

# 测试连接
uri = SETTING.get_mongo()
print(f"连接: {uri}")
```

3. 检查网络连通性：

```bash
ping localhost
```

---

### 问题 3: 缓存配置无效

**症状：**
- 缓存类型切换不生效
- 缓存过期时间无效

**可能原因：**
- 缓存配置在创建后未保存
- 缓存后端服务未运行

**解决方案：**

1. 重新创建缓存配置：

```python
from FQBase.Config import CacheConfig, set_cache_config

# 重新设置缓存配置
config = CacheConfig(cache_type='redis', ttl=1800)
set_cache_config(config)
```

2. 检查缓存服务状态：

```bash
# Redis
redis-cli ping

# MongoDB
mongosh -u admin -p --authenticationDatabase admin
```

---

### 问题 4: ConfigWatcher 回调不触发

**症状：**
- 注册的回调函数不执行
- 配置变更未被监听

**可能原因：**
- 回调函数签名不正确
- 监听键名不匹配

**解决方案：**

1. 检查回调函数签名：

```python
# 正确的回调函数
def my_callback(key, value):
    print(f"{key} 已变更为 {value}")

watcher.watch('database', callback=my_callback)
```

2. 检查监听键名：

```python
# 确保监听正确的键名
watcher.watch('database', callback=on_change)  # 不是 'db' 或 'mongo'
```

---

### 问题 5: 路径配置为 None

**症状：**
- `FQDATA_PATH` 等路径返回 `None`
- 路径未正确初始化

**可能原因：**
- 配置文件未创建
- 路径未在配置文件中设置

**解决方案：**

1. 检查配置文件：

```bash
# 确认 setting.json 存在
cat FQData/setting.json
```

2. 手动设置路径：

```python
from FQBase.Config import SETTING

# 获取路径
fqdata_path = SETTING.get_fqdata_path()
```

---

## 错误参考

### 错误代码

| 代码 | 错误 | 描述 | 解决方案 |
|------|------|------|---------|
| 001 | EnvNotLoaded | 环境变量未加载 | 调用 load_env() |
| 002 | ConfigNotFound | 配置文件不存在 | 检查文件路径 |
| 003 | DatabaseConnectionFailed | 数据库连接失败 | 检查 MongoDB 服务 |
| 004 | CacheTypeInvalid | 缓存类型无效 | 使用 'redis' 或 'mongo' |
| 005 | PathNotConfigured | 路径未配置 | 检查 setting.json |

### 错误处理模式

```python
from FQBase.Config import (
    get_env,
    SETTING,
    ConfigValidationError,
)

try:
    value = get_env('REQUIRED_KEY')
    if value is None:
        raise ValueError("必需的配置项未设置")
except Exception as e:
    print(f"配置错误: {e}")
```

---

## 诊断工具

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("fqbase.config")
logger.debug("调试信息")
```

### 配置健康检查

```python
from FQBase.Config import (
    get_env,
    SETTING,
    DATABASE,
    get_cache_config,
)

def health_check():
    results = {}
    
    # 检查环境变量
    results['env'] = get_env('DEBUG') is not None
    
    # 检查数据库
    try:
        results['database'] = SETTING.get_mongo() is not None
    except:
        results['database'] = False
    
    # 检查缓存配置
    results['cache'] = get_cache_config() is not None
    
    return results

print(health_check())
```

---

## 获取帮助

### 联系支持前

1. 启用调试日志
2. 收集错误日志
3. 记录错误代码和消息
4. 记录重现步骤

### 联系支持

- 邮箱：support@fquant.com
- GitHub Issues：https://github.com/fquant/fquant/issues

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
