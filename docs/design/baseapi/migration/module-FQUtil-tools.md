---
title: FQUtil/tools.py 迁移报告
---

# FQUtil/tools.py 迁移报告

本文档记录 `QUANTAXIS.QAUtil.QASingleton` 到 `FQBase.FQUtil.tools` 的迁移差异分析。

## 文档链接

| 文件 | 路径 |
|------|------|
| 原文件 | [QASingleton.py](file:///Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QAUtil/QASingleton.py) (备份) |
| 迁移后 | [tools.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/FQUtil/tools.py) (FQBase) |

---

## 迁移概览

| 对比项 | 原文件 | 迁移后 |
|--------|--------|--------|
| **模块路径** | `QUANTAXIS.QAUtil.QASingleton` | `FQBase.FQUtil.tools` |
| **函数数量** | 1 个 | 1 个 |
| **文档注释** | 简单 | 详细 + 示例 |

---

## 函数对比

| 原函数 | 迁移后函数 | 状态 | 说明 |
|--------|------------|------|------|
| `singleton` | `singleton` | ✅ 一致 | 功能完全相同 |

---

## 详细对比

### ✅ `singleton` - 功能完全一致

```python
# 原实现
def singleton(cls):
    """
    单例装饰器
    """
    instances = {}

    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return get_instance

# 新实现
def singleton(cls):
    """
    单例装饰器

    使用字典缓存实现，确保类只有一个实例

    Example:
        @singleton
        class MyClass:
            pass

        obj1 = MyClass()
        obj2 = MyClass()
        assert obj1 is obj2  # True
    """
    instances = {}

    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return get_instance
```

| 对比项 | 原函数 | 新函数 |
|--------|--------|--------|
| **实现方式** | 字典缓存 | 字典缓存 |
| **线程安全** | ❌ 无 | ❌ 无 |
| **功能** | 完全一致 | 完全一致 |
| **文档注释** | 简单说明 | 详细文档 + 使用示例 |

---

## 关键改进

| 改进项 | 说明 |
|--------|------|
| **文档注释** | 新版本添加了详细的文档字符串和示例代码 |
| **代码位置** | 从单独的 `QASingleton.py` 迁移到 `tools.py` (与其他工具函数集成) |

---

## 兼容性

### 使用对比

```python
# 旧代码
from QUANTAXIS.QAUtil.QASingleton import singleton

@singleton
class MyClass:
    pass

obj1 = MyClass()
obj2 = MyClass()
assert obj1 is obj2  # True

# 新代码
from FQBase.FQUtil.tools import singleton

@singleton
class MyClass:
    pass

obj1 = MyClass()
obj2 = MyClass()
assert obj1 is obj2  # True
```

### 重要变化

| 变化 | 说明 |
|------|------|
| **导入路径** | `QUANTAXIS.QAUtil.QASingleton` → `FQBase.FQUtil.tools` |
| **模块组织** | 单独文件 → 集成到 tools.py 模块 |

---

## 迁移质量评估

| 评估项 | 评分 | 说明 |
|--------|------|------|
| **功能一致性** | ⭐⭐⭐⭐⭐ | 功能完全一致 |
| **代码质量** | ⭐⭐⭐⭐⭐ | 新版本添加了详细的文档和示例 |
| **兼容性** | ⭐⭐⭐⭐⭐ | 完全兼容，仅导入路径变化 |

### 总体评价

> **功能完全一致**，新版本改进了文档注释，提供了使用示例，并将其集成到 `tools.py` 模块中。

---

## 关联文档

- [tools.py 源代码](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/FQUtil/tools.py) - 迁移后源代码
- [QASingleton.py 源代码](file:///Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QAUtil/QASingleton.py) - 原源代码
