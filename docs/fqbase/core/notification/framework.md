# Notification 框架文档

**模块路径**: `FQBase.Core.notification`
**源码**: [notification.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/notification.py)

---

## 一、概述

### 1.1 什么是通知服务

Notification 是 FQBase 框架的**统一通知服务**，支持多渠道通知发送，包括企业微信、Server 酱和 PushBear。

**解决的问题**：
- 通知发送代码分散在各处，难以统一管理
- 渠道切换需要修改多处代码
- 缺乏错误处理和重试机制

**核心价值**：
- **统一接口**：通过 NotificationManager 提供一致的发送接口
- **多渠道支持**：一条消息可发送到多个渠道
- **渠道分组**：按业务场景划分通知渠道（交易、风控、系统等）

### 1.2 通知服务与模板的关系

```
┌─────────────────────────────────────────────────────────────────┐
│                      应用层代码                                   │
│   NotificationTemplate.render('trade_signal', code='000001')    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              NotificationTemplate (模板渲染)                      │
│   渲染消息内容，返回格式化的字符串                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              Notification (通知发送)                              │
│   manager.send(message, channel='DEFAULT')                       │
│   sendWechat(message, channel='HIGH')                           │
└─────────────────────────────────────────────────────────────────┘
```

**使用场景**：
- **推荐**：使用 `NotificationTemplate.render()` 渲染消息 → 发送给用户
- **直接发送**：简单消息可直接调用 `sendWechat("纯文本内容")`

### 1.3 渠道选择指南

| 渠道 | 适用场景 | 特点 |
|------|----------|------|
| DEFAULT | 通用通知 | 默认渠道，配置简单 |
| BOND | 债券相关 | 债券行情、预警 |
| HIGH | 重要告警 | 紧急风控、重要订单 |
| LIMIT | 涨跌停相关 | 涨停板、跌停板监控 |
| INS | 指标相关 | 技术指标异动 |
| SYSTEM | 系统通知 | 系统运行状态 |

---

## 二、框架概述

### 2.1 模块简介

Notification 是 FQBase 框架的**统一通知服务**，支持多渠道通知发送，包括企业微信、Server 酱和 PushBear。

### 2.2 支持渠道

| 渠道 | 说明 | 配置 |
|------|------|------|
| 企业微信 (Wecom) | 支持多渠道 | `WECOM_CORPID`, `WECOM_SECRET_*`, `WECOM_AGENTID_*` |
| Server 酱 | 第三方推送 | `SERVERCHAN_KEY` |
| PushBear | 第三方推送 | `PUSHBEAR_KEY` |

### 2.3 核心特性

| 特性 | 说明 |
|------|------|
| 多渠道支持 | 企业微信、Server 酱、PushBear |
| 单例模式 | NotificationManager 全局唯一 |
| 线程安全 | 所有操作线程安全 |
| 多渠道发送 | send_all() 向所有渠道发送 |
| 渠道分组 | 支持 DEFAULT/BOND/VOL_PRICE/HIGH/LIMIT/INS/SYSTEM |
| 兼容旧接口 | 提供 sendWechat 等兼容函数 |
