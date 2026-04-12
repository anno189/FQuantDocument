# Foundation 模块

通用抽象层，提供基础设计模式、工具和抽象，不包含业务逻辑。

## 模块结构

```
FQBase/Foundation/
├── __init__.py              # 模块导出
├── validators.py             # 输入验证器
├── exceptions.py             # 统一异常定义
├── retry.py                   # 重试装饰器
├── dotty.py                  # 嵌套字典点号访问
├── crypto.py                  # 随机数生成
├── singleton.py               # 单例模式
├── lifecycle.py               # 生命周期管理
├── container.py               # 依赖注入容器
└── circuit_breaker.py        # 熔断器
```

## 核心功能

| 子模块 | 功能 |
|--------|------|
| [validators](validators/) | 输入验证：股票代码、日期、市场、频率等 |
| [exceptions](exceptions.md) | 统一异常体系：DataSource、Strategy、Config等 |
| [retry](retry/) | 重试装饰器：固定延迟、指数退避、异步支持 |
| [dotty](dotty/) | 嵌套字典点号访问：简化深层字典操作 |
| [crypto](crypto.md) | 随机数生成：股票代码、标识符 |
| [singleton](singleton/) | 单例模式：线程安全、支持重置 |
| [lifecycle](lifecycle/) | 生命周期：健康检查、初始化、关闭 |
| [container](container/) | 依赖注入：容器、服务定位器 |
| [circuit_breaker](circuit_breaker/) | 熔断器：故障隔离、状态机 |

## 快速开始

### 验证输入

```python
from FQBase.Foundation import validate_code, validate_date, validate_market

result = validate_code("600000")
print(result)  # True

result = validate_date("2026-04-03")
print(result)  # True

result = validate_market("SH")
print(result)  # True
```

### 使用重试装饰器

```python
from FQBase.Foundation import retry, retry_with_exponential_backoff

@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def fetch_data():
    return api.get()

@retry_with_exponential_backoff(max_attempts=5, base_wait=100, max_wait=5000)
def fetch_with_backoff():
    return api.get()
```

### 单例模式

```python
from FQBase.Foundation import singleton

@singleton
class MyService:
    pass

obj1 = MyService()
obj2 = MyService()
assert obj1 is obj2  # True
```

### 熔断器

```python
from FQBase.Foundation import circuit_breaker

@circuit_breaker(name="user_api", failure_threshold=5, recovery_timeout=60)
def call_api():
    return remote_service.get()
```

## 设计原则

1. **Foundation 层不依赖 Core 层**
2. **提供通用的、可复用的抽象**
3. **不包含业务逻辑**

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.md) | 本文档，模块索引 |
| [框架](framework.md) | 模块架构与核心概念 |
| [架构](architecture.md) | 设计与工作流程 |
| [API](api.md) | 完整API参考 |
| [使用](usage.md) | 使用指南与示例 |
| [开发指南](development.md) | 开发环境、调试、测试 |
| [最佳实践](best-practices.md) | 开发建议与注意事项 |
| [设计](design.md) | 设计决策文档 |

## 子模块文档

### circuit_breaker 熔断器

| 文档 | 说明 |
|------|------|
| [circuit_breaker/README.md](circuit_breaker/README.md) | 模块首页 |
| [circuit_breaker/framework.md](circuit_breaker/framework.md) | 框架概述 |
| [circuit_breaker/architecture.md](circuit_breaker/architecture.md) | 架构设计 |
| [circuit_breaker/api.md](circuit_breaker/api.md) | API 参考 |
| [circuit_breaker/usage.md](circuit_breaker/usage.md) | 使用指南 |
| [circuit_breaker/best-practices.md](circuit_breaker/best-practices.md) | 最佳实践 |
| [circuit_breaker/faq.md](circuit_breaker/faq.md) | 常见问题 |

### retry 重试

| 文档 | 说明 |
|------|------|
| [retry/README.md](retry/README.md) | 模块首页 |
| [retry/framework.md](retry/framework.md) | 框架概述 |
| [retry/architecture.md](retry/architecture.md) | 架构设计 |
| [retry/api.md](retry/api.md) | API 参考 |
| [retry/usage.md](retry/usage.md) | 使用指南 |
| [retry/best-practices.md](retry/best-practices.md) | 最佳实践 |
| [retry/faq.md](retry/faq.md) | 常见问题 |

### container 依赖注入

| 文档 | 说明 |
|------|------|
| [container/README.md](container/README.md) | 模块首页 |
| [container/framework.md](container/framework.md) | 框架概述 |
| [container/architecture.md](container/architecture.md) | 架构设计 |
| [container/api.md](container/api.md) | API 参考 |
| [container/usage.md](container/usage.md) | 使用指南 |
| [container/best-practices.md](container/best-practices.md) | 最佳实践 |
| [container/faq.md](container/faq.md) | 常见问题 |

### validators 验证器

| 文档 | 说明 |
|------|------|
| [validators/README.md](validators/README.md) | 模块首页 |
| [validators/framework.md](validators/framework.md) | 框架概述 |
| [validators/architecture.md](validators/architecture.md) | 架构设计 |
| [validators/api.md](validators/api.md) | API 参考 |
| [validators/usage.md](validators/usage.md) | 使用指南 |
| [validators/best-practices.md](validators/best-practices.md) | 最佳实践 |
| [validators/faq.md](validators/faq.md) | 常见问题 |

### lifecycle 生命周期

| 文档 | 说明 |
|------|------|
| [lifecycle/README.md](lifecycle/README.md) | 模块首页 |
| [lifecycle/framework.md](lifecycle/framework.md) | 框架概述 |
| [lifecycle/architecture.md](lifecycle/architecture.md) | 架构设计 |
| [lifecycle/api.md](lifecycle/api.md) | API 参考 |
| [lifecycle/usage.md](lifecycle/usage.md) | 使用指南 |
| [lifecycle/best-practices.md](lifecycle/best-practices.md) | 最佳实践 |
| [lifecycle/faq.md](lifecycle/faq.md) | 常见问题 |

### dotty 嵌套字典

| 文档 | 说明 |
|------|------|
| [dotty/README.md](dotty/README.md) | 模块首页 |
| [dotty/framework.md](dotty/framework.md) | 框架概述 |
| [dotty/architecture.md](dotty/architecture.md) | 架构设计 |
| [dotty/api.md](dotty/api.md) | API 参考 |
| [dotty/usage.md](dotty/usage.md) | 使用指南 |
| [dotty/best-practices.md](dotty/best-practices.md) | 最佳实践 |
| [dotty/faq.md](dotty/faq.md) | 常见问题 |

### singleton 单例

| 文档 | 说明 |
|------|------|
| [singleton/README.md](singleton/README.md) | 模块首页 |
| [singleton/framework.md](singleton/framework.md) | 框架概述 |
| [singleton/architecture.md](singleton/architecture.md) | 架构设计 |
| [singleton/api.md](singleton/api.md) | API 参考 |
| [singleton/usage.md](singleton/usage.md) | 使用指南 |
| [singleton/best-practices.md](singleton/best-practices.md) | 最佳实践 |
| [singleton/faq.md](singleton/faq.md) | 常见问题 |
