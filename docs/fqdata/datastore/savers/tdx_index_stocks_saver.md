# 指数成分股数据持久化 (tdx_index_stocks_saver)

提供指数成分股数据的保存功能。

## 模块路径

```
FQData.DataStore.savers.tdx_index_stocks_saver
```

## 核心功能

| 功能 | 说明 |
|------|------|
| CSV导入 | 从CSV文件保存指数成分股数据 |
| API获取 | 从TDX API获取并保存成分股数据 |
| 批量保存 | 批量保存多个指数的成分股数据 |

## 主要函数

### save_tdx_index_stocks_from_csv

```python
def save_tdx_index_stocks_from_csv(filename: str, index_code: str) -> bool
```

从CSV文件保存指数成分股数据。

**参数：**
- `filename`: CSV文件路径
- `index_code`: 指数代码

**返回：** 保存是否成功

---

### save_tdx_index_stocks_all_from_csv

```python
def save_tdx_index_stocks_all_from_csv(filename: str) -> bool
```

从单个CSV文件保存所有指数成分股数据。

**参数：**
- `filename`: CSV文件路径

**返回：** 保存是否成功

---

### save_index_stocks

```python
def save_index_stocks(index_code: str) -> bool
```

保存指数成分股数据（从TDX API获取）。

**参数：**
- `index_code`: 指数代码，如 '000300'、'000905'

**返回：** 保存是否成功

**示例：**

```python
from FQData import save_index_stocks

result = save_index_stocks('000300')
print(f"保存结果: {result}")
```

---

### save_index_stocks_batch

```python
def save_index_stocks_batch(index_codes: Optional[List[str]] = None) -> int
```

批量保存指数成分股数据。

**参数：**
- `index_codes`: 指数代码列表，默认为主要指数

**返回：** 成功保存的数量

**示例：**

```python
from FQData import save_index_stocks_batch

count = save_index_stocks_batch()
print(f"成功保存 {count} 个指数的成分股")
```

---

## 默认指数列表

`save_index_stocks_batch` 默认保存以下指数的成分股：

| 代码 | 指数名称 |
|------|----------|
| 000016 | 上证50 |
| 000903 | 中证100 |
| 000300 | 沪深300 |
| 000905 | 中证500 |
| 000852 | 中证1000 |
| 000010 | 上证180 |
| 000009 | 上证380 |
| 000133 | 上证150 |
| 000688 | 科创50 |
| 399330 | 深证100 |
| 399009 | 创业板50 |
| 399010 | 深证成指 |

---

## 数据源

- [TdxIndexAdapter](../datasource/adapters/tdx/index.md)

## 相关文档

- [DataStore 模块](../README.md)
- [Savers 模块索引](README.md)
