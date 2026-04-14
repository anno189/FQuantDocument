---
title: 通知服务 - 使用指南
description: 通知服务详细使用指南
tag:
  - fqbase
  - core
  - notification
---

# 通知服务 - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → **[使用指南](./usage.md)** → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → **[使用指南](./usage.md)** → [最佳实践](./best-practices.md) |


## 概述

本指南详细介绍如何有效地使用通知服务模块，包括基本用法、配置选项和最佳实践。

## 基本用法

### 安装

```bash
pip install fquant-fqbase
pip install corpwechatbot requests
```

### 快速开始

```python
from FQBase.Core.notification import NotificationManager, sendWechat

# 方式一：使用便捷函数
result = sendWechat('交易执行成功')
print(f"发送结果: {result}")

# 方式二：使用管理器
manager = NotificationManager()
result = manager.send('系统运行正常', channel='DEFAULT')
print(f"发送结果: {result}")
```

## 常见用例

### 用例 1: 交易系统订单通知

**场景：** 当订单成交时向交易员发送通知

**代码：**

```python
from FQBase.Core.notification import sendWechat

def on_order_filled(order):
    """订单成交回调"""
    message = f"订单成交通知\n" \
              f"股票: {order.stock_code}\n" \
              f"数量: {order.quantity}\n" \
              f"价格: {order.price}\n" \
              f"方向: {'买入' if order.direction == 'BUY' else '卖出'}"
    
    result = sendWechat(message, channel='BOND')
    return result
```

### 用例 2: 监控系统告警

**场景：** 当系统检测到异常时发送告警

**代码：**

```python
from FQBase.Core.notification import NotificationManager

def check_system_health():
    """检查系统健康状态"""
    manager = NotificationManager()
    
    issues = []
    
    # 检查各项指标
    if cpu_usage > 90:
        issues.append(f"CPU使用率过高: {cpu_usage}%")
    
    if memory_usage > 85:
        issues.append(f"内存使用率过高: {memory_usage}%")
    
    if issues:
        message = "🚨 系统告警\n" + "\n".join(issues)
        manager.send(message, channel='SYSTEM')
    else:
        manager.send("✅ 系统运行正常", channel='SYSTEM')
```

### 用例 3: 异步批量通知

**场景：** 批量处理任务完成后发送通知

**代码：**

```python
from FQBase.Core.notification import NotificationManager

def process_batch_tasks(tasks):
    """批量处理任务"""
    manager = NotificationManager()
    results = []
    
    # 异步提交所有任务
    futures = []
    for task in tasks:
        future = manager.send_async(
            f"任务处理中: {task.name}",
            channel='SYSTEM'
        )
        futures.append((task, future))
    
    # 收集结果
    success_count = 0
    for task, future in futures:
        try:
            if future.result():
                success_count += 1
        except Exception as e:
            print(f"任务 {task.name} 发送失败: {e}")
    
    # 发送汇总通知
    summary = f"批量任务完成\n成功: {success_count}/{len(tasks)}"
    manager.send(summary, channel='SYSTEM')
    
    return success_count
```

### 用例 4: 向所有渠道发送广播

**场景：** 重要通知需要发送到所有渠道

**代码：**

```python
from FQBase.Core.notification import NotificationManager

def broadcast_important_message(message):
    """广播重要消息到所有渠道"""
    manager = NotificationManager()
    
    results = manager.send_all(message)
    
    print("广播结果:")
    for channel, success in results.items():
        status = "✅ 成功" if success else "❌ 失败"
        print(f"  {channel}: {status}")
    
    return results
```

## 配置

### 环境变量配置

在 `.env` 文件中配置：

```bash
# Server酱配置
SERVERCHAN_KEY=your_serverchan_key_here

# PushBear配置
PUSHBEAR_KEY=your_pushbear_key_here

# 企业微信配置
WECOM_CORPID=your_corpid
WECOM_AGENTID_DEFAULT=1000010
WECOM_SECRET_DEFAULT=your_default_secret
WECOM_AGENTID_BOND=1000011
WECOM_SECRET_BOND=your_bond_secret
WECOM_AGENTID_SYSTEM=1000012
WECOM_SECRET_SYSTEM=your_system_secret
```

### 代码中配置

```python
from FQBase.Core.notification import ServerChanHandler, PushBearHandler

# 使用自定义 Key
serverchan = ServerChanHandler(serverchan_key='custom_key')
pushbear = PushBearHandler(send_key='custom_key')
```

## 错误处理

```python
from FQBase.Core.notification import NotificationManager

try:
    manager = NotificationManager()
    result = manager.send('测试消息', channel='DEFAULT')
    
    if not result:
        print("发送失败，请检查配置")
        # 可以添加重试逻辑
        import time
        time.sleep(1)
        result = manager.send('重试消息', channel='DEFAULT')
        
except Exception as e:
    print(f"发生异常: {e}")
    # 记录日志或告警
```

## 相关文档

- [API参考](./api.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
