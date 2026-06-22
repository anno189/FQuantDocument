---
title: Crawler - API参考
description: Crawler API 参考文档
tag:
  - fquant
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

🔵 **开发者**：README → api → usage → concepts → examples

## 常量

### TIMEOUT

**位置：** `Crawler/browser.py#L35`

```python
from FQBase.Crawler import TIMEOUT

print(TIMEOUT)  # 90
```

**类型：** `int`
**描述：** 默认超时时间（秒）

### POLL_FREQUENCY

**位置：** `Crawler/browser.py#L36`

```python
from FQBase.Crawler import POLL_FREQUENCY

print(POLL_FREQUENCY)  # 0.2
```

**类型：** `float`
**描述：** 默认轮询频率（秒）

---

## 类

### BrowserPool

**位置：** `Crawler/browser.py#L71`

**描述：** 浏览器池（单例模式），复用浏览器实例

```python
from FQBase.Crawler import BrowserPool

pool = BrowserPool()
browser = pool.get_browser()
```

#### 方法

##### get_browser

```python
browser = pool.get_browser()
```

**返回：** `webdriver.Chrome` - 浏览器实例

##### close_all

```python
pool.close_all()
```

**描述：** 关闭所有浏览器实例

---

### BaseCrawler

**位置：** `Crawler/browser.py#L111`

**描述：** 基础爬虫类，封装 Selenium 和 requests

```python
from FQBase.Crawler import BaseCrawler

with BaseCrawler(use_browser=True) as crawler:
    html = crawler.fetch_url_with_browser('https://example.com')
```

#### 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| timeout | int | 否 | 90 | 超时时间（秒） |
| use_browser | bool | 否 | False | 是否使用 Selenium 浏览器 |
| use_proxy | str | 否 | None | 代理地址 |
| headers | Dict | 否 | None | 自定义请求头 |
| delay | float | 否 | 1.0 | 请求间隔（秒） |

#### 方法

##### fetch_url

```python
html = crawler.fetch_url(url, method='GET', params=None, data=None, headers=None, encoding='utf-8')
```

**位置：** `Crawler/browser.py#L175`

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| url | str | 是 | - | 目标URL |
| method | str | 否 | GET | 请求方法 GET/POST |
| params | Dict | 否 | None | URL参数 |
| data | Dict | 否 | None | POST数据 |
| headers | Dict | 否 | None | 自定义请求头 |
| encoding | str | 否 | utf-8 | 响应编码 |

**返回：** `str` - 页面HTML内容

##### fetch_url_with_browser

```python
html = crawler.fetch_url_with_browser(url, wait_for=None)
```

**位置：** `Crawler/browser.py#L243`

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| url | str | 是 | - | 目标URL |
| wait_for | str | 否 | None | 等待元素加载的选择器 |

**返回：** `str` - 页面HTML内容

##### wait_and_click

```python
result = crawler.wait_and_click(selector, by=By.CSS_SELECTOR, timeout=None, index=0)
```

**位置：** `Crawler/browser.py#L270`

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| selector | str | 是 | - | 选择器 |
| by | str | 否 | By.CSS_SELECTOR | 选择器类型 |
| timeout | int | 否 | None | 超时时间 |
| index | int | 否 | 0 | 元素索引 |

**返回：** `bool` - 是否成功

##### get_element_text

```python
text = crawler.get_element_text(selector, by=By.CSS_SELECTOR, timeout=None, default='')
```

**位置：** `Crawler/browser.py#L306`

**返回：** `str` - 元素文本

##### scroll_to_element

```python
result = crawler.scroll_to_element(selector, by=By.CSS_SELECTOR)
```

**位置：** `Crawler/browser.py#L338`

**返回：** `bool` - 是否成功

##### close

```python
crawler.close()
```

**位置：** `Crawler/browser.py#L359`

**描述：** 关闭浏览器

---

### PageParser

**位置：** `Crawler/browser.py#L378`

**描述：** 页面解析工具类

```python
from FQBase.Crawler import PageParser

items = PageParser.extract_by_css(html, 'div.item', ['title', 'href'])
```

#### 静态方法

##### extract_by_regex

```python
results = PageParser.extract_by_regex(html, pattern, group=0, flags=0)
```

**位置：** `Crawler/browser.py#L390`

##### extract_by_css

```python
results = PageParser.extract_by_css(html, selector, attrs=None)
```

**位置：** `Crawler/browser.py#L413`

##### extract_tables

```python
tables = PageParser.extract_tables(html, attrs=None)
```

**位置：** `Crawler/browser.py#L442`

##### extract_json

```python
value = PageParser.extract_json(text, keys)
```

**位置：** `Crawler/browser.py#L474`

##### clean_html

```python
text = PageParser.clean_html(raw_html)
```

**位置：** `Crawler/browser.py#L503`

##### extract_links

```python
links = PageParser.extract_links(html, base_url=None, pattern=None)
```

**位置：** `Crawler/browser.py#L519`

##### extract_images

```python
images = PageParser.extract_images(html, base_url=None)
```

**位置：** `Crawler/browser.py#L549`

---

## 函数

### make_headless_browser

**位置：** `Crawler/browser.py#L39`

```python
from FQBase.Crawler import make_headless_browser

browser = make_headless_browser(custom_options={'headless': True})
```

**描述：** 创建无头 Chrome 浏览器

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| custom_options | Dict | 否 | None | 自定义选项 |

**返回：** `webdriver.Chrome`

---

### make_headless_browser_with_auto_save_path

**位置：** `Crawler/browser.py#L574`

```python
from FQBase.Crawler import make_headless_browser_with_auto_save_path

browser = make_headless_browser_with_auto_save_path('/tmp/downloads', 'application/pdf')
```

**描述：** 创建带自定义下载路径的 Firefox 无头浏览器

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| download_path | str | 是 | - | 下载路径 |
| content_type | str | 是 | - | 下载文件类型 |

**返回：** `webdriver.Firefox`

---

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](../best-practices.md)
