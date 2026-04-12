# DataStruct adj 模块

复权因子获取和复权计算模块，提供股票除权数据获取、前复权、后复权计算以及市值计算功能。

## 模块结构

```
adj.py
```

## 工具函数

### IF

条件函数，类似于 Excel 的 IF 函数。

```python
from FQData.DataStruct.adj import IF

result = IF(condition, value_if_true, value_if_false)
```

---

## 数据获取

### fetch_stock_adj

获取股票复权系数 ADJ。

```python
from FQData.DataStruct.adj import fetch_stock_adj

adj_data = fetch_stock_adj(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str/List[str] | 股票代码或代码列表 |
| `start` | str | 开始日期 |
| `end` | str | 结束日期 |
| `format` | str | 返回格式，默认 'pd' |

**返回：** pd.DataFrame - 包含 date, code, adj 列的 DataFrame

---

### fetch_stock_xdxr

获取股票除权信息。

```python
from FQData.DataStruct.adj import fetch_stock_xdxr

xdxr_data = fetch_stock_xdxr(code='600000')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 股票代码 |
| `format` | str | 返回格式，默认 'pd' |

**返回：** pd.DataFrame - 包含除权信息的 DataFrame

**返回字段：**

| 字段 | 说明 |
|------|------|
| category | 除权类型 |
| category_meaning | 类型含义 |
| code | 股票代码 |
| date | 日期 |
| fenhong | 分红 |
| fenshu | 分股 |
| liquidity_after | 流通后 |
| liquidity_before | 流通前 |
| name | 名称 |
| peigu | 配股 |
| peigujia | 配股价格 |
| shares_after | 股份后 |
| shares_before | 股份前 |
| songzhuangu | 送转股 |
| suogu | 缩股 |
| xingquanjia | 行权价 |

---

### _fetch_stock_xdxr_batch

批量获取股票除权信息。

```python
from FQData.DataStruct.adj import _fetch_stock_xdxr_batch

xdxr_data = _fetch_stock_xdxr_batch(['600000', '000001'])
```

---

## 复权计算

### data_stock_to_fq

股票日线/分钟线动态复权接口。

```python
from FQData.DataStruct.adj import data_stock_to_fq

fq_data = data_stock_to_fq(bfq_data, type_='qfq')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `__data` | pd.DataFrame | 不复权数据 |
| `type_` | str | 复权类型 ('01'/'qfq' 前复权, '02'/'hfq' 后复权) |

**返回：** pd.DataFrame - 复权后的数据

---

### _data_stock_to_fq

使用数据库数据进行复权（内部函数）。

```python
from FQData.DataStruct.adj import _data_stock_to_fq

fq_data = _data_stock_to_fq(bfq_data, xdxr_data, fqtype='qfq')
```

---

### data_stock_fq_adj

复权价格计算。

```python
from FQData.DataStruct.adj import data_stock_fq_adj

adj_ratio = data_stock_fq_adj(code='600000', date='2024-01-01', values=10.0)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 股票代码 |
| `date` | str | 日期 |
| `values` | float | 价格 |

**返回：** float - 复权因子

---

## 流通股本

### _data_stock_liquidity

取流通盘、总股本变化。

```python
from FQData.DataStruct.adj import _data_stock_liquidity

data = _data_stock_liquicity(stock_data)
```

**返回：** pd.DataFrame - 包含流通股本和总股本的数据

**新增字段：**

| 字段 | 说明 |
|------|------|
| liutongguben | 流通股本 |
| zongguben | 总股本 |

---

## 市值计算

### calc_marketvalue

使用除权数据计算市值。

```python
from FQData.DataStruct.adj import calc_marketvalue

data_with_mv = calc_marketvalue(stock_data, xdxr_data)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 股票行情数据 |
| `xdxr` | pd.DataFrame | 除权信息数据 |

**返回：** pd.DataFrame - 包含市值的行情数据

**新增字段：**

| 字段 | 说明 |
|------|------|
| mv | 总市值 |
| liquidity_mv | 流通市值 |

---

### data_marketvalue

计算股票市值。

```python
from FQData.DataStruct.adj import data_marketvalue

data_with_mv = data_marketvalue(stock_data)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 股票行情数据，需包含 MultiIndex (date, code) |

**返回：** pd.DataFrame - 包含 mv 和 liquidity_mv 的数据

---

## 除权类型

| 类型值 | 含义 |
|--------|------|
| 1 | 分红 |
| 2 | 配股 |
| 3 | 送转股 |
| 4 | 送股 |
| 5 | 增发 |
| 6 | 上市 |
| 7 | 退市 |
| 8 | 扩股 |
| 9 | 缩股 |
| 10 | 股权激励 |
| 11 | 股份回购 |
| 12 | 可转债转股 |

---

## 使用示例

### 前复权

```python
from FQData.DataStruct.adj import data_stock_to_fq, fetch_stock_xdxr

xdxr_data = fetch_stock_xdxr('600000')

fq_data = data_stock_to_fq(bfq_data, type_='qfq')
```

### 后复权

```python
fq_data = data_stock_to_fq(bfq_data, type_='hfq')
```

### 计算市值

```python
from FQData.DataStruct.adj import data_marketvalue

data_with_mv = data_marketvalue(stock_data)

print(f"总市值: {data_with_mv['mv'].iloc[-1]}")
print(f"流通市值: {data_with_mv['liquidity_mv'].iloc[-1]}")
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct _base](_base.md)