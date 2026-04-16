---
title: DataStruct - 变更日志
description: DataStruct 数据结构模块版本历史与更新说明
tag:
  - fqdata
  - datastruct
---

# DataStruct - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |

## v1.0.0 (2024-04-14)

### 新增

- 首次发布 DataStruct 模块
- 核心类 QuotationDataStructBase
- 股票日线数据类 StockDayData
- 股票分钟数据类 StockMinData
- 指数日线数据类 IndexDayData
- 期货日线数据类 FutureDayData
- 债券数据类 BondData
- 指标计算 Mixin
- 数据操作 Mixin
- 序列化 IO Mixin
- 重采样功能

### 更改

- Mixin 模式重构代码结构
- 优化数据筛选性能

### 修复

- 修复 @lru_cache 在 property 上使用导致的序列化问题
- 修复 amplitude 重复计算问题
- 完善类型注解

### 安全

- 无安全相关变更

## 相关文档

- [README](./README.md)
