---
title: FQBase - 使用指南
description: FQBase 详细使用指南
tag:
  - fquant
  - fqbase

summary:
  purpose: usage
---

# FQBase - 使用指南

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 概述

本指南详细说明如何在各种场景下使用 FQBase。

## 基本用法

### 使用日志

```python
from FQBase.Infrastructure import get_logger

logger = get_logger(__name__)
logger.info("Starting operation")
logger.warning("Warning message")
logger.error("Error occurred", exc_info=True)
```

### 使用单例

```python
from FQBase.Infrastructure import singleton

@singleton
class Cache:
    def __init__(self):
        self._cache = {}

    def get(self, key):
        return self._cache.get(key)

    def set(self, key, value):
        self._cache[key] = value
```

## 常见用例

### 用例 1: 配置管理

**场景：** 管理 MongoDB 连接配置

```python
from FQBase.Config import SETTING, GLOBALMAP

# 获取 MongoDB URI
uri = SETTING.get_mongo()

# 获取路径配置
fqdata_path = GLOBALMAP.FQDATA_PATH
cache_path = GLOBALMAP.CACHE_PATH
```

### 用例 2: 事件驱动

**场景：** 实现松耦合的组件通信

```python
from FQBase.Foundation import EventBus, Event

bus = EventBus()

def on_data_received(event):
    print(f"Data: {event.data}")

bus.subscribe("data", on_data_received)
bus.publish(Event("data", {"value": 42}))
```

### 用例 3: 缓存策略

**场景：** 实现多级缓存

```python
from FQBase.Cache import create_cache, RedisCacheAdapter, LocalCache

# 从环境变量创建缓存
cache = create_cache()

# 直接使用
cache.set("key", {"data": "value"}, ttl=3600)
result = cache.get("key")
```

### 用例 4: 数据库操作

**场景：** MongoDB CRUD 操作

```python
from FQBase.DataStore import get_mongo_db

db = get_mongo_db(database="mydb")
db.insert_one("users", {"name": "test", "age": 25})
user = db.find_one("users", {"name": "test"})
db.update_one("users", {"name": "test"}, {"$set": {"age": 30}})
db.delete_one("users", {"name": "test"})
```

### 用例 5: 爬虫

**场景：** 抓取网页数据

```python
from FQBase.Crawler import BaseCrawler, PageParser

class MyCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(use_browser=False, delay=1.0)

    def parse_list(self, url):
        html = self.fetch_url(url)
        return PageParser.extract_by_css(html, "div.item", ["title", "href"])

crawler = MyCrawler()
items = crawler.parse_list("http://example.com/list")
```

## 方案对比

| 对比项 | FQBase | 其他方案 |
|--------|--------|---------|
| 日志 | 统一日志系统 | 各自实现 |
| 缓存 | 多后端支持 | 硬编码单一后端 |
| 数据库 | 门面模式封装 | 直接调用 pymongo |
| 爬虫 | Selenium+requests | 仅 requests |

## 错误处理

```python
from FQBase.Infrastructure.exceptions import (
    FQException,
    DataSourceException,
    safe_execute,
    handle_exception,
)

try:
    result = risky_operation()
except FQException as e:
    handle_exception(e, logger=logger)

# 或使用 safe_execute
result = safe_execute(risky_operation, default_value=None, logger=logger)
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
