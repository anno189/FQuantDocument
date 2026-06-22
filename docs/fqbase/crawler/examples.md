---
title: Crawler - 案例库
description: Crawler 实际应用场景、动手实验与案例研究
tag:
  - fquant
  - fqbase
  - crawler

summary:
  purpose: examples
---

# Crawler - 案例库

## 阅读路径

🟢🔵 **新手+开发者**：README → examples → api → usage

## 业务场景案例

### 场景 1: 批量抓取新闻列表

**业务需求：** 抓取新闻网站的标题和链接

```python
from FQBase.Crawler import BaseCrawler, PageParser

with BaseCrawler(use_browser=False, delay=2.0) as crawler:
    html = crawler.fetch_url('https://news.example.com/tech')

    items = PageParser.extract_by_css(
        html,
        'div.news-item',
        ['title', 'href']
    )

    for item in items:
        print(f"标题: {item['title']}, 链接: {item['href']}")
```

## 动手实验

### Lab 1: 实现爬虫自动重试

**目标：** 使用 @retry 装饰器实现自动重试

```python
from FQBase.Crawler import BaseCrawler
from FQBase.Infrastructure.retry import retry

class ResilientCrawler(BaseCrawler):
    @retry(stop_max_attempt_number=3, wait_random_min=1000, wait_random_max=2000)
    def fetch_with_retry(self, url):
        return self.fetch_url(url)

crawler = ResilientCrawler()
html = crawler.fetch_with_retry('https://unstable.example.com')
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
