# Browser 框架文档

**模块路径**: `FQBase.Crawler.browser`
**源码**: [browser.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Crawler/browser.py)

---

## 一、概述

### 1.1 什么是 Browser 模块

Browser 是 FQBase 框架的**浏览器和爬虫工具**模块，提供基于 Selenium 的浏览器自动化和网页爬取功能。

**解决的问题**：
- 传统 HTTP 请求无法获取 JavaScript 动态渲染的内容
- 复杂网页需要模拟用户操作（点击、滚动、填写表单）
- 需要处理反爬机制（代理、请求间隔、随机延迟）

**核心价值**：
- **Selenium 封装**：简化浏览器自动化操作
- **双模式支持**：HTTP 请求模式（轻量）和浏览器模式（重量）
- **自动重试**：内置 `@retry` 装饰器，网络波动时自动重试
- **页面解析**：提供正则、CSS选择器、表格等多种解析方式

### 1.2 模块组件

| 组件 | 类型 | 说明 |
|------|------|------|
| `make_headless_browser()` | 函数 | 创建无头 Chrome 浏览器 |
| `BrowserPool` | 类 | 浏览器池，复用浏览器实例 |
| `BaseCrawler` | 类 | 基础爬虫类 |
| `PageParser` | 类 | 页面解析工具类 |

### 1.3 何时使用

| 场景 | 推荐方式 | 说明 |
|------|----------|------|
| 静态页面爬取 | `fetch_url()` | 轻量级，速度快 |
| JavaScript 动态渲染 | `fetch_url_with_browser()` | 使用 Selenium 获取渲染后内容 |
| 需要交互（点击、滚动） | `BaseCrawler` 浏览器模式 | 完整浏览器自动化 |
| 批量爬取 | `BrowserPool` | 复用浏览器，减少资源消耗 |

---

## 二、核心特性

### 2.1 HTTP 请求支持

```python
class BaseCrawler:
    def fetch_url(self, url, method='GET', params=None, data=None, headers=None, encoding='utf-8'):
        """支持 GET/POST，自动处理代理、超时、重试"""
```

**特性**：
- 自动管理请求头（User-Agent, Accept 等）
- 支持 HTTP/HTTPS 代理
- 自动 URL 参数编码
- 超时控制
- 自动重试（3次，指数退避）

### 2.2 浏览器自动化

```python
def fetch_url_with_browser(self, url, wait_for=None):
    """使用 Selenium 获取页面，等待元素加载"""

def wait_and_click(self, selector, by=By.CSS_SELECTOR, timeout=None, index=0):
    """等待并点击元素"""

def scroll_to_element(self, selector, by=By.CSS_SELECTOR):
    """滚动到元素位置"""
```

### 2.3 页面解析

```python
class PageParser:
    @staticmethod
    def extract_by_regex(html, pattern, group=0, flags=0):
        """正则提取"""

    @staticmethod
    def extract_by_css(html, selector, attrs=None):
        """CSS 选择器提取"""

    @staticmethod
    def extract_tables(html, attrs=None):
        """表格提取"""

    @staticmethod
    def extract_json(text, keys):
        """JSON 提取"""

    @staticmethod
    def extract_links(html, base_url=None, pattern=None):
        """链接提取"""
```

---

## 三、依赖说明

### 3.1 核心依赖

| 依赖 | 版本 | 说明 |
|------|------|------|
| `selenium` | - | 浏览器自动化框架 |
| `requests` | - | HTTP 请求库 |
| `beautifulsoup4` | - | HTML 解析库 |

### 3.2 系统依赖

| 依赖 | 说明 |
|------|------|
| `chromedriver` | Chrome 浏览器驱动，路径 `/usr/bin/chromedriver` |
| `geckodriver` | Firefox 浏览器驱动，路径 `/usr/bin/geckodriver` |
| Chrome/Firefox 浏览器 | 无头模式运行 |

---

## 四、设计模式

| 模式 | 应用 |
|------|------|
| 单例模式 | `BrowserPool` 使用 `@singleton` 装饰器 |
| 装饰器模式 | `@retry` 自动重试 |
| 上下文管理器 | `BaseCrawler` 支持 `with` 语句 |
| 工厂模式 | `make_headless_browser()` 创建浏览器实例 |
