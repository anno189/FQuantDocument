# 财务数据查询

提供财务报表、财务日历等查询功能。

## 模块路径

```
FQData.DataStore.query.financial
```

## 导入

```python
from FQData.DataStore.query import (
    query_financial_report,
    query_stock_financial_calendar,
)
```

## query_financial_report

```python
def query_financial_report(
    code: Union[str, List[str]] = None,
    report_date: Union[str, int, List] = None,
    ltype: str = 'EN'
) -> pd.DataFrame
```

查询专业财务报表。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 股票代码 |
| report_date | str/int/list | 报告日期（支持 int/str/list，会转换为 int） |
| ltype | str | 列名语言 ('EN' 英文, 'CH'/'CN' 中文) |

**返回：** 财务报表 DataFrame

**示例：**

```python
financial = query_financial_report(
    code='600000',
    report_date='20240331'
)

financial = query_financial_report(
    code=['600000', '000001'],
    report_date=['20240331', '20231231'],
    ltype='EN'
)
```

---

## query_stock_financial_calendar

```python
def query_stock_financial_calendar(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str = None,
    format: str = 'pd'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询股票财报日历。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | str/List[str] | 股票代码 |
| start_date | str | 开始日期 |
| end_date | str | 结束日期 |
| format | str | 返回格式 |

**返回：** 股票财报日历

---

## 相关文档

- [Query 模块 README](./README.md)
- [股票查询](./stock.md)
