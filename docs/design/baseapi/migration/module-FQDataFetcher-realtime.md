# module-FQDataFetcher-realtime.md

# 模块迁移报告: FQDataFetcher-realtime

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAFetch.realtime | FQData.Fetcher |
| **原文件** | `_bak/server/FQData/FQData/QAFetch/realtime.py` | `FQData/Fetcher/tdx_fetcher.py` |
| **功能** | 当日实时行情获取 | 通达信数据获取器 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **架构** | 单线程循环获取 | `TdxFetcher.fetch_realtime()` |
| **最优IP选择** | `select_best_ip()` | 内部处理 |
| **返回格式** | `'pd'` 或 `'QAD'` | DataFrame |

---

## 函数对比

### 原实现 (realtime.py)

```python
from FQDATA.QAFetch.QATdx import select_best_ip, QA_fetch_get_stock_day, QA_fetch_get_stock_list
from FQDATA.QAData.QADataStruct import QA_DataStruct_Stock_day

def get_today_all(output='pd'):
    """获取今日所有股票行情"""
    data = []
    today = str(datetime.date.today())
    codes = QA_fetch_get_stock_list('stock').code.tolist()
    bestip = select_best_ip()['stock']

    for code in codes:
        try:
            l = QA_fetch_get_stock_day(code, today, today, '00', ip=bestip)
        except Exception as e:
            bestip = select_best_ip()['stock']
            l = QA_fetch_get_stock_day(code, today, today, '00', ip=bestip)
        if l is not None:
            data.append(l)

    res = pd.concat(data)
    if output in ['pd']:
        return res
    elif output in ['QAD']:
        return QA_DataStruct_Stock_day(res.set_index(['date', 'code'], drop=False))
```

### 迁移后 (tdx_fetcher.py)

```python
class TdxFetcher(DataFetcherBase):
    """通达信数据获取器"""

    def fetch_realtime(self, code: Union[str, List[str]]) -> Optional[pd.DataFrame]:
        """获取实时行情"""
        if not self._connected:
            return self._fetch_realtime_directly(code)

        try:
            return self._datasource.get_realtime(code)
        except Exception as e:
            logger.warning(f"fetch_realtime via FQDataSource failed: {e}")
            return self._fetch_realtime_directly(code)

    def _fetch_realtime_directly(self, code):
        """直接从 QATdx 获取实时数据"""
        from FQData.QAFetch.QATdx import QATdx
        tdx = QATdx()
        return tdx.get_realtime(code)
```

---

## 使用示例

### 原接口

```python
from FQData.QAFetch.realtime import get_today_all

today_data = get_today_all(output='pd')
today_struct = get_today_all(output='QAD')
```

### 新接口

```python
from FQData.Fetcher import get_tdx_fetcher

fetcher = get_tdx_fetcher()
fetcher.connect()

# 获取单只股票实时行情
realtime = fetcher.fetch_realtime('000001')

# 获取多只股票实时行情
realtime_list = fetcher.fetch_realtime(['000001', '000002'])

# 获取所有股票实时行情
codes = fetcher.fetch_stock_list('stock')['code'].tolist()
all_realtime = fetcher.fetch_realtime(codes)
```

---

## 方法映射

| 原函数 | 迁移后 | 状态 |
|--------|--------|------|
| `get_today_all(output='pd')` | `TdxFetcher.fetch_realtime(code)` | ✅ 封装 |
| `select_best_ip()` | 内部处理 | ✅ 封装 |
| `QA_fetch_get_stock_day()` | `TdxFetcher.fetch_stock_day()` | ✅ 封装 |
| `QA_fetch_get_stock_list()` | `TdxFetcher.fetch_stock_list()` | ✅ 封装 |

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **架构改进** | ✅ 单线程 → 统一获取器 |
| **错误处理** | ✅ 统一 logger |

---

## 相关文件

- [tdx_fetcher.py](./module-FQDataFetcher-tdx_fetcher.md) - 通达信获取器
- [base.py](./module-FQDataFetcher-base.md) - 获取器基类