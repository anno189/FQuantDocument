# Dotty 模块最佳实践

## 目录

1. [使用场景](#1-使用场景)
2. [性能优化](#2-性能优化)
3. [安全注意事项](#3-安全注意事项)
4. [调试技巧](#4-调试技巧)
5. [维护事宜](#5-维护事宜)

---

## 1. 使用场景

### 1.1 适用场景

**推荐使用**：
- 配置数据嵌套层级 ≥ 3 层
- API 响应数据结构复杂
- 需要频繁访问和修改嵌套字典
- 动态配置访问

```python
GOOD:
config = {'db': {'host': 'localhost', 'port': 3306, 'credentials': {'user': 'admin'}}}
d = dotty(config)
user = d['db.credentials.user']
```

**不推荐使用**：
- 扁平字典（直接用原生字典即可）
- 性能敏感的热路径（Dotty 有额外的代理开销）
- 键名包含点号的场景（需要转义，增加复杂度）

### 1.2 不适用场景

```python
BAD:
data = {'name': '张三', 'age': 30}  # 扁平结构，无需 dotty
d = dotty(data)
name = d['name']  # 多此一举
```

### 1.3 替代方案

| 场景 | 替代方案 |
|------|----------|
| 扁平字典 | 原生字典 `data['key']` |
| 固定结构 | 数据类 `@dataclass` |
| 动态结构 | `dict subclass` 或 `collections.namedtuple` |

---

## 2. 性能优化

### 2.1 缓存访问结果

频繁访问同一路径时，缓存结果：

```python
GOOD:
d = dotty(complex_nested_data)
user_name = d['user.profile.name']  # 访问一次

for item in items:
    process(item, user_name)  # 复用缓存值

BAD:
for item in items:
    name = d['user.profile.name']  # 每次都重新解析路径
```

### 2.2 避免在循环中创建 Dotty

```python
GOOD:
d = dotty(data)
for item in items:
    process(item, d)

BAD:
for item in items:
    d = dotty(data)  # 每次循环都创建新实例
    process(item, d)
```

### 2.3 使用原生字典进行批量操作

```python
GOOD:
d = dotty(data)
keys = ['user.name', 'user.email', 'user.age']

for key in keys:
    value = d[key]  # 复用同一 Dotty 实例

BAD:
for key in keys:
    value = dotty(data)[key]  # 每次创建新实例
```

### 2.4 列表 vs 批量

```python
GOOD:
d = dotty({'users': [{'name': 'A'}, {'name': 'B'}]})
for i in range(len(d['users'])):
    name = d[f'users.{i}.name']

BAD:
for user in d['users']:  # 如果只需要 name，这样更简单
    print(user['name'])
```

---

## 3. 安全注意事项

### 3.1 不要修改不属于自己的数据

Dotty 直接修改原字典，确保有权修改：

```python
GOOD:  # 你拥有或明确要修改的数据
config = load_config()
d = dotty(config)
d['app.debug'] = True

BAD:  # 传入的参数可能是只读的
def process(data):
    d = dotty(data)
    d['key'] = 'value'  # 可能引发 TypeError
```

### 3.2 深拷贝隔离

不确定数据来源时，使用深拷贝：

```python
import copy
from FQBase.Foundation import dotty

def safe_process(data):
    safe_data = copy.deepcopy(data)
    d = dotty(safe_data)
    d['key'] = 'value'
    return safe_data
```

### 3.3 验证键路径

在设置值之前验证路径：

```python
def safe_set(d, path, value):
    keys = path.split('.')
    current = d._data

    for key in keys[:-1]:
        if key not in current:
            return False  # 路径无效
        current = current[key]

    d[path] = value
    return True
```

### 3.4 类型安全

Dotty 不做类型检查，必要时自行验证：

```python
d = dotty({'user': {'age': 'thirty'}})  # 字符串而非整数

age = d['user.age']
if not isinstance(age, int):
    raise TypeError(f"Expected int, got {type(age)}")
```

---

## 4. 调试技巧

### 4.1 查看原始数据

```python
d = dotty(complex_data)

print(d)              # 字符串表示
print(d._data)        # 原始字典
print(repr(d))        # 调试表示
```

### 4.2 逐步访问

```python
d = dotty(data)

print(d['user'])              # 第一层
print(d['user.profile'])      # 第二层
print(d['user.profile.name']) # 第三层
```

### 4.3 检查键是否存在

```python
if 'user.profile.name' in d:
    print(d['user.profile.name'])
else:
    print("键不存在")
```

### 4.4 打印所有键

```python
def print_keys(d, prefix=''):
    if isinstance(d, dict):
        for key, value in d.items():
            print(f"{prefix}{key}")
            print_keys(value, prefix + '  ')
    elif isinstance(d, list):
        for i, item in enumerate(d):
            print(f"{prefix}[{i}]")
            print_keys(item, prefix + '  ')

print_keys(d._data)
```

---

## 5. 维护事宜

### 5.1 键名规范

保持键名一致性，便于维护：

```python
GOOD:
data = {
    'user_profile': {'first_name': '张', 'last_name': '三'},
    'user_address': {'city': '北京'}
}

BAD:
data = {
    'userProfile': {'firstName': '张'},  # 驼峰
    'user_address': {'city_name': '北京'}  # 混用
}
```

### 5.2 文档化复杂结构

```python
# config_schema.py
"""
配置结构:

{
    "app": {
        "name": str,
        "version": str,
        "debug": bool
    },
    "database": {
        "host": str,
        "port": int,
        "credentials": {
            "username": str,
            "password": str
        }
    }
}
"""
```

### 5.3 迁移指南

从其他数据结构迁移时，保持兼容性：

```python
def get_nested_value(data, path, default=None):
    """兼容 dotty 和原生字典的获取"""
    if hasattr(data, '_data'):
        return data.get(path, default)
    d = dotty(data)
    return d.get(path, default)
```

### 5.4 检查清单

- [ ] 确认使用场景适合 Dotty（非扁平结构）
- [ ] 不修改外部传入的只读数据
- [ ] 频繁访问时复用 Dotty 实例
- [ ] 键名不包含点号，或使用转义字符
- [ ] 必要时进行类型验证
- [ ] 复杂结构有文档说明
- [ ] 调试时能追溯原始数据结构
