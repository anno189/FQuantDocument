---
title: Crawler - 集成指南
description: Crawler 爬虫工具模块第三方集成指南
tag:
  - fqbase
  - crawler
---

# Crawler - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [API参考](./api.md) → [使用指南](./usage.md) → **[集成指南](./integrations.md)** |


## 概述

Crawler 爬虫工具模块的集成指南。

## Selenium 集成

### Chrome 配置

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')

browser = webdriver.Chrome(options=options)
```

### Firefox 配置

```python
from selenium import webdriver

browser = webdriver.Firefox()
```

## BeautifulSoup 集成

```python
from bs4 import BeautifulSoup
from FQBase.Crawler import make_headless_browser

browser = make_headless_browser()
browser.get(url)
html = browser.page_source

soup = BeautifulSoup(html, 'html.parser')
```

---

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
