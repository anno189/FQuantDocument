---
title: 通知服务 - 变更日志
description: 通知服务版本历史与更新说明
tag:
  - fqbase
  - core
  - notification
---

# 通知服务 - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |


## 版本历史

### v1.0.0 (当前版本)

#### 新增

- 首次发布
- NotificationManager：统一通知管理器，支持单例模式
- WecomHandler：企业微信通知处理器
- ServerChanHandler：Server 酱通知处理器
- PushBearHandler：PushBear 通知处理器
- sendWechat：企业微信便捷发送函数
- sendMessage2ServerChan：Server 酱便捷发送函数
- sendMessagetoAll：PushBear 便捷发送函数
- 异步发送支持：通过 ThreadPoolExecutor 实现
- 多渠道支持：DEFAULT、BOND、VOL_PRICE、HIGH、LIMIT、INS、SYSTEM

#### 特性

- 单例模式：NotificationManager 使用单例模式确保全局唯一
- 延迟初始化：handlers 在首次访问时才创建
- 线程安全：使用锁机制保证并发安全
- 环境变量配置：支持通过环境变量配置 API 密钥
- 批量发送：send_all() 支持向所有渠道发送

#### 依赖

- corpwechatbot：企业微信发送库
- requests：HTTP 请求库
- FQBase.Foundation.singleton：单例装饰器
- FQBase.Core.logger：日志模块
- FQBase.Config.core.env：环境变量模块

## 相关文档

- [README](./README.md)
