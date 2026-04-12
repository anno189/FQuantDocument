# module-FQDataStruct-QAIndicatorStruct.md

# 模块迁移报告: FQDataStruct-QAIndicatorStruct

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAData.QAIndicatorStruct | FQBase.FQDataStruct |
| **原文件** | `_bak/server/FQData/FQData/QAData/QAIndicatorStruct.py` | `FQBase/FQBase/FQDataStruct/indicator.py` |
| **功能** | 技术指标数据 | 指标数据结构 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **类名** | `QA_DataStruct_Indicators` | `IndicatorData` |
| **索引** | MultiIndex (datetime, code) | MultiIndex (datetime, code) |

---

## 类对比

### 原实现 (QAIndicatorStruct.py)

```python
class QA_DataStruct_Indicators():

    def __init__(self, data):
        self.data = data

    def __repr__(self):
        return '< QA_DataStruct_Indicators FROM {} TO {} WITH {} CODES >'.format(
            self.data.index.levels[0][0],
            self.data.index.levels[0][-1],
            len(self.data.index.levels[1])
        )

    def get_indicators(self, time, code, indicator_name=None):
        try:
            return self.data.loc[(time, code), indicator_name]
        except Exception:
            return None

    def get_code(self, code):
        return self.data.loc[(slice(None), code), :]

    def get_timerange(self, start, end, code=None):
        if code:
            return self.data.loc[
                (slice(pd.Timestamp(start), pd.Timestamp(end)), code), :
            ]
        else:
            return self.data.loc[
                (slice(pd.Timestamp(start), pd.Timestamp(end))), :
            ]

    def groupby(self, by=None, axis=0, level=None, **kwargs):
        if by == self.data.index.names[1]:
            by = None
            level = 1
        elif by == self.data.index.names[0]:
            by = None
            level = 0
        return self.data.groupby(
            by=by, axis=axis, level=level, **kwargs
        )

    def add_func(self, func, *args, **kwargs):
        return self.groupby(
            level=1, as_index=False, group_keys=False
        ).apply(func, raw=True, *args, **kwargs)
```

### 迁移后 (indicator.py)

```python
class IndicatorData:
    """指标数据结构"""

    def __init__(self, data: pd.DataFrame):
        self._data = data

    def __repr__(self):
        return '< IndicatorData FROM {} TO {} WITH {} CODES >'.format(...)

    def get_indicator(self, time, code, indicator_name=None):
        return self._data.loc[(pd.Timestamp(time), code), indicator_name]

    def get_code(self, code: str) -> pd.DataFrame:
        return self._data.loc[(slice(None), code), :]

    def get_timerange(self, start, end, code=None) -> pd.DataFrame:
        # 支持 code=None 返回所有股票
        ...

    def groupby(self, by=None, axis=0, level=None, **kwargs):
        # 与原实现一致
        ...

    def add_func(self, func, *args, **kwargs):
        # 与原实现一致
        ...
```

---

## 方法映射

| 原方法 | 迁移后 | 状态 |
|--------|--------|------|
| `__init__(data)` | `__init__(data: pd.DataFrame)` | ✅ |
| `data` 属性 | `_data` 属性 | ✅ |
| `__repr__()` | `__repr__()` | ✅ |
| `__len__()` | `__len__()` | ✅ |
| `get_indicators(time, code, indicator_name)` | `get_indicator(time, code, indicator_name)` | ✅ |
| `get_code(code)` | `get_code(code: str)` | ✅ |
| `get_timerange(start, end, code)` | `get_timerange(start, end, code)` | ✅ |
| `groupby(by, axis, level, **kwargs)` | `groupby(by, axis, level, **kwargs)` | ✅ |
| `add_func(func, *args, **kwargs)` | `add_func(func, *args, **kwargs)` | ✅ |
| `to_df()` | `to_df()` | ✅ |
| `to_dict()` | `to_dict()` | ✅ |
| - | `code` 属性 | ✅ 新增 |
| - | `datetime` 属性 | ✅ 新增 |

---

## 使用示例

### 原接口

```python
from FQData.QAData.QAIndicatorStruct import QA_DataStruct_Indicators

indicators = QA_DataStruct_Indicators(df)
ma5 = indicators.get_indicators('2020-01-01', '000001', 'MA5')
stock_ma = indicators.get_code('000001')
```

### 新接口

```python
from FQBase.FQDataStruct import IndicatorData

indicators = IndicatorData(df)
ma5 = indicators.get_indicator('2020-01-01', '000001', 'MA5')
stock_ma = indicators.get_code('000001')
```

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **API 兼容性** | ✅ 方法一一对应 |
| **类型注解** | ✅ 已添加 |
| **新增属性** | ✅ `code`, `datetime` 属性 |

---

## 相关文件

- [base.md](./module-FQDataStruct-base.md) - 数据结构基类