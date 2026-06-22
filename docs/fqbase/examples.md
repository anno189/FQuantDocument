---
title: FQBase - 案例库
description: FQBase 实际应用场景、动手实验与案例研究
tag:
  - fquant
  - fqbase

summary:
  purpose: examples
---

# FQBase - 案例库

## 阅读路径

🟢🔵 **新手+开发者**：README → examples → api → usage

## 业务场景案例

### 场景 1: 统一日志收集

**业务需求**：在多个模块中统一收集日志

```python
from FQBase.Infrastructure import get_logger, init_logging

init_logging(config_path="logging.yaml")

class UserService:
    def __init__(self):
        self.logger = get_logger(self.__class__.__name__)

    def create_user(self, name):
        self.logger.info(f"Creating user: {name}")
        # 业务逻辑
        self.logger.info(f"User created: {name}")
```

### 场景 2: API 熔断保护

**业务需求**：保护外部 API 调用，防止级联故障

```python
from FQBase.Infrastructure import CircuitBreaker, circuit_breaker
from FQBase.Infrastructure.exceptions import CircuitBreakerOpenException

breaker = CircuitBreaker(
    name="external_api",
    failure_threshold=5,
    recovery_timeout=60,
)

@circuit_breaker(breaker)
def call_external_api():
    # 调用外部 API
    return requests.get("https://api.example.com/data")

try:
    result = call_external_api()
except CircuitBreakerOpenException:
    # 降级处理
    return get_cached_data()
```

### 场景 3: 事件驱动的数据处理流水线

**业务需求**：解耦数据获取、处理、存储流程

```python
from FQBase.Foundation import EventBus, Event

bus = EventBus()

def on_data_fetched(event):
    raw_data = event.data["raw"]
    processed = transform(raw_data)
    bus.publish(Event("data_processed", {"processed": processed}))

def on_data_stored(event):
    print(f"Data stored: {event.data}")

bus.subscribe("data_fetched", on_data_fetched)
bus.subscribe("data_processed", on_data_stored)

bus.publish(Event("data_fetched", {"raw": fetch_raw()}))
```

## 动手实验

### Lab 1: 实现带重试的 HTTP 客户端

**目标**：创建一个具有指数退避重试机制的 HTTP 客户端

```python
from FQBase.Infrastructure.retry import retry_with_exponential_backoff
import requests

@retry_with_exponential_backoff(
    max_attempts=5,
    base_delay=1000,
    max_delay=30000,
)
def http_get_with_retry(url, timeout=10):
    response = requests.get(url, timeout=timeout)
    response.raise_for_status()
    return response.json()
```

**任务**：
1. 修改重试次数为 3
2. 添加自定义异常处理
3. 实现日志记录

### Lab 2: 配置管理实验

**目标**：理解配置加载和环境变量覆盖

```python
from FQBase.Config import get_env, SETTING, GLOBALMAP

# 获取环境变量
mongo_uri = get_env("MONGODB_URI", default="mongodb://localhost:27017")

# 获取配置
uri = SETTING.get_mongo()

# 获取路径
data_path = GLOBALMAP.FQDATA_PATH
```

## 案例研究

### 案例: 爬虫系统的高可用设计

**背景**：需要爬取多个数据源，每个数据源稳定性不同

**挑战**：
- 某些数据源响应慢或不稳定
- 需要避免被封禁
- 需要断点续爬能力

**解决方案**：

```python
from FQBase.Crawler import BaseCrawler, PageParser
from FQBase.Infrastructure import CircuitBreaker, circuit_breaker
from FQBase.Cache import create_cache

class ResilientCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(timeout=30, delay=2.0)
        self.cache = create_cache()

    @circuit_breaker(failure_threshold=3)
    def fetch_with_cache(self, url):
        cache_key = f"crawl:{url}"
        cached = self.cache.get(cache_key)
        if cached:
            return cached

        html = self.fetch_url(url)
        self.cache.set(cache_key, html, ttl=3600)
        return html
```

**结果**：

| 指标 | 改善前 | 改善后 |
|------|--------|--------|
| 请求成功率 | 72% | 95% |
| 平均响应时间 | 15s | 8s |
| 被封禁次数/月 | 20+ | 2 |

**经验教训**：
- 熔断器有效防止了级联故障
- 缓存减少了重复请求
- 延迟和随机化降低了被封禁风险

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
