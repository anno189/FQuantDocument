# EventBus 使用指南

**模块路径**: `FQBase.Core.event_bus`
**源码**: [event_bus.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/event_bus.py)

---

## 一、基本使用

```python
from FQBase.Core import EventBus, Event, get_event_bus

# 获取事件总线
bus = get_event_bus()

# 定义事件处理器
def on_trade_signal(event: Event):
    print(f"收到信号: {event.data}")

# 订阅事件
bus.subscribe("trade_signal", on_trade_signal)

# 发布事件
bus.publish(Event("trade_signal", data={"code": "000001", "action": "BUY"}))
```

---

## 二、带优先级订阅

```python
# 高优先级先执行
bus.subscribe("trade", self.log_trade, priority=-1)    # 最后执行
bus.subscribe("trade", self.execute_trade, priority=100)  # 最先执行
```

---

## 三、异步发布

```python
import asyncio

async def main():
    await bus.publishAwait(Event("async_event", data={"value": 123}))

asyncio.run(main())
```

---

## 四、全局订阅

```python
def log_all_events(event: Event):
    print(f"[LOG] {event.timestamp} {event.event_type}")

bus.subscribe_global(log_all_events, priority=-100)
```

---

## 五、弱引用订阅

```python
class MarketData:
    def on_price_change(self, event: Event):
        print(f"价格变化: {event.data}")

processor = MarketData()
bus.subscribe("price_change", processor.on_price_change, weak_ref=True)
# processor 删除后自动取消订阅
```

---

## 六、量化交易场景

### 6.1 交易信号处理

```python
class SignalProcessor:
    def __init__(self):
        self.bus = get_event_bus()
        self.subscribe()

    def subscribe(self):
        self.bus.subscribe("signal_generated", self.on_signal)
        self.bus.subscribe("signal_canceled", self.on_cancel)

    def on_signal(self, event: Event):
        signal = event.data
        print(f"处理信号: {signal['symbol']} {signal['direction']}")

processor = SignalProcessor()
bus.publish(Event("signal_generated", data={
    "signal_id": "SIG001",
    "symbol": "000001",
    "direction": "BUY"
}))
```

### 6.2 订单流程事件

```python
class OrderWorkflow:
    def __init__(self):
        self.bus = get_event_bus()
        self.setup_subscribers()

    def setup_subscribers(self):
        self.bus.subscribe("order_submitted", self.on_submit, priority=100)
        self.bus.subscribe("order_filled", self.on_filled, priority=50)

    def on_submit(self, event: Event):
        print(f"订单已提交: {event.data['order_id']}")

    def on_filled(self, event: Event):
        fill = event.data
        print(f"订单成交: {fill['order_id']}")

workflow = OrderWorkflow()
```

### 6.3 风控检查链

```python
class RiskChecker:
    def __init__(self):
        self.bus = get_event_bus()
        self.subscribe()

    def subscribe(self):
        self.bus.subscribe("trade_check", self.check_position, priority=100)
        self.bus.subscribe("trade_check", self.check_cash, priority=90)
        self.bus.subscribe("trade_check", self.check_deviation, priority=80)

    def check_position(self, event: Event):
        if event.data["volume"] > 10000:
            print("风控拒绝: 持仓超限")
            return

    def check_cash(self, event: Event):
        if "reject_reason" in event.data:
            return
        print("资金检查通过")

checker = RiskChecker()
```
