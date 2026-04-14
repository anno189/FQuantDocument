---
title: Crawler - 故障排查
description: Crawler 爬虫工具模块常见问题与解决方案
tag:
  - fqbase
  - crawler
---

# Crawler - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [故障排查](./troubleshooting.md) |


## 概述

Crawler 爬虫工具模块的常见问题和解决方案。

## 常见问题

### 问题 1: 浏览器未找到

**症状：** `WebDriverException: message`

**解决方案：**

1. 安装浏览器
2. 使用 webdriver-manager 自动管理

```python
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver

driver = webdriver.Chrome(ChromeDriverManager().install())
```

---

### 问题 2: 页面加载超时

**症状：** `TimeoutException`

**解决方案：**

```python
browser.set_page_load_timeout(30)
browser.implicitly_wait(10)
```

---

### 问题 3: 元素未找到

**症状：** `NoSuchElementException`

**解决方案：**

1. 等待元素加载
2. 使用显式等待

```python
from selenium.webdriver.support.ui import WebDriverWait

wait = WebDriverWait(browser, 10)
element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '.content')))
```

---

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
