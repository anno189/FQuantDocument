# Lifecycle 模块框架

## 1. 概述

Lifecycle 模块提供了一套生命周期管理的协议和工具，用于标准化服务的初始化、健康检查和关闭流程。

### 1.1 解决的问题

```python
# 传统方式 - 无统一生命周期管理
class MyService:
    def start(self): ...
    def stop(self): ...
    def check(self): ...

# 使用协议 - 统一生命周期接口
class MyService(HealthCheckable, Initializable, Shutdownable):
    def health_check(self): ...
    def initialize(self): ...
    def shutdown(self): ...
```

### 1.2 何时使用

- 服务需要健康检查
- 服务需要显式初始化
- 服务需要优雅关闭
- 需要统一管理多个服务的生命周期

## 2. 服务状态

### 2.1 ServiceStatus 枚举

| 状态 | 说明 |
|------|------|
| `UNKNOWN` | 未知状态 |
| `INITIALIZING` | 初始化中 |
| `RUNNING` | 运行中 |
| `DEGRADED` | 降级状态 |
| `STOPPING` | 停止中 |
| `STOPPED` | 已停止 |
| `ERROR` | 错误状态 |

### 2.2 状态转换

```
UNKNOWN → INITIALIZING → RUNNING
                         ↓
                      DEGRADED (可选)
                         ↓
                      STOPPING → STOPPED

ANY → ERROR (异常情况)
```

## 3. 协议

### 3.1 HealthCheckable

```python
@runtime_checkable
class HealthCheckable(Protocol):
    def health_check(self) -> HealthStatus:
        """执行健康检查"""
        ...
```

### 3.2 Initializable

```python
@runtime_checkable
class Initializable(Protocol):
    def initialize(self) -> bool:
        """初始化服务"""
        ...

    @property
    def is_initialized(self) -> bool:
        """是否已初始化"""
        ...
```

### 3.3 Shutdownable

```python
@runtime_checkable
class Shutdownable(Protocol):
    def shutdown(self) -> bool:
        """关闭服务"""
        ...

    @property
    def is_shutdown(self) -> bool:
        """是否已关闭"""
        ...
```

## 4. 健康状态

### 4.1 HealthStatus

```python
class HealthStatus:
    def __init__(
        self,
        status: ServiceStatus = ServiceStatus.UNKNOWN,
        message: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        self.status = status
        self.message = message or status.value
        self.details = details or {}
        self.timestamp = time.time()
```

### 4.2 is_healthy 属性

```python
@property
def is_healthy(self) -> bool:
    return self.status in (ServiceStatus.RUNNING, ServiceStatus.INITIALIZING)
```

## 5. 组合健康检查

### 5.1 CompositeHealthCheck

```python
checker = CompositeHealthCheck()
checker.register('database', db_service)
checker.register('cache', cache_service)

status = checker.check_all()
print(checker.is_all_healthy)
```

### 5.2 使用场景

- 应用启动时检查所有依赖服务
- 定期检查服务健康状态
- 统一监控面板

## 6. 核心组件

| 组件 | 说明 |
|------|------|
| `ServiceStatus` | 服务状态枚举 |
| `HealthCheckable` | 健康检查协议（运行时检查） |
| `Initializable` | 初始化协议 |
| `Shutdownable` | 关闭协议 |
| `HealthStatus` | 健康状态数据类 |
| `CompositeHealthCheck` | 组合健康检查器 |
