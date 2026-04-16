---
title: Util - 跨模块工具层
description: FQBase 跨模块工具层，提供数据转换、文件处理、网络工具、并行计算等功能
tag:
  - fqbase
  - util

summary:
  type: utility
  complexity: low
  maturity: stable
  size: m
  core_classes:
    - ParallelProcess
    - ParallelThread
  key_functions:
    - dict_to_df
    - normalize_code
    - file_md5
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "任何需要数据格式转换的场景"
    - "需要并行处理批量数据的场景"
    - "需要文件或网络操作的场景"
  warnings:
    - "ParallelProcess 不能传 lambda 函数"
    - "网络工具有超时限制"
  limitations:
    - "仅支持本地文件和 HTTP/HTTPS"

relationships:
  belongs_to:
    - fquant.fqbase
  used_by:
    - fquant.fqdata
    - fquant.fqfactor
  depends_on:
    - pandas
    - numpy
  import_path:
    - from FQBase.Util import file, network, crypto

migrations:
  moved:
    - module: codec
      moved_to: FQData.normalizer
      functions: [code_to_6digit, code_to_jqformat, code_adjust_ctp, code_to_list]
    - module: bar
      moved_to: FQData.DataStruct
      functions: [make_min_index, make_hour_index, make_future_min_index, time_gap]

concepts:
  provides:
    - name: 数据转换
      definition: 数据类型转换、格式化工具
    - name: 文件处理
      definition: 文件 MD5、目录创建等工具
    - name: 并行计算
      definition: 多进程、多线程并行处理
---

# Util - 跨模块工具层

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [API参考](./api.md) → [使用指南](./usage.md) |

## ⚠️ 重要变更

> **注意**: 部分子模块已迁移到 FQData 模块

| 原模块 | 新位置 | 状态 |
|--------|--------|------|
| codec | FQData.normalizer | 已迁移 |
| bar | FQData.DataStruct | 已迁移 |

---

## 一句话总览

📌 **FQBase 跨模块工具层，提供数据转换、文件处理、网络工具、并行计算等功能**

## 概述

Util 是 FQBase 的工具容器模块，聚合了多个工具子模块：

| 子模块 | 说明 | 状态 |
|--------|------|------|
| [file](./file/) | 文件处理工具 | ✅ 活跃 |
| [network](./network/) | 网络工具 | ✅ 活跃 |
| [parallel](./parallel/) | 并行计算 | ✅ 活跃 |
| [converters](./converters/) | 数据转换工具 | ✅ 活跃 |
| [transformer](./transformer/) | 格式转换工具 | ✅ 活跃 |
| [crypto](./crypto.md) | 随机数生成工具 | ✅ 活跃 |
| [codec](./codec/) | 股票代码格式转换 | 🔄 已迁移 |
| [bar](./bar/) | 时间索引工具 | 🔄 已迁移 |

## 安装

```bash
pip install fquant-fqbase
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
