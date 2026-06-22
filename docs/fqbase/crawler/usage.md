---
title: Crawler - 使用指南
description: Crawler 详细使用指南
tag:
  - fquant
  - fqbase
  - crawler

summary:
  purpose: usage
---

# Crawler - 使用指南

## 阅读路径

🔵 **开发者**：README → api → usage → concepts → examples

## 概述

本指南详细说明如何在各种场景下使用 Crawler 模块。

## 基本用法

### 抓取静态网页

```python
from FQBase.Crawler import BaseCrawler

crawler = BaseCrawler(use_browser=False, delay=1.0)
html = crawler.fetch_url('https://example.com')
```

### 抓取动态网页

```python
from FQBase.Crawler import BaseCrawler

with BaseCrawler(use_browser=True) as crawler:
    html = crawler.fetch_url_with_browser('https://example.com')
```

## 常见用例

### 用例 1: 提取链接列表

```python
from FQBase.Crawler import BaseCrawler, PageParser

crawler = BaseCrawler(use_browser=False)
html = crawler.fetch_url('https://news.example.com')

links = PageParser.extract_links(html, base_url='https://news.example.com')
print(links[:10])
```

### 用例 2: 提取表格数据

```python
from FQBase.Crawler import BaseCrawler, PageParser

with BaseCrawler(use_browser=True) as crawler:
    html = crawler.fetch_url_with_browser('https://example.com/table')
    tables = PageParser.extract_tables(html)
    if tables:
        first_table = tables[0]
        for row in first_table:
            print(row)
```

### 用例 3: 使用代理

```python
from FQBase.Crawler import BaseCrawler

crawler = BaseCrawler(use_proxy='http://proxy.example.com:8080')
html = crawler.fetch_url('https://example.com')
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](../best-practices.md)
