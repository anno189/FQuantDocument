---
title: Crawler - 爬虫工具
description: FQBase 爬虫工具模块，提供浏览器自动化和网页抓取功能
tag:
  - fqbase
  - crawler

summary:
  type: utility
  complexity: medium
  maturity: stable
  size: xs
  core_classes:
    - BrowserPool
    - BaseCrawler
    - PageParser
  key_functions:
    - make_headless_browser
    - make_headless_browser_with_auto_save_path

relationships:
  belongs_to:
    - fquant.fqbase

concepts:
  provides:
    - name: 浏览器自动化
      definition: 使用 Selenium 进行无头浏览器控制
    - name: 网页爬取
      definition: 自动抓取网页内容
    - name: 页面解析
      definition: 提取网页中的链接、数据等
---

# Crawler - 爬虫工具

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [速查表](./cheatsheet.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |


## 一句话总览

📌 **FQBase 爬虫工具模块，提供浏览器自动化和网页抓取功能**

**TL;DR**：
- 解决什么问题：自动抓取网页数据
- 核心能力：无头浏览器、页面解析、数据提取
- 入门难度：🔵 中等

**快速判断**：当您需要抓取动态网页、自动化浏览器操作时，使用本模块。

## 知识脉络

🧑‍🎓 **从零到精通的推荐学习顺序**：

1. [快速入门](./quick-start.md) - 5 分钟上手
2. [核心概念](./concepts.md) - 理解基本概念
3. [技术架构](./architecture.md) - 理解设计思路
4. [使用指南](./usage.md) - 深入使用
5. [最佳实践](./best-practices.md) - 升华理解

⏱️ 预计学习时间：1 小时

## 前置知识

在开始学习本模块前，建议先掌握：

| 知识领域 | 建议资源 | 状态 |
|---------|---------|------|
| Python 基础 | [官方教程](https://docs.python.org/zh-cn/3/tutorial/) | ⬜ |
| Selenium 基础 | - | ⬜ |
| HTML/CSS 基础 | - | ⬜ |

## 适用场景

✅ **推荐使用**：
- 抓取动态网页（JavaScript 渲染）
- 自动化浏览器测试
- 网页截图
- 表单自动提交

❌ **不推荐使用**：
- 简单静态网页抓取（使用 requests 即可）
- 高频大规模爬取（考虑其他方案）

## 概述

Crawler 是 FQBase 的爬虫工具模块，提供以下功能：

- **无头浏览器**：使用 Selenium 创建无头浏览器
- **浏览器池**：BrowserPool 管理多个浏览器实例
- **基础爬虫**：BaseCrawler 提供基础爬取功能
- **页面解析**：PageParser 提取网页内容

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [术语表](./glossary.md) | 术语定义 |
| [核心概念](./concepts.md) | 核心概念详解 |
| [技术架构](./architecture.md) | 技术架构说明 |
| [API参考](./api.md) | API参考文档 |
| [案例库](./examples.md) | 案例库 |

## 安装

```bash
pip install fquant-fqbase
pip install selenium
pip install webdriver-manager
```

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQBase首页 | [README](../README.md) |
| 快速入门 | 快速入门 | [快速入门](./quick-start.md) |
