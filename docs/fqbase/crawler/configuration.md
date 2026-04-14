---
title: Crawler - 配置指南
description: Crawler 爬虫工具模块配置选项详解
tag:
  - fqbase
  - crawler
---

# Crawler - 配置指南

## 概述

Crawler 爬虫工具模块的配置选项。

## 配置选项

### 浏览器超时

```python
from FQBase.Crawler import TIMEOUT, POLL_FREQUENCY

print(f"默认超时: {TIMEOUT}秒")
print(f"轮询频率: {POLL_FREQUENCY}秒")
```

### Selenium 配置

```python
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
```

---

## 相关文档

- [API参考](./api.md)
