---
title: 通知模板 - 变更日志
description: 通知模板版本历史与更新说明
tag:
  - fqbase
  - core
  - notification_template
---

# 通知模板 - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |


## 版本历史

### v1.0.0 (当前版本)

#### 新增

- 首次发布
- NotificationTemplate：通知模板数据类
- NotificationTemplateRegistry：模板注册表
- NotificationTemplate：快捷访问类（类方法接口）
- 8 种预设模板：
  - trade_signal：交易信号
  - risk_alert：风险预警
  - system_error：系统异常
  - order_update：订单更新
  - position_update：持仓更新
  - account_update：账户更新
  - backtest_complete：回测完成
  - data_alert：数据警告

#### 功能

- 模板渲染：render() 方法
- 模板字典渲染：render_dict() 方法
- 模板注册：register() 方法
- 模板注销：unregister() 方法
- 模板列表：list_template_names() 方法

## 相关文档

- [README](./README.md)
