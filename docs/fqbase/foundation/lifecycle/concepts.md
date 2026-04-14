---
title: 生命周期管理 - 核心概念
description: 生命周期管理核心概念
tag:
  - fqbase
  - lifecycle
---

# 生命周期管理 - 核心概念

## 概念：服务状态

- UNKNOWN - 未知
- INITIALIZING - 初始化中
- RUNNING - 运行中
- DEGRADED - 降级
- STOPPING - 停止中
- STOPPED - 已停止
- ERROR - 错误

## 概念：协议

- HealthCheckable - 健康检查
- Initializable - 可初始化
- Shutdownable - 可关闭

## 相关文档

- [API参考](./api.md)
