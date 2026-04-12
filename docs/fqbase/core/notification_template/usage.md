# NotificationTemplate 使用指南

**模块路径**: `FQBase.Core.notification_template`
**源码**: [notification_template.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification_template.py)

---

## 一、基本使用

```python
from FQBase.Core.notification_template import NotificationTemplate

message = NotificationTemplate.render(
    'trade_signal',
    strategy='均值回归',
    code='000001',
    price=12.50,
    time='2024-01-15 10:30:00'
)
print(message)
# 输出:
# 【交易信号】均值回归
# 股票: 000001
# 价格: 12.5
# 时间: 2024-01-15 10:30:00
```

---

## 二、渲染为字典

```python
from FQBase.Core.notification_template import NotificationTemplate

result = NotificationTemplate.render_dict(
    'trade_signal',
    strategy='均值回归',
    code='000001',
    price=12.50,
    time='2024-01-15 10:30:00'
)
print(result)
# 输出:
# {
#     'name': 'trade_signal',
#     'title': '【交易信号】',
#     'body': '均值回归\n股票: 000001\n价格: 12.5\n时间: 2024-01-15 10:30:00',
#     'level': 'info',
#     'variables': {...}
# }
```

---

## 三、自定义模板

```python
from FQBase.Core.notification_template import NotificationTemplate, NotificationTemplate as NP

custom_template = NotificationTemplate(
    name='custom_alert',
    title='【自定义告警】',
    body_template='告警类型: {alert_type}\n标的: {code}\n原因: {reason}',
    level='warning'
)

NotificationTemplate.register(custom_template)

message = NotificationTemplate.render(
    'custom_alert',
    alert_type='价格异动',
    code='000001',
    reason='涨跌幅超过5%'
)
```

---

## 四、与通知服务集成

```python
from FQBase.Core.notification_template import NotificationTemplate
from FQBase.Core.notification import sendWechat

message = NotificationTemplate.render(
    'trade_signal',
    strategy='均值回归',
    code='000001',
    price=12.50,
    time='2024-01-15 10:30:00'
)

sendWechat(message, channel='DEFAULT')
```

---

## 五、列出所有模板

```python
from FQBase.Core.notification_template import NotificationTemplate

names = NotificationTemplate.list_names()
print(names)
# ['trade_signal', 'risk_alert', 'system_error', 'order_update', ...]

template = NotificationTemplate.get('trade_signal')
print(template.title)  # '【交易信号】'
```

---

## 六、预设模板详情

### 6.1 trade_signal 交易信号

```python
NotificationTemplate.render('trade_signal',
    strategy='策略名称',
    code='000001',
    price=12.50,
    time='2024-01-15 10:30:00'
)
# 输出:
# 【交易信号】策略名称
# 股票: 000001
# 价格: 12.5
# 时间: 2024-01-15 10:30:00
```

### 6.2 risk_alert 风险预警

```python
NotificationTemplate.render('risk_alert',
    risk_type='持仓超限',
    details='股票 000001 持仓比例 15%，超过上限 10%',
    time='2024-01-15 10:30:00'
)
# 输出:
# 【风险预警】持仓超限
# 详情: 股票 000001 持仓比例 15%，超过上限 10%
# 时间: 2024-01-15 10:30:00
```

### 6.3 order_update 订单更新

```python
NotificationTemplate.render('order_update',
    order_id='ORD12345',
    code='000001',
    direction='BUY',
    volume=1000,
    status='已成交'
)
# 输出:
# 【订单更新】订单号: ORD12345
# 标的: 000001
# 方向: BUY
# 数量: 1000
# 状态: 已成交
```

### 6.4 backtest_complete 回测完成

```python
NotificationTemplate.render('backtest_complete',
    strategy='均值回归',
    return_rate='15.6%',
    sharpe='2.1',
    max_drawdown='8.3%'
)
# 输出:
# 【回测完成】策略: 均值回归
# 收益: 15.6%
# 夏普比率: 2.1
# 最大回撤: 8.3%
```

---

## 七、量化交易场景

### 7.1 交易信号通知

```python
from FQBase.Core.notification_template import NotificationTemplate
from FQBase.Core.notification import sendWechat

def notify_trade_signal(signal: dict):
    message = NotificationTemplate.render('trade_signal', **signal)
    sendWechat(message, channel='DEFAULT')
    return message

notify_trade_signal({
    'strategy': '双均线策略',
    'code': '000001',
    'price': 12.50,
    'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
})
```

### 7.2 风控告警

```python
from FQBase.Core.notification_template import NotificationTemplate
from FQBase.Core.notification import NotificationManager

def notify_risk_alert(risk_type: str, details: str):
    manager = NotificationManager()

    if risk_type in ['持仓超限', '资金不足']:
        channel = 'BOND'
    elif risk_type in ['异常交易', '频繁撤单']:
        channel = 'HIGH'
    else:
        channel = 'DEFAULT'

    message = NotificationTemplate.render('risk_alert',
        risk_type=risk_type,
        details=details,
        time=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )

    manager.send(message, channel=channel)
```

### 7.3 回测完成通知

```python
from FQBase.Core.notification_template import NotificationTemplate
from FQBase.Core.notification import sendWechat

def notify_backtest_complete(strategy: str, result: dict):
    message = NotificationTemplate.render('backtest_complete',
        strategy=strategy,
        return_rate=f"{result['return_rate']:.2f}%",
        sharpe=f"{result['sharpe']:.2f}",
        max_drawdown=f"{result['max_drawdown']:.2f}%"
    )
    sendWechat(message, channel='SYSTEM')
```
