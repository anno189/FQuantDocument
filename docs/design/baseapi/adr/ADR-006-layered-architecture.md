# ADR-006: FQBase 分层架构

## 状态
**Accepted** | 2024-04-22

## 背景
FQBase 需要为 FQuant 项目提供统一的基础设施组件。需要清晰的架构分层，确保：
- 各层职责明确
- 依赖方向单一（上层依赖下层）
- 便于测试和维护

## 决策
采用**四层 + 工具层**架构：

```
┌─────────────────────────────────────────────────────┐
│                   Business Layer                     │
│            (应用特定的业务逻辑)                        │
└─────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────┐
│                  Foundation Layer                    │
│     (EventBus, Notification, Lifecycle, Dotty)      │
└─────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────┐
│                Infrastructure Layer                  │
│    (Container, CircuitBreaker, Retry, Logger)       │
└─────────────────────────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────┐
│                    Util Layer                        │
│       (Crypto, Validators, Network, Parallel)        │
└─────────────────────────────────────────────────────┘
```

## 各层职责

### Infrastructure Layer（基础设施层）
**职责**：提供底层技术能力，不依赖其他 FQBase 模块。

| 模块 | 职责 |
|------|------|
| `singleton.py` | 单例元类 |
| `container.py` | 依赖注入容器 |
| `circuit_breaker.py` | 熔断器 |
| `retry.py` | 重试机制 |
| `logger.py` | 日志 |
| `exceptions.py` | 异常定义 |

### Foundation Layer（基础层）
**职责**：依赖 Infrastructure 层，提供核心业务抽象。

| 模块 | 职责 |
|------|------|
| `event_bus.py` | 事件总线 |
| `notification.py` | 通知管理 |
| `lifecycle.py` | 生命周期钩子 |
| `dotty.py` | 嵌套字典访问 |

### Cache Layer（缓存层）
**职责**：提供统一缓存抽象。

| 模块 | 职责 |
|------|------|
| `CacheAdapters.py` | 缓存适配器实现 |
| `_interface.py` | 缓存接口协议 |
| `local_cache.py` | 本地内存缓存 |
| `redis_adapter.py` | Redis 适配器 |

### DataStore Layer（数据存储层）
**职责**：MongoDB 数据访问封装。

| 模块 | 职责 |
|------|------|
| `_connection.py` | 连接管理 |
| `_collection.py` | Collection 封装 |
| `_index_manager.py` | 索引管理 |

### Config Layer（配置层）
**职责**：配置管理和环境变量。

### Crawler Layer（爬虫层）
**职责**：爬虫基础设施。

### Util Layer（工具层）
**职责**：通用工具函数，不依赖其他 FQBase 模块。

## 依赖规则

1. **单向依赖**：上层可依赖下层，下层不得依赖上层
2. **禁止循环依赖**：任何两层之间不得形成循环
3. **跨层访问**：通过接口抽象，禁止直接引用具体实现

## 导入规范

```python
# ✅ 正确：从子模块导入
from FQBase.Infrastructure import singleton
from FQBase.Foundation import EventBus

# ❌ 错误：避免包级别便捷导入
from FQBase import singleton  # 可能导致循环依赖
```

## 后果

### 正面
- 职责清晰，便于定位代码
- 依赖单向，便于理解影响范围
- 分层测试，各层可独立验证

### 负面
- 增加了模块数量
- 跨层调用需要更多间接层

## 维护记录
| 日期 | 变更 |
|------|------|
| 2024-04-22 | 初始版本 |
