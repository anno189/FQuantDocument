# module-FQDataFetcher-QAThs.md

# 模块迁移报告: FQDataFetcher-QAThs

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAFetch.QAThs | FQData.Fetcher / FQDataSource |
| **原文件** | `_bak/server/FQData/FQData/QAFetch/QAThs.py` | 通过 TdxFetcher / AkshareAdapter |
| **功能** | 同花顺数据获取 | 板块数据、股票日线 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **股票日线** | `QA_fetch_get_stock_day()` 同花顺接口 | `TdxFetcher.fetch_stock_day()` |
| **板块数据** | `QA_fetch_get_stock_block()` 同花顺接口 | `AkshareAdapter.get_stock_block()` |

---

## 函数对比

### 1. QA_fetch_get_stock_day_in_year

**原实现**:
```python
def QA_fetch_get_stock_day_in_year(code, year, if_fq='00'):
    url = 'http://d.10jqka.com.cn/v2/line/hs_%s/%s/%s.js' % (str(code), str(if_fq), str(year))
    try:
        for item in requests.get(url).text.split('"')[3].split(';'):
            data_.append(item.split(','))
        data = pd.DataFrame(data_, index=list(np.asarray(data_).T[0]), columns=[
            'date', 'open', 'high', 'low', 'close', 'volume', 'amount', 'factor'])
        return data.set_index('date')
    except:
        pass
```

**迁移后**: 使用 `TdxFetcher.fetch_stock_day()`

---

### 2. QA_fetch_get_stock_day

**原实现**:
```python
def QA_fetch_get_stock_day(code, start, end, if_fq='00'):
    start_year = int(str(start)[0:4])
    end_year = int(str(end)[0:4])
    data = QA_fetch_get_stock_day_in_year(code, start_year, if_fq)
    if start_year < end_year:
        for i2 in range(start_year + 1, end_year + 1):
            data = pd.concat([data, QA_fetch_get_stock_day_in_year(code, i2, if_fq)], axis=0)
    if data is None:
        return pd.DataFrame()
    else:
        return data[start:end]
```

**迁移后**:
```python
from FQData.Fetcher import get_tdx_fetcher

fetcher = get_tdx_fetcher()
fetcher.connect()
data = fetcher.fetch_stock_day(code='000001', start='2020-01-01', end='2024-12-31', frequence='day')
```

---

### 3. QA_fetch_get_stock_block

**原实现**:
```python
def QA_fetch_get_stock_block():
    url = 'http://data.yutiansut.com/ths_block.csv'
    try:
        return pd.read_csv(url).set_index('code', drop=False)
    except:
        return None
```

**迁移后**:
```python
from FQDataSource import AkshareAdapter

adapter = AkshareAdapter()
adapter.connect()
block_data = adapter.get_stock_block()
```

---

## 使用示例

### 原接口

```python
from FQData.QAFetch.QAThs import (
    QA_fetch_get_stock_day,
    QA_fetch_get_stock_block,
)

# 获取日线数据
day_data = QA_fetch_get_stock_day('000001', '2020-01-01', '2024-12-31', '01')

# 获取板块数据
block_data = QA_fetch_get_stock_block()
```

### 新接口

```python
from FQData.Fetcher import get_tdx_fetcher
from FQDataSource import AkshareAdapter

# 获取日线数据
fetcher = get_tdx_fetcher()
fetcher.connect()
day_data = fetcher.fetch_stock_day(code='000001', start='2020-01-01', end='2024-12-31')

# 获取板块数据
adapter = AkshareAdapter()
adapter.connect()
block_data = adapter.get_stock_block()
```

---

## 方法映射

| 原函数 | 迁移后 | 状态 |
|--------|--------|------|
| `QA_fetch_get_stock_day_in_year()` | `TdxFetcher.fetch_stock_day()` | ✅ |
| `QA_fetch_get_stock_day()` | `TdxFetcher.fetch_stock_day()` | ✅ |
| `QA_fetch_get_stock_block()` | `AkshareAdapter.get_stock_block()` | ✅ |
| `QA_fetch_get_stock_highlimit_reason()` | - | 🔄 待实现 |

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **股票日线获取** | ✅ 通过 TdxFetcher |
| **板块数据获取** | ✅ 通过 AkshareAdapter |
| **涨停原因** | 🔄 待实现 |

---

## 相关文件

- [tdx_fetcher.md](./module-FQDataFetcher-tdx_fetcher.md) - 通达信获取器
- [akshare_adapter.md](./module-FQDataSource-akshare_adapter.md) - AkShare 适配器