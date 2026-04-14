---
title: Circuit Breaker 模块 - 性能调优
description: Circuit Breaker 熔断器模块性能优化指南
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 性能调优

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[性能调优](./performance.md)** |
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → **[性能调优](./performance.md)** |


## 概述

本文档提供 Circuit Breaker 熔断器模块的性能优化指南。

## 性能指标

### 关键指标

| 指标 | 描述 | 目标 |
|------|------|------|
| 延迟 | 熔断判断延迟 | < 1ms |
| 吞吐量 | 每秒处理请求数 | > 100,000 RPS |
| 内存 | 内存占用 | < 1MB（每个实例） |
| CPU | CPU 使用率 | < 1% |

### 测量性能

```python
import time
from FQBase.Foundation import CircuitBreaker

breaker = CircuitBreaker(name="test")

def dummy_func():
    return "ok"

# 测量调用延迟
iterations = 100000
start = time.perf_counter()
for _ in range(iterations):
    breaker.call(dummy_func)
elapsed = time.perf_counter() - start

print(f"平均延迟: {elapsed/iterations*1000000:.2f}μs")
print(f"吞吐量: {iterations/elapsed:.0f} RPS")
```

## 优化策略

### 1. 减少锁竞争

**优化前（高竞争）：**

```python
# 每次调用都需要获取锁
for _ in range(10000):
    breaker.call(func)
```

**优化后（批量处理）：**

```python
# 使用批量处理减少锁竞争
@circuit_breaker(name="batch_api")
def batch_call(items):
    return [process(item) for item in items]
```

### 2. 合理设置阈值

**优化建议：**

```python
# 根据服务稳定性设置阈值
breaker = CircuitBreaker(
    name="stable_service",    # 稳定服务
    failure_threshold=20,      # 较高阈值
    success_threshold=5,       # 较多成功才关闭
    recovery_timeout=120       # 较长恢复时间
)

breaker = CircuitBreaker(
    name="unstable_service",   # 不稳定服务
    failure_threshold=3,       # 较低阈值，快速熔断
    success_threshold=1,       # 1 次成功即关闭
    recovery_timeout=30       # 较短恢复时间
)
```

### 3. 异步优化

**优化前（同步阻塞）：**

```python
# 同步调用
def sync_call():
    return breaker.call(func)
```

**优化后（异步）：**

```python
# 异步调用
async def async_call():
    return await breaker.call_async(async_func)
```

### 4. 状态缓存

**优化建议：**

```python
# 批量获取状态而不是逐个查询
statuses = manager.get_all_status()  # 一次获取所有
```

## 资源限制

### 配置限制

```yaml
# 生产环境配置
circuit_breaker:
  max_instances: 100          # 最大实例数
  default_threshold: 5         # 默认失败阈值
  default_timeout: 60          # 默认恢复超时
  enable_metrics: true         # 启用指标收集
  metrics_interval: 60         # 指标收集间隔
```

### 监控资源使用

```python
from FQBase.Foundation import CircuitBreakerManager

manager = CircuitBreakerManager()

# 获取所有熔断器状态
all_status = manager.get_all_status()

# 计算资源占用
total_circuits = len(all_status)
total_calls = sum(
    s['metrics']['total_calls'] 
    for s in all_status.values()
)

print(f"熔断器数量: {total_circuits}")
print(f"总调用次数: {total_calls}")
```

## 基准测试

### 运行基准测试

```python
import time
import threading

def benchmark_circuit_breaker():
    breaker = CircuitBreaker(name="benchmark")
    
    def func():
        return "ok"
    
    # 单线程基准测试
    iterations = 100000
    start = time.perf_counter()
    for _ in range(iterations):
        breaker.call(func)
    single_thread = time.perf_counter() - start
    
    # 多线程基准测试
    iterations = 10000
    threads = 10
    
    def worker():
        for _ in range(iterations):
            breaker.call(func)
    
    start = time.perf_counter()
    thread_list = [threading.Thread(target=worker) for _ in range(threads)]
    for t in thread_list:
        t.start()
    for t in thread_list:
        t.join()
    multi_thread = time.perf_counter() - start
    
    print(f"单线程: {iterations/single_thread:.0f} RPS")
    print(f"多线程: {iterations*threads/multi_thread:.0f} RPS")

benchmark_circuit_breaker()
```

## 性能最佳实践

1. **合理设置阈值** - 根据服务稳定性调整
2. **减少锁粒度** - 只在必要时加锁
3. **使用异步** - 高并发场景使用异步方法
4. **批量处理** - 减少单次调用开销
5. **监控指标** - 持续监控性能指标

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [技术架构](./architecture.md)
