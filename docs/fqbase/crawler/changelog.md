---
title: Crawler - 变更日志
description: Crawler 版本历史与更新说明
tag:
  - fquant
  - fqbase
  - crawler

summary:
  purpose: changelog
---

# Crawler - 变更日志

## 阅读路径

全部角色：README → changelog

## v2.10.0 (2026-04)

### 新增

- BrowserPool 浏览器池，单例模式复用浏览器实例
- PageParser 类重构，新增 extract_json、clean_html、extract_images 方法
- make_headless_browser_with_auto_save_path 支持 Firefox 下载

### 更改

- BaseCrawler 支持 context manager
- fetch_url 和 fetch_url_with_browser 支持更多参数

## v2.9.0 (2026-03)

### 新增

- BaseCrawler 基础爬虫类
- PageParser 页面解析工具类
- make_headless_browser 创建无头浏览器

---

## 相关文档

- [README](./README.md)
