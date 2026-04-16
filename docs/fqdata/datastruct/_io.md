---
title: _io - 行情数据序列化 IO Mixin
description: 提供各类数据导出格式的 Mixin 类
tag:
  - fqdata
  - datastruct
  - io

summary:
  type: data-processing
  complexity: low
  maturity: stable
  core_classes:
    - QuotationIOSMixin
  features:
    is_pure_function: false
    is_thread_safe: true
  usage_scenarios:
    - "场景1：将行情数据导出为多种格式"
    - "场景2：数据持久化和分享"
  warnings:
    - "Mixin 类不能直接实例化"
  limitations:
    - "需要与 QuotationDataStructBase 配合使用"

relationships:
  belongs_to:
    - fquant.fqdata.datastruct
  depends_on:
    - pandas

api:
  signatures:
    QuotationIOSMixin:
      to_json: "(self, orient: str = 'index') -> str"
      to_csv: "(self, path: str = None, **kwargs) -> str"
      to_excel: "(self, path: str, **kwargs) -> None"
      to_hdf: "(self, path: str, key: str = 'data', **kwargs) -> None"
      to_parquet: "(self, path: str, **kwargs) -> None"
      to_pickle: "(self, path: str, **kwargs) -> None"
      to_sql: "(self, con, name: str, **kwargs) -> None"
      to_markdown: "(self, path: str = None) -> str"
  examples:
    basic: |
      from FQData.DataStruct import StockDayData
      stock = StockDayData(data, dtype='stock_day', if_fq='bfq')
      stock.to_csv('data.csv')
      stock.to_json('data.json')
      stock.to_excel('data.xlsx')
---

# _io - 行情数据序列化 IO Mixin

## 一句话总览

📌 **行情数据序列化 Mixin，支持多种格式导出**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 场景1：将行情数据导出为多种格式
- 场景2：数据持久化和分享

❌ **不应该使用**：
- 不应该直接实例化 Mixin 类
- 不应该单独使用，需要与基类配合

### 注意事项

1. **Mixin 类不能直接实例化**
   - 说明：此类仅用于多重继承，必须放在 QuotationDataStructBase 之后

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | pandas | 数据处理 |

**TL;DR**：
- 核心能力：to_csv, to_json, to_excel, to_parquet, to_pickle 等导出方法

## 快速开始

```python
from FQData.DataStruct import StockDayData

stock = StockDayData(data, dtype='stock_day', if_fq='bfq')

# 导出为 CSV
stock.to_csv('data.csv')

# 导出为 JSON
stock.to_json('data.json')

# 导出为 Excel
stock.to_excel('data.xlsx')

# 导出为 Parquet
stock.to_parquet('data.parquet')

# 导出为 Pickle
stock.to_pickle('data.pkl')
```

## 导出方法

### 文本格式

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| to_csv | str | 导出为 CSV |
| to_json | str | 导出为 JSON |
| to_markdown | str | 导出为 Markdown |
| to_string | str | 导出为字符串 |
| to_clipboard | None | 导出到剪贴板 |
| to_html | str | 导出为 HTML |

### 二进制格式

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| to_excel | None | 导出为 Excel |
| to_hdf | None | 导出为 HDF5 |
| to_parquet | None | 导出为 Parquet |
| to_pickle | None | 导出为 Pickle |
| to_feather | None | 导出为 Feather |
| to_records | list | 导出为记录数组 |

### 数据库

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| to_sql | None | 导出到 SQL 数据库 |

### 转换方法

| 方法 | 返回类型 | 描述 |
|------|---------|------|
| to_period | QuotationDataStructBase | 转换为周期数据 |
| to_timestamp | QuotationDataStructBase | 转换为时间戳 |
| to_xarray | - | 转换为 xarray |

## 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| IOError | 文件写入失败 | 检查文件路径权限 |
| AttributeError | Mixin 未正确继承 | 确保继承顺序正确 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本 |
