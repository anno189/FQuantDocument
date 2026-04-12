# Lifecycle 开发指南

## 模块简介

`lifecycle` 模块提供生命周期管理接口，包括健康检查、初始化、关闭等协议定义。

### 核心组件

| 组件 | 类型 | 说明 |
|------|------|------|
| `HealthCheckable` | 协议 | 健康检查协议 |
| `Initializable` | 协议 | 初始化协议 |
| `Shutdownable` | 协议 | 关闭协议 |
| `ServiceStatus` | 枚举 | 服务状态枚举 |
| `HealthStatus` | 数据类 | 健康状态 |
| `CompositeHealthCheck` | 类 | 组合健康检查 |

---

## 开发环境

### 环境要求

- Python 3.8+
- pytest（用于测试）

### 安装

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pip install -e .
```

### 验证安装

```bash
python -c "from FQBase.Foundation.lifecycle import ServiceStatus, HealthStatus, CompositeHealthCheck; print('OK')"
```

---

## 本地调试

### 基本调试流程

```python
from FQBase.Foundation.lifecycle import ServiceStatus, HealthStatus

# 创建健康状态
status = HealthStatus(
    status=ServiceStatus.RUNNING,
    message="Service is running",
    details={'connections': 10}
)

print(f"Status: {status.status}")
print(f"Is healthy: {status.is_healthy}")
print(f"Details: {status.details}")
```

### 调试组合健康检查

```python
from FQBase.Foundation.lifecycle import (
    CompositeHealthCheck,
    ServiceStatus,
    HealthStatus
)

checker = CompositeHealthCheck()

# 注册服务
checker.register('cache', CacheService())
checker.register('database', DatabaseService())

# 检查所有服务
results = checker.check_all()
for name, status in results.items():
    print(f"{name}: {status.status.value}")
```

---

## 测试指南

### 运行测试

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pytest -v FQBase/Foundation/test_lifecycle.py
```

### 测试结构

```python
import pytest
from FQBase.Foundation.lifecycle import (
    ServiceStatus,
    HealthStatus,
    CompositeHealthCheck
)

class TestHealthStatus:
    def test_healthy_status(self):
        status = HealthStatus(
            status=ServiceStatus.RUNNING,
            message="OK"
        )
        assert status.is_healthy is True

    def test_unhealthy_status(self):
        status = HealthStatus(
            status=ServiceStatus.ERROR,
            message="Error occurred"
        )
        assert status.is_healthy is False

    def test_to_dict(self):
        status = HealthStatus(
            status=ServiceStatus.RUNNING,
            message="OK",
            details={'key': 'value'}
        )
        data = status.to_dict()
        assert data['status'] == 'running'
        assert data['is_healthy'] is True
        assert data['details']['key'] == 'value'

class TestCompositeHealthCheck:
    def test_register_and_check(self):
        checker = CompositeHealthCheck()

        class MockService:
            def health_check(self):
                return HealthStatus(status=ServiceStatus.RUNNING)

        checker.register('mock', MockService())
        result = checker.check('mock')
        assert result.status == ServiceStatus.RUNNING

    def test_check_all(self):
        checker = CompositeHealthCheck()
        results = checker.check_all()
        assert isinstance(results, dict)
```

---

## 代码规范

### 实现健康检查协议

```python
from FQBase.Foundation.lifecycle import (
    HealthCheckable,
    ServiceStatus,
    HealthStatus
)

class MyService(HealthCheckable):
    def __init__(self):
        self._status = ServiceStatus.RUNNING
        self._connections = 0

    def health_check(self) -> HealthStatus:
        """实现健康检查"""
        if self._status == ServiceStatus.ERROR:
            return HealthStatus(
                status=ServiceStatus.ERROR,
                message="Service in error state",
                details={'connections': self._connections}
            )

        return HealthStatus(
            status=ServiceStatus.RUNNING,
            message="OK",
            details={'connections': self._connections}
        )
```

### 服务状态定义

```python
from FQBase.Foundation.lifecycle import ServiceStatus

# 状态转换
status = ServiceStatus.INITIALIZING  # 初始化中
status = ServiceStatus.RUNNING        # 运行中
status = ServiceStatus.DEGRADED       # 降级运行
status = ServiceStatus.STOPPING       # 停止中
status = ServiceStatus.STOPPED        # 已停止
status = ServiceStatus.ERROR          # 错误状态
status = ServiceStatus.UNKNOWN         # 未知状态
```

---

## 调试技巧

### 打印健康状态

```python
from FQBase.Foundation.lifecycle import ServiceStatus, HealthStatus

status = HealthStatus(
    status=ServiceStatus.RUNNING,
    details={'cpu': 50, 'memory': 70}
)

# 转换为字典
import json
print(json.dumps(status.to_dict(), indent=2))
```

### 监控服务健康

```python
from FQBase.Foundation.lifecycle import CompositeHealthCheck

checker = CompositeHealthCheck()

# 注册多个服务
checker.register('api', APIService())
checker.register('cache', CacheService())
checker.register('db', DatabaseService())

# 定期检查
def monitor_services():
    results = checker.check_all()
    unhealthy = [
        name for name, status in results.items()
        if not status.is_healthy
    ]
    if unhealthy:
        print(f"Unhealthy services: {unhealthy}")
    return len(unhealthy) == 0
```

---

## 常见问题

### Q: 如何实现自定义健康检查？

```python
from FQBase.Foundation.lifecycle import HealthCheckable, HealthStatus, ServiceStatus

class DatabaseService(HealthCheckable):
    def health_check(self) -> HealthStatus:
        try:
            # 检查数据库连接
            self._conn.ping()
            return HealthStatus(
                status=ServiceStatus.RUNNING,
                message="Database connection OK"
            )
        except Exception as e:
            return HealthStatus(
                status=ServiceStatus.ERROR,
                message=f"Database error: {e}"
            )
```

### Q: 如何组合多个健康检查？

```python
from FQBase.Foundation.lifecycle import CompositeHealthCheck

checker = CompositeHealthCheck()

# 注册服务
checker.register('cache', CacheHealthCheck())
checker.register('database', DatabaseHealthCheck())
checker.register('queue', QueueHealthCheck())

# 检查所有
results = checker.check_all()

# 检查是否全部健康
if checker.is_all_healthy:
    print("All services healthy")
else:
    for name, status in results.items():
        if not status.is_healthy:
            print(f"{name}: {status.message}")
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)
- [FAQ](faq.md)