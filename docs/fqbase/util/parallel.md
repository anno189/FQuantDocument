---
title: Parallel
description: 并行计算工具，提供多进程和多线程封装，支持任务统计和健康检查
tag:
  - fqbase
  - util

summary:
  type: utility
  complexity: medium
  maturity: stable
  core_classes:
    - ParallelProcess
    - ParallelThread
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "CPU密集型任务使用多进程（如数据计算）"
    - "I/O密集型任务使用多线程（如网络请求）"
    - "批量处理数据时监控进度和错误"
  warnings:
    - "多进程不能传递lambda函数"
    - "多线程有GIL限制，CPU密集型任务不适用"
    - "进程池/线程池有资源限制，避免创建过多"
  limitations:
    - "Windows下多进程使用spawn，速度较慢"
    - "不支持嵌套并行（进程内再开进程）"

relationships:
  belongs_to:
    - fquant.fqbase.util
  depends_on: []
  import_path:
    - from FQBase.Util.parallel import ParallelProcess, ParallelThread
---

# Parallel

## 一句话总览

📌 **并行计算工具，多进程和多线程封装，支持任务统计和健康检查**

**TL;DR**：
- 核心能力：多进程并行、多线程并行、任务统计、健康检查
- 入门难度：🟢 简单

## 快速开始

```python
from FQBase.Util.parallel import ParallelProcess, ParallelThread

# 多进程（CPU密集型）
process = ParallelProcess(max_workers=4)
results = process.map(worker_function, data_list)

# 多线程（I/O密集型）
thread = ParallelThread(max_workers=8)
results = thread.map(worker_function, data_list)
```

## 类

### ParallelProcess

**描述：** 多进程并行处理封装，适用于 CPU 密集型任务

**位置：** `FQBase/Util/parallel.py`

```python
from FQBase.Util.parallel import ParallelProcess

process = ParallelProcess(max_workers=None)
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| max_workers | int | 否 | CPU核心数 | 最大工作进程数 |

**方法：**

#### map

```python
result = process.map(func, iterable)
```

使用进程池映射函数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| func | Callable | 是 | 处理函数 |
| iterable | Iterable | 是 | 可迭代数据 |

**返回：** `list` - 结果列表

#### apply

```python
result = process.apply(func, args=(), kwargs=None)
```

在进程池中执行函数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| func | Callable | 是 | 处理函数 |
| args | tuple | 否 | 位置参数 |
| kwargs | dict | 否 | 关键字参数 |

**返回：** `Any` - 函数执行结果

#### get_stats

```python
stats = process.get_stats()
```

获取任务统计信息

**返回：** `Dict[str, Any]` - 包含 submitted, completed, failed, max_workers, pending

#### health_check

```python
is_healthy = process.health_check()
```

健康检查

**返回：** `bool` - 进程池是否健康

#### reset_stats

```python
process.reset_stats()
```

重置统计计数器

---

### ParallelThread

**描述：** 多线程并行处理封装，适用于 I/O 密集型任务

**位置：** `FQBase/Util/parallel.py`

```python
from FQBase.Util.parallel import ParallelThread

thread = ParallelThread(max_workers=None)
```

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| max_workers | int | 否 | CPU核心数 | 最大工作线程数 |

**方法：**

#### map

```python
result = thread.map(func, iterable)
```

使用线程池映射函数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| func | Callable | 是 | 处理函数 |
| iterable | Iterable | 是 | 可迭代数据 |

**返回：** `list` - 结果列表

#### apply

```python
result = thread.apply(func, args=(), kwargs=None)
```

在线程池中执行函数

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| func | Callable | 是 | 处理函数 |
| args | tuple | 否 | 位置参数 |
| kwargs | dict | 否 | 关键字参数 |

**返回：** `Any` - 函数执行结果

#### get_stats

```python
stats = thread.get_stats()
```

获取任务统计信息

**返回：** `Dict[str, Any]` - 包含 submitted, completed, failed, max_workers, pending

#### health_check

```python
is_healthy = thread.health_check()
```

健康检查

**返回：** `bool` - 线程池是否健康

#### reset_stats

```python
thread.reset_stats()
```

重置统计计数器

---

## 使用示例

### CPU 密集型任务（多进程）

```python
from FQBase.Util.parallel import ParallelProcess
import math

def heavy_compute(n):
    return sum(math.factorial(i) for i in range(n))

process = ParallelProcess(max_workers=4)
results = process.map(heavy_compute, range(100))

stats = process.get_stats()
print(f"完成: {stats['completed']}, 失败: {stats['failed']}")
```

### I/O 密集型任务（多线程）

```python
from FQBase.Util.parallel import ParallelThread
import requests

def fetch_url(url):
    return requests.get(url).status_code

urls = ['https://example.com', 'https://python.org']
thread = ParallelThread(max_workers=8)
results = thread.map(fetch_url, urls)
```

---

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01-01 | 初始版本 |
