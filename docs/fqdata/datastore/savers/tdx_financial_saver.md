# 财务报表数据持久化 (tdx_financial_saver)

提供从通达信下载并保存历史财务数据的功能。

## 模块路径

```
FQData.DataStore.savers.tdx_financial_saver
```

## 核心功能

| 功能 | 说明 |
|------|------|
| 文件下载 | 从通达信官网下载财务报表ZIP文件 |
| 数据解析 | 解析ZIP文件并转换为DataFrame |
| 数据保存 | 保存到MongoDB |
| 状态查询 | 查询下载状态 |
| 单股保存 | 保存单个股票的财务数据 |

## 主要函数

### download_financialzip

```python
def download_financialzip() -> List[str]
```

下载财务报表压缩包。

从通达信官网下载财务报表数据ZIP文件。

**返回：** 下载/更新的文件列表

---

### download_financialzip_fromtdx

```python
def download_financialzip_fromtdx() -> List[str]
```

从通达信下载财务报表。

使用pytdx内置的crawler下载。

**返回：** 下载/更新的文件列表

---

### save_financial_files

```python
def save_financial_files(fromtdx: bool = False) -> bool
```

保存财务报表数据。

算法：
1. 下载/更新ZIP文件
2. 创建唯一索引 (code, report_date)
3. 解析并去重
4. 批量更新/插入数据

**参数：**
- `fromtdx`: 是否使用通达信crawler下载，默认False使用requests

**返回：** 保存是否成功

**示例：**

```python
from FQData import save_financial_files

result = save_financial_files()
print(f"保存结果: {result}")
```

---

### save_financial_one

```python
def save_financial_one(code: str) -> bool
```

保存单个股票的财务数据。

**参数：**
- `code`: 股票代码

**返回：** 保存是否成功

**示例：**

```python
from FQData import save_financial_one

result = save_financial_one('600000')
print(f"保存结果: {result}")
```

---

### get_financial_download_status

```python
def get_financial_download_status() -> Dict[str, Any]
```

获取财务数据下载状态。

**返回：** 包含 downloaded, total, missing 信息

**示例：**

```python
from FQData import get_financial_download_status

status = get_financial_download_status()
print(f"总文件数: {status['total']}")
print(f"已下载: {status['downloaded']}")
print(f"缺失: {status['missing']}")
```

---

## 数据源

- [pytdx HistoryFinancialCrawler](https://github.com/rainx/pytdx)

## 相关文档

- [DataStore 模块](../README.md)
- [Savers 模块索引](README.md)
