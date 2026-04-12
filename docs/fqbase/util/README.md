# Util 模块

跨模块工具层，提供编码转换、文件操作、网络工具、并行计算等工具函数。

## 模块结构

```
FQBase/Util/
├── __init__.py           # 模块导出
├── codec.py              # 股票代码格式转换
├── file.py               # 文件处理工具
├── network.py            # 网络工具
├── parallel.py           # 并行计算
├── bar.py                # 时间索引工具
├── converters.py          # 数据转换工具
└── transformer.py        # 格式转换工具
```

## 子模块

| 子模块 | 功能 |
|--------|------|
| [codec](codec.md) | 股票代码格式转换：6位代码、聚宽格式、CTP格式 |
| [file](file.md) | 文件处理：MD5、SHA256、文件大小、目录操作 |
| [network](network.md) | 网络工具：ping、URL 可访问性检查 |
| [parallel](parallel.md) | 并行计算：多进程、多线程封装 |
| [bar](bar.md) | 时间索引：股票/期货分钟线、小时线时间生成 |
| [converters](converters.md) | 数据转换：日期、数字、安全除法、百分比 |
| [transformer](transformer.md) | 格式转换：DataFrame、JSON、字典、列表互转 |

## 快速开始

### 股票代码转换

```python
from FQBase.Util import code_to_6digit, code_to_jqformat

code = code_to_6digit(600000)       # '600000'
jq_code = code_to_jqformat('000001')  # '000001.XSHG'
```

### 文件操作

```python
from FQBase.Util import file_md5, file_exists, ensure_dir

md5 = file_md5('/path/to/file')
if file_exists('/path/to/file'):
    print("File exists")

ensure_dir('/path/to/dir')
```

### 并行计算

```python
from FQBase.Util import ParallelProcess

process = ParallelProcess(max_workers=4)
results = process.map(worker_function, data_list)
```

### 数据转换

```python
from FQBase.Util import date_to_str, safe_divide, percentage_change

date_str = date_to_str(datetime.now())
result = safe_divide(10, 0, default=0)  # 0
change = percentage_change(110, 100)  # 10.0
```

## 设计原则

1. **零依赖**：优先使用 Python 标准库
2. **安全优先**：网络工具防止命令注入
3. **异常友好**：文件操作不抛异常，返回 None/False
4. **类型注解**：关键函数有类型注解

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.md) | 本文档，模块索引 |
| [codec](codec.md) | 股票代码转换 |
| [file](file.md) | 文件操作 |
| [network](network.md) | 网络工具 |
| [parallel](parallel.md) | 并行计算 |
| [bar](bar.md) | 时间索引 |
| [converters](converters.md) | 数据转换 |
| [transformer](transformer.md) | 格式转换 |