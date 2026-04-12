# Logger 框架文档

**模块路径**: `FQBase.Core.logger`
**源码**: [logger.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/logger.py)

---

## 一、框架概述

### 1.1 模块简介

Logger 是 FQBase 框架的**统一日志系统**，提供标准化的日志记录接口，支持多实例单例模式、线程安全、进度日志和配置化管理。

### 1.2 核心特性

| 特性 | 说明 |
|------|------|
| 多实例单例模式 | 按 name 区分，同一 name 返回同一实例 |
| 线程安全 | 双锁机制保护初始化和实例创建 |
| 进度日志 | 专用 `progress()` 方法输出进度信息 |
| 配置化管理 | 支持 YAML 配置文件或自动降级 |
| 自动初始化 | 首次获取 Logger 时自动初始化 |
| 第三方库控制 | 自动设置 pymongo/asyncio/matplotlib 日志级别 |
| 文件轮转 | RotatingFileHandler 自动轮转，防止日志无限增长 |

### 1.3 设计模式

| 模式 | 应用 |
|------|------|
| 多实例单例 | 按 name 区分的不同 Logger 实例 |
| 工厂模式 | `get_logger()` 工厂函数 |
| 委托模式 | FQLogger 委托给标准库 logging.Logger |
