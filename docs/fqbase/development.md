---
title: FQBase - 开发指南
description: FQBase 开发指南、扩展开发与贡献指南
tag:
  - fquant
  - fqbase

summary:
  purpose: development
---

# FQBase - 开发指南

## 阅读路径

🔵 **开发者**：README → development → api → design → patterns

## 概述

本文档介绍如何开发和贡献 FQBase 模块。

## 开发环境设置

### 前置要求

- Python 3.8+
- Git
- MongoDB（用于本地测试）
- Redis（可选，用于缓存测试）

### 设置

```bash
git clone https://github.com/fquant/FQuant.Server.git
cd FQuant.Server
pip install -e ./FQBase
pip install -e ".[dev]"  # 如果有 dev 依赖
```

## 项目结构

```
FQBase/
├── __init__.py              # 包入口
├── Infrastructure/           # 基础设施层
│   ├── __init__.py
│   ├── singleton.py          # 单例模式
│   ├── logger.py             # 日志系统
│   ├── exceptions.py         # 异常处理
│   ├── retry.py              # 重试机制
│   ├── circuit_breaker.py     # 熔断器
│   ├── container.py          # 依赖注入
│   └── _mongo/               # MongoDB 客户端
├── Foundation/               # 抽象层
│   ├── __init__.py
│   ├── dotty.py              # 字典访问
│   ├── event_bus.py          # 事件总线
│   ├── lifecycle.py          # 生命周期
│   └── notification.py       # 通知服务
├── Config/                   # 配置层
│   ├── __init__.py
│   ├── env.py                # 环境变量
│   ├── setting.py            # MongoDB 配置
│   └── cache_config.py      # 缓存配置
├── Cache/                    # 缓存层
│   ├── __init__.py
│   ├── CacheAdapters.py      # 缓存适配器
│   └── ...
├── DataStore/                # 数据存储层
│   ├── __init__.py
│   ├── mongo_db.py           # MongoDB 门面
│   └── ...
├── Util/                     # 工具层
│   ├── __init__.py
│   ├── converters.py
│   ├── transformer.py
│   └── ...
├── Crawler/                  # 爬虫层
│   ├── __init__.py
│   └── browser.py
└── tests/                    # 测试
    ├── __init__.py
    └── test_cache.py
```

## 代码规范

### 命名规范

- 模块名：小写 (`cache_config.py`)
- 类名：CapWords (`CacheConfig`)
- 函数名：小写下划线 (`get_cache_config`)
- 常量：大写下划线 (`MAX_POOL_SIZE`)

### 类型提示

```python
from typing import Optional, Dict, List, Any

def create_cache(config: Optional[CacheConfigProtocol] = None) -> CacheInterface:
    ...
```

### 文档字符串

```python
def fetch_data(url: str, timeout: int = 30) -> str:
    """
    获取页面内容

    Args:
        url: 目标URL
        timeout: 超时时间（秒）

    Returns:
        页面HTML内容

    Raises:
        DataFetchException: 当请求失败时
    """
    ...
```

### 日志记录

```python
import logging

logger = logging.getLogger(__name__)

def some_function():
    logger.debug("Debug message")
    logger.info("Info message")
    logger.warning("Warning message")
    logger.error("Error message", exc_info=True)
```

## 测试

### 运行测试

```bash
pytest FQBase/tests/
pytest FQBase/tests/test_cache.py
pytest -v FQBase/tests/
```

### 编写测试

```python
import pytest
from FQBase.Cache import LocalCache

class TestLocalCache:
    def test_set_get(self):
        cache = LocalCache(name="test", ttl=60)
        cache.set("key", "value")
        assert cache.get("key") == "value"

    def test_ttl(self):
        cache = LocalCache(name="test", ttl=1)
        cache.set("key", "value")
        import time
        time.sleep(1.1)
        assert cache.get("key") is None
```

### 测试覆盖

```bash
pytest --cov=FQBase --cov-report=html FQBase/tests/
```

## 调试

### 启用调试日志

```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQBase")
logger.setLevel(logging.DEBUG)
```

### 使用断点

```python
import pdb; pdb.set_trace()
# 或
breakpoint()
```

## 扩展开发

### 扩展点 1: 自定义缓存后端

```python
from FQBase.Cache import CacheInterface, register_cache_adapter

class CustomCacheAdapter(CacheInterface):
    def __init__(self, config):
        self._config = config

    def get(self, key: str):
        # 自定义获取逻辑
        return self._backend.get(key)

    def set(self, key: str, value: Any, ttl: int = 0):
        # 自定义设置逻辑
        self._backend.set(key, value, ttl)

# 注册适配器
register_cache_adapter('custom', lambda cfg: CustomCacheAdapter(cfg))

# 使用
cache = create_cache(CustomCacheConfig(cache_type='custom'))
```

### 扩展点 2: 自定义通知渠道

```python
from FQBase.Foundation.notification import NotificationHandler

class SlackHandler(NotificationHandler):
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url

    def send(self, message: str, **kwargs):
        # 发送到 Slack
        requests.post(self.webhook_url, json={"text": message})

# 使用
manager = NotificationManager()
manager.register("slack", SlackHandler(webhook_url="https://hooks.slack.com/..."))
manager.send("slack", "Hello!")
```

### 扩展点 3: 自定义事件处理器

```python
from FQBase.Foundation.event_bus import Event

class AsyncEventHandler:
    async def handle(self, event: Event):
        # 异步处理
        await process_event(event)

bus = EventBus()
bus.subscribe_async("data", AsyncEventHandler().handle)
```

## 贡献

### 提交流程

1. Fork 仓库
2. 创建功能分支
   ```bash
   git checkout -b feature/my-feature
   ```
3. 进行更改
4. 添加测试
   ```bash
   pytest FQBase/tests/test_my_feature.py
   ```
5. 提交 Pull Request
   ```bash
   git add .
   git commit -m "feat: add my feature"
   git push origin feature/my-feature
   ```

### PR 审查清单

- [ ] 代码符合命名规范
- [ ] 有类型提示
- [ ] 有文档字符串
- [ ] 有单元测试
- [ ] 测试通过
- [ ] 没有引入新的 lint 警告

### 版本发布

```bash
# 更新版本号
vim FQBase/__init__.py
# 提交版本更新
git commit -m "chore: bump version to x.y.z"
git tag vx.y.z
git push origin vx.y.z
```

## 相关文档

- [API参考](./api.md)
- [设计原则](./design.md)
- [设计模式](./patterns.md)
