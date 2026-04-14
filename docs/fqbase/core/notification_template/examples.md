---
title: 通知模板 - 案例库
description: 通知模板实际应用场景与示例
tag:
  - fqbase
  - core
  - notification_template
---

# 通知模板 - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → **[案例库](./examples.md)** |


## 概述

本案例库展示通知模板在实际项目中的各种应用场景和代码示例。

## 示例 1：量化交易信号通知

### 场景描述

在量化交易系统中，当策略产生交易信号时，需要格式化通知交易员。

### 代码实现

```python
from FQBase.Core.notification_template import NotificationTemplate
from FQBase.Core.notification import sendWechat
from enum import Enum

class SignalType(Enum):
    BUY = "买入"
    SELL = "卖出"

def notify_signal(strategy_name: str, stock_code: str, price: float, signal_type: SignalType):
    """通知交易信号"""
    
    # 渲染模板
    message = NotificationTemplate.render(
        'trade_signal',
        strategy=f"{strategy_name} - {signal_type.value}",
        code=stock_code,
        price=price,
        time=get_current_time()
    )
    
    # 选择渠道
    channel = 'BOND' if is_bond(stock_code) else 'DEFAULT'
    
    # 发送通知
    result = sendWechat(message, channel=channel)
    return result

# 使用示例
notify_signal('均值回归', '600000', 12.50, SignalType.BUY)
```

### 适用场景

- 量化策略信号通知
- 交易系统订单通知
- 投资组合变更提醒

---

## 示例 2：系统监控告警

### 场景描述

监控系统检测到异常时，发送格式化的告警通知。

### 代码实现

```python
from FQBase.Core.notification_template import NotificationTemplate
from FQBase.Core.notification import NotificationManager
import psutil

class AlertLevel(Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"

def check_system_health():
    """检查系统健康状态"""
    manager = NotificationManager()
    
    alerts = []
    level = AlertLevel.INFO
    
    # 检查 CPU
    cpu = psutil.cpu_percent(interval=1)
    if cpu > 90:
        alerts.append(f"CPU 使用率过高: {cpu}%")
        level = AlertLevel.ERROR
    
    # 检查内存
    memory = psutil.virtual_memory().percent
    if memory > 85:
        alerts.append(f"内存使用率过高: {memory}%")
        level = AlertLevel.WARNING
    
    # 检查磁盘
    disk = psutil.disk_usage('/').percent
    if disk > 90:
        alerts.append(f"磁盘使用率过高: {disk}%")
        level = AlertLevel.WARNING
    
    # 根据告警级别选择模板
    if level == AlertLevel.ERROR:
        template_name = 'system_error'
    elif level == AlertLevel.WARNING:
        template_name = 'risk_alert'
    else:
        template_name = 'trade_signal'  # reuse for simple info
    
    if alerts:
        message = NotificationTemplate.render(
            template_name,
            risk_type='系统监控' if level != 'error' else '系统异常',
            details='\n'.join(alerts),
            time=get_current_time()
        )
        manager.send(message, channel='SYSTEM')
    
    return len(alerts) == 0

# 使用示例
is_healthy = check_system_health()
```

### 适用场景

- 服务器监控系统
- 应用程序健康检查
- 定时任务执行监控

---

## 示例 3：订单状态更新

### 场景描述

订单状态变更时，发送格式化的通知。

### 代码实现

```python
from FQBase.Core.notification_template import NotificationTemplate
from FQBase.Core.notification import sendWechat
from enum import Enum

class OrderStatus(Enum):
    PENDING = "待成交"
    FILLED = "已成交"
    CANCELLED = "已撤单"
    REJECTED = "已拒绝"

def notify_order_update(order_id: str, stock_code: str, direction: str, 
                       volume: int, price: float, status: OrderStatus):
    """通知订单状态更新"""
    
    # 渲染模板
    message = NotificationTemplate.render(
        'order_update',
        order_id=order_id,
        code=stock_code,
        direction=direction,
        volume=volume,
        status=status.value
    )
    
    # 发送通知
    channel = 'BOND' if is_bond(stock_code) else 'DEFAULT'
    return sendWechat(message, channel=channel)

# 使用示例
notify_order_update(
    order_id='ORDER_20240115_001',
    stock_code='600000',
    direction='买入',
    volume=1000,
    price=12.50,
    status=OrderStatus.FILLED
)
```

### 适用场景

- 订单状态变更通知
- 成交回报通知
- 交易确认通知

---

## 示例 4：回测结果通知

### 场景描述

回测任务完成后，发送格式化的结果通知。

### 代码实现

```python
from FQBase.Core.notification_template import NotificationTemplate
from FQBase.Core.notification import sendWechat
import json

def notify_backtest_complete(strategy_name: str, results: dict):
    """通知回测完成"""
    
    # 渲染模板
    message = NotificationTemplate.render(
        'backtest_complete',
        strategy=strategy_name,
        return_rate=f"{results['total_return']:.2%}",
        sharpe=f"{results['sharpe_ratio']:.2f}",
        max_drawdown=f"{results['max_drawdown']:.2%}"
    )
    
    # 发送通知
    return sendWechat(message, channel='SYSTEM')

# 使用示例
results = {
    'total_return': 0.258,
    'sharpe_ratio': 1.85,
    'max_drawdown': 0.123
}
notify_backtest_complete('双均线策略', results)
```

### 适用场景

- 回测任务完成通知
- 策略绩效报告
- 批量任务完成汇总

---

## 常见应用模式

### 模式 1：模板 + 通知服务组合

**描述：** 渲染模板后直接发送通知

```python
def send_template_notification(template_name: str, channel: str, **kwargs):
    """发送模板通知的快捷函数"""
    message = NotificationTemplate.render(template_name, **kwargs)
    return sendWechat(message, channel=channel)
```

### 模式 2：根据条件选择模板

**描述：** 根据不同条件选择不同模板

```python
def get_template_for_event(event_type: str):
    """根据事件类型获取对应模板"""
    templates = {
        'trade': 'trade_signal',
        'alert': 'risk_alert',
        'error': 'system_error',
        'order': 'order_update',
        'position': 'position_update',
        'account': 'account_update',
        'backtest': 'backtest_complete',
        'data': 'data_alert',
    }
    return templates.get(event_type, 'trade_signal')
```

## 最佳实践

1. **统一消息格式**：使用模板确保消息格式一致
2. **包含关键信息**：确保模板包含时间、标的等关键字段
3. **选择合适的通知级别**：error 用 error 级别，warning 用 warning 级别
4. **与通知服务配合使用**：模板负责格式，通知服务负责发送

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [通知服务模块](../notification/README.md)
