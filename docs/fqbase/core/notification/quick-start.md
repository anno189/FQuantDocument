---
title: 通知服务 - 快速入门
description: 5分钟快速上手通知服务模块
tag:
  - fqbase
  - core
  - notification

summary:
  purpose: quick-start
  complexity: low
---

# 通知服务 - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [动手实验室](./workshop.md) → [使用指南](./usage.md) → [案例库](./examples.md) |


## 概述

5分钟快速上手指南，帮助您快速集成通知服务。

## 前置要求

- Python 3.8+
- pip

## 安装

```bash
pip install fquant-fqbase
pip install corpwechatbot requests
```

## 5分钟上手

### Step 1: 配置环境变量

在 `.env` 文件中配置相应的 API 密钥：

```bash
# Server酱配置
SERVERCHAN_KEY=your_serverchan_key

# PushBear配置
PUSHBEAR_KEY=your_pushbear_key

# 企业微信配置
WECOM_CORPID=your_corpid
WECOM_AGENTID_DEFAULT=your_agentid
WECOM_SECRET_DEFAULT=your_secret
```

### Step 2: 导入模块

```python
from FQBase.Core.notification import NotificationManager, sendWechat
```

### Step 3: 使用便捷函数发送企业微信通知

```python
# 发送简单通知
result = sendWechat('交易执行成功：买入股票 600000')
print(f"发送结果: {result}")

# 指定渠道发送
result = sendWechat('订单已成交', channel='BOND')
print(f"发送结果: {result}")
```

### Step 4: 使用管理器发送通知

```python
from FQBase.Core.notification import NotificationManager

# 获取管理器实例（单例）
manager = NotificationManager()

# 发送通知到默认渠道
result = manager.send('系统运行正常', channel='DEFAULT')
print(f"发送结果: {result}")

# 向所有渠道发送
results = manager.send_all('这是一条广播消息')
for channel, success in results.items():
    print(f"{channel}: {'成功' if success else '失败'}")
```

### Step 5: 异步发送通知

```python
# 异步发送（不阻塞主线程）
future = manager.send_async('后台任务完成', channel='SYSTEM')

# 获取结果
result = future.result()
print(f"异步发送结果: {result}")
```

### 完成！

恭喜！你已经学会了通知服务的基本用法。

## ⚠️ 常见陷阱

1. **陷阱 1：未配置环境变量**
   - ❌ 错误做法：直接调用发送函数但不配置任何密钥
   - ✅ 正确做法：确保在 .env 文件中配置了对应的 API 密钥

2. **陷阱 2：渠道名称大小写**
   - ❌ 错误做法：`channel='default'` (小写)
   - ✅ 正确做法：`channel='DEFAULT'` (大写)

3. **陷阱 3：阻塞主线程**
   - ❌ 错误做法：在高并发场景使用同步发送
   - ✅ 正确做法：使用 `send_async()` 异步发送

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [术语表](./glossary.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [术语表](./glossary.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
