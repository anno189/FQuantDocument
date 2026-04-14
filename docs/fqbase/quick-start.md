---
title: FQBase - 快速入门
description: 5分钟快速上手 FQBase 基础框架
tag:
  - fqbase

summary:
  purpose: quick-start
  complexity: low
---

# FQBase - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

5分钟快速上手 FQBase 基础框架，学习如何使用事件总线、日志系统、通知服务等核心基础设施。

## 前置要求

- Python 3.8+
- pip

## 安装

```bash
pip install fquant-fqbase
```

或者安装完整套件：

```bash
pip install fquant
```

## 5分钟上手

### Step 1: 导入核心模块

```python
from FQBase.Core import (
    get_event_bus,
    get_logger,
    NotificationManager,
    Event,
)

from FQBase.Foundation import (
    validate_code,
    retry,
    FQException,
)

from FQBase.Config import get_env
```

### Step 2: 使用事件总线

```python
# 获取事件总线单例
event_bus = get_event_bus()

# 订阅事件
def handle_update(event):
    print(f"收到事件: {event.topic}, 数据: {event.data}")

event_bus.subscribe('update', handle_update)

# 发布事件
event_bus.publish(Event('update', {'message': 'hello'}))
```

### Step 3: 使用日志系统

```python
# 获取日志记录器
logger = get_logger('my_module')

# 记录日志
logger.debug('调试信息')
logger.info('一般信息')
logger.warning('警告信息')
logger.error('错误信息')
```

### Step 4: 发送通知

```python
# 获取通知管理器
notifier = NotificationManager()

# 发送通知
notifier.send('任务完成', channel='SYSTEM')
notifier.send('交易信号: 买入', channel='WECOM')
```

### Step 5: 数据验证

```python
from FQBase.Foundation import validate_code, validate_date

# 验证股票代码
validate_code('000001')  # 通过
validate_code('invalid')  # 抛出 ValidationError

# 验证日期
validate_date('2024-01-01')  # 通过
```

### Step 6: 使用重试装饰器

```python
from FQBase.Foundation import retry

@retry(max_attempts=3, delay=1)
def fetch_data():
    # 可能失败的操作
    return external_api.get_data()

# 自动重试3次
result = fetch_data()
```

### Step 7: 配置管理

```python
from FQBase.Config import get_env, load_env

# 加载环境变量文件
load_env('.env')

# 获取配置
api_key = get_env('API_KEY')
debug = get_env('DEBUG', default=False)
```

### Step 8: 完成！

恭喜！你已经学会了 FQBase 的基本用法。

## ⚠️ 常见陷阱

1. **陷阱 1：重复初始化事件总线**
   - ❌ 错误做法：每次调用 `EventBus()` 创建新实例
   - ✅ 正确做法：使用 `get_event_bus()` 获取单例

2. **陷阱 2：NotificationManager 未初始化**
   - ❌ 错误做法：直接调用 `NotificationManager.send()`
   - ✅ 正确做法：先获取单例 `notifier = NotificationManager()`

3. **陷阱 3：重试未处理异常类型**
   - ❌ 错误做法：`@retry` 捕获所有异常
   - ✅ 正确做法：指定 `exceptions` 参数只重试特定异常

4. **陷阱 4：验证函数未导入正确**
   - ❌ 错误做法：`from FQBase import validate_code`
   - ✅ 正确做法：`from FQBase.Foundation import validate_code`

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [术语表](./glossary.md)
- 查看 [使用指南](./usage.md)
- 探索 [子模块文档](./core/README.md)

## 相关文档

- [README](./README.md)
- [术语表](./glossary.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
