# FQBase 架构决策记录 (ADR)

本目录包含 FQBase 框架的关键架构决策记录。

## ADR 索引

| ID | 标题 | 状态 | 日期 |
|----|------|------|------|
| [ADR-001](ADR-001-service-container.md) | 依赖注入容器 (ServiceContainer) | Accepted | 2024-04-22 |
| [ADR-002](ADR-002-singleton-pattern.md) | 单例模式实现 | Accepted | 2024-04-22 |
| [ADR-003](ADR-003-event-bus.md) | 事件总线 (EventBus) 架构 | Accepted | 2024-04-22 |
| [ADR-004](ADR-004-circuit-breaker.md) | 熔断器模式 (Circuit Breaker) | Accepted | 2024-04-22 |
| [ADR-005](ADR-005-cache-adapter.md) | 缓存适配器架构 | Accepted | 2024-04-22 |
| [ADR-006](ADR-006-layered-architecture.md) | FQBase 分层架构 | Accepted | 2024-04-22 |

## ADR 模板

```markdown
# ADR-XXX: 标题

## 状态
**Status** | YYYY-MM-DD

## 背景
描述导致此决策的问题或上下文。

## 决策
描述最终选择的方案。

## 实施方案
代码示例或详细说明。

## 后果
### 正面
### 负面

## 相关决策
- ADR-XXX: ...

## 维护记录
| 日期 | 变更 |
|------|------|
| YYYY-MM-DD | 初始版本 |
```

## 使用指南

### 何时创建 ADR
- 引入新的架构模式
- 重大设计变更
- 采用新的技术方案
- 重要的技术选型决策

### ADR 状态
| 状态 | 含义 |
|------|------|
| Proposed | 建议中，待评审 |
| Accepted | 已接受，正在实施 |
| Deprecated | 已废弃 |
| Superseded | 被新 ADR 取代 |

## 维护原则

1. **完整性**：记录决策的完整上下文和理由
2. **可追溯**：通过"相关决策"链接其他 ADR
3. **时效性**：记录维护历史
4. **一致性**：遵循统一的模板格式
