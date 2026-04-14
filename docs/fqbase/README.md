---
title: FQBase - FQuant 基础框架
description: FQuant 系统的基础框架包，提供事件总线、日志、通知、验证、重试、缓存等核心基础设施能力
tag:
  - fqbase
  - framework

summary:
  type: container
  complexity: high
  maturity: stable
  size: xl
  sub_modules:
    - core
    - foundation
    - util
    - config
    - cache
    - date
    - datastore
    - crawler

relationships:
  belongs_to:
    - fquant
  contains:
    - fquant.fqbase.core
    - fquant.fqbase.foundation
    - fquant.fqbase.util
    - fquant.fqbase.config
    - fquant.fqbase.cache
    - fquant.fqbase.date
    - fquant.fqbase.datastore
    - fquant.fqbase.crawler
  used_by:
    - fquant.fqdata
    - fquant.fqfactor

concepts:
  provides:
    - name: 事件驱动
      definition: 基于发布-订阅模式的事件驱动架构
    - name: 统一日志
      definition: 集中式日志记录系统
    - name: 多渠道通知
      definition: 支持企业微信、Server酱、PushBear等多种通知渠道
    - name: 数据验证
      definition: 统一的数据验证框架
    - name: 重试机制
      definition: 支持指数退避的重试装饰器
    - name: 熔断器
      definition: 防止级联故障的熔断器模式
    - name: 缓存抽象
      definition: 统一的缓存接口，支持Redis等多种适配器
    - name: 配置管理
      definition: 环境变量配置和热更新支持
---

# FQBase - FQuant 基础框架

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [子模块文档] → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [子模块文档] |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [跨模块集成示例](./examples.md#跨模块集成) |
| 📖 索引 | [README](./README.md) → [变更日志](./changelog.md) |


## 一句话总览

📌 **FQuant 系统的基础框架包**

**TL;DR**：
- 功能：提供事件驱动、日志、通知、验证、重试、缓存等基础设施能力
- 包含：8 个核心子模块
- 定位：FQuant 系统的基础设施层，所有业务模块依赖的核心服务

## 子模块概览

本模块是一个**容器模块**，聚合了以下核心子模块：

| 子模块 | 说明 | 文档级别 | 文档链接 |
|--------|------|---------|----------|
| [core](./core/) | 基础设施核心（事件总线、日志、通知） | L3 完整 | [README](./core/README.md) |
| [foundation](./foundation/) | 基础组件（验证、异常、重试、单例） | L3 完整 | [README](./foundation/README.md) |
| [util](./util/) | 工具函数（转换、编码、并行） | L2 标准 | [README](./util/README.md) |
| [config](./config/) | 配置管理（环境变量、热更新） | L2 标准 | [README](./config/README.md) |
| [cache](./cache/) | 缓存抽象（Redis适配器、序列化） | L3 完整 | [README](./cache/README.md) |
| [date](./date/) | 日期时间（时间戳、交易日） | L1 基础 | [README](./date/README.md) |
| [datastore](./datastore/) | 数据存储（MongoDB客户端） | L2 标准 | [README](./datastore/README.md) |
| [crawler](./crawler/) | 网页爬虫（浏览器池、解析器） | L2 标准 | [README](./crawler/README.md) |

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        FQBase 基础框架                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Core     │  │ Foundation  │  │    Util     │        │
│  │  事件/日志/  │  │ 验证/异常/   │  │ 转换/编码/   │        │
│  │    通知     │  │   重试/单例  │  │   并行      │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                 │                 │                │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐        │
│  │    Config   │  │    Cache    │  │    Date     │        │
│  │  配置管理    │  │   缓存抽象   │  │  日期时间    │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                 │                 │                │
│  ┌──────┴────────────────┼─────────────────┴──────┐        │
│  │                   DataStore                    │        │
│  │                    数据存储                     │        │
│  └──────────────────────┬───────────────────────┘        │
│                          │                                   │
│                   ┌──────┴──────┐                           │
│                   │   Crawler   │                           │
│                   │   网页爬虫   │                           │
│                   └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

## 快速开始

### 安装

```bash
pip install fquant-fqbase
```

### 组合使用示例

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)
from FQBase.Foundation import retry, validate_code
from FQBase.Config import get_env

# 初始化各个组件
event_bus = get_event_bus()
logger = get_logger('my_app')
notifier = NotificationManager()

# 事件驱动 + 日志 + 通知 的完整流程
@event_bus.subscribe('task_completed')
def on_task_completed(event):
    logger.info(f"任务完成: {event.data}")
    notifier.send(f"任务完成: {event.data}", channel='SYSTEM')

event_bus.publish(Event('task_completed', {'task_id': 123}))

# 使用重试装饰器
@retry(max_attempts=3, delay=1)
def fetch_data():
    pass

# 数据验证
validate_code('000001')
```

## 跨模块场景

### 场景 1: 事件驱动的交易信号通知

**场景描述：** 当交易策略产生信号时，通过事件总线发布消息，触发日志记录和通知推送

**涉及子模块：**
- [core/event_bus](./core/event_bus/) - 事件驱动
- [core/logger](./core/logger/) - 日志记录
- [core/notification](./core/notification/) - 通知推送

**代码示例：**

```python
from FQBase.Core import get_event_bus, get_logger, NotificationManager, Event
from FQBase.Foundation import retry

# 初始化组件
event_bus = get_event_bus()
logger = get_logger('strategy')
notifier = NotificationManager()

# 订阅交易信号事件
@event_bus.subscribe('trade_signal')
def handle_trade_signal(event):
    signal = event.data
    logger.info(f"收到交易信号: {signal}")
    notifier.send(f"交易信号: {signal}", channel='WECOM')

# 策略产生信号后发布
event_bus.publish(Event('trade_signal', {
    'code': '000001',
    'signal': 'BUY',
    'price': 12.50
}))
```

### 场景 2: 带熔断器的数据获取

**场景描述：** 使用重试机制和熔断器保护外部数据调用

**涉及子模块：**
- [foundation/retry](./foundation/retry/) - 重试机制
- [foundation/circuit_breaker](./foundation/circuit_breaker/) - 熔断器
- [cache](./cache/) - 缓存结果

**代码示例：**

```python
from FQBase.Foundation import retry, RetryError
from FQBase.Foundation.circuit_breaker import CircuitBreaker
from FQBase.Cache import CacheAdapter

# 配置熔断器
circuit_breaker = CircuitBreaker(
    failure_threshold=5,
    recovery_timeout=60
)

# 配置缓存
cache = CacheAdapter()

@circuit_breaker
@retry(max_attempts=3, delay=1, backoff=2)
def fetch_market_data(code):
    # 尝试从缓存获取
    cached = cache.get(f"market_data:{code}")
    if cached:
        return cached
    
    # 从外部获取数据
    data = external_api.fetch(code)
    cache.set(f"market_data:{code}", data, ttl=300)
    return data
```

## 快速链接

| 文档 | 说明 |
|------|------|
| [技术架构](./architecture.md) | 子模块架构与关系 |
| [API参考](./api.md) | 跨模块组合 API |
| [案例库](./examples.md) | 跨模块集成示例 |
| [变更日志](./changelog.md) | 各子模块变更汇总 |

## 核心 API 概览

### 事件总线

```python
from FQBase.Core import get_event_bus, Event

event_bus = get_event_bus()
event_bus.subscribe('topic', handler)
event_bus.publish(Event('topic', data))
```

### 日志系统

```python
from FQBase.Core import get_logger

logger = get_logger('module_name')
logger.info('message')
```

### 通知服务

```python
from FQBase.Core import NotificationManager

notifier = NotificationManager()
notifier.send('message', channel='WECOM')
```

### 数据验证

```python
from FQBase.Foundation import validate_code, validate_date

validate_code('000001')
validate_date('2024-01-01')
```

### 重试机制

```python
from FQBase.Foundation import retry

@retry(max_attempts=3, delay=1)
def unreliable_operation():
    pass
```

### 配置管理

```python
from FQBase.Config import get_env, load_env

value = get_env('KEY')
load_env('.env')
```

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQuant 首页 | [README](../README.md) |
| 子模块 | 核心组件 | [core README](./core/README.md) |
| 子模块 | 基础组件 | [foundation README](./foundation/README.md) |
| 子模块 | 工具函数 | [util README](./util/README.md) |
| 子模块 | 配置管理 | [config README](./config/README.md) |
| 子模块 | 缓存系统 | [cache README](./cache/README.md) |
| 子模块 | 日期时间 | [date README](./date/README.md) |
| 子模块 | 数据存储 | [datastore README](./datastore/README.md) |
| 子模块 | 网页爬虫 | [crawler README](./crawler/README.md) |
