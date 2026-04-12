# module-FQDataStruct-QAFinancialStruct.md

# 模块迁移报告: FQDataStruct-QAFinancialStruct

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAData.QAFinancialStruct | FQBase.FQDataStruct |
| **原文件** | `_bak/server/FQData/FQData/QAData/QAFinancialStruct.py` | `FQBase/FQBase/FQDataStruct/financial.py` |
| **功能** | 财务指标结构 | 财务指标数据结构 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **类名** | `QA_DataStruct_Financial` | `FinancialData` |
| **数据存储** | `self.data` | `self._data` |
| **列名映射** | `financial_dict` | `FINANCIAL_INDICATORS` |

---

## 类对比

### 原实现 (QAFinancialStruct.py)

```python
from FQData.QAData.financial_mean import financial_dict

class QA_DataStruct_Financial():

    def __init__(self, data):
        self.data = data
        self.colunms_en = list(financial_dict.values())
        self.colunms_cn = list(financial_dict.keys())

    def get_report_by_date(self, code, date):
        return self.data.loc[pd.Timestamp(date), code]

    def get_key(self, code, reportdate, key):
        if isinstance(reportdate, list):
            return self.data.loc[(
                slice(pd.Timestamp(reportdate[0]), pd.Timestamp(reportdate[-1])),
                code
            ), key]
        else:
            return self.data.loc[(pd.Timestamp(reportdate), code), key]
```

### 迁移后 (FQDataStruct/financial.py)

```python
from FQBase.FQDataStruct import FinancialData

class FinancialData:
    """财务指标数据结构"""

    def __init__(self, data: pd.DataFrame):
        self._data = data
        self.colunms_en = None
        self.colunms_cn = None
        self._init_columns()

    def _init_columns(self):
        """初始化中英文列名映射"""
        try:
            from FQBase.FQConfig.financial_mapping import FINANCIAL_INDICATORS
            self.colunms_en = list(FINANCIAL_INDICATORS.values())
            self.colunms_cn = list(FINANCIAL_INDICATORS.keys())
        except ImportError:
            pass

    def get_report_by_date(self, code: str, date):
        return self._data.loc[pd.Timestamp(date), code]

    def get_key(self, code, reportdate, key):
        if isinstance(reportdate, list):
            return self._data.loc[(
                slice(pd.Timestamp(reportdate[0]), pd.Timestamp(reportdate[-1])),
                code
            ), key]
        else:
            return self._data.loc[(pd.Timestamp(reportdate), code), key]

    def get_financial(self, code, start=None, end=None):
        """获取某只股票的财务数据"""
        pass
```

---

## 方法映射

| 原方法 | 迁移后 | 状态 |
|--------|--------|------|
| `__init__(data)` | `__init__(data: pd.DataFrame)` | ✅ |
| `data` | `_data` 属性 | ✅ |
| `colunms_en` | `colunms_en` | ✅ |
| `colunms_cn` | `colunms_cn` | ✅ |
| `get_report_by_date(code, date)` | `get_report_by_date(code, date)` | ✅ |
| `get_key(code, reportdate, key)` | `get_key(code, reportdate, key)` | ✅ |
| - | `get_financial(code, start, end)` | ✅ 新增 |
| - | `code` 属性 | ✅ 新增 |
| - | `date` 属性 | ✅ 新增 |

---

## 使用示例

### 原接口

```python
from FQData.QAData.QAFinancialStruct import QA_DataStruct_Financial

fin = QA_DataStruct_Financial(df)
eps = fin.get_key('000001', '2020-01-01', 'EPS')
```

### 新接口

```python
from FQBase.FQDataStruct import FinancialData

fin = FinancialData(df)
eps = fin.get_key('000001', '2020-01-01', 'EPS')
stock_fin = fin.get_financial('000001', start='2020-01-01', end='2024-12-31')
```

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **列名映射** | ✅ 使用 `FINANCIAL_INDICATORS` |
| **类型注解** | ✅ 已添加 |

---

## 相关文件

- [financial_mapping.md](./module-FQDataStruct-financial_mean.md) - 财务指标映射
- [financial.md](./module-FQDataStruct-financial.md) - 财务数据结构