# Lifecycle 模块架构

## 1. 模块结构

```
lifecycle.py
├── ServiceStatus (Enum)        # 服务状态枚举
├── HealthCheckable (Protocol)  # 健康检查协议
├── Initializable (Protocol)     # 初始化协议
├── Shutdownable (Protocol)     # 关闭协议
├── HealthStatus               # 健康状态类
└── CompositeHealthCheck      # 组合健康检查
```

## 2. 核心组件

### 2.1 ServiceStatus

```python
class ServiceStatus(Enum):
    UNKNOWN = "unknown"
    INITIALIZING = "initializing"
    RUNNING = "running"
    DEGRADED = "degraded"
    STOPPING = "stopping"
    STOPPED = "stopped"
    ERROR = "error"
```

服务状态的完整生命周期。

### 2.2 HealthCheckable

```python
@runtime_checkable
class HealthCheckable(Protocol):
    def health_check(self) -> 'HealthStatus':
        ...
```

使用 `@runtime_checkable` 支持运行时类型检查。

### 2.3 HealthStatus

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

### 2.4 CompositeHealthCheck

```python
class CompositeHealthCheck:
    def __init__(self):
        self._services: Dict[str, HealthCheckable] = {}
```

管理多个健康检查服务。

## 3. 协议设计

### 3.1 运行时检查

使用 `@runtime_checkable` 使协议支持运行时类型检查：

```python
@runtime_checkable
class HealthCheckable(Protocol):
    def health_check(self) -> HealthStatus:
        ...

isinstance(service, HealthCheckable)  # True
```

### 3.2 鸭子类型

协议采用鸭子类型，只要实现了相应方法就满足协议：

```python
class MyService:
    def health_check(self) -> HealthStatus:
        return HealthStatus(ServiceStatus.RUNNING)

isinstance(MyService(), HealthCheckable)  # True
```

## 4. 健康检查流程

```
check_all()
        │
        ▼
┌─────────────────────────────────────┐
│  遍历所有注册服务                     │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│  调用 service.health_check()         │
└─────────────────────────────────────┘
        │
        ├─── 成功 ──► 返回 HealthStatus
        │
        └─── 异常 ──► 返回 HealthStatus(ERROR)
```

## 5. 组合健康检查数据流

```
┌─────────────────────────────────────────────────────────────────┐
│                    CompositeHealthCheck                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              _services: Dict[str, HealthCheckable]      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐           │
│         ▼                    ▼                    ▼           │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐    │
│  │  Database   │      │    Cache    │      │    API      │    │
│  │ HealthCheck│      │ HealthCheck│      │ HealthCheck │    │
│  └─────────────┘      └─────────────┘      └─────────────┘    │
│         │                    │                    │           │
│         └────────────────────┴────────────────────┘           │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    check_all()                          │   │
│  │         Dict[str, HealthStatus]                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 6. 依赖关系

```
lifecycle.py
│
├── typing (Protocol, runtime_checkable)
├── enum (Enum)
│
└── 无外部依赖
```

## 7. 状态转换图

```
                    ┌─────────────────────────────────────┐
                    │                                     │
                    ▼                                     │
              ┌──────────┐                                │
              │ UNKNOWN  │                                │
              └──────────┘                                │
                    │                                     │
                    ▼                                     │
              ┌───────────────┐                          │
              │ INITIALIZING  │                          │
              └───────────────┘                          │
                    │                                     │
                    ▼                                     │
              ┌──────────┐      ┌────────────┐           │
              │ RUNNING  │─────►│  DEGRADED  │           │
              └──────────┘      └────────────┘           │
                    │                  │                  │
                    │                  │                  │
                    ▼                  ▼                  │
              ┌────────────┐      ┌──────────┐           │
              │  STOPPING  │      │   ERROR  │           │
              └────────────┘      └──────────┘           │
                    │                                     │
                    ▼                                     │
              ┌──────────┐                                │
              │ STOPPED  │                                │
              └──────────┘                                │
```
