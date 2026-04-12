---
title: 开始使用
---

# 开始使用 FQuant

## 项目介绍

FQuant 是一个量化交易系统，提供数据获取、策略回测、实时分析、预警复盘等功能。

## 模块架构

| 模块 | 说明 |
|-----|------|
| **FQBase** | 基础模块：配置中心、核心抽象、数据源、存储、通知服务 |
| **FQAlgorithm** | 算法体系：指标库、因子库、过滤器、信号、评估器 |
| **FQMarket** | 市场层：策略系统、回测引擎、实时分析 |
| **FQServer** | 服务层：Celery 定时任务、Flask API、任务调度 |
| **FQAlert** | 预警系统：实时预警、消息推送、告警收敛 |
| **FQReport** | 盘后复盘：涨停复盘、主线复盘、策略复盘 |

## 快速导航

- [系统架构总览](/architecture/overview) - 了解整体架构设计
- [FQBase 基础模块](/fqbase/) - 配置中心、核心抽象、工具库
- [FQAlgorithm 算法体系](/fqalgorithm/) - 指标、因子、过滤器
- [FQMarket 市场层](/fqmarket/) - 策略、回测、实时分析
- [FQServer 服务层](/fqserver/) - 定时任务、API 服务
- [开发指南](/dev/development) - 开发规范和工作流程