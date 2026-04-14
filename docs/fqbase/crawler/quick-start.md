---
title: Crawler - 快速入门
description: 5分钟快速上手 Crawler 爬虫工具模块
tag:
  - fqbase
  - crawler

summary:
  purpose: quick-start
  complexity: medium
---

# Crawler - 快速入门

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → **[快速入门](./quick-start.md)** → [速查表](./cheatsheet.md) → [使用指南](./usage.md) |


## 概述

5分钟快速上手 Crawler 爬虫工具模块。

## 前置要求

- Python 3.8+
- Selenium
- Chrome/Firefox 浏览器

## 安装

```bash
pip install selenium webdriver-manager
```

## 5分钟上手

### Step 1: 导入模块

```python
from FQBase.Crawler import BaseCrawler, PageParser
```

### Step 2: 创建爬虫实例

```python
with BaseCrawler(use_browser=True) as crawler:
    html = crawler.fetch_url_with_browser('https://example.com')
```

### Step 3: 解析页面

```python
links = PageParser.extract_links(html)
print(links)
```

### Step 4: 完成！

## ⚠️ 常见陷阱

1. **陷阱 1：浏览器未安装**
   - ❌ 错误：直接运行代码
   - ✅ 正确：安装 Chrome/Firefox 浏览器

2. **陷阱 2：忘记关闭浏览器**
   - ❌ 错误：不使用上下文管理器
   - ✅ 正确：使用 `with` 语句

## 下一步

- 学习 [核心概念](./concepts.md)
- 查看 [使用指南](./usage.md)

## 相关文档

- [README](./README.md)
- [核心概念](./concepts.md)
- [使用指南](./usage.md)
