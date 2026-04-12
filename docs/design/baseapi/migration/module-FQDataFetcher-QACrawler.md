# module-FQDataFetcher-QACrawler.md

# 模块迁移报告: FQDataFetcher-QACrawler

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAFetch.QACrawler | FQData.Fetcher |
| **原文件** | `_bak/server/FQData/FQData/QAFetch/QACrawler.py` | `FQData/Fetcher/crawler_fetcher.py` |
| **功能** | 融资融券数据爬虫 | 数据获取器 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **架构** | 独立函数 | 类方法 |
| **数据源** | 直接爬取 SSE/SZSE | 通过 crawler adapter |
| **错误处理** | 简单 pass | 统一 logger |

---

## 函数对比

### 原实现 (QACrawler.py)

```python
from FQData.QAUtil.QADate_trade import trade_date_sse
from FQData.QAUtil.QADate import QA_util_date_str2int

_sh_url = 'http://www.sse.com.cn/market/dealingdata/overview/margin/a/rzrqjygk{}.xls'
_sz_url = 'http://www.szse.cn/api/report/ShowReport?...'

def QA_fetch_get_sh_margin(date):
    """获取上海融资融券数据"""
    if date in trade_date_sse:
        data = pd.read_excel(_sh_url.format(QA_util_date_str2int(date)), 1)
        data = data.assign(date=date).assign(sse='sh')
        # 列名转换...
        return data
    else:
        pass

def QA_fetch_get_sz_margin(date):
    """获取深圳融资融券数据"""
    if date in trade_date_sse:
        data = pd.read_excel(_sz_url.format(date, random.random()))
        # 列名转换...
        return data
    else:
        pass

def QA_fetch_get_margin_all(date):
    """获取所有融资融券数据"""
    return pd.concat([
        QA_fetch_get_sh_margin(date),
        QA_fetch_get_sz_margin(date)
    ]).set_index('code')

def QA_fetch_zjlx(code=None):
    """获取资金流向"""
    pass
```

### 迁移后 (crawler_fetcher.py)

```python
class CrawlerFetcher(DataFetcherBase):
    """爬虫数据获取器"""

    def fetch_margin(self, date: str) -> Optional[pd.DataFrame]:
        """
        获取融资融券数据

        Args:
            date: 日期 (YYYY-MM-DD)

        Returns:
            DataFrame with margin data
        """
        if not self._connected or self._crawler is None:
            logger.warning("Crawler not connected")
            return None

        try:
            return self._crawler['margin_all'](date)
        except Exception as e:
            logger.error(f"Fetch margin failed: {e}")
            return None

    def fetch_zjlx(self, code: str) -> Optional[pd.DataFrame]:
        """
        获取资金流向数据

        Args:
            code: 股票代码

        Returns:
            DataFrame with zjlx data
        """
        if not self._connected or self._crawler is None:
            logger.warning("Crawler not connected")
            return None

        try:
            return self._crawler['zjlx'](code)
        except Exception as e:
            logger.error(f"Fetch zjlx failed: {e}")
            return None
```

---

## 方法映射

| 原函数 | 迁移后 | 状态 |
|--------|--------|------|
| `QA_fetch_get_sh_margin(date)` | `crawler_fetcher.fetch_margin(date)` | ✅ 封装 |
| `QA_fetch_get_sz_margin(date)` | 内部实现 | ✅ 封装 |
| `QA_fetch_get_margin_all(date)` | `crawler_fetcher.fetch_margin(date)` | ✅ 合并 |
| `QA_fetch_zjlx(code)` | `crawler_fetcher.fetch_zjlx(code)` | ✅ 封装 |
| - | `fetch_stock_day()` | ✅ 新增 |
| - | `fetch_stock_min()` | ✅ 新增 |
| - | `fetch_index_day()` | ✅ 新增 |
| - | `fetch_index_min()` | ✅ 新增 |
| - | `fetch_future_day()` | ✅ 新增 |
| - | `fetch_future_min()` | ✅ 新增 |
| - | `health_check()` | ✅ 新增 |

---

## 使用示例

### 原接口

```python
from FQData.QAFetch.QACrawler import (
    QA_fetch_get_sh_margin,
    QA_fetch_get_sz_margin,
    QA_fetch_get_margin_all,
    QA_fetch_zjlx,
)

sh_margin = QA_fetch_get_sh_margin('2023-06-21')
sz_margin = QA_fetch_get_sz_margin('2023-06-21')
all_margin = QA_fetch_get_margin_all('2023-06-21')
zjlx = QA_fetch_zjlx('000001')
```

### 新接口

```python
from FQData.Fetcher import get_crawler_fetcher

fetcher = get_crawler_fetcher()
margin = fetcher.fetch_margin('2023-06-21')
zjlx = fetcher.fetch_zjlx('000001')
```

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **融资融券功能** | ✅ 已封装 |
| **资金流向功能** | ✅ 已封装 |
| **SSE 数据源** | ✅ 通过 adapter |
| **SZSE 数据源** | ✅ 通过 adapter |
| **错误处理** | ✅ 统一 logger |

---

## 相关文件

- [crawler_fetcher.py](./module-FQDataFetcher-crawler_fetcher.md) - 爬虫获取器
- [datafetcher.md](./module-FQData-datafetcher.md) - 数据获取器基类