# Browser API 参考

**模块路径**: `FQBase.Crawler.browser`
**源码**: [browser.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Crawler/browser.py)

---

## 一、常量

### `TIMEOUT`

默认超时时间（秒）。

```python
TIMEOUT = 90
```

### `POLL_FREQUENCY`

默认轮询频率（秒）。

```python
POLL_FREQUENCY = 0.2
```

---

## 二、函数

### `make_headless_browser(custom_options: Optional[Dict[str, Any]] = None) -> webdriver.Chrome`

创建无头 Chrome 浏览器。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `custom_options` | `Dict[str, Any]` | `None` | 自定义 Chrome 选项 |

**返回值**: Chrome WebDriver 实例

**默认选项**:
- `headless`: 无头模式
- `no-sandbox`: 禁用沙箱
- `blink-settings=imagesEnabled=false`: 不加载图片
- `disable-gpu`: 禁用 GPU
- `remote-allow-origins=*`: 允许跨域

**示例**:
```python
browser = make_headless_browser()
# 或带自定义选项
browser = make_headless_browser({'--window-size=1920,1080': True})
```

---

### `make_headless_browser_with_auto_save_path(download_path: str, content_type: str) -> webdriver.Firefox`

创建带自定义下载路径的无头 Firefox 浏览器。

| 参数 | 类型 | 说明 |
|------|------|------|
| `download_path` | `str` | 下载目录路径 |
| `content_type` | `str` | 下载文件类型，如 `application/pdf` |

**返回值**: Firefox WebDriver 实例

---

## 三、BrowserPool

浏览器池（单例模式），复用浏览器实例。

### `BrowserPool(max_browsers: int = 3)`

初始化浏览器池。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `max_browsers` | `int` | `3` | 最大浏览器实例数 |

### `BrowserPool.get_browser() -> webdriver.Chrome`

获取一个浏览器实例。

**返回值**: Chrome WebDriver 实例

### `BrowserPool.close_all() -> None`

关闭所有浏览器实例。

---

## 四、BaseCrawler

基础爬虫类。

### `BaseCrawler.__init__(timeout: int = TIMEOUT, use_browser: bool = False, use_proxy: Optional[str] = None, headers: Optional[Dict[str, str]] = None, delay: float = 1.0)`

初始化爬虫。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `timeout` | `int` | `TIMEOUT` (90) | 超时时间（秒） |
| `use_browser` | `bool` | `False` | 是否使用 Selenium 浏览器 |
| `use_proxy` | `str` | `None` | 代理地址 |
| `headers` | `Dict[str, str]` | `None` | 自定义请求头 |
| `delay` | `float` | `1.0` | 请求间隔（秒） |

### `BaseCrawler.fetch_url(url: str, method: str = 'GET', params: Optional[Dict] = None, data: Optional[Dict] = None, headers: Optional[Dict[str, str]] = None, encoding: str = 'utf-8') -> str`

获取页面内容（HTTP 模式）。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `url` | `str` | - | 目标 URL |
| `method` | `str` | `'GET'` | 请求方法 GET/POST |
| `params` | `Dict` | `None` | URL 参数 |
| `data` | `Dict` | `None` | POST 数据 |
| `headers` | `Dict[str, str]` | `None` | 自定义请求头 |
| `encoding` | `str` | `'utf-8'` | 响应编码 |

**返回值**: 页面 HTML 内容

**示例**:
```python
html = crawler.fetch_url('https://example.com')
html = crawler.fetch_url('https://example.com', method='POST', data={'key': 'value'})
```

### `BaseCrawler.fetch_url_with_browser(url: str, wait_for: Optional[str] = None) -> str`

使用浏览器获取页面内容（浏览器模式）。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `url` | `str` | - | 目标 URL |
| `wait_for` | `str` | `None` | 等待元素加载的选择器 |

**返回值**: 页面 HTML 内容

### `BaseCrawler.wait_and_click(selector: str, by: str = By.CSS_SELECTOR, timeout: Optional[int] = None, index: int = 0) -> bool`

等待并点击元素。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `selector` | `str` | - | 选择器字符串 |
| `by` | `str` | `By.CSS_SELECTOR` | 选择器类型 |
| `timeout` | `int` | `None` | 超时时间（默认 self._timeout） |
| `index` | `int` | `0` | 元素索引 |

**返回值**: 是否成功

### `BaseCrawler.get_element_text(selector: str, by: str = By.CSS_SELECTOR, timeout: Optional[int] = None, default: str = '') -> str`

获取元素文本。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `selector` | `str` | - | 选择器字符串 |
| `by` | `str` | `By.CSS_SELECTOR` | 选择器类型 |
| `timeout` | `int` | `None` | 超时时间 |
| `default` | `str` | `''` | 默认值 |

**返回值**: 元素文本

### `BaseCrawler.scroll_to_element(selector: str, by: str = By.CSS_SELECTOR) -> bool`

滚动到元素位置。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `selector` | `str` | - | 选择器字符串 |
| `by` | `str` | `By.CSS_SELECTOR` | 选择器类型 |

**返回值**: 是否成功

### `BaseCrawler.close() -> None`

关闭浏览器。

---

## 五、PageParser

页面解析工具类（静态方法）。

### `PageParser.extract_by_regex(html: str, pattern: str, group: int = 0, flags: int = 0) -> List[str]`

正则提取。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `html` | `str` | - | HTML 内容 |
| `pattern` | `str` | - | 正则表达式 |
| `group` | `int` | `0` | 捕获组索引 |
| `flags` | `int` | `0` | 正则标志 |

**返回值**: 匹配结果列表

### `PageParser.extract_by_css(html: str, selector: str, attrs: Optional[List[str]] = None) -> List[Dict[str, Any]]`

CSS 选择器提取。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `html` | `str` | - | HTML 内容 |
| `selector` | `str` | - | CSS 选择器 |
| `attrs` | `List[str]` | `None` | 要提取的属性列表，None 表示提取文本 |

**返回值**: 提取结果列表

### `PageParser.extract_tables(html: str, attrs: Optional[List[str]] = None) -> List[List[List[str]]]`

提取表格。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `html` | `str` | - | HTML 内容 |
| `attrs` | `Dict` | `None` | table 属性过滤 |

**返回值**: 表格数据列表 [[[cell1, cell2], ...], ...]

### `PageParser.extract_json(text: str, keys: List[str]) -> Any`

从文本中提取 JSON 并获取指定键值。

| 参数 | 类型 | 说明 |
|------|------|------|
| `text` | `str` | 包含 JSON 的文本 |
| `keys` | `List[str]` | 键路径，如 `['data', 'list', 0, 'name']` |

**返回值**: 提取的值

### `PageParser.clean_html(raw_html: str) -> str`

清理 HTML 标签。

| 参数 | 类型 | 说明 |
|------|------|------|
| `raw_html` | `str` | 原始 HTML |

**返回值**: 清理后的文本

### `PageParser.extract_links(html: str, base_url: Optional[str] = None, pattern: Optional[str] = None) -> List[str]`

提取链接。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `html` | `str` | - | HTML 内容 |
| `base_url` | `str` | `None` | 基础 URL（用于拼接相对路径） |
| `pattern` | `str` | `None` | URL 过滤正则 |

**返回值**: 链接列表

### `PageParser.extract_images(html: str, base_url: Optional[str] = None) -> List[str]`

提取图片链接。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `html` | `str` | - | HTML 内容 |
| `base_url` | `str` | `None` | 基础 URL |

**返回值**: 图片链接列表

---

## 六、环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `GECKODRIVER_PATH` | `/usr/bin/geckodriver` | Firefox 驱动路径 |
