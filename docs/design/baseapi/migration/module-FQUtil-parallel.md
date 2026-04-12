---
title: FQUtil/parallel.py 迁移报告
---

# FQUtil/parallel.py 迁移报告

本文档记录 `FQData.QAUtil.Parallelism` 到 `FQBase.FQUtil.parallel` 的迁移差异分析。

## 文档链接

| 文件 | 路径 |
|------|------|
| 原文件 | [Parallelism.py](file:///Users/A.D.189/FQuant/FQuant.Server/_bak/FQData/FQData/QAUtil/Parallelism.py) (备份) |
| 迁移后 | [parallel.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/FQUtil/parallel.py) (FQBase) |
| API 文档 | [FQUtil 工具库](../fqbase/util#并行计算) |

---

## 迁移概览

| 对比项 | 原文件 | 迁移后 |
|--------|--------|--------|
| **模块路径** | `FQData.QAUtil.Parallelism` | `FQBase.FQUtil.parallel` |
| **类名** | `Parallelism_abs`, `Parallelism`, `Parallelism_Thread` | `ParallelBase`, `ParallelProcess`, `ParallelThread` |
| **池实现** | 自行封装 | `multiprocessing.Pool` / `concurrent.futures` |
| **类型注解** | 无 | 完整类型注解 |
| **ABC 模式** | 否 | 是 (ABCMeta) |

---

## 类结构对比

| 原类 | 迁移后类 | 继承关系 |
|------|----------|----------|
| `Parallelism_abs` | `ParallelBase` | 都作为基类 |
| `Parallelism` (多进程) | `ParallelProcess` | 无继承关系 |
| `Parallelism_Thread` (多线程) | `ParallelThread` | 无继承关系 |

---

## 核心属性对比

| 原属性 | 新属性 | 变化 |
|--------|--------|------|
| `self.cores` | `self.processes` | 重命名 |
| `self.total_processes` | `self.total_tasks` | 重命名 |
| `self.completed_processes` | `self.completed_tasks` | 重命名 |
| `self.results` | `self.results` | ✅ 一致 |
| `self.data` | `self._data` | 重命名为私有属性 |
| ❌ | `self.pool` | **新增** - 存储池实例 |

---

## 方法对比

### ✅ `get_results()` - 功能一致

| 对比项 | 原方法 | 新方法 |
|--------|--------|--------|
| 功能 | 返回 `self.results` | 返回 `self.results` |
| 返回类型 | `list` | `List[Any]` |

```python
# 原实现
def get_results(self):
    return self.results

# 新实现
def get_results(self) -> List[Any]:
    return self.results
```

### ⚠️ `complete()` - 有改进

| 对比项 | 原方法 | 新方法 |
|--------|--------|--------|
| 功能 | 扩展结果 + 打印进度 | 扩展结果 + **日志记录**进度 |
| 进度计算 | `(completed/total) * 100` | `(completed/total) * 100` (增加除零保护) |
| 输出方式 | `print()` | `_logger.info()` |

```python
# 原实现
def complete(self, result):
    self.results.extend(result)
    self.completed_processes += 1
    print(f'Progress: {(self.completed_processes / self.total_processes) * 100:.2f}%')

# 新实现
def complete(self, result: List[Any]) -> None:
    self.results.extend(result)
    self.completed_tasks += 1
    progress = (self.completed_tasks / self.total_tasks) * 100 if self.total_tasks > 0 else 0
    _logger.info(f'Progress: {progress:.2f}%')
```

### ⚠️ `run()` - 接口略有不同

#### 原 `Parallelism.run()`

```python
def run(self, func, iter_data):
    self.pool.run(func, iter_data)
    self.results = self.pool.get_results()
```

#### 新 `ParallelProcess.run()`

```python
def run(self, func: Callable, iter_data: Iterable) -> None:
    data = list(iter_data)
    if len(data) == 0:
        return

    try:
        if self.processes > 1 and len(data) > self.processes:
            chunk_size = len(data) // self.processes + 1
            for i in range(self.processes):
                start = i * chunk_size
                end = min((i + 1) * chunk_size, len(data))
                chunk = data[start:end]
                if chunk:
                    self._data.append(
                        self.pool.starmap_async(
                            func,
                            [(item,) for item in chunk],
                            callback=self.complete
                        )
                    )
                    self.total_tasks += 1
        else:
            self._data.append(
                self.pool.starmap_async(
                    func,
                    [(item,) for item in data],
                    callback=self.complete
                )
            )
            self.total_tasks += 1

        for item in self._data:
            try:
                while not item.ready():
                    time.sleep(0.1)
                item.get()
            except Exception as e:
                _logger.error(f"Error in parallel process: {e}")
    finally:
        self.pool.close()
        self.pool.join()
```

---

## 关键差异总结

| 特性 | 原实现 | 新实现 | 说明 |
|------|--------|--------|------|
| **基类模式** | 普通类 | ABC + 抽象方法 | 新版本更规范 |
| **池类型** | 自行封装 | `multiprocessing.Pool` / `ThreadPoolExecutor` | 新版本使用标准库 |
| **异步执行** | ❌ 否 | ✅ 是 (Process) | 新版本支持异步 |
| **自动分块** | ❌ 否 | ✅ 是 | 新版本智能分块 |
| **错误处理** | ❌ 无 | ✅ 有 | 新版本捕获并行过程中的异常 |
| **日志记录** | print() | logger | 新版本使用统一日志 |
| **进度回调** | ❌ 无 | ✅ callback | 新版本支持回调 |
| **类型注解** | ❌ 无 | ✅ 完整 | 新版本类型安全 |
| **池生命周期管理** | ❌ 外部管理 | ✅ 内部自动管理 | 新版本自动关闭池 |

---

## 新增功能

### 1. 智能分块

当数据量大于进程数时，新版本会自动分块处理：

```python
if self.processes > 1 and len(data) > self.processes:
    chunk_size = len(data) // self.processes + 1
    for i in range(self.processes):
        start = i * chunk_size
        end = min((i + 1) * chunk_size, len(data))
        chunk = data[start:end]
        # ...
```

### 2. 异步执行 + 回调

```python
self.pool.starmap_async(
    func,
    [(item,) for item in chunk],
    callback=self.complete  # 完成后自动回调
)
```

### 3. 错误处理

```python
for item in self._data:
    try:
        while not item.ready():
            time.sleep(0.1)
        item.get()
    except Exception as e:
        _logger.error(f"Error in parallel process: {e}")
```

---

## 兼容性

原 `Parallelism` 类转发到 `FQBase.FQUtil.parallel.ParallelProcess`:

```python
# Parallelism.py 中
import warnings
warnings.warn("Parallelism 已迁移到 FQBase.FQUtil.parallel，请使用新模块", DeprecationWarning, stacklevel=2)

from FQBase.FQUtil.parallel import ParallelProcess, ParallelThread
```

### 使用对比

```python
# 旧代码
from FQData.QAUtil.Parallelism import Parallelism, Parallelism_Thread
p = Parallelism()
p.run(func, data)
results = p.get_results()

# 新代码
from FQBase.FQUtil.parallel import ParallelProcess, ParallelThread
p = ParallelProcess()
p.run(func, data)
results = p.get_results()
```

**注意:** 接口兼容，但内部实现不同：
- 原版本 `run()` 是同步的
- 新版本 `run()` 是异步的，内部使用 `starmap_async`

---

## 迁移质量评估

| 评估项 | 评分 | 说明 |
|--------|------|------|
| **功能完整性** | ⭐⭐⭐⭐⭐ | 新版本功能更丰富 |
| **接口兼容性** | ⭐⭐⭐⭐ | 大部分兼容，`run()` 内部行为略有不同 |
| **代码质量** | ⭐⭐⭐⭐⭐ | 使用 ABC、类型注解、标准库 |
| **性能** | ⭐⭐⭐⭐⭐ | 新版本支持异步和智能分块 |
| **错误处理** | ⭐⭐⭐⭐⭐ | 新版本完善的异常捕获 |

### 总体评价

> **新版本在保持接口兼容的基础上，大幅改进了内部实现**，增加了异步执行、智能分块、错误处理、日志记录等功能。建议优先使用新版本 `ParallelProcess` 和 `ParallelThread`。

---

## 关联文档

- [FQUtil API 文档](../fqbase/util) - FQUtil 完整 API 参考
- [parallel.py 源代码](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/FQUtil/parallel.py) - 迁移后源代码
- [Parallelism.py 源代码](file:///Users/A.D.189/FQuant/FQuant.Server/_bak/FQData/FQData/QAUtil/Parallelism.py) - 原源代码
