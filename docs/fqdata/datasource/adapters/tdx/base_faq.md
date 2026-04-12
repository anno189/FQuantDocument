# TDX Base 常见问题

## 连接问题

### Q: 连接失败怎么办？

**A:** 检查网络连接和 TDX 服务器状态。

```python
from FQData.DataSource.adapters.tdx.base import TdxBaseAdapter

adapter = TdxBaseAdapter()

if not adapter.is_connected:
    print("连接失败，尝试重新连接")
    adapter._connect()

print(f"当前连接状态: {adapter.is_connected}")
```

### Q: 如何设置超时时间？

**A:** 通过类方法或实例参数设置。

```python
# 方式1：设置类默认超时
TdxBaseAdapter.set_default_timeout(2.0)

# 方式2：实例化时指定
adapter = TdxBaseAdapter(timeout=2.0)

# 方式3：环境变量
import os
os.environ['TDX_DEFAULT_TIMEOUT'] = '2.0'
```

### Q: 健康检查失败？

**A:** 健康检查失败通常是网络问题或服务器不可用。

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

selector = TdxIPSelector()

# 手动测试 IP 连接
ip, port = selector.get_mainmarket_ip()
print(f"当前服务器: {ip}:{port}")

# 重新选择最优 IP
best_ip, best_port = selector.select_best_ip()
print(f"最优服务器: {best_ip}:{best_port}")
```

---

## 数据获取问题

### Q: 数据获取返回 None？

**A:** 检查代码格式和市场。

```python
adapter = TdxBaseAdapter()

# 代码必须是 6 位数字
code = '600000'  # 正确
code = '600'     # 错误

# 深市代码以 0、3、2 开头
# 沪市代码以 6、9 开头
market = 0 if code.startswith(('0', '3', '2')) else 1
```

### Q: 如何获取分钟数据？

**A:** 使用 `get_stock_min` 方法。

```python
data = adapter.get_stock_min(
    code='600000',
    start='2024-01-01',
    end='2024-01-31',
    frequence='5min'  # 1min/5min/15min/30min/60min
)
```

### Q: 频率参数如何设置？

**A:** 支持多种格式。

```python
# 日线
frequence = 'day'   # 或 'd', 'D', 'DAY'

# 周线
frequence = 'week'  # 或 'w', 'W'

# 月线
frequence = 'month'  # 或 'M', 'm'

# 季线
frequence = 'quarter'  # 或 'Q'

# 年线
frequence = 'year'  # 或 'y', 'Y'

# 分钟线
frequence = '1min'   # 1分钟
frequence = '5min'   # 5分钟
frequence = '15min'  # 15分钟
frequence = '30min'  # 30分钟
frequence = '60min'  # 60分钟
```

---

## IP 选择问题

### Q: 如何选择最优服务器？

**A:** 使用 TdxIPSelector 自动选择。

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

selector = TdxIPSelector()

# 自动选择最优 IP
best_ip, best_port = selector.select_best_ip()
print(f"最优服务器: {best_ip}:{best_port}")
```

### Q: 如何指定特定 IP？

**A:** 在初始化或调用时指定。

```python
# 初始化时指定
adapter = TdxBaseAdapter()

# 获取特定 IP
ip, port = adapter._get_mainmarket_ip(ip='120.18.167.200', port=7709)
print(f"指定服务器: {ip}:{port}")
```

### Q: 主板和扩展市场 IP 有什么区别？

**A:** 不同市场使用不同的服务器。

```python
# 主板市场（股票、指数等）
ip, port = adapter._get_mainmarket_ip()

# 扩展市场（期货、期权等）
ip, port = adapter._get_extensionmarket_ip()
```

---

## 异常问题

### Q: 常见异常类型有哪些？

**A:** 三种主要异常类型。

```python
from FQData.DataSource.adapters.tdx.base import (
    DataSourceConnectionError,
    DataNotFoundError,
    DataSourceAPIError,
)

# DataSourceConnectionError: 连接问题
# DataNotFoundError: 数据不存在
# DataSourceAPIError: API 调用失败
```

### Q: 如何处理重试？

**A:** 使用装饰器或手动重试。

```python
from FQBase.Foundation.retry import retry

class MyAdapter(TdxBaseAdapter):
    @retry(stop_max_attempt_number=3, wait_random_min=100, wait_random_max=500)
    def get_stock_day(self, code, start, end, frequence="day"):
        return super().get_stock_day(code, start, end, frequence)
```

---

## 性能问题

### Q: 如何优化性能？

**A:** 调整超时和批量获取。

```python
# 设置较短超时
TdxBaseAdapter.set_default_timeout(0.7)  # 默认值已优化

# 使用批量获取
for code in codes:
    data = adapter.get_stock_day(code, start, end)
```

### Q: 超时设置多少合适？

**A:** 根据网络环境调整。

| 环境 | 推荐超时 | 说明 |
|------|---------|------|
| 本地网络 | 0.5-1.0 秒 | 网络延迟低 |
| 普通网络 | 1.0-2.0 秒 | 正常网络环境 |
| 慢速网络 | 3.0-5.0 秒 | 网络延迟较高 |

---

## 相关文档

- [TDX README](README.md)
- [TDX Base API](base.md)
- [TDX 开发指南](development.md)
- [适配器索引](../README.md)