# Local 适配器设计文档

## 概述

本文档记录 Local 适配器的核心设计决策，包括架构选择、模式应用和接口设计。

---

## 设计目标

| 目标 | 说明 |
|------|------|
| **简单轻量** | 无外部依赖，快速上手 |
| **灵活路径** | 支持多种路径解析方式 |
| **错误容忍** | 优雅处理错误，不崩溃 |
| **便捷数据处理** | 内置常见数据处理功能 |

---

## 核心设计模式

### 1. 适配器模式 (Adapter Pattern)

```
DataSourceAdapter (抽象基类)
    │
    ├── TdxAdapter
    ├── AkShareAdapter
    └── LocalAdapter  ← 本地文件适配器
            │
            └── CSVReader
```

**设计理由：**

- 统一的数据访问接口
- 便于与其他数据源切换
- 保持与框架其他部分的一致性

### 2. 模板方法模式 (Template Method Pattern)

LocalAdapter 定义算法骨架，CSVReader 扩展具体实现：

```python
class LocalAdapter:
    def read_csv(self, file_path, encoding):
        resolved = self._resolve_path(file_path)  # 模板方法
        return pd.read_csv(resolved, encoding=encoding)

class CSVReader(LocalAdapter):
    def read(self, file_path, encoding):
        enc = encoding or self._default_encoding
        return self.read_csv(file_path, enc)  # 使用父类模板
```

### 3. 组合模式 (Composition Pattern)

CSVReader 通过组合扩展功能：

```python
class CSVReader(LocalAdapter):
    def __init__(self, base_path, default_encoding, default_date_format):
        super().__init__(base_path=base_path)  # 组合 LocalAdapter
        self._default_encoding = default_encoding
        self._default_date_format = default_date_format
```

---

## 接口设计

### LocalAdapter 接口

```python
class LocalAdapter(DataSourceAdapter):
    def __init__(self, name="local", base_path=None):
        """初始化适配器"""

    def read_csv(self, file_path, encoding="utf-8", **kwargs) -> Optional[pd.DataFrame]:
        """读取 CSV 文件"""

    def write_csv(self, df, file_path, encoding="utf-8", **kwargs) -> bool:
        """写入 CSV 文件"""

    def file_exists(self, file_path) -> bool:
        """检查文件是否存在"""

    def list_files(self, pattern="*") -> List[Path]:
        """列出匹配的文件"""
```

### CSVReader 接口

```python
class CSVReader(LocalAdapter):
    def __init__(self, base_path=None, default_encoding="utf-8",
                 default_date_format="%Y-%m-%d"):
        """初始化读取器"""

    def read(self, file_path, encoding=None, **kwargs) -> Optional[pd.DataFrame]:
        """读取 CSV 文件"""

    def read_with_date_parse(self, file_path, date_columns=None,
                            date_format=None, encoding=None) -> Optional[pd.DataFrame]:
        """读取并解析日期列"""

    def read_date_range(self, file_path, start=None, end=None,
                       date_column="date", encoding=None) -> Optional[pd.DataFrame]:
        """按日期范围读取"""

    def read_columns(self, file_path, columns, encoding=None) -> Optional[pd.DataFrame]:
        """读取指定列"""

    def read_with_filter(self, file_path, filters, encoding=None) -> Optional[pd.DataFrame]:
        """按条件过滤读取"""
```

---

## 路径解析设计

### 相对路径 vs 绝对路径

```python
def _resolve_path(self, file_path: Union[str, Path]) -> Path:
    # 绝对路径直接返回
    if Path(file_path).is_absolute():
        return Path(file_path)

    # 相对路径：如有 base_path 则拼接
    if self._base_path:
        return self._base_path / file_path

    # 无 base_path 则返回相对路径
    return Path(file_path)
```

### 设计决策

| 场景 | 处理方式 |
|------|----------|
| 绝对路径 | 直接使用 |
| 相对路径 + base_path | base_path / file_path |
| 相对路径 + 无 base_path | 使用相对路径 |

---

## 日期处理设计

### 日期列检测

自动检测常见日期列名：

```python
common_date_names = [
    "date", "datetime", "时间", "日期",
    "tradedate", "trade_date"
]
```

### 日期解析策略

```python
def _parse_dates(self, df, date_columns, date_format):
    for col in date_columns:
        if date_format:
            df[col] = pd.to_datetime(df[col],
                                     format=date_format,
                                     errors='coerce')
        else:
            df[col] = pd.to_datetime(df[col],
                                     errors='coerce')
```

### 设计决策

| 决策 | 选择 | 理由 |
|------|------|------|
| 自动检测 | 是 | 简化用户操作 |
| 格式指定 | 可选 | 支持特定格式 |
| 错误处理 | 返回 NaT | 不中断流程 |

---

## 错误处理设计

### 错误处理策略

| 操作 | 失败时 | 成功时 |
|------|--------|--------|
| read_csv | 返回 None | 返回 DataFrame |
| write_csv | 返回 False | 返回 True |
| file_exists | 返回 False | 返回 True |

### 日志记录

```python
logger.warning(f"Failed to read CSV file {resolved}: {e}")
```

---

## 过滤机制设计

### 过滤条件类型

| 类型 | 示例 | 实现 |
|------|------|------|
| 精确匹配 | `{"code": "600000"}` | `df[df["code"] == "600000"]` |
| 范围匹配 | `{"volume": (1000, 5000)}` | `df[(df["volume"] >= 1000) & (df["volume"] <= 5000)]` |

### 设计理由

- 简单条件优先：避免过度设计
- 单一值和范围值区分：支持范围查询
- 后续可扩展：便于添加更多过滤类型

---

## 性能优化设计

### 1. 文件句柄管理

```python
# pandas.read_csv 内部管理文件句柄
df = pd.read_csv(resolved, encoding=encoding)
# 函数返回后，文件句柄自动关闭
```

### 2. 大文件处理

```python
# 分块读取（建议方式）
for chunk in pd.read_csv(file, chunksize=10000):
    process(chunk)
```

### 3. 编码缓存

```python
# 避免重复检测编码
self._default_encoding = "utf-8"  # 实例创建时设置
```

---

## 可测试性设计

### 1. 依赖注入

```python
class LocalAdapter:
    def __init__(self, name="local", base_path=None):
        self._base_path = Path(base_path) if base_path else None
```

### 2. Mock 能力

```python
# 测试时可替换 base_path
adapter = LocalAdapter(base_path="/test/data")
```

---

## 版本演进

### v1.0 (初始版本)

- LocalAdapter 基础功能
- CSV 文件读写
- 相对路径支持

### v1.1

- CSVReader 增强功能
- 日期自动解析
- 数据过滤支持

---

## 设计权衡

### 1. 异常 vs 返回值

**选择返回值：** 返回 None/False 表示失败

**理由：**
- 文件读取失败在本地场景下是正常的
- 不中断业务流程
- 与 Python 惯例一致（.find() 返回 -1）

### 2. 强类型 vs 弱类型

**选择类型提示：** 使用 Union、Optional

**理由：**
- 提高代码可读性
- IDE 支持更好
- 便于维护

---

## 相关文档

- [Local README](README.md)
- [Local 框架文档](framework.md)
- [Local 架构说明](architecture.md)
- [Local API 参考](api.md)
- [Local 使用指南](usage.md)
- [Local 最佳实践](best-practices.md)
- [Local FAQ](faq.md)
- [Local 更新日志](changelog.md)
- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](./README.md)
