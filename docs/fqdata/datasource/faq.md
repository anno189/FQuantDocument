# FAQ

## 基础问题

### Q: DataSource 模块提供什么功能？

DataSource 模块提供统一的数据源接口，支持多数据源动态切换：

| 功能 | 说明 |
|------|------|
| 统一入口 | `get_datasource()` 获取数据源实例 |
| 多数据源 | 支持 TDX、东方财富等 |
| 健康检查 | 检查数据源连接状态 |
| 适配器注册 | 支持自定义适配器扩展 |

---

### Q: 如何获取数据？

```python
from FQData.DataSource import get_datasource

ds = get_datasource()

# 设置数据源模式
ds.set_mode('tdx')

# 获取股票日线
data = ds.get_stock_day('600000', start='2024-01-01', end='2024-12-31')
```

---

## 配置问题

### Q: 如何切换数据源？

```python
from FQData.DataSource import get_datasource, DataSourceMode

ds = get_datasource()

# 方式1：使用字符串
ds.set_mode('tdx')

# 方式2：使用枚举
ds.set_mode(DataSourceMode.TDX)

# 方式3：使用数字
ds.set_mode(1)
```

---

### Q: 支持哪些数据源模式？

| 模式 | 值 | 说明 |
|------|-----|------|
| `TDX` | 1 | 通达信 |
| `EASTMONEY` | 2 | 东方财富 |
| `AKSHARE` | 3 | AKShare |
| `EFINANCE` | 4 | EFinance |

---

## 数据获取问题

### Q: 如何获取股票日线数据？

```python
ds = get_datasource()

# 基本用法
data = ds.get_stock_day('600000', start='2024-01-01', end='2024-12-31')

# 参数说明
# code: 股票代码
# start: 开始日期
# end: 结束日期
# adjust: 复权类型 (None/qfq/hfq)
```

---

### Q: 如何获取分钟数据？

```python
ds = get_datasource()

# 1分钟
data = ds.get_stock_min('600000', freq='1min', start='2024-01-01')

# 5分钟
data = ds.get_stock_min('600000', freq='5min', start='2024-01-01')

# 15/30/60分钟同理
data = ds.get_stock_min('600000', freq='15min', start='2024-01-01')
```

---

### Q: 支持哪些频率？

| 频率 | 说明 |
|------|------|
| `1min` | 1分钟 |
| `5min` | 5分钟 |
| `15min` | 15分钟 |
| `30min` | 30分钟 |
| `60min` | 60分钟 |
| `1h` | 1小时 (=60min) |
| `day/d` | 日线 |
| `week/w` | 周线 |
| `month/M` | 月线 |

---

## 适配器问题

### Q: 如何使用 TDX 适配器？

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()

# 获取股票数据
data = adapter.get_security_bars(
    code='600000',
    category=9,  # 日线
    start=0,
    count=100
)
```

---

### Q: 如何注册自定义适配器？

```python
from FQData.DataSource import register_source, DataSourceAdapter

class CustomAdapter(DataSourceAdapter):
    def get_stock_day(self, code, start, end):
        # 自定义实现
        return custom_data

# 注册
register_source('custom', CustomAdapter)

# 使用
ds = get_datasource()
ds.set_mode('custom')
```

---

### Q: 如何检查数据源健康状态？

```python
from FQData.DataSource import DataSourceHealthCheck

checker = DataSourceHealthCheck()

# 检查所有
status = checker.check()
print(f"总体状态: {status.status}")

# 检查特定适配器
tdx_status = checker.check_adapter('tdx')
print(f"TDX: {tdx_status.is_healthy}")
```

---

## 性能问题

### Q: 如何优化数据获取性能？

```python
# 1. 使用并行获取
from FQData.DataStore import save_stock_day_parallel

save_stock_day_parallel(
    codes=['600000', '000001', '000002'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4  # 并行数
)

# 2. 使用缓存
ds = get_datasource()
ds.enable_cache()  # 启用缓存

# 3. 批量获取
ds.get_stock_day_batch(['600000', '000001'], start='2024-01-01', end='2024-12-31')
```

---

### Q: 请求频率限制？

```python
# TDX 适配器有请求频率限制
# 建议：
# - 日线数据：每秒不超过 10 个请求
# - 分钟数据：每秒不超过 5 个请求
# - 实时数据：每秒不超过 20 个请求
```

---

## 错误处理

### Q: 常见错误及解决方案

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `ConnectionError` | 网络问题 | 检查网络连接 |
| `DataNotFoundError` | 数据不存在 | 检查代码和日期 |
| `TimeoutError` | 请求超时 | 减少请求频率 |
| `MarketClosedError` | 市场休市 | 等待开盘时间 |

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [最佳实践](best-practices.md)