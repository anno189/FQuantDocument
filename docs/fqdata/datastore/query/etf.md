# ETF/LOF 查询

提供 ETF/LOF 列表、名称等查询功能。

## 模块路径

```
FQData.DataStore.query.etf
```

## 导入

```python
from FQData.DataStore.query import (
    query_etf_list,
    query_etf_name,
)
```

## query_etf_list

```python
def query_etf_list() -> pd.DataFrame
```

获取ETF列表。

**返回：** ETF列表 DataFrame

---

## query_etf_name

```python
def query_etf_name(code: Union[str, List[str]]) -> Union[str, pd.DataFrame]
```

查询ETF名称。

**参数：**
- 单个代码返回 str
- 列表返回 DataFrame

---

## 相关文档

- [Query 模块 README](./README.md)
- [指数查询](./index.md)
