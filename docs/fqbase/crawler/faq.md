---
title: Crawler - 常见问题
description: Crawler 爬虫工具模块常见问题与解答
tag:
  - fqbase
  - crawler
---

# Crawler - 常见问题

## 一般问题

### Q: 如何安装浏览器驱动？

**A:** 使用 webdriver-manager 自动安装：

```python
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver

driver = webdriver.Chrome(ChromeDriverManager().install())
```

### Q: 为什么爬取速度慢？

**A:** 
1. 使用无头模式提高速度
2. 禁用图片加载
3. 使用浏览器池复用实例

### Q: 如何处理反爬虫？

**A:**
1. 设置随机延迟
2. 更换 User-Agent
3. 使用代理

---

## 相关文档

- [API参考](./api.md)
- [故障排查](./troubleshooting.md)
