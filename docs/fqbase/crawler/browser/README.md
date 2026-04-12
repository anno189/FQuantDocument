# Browser 模块文档

**模块路径**: `FQBase.Crawler.browser`
**源码**: [browser.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Crawler/browser.py)

## 文档索引

| 文档 | 说明 |
|------|------|
| [framework.md](framework.md) | 框架概述、核心特性、设计模式 |
| [architecture.md](architecture.md) | 整体架构、组件架构、工作流程 |
| [design.md](design.md) | 设计决策与权衡 |
| [api.md](api.md) | 详细 API 参考 |
| [usage.md](usage.md) | 使用指南、代码示例 |
| [best-practices.md](best-practices.md) | 最佳实践、常见问题 |

## 模块组件

| 组件 | 类型 | 说明 |
|------|------|------|
| `TIMEOUT` | 常量 | 默认超时时间 90 秒 |
| `POLL_FREQUENCY` | 常量 | 默认轮询频率 0.2 秒 |
| `make_headless_browser()` | 函数 | 创建无头 Chrome 浏览器 |
| `BrowserPool` | 类 | 浏览器池（单例模式） |
| `BaseCrawler` | 类 | 基础爬虫类 |
| `PageParser` | 类 | 页面解析工具类 |
| `make_headless_browser_with_auto_save_path()` | 函数 | 创建带下载路径的 Firefox |

## 快速开始

```python
from FQBase.Crawler.browser import BaseCrawler, PageParser

class MyCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(use_browser=False)

    def crawl(self, url):
        html = self.fetch_url(url)
        titles = PageParser.extract_by_regex(html, r'<title>(.*?)</title>', group=1)
        return titles
```
