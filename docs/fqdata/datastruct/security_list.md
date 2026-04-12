# DataStruct security_list 模块

证券列表数据结构模块，提供证券列表查询功能。

## 模块结构

```
security_list.py
```

---

## SecurityListData

证券列表数据结构。

```python
from FQData.DataStruct import SecurityListData

sec_list = SecurityListData(df)
```

### 初始化参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 证券信息，需包含 sse, code, name 列 |

### 数据预处理

- 自动筛选 `sse`, `code`, `name` 列
- 自动设置 `code` 为索引

---

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 原始 DataFrame |
| `code` | List[str] | 所有证券代码 |
| `name` | List[str] | 所有证券名称 |

---

## 方法

### get_stock

获取股票列表。

```python
stocks = sec_list.get_stock()
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `option` | str | 筛选选项（保留接口兼容性） |

**返回：** pd.DataFrame

---

### get_index

获取指数列表。

```python
indices = sec_list.get_index()
```

**返回：** pd.DataFrame

---

### get_etf

获取 ETF 列表。

```python
etfs = sec_list.get_etf()
```

**返回：** pd.DataFrame

---

### filter_by_name

按名称关键词筛选。

```python
bank_stocks = sec_list.filter_by_name('银行')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `keyword` | str | 关键词 |

**返回：** pd.DataFrame - 匹配的证券列表

---

### filter_by_code

按代码前缀筛选。

```python
sh_stocks = sec_list.filter_by_code('60')
sz_stocks = sec_list.filter_by_code('00')
cy_stocks = sec_list.filter_by_code('30')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `prefix` | str | 代码前缀 |

**返回：** pd.DataFrame - 匹配的证券列表

---

## 使用示例

### 基本使用

```python
from FQData.DataStruct import SecurityListData

sec_list = SecurityListData(df)

print(f"证券数量: {len(sec_list)}")
print(f"代码列表: {sec_list.code[:10]}")
print(f"名称列表: {sec_list.name[:10]}")
```

### 名称搜索

```python
# 搜索包含"银行"的股票
bank_stocks = sec_list.filter_by_name('银行')

# 搜索包含"科技"的股票
tech_stocks = sec_list.filter_by_name('科技')
```

### 代码前缀筛选

```python
# 沪市A股
sh_stocks = sec_list.filter_by_code('60')

# 深市主板
sz_stocks = sec_list.filter_by_code('00')

# 创业板
cy_stocks = sec_list.filter_by_code('30')

# 北交所
bj_stocks = sec_list.filter_by_code('83')
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)