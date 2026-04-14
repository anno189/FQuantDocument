---
title: 通知服务 - 案例库
description: 通知服务实际应用场景与示例
tag:
  - fqbase
  - core
  - notification
---

# 通知服务 - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → **[案例库](./examples.md)** |
| 📚 案例库 | **[案例库](./examples.md)** → [案例研究](./case-studies.md) → [决策指南](./decision-guide.md) → [数据流](./data-flow.md) → [设计模式](./patterns.md) → [技术权衡](./tradeoff.md) |


## 概述

本案例库展示通知服务在实际项目中的各种应用场景和代码示例。

## 示例 1：交易系统订单通知

### 场景描述

在量化交易系统中，当订单成交、撤单或出现异常时，需要及时通知交易员。

### 代码实现

```python
from FQBase.Core.notification import sendWechat
from enum import Enum

class OrderStatus(Enum):
    FILLED = "已成交"
    CANCELLED = "已撤单"
    REJECTED = "已拒绝"

def notify_order_status(order_id: str, status: OrderStatus, details: dict):
    """通知订单状态变更"""
    
    # 根据订单类型选择渠道
    channel = 'BOND' if details.get('bond') else 'DEFAULT'
    
    # 构建消息
    message = f"📢 订单状态变更\n" \
              f"订单号: {order_id}\n" \
              f"状态: {status.value}\n" \
              f"股票: {details.get('stock_code', 'N/A')}\n" \
              f"数量: {details.get('quantity', 0)}\n" \
              f"价格: {details.get('price', 0):.2f}"
    
    # 发送通知
    result = sendWechat(message, channel=channel)
    return result

# 使用示例
notify_order_status(
    order_id="ORDER_20240101_001",
    status=OrderStatus.FILLED,
    details={
        'stock_code': '600000',
        'quantity': 1000,
        'price': 10.50,
        'bond': True
    }
)
```

### 适用场景

- 量化交易系统订单通知
- 券商交易系统成交回报
- 投资组合变更通知

---

## 示例 2：系统监控告警

### 场景描述

监控系统定时检查各项指标，当指标异常时发送告警通知。

### 代码实现

```python
from FQBase.Core.notification import NotificationManager
import psutil
import time

class SystemMonitor:
    def __init__(self):
        self.manager = NotificationManager()
        self.thresholds = {
            'cpu': 80.0,
            'memory': 85.0,
            'disk': 90.0
        }
    
    def check_cpu(self):
        """检查 CPU 使用率"""
        usage = psutil.cpu_percent(interval=1)
        return usage <= self.thresholds['cpu'], usage
    
    def check_memory(self):
        """检查内存使用率"""
        usage = psutil.virtual_memory().percent
        return usage <= self.thresholds['memory'], usage
    
    def check_disk(self):
        """检查磁盘使用率"""
        usage = psutil.disk_usage('/').percent
        return usage <= self.thresholds['disk'], usage
    
    def run_check(self):
        """执行所有检查"""
        alerts = []
        
        checks = [
            ('CPU', self.check_cpu),
            ('内存', self.check_memory),
            ('磁盘', self.check_disk)
        ]
        
        for name, check_func in checks:
            ok, value = check_func()
            if not ok:
                alerts.append(f"⚠️ {name}使用率: {value:.1f}%")
        
        if alerts:
            message = "🚨 系统告警\n" + "\n".join(alerts)
            self.manager.send(message, channel='SYSTEM')
            return False, alerts
        else:
            self.manager.send("✅ 系统运行正常", channel='SYSTEM')
            return True, []

# 使用示例
monitor = SystemMonitor()
ok, details = monitor.run_check()
```

### 适用场景

- 服务器监控系统
- 应用程序健康检查
- 定时任务执行监控

---

## 示例 3：异步任务完成通知

### 场景描述

后台异步任务完成后，通过异步发送通知，不阻塞主流程。

### 代码实现

```python
from FQBase.Core.notification import NotificationManager
from concurrent.futures import ThreadPoolExecutor
import time

def long_running_task(task_id: str):
    """模拟长时间运行的任务"""
    print(f"任务 {task_id} 开始执行...")
    time.sleep(5)  # 模拟耗时操作
    print(f"任务 {task_id} 完成")
    return {"task_id": task_id, "status": "completed"}

def process_with_notification(task_id: str):
    """带通知的任务处理"""
    manager = NotificationManager()
    
    # 异步提交任务
    task_future = executor.submit(long_running_task, task_id)
    
    # 处理过程中可以执行其他操作
    print(f"任务 {task_id} 已提交，开始处理其他事情...")
    
    # 等待任务完成
    result = task_future.result()
    
    # 发送完成通知
    manager.send_async(
        f"✅ 任务 {task_id} 已完成",
        channel='SYSTEM'
    )
    
    return result

# 使用示例
executor = ThreadPoolExecutor(max_workers=4)
result = process_with_notification("TASK_001")
```

### 适用场景

- 批量数据处理任务
- 报表生成任务
- 数据同步任务

---

## 示例 4：多渠道广播

### 场景描述

重要通知需要同时发送到多个渠道，确保信息到达。

### 代码实现

```python
from FQBase.Core.notification import NotificationManager, sendWechat, sendMessage2ServerChan

def broadcast_important_message(title: str, content: str):
    """广播重要消息到所有渠道"""
    
    results = {}
    
    # 渠道 1: 企业微信
    try:
        wechat_result = sendWechat(f"{title}\n\n{content}")
        results['wechat'] = wechat_result
    except Exception as e:
        results['wechat'] = f"失败: {e}"
    
    # 渠道 2: Server酱
    try:
        serverchan_result = sendMessage2ServerChan(title, content)
        results['serverchan'] = serverchan_result.status_code == 200
    except Exception as e:
        results['serverchan'] = f"失败: {e}"
    
    # 汇总结果
    success_count = sum(1 for v in results.values() if v is True)
    
    print(f"广播完成: {success_count}/{len(results)} 渠道成功")
    for channel, result in results.items():
        print(f"  {channel}: {result}")
    
    return results

# 使用示例
broadcast_important_message(
    title="📢 系统维护通知",
    content="系统将于今晚 22:00-24:00 进行维护升级，请提前做好工作安排。"
)
```

### 适用场景

- 重要系统公告
- 紧急故障通知
- 定时报告发送

---

## 常见应用模式

### 模式 1：基于渠道的通知路由

**描述：** 根据消息类型和重要程度选择不同的通知渠道

```python
def route_notification(message_type: str, content: str):
    """路由通知到不同渠道"""
    routes = {
        'urgent': 'SYSTEM',      # 紧急通知 -> 系统渠道
        'trade': 'BOND',         # 交易通知 -> 债券渠道
        'info': 'DEFAULT',       # 一般信息 -> 默认渠道
    }
    
    channel = routes.get(message_type, 'DEFAULT')
    return sendWechat(content, channel=channel)
```

### 模式 2：带重试的通知发送

**描述：** 发送失败时自动重试

```python
import time
from FQBase.Core.notification import sendWechat

def send_with_retry(content: str, channel: str = 'DEFAULT', max_retries: int = 3):
    """带重试的发送"""
    for attempt in range(max_retries):
        result = sendWechat(content, channel=channel)
        if result:
            return True
        if attempt < max_retries - 1:
            time.sleep(1)  # 等待后重试
    
    return False
```

## 最佳实践

1. **使用异步发送**：高并发场景使用 `send_async()`
2. **合理选择渠道**：根据消息类型选择合适的渠道
3. **错误处理**：始终检查返回值并处理失败情况
4. **敏感信息**：不要在通知中发送敏感信息

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
