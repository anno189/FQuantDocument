# File 模块

文件处理工具，提供文件哈希、文件属性、目录操作等功能。

## 设计特点

- **异常友好**：所有函数在文件不存在或权限问题时返回 `None` 或 `False`，不会抛出异常
- **安全可靠**：适合在不确定文件是否存在的情况下使用

---

## 函数

### file_md5

计算文件的 MD5 哈希值。

```python
from FQBase.Util import file_md5

md5 = file_md5('/path/to/file')
# 返回: 'd41d8cd98f00b204e9800998ecf8427e' 或 None
```

**返回值**：
- 成功：MD5 哈希值字符串
- 失败：`None`（文件不存在、权限问题等）

---

### file_sha256

计算文件的 SHA256 哈希值。

```python
from FQBase.Util import file_sha256

sha256 = file_sha256('/path/to/file')
# 返回: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' 或 None
```

---

### file_size

获取文件大小（字节）。

```python
from FQBase.Util import file_size

size = file_size('/path/to/file')
if size:
    print(f"文件大小: {size} 字节")
else:
    print("文件不存在")
```

**返回值**：
- 成功：文件大小（整数）
- 失败：`None`

---

### file_exists

检查文件是否存在。

```python
from FQBase.Util import file_exists

if file_exists('/path/to/file'):
    print("文件存在")
else:
    print("文件不存在")
```

**返回值**：`True` 或 `False`

---

### dir_exists

检查目录是否存在。

```python
from FQBase.Util import dir_exists

if dir_exists('/path/to/dir'):
    print("目录存在")
else:
    print("目录不存在")
```

**返回值**：`True` 或 `False`

---

### ensure_dir

确保目录存在，不存在则创建。

```python
from FQBase.Util import ensure_dir

if ensure_dir('/path/to/new/dir'):
    print("目录创建成功")
else:
    print("目录创建失败（权限问题）")
```

**返回值**：
- 成功：`True`
- 失败：`False`（权限问题等）

---

## 使用示例

### 文件校验

```python
from FQBase.Util import file_md5, file_sha256, file_size

def verify_file(file_path, expected_md5=None, expected_sha256=None):
    """验证文件完整性"""
    results = {
        'exists': file_exists(file_path),
        'size': file_size(file_path),
        'md5': file_md5(file_path),
        'sha256': file_sha256(file_path)
    }

    if expected_md5 and results['md5'] != expected_md5:
        print(f"MD5 不匹配: {results['md5']} != {expected_md5}")

    if expected_sha256 and results['sha256'] != expected_sha256:
        print(f"SHA256 不匹配: {results['sha256']} != {expected_sha256}")

    return results
```

### 目录初始化

```python
from FQBase.Util import dir_exists, ensure_dir

def setup_data_directory(base_path):
    """设置数据目录结构"""
    dirs = [
        f'{base_path}/cache',
        f'{base_path}/logs',
        f'{base_path}/data',
        f'{base_path}/temp'
    ]

    for d in dirs:
        if not dir_exists(d):
            ensure_dir(d)
            print(f"创建目录: {d}")
        else:
            print(f"目录已存在: {d}")
```

### 批量文件处理

```python
from FQBase.Util import file_exists, file_size, file_md5
import os

def batch_file_info(directory):
    """批量获取文件信息"""
    results = []

    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)

        if file_exists(filepath):
            results.append({
                'name': filename,
                'size': file_size(filepath),
                'md5': file_md5(filepath)
            })

    return results
```

---

## 日志记录

文件操作失败时会记录日志：

```python
from FQBase.Util import file_md5
import logging

# 配置日志
logging.basicConfig(level=logging.DEBUG)

md5 = file_md5('/nonexistent/file')
# DEBUG: File not found: /nonexistent/file

md5 = file_md5('/protected/file')
# WARNING: Permission denied: /protected/file
```

---

## 相关文档

- [Util 模块](../README.md)
- [网络工具](../network.md)
- [数据转换](../converters.md)