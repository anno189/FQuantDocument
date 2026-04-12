# Parallel 模块

并行计算工具，提供多进程和多线程封装，支持任务统计和健康检查。

## 类

### ParallelProcess

多进程并行处理封装。

**适用场景**：CPU 密集型任务

```python
from FQBase.Util import ParallelProcess

process = ParallelProcess(max_workers=4)
results = process.map(worker_function, data_list)
```

---

### ParallelThread

多线程并行处理封装。

**适用场景**：I/O 密集型任务（网络请求、文件读写）

```python
from FQBase.Util import ParallelThread

thread = ParallelThread(max_workers=8)
results = thread.map(worker_function, data_list)
```

---

## 方法

### map

使用进程/线程池映射函数。

```python
def worker_function(x):
    return x * 2

# 多进程
process = ParallelProcess(max_workers=4)
results = process.map(worker_function, range(100))

# 多线程
thread = ParallelThread(max_workers=8)
results = thread.map(worker_function, range(100))
```

---

### apply

在池中执行单个任务。

```python
process = ParallelProcess(max_workers=4)

# 提交任务
future = process.apply(heavy_function, args=(data,), kwargs={'option': 'value'})
result = future.result()
```

---

### get_stats

获取任务统计信息。

```python
process = ParallelProcess(max_workers=4)
process.map(worker_function, range(100))

stats = process.get_stats()
print(stats)
# {'submitted': 100, 'completed': 100, 'failed': 0, 'max_workers': 4, 'pending': 0}
```

**返回值**：

| 字段 | 说明 |
|------|------|
| `submitted` | 提交任务数 |
| `completed` | 完成任务数 |
| `failed` | 失败任务数 |
| `max_workers` | 最大工作进程/线程数 |
| `pending` | 等待任务数 |

---

### health_check

健康检查。

```python
process = ParallelProcess(max_workers=4)

if process.health_check():
    print("进程池健康")
else:
    print("进程池正在关闭")
```

---

### reset_stats

重置统计计数器。

```python
process = ParallelProcess(max_workers=4)
process.map(worker_function, range(100))

# 重置统计
process.reset_stats()
print(process.get_stats())  # 所有计数归零
```

---

## 使用示例

### CPU 密集型任务

```python
from FQBase.Util import ParallelProcess
import time

def calculate_fibonacci(n):
    """计算斐波那契数列"""
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# 使用多进程加速计算
process = ParallelProcess(max_workers=4)

start = time.time()
# 计算多个斐波那契数
numbers = [30, 31, 32, 33, 34]
results = process.map(calculate_fibonacci, numbers)
elapsed = time.time() - start

print(f"结果: {results}")
print(f"耗时: {elapsed:.2f}秒")
```

### I/O 密集型任务

```python
from FQBase.Util import ParallelThread
import time
import urllib.request

def fetch_url(url):
    """获取 URL 内容"""
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            return url, len(response.read())
    except:
        return url, None

# 使用多线程并发请求
thread = ParallelThread(max_workers=10)

urls = [
    'https://api.example.com/data/1',
    'https://api.example.com/data/2',
    'https://api.example.com/data/3',
    # ... 更多 URL
]

start = time.time()
results = thread.map(fetch_url, urls)
elapsed = time.time() - start

print(f"获取 {len(urls)} 个 URL 耗时: {elapsed:.2f}秒")
```

### 批量数据处理

```python
from FQBase.Util import ParallelProcess

def process_stock_data(stock_code):
    """处理单只股票数据"""
    # 模拟数据处理
    return {
        'code': stock_code,
        'price': 100.0,
        'volume': 10000
    }

# 批量处理股票
codes = [f'{i:06d}' for i in range(1, 101)]  # 100只股票

process = ParallelProcess(max_workers=8)
results = process.map(process_stock_data, codes)

# 检查统计
print(f"处理完成: {process.get_stats()['completed']} 只股票")
```

### 错误处理

```python
from FQBase.Util import ParallelProcess

def risky_operation(x):
    """可能失败的操作"""
    if x % 10 == 0:
        raise ValueError(f"Error on {x}")
    return x * 2

process = ParallelProcess(max_workers=4)

try:
    results = process.map(risky_operation, range(100))
except Exception as e:
    stats = process.get_stats()
    print(f"失败任务数: {stats['failed']}")
    print(f"完成任务数: {stats['completed']}")
```

---

## 性能对比

### 场景选择

| 场景 | 推荐 | 原因 |
|------|------|------|
| CPU 计算（数学运算、数据处理） | `ParallelProcess` | 绕过 GIL，多核利用 |
| I/O 操作（网络请求、文件读写） | `ParallelThread` | 线程共享 GIL，适合等待 |
| 混合型 | `ParallelProcess` | CPU 部分用进程，I/O 部分用线程池 |

### 性能测试

```python
import time
from FQBase.Util import ParallelProcess, ParallelThread

def cpu_task(n):
    return sum(i * i for i in range(n))

def io_task(n):
    time.sleep(0.001)
    return n

# CPU 密集型：多进程更快
process = ParallelProcess(max_workers=4)
start = time.time()
process.map(cpu_task, [1000000] * 10)
print(f"多进程耗时: {time.time() - start:.2f}s")

# I/O 密集型：多线程更快
thread = ParallelThread(max_workers=10)
start = time.time()
thread.map(io_task, [1] * 100)
print(f"多线程耗时: {time.time() - start:.2f}s")
```

---

## 相关文档

- [Util 模块](../README.md)
- [文件工具](../file.md)
- [数据转换](../converters.md)