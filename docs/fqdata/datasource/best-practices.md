# DataSource 最佳实践

## 数据获取最佳实践

### 1. 使用单例模式

```python
# 推荐：通过 get_datasource() 获取实例
from FQData.DataSource import get_datasource

ds = get_datasource()  # 始终是同一个实例

# 避免：直接创建多个实例
ds1 = DataSource()  # 不推荐
ds2 = DataSource()
```

### 2. 合理设置数据范围

```python
# 推荐：尽量精确范围
data = ds.get_stock_day(
    code='600000',
    start='2024-01-01',  # 明确开始日期
    end='2024-12-31'     # 明确结束日期
)

# 避免：获取过多不需要的数据
data = ds.get_stock_day(
    code='600000',
    start='2000-01-01',  # 不必要的早期数据
    end='2099-12-31'      # 浪费带宽和存储
)
```

### 3. 使用合适的复权类型

```python
# 推荐：明确指定复权类型
data = ds.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    adjust='qfq'  # 前复权，适合技术分析
)

# 后复权适合计算收益率
data = ds.get_stock_day(
    code='600000',
    adjust='hfq'
)
```

---

## 性能最佳实践

### 1. 使用并行获取

```python
from FQData.DataStore import save_stock_day_parallel

# 推荐：使用并行保存
save_stock_day_parallel(
    codes=['600000', '000001', '000002', '000003', '000004'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4  # 根据网络条件调整
)

# 避免：串行获取大量股票
for code in codes:
    data = ds.get_stock_day(code, start, end)  # 慢
```

### 2. 启用缓存

```python
ds = get_datasource()

# 如果支持缓存，启用它
if hasattr(ds, 'enable_cache'):
    ds.enable_cache()

# 获取数据（第二次会从缓存读取）
data = ds.get_stock_day('600000', start='2024-01-01', end='2024-01-10')
data = ds.get_stock_day('600000', start='2024-01-01', end='2024-01-10')  # 更快
```

### 3. 批量请求

```python
# 如果支持批量获取，使用它
data = ds.get_stock_day_batch(
    codes=['600000', '000001', '000002'],
    start='2024-01-01',
    end='2024-01-10'
)
```

---

## 错误处理最佳实践

### 1. 区分异常类型

```python
from FQData.DataSource import (
    DataSourceError,
    DataSourceConnectionError,
    DataNotFoundError,
    DataSourceAPIError
)

try:
    data = ds.get_stock_day('600000', start='2024-01-01', end='2024-12-31')
except DataNotFoundError:
    # 数据不存在，可能代码错误或日期范围错误
    print("数据不存在，请检查参数")
except DataSourceConnectionError:
    # 网络或连接问题
    print("连接失败，请检查网络")
except DataSourceAPIError:
    # API 调用失败
    print("API 调用失败")
except DataSourceError as e:
    # 其他数据源错误
    print(f"数据源错误: {e}")
```

### 2. 实现重试机制

```python
from FQBase.Foundation import retry_with_exponential_backoff

@retry_with_exponential_backoff(
    max_attempts=3,
    base_wait=1000,
    max_wait=10000,
    retry_on_exception=(DataSourceConnectionError,)
)
def fetch_with_retry(code, start, end):
    return ds.get_stock_day(code, start, end)
```

---

## 数据质量最佳实践

### 1. 验证返回数据

```python
data = ds.get_stock_day('600000', start='2024-01-01', end='2024-12-31')

# 推荐：验证数据
if data is None or len(data) == 0:
    print("警告：数据为空")
elif len(data) < expected_count:
    print(f"警告：数据不完整，期望 {expected_count} 条，实际 {len(data)} 条")
```

### 2. 检查数据完整性

```python
def validate_stock_data(df):
    """验证股票数据完整性"""
    required_columns = ['code', 'date', 'open', 'high', 'low', 'close', 'volume']

    for col in required_columns:
        if col not in df.columns:
            return False, f"缺少列: {col}"

    # 检查 OHLC 关系
    if not (df['high'] >= df['low']).all():
        return False, "存在最高价 < 最低价"

    if not (df['high'] >= df['open']).all():
        return False, "存在最高价 < 开盘价"

    if not (df['high'] >= df['close']).all():
        return False, "存在最高价 < 收盘价"

    if not (df['low'] <= df['open']).all():
        return False, "存在最低价 > 开盘价"

    if not (df['low'] <= df['close']).all():
        return False, "存在最低价 > 收盘价"

    return True, "数据完整"
```

---

## 安全最佳实践

### 1. 防止请求频率过高

```python
import time

# 推荐：添加请求间隔
for code in codes:
    data = ds.get_stock_day(code, start, end)
    time.sleep(0.1)  # 100ms 间隔

# 或者使用官方限流
# TDX 建议：日线每秒不超过 10 个请求
```

### 2. 处理市场休市

```python
from datetime import datetime, time

def is_market_open():
    """检查当前是否开盘时间"""
    now = datetime.now()
    current_time = now.time()

    # 工作日
    if now.weekday() >= 5:
        return False

    # 开盘时间 9:30-11:30, 13:00-15:00
    morning_start = time(9, 30)
    morning_end = time(11, 30)
    afternoon_start = time(13, 0)
    afternoon_end = time(15, 0)

    return (morning_start <= current_time <= morning_end or
            afternoon_start <= current_time <= afternoon_end)
```

---

## 配置最佳实践

### 1. 使用环境变量配置

```python
import os

# 推荐：通过环境变量配置
ds = get_datasource()
ds.set_mode(os.getenv('DATASOURCE_MODE', 'tdx'))

# 或者
ds.configure(
    host=os.getenv('DATASOURCE_HOST', 'localhost'),
    port=int(os.getenv('DATASOURCE_PORT', '7708'))
)
```

### 2. 使用配置文件

```python
import json

with open('config/datasource.json', 'r') as f:
    config = json.load(f)

ds = get_datasource()
ds.configure(**config)
```

---

## 相关文档

- [API 参考](api.md)
- [README](README.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [FAQ](faq.md)