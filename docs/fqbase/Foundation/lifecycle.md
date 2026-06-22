---
title: lifecycle - 生命周期管理
description: 提供健康检查、初始化、关闭等生命周期协议
tag:
  - fquant
  - fqbase
  - foundation
  - lifecycle

summary:
  type: protocol
  complexity: low
  maturity: stable
  size: small
  is_container: false
  api_exports:
    total: 5
    classes:
      - name: ServiceStatus
        signature: "class ServiceStatus"
        description: 服务状态枚举
        source: "lifecycle.py#L18"
      - name: HealthStatus
        signature: "class HealthStatus"
        description: 健康状态
        source: "lifecycle.py#L95"
      - name: CompositeHealthCheck
        signature: "class CompositeHealthCheck"
        description: 组合健康检查
        source: "lifecycle.py#L136"
    protocols:
      - name: HealthCheckable
        signature: "Protocol"
        description: 健康检查协议
        source: "lifecycle.py#L30"
      - name: Initializable
        signature: "Protocol"
        description: 初始化协议
        source: "lifecycle.py#L54"
      - name: Shutdownable
        signature: "Protocol"
        description: 关闭协议
        source: "lifecycle.py#L75"
  features:
    has_async: false
    is_thread_safe: false
    has_config: false
    has_logging: false
    has_security: false
  design_patterns:
    - protocol
  source_location: "Foundation/lifecycle.py"
  source_mtime: 1776751707
  last_updated: "2026-04"

relationships:
  belongs_to:
    - fquant.fqbase.foundation
---

# lifecycle - 生命周期管理

## 一句话总览

📌 **提供健康检查、初始化、关闭等生命周期协议，支持服务状态管理和组合健康检查。**

---

## 核心 API

### ServiceStatus

**位置：** `lifecycle.py#L18`

**描述：** 服务状态枚举

```python
from FQBase.Foundation.lifecycle import ServiceStatus

print(ServiceStatus.RUNNING)
print(ServiceStatus.ERROR)
```

#### 枚举值

| 状态 | 值 | 描述 |
|------|-----|------|
| UNKNOWN | unknown | 未知状态 |
| INITIALIZING | initializing | 初始化中 |
| RUNNING | running | 运行中 |
| DEGRADED | degraded | 降级运行 |
| STOPPING | stopping | 停止中 |
| STOPPED | stopped | 已停止 |
| ERROR | error | 错误状态 |

---

### HealthCheckable

**位置：** `lifecycle.py#L30`

**描述：** 健康检查协议（Protocol），实现此协议的类可以提供健康状态检查

```python
from FQBase.Foundation.lifecycle import HealthCheckable, HealthStatus, ServiceStatus

class MyService(HealthCheckable):
    def health_check(self) -> HealthStatus:
        return HealthStatus(
            status=ServiceStatus.RUNNING,
            details={'connections': 10}
        )
```

#### 必须实现

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| `health_check()` | `HealthStatus` | 执行健康检查 |

---

### Initializable

**位置：** `lifecycle.py#L54`

**描述：** 初始化协议，实现此协议的类支持显式初始化

```python
from FQBase.Foundation.lifecycle import Initializable

class MyService(Initializable):
    def initialize(self) -> bool:
        return True

    @property
    def is_initialized(self) -> bool:
        return True
```

#### 必须实现

| 方法/属性 | 返回类型 | 描述 |
|-----------|---------|------|
| `initialize()` | `bool` | 执行初始化 |
| `is_initialized` | `bool` | 是否已初始化 |

---

### Shutdownable

**位置：** `lifecycle.py#L75`

**描述：** 关闭协议，实现此协议的类支持优雅关闭

```python
from FQBase.Foundation.lifecycle import Shutdownable

class MyService(Shutdownable):
    def shutdown(self) -> bool:
        return True

    @property
    def is_shutdown(self) -> bool:
        return False
```

#### 必须实现

| 方法/属性 | 返回类型 | 描述 |
|-----------|---------|------|
| `shutdown()` | `bool` | 执行关闭 |
| `is_shutdown` | `bool` | 是否已关闭 |

---

### HealthStatus

**位置：** `lifecycle.py#L95`

**描述：** 健康状态对象

```python
from FQBase.Foundation.lifecycle import HealthStatus, ServiceStatus

status = HealthStatus(
    status=ServiceStatus.RUNNING,
    message="OK",
    details={'connections': 10}
)

print(status.is_healthy)
print(status.to_dict())
```

#### 构造参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| status | ServiceStatus | UNKNOWN | 服务状态 |
| message | str | None | 状态消息 |
| details | Dict | None | 详细信息 |

#### 属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `is_healthy` | bool | 是否健康（RUNNING 或 INITIALIZING） |
| `to_dict()` | Dict | 转换为字典 |

---

### CompositeHealthCheck

**位置：** `lifecycle.py#L136`

**描述：** 组合健康检查，管理多个服务的健康检查

```python
from FQBase.Foundation.lifecycle import CompositeHealthCheck

checker = CompositeHealthCheck()
checker.register('cache', cache_service)
checker.register('database', db_service)

status = checker.check_all()
print(checker.is_all_healthy)
```

#### 核心方法

| 方法 | 描述 |
|------|------|
| `register(name, service)` | 注册服务 |
| `unregister(name)` | 注销服务 |
| `check(name)` | 检查单个服务 |
| `check_all()` | 检查所有服务 |
| `is_all_healthy` | 所有服务是否健康 |

---

## 使用场景

### 场景1：实现健康检查

```python
from FQBase.Foundation.lifecycle import HealthCheckable, HealthStatus, ServiceStatus

class DatabaseService(HealthCheckable):
    def health_check(self) -> HealthStatus:
        try:
            self.connection.ping()
            return HealthStatus(status=ServiceStatus.RUNNING)
        except Exception as e:
            return HealthStatus(status=ServiceStatus.ERROR, message=str(e))
```

### 场景2：组合健康检查

```python
from FQBase.Foundation.lifecycle import CompositeHealthCheck

composite = CompositeHealthCheck()
composite.register('db', DatabaseService())
composite.register('cache', CacheService())

results = composite.check_all()
for name, status in results.items():
    print(f"{name}: {status.is_healthy}")
```

### 场景3：完整生命周期

```python
from FQBase.Foundation.lifecycle import HealthCheckable, Initializable, Shutdownable, HealthStatus, ServiceStatus

class MyService(HealthCheckable, Initializable, Shutdownable):
    def __init__(self):
        self._initialized = False
        self._shutdown = False

    def initialize(self) -> bool:
        self._initialized = True
        return True

    @property
    def is_initialized(self) -> bool:
        return self._initialized

    def health_check(self) -> HealthStatus:
        return HealthStatus(
            status=ServiceStatus.RUNNING if self._initialized else ServiceStatus.ERROR
        )

    def shutdown(self) -> bool:
        self._shutdown = True
        return True

    @property
    def is_shutdown(self) -> bool:
        return self._shutdown
```

## 设计模式

- **Protocol 模式**：使用运行时可检查协议定义接口
- **组合模式**：CompositeHealthCheck 组合多个健康检查

## 相关文档

- [Foundation README](./README.md)
- [Foundation API](./api.md)
