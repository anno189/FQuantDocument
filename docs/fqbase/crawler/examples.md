---
title: Crawler - 案例库
description: Crawler 爬虫工具模块实际应用场景与示例
tag:
  - fqbase
  - crawler
---

# Crawler - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [使用指南](./usage.md) → **[案例库](./examples.md)** |


## 概述

Crawler 爬虫工具模块的实际应用场景。

## 基础示例

### 示例 1：抓取网页内容

```python
from FQBase.Crawler import BaseCrawler, PageParser

with BaseCrawler(use_browser=True) as crawler:
    html = crawler.fetch_url_with_browser('https://example.com')
    links = PageParser.extract_links(html)
    print(f"找到 {len(links)} 个链接")
```

### 示例 2：提取数据

```python
from FQBase.Crawler import PageParser

html = '<div class="content">Hello World</div>'
data = PageParser.extract_data(html, '.content')
print(data)
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
