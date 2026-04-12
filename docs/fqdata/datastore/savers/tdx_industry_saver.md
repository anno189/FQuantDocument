# 行业数据持久化 (tdx_industry_saver)

提供通达信行业数据的保存和加载功能。

## 模块路径

```
FQData.DataStore.savers.tdx_industry_saver
```

## 核心功能

| 功能 | 说明 |
|------|------|
| CSV导入 | 从CSV文件保存行业数据 |
| 行业加载 | 加载通达信行业数据（支持多级别） |
| 名称查询 | 通过代码查询行业名称 |
| 代码查询 | 通过名称查询行业代码 |
| 行业扩展 | 三级行业扩展成二级行业 |

## 主要函数

### save_tdx_industry_from_csv

```python
def save_tdx_industry_from_csv(filename: str) -> Optional[pd.DataFrame]
```

从CSV文件保存通达信行业数据。

**参数：**
- `filename`: CSV文件路径

**返回：** DataFrame或None

---

### load_tdx_industry

```python
def load_tdx_industry(level: int = 2) -> pd.DataFrame
```

取通达信行业名称及指数代码。

**参数：**
- `level`: 行业级别 (2=II级, 3=III级, 1=II+III级, 0=所有级别)

**返回：** DataFrame

**示例：**

```python
from FQData import load_tdx_industry

df_level2 = load_tdx_industry(level=2)
df_level3 = load_tdx_industry(level=3)
df_all = load_tdx_industry(level=0)
```

---

### get_tdx_industry_name

```python
def get_tdx_industry_name(code: str) -> Optional[str]
```

通过代码获取行业名称。

**参数：**
- `code`: 行业代码

**返回：** 行业名称或None

---

### get_tdx_industry_code

```python
def get_tdx_industry_code(name: str) -> Optional[str]
```

通过名称获取行业代码。

**参数：**
- `name`: 行业名称

**返回：** 行业代码或None

---

### calcuConceptCount322

```python
def calcuConceptCount322(
    data: pd.DataFrame,
    column_name1: str = 'blockname',
    column_name2: str = 'blockname2',
    column_name0: str = 'blockname0'
) -> pd.DataFrame
```

三级行业扩展成二级行业。

**参数：**
- `data`: 包含三级行业数据的DataFrame
- `column_name1`: 三级行业列名
- `column_name2`: 二级行业输出列名
- `column_name0`: 一级行业输出列名

**返回：** 添加了一二级行业信息的DataFrame

---

## 数据结构

行业数据存储在 `code_stock_industry` 集合中，包含以下字段：
- `i1`, `n1`: 一级行业代码和名称
- `i2`, `n2`: 二级行业代码和名称
- `i3`, `n3`: 三级行业代码和名称
- `Valuation`: 行业估值
- `count`: 包含的股票数量

---

## 相关文档

- [DataStore 模块](../README.md)
- [Savers 模块索引](README.md)
