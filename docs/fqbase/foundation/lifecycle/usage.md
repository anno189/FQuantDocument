# Lifecycle 模块使用指南

## 目录

1. [基础用法](#1-基础用法)
2. [协议实现](#2-协议实现)
3. [组合健康检查](#3-组合健康检查)
4. [完整服务示例](#4-完整服务示例)
5. [应用启动和关闭](#5-应用启动和关闭)

---

## 1. 基础用法

### 1.1 创建健康状态

```python
from FQBase.Foundation import HealthStatus, ServiceStatus

status = HealthStatus(
    status=ServiceStatus.RUNNING,
    message="Service is healthy",
    details={'connections': 10}
)

print(status.is_healthy)  # True
```

### 1.2 检查健康状态

```python
if status.is_healthy:
    print("Service is running")
else:
    print(f"Service issue: {status.message}")
```

### 1.3 转换为字典

```python
status_dict = status.to_dict()
print(status_dict)
# {
#     'status': 'running',
#     'message': 'Service is healthy',
#     'details': {'connections': 10},
#     'timestamp': 1743600000.0,
#     'is_healthy': True
# }
```

---

## 2. 协议实现

### 2.1 实现健康检查

```python
from FQBase.Foundation import HealthCheckable, HealthStatus, ServiceStatus

class DatabaseService(HealthCheckable):
    def __init__(self):
        self._connected = False

    def health_check(self) -> HealthStatus:
        try:
            if self._connected and self.ping():
                return HealthStatus(
                    status=ServiceStatus.RUNNING,
                    details={'connections': self.connection_count()}
                )
            else:
                return HealthStatus(
                    status=ServiceStatus.ERROR,
                    message="Database not connected"
                )
        except Exception as e:
            return HealthStatus(
                status=ServiceStatus.ERROR,
                message=str(e)
            )
```

### 2.2 实现初始化

```python
from FQBase.Foundation import Initializable, HealthStatus, ServiceStatus

class CacheService(Initializable):
    def __init__(self):
        self._initialized = False

    def initialize(self) -> bool:
        try:
            self._connect()
            self._load_config()
            self._initialized = True
            return True
        except Exception:
            return False

    @property
    def is_initialized(self) -> bool:
        return self._initialized
```

### 2.3 实现关闭

```python
from FQBase.Foundation import Shutdownable, ServiceStatus

class FileService(Shutdownable):
    def __init__(self):
        self._is_shutdown = False
        self._file_handle = None

    def shutdown(self) -> bool:
        try:
            if self._file_handle:
                self._file_handle.close()
            self._is_shutdown = True
            return True
        except Exception:
            return False

    @property
    def is_shutdown(self) -> bool:
        return self._is_shutdown
```

### 2.4 组合实现

```python
from FQBase.Foundation import HealthCheckable, Initializable, Shutdownable, ServiceStatus, HealthStatus

class MyService(HealthCheckable, Initializable, Shutdownable):
    def __init__(self):
        self._initialized = False
        self._is_shutdown = False

    def initialize(self) -> bool:
        self._initialized = True
        return True

    @property
    def is_initialized(self) -> bool:
        return self._initialized

    def health_check(self) -> HealthStatus:
        if not self._initialized:
            return HealthStatus(ServiceStatus.ERROR, message="Not initialized")
        return HealthStatus(ServiceStatus.RUNNING)

    def shutdown(self) -> bool:
        self._is_shutdown = True
        return True

    @property
    def is_shutdown(self) -> bool:
        return self._is_shutdown
```

---

## 3. 组合健康检查

### 3.1 创建检查器

```python
from FQBase.Foundation import CompositeHealthCheck

checker = CompositeHealthCheck()
```

### 3.2 注册服务

```python
checker.register('database', DatabaseService())
checker.register('cache', CacheService())
checker.register('api', APIService())
```

### 3.3 检查单个服务

```python
status = checker.check('database')
if status and status.is_healthy:
    print("Database is healthy")
else:
    print(f"Database issue: {status.message if status else 'Not found'}")
```

### 3.4 检查所有服务

```python
all_status = checker.check_all()

for name, status in all_status.items():
    print(f"{name}: {status.status.value} - {status.message}")
```

### 3.5 检查是否全部健康

```python
if checker.is_all_healthy:
    print("All services are healthy")
else:
    print("Some services have issues")
```

### 3.6 注销服务

```python
checker.unregister('cache')
```

---

## 4. 完整服务示例

### 4.1 数据库服务

```python
from FQBase.Foundation import HealthCheckable, Initializable, Shutdownable, ServiceStatus, HealthStatus

class DatabaseService(HealthCheckable, Initializable, Shutdownable):
    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port
        self._connection = None
        self._initialized = False
        self._is_shutdown = False

    def initialize(self) -> bool:
        try:
            self._connection = self._connect(self.host, self.port)
            self._initialized = True
            return True
        except Exception as e:
            print(f"Database initialization failed: {e}")
            return False

    @property
    def is_initialized(self) -> bool:
        return self._initialized

    def health_check(self) -> HealthStatus:
        if not self._initialized:
            return HealthStatus(
                status=ServiceStatus.ERROR,
                message="Database not initialized"
            )

        try:
            if self._connection and self._ping():
                return HealthStatus(
                    status=ServiceStatus.RUNNING,
                    details={
                        'host': self.host,
                        'port': self.port,
                        'active': True
                    }
                )
            else:
                return HealthStatus(
                    status=ServiceStatus.DEGRADED,
                    message="Database connection lost"
                )
        except Exception as e:
            return HealthStatus(
                status=ServiceStatus.ERROR,
                message=str(e)
            )

    def shutdown(self) -> bool:
        try:
            if self._connection:
                self._connection.close()
            self._is_shutdown = True
            return True
        except Exception:
            return False

    @property
    def is_shutdown(self) -> bool:
        return self._is_shutdown
```

### 4.2 缓存服务

```python
class CacheService(HealthCheckable, Initializable, Shutdownable):
    def __init__(self, redis_url: str):
        self.redis_url = redis_url
        self._client = None
        self._initialized = False
        self._is_shutdown = False

    def initialize(self) -> bool:
        try:
            self._client = self._create_client(self.redis_url)
            self._client.ping()
            self._initialized = True
            return True
        except Exception:
            return False

    @property
    def is_initialized(self) -> bool:
        return self._initialized

    def health_check(self) -> HealthStatus:
        try:
            if not self._initialized:
                return HealthStatus(ServiceStatus.ERROR, message="Not initialized")

            response_time = self._client.ping()
            return HealthStatus(
                status=ServiceStatus.RUNNING,
                details={'response_time_ms': response_time}
            )
        except Exception as e:
            return HealthStatus(ServiceStatus.ERROR, message=str(e))

    def shutdown(self) -> bool:
        self._client.close()
        self._is_shutdown = True
        return True

    @property
    def is_shutdown(self) -> bool:
        return self._is_shutdown
```

---

## 5. 应用启动和关闭

### 5.1 应用类

```python
from FQBase.Foundation import CompositeHealthCheck, ServiceStatus

class Application:
    def __init__(self):
        self.checker = CompositeHealthCheck()
        self.services = []

    def add_service(self, name: str, service):
        self.checker.register(name, service)
        self.services.append(service)

    def startup(self):
        for service in self.services:
            if isinstance(service, Initializable):
                if not service.initialize():
                    print(f"Failed to initialize {service}")
                    return False
        return True

    def health_check(self):
        return self.checker.check_all()

    def shutdown(self):
        for service in reversed(self.services):
            if isinstance(service, Shutdownable):
                service.shutdown()
```

### 5.2 使用应用

```python
app = Application()
app.add_service('database', DatabaseService('localhost', 5432))
app.add_service('cache', CacheService('redis://localhost'))

if app.startup():
    print("Application started successfully")

    status = app.health_check()
    for name, s in status.items():
        print(f"{name}: {s.status.value}")

app.shutdown()
```

### 5.3 优雅关闭

```python
import signal
import sys

def signal_handler(signum, frame):
    print("\nShutting down gracefully...")
    app.shutdown()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)
```
