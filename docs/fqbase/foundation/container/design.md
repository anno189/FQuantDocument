# Container 模块设计决策

## 目录

1. [设计目标](#1-设计目标)
2. [生命周期决策](#2-生命周期决策)
3. [循环依赖检测](#3-循环依赖检测)
4. [线程安全决策](#4-线程安全决策)
5. [API 设计决策](#5-api-设计决策)

---

## 1. 设计目标

### 1.1 核心目标

Container 模块旨在提供：

- **轻量级**：无外部依赖，仅使用标准库
- **线程安全**：所有操作原子性
- **可测试**：便于模拟和替换
- **简单易用**：最小化学习成本

### 1.2 非目标

- 不提供属性注入（仅构造函数注入）
- 不提供自动扫描（仅显式注册）
- 不提供作用域管理（仅有 SCOPED 占位）

---

## 2. 生命周期决策

### 2.1 三种生命周期

**决策**：支持 SINGLETON、TRANSIENT、SCOPED 三种生命周期

| 生命周期 | 实现方式 | 适用场景 |
|----------|----------|----------|
| `SINGLETON` | 缓存实例 | 无状态服务、全局配置 |
| `TRANSIENT` | 每次创建 | 有状态对象 |
| `SCOPED` | 占位 | Web 请求作用域 |

### 2.2 单例缓存策略

**决策**：使用双重检查锁定实现单例

```python
if self.lifetime == ServiceLifetime.SINGLETON:
    if self._instance is None:
        with self._lock:
            if self._instance is None:
                self._instance = self._create_instance(container)
    return self._instance
```

**原因**：
- 避免每次获取都加锁的性能开销
- 保证线程安全
- 延迟初始化

---

## 3. 循环依赖检测

### 3.1 检测机制

**决策**：在运行时检测循环依赖

```python
def get(self, service_type: Type[T]) -> T:
    if service_type in self._resolving:
        raise CircularDependencyException(...)

    self._resolving.add(service_type)
    try:
        # 解析依赖
        return self._resolve_instance(descriptor)
    finally:
        self._resolving.discard(service_type)
```

### 3.2 检测时机

**决策**：在解析服务时检测，而非注册时

**原因**：
- 注册时不执行代码，无法确定依赖关系
- 实际调用时才确定依赖图
- 支持动态依赖场景

### 3.3 追踪路径

**决策**：记录 `_build_order` 用于错误信息

```python
self._build_order.append(service_type.__name__)
# 异常时: "A -> B -> C -> A"
```

---

## 4. 线程安全决策

### 4.1 容器级别锁

**决策**：注册操作使用容器锁

```python
def register_singleton(...):
    with self._lock:
        self._services[service_type] = descriptor
    return self
```

### 4.2 描述符级别锁

**决策**：单例实例创建使用描述符锁

```python
def get_instance(self, container):
    if self.lifetime == ServiceLifetime.SINGLETON:
        if self._instance is None:
            with self._lock:
                if self._instance is None:
                    self._instance = self._create_instance(container)
        return self._instance
```

### 4.3 读写分离

**决策**：注册和解析使用同一把锁

**替代方案考虑**：

| 方案 | 优点 | 缺点 |
|------|------|------|
| 读写锁分离 | 读多写少时性能高 | 实现复杂 |
| 单一锁 | 简单、不死锁 | 读操作也要排队 |
| 无锁 | 最高性能 | 实现非常复杂 |

**选择原因**：
- 简化实现，避免死锁
- 容器操作不频繁，性能可接受

---

## 5. API 设计决策

### 5.1 链式调用

**决策**：注册方法返回 `self`

```python
container.register_singleton(ICache, RedisCache) \
         .register_singleton(ILogger, FileLogger) \
         .register_transient(IRequest, HttpRequest)
```

**原因**：
- 便于组织注册代码
- 常见于 Builder 模式

### 5.2 泛型支持

**决策**：使用 `TypeVar` 保留类型信息

```python
T = TypeVar('T')

def get(self, service_type: Type[T]) -> T:
    ...
```

**原因**：
- IDE 自动补全支持
- 类型检查支持

### 5.3 服务定位器

**决策**：提供 `ServiceLocator` 作为全局访问点

```python
ServiceLocator.set_container(container)
cache = ServiceLocator.get(ICache)
```

**原因**：
- 便于访问服务（无需处处传递容器）
- 应用启动时一次性设置

### 5.4 try_get 模式

**决策**：提供 `try_get` 返回 None 而非抛出异常

```python
def try_get(self, service_type: Type[T]) -> Optional[T]:
    try:
        return self.get(service_type)
    except (KeyError, CircularDependencyException):
        return None
```

**原因**：
- 简化非关键服务的获取
- 避免大量异常处理

---

## 6. 未来演进方向

### 6.1 可能的变化

| 变化 | 触发条件 |
|------|----------|
| 属性注入 | 需要支持更灵活的注入方式 |
| 自动扫描 | 需要减少显式注册 |
| 作用域实现 | Web 框架集成需求 |

### 6.2 不纳入的设计

- **构造函数参数注入**：增加复杂度
- **装饰器注入**：增加魔法行为
- **分布式容器**：超出单进程范围
