---
title: Crawler - 使用指南
description: Crawler 爬虫工具模块详细使用指南
tag:
  - fqbase
  - crawler
---

# Crawler - 使用指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → **[使用指南](./usage.md)** |


## 概述

详细介绍如何使用 Crawler 爬虫工具模块。

## 基本用法

### 使用无头浏览器

```python
from FQBase.Crawler import make_headless_browser

browser = make_headless_browser()
browser.get('https://example.com')
html = browser.page_source
browser.quit()
```

### 使用 BaseCrawler

```python
from FQBase.Crawler import BaseCrawler

with BaseCrawler(use_browser=True) as crawler:
    html = crawler.fetch_url_with_browser('https://example.com')
```

### 页面解析

```python
from FQBase.Crawler import PageParser

# 提取链接
links = PageParser.extract_links(html)

# 提取数据
data = PageParser.extract_data(html, '.content')
```

## 常见用例

### 用例 1: 抓取动态网页

```python
from FQBase.Crawler import BaseCrawler, PageParser

with BaseCrawler(use_browser=True) as crawler:
    html = crawler.fetch_url_with_browser('https://example.com')
    links = PageParser.extract_links(html)
    print(links)
```

### 用例 2: 提取表格数据

```python
from FQBase.Crawler import PageParser

table = PageParser.extract_table(html, 'table.data')
for row in table:
    print(row)
```

---

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
