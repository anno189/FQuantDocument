# Local 适配器更新日志

## 概述

本文档记录 Local 适配器的版本历史和变更内容。

---

## 版本格式

```
[版本号] - YYYY-MM-DD
### 新增
### 优化
### 修复
### 变更
```

---

## [v1.1.0] - 2024-06-01

### 新增

- CSVReader 类，提供高级 CSV 读取功能
- 日期自动解析功能 (`read_with_date_parse`)
- 日期范围读取功能 (`read_date_range`)
- 数据过滤功能 (`read_with_filter`)
- 列选择读取功能 (`read_columns`)
- 文件信息获取功能 (`get_info`)

### 优化

- 改进路径解析逻辑
- 优化日期列自动检测算法

---

## [v1.0.0] - 2024-01-01

### 新增

- LocalAdapter 基础功能
- CSV 文件读取 (`read_csv`)
- CSV 文件写入 (`write_csv`)
- 文件存在检查 (`file_exists`)
- 文件列表获取 (`list_files`)
- 健康检查 (`health_check`)

---

## 迁移指南

### v1.1 迁移 (v1.0 -> v1.1)

**变更点：**

1. CSVReader 类新增

```python
# v1.0
from FQData.DataSource.adapters.local import LocalAdapter
adapter = LocalAdapter(base_path="/data")
df = adapter.read_csv("file.csv")

# v1.1
from FQData.DataSource.adapters.local import CSVReader
reader = CSVReader(base_path="/data")
df = reader.read("file.csv")
df = reader.read_with_date_parse("file.csv")  # 新功能
```

2. 返回值处理

Local 适配器在 v1.0 和 v1.1 中行为一致，读取失败都返回 `None`。

---

## 即将废弃

无

---

## 相关文档

- [Local README](README.md)
- [Local 框架文档](framework.md)
- [Local 架构说明](architecture.md)
- [Local 设计文档](design.md)
- [Local API 参考](api.md)
- [Local 使用指南](usage.md)
- [Local 最佳实践](best-practices.md)
- [Local FAQ](faq.md)
- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](./README.md)
