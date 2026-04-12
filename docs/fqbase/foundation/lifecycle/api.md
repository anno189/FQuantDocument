# Lifecycle 模块 API 参考

## 目录

- [枚举](#1-枚举)
- [协议](#2-协议)
- [健康状态类](#3-健康状态类)
- [组合健康检查](#4-组合健康检查)

---

## 1. 枚举

### ServiceStatus

```python
class ServiceStatus(Enum)
```

服务状态枚举。

| 值 | 说明 |
|----|------|
| `UNKNOWN` | 未知状态 |
| `INITIALIZING` | 初始化中 |
| `RUNNING` | 运行中 |
| `DEGRADED` | 降级状态 |
| `STOPPING` | 停止中 |
| `STOPPED` | 已停止 |
| `ERROR` | 错误状态 |

---

## 2. 协议

### HealthCheckable

```python
@runtime_checkable
class HealthCheckable(Protocol)
```

健康检查协议。

**方法**：

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `health_check()` | `HealthStatus` | 执行健康检查 |

**示例**：

```python
class MyService(HealthCheckable):
    def health_check(self) -> HealthStatus:
        return HealthStatus(
            status=ServiceStatus.RUNNING,
            details={'connections': 10}
        )
```

---

### Initializable

```python
@runtime_checkable
class Initializable(Protocol)
```

初始化协议。

**方法**：

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `initialize()` | `bool` | 初始化服务 |
| `is_initialized` (property) | `bool` | 是否已初始化 |

**示例**：

```python
class MyService(Initializable):
    _initialized = False

    def initialize(self) -> bool:
        self._initialized = True
        return True

    @property
    def is_initialized(self) -> bool:
        return self._initialized
```

---

### Shutdownable

```python
@runtime_checkable
class Shutdownable(Protocol)
```

关闭协议。

**方法**：

| 方法 | 返回类型 | 说明 |
|------|----------|------|
| `shutdown()` | `bool` | 关闭服务 |
| `is_shutdown` (property) | `bool` | 是否已关闭 |

**示例**：

```python
class MyService(Shutdownable):
    _is_shutdown = False

    def shutdown(self) -> bool:
        self._is_shutdown = True
        return True

    @property
    def is_shutdown(self) -> bool:
        return self._is_shutdown
```

---

## 3. 健康状态类

### HealthStatus

```python
class HealthStatus
```

健康状态数据类。

**初始化参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `status` | `ServiceStatus` | UNKNOWN | 服务状态 |
| `message` | `Optional[str]` | None | 状态消息 |
| `details` | `Optional[Dict[str, Any]]` | None | 详细信息 |

**属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `status` | `ServiceStatus` | 服务状态 |
| `message` | `str` | 状态消息 |
| `details` | `Dict[str, Any]` | 详细信息 |
| `timestamp` | `float` | 检查时间戳 |
| `is_healthy` | `bool` | 是否健康（RUNNING或INITIALIZING） |

**方法**：

#### to_dict

```python
def to_dict(self) -> Dict[str, Any]
```

转换为字典。

**返回**：包含所有字段的字典

**示例**：

```python
status = HealthStatus(
    status=ServiceStatus.RUNNING,
    message="Service is running",
    details={'connections': 10}
)
result = status.to_dict()
# {
#     'status': 'running',
#     'message': 'Service is running',
#     'details': {'connections': 10},
#     'timestamp': 1743600000.0,
#     'is_healthy': True
# }
```

---

## 4. 组合健康检查

### CompositeHealthCheck

```python
class CompositeHealthCheck
```

组合健康检查器。

**初始化**：无参数

**方法**：

#### register

```python
def register(self, name: str, service: HealthCheckable) -> None
```

注册服务。

**参数**：
- `name` - 服务名称
- `service` - 实现 HealthCheckable 的服务实例

#### unregister

```python
def unregister(self, name: str) -> None
```

注销服务。

**参数**：
- `name` - 服务名称

#### check

```python
def check(self, name: str) -> Optional[HealthStatus]
```

检查单个服务。

**参数**：
- `name` - 服务名称

**返回**：`HealthStatus` 或 None（服务不存在时）

**抛出**：异常时返回 `HealthStatus(ERROR)`

#### check_all

```python
def check_all(self) -> Dict[str, HealthStatus]
```

检查所有服务。

**返回**：服务名称到 `HealthStatus` 的映射字典

**属性**：

#### is_all_healthy

```python
@property
def is_all_healthy(self) -> bool
```

所有服务是否健康。

**返回**：所有服务都健康返回 True
