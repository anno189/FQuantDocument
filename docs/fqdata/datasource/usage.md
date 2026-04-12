# DataSource 使用指南

## 基本用法

### 获取数据源实例

```python
from FQData.DataSource import get_datasource

# 获取单例实例
ds = get_datasource()
```

---

## 股票数据

### 获取股票日线

```python
from FQData.DataSource import get_datasource

ds = get_datasource()

# 基本用法
data = ds.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31'
)

# 前复权
data = ds.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-12-31',
    adjust='qfq'  # qfq/hfq/None
)
```

### 获取股票分钟线

```python
# 1分钟线
data = ds.get_stock_min(
    code='600000',
    freq='1min',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00'
)

# 5分钟线
data = ds.get_stock_min(
    code='600000',
    freq='5min',
    start='2024-01-01',
    end='2024-01-31'
)

# 15/30/60分钟同理
data = ds.get_stock_min(code='600000', freq='15min', start='2024-01-01')
```

---

## 指数数据

### 获取指数日线

```python
# 上证指数
data = ds.get_index_day(
    code='000001',  # 上证指数代码
    start='2024-01-01',
    end='2024-12-31'
)

# 深证成指
data = ds.get_index_day(
    code='399001',
    start='2024-01-01',
    end='2024-12-31'
)
```

### 获取指数分钟线

```python
# 1分钟
data = ds.get_index_min(
    code='000001',
    freq='1min',
    start='2024-01-01'
)

# 5分钟
data = ds.get_index_min(
    code='000001',
    freq='5min',
    start='2024-01-01'
)
```

---

## 期货数据

### 获取期货日线

```python
# 商品期货
data = ds.get_future_day(
    code='IF2401',  # IF=沪深300股指期货
    start='2024-01-01',
    end='2024-12-31'
)

# 原油期货
data = ds.get_future_day(
    code='SC2401',  # SC=原油期货
    start='2024-01-01',
    end='2024-12-31'
)
```

### 获取期货分钟线

```python
# 1分钟
data = ds.get_future_min(
    code='IF2401',
    freq='1min',
    start='2024-01-01'
)

# 5分钟
data = ds.get_future_min(
    code='IF2401',
    freq='5min',
    start='2024-01-01'
)
```

---

## 实时行情

### 获取股票实时行情

```python
# 单只股票
data = ds.get_realtime('600000')

# 多只股票
data = ds.get_realtime(['600000', '000001'])
```

### 获取期货实时行情

```python
data = ds.get_realtime('IF2401')
```

---

## 成交明细

### 获取股票成交明细

```python
data = ds.get_transaction(
    code='600000',
    start='2024-01-01 09:30:00',
    end='2024-01-01 15:00:00'
)
```

---

## 数据源切换

### 切换到指定数据源

```python
from FQData.DataSource import DataSourceMode

# 方式1：使用枚举
ds.set_mode(DataSourceMode.TDX)

# 方式2：使用字符串
ds.set_mode('tdx')
ds.set_mode('eastmoney')

# 方式3：使用数字
ds.set_mode(1)  # 1=TDX, 2=EASTMONEY
```

---

## 批量获取

### 批量获取多只股票

```python
# 注意：需要 DataStore 的并行保存功能
from FQData.DataStore import save_stock_day_parallel

save_stock_day_parallel(
    codes=['600000', '000001', '000002'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4
)
```

---

## 错误处理

### 基本错误处理

```python
from FQData.DataSource import DataSourceError, DataNotFoundError

try:
    data = ds.get_stock_day('600000', start='2024-01-01', end='2024-12-31')
except DataNotFoundError as e:
    print(f"数据未找到: {e}")
except DataSourceError as e:
    print(f"数据源错误: {e}")
```

---

## 完整示例

```python
from FQData.DataSource import get_datasource

# 初始化
ds = get_datasource()
ds.set_mode('tdx')

# 获取数据
print("获取股票日线...")
stock_data = ds.get_stock_day('600000', start='2024-01-01', end='2024-01-10')
print(f"股票数据: {len(stock_data)} 条")

print("获取指数日线...")
index_data = ds.get_index_day('000001', start='2024-01-01', end='2024-01-10')
print(f"指数数据: {len(index_data)} 条")

print("获取期货日线...")
future_data = ds.get_future_day('IF2401', start='2024-01-01', end='2024-01-10')
print(f"期货数据: {len(future_data)} 条")

print("完成!")
```

---

## 相关文档

- [API 参考](api.md)
- [README](README.md)
- [最佳实践](best-practices.md)
- [开发指南](development.md)
- [FAQ](faq.md)