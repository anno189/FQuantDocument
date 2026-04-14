---
title: FQBase - 常见问题
description: FQBase 常见问题与解答
tag:
  - fqbase
---

# FQBase - 常见问题

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → **[常见问题](./faq.md)** |

## 子模块常见问题

| 子模块 | 常见问题 | 说明 |
|--------|----------|------|
| Core | [常见问题](./core/faq.md) | 事件总线、日志、通知 |
| Foundation | [常见问题](./foundation/faq.md) | 验证、异常、重试、单例 |
| Config | [常见问题](./config/faq.md) | 配置管理 |
| Cache | [常见问题](./cache/faq.md) | 缓存抽象 |


## 一般问题

### Q: FQBase 是什么？

**A:** FQBase 是 FQuant 系统的基础框架包，提供事件总线、日志系统、通知服务、数据验证、重试机制、缓存抽象等核心基础设施能力。

### Q: FQBase 与其他模块的关系是什么？

**A:** FQBase 是 FQuant 的基础设施层，被 FQData、FQFactor 等业务模块依赖。

### Q: 如何安装 FQBase？

**A:** 
```bash
pip install fquant-fqbase
```
或安装完整套件：
```bash
pip install fquant
```

## 使用问题

### Q: 如何获取 EventBus 单例？

**A:** 使用 `get_event_bus()` 函数：
```python
from FQBase.Core import get_event_bus
event_bus = get_event_bus()
```

### Q: 如何发送企业微信通知？

**A:**
```python
from FQBase.Core import NotificationManager
notifier = NotificationManager()
notifier.send('消息内容', channel='WECOM')
```

### Q: 如何验证股票代码？

**A:**
```python
from FQBase.Foundation import validate_code
validate_code('000001')  # 验证6位股票代码
```

### Q: 如何使用重试装饰器？

**A:**
```python
from FQBase.Foundation import retry

@retry(max_attempts=3, delay=1)
def unreliable_operation():
    pass
```

## 配置问题

### Q: 如何使用环境变量？

**A:**
```python
from FQBase.Config import load_env, get_env
load_env('.env')
value = get_env('KEY')
```

### Q: 如何配置日志级别？

**A:**
```python
from FQBase.Core import init_logging
init_logging(level='DEBUG')
```

## 故障排查

### Q: 事件订阅不生效？

**A:** 确保订阅在发布之前完成：
```python
event_bus.subscribe('topic', handler)  # 先订阅
event_bus.publish(Event('topic', data))  # 后发布
```

### Q: 通知发送失败？

**A:** 检查渠道配置和 API 密钥是否正确。

### Q: 验证失败？

**A:** 检查输入格式是否正确，如股票代码应为6位数字。

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
