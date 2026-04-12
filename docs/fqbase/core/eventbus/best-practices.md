# EventBus 最佳实践

**模块路径**: `FQBase.Core.event_bus`
**源码**: [event_bus.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/event_bus.py)

---

## 一、事件命名规范

```python
# 推荐：使用 领域_动作 格式
EVENTS = {
    "trade_submitted",      # 交易提交
    "trade_executed",        # 交易执行
    "trade_cancelled",       # 交易取消
    "position_opened",       # 持仓开仓
    "position_closed",       # 持仓平仓
    "risk_alert",            # 风控警告
}
```

---

## 二、错误处理

```python
def safe_handler(event: Event):
    try:
        process_data(event.data)
    except ValueError as e:
        print(f"数据错误: {e}")
    except Exception as e:
        print(f"处理异常: {e}")
        # 不重新抛出，避免中断其他订阅者

bus.subscribe("data_update", safe_handler)
```

---

## 三、性能优化

```python
# 推荐：避免在处理器中执行耗时操作
def slow_handler(event: Event):
    send_to_queue(event)  # 放入队列异步处理

# 推荐：耗时操作使用 publish_async
bus.publish_async(event)
```

---

## 四、内存管理

```python
# 推荐：短期对象使用弱引用
class ShortLivedComponent:
    def on_event(self, event: Event):
        print(event.data)

component = ShortLivedComponent()
bus.subscribe("data", component.on_event, weak_ref=True)
```

---

## 五、优先级设计

```python
PRIORITY_HIGH = 100   # 风控检查（最先执行）
PRIORITY_NORMAL = 50  # 正常业务处理
PRIORITY_LOW = 0     # 日志记录
PRIORITY_AUDIT = -1  # 审计追踪（最后执行）

bus.subscribe("trade", check_risk, priority=PRIORITY_HIGH)
bus.subscribe("trade", process_trade, priority=PRIORITY_NORMAL)
bus.subscribe("trade", log_trade, priority=PRIORITY_LOW)
bus.subscribe("trade", audit_trail, priority=PRIORITY_AUDIT)
```
