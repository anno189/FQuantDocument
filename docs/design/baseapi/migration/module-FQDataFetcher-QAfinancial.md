# module-FQDataFetcher-QAfinancial.md

# 模块迁移报告: FQDataFetcher-QAfinancial

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAFetch.QAfinancial | FQData.Fetcher |
| **原文件** | `_bak/server/FQData/FQData/QAFetch/QAfinancial.py` | `FQData/Fetcher/financial_fetcher.py` |
| **功能** | 历史财务数据爬虫/解析 | 历史财务数据获取 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **爬虫类** | `QAHistoryFinancialCrawler` | `QAHistoryFinancialCrawler` |
| **读取器类** | `QAHistoryFinancialReader` | `QAHistoryFinancialReader` |
| **数据源** | pytdx | pytdx |
| **财务指标列表** | `financialmeans` | 已迁移到 `FINANCIAL_INDICATORS` |

---

## 类对比

### QAHistoryFinancialCrawler

```python
# 原实现
class QAHistoryFinancialCrawler(HistoryFinancialCrawler):
    def to_df(self, data):
        if len(data) == 0:
            return None
        ...

# 迁移后 - 完全一致
class QAHistoryFinancialCrawler(HistoryFinancialCrawler):
    def to_df(self, data) -> Optional[pd.DataFrame]:
        if len(data) == 0:
            return None
        ...
```

### QAHistoryFinancialReader

```python
# 原实现
class QAHistoryFinancialReader(HistoryFinancialReader):
    def get_df(self, data_file):
        crawler = QAHistoryFinancialCrawler()
        with open(data_file, 'rb') as df:
            data = crawler.parse(download_file=df)
        return crawler.to_df(data)

# 迁移后 - 添加类型注解
class QAHistoryFinancialReader(HistoryFinancialReader):
    def get_df(self, data_file: str) -> Optional[pd.DataFrame]:
        ...
```

---

## 函数对比

| 原函数 | 迁移后 | 状态 |
|--------|--------|------|
| `get_filename()` | `get_filename()` | ✅ |
| `get_md5()` | `get_md5()` | ✅ |
| `download_financialzip()` | `download_financialzip()` | ✅ |
| `download_financialzip_fromtdx()` | `download_financialzip_fromtdx()` | ✅ |
| `get_and_parse(filename)` | `get_and_parse(filename)` | ✅ |
| `parse_filelist(filelist)` | `parse_filelist(filelist)` | ✅ |
| `parse_all()` | `parse_all()` | ✅ |

---

## 使用示例

### 原接口

```python
from FQData.QAFetch.QAfinancial import (
    QAHistoryFinancialCrawler,
    QAHistoryFinancialReader,
    get_filename,
    get_md5,
    download_financialzip,
    download_financialzip_fromtdx,
    get_and_parse,
    parse_filelist,
    parse_all,
)

# 获取文件列表
files = get_filename()

# 下载财务数据
downloaded = download_financialzip()

# 解析文件
df = parse_all()
```

### 新接口

```python
from FQData.Fetcher import (
    QAHistoryFinancialCrawler,
    QAHistoryFinancialReader,
    get_filename,
    get_md5,
    download_financialzip,
    download_financialzip_fromtdx,
    get_and_parse,
    parse_filelist,
    parse_all,
)

# 获取文件列表
files = get_filename()

# 下载财务数据
downloaded = download_financialzip()

# 解析文件
df = parse_all()
```

---

## 依赖更新

| 原依赖 | 新依赖 |
|--------|--------|
| `FQData.QAUtil.QAFile.QA_util_file_md5` | `FQBase.FQUtil.file.calculate_file_md5` |
| `FQData.QASetting.QALocalize.qa_path, download_path` | `FQBase.FQUtil.file.get_download_path` |

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **API 兼容性** | ✅ 函数签名一致 |
| **类型注解** | ✅ 已添加 |
| **依赖更新** | ✅ 已更新为新模块 |

---

## 相关文件

- [financial_mapping.md](./module-FQDataStruct-financial_mean.md) - 财务指标映射
- [crawler_fetcher.md](./module-FQDataFetcher-QACrawler.md) - 爬虫获取器