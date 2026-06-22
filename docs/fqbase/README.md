---
title: FQBase
description: FQuant 基础框架包，提供配置管理、缓存、数据存储、事件总线、爬虫等基础设施
tag:
  - fquant
  - fqbase

summary:
  type: foundation
  complexity: high
  maturity: stable
  size: large
  is_container: true
  sub_modules_stats:
    total: 7
    documented: 7
    levels:
      L0: 0
      L1: 2
      L2: 4
      L3: 2
    modules:
      - name: Infrastructure
        level: L3
        docs: 16
        path: ./Infrastructure/README.md
      - name: Foundation
        level: L3
        docs: 16
        path: ./Foundation/README.md
      - name: Config
        level: L2
        docs: 12
        path: ./Config/README.md
      - name: Cache
        level: L2
        docs: 12
        path: ./Cache/README.md
      - name: DataStore
        level: L2
        docs: 12
        path: ./DataStore/README.md
      - name: Util
        level: L1
        docs: 8
        path: ./Util/README.md
      - name: Crawler
        level: L1
        docs: 8
        path: ./Crawler/README.md
  api_exports:
    total: 191
    classes: 111
    functions: 829
    constants: 0
  features:
    has_async: true
    is_thread_safe: true
    has_config: true
    has_logging: true
    has_security: false
  usage_scenarios:
    - "使用 Infrastructure 层获取日志、重试、熔断器等基础设施"
    - "使用 Foundation 层实现事件驱动架构"
    - "使用 Config 层管理 MongoDB 连接和路径配置"
    - "使用 Cache 层实现多级缓存"
    - "使用 DataStore 层操作 MongoDB 数据库"
    - "使用 Crawler 层构建爬虫"
  warnings:
    - "所有导入必须通过子模块进行，不支持包级别便捷导入"
    - "Infrastructure 层是最底层，不应被 Foundation 层以外的模块依赖"
    - "Config 层配置变更需要通过 ConfigWatcher 监听"
  limitations:
    - "依赖 MongoDB、Redis 等外部服务"
    - "爬虫功能依赖 ChromeDriver/Selenium"
  design_patterns:
    - singleton
    - factory
    - circuit_breaker
    - retry
    - observer
    - dependency_injection

relationships:
  belongs_to:
    - fquant
  contains:
    - fquant.fqbase.cache
    - fquant.fqbase.config
    - fquant.fqbase.crawler
    - fquant.fqbase.datastore
    - fquant.fqbase.foundation
    - fquant.fqbase.infrastructure
    - fquant.fqbase.util
  depends_on: []
  used_by:
    - fquant.fqdata
    - fquant.fqserver

documentation_progress:
  status: complete
  level: L3
  total_expected: 16
  total_generated: 16
  generated:
    - README.md
    - quick-start.md
    - concepts.md
    - api.md
    - usage.md
    - examples.md
    - glossary.md
    - changelog.md
    - best-practices.md
    - integrations.md
    - troubleshooting.md
    - configuration.md
    - architecture.md
    - design.md
    - patterns.md
    - development.md
  missing: []

maintenance:
  source_hash: "32d991722509b2d555c214052863fa3e767f49bd297ce2814ee9e303f9c1b48a"
  source_mtime: 1776815700
  source_files:
    - "Cache/CacheAdapters.py"
    - "Cache/__init__.py"
    - "Cache/_interface.py"
    - "Cache/_interfaces.py"
    - "Cache/_local_backend.py"
    - "Cache/_mongo_backend.py"
    - "Cache/_redis_backend.py"
    - "Cache/_serializers.py"
    - "Cache/config_protocol.py"
    - "Cache/exceptions.py"
    - "Cache/local_cache.py"
    - "Cache/metrics.py"
    - "Cache/mongo_adapter.py"
    - "Cache/redis_adapter.py"
    - "Cache/redis_conn.py"
    - "Config/__init__.py"
    - "Config/cache_config.py"
    - "Config/config_watcher.py"
    - "Config/env.py"
    - "Config/setting.py"
    - "Crawler/__init__.py"
    - "Crawler/browser.py"
    - "DataStore/__init__.py"
    - "DataStore/_collection.py"
    - "DataStore/_connection.py"
    - "DataStore/_database_admin.py"
    - "DataStore/_index_manager.py"
    - "DataStore/mongo_db.py"
    - "Foundation/__init__.py"
    - "Foundation/dotty.py"
    - "Foundation/event_bus.py"
    - "Foundation/event_bus_celery.py"
    - "Foundation/lifecycle.py"
    - "Foundation/notification.py"
    - "Foundation/notification_template.py"
    - "Infrastructure/__init__.py"
    - "Infrastructure/_mongo/__init__.py"
    - "Infrastructure/_mongo/_interfaces.py"
    - "Infrastructure/_mongo/_mongo_client.py"
    - "Infrastructure/circuit_breaker.py"
    - "Infrastructure/container.py"
    - "Infrastructure/exceptions.py"
    - "Infrastructure/logger.py"
    - "Infrastructure/retry.py"
    - "Infrastructure/singleton.py"
    - "Util/__init__.py"
    - "Util/converters.py"
    - "Util/crypto.py"
    - "Util/file.py"
    - "Util/network.py"
    - "Util/parallel.py"
    - "Util/transformer.py"
    - "Util/validators.py"
  last_updated: "2026-04"
---

# FQBase

## 阅读路径

🟢 **新手入门**：README → quick-start → examples → concepts → glossary → usage

🔵 **开发者**：README → api → usage → concepts → examples

🟡 **运维/安全**：README → changelog → configuration → troubleshooting → best-practices

🟠 **架构师**：README → api → concepts → integrations → configuration → architecture → design → patterns → development

## 一句话总览

📌 **FQuant 基础框架包，提供配置管理、缓存、数据存储、事件总线、爬虫等基础设施，是 FQuant 项目的技术底座。**

## 子模块概览

| 子模块 | 级别 | 核心能力 | 文档链接 | 状态 |
|--------|------|---------|---------|------|
| Infrastructure | L3 | 单例、熔断器、重试、日志、依赖注入 | [README](./Infrastructure/README.md) | ✅ 已生成 |
| Foundation | L3 | 事件总线、通知、生命周期、Dotty | [README](./Foundation/README.md) | ✅ 已生成 |
| Config | L2 | 环境变量、MongoDB配置、路径配置 | [README](./Config/README.md) | ✅ 已生成 |
| Cache | L2 | Redis/Memory/MongoDB 多级缓存 | [README](./Cache/README.md) | ✅ 已生成 |
| DataStore | L2 | MongoDB CRUD、聚合、索引管理 | [README](./DataStore/README.md) | ✅ 已生成 |
| Util | L1 | 数据转换、文件处理、网络工具、并行计算 | [README](./Util/README.md) | ✅ 已生成 |
| Crawler | L1 | Selenium爬虫、页面解析 | [README](./Crawler/README.md) | ✅ 已生成 |

## 架构图

```mermaid
graph TB
    subgraph FQBase
        subgraph Infrastructure["Infrastructure 层（底层）"]
            singleton["单例模式"]
            logger["日志系统"]
            exceptions["异常处理"]
            retry["重试装饰器"]
            circuit_breaker["熔断器"]
            container["依赖注入容器"]
            mongo["MongoDB客户端"]
        end

        subgraph Foundation["Foundation 层（抽象层）"]
            dotty["Dotty 字典访问"]
            lifecycle["生命周期管理"]
            notification["通知服务"]
            event_bus["事件总线"]
        end

        subgraph Config["Config 层"]
            env["环境变量"]
            setting["MongoDB配置"]
            cache_config["缓存配置"]
            config_watcher["配置监听"]
        end

        subgraph Cache["Cache 层"]
            redis_cache["Redis缓存"]
            local_cache["本地缓存"]
            mongo_cache["MongoDB缓存"]
        end

        subgraph DataStore["DataStore 层"]
            mongo_db["MongoDB门面"]
            collection["数据操作"]
            index_manager["索引管理"]
        end

        subgraph Util["Util 层"]
            converters["转换器"]
            transformer["格式化"]
            file["文件处理"]
            network["网络工具"]
            parallel["并行计算"]
            crypto["加密"]
        end

        subgraph Crawler["Crawler 层"]
            base_crawler["基础爬虫"]
            page_parser["页面解析"]
            browser_pool["浏览器池"]
        end
    end

    Infrastructure --> Foundation
    Infrastructure --> Config
    Infrastructure --> Cache
    Infrastructure --> DataStore
    Foundation --> Config
```

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 需要统一日志、异常处理、重试机制时 → 使用 `Infrastructure`
- 需要事件驱动架构时 → 使用 `Foundation.EventBus`
- 需要发送通知（企业微信、Server酱）时 → 使用 `Foundation.Notification`
- 需要管理 MongoDB 连接和配置时 → 使用 `Config`
- 需要缓存功能时 → 使用 `Cache`
- 需要 MongoDB 数据操作时 → 使用 `DataStore`
- 需要爬取网页数据时 → 使用 `Crawler`
- 需要数据转换、文件处理等工具时 → 使用 `Util`

❌ **不应该使用**：
- 业务逻辑代码应放在 FQData/FQFactor 层，而非 FQBase
- FQBase 是基础设施层，不应包含业务领域逻辑

### 注意事项

1. **导入方式变更**
   - ❌ 错误做法：`from FQBase import singleton`
   - ✅ 正确做法：`from FQBase.Infrastructure import singleton`

2. **层级依赖关系**
   - Infrastructure 是最底层，不依赖任何 FQBase 模块
   - Foundation 依赖 Infrastructure
   - Config、Cache、DataStore、Util、Crawler 都依赖 Infrastructure

3. **单例模式使用**
   - 推荐使用 `@singleton` 装饰器而非手动实现

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pymongo | MongoDB 驱动 |
| 必须 | redis | Redis 驱动 |
| 可选 | selenium | 爬虫浏览器自动化 |
| 可选 | bs4 | 页面解析 |
| 可选 | celery | 异步任务队列 |

**TL;DR**：
- 解决什么问题：提供 FQuant 项目统一的基础设施（日志、缓存、数据库、事件、爬虫）
- 核心能力：Config管理、Cache缓存、DataStore存储、EventBus事件、Retry重试、CircuitBreaker熔断
- 入门难度：🔵 中等

**快速判断**：当您需要 日志/缓存/数据库/事件总线/爬虫/重试熔断 等基础设施时，使用 FQBase。

## 组合使用示例

### 示例1：Config + DataStore 协作

```python
from FQBase.Config import SETTING, get_database
from FQBase.DataStore import MongoDB, get_mongo_db

db = get_mongo_db(database="mydb")
db.insert_one("users", {"name": "test", "age": 25})
```

### 示例2：Infrastructure + Foundation 协作

```python
from FQBase.Infrastructure import singleton, get_logger
from FQBase.Infrastructure.retry import retry
from FQBase.Foundation import EventBus, Event

@retry(stop_max_attempt_number=3)
def fetch_data():
    logger = get_logger(__name__)
    event_bus = EventBus()
    event_bus.publish(Event("data_fetched", {"source": "api"}))
```

### 示例3：Cache + Util 协作

```python
from FQBase.Cache import redis_cache, create_cache
from FQBase.Util import dict_to_df

cache = create_cache()
cache.set("key", {"name": "test", "value": 100})
data = cache.get("key")
df = dict_to_df(data)
```

## 快速链接

| 需求 | 文档 |
|------|------|
| 了解核心概念 | [核心概念](./concepts.md) |
| 查看 API | [API参考](./api.md) |
| 快速入门 | [快速入门](./quick-start.md) |
| 故障排查 | [故障排查](./troubleshooting.md) |
| 配置指南 | [配置指南](./configuration.md) |
| 架构设计 | [技术架构](./architecture.md) |

## 相关文档

- [FQData 文档](../fqdata/README.md)
- [FQFactor 文档](../fqfactor/README.md)
