# FQBase Core 模块文档

**模块路径**: `FQBase.Core`
**源码**: [FQBase/Core](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core)

---

## 文档索引

### Logger 日志系统

| 文档 | 说明 |
|------|------|
| [logger/README.md](logger/README.md) | 模块首页 |
| [logger/framework.md](logger/framework.md) | 框架概述 |
| [logger/architecture.md](logger/architecture.md) | 架构设计 |
| [logger/design.md](logger/design.md) | 设计决策 |
| [logger/api.md](logger/api.md) | API 参考 |
| [logger/usage.md](logger/usage.md) | 使用指南 |
| [logger/best-practices.md](logger/best-practices.md) | 最佳实践 |

### EventBus 事件总线

| 文档 | 说明 |
|------|------|
| [eventbus/README.md](eventbus/README.md) | 模块首页 |
| [eventbus/framework.md](eventbus/framework.md) | 框架概述 |
| [eventbus/architecture.md](eventbus/architecture.md) | 架构设计 |
| [eventbus/design.md](eventbus/design.md) | 设计决策 |
| [eventbus/api.md](eventbus/api.md) | API 参考 |
| [eventbus/usage.md](eventbus/usage.md) | 使用指南 |
| [eventbus/best-practices.md](eventbus/best-practices.md) | 最佳实践 |

### EventBus Celery 集成

| 文档 | 说明 |
|------|------|
| [eventbus/celery/README.md](eventbus/celery/README.md) | 子模块首页 |
| [eventbus/celery/api.md](eventbus/celery/api.md) | API 参考 |
| [eventbus/celery/usage.md](eventbus/celery/usage.md) | 使用指南 |
| [eventbus/celery/best-practices.md](eventbus/celery/best-practices.md) | 最佳实践 |

### Notification 通知服务

| 文档 | 说明 |
|------|------|
| [notification/README.md](notification/README.md) | 模块首页 |
| [notification/framework.md](notification/framework.md) | 框架概述 |
| [notification/architecture.md](notification/architecture.md) | 架构设计 |
| [notification/design.md](notification/design.md) | 设计决策 |
| [notification/api.md](notification/api.md) | API 参考 |
| [notification/usage.md](notification/usage.md) | 使用指南 |
| [notification/best-practices.md](notification/best-practices.md) | 最佳实践 |

### NotificationTemplate 通知模板

| 文档 | 说明 |
|------|------|
| [notification_template/README.md](notification_template/README.md) | 模块首页 |
| [notification_template/framework.md](notification_template/framework.md) | 框架概述 |
| [notification_template/architecture.md](notification_template/architecture.md) | 架构设计 |
| [notification_template/design.md](notification_template/design.md) | 设计决策 |
| [notification_template/api.md](notification_template/api.md) | API 参考 |
| [notification_template/usage.md](notification_template/usage.md) | 使用指南 |
| [notification_template/best-practices.md](notification_template/best-practices.md) | 最佳实践 |

---

## 模块结构

```
FQBase.Core
├── __init__.py                  # 统一导出
├── logger.py                    # 日志系统
│   ├── FQLogger                # 日志记录器类
│   ├── get_logger()            # 获取 Logger 实例
│   └── init_logging()          # 初始化日志系统
│
├── event_bus.py                # 事件总线
├── event_bus_celery.py         # Celery 事件总线
├── notification.py              # 通知服务
└── notification_template.py    # 通知模板
```

---

## 快速导航

### 新手入门
1. 阅读 [logger/framework.md](logger/framework.md) 了解日志模块概述
2. 阅读 [logger/usage.md](logger/usage.md) 学习基本用法
3. 阅读 [eventbus/usage.md](eventbus/usage.md) 掌握事件总线用法

### 深入了解
1. 阅读 [logger/architecture.md](logger/architecture.md) 理解日志架构设计
2. 阅读 [eventbus/architecture.md](eventbus/architecture.md) 理解事件总线架构
3. 阅读各模块的 API 文档掌握详细 API

### 扩展学习
- [notification/usage.md](notification/usage.md) - 通知服务使用
- [notification_template/usage.md](notification_template/usage.md) - 通知模板使用
- [eventbus/celery/usage.md](eventbus/celery/usage.md) - Celery 集成使用

---

## 相关链接

- [FQBase 主文档](../README.md)
- [Config 模块](../config/README.md)
- [Cache 模块](../cache/README.md)
- [DataStore 模块](../datastore/README.md)
