---
title: 事件总线 - 变更日志
description: 事件总线版本历史与更新说明
tag:
  - fqbase
  - event_bus
---

# 事件总线 - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |


## v1.0.0 (当前版本)

### 新增

- 首次发布事件总线模块
- EventBus：单例模式的事件总线
- Event：标准事件对象
- EventHistory：事件历史记录管理器（环形缓冲区）
- Subscription：订阅者包装类（支持优先级）
- EventBusContext：上下文管理器

### 核心功能

- 同步/异步事件发布（publish / publish_async / publishAwait）
- 全局订阅（subscribe_global）接收所有事件
- 类型订阅（subscribe）仅接收指定类型事件
- 事件处理优先级（priority 数值越大越先执行）
- 弱引用订阅（weak_ref=True 防止内存泄漏）
- 自动清理失效订阅者（每 N 次发布后自动清理）
- 线程安全实现
- 事件历史记录（环形缓冲区，限制内存占用）

### 新增

- EventBusCelery：Celery Worker 生命周期集成
- 环境变量 FQ_EVENTBUS_WORKERS 配置线程池大小
- 环境变量 FQ_CELERY_AUTO_INIT 配置自动初始化

### 更改

- 优化订阅列表排序逻辑
- 改进弱引用回调解析性能

### 修复

- 修复多线程环境下订阅列表并发访问问题
- 修复事件历史环形缓冲区边界问题

### 安全

- 无安全相关更新

---

## 相关文档

- [README](./README.md)
