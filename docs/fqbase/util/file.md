---
title: File
description: 文件处理工具，提供文件哈希、大小检查、路径操作等功能
tag:
  - fqbase
  - util
  - utility

summary:
  type: utility
  complexity: minimal
  maturity: stable
  functions:
    - file_md5
    - file_sha256
    - file_size
    - file_exists
    - dir_exists
    - ensure_dir
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "检查文件是否存在再进行读取"
    - "计算文件哈希用于缓存验证"
    - "确保目录存在后再写入文件"
  warnings:
    - "hash 函数失败返回 None，需处理"
    - "ensure_dir 创建失败返回 False"
  limitations:
    - "不支持大文件（>1GB）的哈希计算"
    - "仅支持本地文件系统"

relationships:
  belongs_to:
    - fquant.fqbase.util
  depends_on: []
  import_path:
    - from FQBase.Util.file import file_md5, file_exists
---

# File

## 一句话总览

📌 **文件处理工具，文件哈希、大小检查、路径操作**

**TL;DR**：
- 核心能力：文件哈希、文件大小、路径检查、目录创建
- 入门难度：🟢 简单

## 快速开始

```python
from FQBase.Util.file import file_md5, file_exists

if file_exists('data.csv'):
    md5 = file_md5('data.csv')
```

## 函数列表

### file_md5

```python
from FQBase.Util.file import file_md5

result = file_md5(filename)
```

**描述：** 获取文件的 MD5 哈希值

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| filename | str | 是 | 文件路径 |

**返回：** `Optional[str]` - MD5 哈希值，失败返回 None

**示例：**

```python
md5 = file_md5('data.csv')
print(f'MD5: {md5}')
```

---

### file_sha256

```python
from FQBase.Util.file import file_sha256

result = file_sha256(filename)
```

**描述：** 获取文件的 SHA256 哈希值

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| filename | str | 是 | 文件路径 |

**返回：** `Optional[str]` - SHA256 哈希值，失败返回 None

**示例：**

```python
sha256 = file_sha256('data.csv')
print(f'SHA256: {sha256}')
```

---

### file_size

```python
from FQBase.Util.file import file_size

result = file_size(filename)
```

**描述：** 获取文件大小（字节）

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| filename | str | 是 | 文件路径 |

**返回：** `Optional[int]` - 文件大小（字节），文件不存在返回 None

**示例：**

```python
size = file_size('data.csv')
print(f'File size: {size} bytes')
```

---

### file_exists

```python
from FQBase.Util.file import file_exists

result = file_exists(path)
```

**描述：** 检查文件是否存在

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| path | str | 是 | 文件路径 |

**返回：** `bool` - 文件是否存在

**示例：**

```python
if file_exists('data.csv'):
    print('File exists!')
```

---

### dir_exists

```python
from FQBase.Util.file import dir_exists

result = dir_exists(path)
```

**描述：** 检查目录是否存在

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| path | str | 是 | 目录路径 |

**返回：** `bool` - 目录是否存在

**示例：**

```python
if dir_exists('data'):
    print('Directory exists!')
```

---

### ensure_dir

```python
from FQBase.Util.file import ensure_dir

result = ensure_dir(path)
```

**描述：** 确保目录存在，不存在则创建

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| path | str | 是 | 目录路径 |

**返回：** `bool` - 是否成功

**示例：**

```python
if ensure_dir('data/output'):
    print('Directory ready!')
```

---

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01-01 | 初始版本 |
