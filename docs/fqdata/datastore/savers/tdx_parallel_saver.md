# TDX Parallel Saver

并行数据持久化模块，提供多进程/多线程并行保存股票、指数、ETF等数据的功能。

## 模块结构

```
tdx_parallel_saver.py
```

## 函数

### save_stock_day_parallel

并行保存股票日线数据。

```python
from FQData import save_stock_day_parallel

result = save_stock_day_parallel(
    codes=['600000', '000001', '000002'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4
)
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `codes` | list | 股票代码列表 |
| `start` | str | 开始日期 (YYYY-MM-DD) |
| `end` | str | 结束日期 (YYYY-MM-DD) |
| `workers` | int | 并行工作数，默认 CPU 核心数 |

**返回：** dict - 包含 success_count, failed_count, errors

---

### save_index_day_parallel

并行保存指数日线数据。

```python
from FQData import save_index_day_parallel

result = save_index_day_parallel(
    codes=['000001', '399001'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4
)
```

---

### save_etf_day_parallel

并行保存ETF日线数据。

```python
from FQData import save_etf_day_parallel

result = save_etf_day_parallel(
    codes=['510300', '510050'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4
)
```

---

### save_stock_xdxr_parallel

并行保存除权除息数据。

```python
from FQData import save_stock_xdxr_parallel

result = save_stock_xdxr_parallel(
    codes=['600000', '000001'],
    workers=4
)
```

---

### save_stock_xdxr_one

保存单只股票除权除息数据。

```python
from FQData import save_stock_xdxr_one

result = save_stock_xdxr_one('600000')
```

---

## 类

### ParallelismProcess

多进程并行处理类。

```python
from FQData import ParallelismProcess

processor = ParallelismProcess(
    max_workers=4
)
```

### ParallelismThread

多线程并行处理类。

```python
from FQData import ParallelismThread

processor = ParallelismThread(
    max_workers=4
)
```

---

## 工具函数

### _get_default_ips

获取默认备用IP列表。

```python
from FQData.DataStore.savers.tdx_parallel_saver import _get_default_ips

ips = _get_default_ips()
```

### _get_best_ips

获取最佳IP列表用于负载均衡。

```python
from FQData.DataStore.savers.tdx_parallel_saver import _get_best_ips

ips = _get_best_ips(n=8)
```

### _calculate_qfq

计算前复权因子。

```python
from FQData.DataStore.savers.tdx_parallel_saver import _calculate_qfq

fq_data = _calculate_qfq(bfq_data, xdxr_data)
```

---

## 配置

### 环境变量

| 变量 | 说明 |
|------|------|
| `TDX_DEFAULT_IPS` | 逗号分隔的IP列表，格式: ip:port |

### 配置示例

```bash
export TDX_DEFAULT_IPS='120.18.167.200:7709,120.18.167.201:7709'
```

---

## 性能优化

### 负载均衡

并行保存自动使用多个服务器IP进行负载均衡：

```python
save_stock_day_parallel(
    codes=['600000', '000001', '000002'],
    start='2024-01-01',
    end='2024-12-31',
    workers=8  # 建议设置为 CPU 核心数的 2 倍
)
```

### IP 缓存

```python
ips = _get_best_ips(n=16)  # 预获取多个 IP 备用
```

---

## 相关文档

- [Savers 模块](../README.md)
- [DataStore 模块](../../README.md)