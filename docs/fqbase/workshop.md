---
title: FQBase - 动手实验室
description: FQBase 动手练习指南
tag:
  - fqbase
---

# FQBase - 动手实验室

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → **[动手实验室](./workshop.md)** → [使用指南](./usage.md) → [案例库](./examples.md) |

## 概述

通过动手练习掌握 FQBase 的核心功能。

## 准备环境

```bash
pip install fquant-fqbase
```

## Lab 1: 事件总线

### 目标

掌握事件总线的发布-订阅模式

### 练习代码

```python
from FQBase.Core import get_event_bus, Event

event_bus = get_event_bus()

# 1. 订阅事件
def on_message(event):
    print(f"收到消息: {event.data}")

event_bus.subscribe('message', on_message)

# 2. 发布事件
event_bus.publish(Event('message', {'text': 'Hello FQBase'}))

# 3. 验证输出
# 应该看到: 收到消息: {'text': 'Hello FQBase'}
```

### 任务

1. [ ] 创建事件订阅
2. [ ] 发布一个事件
3. [ ] 取消订阅

---

## Lab 2: 日志系统

### 目标

掌握日志记录器的使用

### 练习代码

```python
from FQBase.Core import get_logger, init_logging

# 1. 初始化日志系统
init_logging(level='DEBUG')

# 2. 获取记录器
logger = get_logger('my_app')

# 3. 记录不同级别的日志
logger.debug('调试信息')
logger.info('一般信息')
logger.warning('警告信息')
logger.error('错误信息')
```

### 任务

1. [ ] 初始化日志系统
2. [ ] 创建模块记录器
3. [ ] 记录不同级别的日志

---

## Lab 3: 数据验证

### 目标

掌握数据验证函数的使用

### 练习代码

```python
from FQBase.Foundation import validate_code, validate_date

# 1. 验证股票代码
try:
    validate_code('000001')
    print('股票代码验证通过')
except Exception as e:
    print(f'验证失败: {e}')

# 2. 验证日期
try:
    validate_date('2024-01-01')
    print('日期验证通过')
except Exception as e:
    print(f'验证失败: {e}')
```

### 任务

1. [ ] 验证有效的股票代码
2. [ ] 验证无效的股票代码
3. [ ] 验证日期格式

---

## Lab 4: 重试机制

### 目标

掌握重试装饰器的使用

### 练习代码

```python
from FQBase.Foundation import retry
import random

call_count = 0

@retry(max_attempts=3, delay=0.5)
def unreliable_function():
    global call_count
    call_count += 1
    if call_count < 3:
        raise ConnectionError("连接失败")
    return "成功!"

# 执行
result = unreliable_function()
print(f"结果: {result}")
print(f"调用次数: {call_count}")
```

### 任务

1. [ ] 使用重试装饰器
2. [ ] 调整重试次数
3. [ ] 添加异常类型过滤

---

## 实验室总结

完成所有实验后，你应该掌握：

- [x] 事件总线的发布-订阅模式
- [x] 日志系统的基本使用
- [x] 数据验证函数的使用
- [x] 重试装饰器的配置

## 下一步

- 学习 [最佳实践](./best-practices.md)
- 查看 [案例库](./examples.md)
- 阅读 [API参考](./api.md)

## 相关文档

- [README](./README.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
