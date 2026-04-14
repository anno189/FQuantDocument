---
title: 服务容器 - 决策指南
description: 服务容器技术选型决策指南
tag:
  - fqbase
  - container
---

# 服务容器 - 决策指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟠 架构师 | [README](./README.md) → [技术架构](./architecture.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) → **[决策指南](./decision-guide.md)** → [案例研究](./case-studies.md) → [数据流](./data-flow.md) |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → **[决策指南](./decision-guide.md)** → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

本指南帮助架构师决定何时使用服务容器以及如何选择最佳配置。

## 决策树

```
需要使用服务容器吗？
    │
    ├── 项目是否需要解耦组件？
    │       │
    │       ├── 是 ──▶ 继续
    │       │
    │       └── 否 ──▶ 不需要服务容器，直接 import
    │
    ├── 是否有多个相似实现需要切换？
    │       │
    │       ├── 是 ──▶ 继续
    │       │
    │       └── 否 ──▶ 考虑简单工厂模式
    │
    └── 是否需要全局访问点？
            │
            ├── 是 ──▶ 使用 ServiceLocator
            │
            └── 否 ──▶ 使用依赖注入
```

## 场景 1: 选择生命周期

### 问题

应该为服务选择哪种生命周期？

### 选项

| 选项 | 优点 | 缺点 |
|------|------|------|
| SINGLETON | 性能高，资源少 | 状态共享，测试难 |
| TRANSIENT | 隔离性好，测试简单 | 性能开销大 |
| SCOPED | 平衡方案 | 实现复杂 |

### 决策

| 服务类型 | 推荐生命周期 |
|---------|-------------|
| 数据库连接 | SINGLETON |
| 缓存 | SINGLETON |
| 配置 | SINGLETON |
| 日志 | SINGLETON |
| 业务处理器 | TRANSIENT |
| 视图/控制器 | TRANSIENT |
| 请求上下文 | SCOPED |

---

## 场景 2: 依赖注入 vs 服务定位器

### 问题

应该使用依赖注入还是服务定位器？

### 选项

| 选项 | 优点 | 缺点 |
|------|------|------|
| 依赖注入 | 解耦、测试友好 | 需要修改构造函数 |
| 服务定位器 | 使用简单 | 隐式依赖 |

### 决策

**推荐：优先使用依赖注入**

```python
# ✅ 推荐：依赖注入
class UserService:
    def __init__(self, db: DatabaseInterface):
        self.db = db

# ⚠️ 谨慎：服务定位器
class UserService:
    def __init__(self):
        self.db = ServiceLocator.get(DatabaseInterface)
```

**使用 ServiceLocator 的场景：**
- 框架集成（Flask、Django）
- 遗留代码
- 快速原型

---

## 场景 3: 注册方式选择

### 问题

应该使用哪种服务注册方式？

### 选项

| 选项 | 适用场景 |
|------|---------|
| register_singleton | 数据库连接、缓存、配置 |
| register_transient | 业务处理器、临时对象 |
| register_factory | 复杂创建逻辑、条件创建 |
| register_instance | 已有实例、外部创建的对象 |

### 决策

```python
# 静态实现 → 类型
container.register_singleton(CacheInterface, RedisCache)

# 动态创建 → 工厂
container.register_factory(
    DatabaseInterface,
    lambda: create_database(config)
)

# 已有实例 → 实例
container.register_instance(DatabaseInterface, existing_db)
```

---

## 场景 4: 依赖声明方式

### 问题

如何声明服务依赖？

### 选项

| 选项 | 优点 | 缺点 |
|------|------|------|
| 显式声明 | 明确、性能好 | 繁琐 |
| 自动注入 | 简单 | 不明确、可能有意外 |

### 决策

**推荐：优先显式声明**

```python
# ✅ 推荐：显式声明
container.register_singleton(
    UserService,
    UserService,
    dependencies=[DatabaseInterface, CacheInterface]
)

# ⚠️ 谨慎：自动注入
class UserService:
    def __init__(self, db: Database, cache: Cache):
        # 容器尝试自动注入
        pass
```

---

## 反模式警示

### 错误示例

**反模式 1：循环依赖**

```python
# ❌ 错误：循环依赖
class A:
    def __init__(self, b: 'B'): pass

class B:
    def __init__(self, a: 'A'): pass
```

**反模式 2：服务定位器滥用**

```python
# ❌ 错误：处处使用服务定位器
class ManyMethodsService:
    def method1(self):
        self.a = ServiceLocator.get(ServiceA)
    
    def method2(self):
        self.b = ServiceLocator.get(ServiceB)
```

**反模式 3：单例中存储状态**

```python
# ❌ 错误：单例中存储请求状态
class UserService:
    def set_user(self, user):
        self.current_user = user  # 跨请求泄露！
```

### 正确做法

```python
# ✅ 正确：使用作用域或瞬态
container.register_transient(UserContext, UserContext)
```

---

## 决策检查清单

在决定使用服务容器前，请检查：

- [ ] 是否有多个实现需要切换？
- [ ] 是否需要解耦组件？
- [ ] 是否需要提高可测试性？
- [ ] 是否有复杂的依赖关系需要管理？
- [ ] 团队是否理解依赖注入？

如果以上大部分是"是"，服务容器是一个好选择。

---

## 相关文档

- [技术架构](./architecture.md)
- [设计模式](./patterns.md)
- [技术权衡](./tradeoff.md)
- [案例研究](./case-studies.md)
- [数据流](./data-flow.md)
