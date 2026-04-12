# FAQ

## 基础问题

### Q: lifecycle 模块提供什么功能？

`lifecycle` 模块提供生命周期管理接口，包括：

| 协议/类 | 说明 |
|----------|------|
| `HealthCheckable` | 健康检查协议 |
| `Initializable` | 初始化协议 |
| `Shutdownable` | 关闭协议 |
| `ServiceStatus` | 服务状态枚举 |
| `HealthStatus` | 健康状态数据类 |
| `CompositeHealthCheck` | 组合健康检查 |

---

### Q: 什么是服务状态？

服务状态枚举，表示服务的生命周期状态：

| 状态 | 说明 |
|------|------|
| `UNKNOWN` | 未知状态 |
| `INITIALIZING` | 初始化中 |
| `RUNNING` | 运行中 |
| `DEGRADED` | 降级运行 |
| `STOPPING` | 停止中 |
| `STOPPED` | 已停止 |
| `ERROR` | 错误状态 |

---

### Q: HealthStatus 包含哪些信息？

```python
from FQBase.Foundation.lifecycle import HealthStatus, ServiceStatus

status = HealthStatus(
    status=ServiceStatus.RUNNING,
    message="Service is healthy",
    details={'cpu': 50, 'memory': 70}
)

# 访问属性
print(status.status)      # ServiceStatus.RUNNING
print(status.message)     # "Service is healthy"
print(status.details)      # {'cpu': 50, 'memory': 70}
print(status.is_healthy)   # True
print(status.timestamp)    # Unix timestamp
```

---

## 健康检查问题

### Q: 如何实现健康检查？

```python
from FQBase.Foundation.lifecycle import HealthCheckable, HealthStatus, ServiceStatus

class MyService(HealthCheckable):
    def health_check(self) -> HealthStatus:
        # 检查服务状态
        if self.is_ready:
            return HealthStatus(
                status=ServiceStatus.RUNNING,
                message="OK",
                details={'ready': True}
            )
        else:
            return HealthStatus(
                status=ServiceStatus.DEGRADED,
                message="Not ready",
                details={'ready': False}
            )
```

---

### Q: 健康检查应该检查什么？

```python
def health_check(self) -> HealthStatus:
    """典型的健康检查内容"""
    details = {}

    # 检查依赖服务
    try:
        self.redis.ping()
        details['redis'] = 'OK'
    except Exception as e:
        details['redis'] = f'Error: {e}'
        return HealthStatus(status=ServiceStatus.ERROR, message="Redis unavailable", details=details)

    # 检查数据库
    try:
        self.db.ping()
        details['database'] = 'OK'
    except Exception as e:
        details['database'] = f'Error: {e}'
        return HealthStatus(status=ServiceStatus.ERROR, message="Database unavailable", details=details)

    # 检查资源
    details['memory'] = psutil.virtual_memory().percent

    return HealthStatus(status=ServiceStatus.RUNNING, message="All checks passed", details=details)
```

---

### Q: 什么是 CompositeHealthCheck？

组合健康检查，管理多个服务的健康检查：

```python
from FQBase.Foundation.lifecycle import CompositeHealthCheck

checker = CompositeHealthCheck()

# 注册服务
checker.register('cache', CacheService())
checker.register('database', DatabaseService())

# 检查单个
status = checker.check('cache')

# 检查所有
results = checker.check_all()

# 检查是否全部健康
if checker.is_all_healthy:
    print("All services healthy")
```

---

## 初始化问题

### Q: Initializable 协议是什么？

定义服务初始化接口：

```python
from FQBase.Foundation.lifecycle import Initializable

class MyService(Initializable):
    def __init__(self):
        self._initialized = False

    def initialize(self) -> bool:
        """执行初始化"""
        # 初始化资源
        self._resource = load_resource()
        self._initialized = True
        return True

    @property
    def is_initialized(self) -> bool:
        return self._initialized
```

---

### Q: 何时使用初始化协议？

- 连接外部资源（数据库、Redis）
- 加载配置
- 预热缓存
- 验证依赖

---

## 关闭问题

### Q: Shutdownable 协议是什么？

定义服务优雅关闭接口：

```python
from FQBase.Foundation.lifecycle import Shutdownable

class MyService(Shutdownable):
    def __init__(self):
        self._shutdown = False

    def shutdown(self) -> bool:
        """执行关闭"""
        # 清理资源
        self._resource.close()
        self._shutdown = True
        return True

    @property
    def is_shutdown(self) -> bool:
        return self._shutdown
```

---

### Q: 如何优雅关闭服务？

```python
from FQBase.Foundation.lifecycle import Shutdownable

class OrderService(Shutdownable):
    def shutdown(self) -> bool:
        # 1. 停止接受新请求
        self._accepting = False

        # 2. 等待正在处理的任务完成
        self._wait_for_pending()

        # 3. 关闭连接
        self._conn.close()

        return True

    @property
    def is_shutdown(self) -> bool:
        return self._shutdown
```

---

## 状态转换问题

### Q: 服务状态如何转换？

```
UNKNOWN → INITIALIZING → RUNNING → DEGRADED → STOPPING → STOPPED
                │             │           │
                │             │           │
                └─────────────┴───────────┴──→ ERROR
```

---

### Q: 什么是降级状态（DEGRADED）？

部分功能可用，但仍能对外服务：

```python
from FQBase.Foundation.lifecycle import ServiceStatus, HealthStatus

def health_check(self) -> HealthStatus:
    # 主服务正常，缓存不可用
    if not self._cache_available:
        return HealthStatus(
            status=ServiceStatus.DEGRADED,
            message="Running with degraded performance (cache unavailable)",
            details={'cache': 'unavailable'}
        )
    return HealthStatus(
        status=ServiceStatus.RUNNING,
        message="All systems operational"
    )
```

---

## 集成问题

### Q: 如何与容器集成？

```python
from FQBase.Foundation.container import ServiceContainer
from FQBase.Foundation.lifecycle import Initializable, Shutdownable

class ServiceContainer(Container):
    def get(self, service_type):
        service = super().get(service_type)
        # 自动初始化
        if isinstance(service, Initializable):
            if not service.is_initialized:
                service.initialize()
        return service
```

---

### Q: 如何在 Web 服务中使用？

```python
from flask import Flask

app = Flask(__name__)

@app.route('/health')
def health():
    from FQBase.Foundation.lifecycle import CompositeHealthCheck

    checker = app.config.get('health_checker')
    if checker:
        results = checker.check_all()
        unhealthy = [n for n, s in results.items() if not s.is_healthy]
        if unhealthy:
            return {'status': 'unhealthy', 'services': unhealthy}, 503
        return {'status': 'healthy'}, 200
    return {'status': 'unknown'}, 501
```

---

## 常见错误

### Q: 健康检查超时？

**原因**：健康检查本身耗时过长

```python
# 错误：健康检查本身可能阻塞
def health_check(self) -> HealthStatus:
    result = self.db.execute("SELECT 1")  # 可能很慢
    return HealthStatus(status=ServiceStatus.RUNNING)

# 解决：使用超时或简化检查
def health_check(self) -> HealthStatus:
    import socket
    try:
        sock = socket.socket()
        sock.settimeout(1)
        sock.connect((self.host, self.port))
        sock.close()
        return HealthStatus(status=ServiceStatus.RUNNING)
    except Exception as e:
        return HealthStatus(status=ServiceStatus.ERROR, message=str(e))
```

---

### Q: is_healthy 返回 False 但服务正常？

**原因**：is_healthy 的判断逻辑可能不符合预期

```python
# is_healthy 认为 INITIALIZING 也是健康的
# 如果不希望这样，需要自定义检查
def health_check(self) -> HealthStatus:
    status = self._check_status()
    is_healthy = status == ServiceStatus.RUNNING

    return HealthStatus(
        status=status,
        message="OK" if is_healthy else "Not ready"
    )
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)