# Local 适配器框架文档

## 概述

Local 适配器是 FQData DataSource 模块中的本地文件数据适配器，提供读取本地 CSV 文件的统一接口。作为 DataSource 适配器体系的一部分，它与其他网络适配器（如 TdxAdapter、AkShareAdapter）形成互补，专门用于处理本地已有数据。

---

## 框架集成

### 继承关系

```
DataSourceAdapter (抽象基类)
    │
    └── LocalAdapter (本地文件适配器基类)
            │
            └── CSVReader (CSV 读取器)
```

### 模块位置

```
FQData/
└── DataSource/
    └── adapters/
        └── local/
            ├── __init__.py      # 模块导出
            ├── base.py          # LocalAdapter 基类
            └── csv_reader.py    # CSVReader 读取器
```

---

## 初始化

### LocalAdapter 初始化

```python
from FQData.DataSource.adapters.local import LocalAdapter

adapter = LocalAdapter(
    name="local",              # 适配器名称
    base_path="/data"         # 基础路径（可选）
)
```

**参数说明：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `str` | `"local"` | 适配器名称 |
| `base_path` | `str` | `None` | 基础路径，相对路径以此为基准 |

### CSVReader 初始化

```python
from FQData.DataSource.adapters.local import CSVReader

reader = CSVReader(
    base_path="/data",                    # 基础路径
    default_encoding="utf-8",            # 默认编码
    default_date_format="%Y-%m-%d"        # 默认日期格式
)
```

---

## 生命周期

### 实例创建

```python
adapter = LocalAdapter(base_path="/data")

# adapter._connected 状态变为 True
# base_path 存在时连接正常
```

### 健康检查

```python
if adapter.health_check():
    print("Local 适配器正常")
else:
    print("Local 适配器异常")
```

### 资源清理

Local 适配器不持有需要关闭的网络连接或文件句柄，因此无需显式清理。Python 垃圾回收会自动处理。

---

## 与其他 DataSource 适配器的集成

### DataSourceFacade 自动选择

在 DataSourceFacade 中，Local 适配器可作为离线数据源使用：

```python
from FQData.DataSource import DataSourceFacade

facade = DataSourceFacade()

# 当网络不可用时，可回退到 Local 适配器
data = facade.get_stock_day("600000", "2024-01-01", "2024-12-31")
```

### 使用场景

| 场景 | 推荐适配器 | 说明 |
|------|------------|------|
| 首次获取数据 | TdxAdapter | 从网络获取 |
| 本地缓存数据 | LocalAdapter | 读取本地文件 |
| 备用数据源 | AkShareAdapter | 网络回退 |

---

## 配置

### 基础路径配置

```python
adapter = LocalAdapter(base_path="/path/to/data")

# 或动态设置
adapter.set_base_path("/new/path/to/data")
```

### CSV 读取配置

```python
reader = CSVReader(
    base_path="/data",
    default_encoding="gbk",              # 处理中文编码
    default_date_format="%Y-%m-%d"        # 日期格式
)
```

---

## 依赖

Local 适配器几乎没有外部依赖，仅使用 Python 标准库：

| 依赖 | 版本 | 用途 |
|------|------|------|
| pandas | - | DataFrame 操作 |
| pathlib | 标准库 | 路径处理 |

---

## 相关文档

- [Local README](README.md)
- [Local 架构说明](architecture.md)
- [Local 设计文档](design.md)
- [Local API 参考](api.md)
- [Local 使用指南](usage.md)
- [Local 最佳实践](best-practices.md)
- [Local FAQ](faq.md)
- [Local 更新日志](changelog.md)
- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](./README.md)
