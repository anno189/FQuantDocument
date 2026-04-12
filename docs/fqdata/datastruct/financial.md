# DataStruct financial 模块

财务数据结构模块，提供财务报表数据结构的实现。

## 模块结构

```
financial.py
```

---

## FinancialData

财务指标数据结构。

```python
from FQData.DataStruct import FinancialData

financial = FinancialData(df)
```

### 初始化参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 财务指标数据 |

### 数据预处理

- 自动初始化中英文列名映射
- 如果无法导入映射，使用原始列名

---

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 原始 DataFrame |
| `code` | List[str] | 股票代码列表 |
| `date` | List[pd.Timestamp] | 报告日期列表 |

---

## 方法

### get_report_by_date

获取某只股票在特定日期的报告。

```python
report = financial.get_report_by_date('600000', '2024-03-31')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 股票代码 |
| `date` | str/pd.Timestamp | 报告日期 |

**返回：** pd.Series

---

### get_key

获取某只股票在特定日期范围的某个指标。

```python
pe_data = financial.get_key(
    code='600000',
    reportdate=['2024-03-31', '2024-06-30', '2024-09-30'],
    key='pe'
)

single_value = financial.get_key(
    code='600000',
    reportdate='2024-03-31',
    key='pe'
)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 股票代码 |
| `reportdate` | str/pd.Timestamp/List | 报告日期 |
| `key` | str | 指标名称 |

**返回：** pd.Series 或单一值

---

### get_financial

获取某只股票的财务数据。

```python
all_data = financial.get_financial('600000')

year_data = financial.get_financial(
    '600000',
    start='2023-01-01',
    end='2024-12-31'
)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 股票代码 |
| `start` | str | 开始日期（可选） |
| `end` | str | 结束日期（可选） |

**返回：** pd.DataFrame

---

## 使用示例

### 基本使用

```python
from FQData.DataStruct import FinancialData

financial = FinancialData(df)

print(f"股票数量: {len(financial.code)}")
print(f"日期范围: {financial.date}")
```

### 查询财务指标

```python
pe = financial.get_key('600000', '2024-03-31', 'pe')
roe = financial.get_key('600000', '2024-03-31', 'roe')
```

### 获取时间序列

```python
pe_series = financial.get_key(
    '600000',
    ['2023-03-31', '2023-06-30', '2023-09-30', '2023-12-31', '2024-03-31'],
    'pe'
)
```

### 获取完整财务数据

```python
financial_data = financial.get_financial('600000')
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)