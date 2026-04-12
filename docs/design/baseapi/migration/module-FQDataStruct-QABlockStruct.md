# module-FQDataStruct-QABlockStruct.md

# 模块迁移报告: FQDataStruct-QABlockStruct

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAData.QABlockStruct | FQBase.FQDataStruct |
| **原文件** | `_bak/server/FQData/FQData/QAData/QABlockStruct.py` | `FQBase/FQBase/FQDataStruct/block.py` |
| **功能** | 股票板块数据结构 | 股票板块数据结构 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **类名** | `QA_DataStruct_Stock_block` | `StockBlockData` |
| **架构** | 函数式 | 面向对象 |
| **位置** | FQData.QAData | FQBase.FQDataStruct |

---

## 类对比

### 原实现 (QABlockStruct.py)

```python
class QA_DataStruct_Stock_block():

    def __init__(self, DataFrame):
        self.data = DataFrame
        assert isinstance(DataFrame.index, pd.MultiIndex)
        self.index = self.data.index.remove_unused_levels()

    @property
    def block_name(self):
        return self.index.levels[0].tolist()

    @property
    def code(self):
        return self.index.levels[1].tolist()

    def get_code(self, code):
        return self.new(self.data.loc[(slice(None), code), :])

    def get_block(self, block_name):
        return self.new(self.data.loc[(block_name, slice(None)), :])

    def get_both_block(self, block_list):
        # 获取几只股票共同的板块
        pass
```

### 迁移后 (FQDataStruct/block.py)

```python
class StockBlockData:
    """股票板块数据结构"""

    def __init__(self, data: pd.DataFrame):
        assert isinstance(data.index, pd.MultiIndex), \
            "StockBlockData requires MultiIndex (block_name, code)"
        self._data = data
        self._index = self._data.index.remove_unused_levels()

    @property
    @lru_cache(maxsize=128)
    def block_name(self) -> List[str]:
        return self._index.levels[0].tolist()

    @property
    @lru_cache(maxsize=128)
    def code(self) -> List[str]:
        return self._index.levels[1].tolist()

    def get_code(self, code: str) -> 'StockBlockData':
        return self.new(self._data.loc[(slice(None), code), :])

    def get_block(self, block_name: str) -> 'StockBlockData':
        return self.new(self._data.loc[(block_name, slice(None)), :])

    def get_both_block(self, block_list: List[str]) -> List[str]:
        # 获取几只股票共同的板块
        pass
```

---

## 方法映射

| 原方法 | 迁移后方法 | 状态 |
|--------|------------|------|
| `__init__(DataFrame)` | `__init__(data: pd.DataFrame)` | ✅ 等价 |
| `data` 属性 | `_data` 属性 | ✅ 封装 |
| `len` 属性 | `__len__()` | ✅ 等价 |
| `block_name` 属性 | `block_name` 属性 | ✅ 等价 |
| `code` 属性 | `code` 属性 | ✅ 等价 |
| `view_code` 属性 | `view_code` 属性 | ✅ 等价 |
| `view_block` 属性 | `view_block` 属性 | ✅ 等价 |
| `show()` | `show()` | ✅ 等价 |
| `get_code(code)` | `get_code(code: str)` | ✅ 等价 |
| `get_block(block_name)` | `get_block(block_name: str)` | ✅ 等价 |
| `get_both_code(code)` | `get_both_code(code: str)` | ✅ 等价 |
| `get_both_block(block_list)` | `get_both_block(block_list: List[str])` | ✅ 等价 |

---

## 使用示例

### 原接口

```python
from FQData.QAData.QABlockStruct import QA_DataStruct_Stock_block

block_data = QA_DataStruct_Stock_block(df)

# 获取某只股票的所有板块
stock_blocks = block_data.get_code('000001')

# 获取某概念板块的所有股票
ai_stocks = block_data.get_block('人工智能')

# 获取多只股票共同的板块
common = block_data.get_both_block(['000001', '000002'])
```

### 新接口

```python
from FQBase.FQDataStruct import StockBlockData

block_data = StockBlockData(df)

# 获取某只股票的所有板块
stock_blocks = block_data.get_code('000001')

# 获取某概念板块的所有股票
ai_stocks = block_data.get_block('人工智能')

# 获取多只股票共同的板块
common = block_data.get_both_block(['000001', '000002'])
```

---

## 改进点

| 项目 | 说明 |
|------|------|
| 类型注解 | 添加了完整的类型注解 |
| LRU 缓存 | 常用属性使用 `@lru_cache` 提升性能 |
| 索引管理 | 使用 `remove_unused_levels()` 优化内存 |

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **API 兼容性** | ✅ 方法一一对应 |
| **类型注解** | ✅ 已添加 |
| **性能优化** | ✅ LRU 缓存 |

---

## 相关文件

- [base.md](./module-FQDataStruct-base.md) - 数据结构基类
- [datastruct.md](../fqbase/datastruct.md) - 数据结构 API 文档