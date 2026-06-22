# ADR-002: 单例模式实现

## 状态
**Accepted** | 2024-04-22

## 背景
在 FQBase 框架中，多个组件需要全局唯一实例（如 EventBus、Logger、Configuration）。需要确保：
- 线程安全
- 可测试性（支持重置单例）
- pickle 反序列化不破坏单例

## 决策
使用**元类 (Metaclass)** 实现单例模式，而非装饰器或模块级 global 变量。

## 实施方案

```python
class SingletonMeta(type):
    def __new__(mcs, name, bases, namespace, **kwargs):
        cls = super().__new__(mcs, name, bases, namespace, **kwargs)
        cls._singleton_lock = threading.Lock()
        cls._singleton_instance = None
        return cls

    def __call__(cls, *args, **kwargs):
        if cls._singleton_instance is None:
            with cls._singleton_lock:
                if cls._singleton_instance is None:
                    cls._singleton_instance = super().__call__(*args, **kwargs)
        return cls._singleton_instance

    def reset_singleton(cls) -> None:
        """重置单例实例（用于测试隔离）"""
        with cls._singleton_lock:
            cls._singleton_instance = None
```

## 关键设计

### 双重检查锁定 (DCLP)
```python
if cls._singleton_instance is None:          # 检查1
    with cls._singleton_lock:
        if cls._singleton_instance is None:  # 检查2
            cls._singleton_instance = ...
```
避免每次获取实例都需要加锁的性能损失。

### 测试隔离支持
```python
MyClass.reset_singleton()  # 测试前重置
obj = MyClass()            # 创建新实例
```

## 后果

### 正面
- 线程安全，无竞争条件
- 按类重置，支持测试隔离
- 实例延迟创建，节省资源

### 负面
- 元类增加了代码复杂度
- pickle 反序列化可能创建新实例（需重写 `__reduce__`）

## 相关决策
- ADR-001: 依赖注入容器 (ServiceContainer)

## 维护记录
| 日期 | 变更 |
|------|------|
| 2024-04-22 | 初始版本 |
