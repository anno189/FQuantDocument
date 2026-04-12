# module-FQDataStruct-QASeriesStruct.md

# 模块迁移报告: FQDataStruct-QASeriesStruct

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAData.QASeriesStruct | FQBase.FQDataStruct |
| **原文件** | `_bak/server/FQData/FQData/QAData/QASeriesStruct.py` | 尚未迁移 |
| **功能** | Series 数据结构 | 通用序列数据结构 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **类名** | `QA_DataStruct_Series` | `SeriesData` |
| **数据** | `series` | `_series` |
| **多索引** | `if_multiindex` | 自动检测 |

---

## 类对比

### 原实现 (QASeriesStruct.py)

```python
class QA_DataStruct_Series():
    def __init__(self, series):
        self.series = series.sort_index()
        if isinstance(series.index, pd.core.indexes.multi.MultiIndex):
            self.if_multiindex = True
            self.index = series.index.remove_unused_levels()
        else:
            self.if_multiindex = False
            self.index = series.index

    @property
    def code(self):
        if self.if_multiindex:
            return self.index.levels[1].tolist()
        else:
            return None

    @property
    def datetime(self):
        if self.if_multiindex:
            return self.index.levels[0].tolist()
        elif isinstance(self.index, pd.DatetimeIndex):
            return self.index
        else:
            return None

    @property
    def date(self):
        if self.if_multiindex:
            return np.unique(self.index.levels[0].date).tolist()
        elif isinstance(self.index, pd.DatetimeIndex):
            return np.unique(self.index.date).tolist()
        else:
            return None

    def new(self, series):
        temp = deepcopy(self)
        temp.__init__(series)
        return temp

    def select_code(self, code):
        return self.new(self.series.loc[(slice(None), code)])

    def select_time(self, start, end=None):
        if end is None:
            return self.new(self.series.loc[(pd.Timestamp(start), slice(None))])
        else:
            return self.new(self.series.loc[
                (slice(pd.Timestamp(start), pd.Timestamp(end)), slice(None))
            ])
```

### 待实现 (FQDataStruct/series.py)

```python
class SeriesData:
    """通用序列数据结构"""

    def __init__(self, series: pd.Series):
        self._series = series.sort_index()
        self._if_multiindex = isinstance(
            series.index, pd.MultiIndex
        )
        if self._if_multiindex:
            self._index = series.index.remove_unused_levels()
        else:
            self._index = series.index

    @property
    def code(self):
        if self._if_multiindex:
            return self._index.levels[1].tolist()
        return None

    @property
    def datetime(self):
        if self._if_multiindex:
            return self._index.levels[0].tolist()
        elif isinstance(self._index, pd.DatetimeIndex):
            return self._index
        return None

    def select_code(self, code):
        return self.new(self._series.loc[(slice(None), code)])

    def select_time(self, start, end=None):
        if end is None:
            return self.new(self._series.loc[(pd.Timestamp(start), slice(None))])
        else:
            return self.new(self._series.loc[
                (slice(pd.Timestamp(start), pd.Timestamp(end)), slice(None))
            ])
```

---

## 方法映射

| 原方法 | 迁移后 | 状态 |
|--------|--------|------|
| `__init__(series)` | `__init__(series: pd.Series)` | ✅ |
| `series` 属性 | `series` 属性 | ✅ |
| `if_multiindex` 属性 | `if_multiindex` 属性 | ✅ |
| `code` 属性 | `code` 属性 | ✅ |
| `datetime` 属性 | `datetime` 属性 | ✅ |
| `date` 属性 | `date` 属性 | ✅ |
| `new(series)` | `new(series)` | ✅ |
| `select_code(code)` | `select_code(code)` | ✅ |
| `select_time(start, end)` | `select_time(start, end)` | ✅ |

---

## 使用示例

### 原接口

```python
from FQData.QAData.QASeriesStruct import QA_DataStruct_Series

series_data = QA_DataStruct_Series(s)
codes = series_data.code
datetimes = series_data.datetime
filtered = series_data.select_code('000001')
time_filtered = series_data.select_time('2020-01-01', '2024-12-31')
```

### 待实现接口

```python
from FQBase.FQDataStruct import SeriesData

series_data = SeriesData(s)
codes = series_data.code
datetimes = series_data.datetime
filtered = series_data.select_code('000001')
time_filtered = series_data.select_time('2020-01-01', '2024-12-31')
```

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **代码迁移** | ✅ 已完成 |
| **导出更新** | ✅ 已完成 |

---

## 相关文件

- [base.md](./module-FQDataStruct-base.md) - 数据结构基类