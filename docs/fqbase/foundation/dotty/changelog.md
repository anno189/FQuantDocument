---
title: Dotty 嵌套字典 - 变更日志
description: Dotty 版本历史与更新说明
tag:
  - fqbase
  - dotty
---

# Dotty 嵌套字典 - 变更日志

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 📖 索引 | [README](./README.md) → **[变更日志](./changelog.md)** |


## v1.0.0 (2024-01-15)

### 新增

- 首次发布 Dotty 嵌套字典访问工具
- 提供点号深度访问嵌套字典功能
- 支持属性访问方式
- 支持列表索引和切片
- 支持 JSON 序列化
- 支持类型自动推断

### 核心功能

- `dotty()` - 工厂函数，创建 Dotty 实例
- `Dotty` - 字典包装器类
- `DottyEncoder` - JSON 编码器

### 主要特性

- 点号访问：`d['user.profile.name']`
- 属性访问：`d.user.profile.name`
- 深度赋值：自动创建中间路径
- 列表切片：`d['items[0:2]']`
- 类型推断：自动识别数字/字符串键

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [使用指南](./usage.md)
