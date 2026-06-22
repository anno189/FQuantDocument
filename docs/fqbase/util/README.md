---
title: Util
description: FQBase 工具层，提供数据转换、文件处理、网络工具、并行计算等
tag:
  - fquant
  - fqbase
  - util

summary:
  type: utility
  complexity: low
  maturity: stable
  size: small
  is_container: false
  api_exports:
    total: 25
    classes: 2
    functions: 23
    constants: 0
  features:
    has_async: false
    is_thread_safe: true
    has_config: false
    has_logging: true
    has_security: false
  usage_scenarios:
    - "数据格式转换（dict ↔ DataFrame）"
    - "文件 MD5 计算"
    - "网络连通性检测"
    - "并行计算加速"
  warnings: []
  limitations: []
  design_patterns: []

relationships:
  belongs_to:
    - fquant.fqbase
  depends_on: []
  used_by:
    - fquant.fqbase.crawler
    - fquant.fqdata

documentation_progress:
  status: complete
  level: L1
  total_expected: 8
  total_generated: 8
  generated:
    - README.md
    - quick-start.md
    - concepts.md
    - api.md
    - usage.md
    - examples.md
    - glossary.md
    - changelog.md
  missing: []

maintenance:
  source_hash: "985f50b1d0493ad6f6807f991e6f888af67f95b9b5235d1c80dd4264187a60f1"
  source_mtime: 1776751707
  source_files:
    - "__init__.py"
    - "converters.py"
    - "crypto.py"
    - "file.py"
    - "network.py"
    - "parallel.py"
    - "transformer.py"
    - "validators.py"
  last_updated: "2026-04"
---

# Util

## 阅读路径

🟢 **新手**：README → quick-start → examples

🔵 **开发者**：README → api → usage

## 一句话总览

📌 **FQBase 跨模块工具层，提供数据转换、文件处理、网络工具、并行计算等常用工具函数。**

## 子模块

| 子模块 | 说明 |
|--------|------|
| converters | 数据转换（parse_number, safe_divide） |
| transformer | 格式转换（dict ↔ DataFrame ↔ JSON） |
| file | 文件处理（MD5、文件大小） |
| network | 网络工具（ping、URL 检测） |
| parallel | 并行计算（多进程、多线程） |
| crypto | 加密随机（随机字符串） |
| validators | 验证器（URL、邮箱等） |

## 快速链接

| 需求 | 文档 |
|------|------|
| 快速入门 | [快速入门](./quick-start.md) |
| 查看 API | [API参考](./api.md) |
| 核心概念 | [核心概念](./concepts.md) |
| 使用指南 | [使用指南](./usage.md) |
| 示例 | [示例](./examples.md) |

## 相关文档

- [FQBase README](../README.md)
