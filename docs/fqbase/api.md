---
title: FQBase - API参考
description: FQBase API 参考文档
tag:
  - fquant
  - fqbase

summary:
  purpose: api-reference
---

# FQBase - API参考

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## Infrastructure 层

### 单例模式

**位置：** `Infrastructure/singleton.py`

```python
from FQBase.Infrastructure import singleton, SingletonMeta

@singleton
class MyClass:
    pass
```

### 日志系统

**位置：** `Infrastructure/logger.py`

```python
from FQBase.Infrastructure.logger import get_logger, init_logging, FQLogger

logger = get_logger(__name__)
logger.info("message")
logger.error("error", exc_info=True)
```

### 异常处理

**位置：** `Infrastructure/exceptions.py`

```python
from FQBase.Infrastructure.exceptions import (
    FQException,
    DataSourceException,
    DataFetchException,
    handle_exception,
    safe_execute,
)
```

### 重试机制

**位置：** `Infrastructure/retry.py`

```python
from FQBase.Infrastructure.retry import (
    retry,
    retry_with_exponential_backoff,
    RetryError,
    create_retry_context,
)
```

### 熔断器

**位置：** `Infrastructure/circuit_breaker.py`

```python
from FQBase.Infrastructure.circuit_breaker import (
    CircuitBreaker,
    CircuitBreakerOpenException,
    CircuitState,
    circuit_breaker,
)
```

### 依赖注入容器

**位置：** `Infrastructure/container.py`

```python
from FQBase.Infrastructure.container import (
    ServiceContainer,
    ServiceLocator,
    ServiceLifetime,
    ServiceDescriptor,
)
```

## Foundation 层

### Dotty 字典访问

**位置：** `Foundation/dotty.py`

```python
from FQBase.Foundation.dotty import dotty, Dotty

data = {"a": {"b": {"c": 1}}}
value = dotty(data, "a.b.c")
```

### 事件总线

**位置：** `Foundation/event_bus.py`

```python
from FQBase.Foundation.event_bus import EventBus, Event, get_event_bus

bus = EventBus()
bus.subscribe("topic", handler)
bus.publish(Event("topic", {"key": "value"}))
```

### 生命周期管理

**位置：** `Foundation/lifecycle.py`

```python
from FQBase.Foundation.lifecycle import (
    ServiceStatus,
    HealthStatus,
    HealthCheckable,
    Initializable,
    Shutdownable,
)
```

### 通知服务

**位置：** `Foundation/notification.py`

```python
from FQBase.Foundation.notification import (
    NotificationManager,
    sendWechat,
    ServerChan,
    PushBear,
)
```

## Config 层

**位置：** `Config/__init__.py`

```python
from FQBase.Config import (
    get_env,
    SETTING,
    GLOBALMAP,
    CacheConfig,
    get_cache_config,
    ConfigWatcher,
)
```

## Cache 层

**位置：** `Cache/__init__.py`

```python
from FQBase.Cache import (
    create_cache,
    LocalCache,
    RedisCacheAdapter,
    MongoCacheAdapter,
    get_cache_adapter,
    set_cache_adapter,
)
```

## DataStore 层

**位置：** `DataStore/__init__.py`

```python
from FQBase.DataStore import (
    MongoDB,
    get_mongo_db,
    MongoConnection,
    MongoCollection,
    MongoIndexManager,
)
```

## Util 层

**位置：** `Util/__init__.py`

```python
from FQBase.Util import (
    dict_to_df,
    df_to_dict,
    parse_number,
    safe_divide,
    file_md5,
    web_ping,
    ParallelProcess,
    ParallelThread,
)
```

## Crawler 层

**位置：** `Crawler/__init__.py`

```python
from FQBase.Crawler import BaseCrawler, PageParser
```

**位置：** `Crawler/browser.py`

```python
from FQBase.Crawler.browser import (
    make_headless_browser,
    BrowserPool,
    TIMEOUT,
    POLL_FREQUENCY,
)
```

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [配置指南](./configuration.md)
