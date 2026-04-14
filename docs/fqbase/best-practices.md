---
title: FQBase - 最佳实践
description: FQBase 最佳实践与建议
tag:
  - fqbase
---

# FQBase - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[最佳实践](./best-practices.md)** |

## 子模块最佳实践

| 子模块 | 最佳实践 | 说明 |
|--------|----------|------|
| Core | [最佳实践](./core/best-practices.md) | 事件总线、日志、通知 |
| Foundation | [最佳实践](./foundation/best-practices.md) | 验证、异常、重试、单例 |
| Util | [最佳实践](./util/best-practices.md) | 工具函数 |
| Config | [最佳实践](./config/best-practices.md) | 配置管理 |
| Cache | [最佳实践](./cache/best-practices.md) | 缓存抽象 |
| Date | [最佳实践](./date/usage.md) | 日期时间 |
| DataStore | [最佳实践](./datastore/best-practices.md) | 数据存储 |
| Crawler | [最佳实践](./crawler/best-practices.md) | 网页爬虫 |


## 概述

有效使用 FQBase 的最佳实践。

## 性能最佳实践

### 技巧 1: 使用单例获取组件

**建议：** 使用 `get_event_bus()`、`get_logger()` 等单例方法获取组件，避免重复创建

**代码 - 好：**
```python
# 使用单例
event_bus = get_event_bus()  # 内部缓存实例
logger = get_logger('module')  # 内部缓存实例
```

**代码 - 差：**

```python
# 每次创建新实例
event_bus = EventBus()  # 新实例，状态不共享
logger = FQLogger('module')  # 新实例，配置不共享
```

### 技巧 2: 合理使用缓存

**建议：** 对频繁访问的数据使用缓存

```python
# 使用缓存
cache = CacheAdapter()
result = cache.get_or_compute('key', compute_fn=expensive_operation, ttl=3600)
```

### 技巧 3: 批量处理

**建议：** 尽量使用批量操作减少网络调用

```python
# 批量获取
codes = ['000001', '000002', '000003']
quotes = fetch_quotes_batch(codes)  # 一次调用
```

## 安全最佳实践

### 技巧 1: 使用环境变量存储密钥

**建议：** 永远不要硬编码凭据

**代码 - 好：**

```python
# 使用环境变量
api_key = os.environ.get("API_KEY")
```

**代码 - 差：**

```python
# 永远不要这样做！
api_key = "secret_key_123"
```

### 技巧 2: 验证用户输入

**建议：** 始终验证外部输入

```python
from FQBase.Foundation import validate_code, validate_date

def process_request(request):
    validate_code(request['code'])
    validate_date(request['date'])
```

## 错误处理最佳实践

### 技巧 1: 使用统一的异常处理

```python
from FQBase.Foundation import FQException, handle_exception

try:
    result = operation()
except FQException as e:
    handle_exception(e)
    raise
```

### 技巧 2: 重试时指定异常类型

```python
from FQBase.Foundation import retry
import requests

@retry(max_attempts=3, exceptions=(requests.RequestException, ConnectionError))
def fetch_data():
    return requests.get(url).json()
```

## 配置最佳实践

### 技巧 1: 使用 .env 文件

```bash
# .env 文件
API_KEY=your_key_here
DEBUG=false
PORT=8080
```

```python
from FQBase.Config import load_env, get_env

load_env('.env')
```

### 技巧 2: 分环境配置

```python
import os

env = os.getenv('ENV', 'development')

if env == 'production':
    load_env('.env.production')
else:
    load_env('.env.development')
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [开发指南](./development.md)
