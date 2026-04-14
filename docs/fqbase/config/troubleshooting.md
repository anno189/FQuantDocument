---
title: Config - 故障排查
description: Config 配置中心常见问题与解决方案
tag:
  - fqbase
  - config
---

# Config - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [配置指南](./configuration.md) → **[故障排查](./troubleshooting.md)** |


## 概述

Config 配置中心的常见问题和解决方案。

## 常见问题

### 问题 1: 环境变量未加载

**症状：**
- `get_env` 返回 None 或默认值
- 提示 "环境变量未设置"

**可能原因：**
- .env 文件不存在
- 未调用 `load_env()`
- .env 文件格式错误

**解决方案：**

1. 检查 .env 文件是否存在：
```python
import os
print(os.path.exists('.env'))
```

2. 确保调用了 load_env：
```python
from FQBase.Config import load_env
load_env()
```

3. 检查 .env 文件格式：
```
# 正确的格式
KEY=value
# 错误的格式
KEY = value  # 有空格
```

---

### 问题 2: 敏感配置返回 None

**症状：**
- `get_secure_env` 返回 None
- 提示 "API_KEY 为占位符"

**可能原因：**
- .env 文件中该值为注释状态
- 值被设置为占位符字符串（如 `your_api_key_here`）

**解决方案：**

1. 检查 .env 文件内容：
```bash
# 正确
API_KEY=actual_key_here

# 错误（被注释）
# API_KEY=your_api_key_here
```

2. 取消注释或设置实际值

---

### 问题 3: 配置值类型错误

**症状：**
- `int(get_env('PORT', 27017))` 报错
- 配置值类型不符合预期

**可能原因：**
- 环境变量是字符串类型
- 默认值类型与实际值类型不匹配

**解决方案：**

1. 显式转换类型：
```python
port = int(get_env('MONGODB_PORT', '27017'))
```

2. 使用配置验证：
```python
def get_int_env(key, default):
    value = get_env(key)
    if value is None:
        return default
    try:
        return int(value)
    except ValueError:
        return default
```

---

### 问题 4: 配置监听不生效

**症状：**
- 修改配置文件后应用未更新
- 回调函数未触发

**可能原因：**
- 监听器未启动
- 监听路径错误
- 文件变化未触发事件

**解决方案：**

1. 确保监听器已启动：
```python
watcher = ConfigWatcher('config.yaml')
watcher.start()
```

2. 检查监听路径是否正确

3. 对于某些文件系统，可能需要手动触发

---

## 错误参考

### 错误代码

| 代码 | 错误 | 描述 | 解决方案 |
|------|------|------|---------|
| 001 | EnvNotLoaded | 环境变量未加载 | 调用 load_env() |
| 002 | EnvNotFound | .env 文件不存在 | 创建 .env 文件 |
| 003 | InvalidFormat | .env 格式错误 | 检查文件格式 |
| 004 | PlaceholderDetected | 检测到占位符 | 配置实际值 |

### 错误处理模式

```python
from FQBase.Config import get_env, load_env

try:
    load_env()
    value = get_env('KEY')
except FileNotFoundError:
    print(".env 文件不存在")
except Exception as e:
    print(f"配置错误: {e}")
```

## 诊断工具

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("fquant.config")
logger.debug("调试信息")
```

### 检查配置状态

```python
from FQBase.Config import load_env, get_env

# 加载配置
load_env()

# 打印所有环境变量（调试用）
import os
for key, value in os.environ.items():
    if key.startswith(('MONGODB_', 'REDIS_', 'API_')):
        print(f"{key}={value}")
```

## 获取帮助

### 联系支持前

1. 检查 .env 文件是否存在
2. 确保已调用 load_env()
3. 检查配置值是否正确

### 联系支持

- 邮箱：support@fquant.com
- GitHub Issues：https://github.com/fquant/fquant/issues

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
