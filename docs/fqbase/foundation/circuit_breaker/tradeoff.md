---
title: Circuit Breaker 模块 - 技术权衡
description: Circuit Breaker 熔断器设计中的技术权衡分析
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 技术权衡

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → **[技术权衡](./tradeoff.md)** → [决策指南](./decision-guide.md) → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → **[技术权衡](./tradeoff.md)** |


## 概述

本文档分析 Circuit Breaker 熔断器设计中的技术权衡决策。

## 权衡 1: 失败阈值设置

### 考量因素

| 因素 | 低阈值 (3) | 高阈值 (20) |
|------|------------|-------------|
| 灵敏度 | 高，快速熔断 | 低，可能漏报 |
| 误判率 | 高，可能误熔断 | 低，稳定 |
| 恢复速度 | 快 | 慢 |
| 系统负载 | 低 | 高 |

### 决策

**采用动态阈值策略**：默认 5，允许运行时调整

```python
# 稳定服务
breaker = CircuitBreaker(failure_threshold=20)

# 不稳定服务  
breaker = CircuitBreaker(failure_threshold=3)
```

### 后果

- 正面：灵活适应不同服务特性
- 负面：需要经验判断

---

## 权衡 2: 同步 vs 异步

### 考量因素

| 因素 | 同步实现 | 异步实现 |
|------|---------|---------|
| 性能 | 一般 | 高 |
| 复杂度 | 低 | 高 |
| 适用场景 | 同步代码 | 高并发 |
| 资源占用 | 阻塞线程 | 非阻塞 |

### 决策

**同时支持同步和异步**

```python
# 同步调用
result = breaker.call(func)

# 异步调用
result = await breaker.call_async(async_func)
```

### 后果

- 正面：灵活适应不同场景
- 负面：代码复杂度增加

---

## 权衡 3: 锁粒度

### 考量因素

| 因素 | 粗粒度锁 | 细粒度锁 |
|------|---------|---------|
| 线程安全 | 简单保证 | 需要精细设计 |
| 并发性能 | 差 | 好 |
| 复杂度 | 低 | 高 |
| Bug 风险 | 低 | 高 |

### 决策

**使用单一粗粒度锁简化实现**

```python
class CircuitBreaker:
    def __init__(self):
        self._lock = threading.Lock()  # 单一锁
    
    def call(self, func):
        with self._lock:  # 所有操作加锁
            # 状态检查和函数执行
```

### 后果

- 正面：实现简单，线程安全保证
- 负面：并发性能有一定损失

---

## 权衡 4: 指标存储

### 考量因素

| 因素 | 内存存储 | 外部存储 |
|------|---------|---------|
| 性能 | 快 | 慢 |
| 持久性 | 无 | 有 |
| 复杂度 | 低 | 高 |
| 分布式 | 不支持 | 支持 |

### 决策

**使用内存存储，外部存储可选**

```python
@dataclass
class CircuitBreakerMetrics:
    # 内存存储
    total_calls: int = 0
    successful_calls: int = 0
    # ...
```

### 后果

- 正面：高性能，实现简单
- 负面：重启后指标丢失

---

## 权衡 5: 装饰器 vs 手动

### 考量因素

| 因素 | 装饰器 | 手动调用 |
|------|--------|---------|
| 易用性 | 高 | 低 |
| 灵活性 | 低 | 高 |
| 透明度 | 高 | 无 |
| 可测试性 | 低 | 高 |

### 决策

**同时支持两种方式**

```python
# 装饰器（简单场景）
@circuit_breaker
def call_api():
    return api.request()

# 手动（复杂场景）
breaker = CircuitBreaker()
result = breaker.call(func)
```

### 后果

- 正面：满足不同需求
- 负面：两套代码需要维护

---

## 相关文档

- [设计模式](./patterns.md)
- [决策指南](./decision-guide.md)
- [案例研究](./case-studies.md)
- [数据流](./data-flow.md)
