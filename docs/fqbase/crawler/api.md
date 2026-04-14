---
title: Crawler - API参考
description: Crawler 爬虫工具模块 API 参考文档
tag:
  - fqbase
  - crawler

summary:
  purpose: api-reference
  core_classes:
    - BrowserPool
    - BaseCrawler
    - PageParser
  core_functions:
    - make_headless_browser
    - make_headless_browser_with_auto_save_path
---

# Crawler - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[API参考](./api.md)** → [使用指南](./usage.md) |


## 常量

| 常量 | 类型 | 说明 |
|------|------|------|
| TIMEOUT | int | 默认超时时间（秒） |
| POLL_FREQUENCY | float | 默认轮询频率（秒） |

---

## 函数

### make_headless_browser

```python
from FQBase.Crawler import make_headless_browser

browser = make_headless_browser() -> webdriver
```

**描述：** 创建无头浏览器

**返回：** Selenium WebDriver 实例

**示例：**

```python
browser = make_headless_browser()
browser.get('https://example.com')
browser.quit()
```

---

### make_headless_browser_with_auto_save_path

```python
from FQBase.Crawler import make_headless_browser_with_auto_save_path

browser = make_headless_browser_with_auto_save_path(save_path: str) -> webdriver
```

**描述：** 创建带自定义下载路径的无头浏览器

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| save_path | str | 是 | 下载保存路径 |

**返回：** Selenium WebDriver 实例

---

## 类

### BrowserPool

**描述：** 浏览器池（单例模式）

```python
from FQBase.Crawler import BrowserPool

pool = BrowserPool()
```

#### 方法

##### get_browser

```python
browser = pool.get_browser() -> webdriver
```

**描述：** 获取浏览器实例

##### release_browser

```python
pool.release_browser(browser: webdriver)
```

**描述：** 释放浏览器实例

---

### BaseCrawler

**描述：** 基础爬虫类

```python
from FQBase.Crawler import BaseCrawler

with BaseCrawler(use_browser=True) as crawler:
    # 爬取网页
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| use_browser | bool | 否 | False | 是否使用浏览器 |

#### 方法

##### fetch_url_with_browser

```python
html = crawler.fetch_url_with_browser(url: str) -> str
```

**描述：** 使用浏览器获取网页内容

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| url | str | 是 | 网页 URL |

**返回：** HTML 内容

##### fetch_url

```python
html = crawler.fetch_url(url: str) -> str
```

**描述：** 获取网页内容（不使用浏览器）

---

### PageParser

**描述：** 页面解析工具类

```python
from FQBase.Crawler import PageParser
```

#### 静态方法

##### extract_links

```python
links = PageParser.extract_links(html: str) -> List[str]
```

**描述：** 提取页面中的所有链接

##### extract_data

```python
data = PageParser.extract_data(html: str, selector: str) -> List[str]
```

**描述：** 使用 CSS 选择器提取数据

##### extract_table

```python
table_data = PageParser.extract_table(html: str, selector: str = None) -> List[Dict]
```

**描述：** 提取表格数据

---

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
