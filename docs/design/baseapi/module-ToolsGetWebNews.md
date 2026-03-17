# ToolsGetWebNews 模块文档

## 模块概述

ToolsGetWebNews 模块提供网络新闻爬虫功能，用于从各大财经网站获取最新的财经新闻、公告和资讯信息。该模块使用Selenium WebDriver进行浏览器自动化操作。

## 核心功能

- **新闻爬虫**: 从东方财富、新浪财经等网站获取财经新闻
- **公告获取**: 获取上市公司公告信息
- **资讯收集**: 收集市场热点资讯

## 依赖模块

- selenium
- Parameter
- ToolsSaveData

## 函数列表

| 函数名 | 功能描述 |
|--------|----------|
| getEastmoneyNews | 获取东方财富网新闻 |
| getSinaFinanceNews | 获取新浪财经新闻 |
| getStockAnnouncement | 获取股票公告 |
| saveNewsToDB | 保存新闻到数据库 |

---

## 函数详细说明

### getEastmoneyNews()

从东方财富网获取最新财经新闻。

**返回值:**
- `list`: 新闻列表，每个元素为包含标题、链接、时间等信息的字典

**功能说明:**
- 使用Selenium WebDriver打开东方财富网
- 滚动页面加载更多新闻
- 解析新闻标题、链接、发布时间等信息
- 返回新闻列表

**代码示例:**
```python
from FQMarket.FQUtil.ToolsGetWebNews import getEastmoneyNews

# 获取东方财富新闻
news_list = getEastmoneyNews()
for news in news_list:
    print(news['title'], news['url'])
```

### getSinaFinanceNews()

从新浪财经获取最新财经新闻。

**返回值:**
- `list`: 新闻列表，每个元素为包含标题、链接、时间等信息的字典

**功能说明:**
- 使用Selenium WebDriver打开新浪财经
- 获取财经新闻板块内容
- 解析新闻标题、链接、发布时间等信息
- 返回新闻列表

**代码示例:**
```python
from FQMarket.FQUtil.ToolsGetWebNews import getSinaFinanceNews

# 获取新浪财经新闻
news_list = getSinaFinanceNews()
for news in news_list:
    print(news['title'], news['url'])
```

### getStockAnnouncement(code=None)

获取指定股票的公告信息。

**参数:**
- `code` (str, optional): 股票代码，默认为None获取全部

**返回值:**
- `list`: 公告列表，每个元素为包含标题、链接、时间等信息的字典

**功能说明:**
- 从交易所网站获取股票公告
- 支持单只股票或全部股票公告获取
- 解析公告标题、类型、发布时间等信息

**代码示例:**
```python
from FQMarket.FQUtil.ToolsGetWebNews import getStockAnnouncement

# 获取某只股票的公告
announcements = getStockAnnouncement(code='000001')
for ann in announcements:
    print(ann['title'], ann['time'])
```

### saveNewsToDB(news_list, source='eastmoney')

将新闻列表保存到MongoDB数据库。

**参数:**
- `news_list` (list): 新闻列表
- `source` (str, optional): 新闻来源，默认为'eastmoney'

**返回值:**
- `int`: 保存的新闻数量

**功能说明:**
- 将新闻数据保存到web_news集合
- 自动去重，避免重复保存
- 记录新闻来源和获取时间

**代码示例:**
```python
from FQMarket.FQUtil.ToolsGetWebNews import getEastmoneyNews, saveNewsToDB

# 获取新闻并保存
news_list = getEastmoneyNews()
count = saveNewsToDB(news_list, source='eastmoney')
print(f'保存了 {count} 条新闻')
```
