# DataStruct block 模块

板块数据结构模块，提供概念/行业板块数据结构的实现。

## 模块结构

```
block.py
```

---

## StockBlockData

股票板块数据结构。

```python
from FQData.DataStruct import StockBlockData

block_data = StockBlockData(df)
```

### 初始化参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 必须包含 MultiIndex (block_name, code) |

### 数据预处理

- 验证 MultiIndex 格式
- 自动移除未使用的索引级别

---

## 属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `block_name` | List[str] | 所有板块名列表 |
| `code` | List[str] | 唯一的证券代码列表 |
| `view_code` | pd.Series | 按股票排列的板块视图 |
| `view_block` | pd.Series | 按板块排列的代码视图 |
| `data` | pd.DataFrame | 原始 DataFrame |

---

## 方法

### new

通过 data 新建一个 StockBlockData。

```python
new_block = block_data.new(new_df)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `data` | pd.DataFrame | 新数据 |

**返回：** StockBlockData - 新实例

---

### show

展示 DataFrame。

```python
df = block_data.show()
```

**返回：** pd.DataFrame

---

### get_code

获取某一只股票的板块。

```python
stock_blocks = block_data.get_code('600000')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | str | 股票代码 |

**返回：** StockBlockData

---

### get_block

获取板块下的所有股票。

```python
block_stocks = block_data.get_block('银行')
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `block_name` | str/List[str] | 板块名称 |

**返回：** StockBlockData

---

### get_both_code

获取某一只股票的板块（别名）。

```python
stock_blocks = block_data.get_both_code('600000')
```

**返回：** StockBlockData

---

### get_both_block

获取几只股票相同的板块。

```python
common_blocks = block_data.get_both_block(['600000', '600036', '601318'])
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `block_list` | List[str] | 股票代码列表 |

**返回：** List[str] - 同时属于这些股票的板块列表

---

## 使用示例

### 基本使用

```python
from FQData.DataStruct import StockBlockData

block_data = StockBlockData(df)

print(f"板块数量: {len(block_data.block_name)}")
print(f"股票数量: {len(block_data.code)}")
```

### 按股票查询

```python
stock_blocks = block_data.get_code('600000')
print(f"600000 所属板块: {stock_blocks.block_name}")
```

### 按板块查询

```python
bank_stocks = block_data.get_block('银行')
print(f"银行板块股票数: {len(bank_stocks.code)}")
```

### 获取共同板块

```python
common = block_data.get_both_block(['600000', '600036'])
print(f"共同板块: {common}")
```

---

## 相关文档

- [DataStruct README](README.md)
- [DataStruct API](api.md)