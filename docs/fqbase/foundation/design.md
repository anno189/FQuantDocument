---
title: Foundation - 设计原则
description: Foundation 设计原则和决策
tag:
  - fquant
  - fqbase
  - foundation

summary:
  purpose: design
---

# Foundation - 设计原则

## 阅读路径

🟠 **架构师**：README → design → patterns

## 核心设计原则

### 1. 单一职责原则

每个子模块只负责一个功能领域：

| 模块 | 职责 |
|------|------|
| dotty | 字典点号访问 |
| lifecycle | 生命周期协议 |
| event_bus | 事件发布订阅 |
| notification | 通知发送 |
| notification_template | 模板管理 |

### 2. 依赖倒置

Foundation 依赖 Infrastructure（底层）而非具体实现：

```
业务层 (Foundation)
    │
    ▼
基础设施层 (Infrastructure)
```

### 3. 协议优先

使用 Protocol 定义接口契约：

```python
@runtime_checkable
class HealthCheckable(Protocol):
    def health_check(self) -> 'HealthStatus':
        ...
```

### 4. 组合优于继承

通过协议组合实现功能：

```python
class MyService(HealthCheckable, Initializable, Shutdownable):
    pass
```

## 设计决策记录

### 决策1：为什么使用单例模式？

**问题：** EventBus 是否应该使用单例？

**选项：**
- A. 单例模式
- B. 依赖注入

**决策：** A. 单例模式

**理由：** 事件总线是全局通信设施，单例简化使用，避免传递 bus 实例。

### 决策2：为什么使用弱引用订阅？

**问题：** 订阅者引用方式？

**选项：**
- A. 强引用（可能内存泄漏）
- B. 弱引用（可能被 GC）

**决策：** B. 弱引用

**理由：** 防止订阅者忘记取消订阅导致的内存泄漏。

### 决策3：为什么不包含业务逻辑？

**问题：** Foundation 层应该包含业务逻辑吗？

**决策：** 不包含

**理由：** Foundation 提供通用抽象，业务逻辑应在业务层实现。

## 相关文档

- [架构](./architecture.md)
- [设计模式](./patterns.md)
