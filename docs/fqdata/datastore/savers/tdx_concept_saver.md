# 概念数据持久化 (tdx_concept_saver)

提供通达信概念数据的保存和加载功能。

## 模块路径

```
FQData.DataStore.savers.tdx_concept_saver
```

## 核心功能

| 功能 | 说明 |
|------|------|
| CSV导入 | 从CSV文件保存概念数据 |
| 概念加载 | 加载通达信概念名称及代码 |
| 名称查询 | 通过代码查询概念名称 |
| 代码查询 | 通过名称查询概念代码 |

## 主要函数

### save_tdx_concept_from_csv

```python
def save_tdx_concept_from_csv(filename: str) -> Optional[pd.DataFrame]
```

从CSV文件保存通达信概念数据。

**参数：**
- `filename`: CSV文件路径

**返回：** DataFrame或None

**示例：**

```python
from FQData import save_tdx_concept_from_csv

result = save_tdx_concept_from_csv('/path/to/concept.csv')
```

---

### load_tdx_concept

```python
def load_tdx_concept() -> pd.DataFrame
```

取通达信概念名称及指数代码。

**返回：** DataFrame，index='code'

**示例：**

```python
from FQData import load_tdx_concept

df = load_tdx_concept()
print(df.head())
```

---

### get_tdx_concept_name

```python
def get_tdx_concept_name(code: str) -> Optional[str]
```

通过代码获取概念名称。

**参数：**
- `code`: 概念代码

**返回：** 概念名称或None

---

### get_tdx_concept_code

```python
def get_tdx_concept_code(name: str) -> Optional[str]
```

通过名称获取概念代码。

**参数：**
- `name`: 概念名称

**返回：** 概念代码或None

---

## 数据结构

概念数据存储在 `code_stock_concept` 集合中，包含以下字段：
- `code`: 概念代码
- `name`: 概念名称
- `count`: 包含的股票数量

---

## 相关文档

- [DataStore 模块](../README.md)
- [Savers 模块索引](README.md)
