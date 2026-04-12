# Browser 最佳实践

**模块路径**: `FQBase.Crawler.browser`
**源码**: [browser.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Crawler/browser.py)

---

## 一、性能优化

### 1.1 优先使用 HTTP 模式

```python
# 推荐：静态页面使用 HTTP 模式，速度快，资源占用少
class FastCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(use_browser=False, delay=1.0)
```

### 1.2 合理设置延迟

```python
# 根据目标网站调整延迟
class AggressiveCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(delay=0.5)  # 快速但可能被封

class PoliteCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(delay=5.0)  # 慢速但稳定
```

### 1.3 复用浏览器实例

```python
# 推荐：批量爬取时使用 BrowserPool
from FQBase.Crawler.browser import BrowserPool

pool = BrowserPool(max_browsers=3)

for url in urls:
    browser = pool.get_browser()
    browser.get(url)
    # 处理...
```

---

## 二、错误处理

### 2.1 基础错误处理

```python
class RobustCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(timeout=30, delay=2.0)

    def safe_fetch(self, url):
        try:
            return self.fetch_url(url)
        except requests.exceptions.Timeout:
            self._logger.warning(f"Timeout: {url}")
            return None
        except requests.exceptions.RequestException as e:
            self._logger.error(f"Request failed: {url}, {e}")
            return None

    def safe_browser_fetch(self, url, wait_for=None):
        try:
            return self.fetch_url_with_browser(url, wait_for)
        except Exception as e:
            self._logger.error(f"Browser fetch failed: {url}, {e}")
            return None
```

### 2.2 重试机制

```python
from FQBase.Foundation.retry import retry, retry_with_exponential_backoff

class RetryCrawler(BaseCrawler):
    @retry(stop_max_attempt_number=5, wait_random_min=1000, wait_random_max=3000)
    def fetch_with_retry(self, url):
        return self.fetch_url(url)
```

### 2.3 超时处理

```python
# 根据网络状况调整超时
class AdaptiveCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(timeout=60)  # 较长的超时时间

    def fetch_with_short_timeout(self, url):
        original_timeout = self._timeout
        self._timeout = 10  # 临时缩短
        try:
            return self.fetch_url(url)
        finally:
            self._timeout = original_timeout
```

---

## 三、反爬应对

### 3.1 代理轮换

```python
class ProxiedCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(use_proxy=None)
        self.proxies = [
            'http://proxy1:port',
            'http://proxy2:port',
            'http://proxy3:port',
        ]
        self.current_proxy_index = 0

    def rotate_proxy(self):
        self._use_proxy = self.proxies[self.current_proxy_index]
        self.current_proxy_index = (self.current_proxy_index + 1) % len(self.proxies)
        self._logger.info(f"Using proxy: {self._use_proxy}")

    def fetch_with_proxy(self, url):
        self.rotate_proxy()
        return self.fetch_url(url)
```

### 3.2 自定义请求头

```python
class CustomHeaderCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(
            headers={
                'Referer': 'https://www.google.com',
                'Accept-Language': 'en-US,en;q=0.9',
                'X-Requested-With': 'XMLHttpRequest',
            }
        )
```

### 3.3 随机 User-Agent

```python
import random

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
]

class RotatingUACrawler(BaseCrawler):
    def __init__(self):
        ua = random.choice(USER_AGENTS)
        super().__init__(headers={'User-Agent': ua})
```

---

## 四、资源管理

### 4.1 使用上下文管理器

```python
# 推荐：自动清理资源
with BaseCrawler(use_browser=True) as crawler:
    html = crawler.fetch_url_with_browser(url)
    # 自动关闭浏览器

# 不推荐：手动管理容易遗漏
crawler = BaseCrawler(use_browser=True)
try:
    html = crawler.fetch_url_with_browser(url)
finally:
    crawler.close()
```

### 4.2 定期清理浏览器

```python
class PeriodicCleanupCrawler(BaseCrawler):
    def __init__(self, cleanup_interval=100):
        super().__init__(use_browser=True)
        self.cleanup_interval = cleanup_interval
        self.request_count = 0

    def fetch_and_cleanup(self, url):
        self.request_count += 1
        html = self.fetch_url(url)

        if self.request_count >= self.cleanup_interval:
            self.close()
            self._browser = None  # 强制重建
            self._init_browser()
            self.request_count = 0

        return html
```

### 4.3 BrowserPool 清理

```python
import atexit

pool = BrowserPool(max_browsers=3)

atexit.register(pool.close_all)

def cleanup_browsers():
    pool.close_all()
```

---

## 五、维护事宜

### 5.1 依赖检查

```python
def check_dependencies():
    """检查爬虫依赖是否安装"""
    import shutil

    deps = {
        'selenium': 'pip install selenium',
        'beautifulsoup4': 'pip install beautifulsoup4',
        'chromedriver': 'brew install chromedriver (macOS)',
    }

    missing = []
    for name, install_cmd in deps.items():
        if name == 'chromedriver':
            if not shutil.which('chromedriver'):
                missing.append((name, install_cmd))
        else:
            try:
                __import__(name)
            except ImportError:
                missing.append((name, install_cmd))

    if missing:
        print("Missing dependencies:")
        for name, cmd in missing:
            print(f"  {name}: {cmd}")
        return False
    return True
```

### 5.2 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| `WebDriverException` | chromedriver 版本不匹配 | 更新 chromedriver |
| `TimeoutException` | 网络慢/网站反爬 | 增加 timeout |
| 页面内容为空 | JavaScript 未加载完成 | 使用 `wait_for` 参数 |
| 元素找不到 | 选择器错误 | 检查 CSS/XPath 选择器 |
| 浏览器无响应 | 资源耗尽 | 减少 BrowserPool 大小 |

### 5.3 ChromeDriver 更新

```bash
# macOS
brew upgrade chromedriver

# Linux
sudo apt-get update
sudo apt-get upgrade chromium-chromedriver

# 手动下载
# https://sites.google.com/chromium.org/driver/
```

### 5.4 代码规范检查清单

| 检查项 | 说明 |
|--------|------|
| 使用 `with` 语句 | 确保资源正确释放 |
| 设置合理超时 | 避免长时间等待 |
| 添加延迟 | 避免频繁请求被封 |
| 错误处理 | 捕获并记录异常 |
| 日志记录 | 使用 logger 记录关键操作 |
| 代理轮换 | 批量爬取时轮换代理 |
| 选择器准确 | CSS/XPath 选择器正确 |
