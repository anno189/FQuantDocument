---
title: Crawler - 核心概念
description: 深入理解 Crawler 爬虫工具模块的核心概念
tag:
  - fqbase
  - crawler
---

# Crawler - 核心概念

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [术语表](./glossary.md) → **[核心概念](./concepts.md)** → [技术架构](./architecture.md) |


## 概述

深入理解 Crawler 爬虫工具模块的核心概念。

## 概念 1: 无头浏览器

### 概念解释

无头浏览器是没有可视化界面的浏览器，通过程序控制进行网页操作。

### 原理

1. 使用 Selenium WebDriver 控制浏览器
2. 支持 Chrome、Firefox 等主流浏览器
3. 可执行 JavaScript

### 代码示例

```python
from FQBase.Crawler import make_headless_browser

browser = make_headless_browser()
browser.get('https://example.com')
```

## 概念 2: 浏览器池

### 概念解释

BrowserPool 管理多个浏览器实例，提高效率。

### 原理

1. 单例模式确保全局唯一
2. 复用浏览器实例
3. 自动管理生命周期

### 代码示例

```python
from FQBase.Crawler import BrowserPool

pool = BrowserPool()
browser = pool.get_browser()
```

## 概念 3: 页面解析

### 概念解释

PageParser 提供网页内容解析功能。

### 原理

1. 使用 BeautifulSoup 解析 HTML
2. 提供链接提取、数据提取等方法

### 代码示例

```python
from FQBase.Crawler import PageParser

links = PageParser.extract_links(html)
data = PageParser.extract_data(html, selector)
```

---

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [术语表](./glossary.md)
- [使用指南](./usage.md)
