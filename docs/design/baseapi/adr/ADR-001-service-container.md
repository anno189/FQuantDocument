# ADR-001: 依赖注入容器 (ServiceContainer)

## 状态
**Accepted** | 2024-04-22

## 背景
FQBase 框架需要为应用程序组件提供松耦合的依赖管理能力。在没有 DI 容器的情况下，组件之间直接引用会导致：
- 硬编码依赖，难以替换实现
- 单例滥用导致测试困难
- 循环依赖难以检测

## 决策
实现轻量级 `ServiceContainer` 类，支持：
- **三种生命周期**：SINGLETON（单例）、TRANSIENT（瞬态）、SCOPED（作用域）
- **循环依赖检测**：在解析依赖时检测并抛出 `CircularDependencyException`
- **线程安全**：所有操作使用 `threading.Lock` 保护
- **链式调用**：所有注册方法返回 self

## 实施方案

```python
class ServiceContainer:
    def register_singleton(self, service_type, implementation):
        """注册单例服务"""
        ...

    def register_transient(self, service_type, implementation):
        """注册瞬态服务（每次创建新实例）"""
        ...

    def get(self, service_type):
        """获取服务实例"""
        ...
```

## 后果

### 正面
- 组件解耦，支持依赖替换
- 单例模式便于资源管理
- 循环依赖早期检测

### 负面
- 增加了框架复杂度
- 依赖注入降低了代码可读性（需追踪容器配置）

## 相关决策
- ADR-002: 服务定位器模式 (ServiceLocator)

## 维护记录
| 日期 | 变更 |
|------|------|
| 2024-04-22 | 初始版本 |
