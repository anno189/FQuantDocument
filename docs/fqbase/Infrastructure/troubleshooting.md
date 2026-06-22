---
title: Infrastructure - 故障排查
description: Infrastructure 常见问题和解决方案
tag:
  - fquant
  - fqbase
  - infrastructure

summary:
  purpose: troubleshooting
---

# Infrastructure - 故障排查

## 阅读路径

🟡🔵 **运维+开发者**：README → troubleshooting → best-practices

## 常见问题

### Q1: 单例没有生效，对象不是同一个

**可能原因：**
- 在多进程环境下运行
- pickle 反序列化创建了新实例

**解决方案：**
- 多进程环境下使用进程管理器
- 重写 `__reduce__` 方法

### Q2: 重试次数耗尽但没有达到预期

**可能原因：**
- 没有指定正确的异常类型
- 异常被 catch 后没有重新抛出

**解决方案：**
```python
@retry(retry_on_exception=(ConnectionError,))
def call_api():
    try:
        return requests.get(url)
    except ConnectionError:
        raise
```

### Q3: 熔断器一直处于 OPEN 状态

**可能原因：**
- failure_threshold 设置过低
- 恢复超时时间过长

**解决方案：**
```python
@circuit_breaker(failure_threshold=10, recovery_timeout=30)
def call_api():
    pass
```

### Q4: 日志没有输出

**可能原因：**
- 没有初始化日志系统
- 日志级别设置过高

**解决方案：**
```python
from FQBase.Infrastructure import init_logging
init_logging()
```

## 相关文档

- [最佳实践](./best-practices.md)
- [使用指南](./usage.md)
