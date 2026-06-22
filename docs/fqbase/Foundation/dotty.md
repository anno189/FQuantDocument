---
title: dotty - 嵌套字典点号访问
description: 提供对嵌套字典的深度键值访问，使用点号连接链式访问
tag:
  - fquant
  - fqbase
  - foundation
  - dotty

summary:
  type: utility
  complexity: low
  maturity: stable
  size: small
  is_pure_function: false
  is_thread_safe: true
  has_config: false
  has_logging: false
  has_security: false
  api_exports:
    total: 3
    functions:
      - name: dotty
        signature: "(dictionary=None, no_list=False) -> Dotty"
        description: Dotty 工厂函数，创建 Dotty 包装器
    classes:
      - name: Dotty
        signature: "class Dotty"
        description: 字典包装器，支持点号深度访问
      - name: DottyEncoder
        signature: "class DottyEncoder"
        description: JSON 编码器，支持 Dotty 对象序列化
  features:
    has_async: false
    is_thread_safe: true
    has_config: false
    has_logging: false
    has_security: false
  source_location: "Foundation/dotty.py"
  source_hash: "b69f5e2c1a8d4e5f3c7b2a1d4e5f6789"
  source_mtime: 1776751707
  last_updated: "2026-04"

relationships:
  belongs_to:
    - fquant.fqbase.foundation
---

# dotty - 嵌套字典点号访问

## 一句话总览

📌 **提供对嵌套字典的深度键值访问，使用点号(.)连接链式访问，支持属性式和下标式两种访问方式。**

## 核心 API

### dotty(dictionary=None, no_list=False)

**位置：** `Foundation/dotty.py#L32`

```python
from FQBase.Foundation import dotty

d = dotty({'user': {'name': '张三'}})
```

**描述：** Dotty 工厂函数，创建 Dotty 包装器

**参数：**

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| dictionary | Dict | None | 任意字典或类字典对象 |
| no_list | bool | False | 若为 True，则数字键不会转换为列表索引 |

**返回：** `Dotty`

---

### class Dotty

**位置：** `Foundation/dotty.py#L46`

**描述：** 字典包装器，支持点号深度访问

**特性：**
- 使用点号链接深层访问
- 支持属性式访问 `d.user.profile.name`
- 支持下标式访问 `d['user.profile.name']`
- 注意：不复制原字典，操作直接反映到原字典

#### 构造参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| dictionary | dict | - | 任意字典或类字典对象 |
| separator | str | '.' | 链接深度访问的分隔符 |
| esc_char | str | '\\' | 分隔符转义字符 |
| no_list | bool | False | 若为 True，则数字键不会转换为列表索引 |

#### 核心方法

| 方法 | 描述 |
|------|------|
| `d['key.nested']` | 下标访问（深度键） |
| `d.key.nested` | 属性访问 |
| `d['key.nested'] = value` | 下标设置 |
| `del d['key.nested']` | 删除键值 |
| `d.get(key, default)` | 安全获取 |
| `d.pop(key, default)` | 弹出键值 |
| `d.setdefault(key, default)` | 设置默认值 |
| `d.copy()` | 返回副本 |
| `d.to_dict()` | 转换为字典 |
| `d.to_json()` | 转换为 JSON 字符串 |
| `'key' in d` | 键存在性检查 |

#### 使用示例

```python
from FQBase.Foundation import dotty

data = {'user': {'profile': {'name': '张三', 'age': 30}}}
d = dotty(data)

print(d['user.profile.name'])
d['user.profile.age'] = 31
print(d['user.profile.age'])

d.user.profile.name
d['list.0'] = 'first'
```

---

### class DottyEncoder

**位置：** `Foundation/dotty.py#L264`

**描述：** JSON 编码器，支持 Dotty 对象序列化

```python
from FQBase.Foundation import DottyEncoder
import json

json.dumps(data, cls=DottyEncoder)
```

---

## 设计模式

- **装饰器模式**：Dotty 包装现有字典，不修改原类
- **代理模式**：Dotty 作为字典的代理，提供深度访问能力

## 使用场景

1. **配置访问**：读取深层嵌套配置
   ```python
   config = dotty(settings)
   db_host = config['database.host']
   ```

2. **数据解析**：解析深层嵌套 JSON
   ```python
   response = requests.get(url).json()
   data = dotty(response)
   value = data['result.items.0.price']
   ```

3. **状态管理**：管理深层嵌套状态
   ```python
   state = dotty({})
   state['user.profile.name'] = '张三'
   ```

## 注意事项

1. **不复制原字典**：操作直接反映到原字典
2. **数字键处理**：默认数字键会转换为列表索引，设置 `no_list=True` 可禁用
3. **分隔符转义**：使用 `\\` 转义分隔符，如 `key\\.with\\.dots`

## 相关文档

- [Foundation README](./README.md)
- [Foundation API](./api.md)
