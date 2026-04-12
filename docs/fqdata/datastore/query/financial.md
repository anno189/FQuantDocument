# DataStore financial 查询

财务数据查询模块，提供财务报表、财务日历等查询功能。

## 模块结构

```
financial.py
```

---

## 函数

### query_financial_report

查询专业财务报表。

```python
from FQData.DataStore.query.financial import query_financial_report

data = query_financial_report(
    code='600000',
    report_date='2024-03-31',
    ltype='EN'
)
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `code` | str/List[str] | None | 股票代码或代码列表 |
| `report_date` | str/int/List | None | 报告日期 |
| `ltype` | str | 'EN' | 列名语言 ('EN' 英文, 'CH'/'CN' 中文) |

**返回：** pd.DataFrame - 财务报表数据

**report_date 格式：**
- str: '2024-03-31'
- int: 20240331
- List: ['2024-03-31', '2024-06-30']

**ltype 选项：**
- `'EN'`: 返回英文列名
- `'CH'` 或 `'CN'`: 返回中文列名

---

### query_stock_financial_calendar

查询股票财务日历。

```python
from FQData.DataStore.query.financial import query_stock_financial_calendar

calendar = query_stock_financial_calendar(code='600000')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 股票代码 |

**返回：** pd.DataFrame - 财务日历数据

---

## 财务报表指标

### 常用财务指标

| 指标代码 | 中文名称 | 英文名称 |
|---------|---------|---------|
| 001 | 营业总收入 | Total Operating Revenue |
| 002 | 营业收入 | Operating Revenue |
| 003 | 营业总成本 | Total Operating Cost |
| 004 | 营业成本 | Operating Cost |
| 005 | 销售费用 | Selling Expense |
| 006 | 管理费用 | Management Expense |
| 007 | 财务费用 | Financial Expense |
| 008 | 投资收益 | Investment Income |
| 009 | 营业利润 | Operating Profit |
| 010 | 利润总额 | Total Profit |
| 011 | 净利润 | Net Profit |
| 012 | 归属母公司净利润 | Net Profit to Parent |
| ... | ... | ... |

---

## 使用示例

### 查询单只股票财务报表

```python
from FQData.DataStore.query.financial import query_financial_report

data = query_financial_report(
    code='600000',
    report_date='2024-03-31'
)
print(data.head())
```

### 查询多年财务数据

```python
data = query_financial_report(
    code='600000',
    report_date=['2023-03-31', '2023-06-30', '2023-09-30', '2023-12-31', '2024-03-31']
)
print(data)
```

### 使用中文列名

```python
data_cn = query_financial_report(
    code='600000',
    report_date='2024-03-31',
    ltype='CN'
)
print(data_cn.head())
```

### 批量查询多只股票

```python
data = query_financial_report(
    code=['600000', '000001', '000002'],
    report_date='2024-03-31'
)
print(data)
```

### 查询财务日历

```python
from FQData.DataStore.query.financial import query_stock_financial_calendar

calendar = query_stock_financial_calendar(code='600000')
print(calendar)
```

---

## 相关文档

- [query/README](README.md)
- [DataStore 模块](../README.md)