# Browser 设计文档

**模块路径**: `FQBase.Crawler.browser`
**源码**: [browser.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Crawler/browser.py)

---

## 一、BrowserPool 单例模式

```python
@singleton
class BrowserPool:
    """浏览器池 - 单例模式"""
    _instance = None

    def __init__(self, max_browsers: int = 3):
        self._browsers: List[webdriver.Chrome] = []
        self._max_browsers = max_browsers
```

**决策**: 使用 `@singleton` 装饰器确保全局只有一个 BrowserPool 实例，浏览器资源统一管理。

---

## 二、双模式设计

```python
class BaseCrawler:
    def __init__(
        self,
        timeout: int = TIMEOUT,
        use_browser: bool = False,  # 是否使用浏览器
        use_proxy: Optional[str] = None,
        headers: Optional[Dict[str, str]] = None,
        delay: float = 1.0,
    ):
```

**决策**: 支持两种模式切换：
- `use_browser=False`：轻量级 HTTP 请求，速度快
- `use_browser=True`：重量级浏览器，支持 JavaScript

---

## 三、自动重试机制

```python
@retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
def fetch_url(self, url: str, ...):
    """自动重试 3 次，随机等待 100-500ms"""
```

**决策**: 使用 `@retry` 装饰器，网络波动时自动重试，提高爬取成功率。

---

## 四、上下文管理器

```python
class BaseCrawler:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

    def __del__(self):
        self.close()
```

**决策**: 支持 `with` 语句，自动管理浏览器生命周期，确保资源释放。

---

## 五、请求头默认值

```python
self._default_headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,...',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
}
```

**决策**: 预设真实浏览器的请求头，降低被反爬识别的风险。

---

## 六、随机延迟

```python
def _random_delay(self):
    if self._delay > 0:
        time.sleep(self._delay + random.uniform(0, 0.5))
```

**决策**: 请求间隔加入随机波动，模拟人类访问行为，规避反爬机制。

---

## 七、Lazy 初始化

```python
def _init_browser(self):
    if self._browser is None:  # 延迟创建
        self._browser = make_headless_browser()
```

**决策**: 浏览器实例延迟创建，减少资源占用，不使用时不创建浏览器。

---

## 八、PageParser 静态方法

```python
class PageParser:
    @staticmethod
    def extract_by_regex(html: str, pattern: str, ...):
        """正则提取"""

    @staticmethod
    def extract_by_css(html: str, selector: str, ...):
        """CSS 选择器提取"""
```

**决策**: 使用静态方法，无需实例化，直接 `PageParser.extract_by_regex()` 调用。
