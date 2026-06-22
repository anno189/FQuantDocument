---
title: FQBase - 集成指南
description: FQBase 集成指南，包含模块内部集成、系统集成和跨系统集成
tag:
  - fquant
  - fqbase

summary:
  purpose: integrations
---

# FQBase - 集成指南

## 阅读路径

🔵 **开发者**：README → integrations → configuration → architecture

## 1. 模块内部集成

FQBase 各子模块之间的组合使用。

### 1.1 Infrastructure + Foundation 事件总线

```python
from FQBase.Infrastructure import get_logger
from FQBase.Infrastructure.retry import retry
from FQBase.Foundation import EventBus, Event

bus = EventBus()

@retry(stop_max_attempt_number=3)
def fetch_data():
    logger = get_logger(__name__)
    data = api_call()
    bus.publish(Event("data_fetched", {"data": data}))
    return data
```

### 1.2 Config + DataStore 配置驱动

```python
from FQBase.Config import SETTING, get_database
from FQBase.DataStore import MongoDB

uri = SETTING.get_mongo()
db = MongoDB(uri=uri)
db.insert_one("config", {"key": "value"})
```

### 1.3 Cache + Util 缓存转换

```python
from FQBase.Cache import redis_cache
from FQBase.Util import dict_to_df, df_to_dict

data = redis_cache.get("key")
df = dict_to_df(data)
# 处理数据
redis_cache.set("key", df_to_dict(df))
```

## 2. 系统模块间集成

FQBase 与项目内其他模块的集成。

### 2.1 FQBase + FQData

```python
from FQBase.Config import get_database
from FQBase.Cache import create_cache
from FQData import StockDataSource

cache = create_cache()
ds = StockDataSource(cache=cache)
data = ds.get_daily("000001.XSHE", "2024-01-01", "2024-12-31")
```

### 2.2 FQBase + FQFactor

```python
from FQBase.Foundation import EventBus
from FQBase.Infrastructure import get_logger
from FQFactor import FactorCalculator

bus = EventBus()
calculator = FactorCalculator(logger=get_logger(__name__))

def on_factor_ready(event):
    logger.info(f"Factor ready: {event.data}")

bus.subscribe("factor_ready", on_factor_ready)
```

## 3. 跨系统集成

FQBase 与外部系统、框架的集成。

### 3.1 Celery 集成

```python
from FQBase.Foundation.event_bus_celery import setup_event_bus, clear_event_bus

setup_event_bus()
clear_event_bus()
```

### 3.2 Selenium 爬虫集成

```python
from FQBase.Crawler import BaseCrawler, PageParser
from FQBase.Infrastructure import get_logger

class MyCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(use_browser=True)
        self.logger = get_logger(self.__class__.__name__)

crawler = MyCrawler()
html = crawler.fetch_url_with_browser("http://example.com")
items = PageParser.extract_by_css(html, ".item", ["title", "href"])
```

### 3.3 Redis 缓存集群

```python
from FQBase.Cache import RedisCacheAdapter
from FQBase.Config import CacheConfig

config = CacheConfig(
    cache_type="redis",
    redis_host="cluster.example.com",
    redis_port=6379,
    redis_password="${REDIS_PASSWORD}"
)
cache = RedisCacheAdapter(config)
```

## 集成模式总结

| 集成类型 | 典型场景 | 组合方案 |
|----------|----------|----------|
| 模块内部 | 事件+重试 | EventBus + retry 装饰器 |
| 模块内部 | 配置+存储 | Config SETTING + DataStore MongoDB |
| 模块内部 | 缓存+转换 | Cache + Util dict_to_df |
| 系统模块间 | FQBase + FQData | Cache 作为数据源缓存 |
| 系统模块间 | FQBase + FQFactor | EventBus 传递因子事件 |
| 跨系统 | FQBase + Celery | event_bus_celery 集成 |
| 跨系统 | FQBase + Selenium | BaseCrawler 封装 |

## 相关文档

- [API参考](./api.md)
- [配置指南](./configuration.md)
- [技术架构](./architecture.md)
