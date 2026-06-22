---
title: Crawler - 快速入门
description: 5分钟快速上手 Crawler 模块
tag:
  - fquant
  - fqbase
  - crawler

summary:
  purpose: quick-start
  complexity: low
---

# Crawler - 快速入门

## 阅读路径

🟢 **新手入门**：README → quick-start → examples → concepts

## 概述

本快速入门指南将帮助您在 5 分钟内理解 Crawler 模块并开始使用。

## 前置要求

- Python 3.8+
- ChromeDriver（用于 Selenium 爬虫）
- selenium、requests、beautifulsoup4 库

## 5分钟上手

### Step 1: 安装依赖

```bash
pip install selenium requests beautifulsoup4
brew install chromedriver  # macOS
```

### Step 2: 使用 requests 抓取静态网页

```python
from FQBase.Crawler import BaseCrawler

crawler = BaseCrawler(use_browser=False, delay=1.0)
html = crawler.fetch_url('https://example.com')
print(html[:200])
```

### Step 3: 使用 Selenium 抓取动态网页

```python
from FQBase.Crawler import BaseCrawler

with BaseCrawler(use_browser=True) as crawler:
    html = crawler.fetch_url_with_browser('https://example.com')
    print(html[:200])
```

### Step 4: 解析 HTML 内容

```python
from FQBase.Crawler import PageParser

html = "<div class='item'><a href='/link'>Title</a></div>"
items = PageParser.extract_by_css(html, 'div.item', ['href'])
print(items)  # [{'href': '/link'}]
```

## ⚠️ 常见陷阱

1. **未关闭浏览器**
   - ❌ 错误做法：不使用 with 语句导致浏览器资源泄漏
   - ✅ 正确做法：使用 `with BaseCrawler(use_browser=True) as crawler:`

2. **请求过于频繁**
   - ❌ 错误做法：`delay=0` 导致被封禁
   - ✅ 正确做法：设置合理的 `delay=1.0` 或更大

3. **ChromeDriver 路径错误**
   - ❌ 错误做法：默认路径不存在
   - ✅ 正确做法：设置环境变量 `CHROME_DRIVER_PATH`

## 下一步

- 学习 [核心概念](./concepts.md)
- 阅读 [API参考](./api.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [API参考](./api.md)
- [核心概念](./concepts.md)
