# Browser 使用指南

**模块路径**: `FQBase.Crawler.browser`
**源码**: [browser.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Crawler/browser.py)

---

## 一、基本使用

### 1.1 HTTP 请求模式

```python
from FQBase.Crawler.browser import BaseCrawler, PageParser

class SimpleCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(use_browser=False, delay=1.0)

    def crawl(self, url):
        html = self.fetch_url(url)
        return html

crawler = SimpleCrawler()
html = crawler.crawl('https://example.com')
crawler.close()
```

### 1.2 浏览器模式

```python
from FQBase.Crawler.browser import BaseCrawler

class BrowserCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(use_browser=True, timeout=120)

    def crawl(self, url):
        html = self.fetch_url_with_browser(url, wait_for='body')
        return html

with BrowserCrawler() as crawler:
    html = crawler.crawl('https://example.com')
```

---

## 二、上下文管理器

```python
from FQBase.Crawler.browser import BaseCrawler

# 推荐：使用 with 语句自动关闭
with BaseCrawler(use_browser=True) as crawler:
    html = crawler.fetch_url_with_browser('https://example.com')
    # 自动调用 close()

# 等价于
crawler = BaseCrawler(use_browser=True)
try:
    html = crawler.fetch_url_with_browser('https://example.com')
finally:
    crawler.close()
```

---

## 三、页面解析

### 3.1 正则提取

```python
from FQBase.Crawler.browser import PageParser

html = '<div class="title">Hello World</div>'

titles = PageParser.extract_by_regex(html, r'<div class="title">(.*?)</div>', group=1)
print(titles)  # ['Hello World']
```

### 3.2 CSS 选择器提取

```python
html = '''
<div class="product">
    <span class="name">股票A</span>
    <span class="price">12.50</span>
</div>
'''

items = PageParser.extract_by_css(html, '.product', attrs=['class', 'name', 'price'])
print(items)
# [{'class': 'product', 'name': '股票A', 'price': '12.50'}]
```

### 3.3 表格提取

```python
html = '''
<table>
    <tr><th>代码</th><th>名称</th></tr>
    <tr><td>000001</td><td>平安银行</td></tr>
    <tr><td>000002</td><td>万科A</td></tr>
</table>
'''

tables = PageParser.extract_tables(html)
print(tables)
# [[['代码', '名称'], ['000001', '平安银行'], ['000002', '万科A']]]
```

### 3.4 链接和图片

```python
html = '''
<a href="/page/1">Page 1</a>
<a href="/page/2">Page 2</a>
<img src="/images/1.png"/>
'''

links = PageParser.extract_links(html, base_url='https://example.com')
print(links)
# ['https://example.com/page/1', 'https://example.com/page/2']

images = PageParser.extract_images(html, base_url='https://example.com')
print(images)
# ['https://example.com/images/1.png']
```

---

## 四、浏览器交互

### 4.1 等待并点击

```python
from FQBase.Crawler.browser import BaseCrawler
from selenium.webdriver.common.by import By

crawler = BaseCrawler(use_browser=True)

crawler.fetch_url_with_browser('https://example.com')

crawler.wait_and_click('button.next-page', by=By.CSS_SELECTOR)
```

### 4.2 获取元素文本

```python
title = crawler.get_element_text('h1.title', timeout=10, default='No Title')
print(title)
```

### 4.3 滚动到元素

```python
crawler.scroll_to_element('div.loading-more')
```

---

## 五、BrowserPool

```python
from FQBase.Crawler.browser import BrowserPool

pool = BrowserPool(max_browsers=3)

browser1 = pool.get_browser()
browser2 = pool.get_browser()
browser3 = pool.get_browser()
browser4 = pool.get_browser()  # 轮换回 browser1

pool.close_all()
```

---

## 六、量化交易场景

### 6.1 爬取股票列表

```python
from FQBase.Crawler.browser import BaseCrawler, PageParser

class StockListCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(use_browser=True, delay=2.0)

    def crawl_stock_list(self, exchange='SSE'):
        url = f'http://www.sse.com.cn/market/dealingdata/overview/c/{exchange.lower()}.shtml'
        html = self.fetch_url_with_browser(url, wait_for='table')

        tables = PageParser.extract_tables(html)
        if tables:
            header = tables[0][0]
            data = tables[0][1:]
            return {'header': header, 'data': data}
        return None

with StockListCrawler() as crawler:
    result = crawler.crawl_stock_list()
    print(result)
```

### 6.2 爬取财经新闻

```python
class NewsCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(use_browser=False, delay=1.0)

    def crawl_news(self, keyword='量化交易'):
        url = f'https://example.com/search?q={keyword}'
        html = self.fetch_url(url)

        titles = PageParser.extract_by_regex(
            html,
            r'<h3 class="news-title">(.*?)</h3>',
            group=1
        )

        links = PageParser.extract_links(html, pattern=r'/news/\d+')

        return [{'title': t, 'link': l} for t, l in zip(titles, links)]

with NewsCrawler() as crawler:
    news = crawler.crawl_news('AI')
    for item in news:
        print(item['title'], item['link'])
```

### 6.3 批量爬取财务报表

```python
class FinanceCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(use_browser=True, delay=3.0)

    def crawl_financial_report(self, stock_code):
        url = f'https://example.com/finance/{stock_code}'
        html = self.fetch_url_with_browser(url, wait_for='#financial-table')

        data = PageParser.extract_by_css(
            html,
            '#financial-table tr',
            attrs=['class', 'text']
        )

        return {'code': stock_code, 'data': data}

    def batch_crawl(self, codes):
        results = []
        for code in codes:
            try:
                result = self.crawl_financial_report(code)
                results.append(result)
            except Exception as e:
                print(f'Failed to crawl {code}: {e}')
        return results

with FinanceCrawler() as crawler:
    results = crawler.batch_crawl(['000001', '000002', '000004'])
```

---

## 七、完整示例

```python
from FQBase.Crawler.browser import BaseCrawler, PageParser

class StockPriceCrawler(BaseCrawler):
    def __init__(self):
        super().__init__(
            use_browser=True,
            timeout=60,
            delay=2.0,
        )

    def get_stock_price(self, code):
        url = f'https://example.com/stock/{code}'
        html = self.fetch_url_with_browser(url, wait_for='.stock-price')

        price = self.get_element_text('.stock-price .price', default='N/A')
        change = self.get_element_text('.stock-price .change', default='N/A')

        return {
            'code': code,
            'price': price,
            'change': change,
        }

if __name__ == '__main__':
    with StockPriceCrawler() as crawler:
        stock = crawler.get_stock_price('000001')
        print(stock)
```
