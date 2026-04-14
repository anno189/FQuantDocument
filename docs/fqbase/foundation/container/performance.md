---
title: 服务容器 - 性能调优
description: 服务容器性能优化指南
tag:
  - fqbase
  - container
---

# 服务容器 - 性能调优

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[性能调优](./performance.md)** |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → **[性能调优](./performance.md)** |


## 概述

本章节介绍如何优化服务容器的性能。

## 性能特性

### 服务获取性能

| 生命周期 | 首次获取 | 后续获取 |
|---------|---------|---------|
| SINGLETON | 较高 | O(1) |
| TRANSIENT | 较高 | 较高 |
| SCOPED | 较高 | O(1) |

### 锁竞争

服务容器使用 `threading.Lock` 保护关键区域，在高并发场景下可能成为瓶颈。

## 优化策略

### 1. 减少锁竞争

```python
# 优化前：每次获取都加锁
def get(self, service_type):
    with self._lock:  # 频繁加锁
        if service_type in self._services:
            return self._services[service_type]

# 优化后：使用细粒度锁
def get(self, service_type):
    descriptor = self._services.get(service_type)  # 先不加锁获取
    if descriptor is None:
        raise KeyError(...)
    
    # 只在创建单例时加锁
    if descriptor.lifetime == ServiceLifetime.SINGLETON:
        if descriptor._instance is None:
            with self._lock:
                if descriptor._instance is None:
                    descriptor._instance = self._resolve_instance(descriptor)
        return descriptor._instance
    return self._resolve_instance(descriptor)
```

### 2. 延迟注册

```python
# 优化：延迟注册，只在需要时注册
class LazyServiceDescriptor:
    def __init__(self, factory: Callable):
        self._factory = factory
        self._instance = None
    
    def get_instance(self):
        if self._instance is None:
            self._instance = self._factory()
        return self._instance
```

### 3. 预热容器

```python
# 在应用启动时预热
def warmup_container(container: ServiceContainer):
    """预热容器，创建所有单例"""
    for service_type, descriptor in container.registered_services.items():
        if descriptor.lifetime == ServiceLifetime.SINGLETON:
            try:
                container.get(service_type)
            except Exception:
                pass  # 忽略预热失败

# 启动时调用
warmup_container(container)
```

## 性能测试

### 基准测试

```python
import time
from FQBase.Foundation.container import ServiceContainer

def benchmark_get(container: ServiceContainer, iterations: int = 10000):
    """测试服务获取性能"""
    start = time.perf_counter()
    for _ in range(iterations):
        try:
            container.get(ServiceInterface)
        except:
            pass
    end = time.perf_counter()
    return (end - start) / iterations * 1000  # 毫秒

# 运行测试
container = ServiceContainer()
container.register_singleton(ServiceInterface, ServiceImpl)

avg_time = benchmark_get(container)
print(f"平均获取时间: {avg_time:.4f}ms")
```

### 吞吐量测试

```python
import threading
import time

def throughput_test(container: ServiceContainer, threads: int = 10, duration: int = 5):
    """吞吐量测试"""
    results = []
    stop_event = threading.Event()
    
    def worker():
        count = 0
        while not stop_event.is_set():
            try:
                container.get(ServiceInterface)
                count += 1
            except:
                pass
        results.append(count)
    
    # 启动工作线程
    thread_list = [threading.Thread(target=worker) for _ in range(threads)]
    for t in thread_list:
        t.start()
    
    time.sleep(duration)
    stop_event.set()
    
    for t in thread_list:
        t.join()
    
    total = sum(results)
    print(f"总请求数: {total}")
    print(f"QPS: {total / duration}")
```

## 最佳实践

1. **选择合适的生命周期**：单例性能最好
2. **减少依赖深度**：依赖链越深，性能越差
3. **避免循环依赖**：循环依赖影响性能
4. **预热关键服务**：启动时预热

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [技术架构](./architecture.md)
