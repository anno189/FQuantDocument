---
title: Crawler
description: FQBase 爬虫基础设施，基于 Selenium 和 requests 提供网页抓取和解析
tag:
  - fquant
  - fqbase
  - crawler

summary:
  type: utility
  complexity: medium
  maturity: stable
  size: small
  is_container: false
  api_exports:
    total: 7
    classes: 3
    functions: 2
    constants: 2
  features:
    has_async: false
    is_thread_safe: false
    has_config: false
    has_logging: true
    has_security: false
  usage_scenarios:
    - "使用 Selenium 抓取动态网页"
    - "使用 requests 抓取静态网页"
    - "页面解析（正则、CSS选择器、表格）"
    - "浏览器池复用"
  warnings:
    - "爬虫需要遵守 robots.txt"
    - "注意请求频率，避免封禁"
    - "使用后记得关闭浏览器资源"
  limitations:
    - "需要 ChromeDriver/FirefoxDriver"
    - "依赖 selenium、bs4、requests 库"
  design_patterns:
    - singleton

relationships:
  belongs_to:
    - fquant.fqbase
  depends_on:
    - fquant.fqbase.infrastructure
    - fquant.fqbase.util
  used_by:
    - fquant.fqdata

documentation_progress:
  status: complete
  level: L1
  total_expected: 8
  total_generated: 8
  generated:
    - README.md
    - quick-start.md
    - concepts.md
    - api.md
    - usage.md
    - examples.md
    - glossary.md
    - changelog.md
  missing: []

maintenance:
  source_hash: "417d75baf22ad67e1556ca139857880f12d4b9ef5245a28d452e9a52e27def39"
  source_mtime: 1776751411
  source_files:
    - "__init__.py"
    - "browser.py"
  last_updated: "2026-04"
---

# Crawler

## 阅读路径

🟢 **新手入门**：README → quick-start → examples → concepts → glossary → usage

🔵 **开发者**：README → api → usage → concepts → examples

## 一句话总览

📌 **FQBase 爬虫基础设施，基于 Selenium 和 requests 提供网页抓取和解析功能。**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 抓取 JavaScript 渲染的动态网页 → 使用 `BaseCrawler` + `fetch_url_with_browser`
- 抓取静态网页 → 使用 `BaseCrawler.fetch_url`
- 解析 HTML 内容 → 使用 `PageParser` 静态方法

❌ **不应该使用**：
- 违反网站 robots.txt 的爬取
- 过高频率请求导致封禁
- 不加延迟的快速请求

### 注意事项

1. **资源管理**
   - 使用 `with` 语句或显式调用 `close()`
   - 大量爬取时使用 `BrowserPool` 复用浏览器

2. **反爬策略**
   - 内置随机延迟 `delay` 参数
   - 内置随机 User-Agent
   - 支持代理 `use_proxy` 参数

3. **依赖安装**
   - 需要 ChromeDriver：`brew install chromedriver`
   - 需要 selenium：`pip install selenium`
   - 需要 bs4：`pip install beautifulsoup4`

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | selenium | 浏览器自动化 |
| 必须 | requests | HTTP 请求 |
| 必须 | bs4 | HTML 解析 |
| 可选 | chromedriver | Chrome 驱动 |

**TL;DR**：
- 解决什么问题：提供统一的网页抓取和解析工具
- 核心能力：Selenium 浏览器、requests 请求、PageParser 解析
- 入门难度：🟢 简单

**快速判断**：当您需要 抓取网页/解析 HTML/提取数据 时，使用 Crawler。

## 主要组件

| 组件 | 说明 |
|------|------|
| BaseCrawler | 基础爬虫类，封装 Selenium 和 requests |
| PageParser | 页面解析工具，正则、CSS选择器、表格提取 |
| BrowserPool | 浏览器池，复用浏览器实例（单例） |
| make_headless_browser | 创建无头浏览器 |

## 快速链接

| 需求 | 文档 |
|------|------|
| 快速入门 | [快速入门](./quick-start.md) |
| 查看 API | [API参考](./api.md) |
| 使用指南 | [使用指南](./usage.md) |

## 相关文档

- [FQBase README](../README.md)
