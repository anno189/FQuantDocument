---
title: Crawler - 核心概念
description: 深入理解 Crawler 的核心概念
tag:
  - fquant
  - fqbase
  - crawler

summary:
  purpose: concepts
  core_concepts:
    - headless_browser
    - web_scraping
    - html_parsing
    - browser_pool
---

# Crawler - 核心概念

## 阅读路径

🟢🔵 **新手+开发者**：README → quick-start → concepts → api → usage

## 概述

Crawler 模块包含多个核心概念，理解这些概念对于正确使用爬虫至关重要。

## 概念1：无头浏览器 (Headless Browser)

### 概念解释

无头浏览器是没有可视化界面的浏览器，用于自动化测试和网页抓取。

### 代码示例

```python
from FQBase.Crawler import make_headless_browser

browser = make_headless_browser()
browser.get('https://example.com')
html = browser.page_source
browser.quit()
```

## 概念2：网页抓取 (Web Scraping)

### 概念解释

通过 HTTP 请求或浏览器自动化获取网页内容。

### 代码示例

```python
from FQBase.Crawler import BaseCrawler

crawler = BaseCrawler()

# 静态网页
html = crawler.fetch_url('http://example.com')

# 动态网页（JavaScript渲染）
html = crawler.fetch_url_with_browser('http://example.com')
```

## 概念3：HTML 解析 (HTML Parsing)

### 概念解释

从 HTML 内容中提取所需数据。

### 代码示例

```python
from FQBase.Crawler import PageParser

# 正则提取
emails = PageParser.extract_by_regex(html, r'[\w.-]+@[\w.-]+\.\w+')

# CSS选择器提取
items = PageParser.extract_by_css(html, 'div.item', ['title', 'href'])

# 表格提取
tables = PageParser.extract_tables(html)
```

## 概念4：浏览器池 (Browser Pool)

### 概念解释

复用浏览器实例，避免频繁创建销毁，提高性能。

### 代码示例

```python
from FQBase.Crawler import BrowserPool

pool = BrowserPool()
browser = pool.get_browser()
# 使用浏览器...
# 复用而非关闭
```

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [API参考](./api.md)
