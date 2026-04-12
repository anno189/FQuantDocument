# module-FQUtil-file.md

# 模块迁移报告: FQUtil-file

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | QUANTAXIS.QAUtil.QAFile | FQUtil.file |
| **原文件** | `_bak/QUANTAXIS/QAUtil/QAFile.py` | `FQBase/FQBase/FQUtil/file.py` |
| **功能** | 文件处理工具 | 文件处理工具 |

## 迁移对比

### 原实现 (QAFile.py)

```python
import hashlib
import os

def QA_util_file_md5(filename):
    """获取文件的MD5值"""
    with open(filename, mode='rb') as f:
        d = hashlib.md5()
        while True:
            buf = f.read(4096)
            if not buf:
                break
            d.update(buf)
        return d.hexdigest()

def QA_util_file_size(filename):
    return os.path.getsize(file)  # BUG: 使用了未定义的 'file'
```

### 迁移后 (file.py)

```python
import hashlib
import os
from typing import Optional

def file_md5(filename: str) -> str:
    """获取文件的MD5值"""
    with open(filename, mode='rb') as f:
        d = hashlib.md5()
        while True:
            buf = f.read(4096)
            if not buf:
                break
            d.update(buf)
        return d.hexdigest()

def file_sha256(filename: str) -> str:
    """获取文件的SHA256值"""
    with open(filename, mode='rb') as f:
        d = hashlib.sha256()
        while True:
            buf = f.read(4096)
            if not buf:
                break
            d.update(buf)
        return d.hexdigest()

def file_size(filename: str) -> int:
    """获取文件大小"""
    return os.path.getsize(filename)

def file_exists(path: str) -> bool:
    """检查文件是否存在"""
    return os.path.isfile(path)

def dir_exists(path: str) -> bool:
    """检查目录是否存在"""
    return os.path.isdir(path)

def ensure_dir(path: str) -> None:
    """确保目录存在，不存在则创建"""
    os.makedirs(path, exist_ok=True)
```

## Bug修复

| Bug | 原代码 | 修复后 |
|-----|--------|--------|
| 未定义变量 | `os.path.getsize(file)` | `os.path.getsize(filename)` |

## 功能对比

| 功能 | 原实现 | 迁移后 |
|------|--------|--------|
| MD5计算 | ✅ `QA_util_file_md5` | ✅ `file_md5` |
| SHA256计算 | ❌ 无 | ✅ `file_sha256` (新增) |
| 文件大小 | ⚠️ 有bug | ✅ `file_size` |
| 文件存在检查 | ❌ 无 | ✅ `file_exists` (新增) |
| 目录存在检查 | ❌ 无 | ✅ `dir_exists` (新增) |
| 创建目录 | ❌ 无 | ✅ `ensure_dir` (新增) |
| 类型注解 | ❌ 无 | ✅ 完整类型注解 |

## 兼容接口

| 原函数 | 迁移后兼容函数 |
|--------|---------------|
| `QA_util_file_md5` | `file_md5` (重命名) |
| `QA_util_file_size` | `file_size` (重命名，bug已修复) |

## 使用示例

```python
from FQUtil.file import (
    file_md5, file_sha256, file_size,
    file_exists, dir_exists, ensure_dir
)

# 计算文件哈希
md5 = file_md5('test.txt')
sha256 = file_sha256('test.txt')

# 文件大小
size = file_size('test.txt')  # 原代码有bug，迁移后修复

# 路径检查
if file_exists('config.json'):
    print("File exists")

if dir_exists('./logs'):
    print("Directory exists")

# 确保目录存在
ensure_dir('./output/data')
```

## 相关文件

- [file.py](../../FQBase/FQBase/FQUtil/file.py) - 本模块
- [logger.md](module-FQUtil-logger.md) - 日志模块
- [tools.md](module-FQUtil-tools.md) - 工具模块
- [network.md](module-FQUtil-network.md) - 网络工具

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **Bug修复** | ✅ 修复了 `file_size` 的未定义变量bug |
| **向后兼容** | ⏳ 可提供 `QA_util_file_*` 兼容接口 |
| **API文档** | ✅ Docstring完整 |
| **新增功能** | ✅ SHA256, file_exists, dir_exists, ensure_dir |
| **类型注解** | ✅ 完整 |
