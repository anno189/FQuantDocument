# Lifecycle 模块设计决策

## 目录

1. [设计目标](#1-设计目标)
2. [协议设计](#2-协议设计)
3. [状态设计](#3-状态设计)
4. [组合检查设计](#4-组合检查设计)

---

## 1. 设计目标

### 1.1 核心目标

Lifecycle 模块旨在提供：

- **标准化**：统一的服务生命周期管理接口
- **简单性**：最小化学习成本
- **灵活性**：不强制具体实现

### 1.2 非目标

- 不提供具体的服务实现
- 不提供自动初始化和关闭
- 不提供状态持久化

---

## 2. 协议设计

### 2.1 运行时检查

**决策**：使用 `@runtime_checkable` 支持运行时类型检查

```python
@runtime_checkable
class HealthCheckable(Protocol):
    def health_check(self) -> HealthStatus:
        ...
```

**原因**：
- 便于检查对象是否实现了协议
- 支持鸭子类型

### 2.2 协议 vs 抽象类

**决策**：使用协议而非抽象类

| 方案 | 优点 | 缺点 |
|------|------|------|
| 协议 | 灵活、鸭子类型 | 需要运行时检查 |
| 抽象类 | 强制实现 | 单一继承限制 |

**原因**：
- Python 不支持多继承
- 协议支持实现多个接口
- 更灵活

---

## 3. 状态设计

### 3.1 状态枚举

**决策**：提供完整的状态枚举

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

**原因**：
- 覆盖服务完整生命周期
- 便于监控和日志

### 3.2 is_healthy 定义

**决策**：RUNNING 和 INITIALIZING 视为健康

```python
@property
def is_healthy(self) -> bool:
    return self.status in (ServiceStatus.RUNNING, ServiceStatus.INITIALIZING)
```

**原因**：
- INITIALIZING 表示服务正在启动，应该被视为暂时健康
- 其他状态明确表示问题

---

## 4. 组合检查设计

### 4.1 异常处理

**决策**：健康检查抛出异常时返回 ERROR 状态

```python
def check(self, name: str) -> Optional[HealthStatus]:
    service = self._services.get(name)
    if service is None:
        return None
    try:
        return service.health_check()
    except Exception as e:
        return HealthStatus(
            status=ServiceStatus.ERROR,
            message=str(e)
        )
```

**原因**：
- 防止单个服务异常导致整个检查崩溃
- 便于识别检查失败

### 4.2 服务不存在

**决策**：服务不存在时 check() 返回 None

```python
def check(self, name: str) -> Optional[HealthStatus]:
    service = self._services.get(name)
    if service is None:
        return None
```

**原因**：
- 区分"服务未注册"和"服务健康检查失败"
- is_all_healthy 会忽略 None

---

## 5. 未来演进方向

### 5.1 可能的变化

| 变化 | 触发条件 |
|------|----------|
| 异步健康检查 | 长时间健康检查需要异步 |
| 健康检查超时 | 需要超时控制 |
| 依赖关系 | 服务健康检查依赖其他服务 |

### 5.2 不纳入的设计

- **自动初始化**：增加复杂度
- **状态持久化**：超出模块范围
- **级联检查**：增加复杂性
