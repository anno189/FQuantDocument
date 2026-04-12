# module-FQDataFetcher-QAHexun.md

# 模块迁移报告: FQDataFetcher-QAHexun

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAFetch.QAHexun | FQDataSource |
| **原文件** | `_bak/server/FQData/FQData/QAFetch/QAHexun.py` | `FQDataSource/akshare_adapter.py` |
| **功能** | CHIBOR 银行间拆借利率获取 | 利率数据适配器 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **数据源** | 和讯财经爬虫 | AkShare |
| **频率参数** | `'1D'`, `'1W'`, `'1M'` 等 | `'day'` 等 |
| **headers** | 手动设置 Hexun headers | AkShare 封装 |

---

## 函数对比

### 原实现 (QAHexun.py)

```python
from FQData.QAFetch.base import headers
from copy import deepcopy

headers_hexun = deepcopy(headers)
headers_hexun['Referer'] = 'http://data.bank.hexun.com/'
headers_hexun['Host'] = 'data.bank.hexun.com'
headers_hexun['X-Requested-With'] = 'XMLHttpRequest'

chibor_url = 'http://data.bank.hexun.com/dataprovider/BankOfferedrateFlash.ashx?...'

def QA_fetch_get_chibor(frequence='1D'):
    if frequence == '1D':
        d = '1000000000000000'
    elif frequence == '1W':
        d = '0100000000000000'
    # ... 其他频率

    res = requests.get(chibor_url.format(d, int(time.time()*1000)-1), headers=headers_hexun).text
    data = [{'date':d[12:22],'1D':float(d[31:35])} for d in res.split('\r\n') if d[1:5] == 'date']
    return pd.DataFrame(data).set_index('date')
```

### 迁移后 (akshare_adapter.py)

```python
class CHIBORAdapter(AkShareAdapter):
    """银行间拆借利率适配器 (基于 AkShare)"""

    def get_chibor(
        self,
        frequence: str = "day"
    ) -> Optional[pd.DataFrame]:
        """获取银行间拆借利率"""
        if not self._connected:
            return None
        try:
            if frequence == "day":
                df = self._ak.interest_rate_chibor()
            else:
                df = self._ak.interest_rate_chibor_hist()
            return df
        except Exception:
            return None
```

---

## 频率映射

| 原参数 | 新参数 | 说明 |
|--------|--------|------|
| `'1D'` | `'day'` | 隔夜 |
| `'1W'` | - | 一周 |
| `'2W'` | - | 两周 |
| `'3W'` | - | 三周 |
| `'1M'` | - | 一个月 |
| `'2M'` | - | 两个月 |
| `'3M'` | - | 三个月 |
| ... | - | 其他期限 |

---

## 使用示例

### 原接口

```python
from FQData.QAFetch.QAHexun import QA_fetch_get_chibor

chibor_data = QA_fetch_get_chibor('1D')
```

### 新接口

```python
from FQDataSource import AkshareAdapter

adapter = AkshareAdapter()
adapter.connect()
chibor_data = adapter.get_chibor('day')
```

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **数据源** | ✅ AkShare |
| **封装类** | ✅ CHIBORAdapter |

---

## 相关文件

- [akshare_adapter.md](./module-FQDataSource-akshare_adapter.md) - AkShare 适配器
- [CHIBORAdapter](./module-FQDataFetcher-QACrawler.md) - 爬虫获取器