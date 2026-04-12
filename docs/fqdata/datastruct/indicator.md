# DataStruct indicator 模块

指标数据结构模块，提供技术指标数据结构的实现。

## 模块结构

```
indicator.py
```

---

## IndicatorData

指标数据结构。

```python
from FQData.DataStruct import IndicatorData

indicator = IndicatorData(df)
```

### 初始化参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 指标数据，索引为 (datetime, code) 的 MultiIndex |

---

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 原始 DataFrame |
| `index` | pd.MultiIndex | 数据索引 |
| `code` | List[str] | 股票代码列表 |
| `datetime` | List[pd.Timestamp] | 时间列表 |

---

## 方法

### get_indicator

获取某一时间的某一只股票的指标。

```python
value = indicator.get_indicator(
    time='2024-01-01',
    code='600000',
    indicator_name='ma5'
)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `time` | str/pd.Timestamp | 时间 |
| `code` | str | 股票代码 |
| `indicator_name` | str | 指标名称，None 时返回整行 |

**返回：** 指标值或 pd.Series

---

### get_code

获取某一只股票的指标序列。

```python
code_indicator = indicator.get_code('600000')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 股票代码 |

**返回：** pd.DataFrame

---

### get_timerange

获取某一段时间的某一只股票的指标。

```python
range_indicator = indicator.get_timerange(
    start='2024-01-01',
    end='2024-12-31',
    code='600000'
)

all_range = indicator.get_timerange(
    start='2024-01-01',
    end='2024-12-31'
)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `start` | str | 开始时间 |
| `end` | str | 结束时间 |
| `code` | str | 股票代码，None 时返回所有股票 |

**返回：** pd.DataFrame

---

### groupby

仿 DataFrame 的 groupby 写法。

```python
grouped = indicator.groupby(level=1)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `by` | - | 分组键 |
| `axis` | int | 轴，0 或 1 |
| `level` | - | 多层索引级别 |
| `as_index` | bool | 是否保留索引 |
| `sort` | bool | 是否排序 |
| `group_keys` | bool | 是否添加组键 |
| `squeeze` | bool | 是否压缩 |

**返回：** GroupBy 对象

---

### add_func

按证券分组应用函数。

```python
result = indicator.add_func(func, arg1, arg2)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `func` | function | 函数 |

**返回：** 函数执行结果

---

### to_df

转换为 DataFrame。

```python
df = indicator.to_df()
```

**返回：** pd.DataFrame

---

### to_dict

转换为字典。

```python
d = indicator.to_dict(orient='index')
```

**参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `orient` | str | 'index' | 字典格式 |

**返回：** dict

---

## 使用示例

### 基本使用

```python
from FQData.DataStruct import IndicatorData

indicator = IndicatorData(df)

print(f"代码列表: {indicator.code}")
print(f"时间范围: {indicator.datetime[0]} ~ {indicator.datetime[-1]}")
```

### 查询指标

```python
ma5_value = indicator.get_indicator('2024-01-01', '600000', 'ma5')

stock_ma5 = indicator.get_code('600000')

date_range = indicator.get_timerange('2024-01-01', '2024-12-31', '600000')
```

### 分组操作

```python
result = indicator.add_func(lambda x: x.mean())
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)
- [DataStruct _base](_base.md)