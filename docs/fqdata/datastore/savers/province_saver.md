# 省份代码数据持久化 (province_saver)

提供省级地区代码数据的保存和加载功能。

## 模块路径

```
FQData.DataStore.savers.province_saver
```

## 核心功能

| 功能 | 说明 |
|------|------|
| CSV导入 | 从CSV文件保存省份代码数据 |
| 省份加载 | 加载省份代码数据 |

## 主要函数

### save_province_code_from_csv

```python
def save_province_code_from_csv(filename: str) -> Optional[pd.DataFrame]
```

从CSV文件保存省级地区代码数据。

算法：
1. 读取CSV文件
2. 无条件删除旧数据
3. 插入新数据

**参数：**
- `filename`: CSV文件路径

**返回：** DataFrame或None

**示例：**

```python
from FQData import save_province_code_from_csv

result = save_province_code_from_csv('/path/to/province.csv')
```

---

### load_province_code

```python
def load_province_code() -> pd.DataFrame
```

取省级地区代码。

**返回：** DataFrame，index='code'

**示例：**

```python
from FQData import load_province_code

df = load_province_code()
print(df.head())
```

---

## 数据结构

省份数据存储在 `code_province` 集合中。

---

## 相关文档

- [DataStore 模块](../README.md)
- [Savers 模块索引](README.md)
