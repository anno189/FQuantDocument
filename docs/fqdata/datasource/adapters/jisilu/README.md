# Jisilu 适配器

集思录数据适配器模块，提供集思录网站数据爬取功能（可转债数据等）。

## 模块结构

```
jisilu/
└── __init__.py          # 模块入口
```

## 功能

### 浏览器操作

```python
from FQData.DataSource.adapters.jisilu import (
    create_browser,
    login,
    JisiluCrawler,
    get_browser_from_pool,
    close_browser_pool,
)
```

| 函数 | 说明 |
|------|------|
| `create_browser` | 创建 Selenium 浏览器实例 |
| `login` | 登录集思录 |
| `JisiluCrawler` | 集思录爬虫类 |
| `get_browser_from_pool` | 从浏览器池获取浏览器 |
| `close_browser_pool` | 关闭浏览器池 |

### 数据获取

```python
from FQData.DataSource.adapters.jisilu import get_cbnewlist
```

| 函数 | 说明 |
|------|------|
| `get_cbnewlist` | 获取可转债列表数据 |

## 常量

| 常量 | 说明 |
|------|------|
| `JISILU_LIST_URL` | 可转债列表 API URL |
| `JISILU_REDEEM_URL` | 可转债赎回 API URL |
| `JISILU_LOGIN_URL` | 登录 URL |
| `JISILU_LOGOUT_URL` | 登出 URL |

## 快速开始

### 创建浏览器

```python
from FQData.DataSource.adapters.jisilu import create_browser

browser = create_browser()
if browser:
    print("浏览器创建成功")
```

### 登录集思录

```python
from FQData.DataSource.adapters.jisilu import create_browser, login

browser = create_browser()
if login(browser):
    print("登录成功")
```

### 获取可转债列表

```python
from FQData.DataSource.adapters.jisilu import create_browser, login, get_cbnewlist

browser = create_browser()
login(browser)

cb_data = get_cbnewlist(browser)
print(f"获取 {len(cb_data)} 只可转债")
```

### 使用爬虫类

```python
from FQData.DataSource.adapters.jisilu import JisiluCrawler

crawler = JisiluCrawler()
crawler.login()

cb_data = crawler.get_cbnewlist()
print(cb_data.head())
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `JISILU_USERNAME` | 集思录用户名 |
| `JISILU_PASSWORD` | 集思录密码 |
| `CHROMEDRIVER_PATH` | ChromeDriver 路径 |

## 注意事项

1. 集思录数据需要登录才能获取完整数据
2. 使用 Selenium 浏览器自动化，请确保 ChromeDriver 已安装
3. 建议使用浏览器池管理多个浏览器实例以提高效率

## 相关文档

- [DataSource 模块](../../README.md)
- [适配器索引](../README.md)