# Lifecycle 模块最佳实践

## 目录

1. [健康检查实现](#1-健康检查实现)
2. [状态使用规范](#2-状态使用规范)
3. [组合检查使用](#3-组合检查使用)
4. [初始化和关闭](#4-初始化和关闭)
5. [维护事宜](#5-维护事宜)

---

## 1. 健康检查实现

### 1.1 返回有意义的详情

```python
GOOD:
def health_check(self) -> HealthStatus:
    return HealthStatus(
        status=ServiceStatus.RUNNING,
        details={
            'connections': self.connection_count(),
            'latency_ms': self.get_latency(),
            'queue_size': self.get_queue_size()
        }
    )

BAD:
def health_check(self) -> HealthStatus:
    return HealthStatus(status=ServiceStatus.RUNNING)  # 缺少详情
```

### 1.2 正确处理异常

```python
GOOD:
def health_check(self) -> HealthStatus:
    try:
        if self.is_connected():
            return HealthStatus(ServiceStatus.RUNNING)
        return HealthStatus(ServiceStatus.ERROR, message="Not connected")
    except Exception as e:
        return HealthStatus(ServiceStatus.ERROR, message=str(e))

BAD:
def health_check(self) -> HealthStatus:
    return HealthStatus(ServiceStatus.RUNNING)  # 异常被忽略
```

### 1.3 区分 DEGRADED 和 ERROR

```python
GOOD:
def health_check(self) -> HealthStatus:
    if self.is_connected():
        latency = self.get_latency()
        if latency > 1000:
            return HealthStatus(
                status=ServiceStatus.DEGRADED,
                message="High latency",
                details={'latency_ms': latency}
            )
        return HealthStatus(ServiceStatus.RUNNING)
    return HealthStatus(ServiceStatus.ERROR, message="Not connected")
```

---

## 2. 状态使用规范

### 2.1 状态选择指南

| 场景 | 状态 |
|------|------|
| 正常服务 | RUNNING |
| 启动中 | INITIALIZING |
| 性能下降但可用 | DEGRADED |
| 正在关闭 | STOPPING |
| 已关闭 | STOPPED |
| 发生错误 | ERROR |

### 2.2 is_healthy 定义

```python
@property
def is_healthy(self) -> bool:
    return self.status in (ServiceStatus.RUNNING, ServiceStatus.INITIALIZING)
```

注意：INITIALIZING 也被视为健康，因为服务可能正在启动中。

### 2.3 状态转换验证

```python
GOOD:
def initialize(self) -> bool:
    self._status = ServiceStatus.INITIALIZING
    try:
        self._connect()
        self._status = ServiceStatus.RUNNING
        return True
    except Exception:
        self._status = ServiceStatus.ERROR
        return False

BAD:
# 状态设置混乱
def initialize(self) -> bool:
    self._status = ServiceStatus.RUNNING  # 可能还没连接成功
    self._connect()  # 连接失败时状态已设为RUNNING
```

---

## 3. 组合检查使用

### 3.1 合理的服务注册

```python
GOOD:
checker = CompositeHealthCheck()
checker.register('database', db_service)
checker.register('cache', cache_service)
checker.register('message_queue', mq_service)

BAD:
# 注册太多不相关的服务
checker.register('logger', logger_service)  # 日志服务通常不需要健康检查
checker.register('config', config_service)
```

### 3.2 定期检查

```python
import threading
import time

class HealthMonitor:
    def __init__(self, checker, interval=60):
        self.checker = checker
        self.interval = interval
        self._running = False

    def start(self):
        self._running = True
        self._thread = threading.Thread(target=self._run)
        self._thread.start()

    def _run(self):
        while self._running:
            status = self.checker.check_all()
            self._report(status)
            time.sleep(self.interval)

    def stop(self):
        self._running = False
```

### 3.3 告警集成

```python
def check_and_alert(self):
    status = self.checker.check_all()
    for name, s in status.items():
        if not s.is_healthy:
            self.send_alert(f"Service {name} is unhealthy: {s.message}")
```

---

## 4. 初始化和关闭

### 4.1 初始化最佳实践

```python
class MyService(Initializable, HealthCheckable, Shutdownable):
    def __init__(self):
        self._initialized = False
        self._is_shutdown = False
        self._connection = None

    def initialize(self) -> bool:
        try:
            self._connection = self._connect()
            self._load_config()
            self._start_background_tasks()
            self._initialized = True
            return True
        except Exception as e:
            self._initialized = False
            return False

    @property
    def is_initialized(self) -> bool:
        return self._initialized
```

### 4.2 关闭最佳实践

```python
    def shutdown(self) -> bool:
        try:
            self._stop_background_tasks()
            if self._connection:
                self._connection.close()
            self._save_state()
            self._is_shutdown = True
            return True
        except Exception as e:
            return False

    @property
    def is_shutdown(self) -> bool:
        return self._is_shutdown
```

### 4.3 优雅关闭顺序

```python
def shutdown_all(services):
    # 逆序关闭，依赖顺序反过来
    for service in reversed(services):
        if isinstance(service, Shutdownable):
            service.shutdown()
```

---

## 5. 维护事宜

### 5.1 健康检查频率

| 服务类型 | 建议频率 |
|----------|----------|
| 数据库 | 30-60秒 |
| 缓存 | 30-60秒 |
| 消息队列 | 30-60秒 |
| 外部API | 10-30秒 |

### 5.2 超时设置

```python
def health_check(self) -> HealthStatus:
    try:
        with timeout(5):  # 5秒超时
            result = self._check()
            return HealthStatus(ServiceStatus.RUNNING)
    except TimeoutError:
        return HealthStatus(ServiceStatus.ERROR, message="Health check timeout")
```

### 5.3 检查清单

- [ ] 健康检查包含有意义的详情
- [ ] 异常被正确捕获并返回 ERROR 状态
- [ ] DEGRADED 和 ERROR 状态被正确区分
- [ ] 初始化设置了正确的状态
- [ ] 关闭释放了所有资源
- [ ] 组合检查包含所有关键服务
- [ ] 健康状态用于监控和告警

### 5.4 日志规范

```python
def health_check(self) -> HealthStatus:
    try:
        status = self._perform_check()
        if status.is_healthy:
            logger.info(f"Health check OK: {self.service_name}", extra=status.details)
        else:
            logger.warning(f"Health check degraded: {self.service_name}", extra=status.details)
        return status
    except Exception as e:
        logger.error(f"Health check failed: {self.service_name}", extra={'error': str(e)})
        return HealthStatus(ServiceStatus.ERROR, message=str(e))
```
