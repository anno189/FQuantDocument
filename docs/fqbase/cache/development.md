---
title: Cache - 开发指南
description: Cache 模块开发指南与贡献指南
tag:
  - fqbase
  - cache
---

# Cache - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → **[开发指南](./development.md)** → [最佳实践](./best-practices.md) |

## 概述

本指南介绍如何开发和贡献 Cache 模块。

## 开发环境设置

### 前置要求

- Python 3.8+
- Git
- Redis（用于测试）
- MongoDB（用于测试）

### 设置

```bash
# 克隆仓库
git clone https://github.com/fquant/fquant.git
cd fquant

# 安装依赖
pip install -e .

# 安装开发依赖
pip install -e ".[dev]"
pip install pytest pytest-cov

# 安装 Redis 和 MongoDB（使用 Docker）
docker run -d -p 6379:6379 redis:7
docker run -d -p 27017:27017 mongo:6
```

## 项目结构

```
FQBase/
└── Cache/
    ├── __init__.py          # 模块导出
    ├── CacheAdapters.py     # 主要实现（LocalCache、RedisCacheAdapter、MongoCacheAdapter）
    ├── _interface.py        # 缓存接口定义
    ├── _serializers.py     # 序列化/反序列化
    ├── config_protocol.py  # 配置协议
    ├── metrics.py          # 指标收集
    └── redis_conn.py       # Redis 连接管理
```

## 代码规范

### 样式指南

- 遵循 PEP 8
- 使用类型提示
- 编写文档字符串

### 代码示例

```python
from typing import Optional, Dict, Any, Callable
import threading
from collections import OrderedDict

class MyCache:
    """本地缓存实现。

    支持 LRU 驱逐策略和 TTL 过期。

    参数:
        name: 缓存实例名称
        maxsize: 最大缓存条目数

    示例:
        >>> cache = MyCache(name='test', maxsize=10)
        >>> cache.set('key', 'value')
        >>> cache.get('key')
        'value'
    """

    def __init__(self, name: str = 'default', maxsize: int = 128) -> None:
        self.name = name
        self.maxsize = maxsize
        self._cache: OrderedDict = OrderedDict()
        self._lock = threading.Lock()

    def get(self, key: str, default: Optional[Any] = None) -> Optional[Any]:
        """获取缓存值。

        参数:
            key: 缓存键
            default: 默认返回值

        返回:
            缓存值或默认值
        """
        with self._lock:
            if key in self._cache:
                # 移动到末尾（LRU）
                self._cache.move_to_end(key)
                return self._cache[key]
            return default

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """设置缓存值。

        参数:
            key: 缓存键
            value: 缓存值
            ttl: 过期时间（秒）
        """
        with self._lock:
            if key in self._cache:
                self._cache.move_to_end(key)
            self._cache[key] = value
            # 超过容量时驱逐
            while len(self._cache) > self.maxsize:
                self._cache.popitem(last=False)
```

## 测试

### 运行测试

```bash
# 运行所有测试
pytest tests/FQBase/Cache/ -v

# 运行特定测试
pytest tests/FQBase/Cache/test_cache.py -v

# 带覆盖率运行
pytest --cov=FQBase.Cache tests/FQBase/Cache/
```

### 测试示例

```python
import pytest
import time
from FQBase.Cache import LocalCache

class TestLocalCache:
    """LocalCache 测试类"""

    def test_basic_operations(self):
        """测试基本操作"""
        cache = LocalCache(maxsize=10, ttl=60)
        
        # 测试 set/get
        cache.set('key1', 'value1')
        assert cache.get('key1') == 'value1'
        
        # 测试默认值
        assert cache.get('nonexistent') is None
        assert cache.get('nonexistent', 'default') == 'default'

    def test_ttl(self):
        """测试 TTL 过期"""
        cache = LocalCache(ttl=1)
        cache.set('key', 'value')
        
        # 未过期
        assert cache.get('key') == 'value'
        
        # 等待过期
        time.sleep(1.1)
        
        # 已过期
        assert cache.get('key') is None

    def test_eviction(self):
        """测试驱逐策略"""
        cache = LocalCache(maxsize=2, ttl=0)
        
        cache.set('key1', 'value1')
        cache.set('key2', 'value2')
        cache.set('key3', 'value3')  # 应该驱逐 key1
        
        assert cache.get('key1') is None
        assert cache.get('key2') == 'value2'
        assert cache.get('key3') == 'value3'

    def test_thread_safety(self):
        """测试线程安全"""
        import threading
        cache = LocalCache(maxsize=1000)
        
        def worker(keys):
            for i in keys:
                cache.set(f'key{i}', f'value{i}')
                cache.get(f'key{i}')
        
        # 多线程并发
        threads = []
        for i in range(10):
            t = threading.Thread(target=worker, args=(range(i*100, (i+1)*100),))
            threads.append(t)
        
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        
        # 验证数据完整性
        assert cache.stats['hits'] > 0
```

## 调试

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQBase.Cache")
logger.debug("调试信息")
```

### 常用调试技巧

```python
# 查看缓存统计
cache = LocalCache()
print(cache.stats)

# 查看 Redis 连接状态
redis = RedisCacheAdapter(host='localhost', port=6379)
print(f"连接状态: {redis.ping()}")

# 列出所有缓存键
keys = redis.scan(match='*', count=100)
print(f"缓存键: {keys}")
```

## 贡献

1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 添加测试
5. 确保测试通过
6. 提交 Pull Request

---

## 相关文档

- [API参考](./api.md)
- [设计原则](./design.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
