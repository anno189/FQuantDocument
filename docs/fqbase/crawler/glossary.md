---
title: Crawler - 术语表
description: Crawler 术语定义与解释
tag:
  - fquant
  - fqbase
  - crawler

summary:
  purpose: glossary
---

# Crawler - 术语表

## 阅读路径

🟢 **新手**：README → glossary → quick-start → usage

## 概述

本文档定义了 Crawler 模块中使用的核心术语。

## 术语

### 无头浏览器 (Headless Browser)

**定义：** 没有可视化界面的浏览器，通过程序控制访问网页。

**示例：**

```python
browser = make_headless_browser()
browser.get('https://example.com')
```

### CSS选择器 (CSS Selector)

**定义：** 用于定位HTML元素的语法。

**示例：**

```python
items = PageParser.extract_by_css(html, 'div.item a[href]')
```

### Selenium

**定义：** 浏览器自动化框架，支持多种浏览器。

### BeautifulSoup

**定义：** Python HTML/XML 解析库。

### 轮询频率 (Poll Frequency)

**定义：** 检查元素出现的频率。

## 相关文档

- [README](./README.md)
- [快速入门](./quick-start.md)
- [核心概念](./concepts.md)
