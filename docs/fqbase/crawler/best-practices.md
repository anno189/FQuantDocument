---
title: Crawler - 最佳实践
description: Crawler 爬虫工具模块最佳实践与建议
tag:
  - fqbase
  - crawler
---

# Crawler - 最佳实践

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [API参考](./api.md) → [使用指南](./usage.md) → **[最佳实践](./best-practices.md)** |


## 概述

使用 Crawler 爬虫工具模块的最佳实践。

## 最佳实践

### 1. 使用上下文管理器

```python
# 好：自动管理浏览器生命周期
with BaseCrawler(use_browser=True) as crawler:
    html = crawler.fetch_url_with_browser(url)

# 差：忘记关闭浏览器
crawler = BaseCrawler(use_browser=True)
html = crawler.fetch_url_with_browser(url)
```

### 2. 设置合理超时

```python
from FQBase.Crawler import TIMEOUT

browser = make_headless_browser()
browser.set_page_load_timeout(TIMEOUT)
```

### 3. 复用浏览器池

```python
from FQBase.Crawler import BrowserPool

pool = BrowserPool()
browser = pool.get_browser()
# 使用浏览器
pool.release_browser(browser)
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
