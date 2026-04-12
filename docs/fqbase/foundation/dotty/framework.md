# Dotty 模块框架

## 1. 概述

Dotty 是一个嵌套字典访问工具，提供了对深层嵌套字典的便捷访问方式。通过点号(`.`)连接键名，可以像访问属性一样访问嵌套字典的值。

### 1.1 解决的问题

```python
# 传统方式
data = {'user': {'profile': {'name': '张三'}}}
name = data['user']['profile']['name']  # 繁琐

# Dotty 方式
from FQBase.Foundation import dotty
d = dotty(data)
name = d['user.profile.name']  # 简洁
```

### 1.2 何时使用 Dotty

- 配置数据嵌套层级较深
- API 响应数据结构复杂
- 需要频繁访问嵌套字典的场景
- 简化深层字典访问代码

## 2. 核心概念

### 2.1 Dotty 包装器

Dotty 不是一个独立的字典，而是包裹现有字典的代理：

```python
data = {'a': {'b': {'c': 1}}}
d = dotty(data)

d['a.b.c'] = 2
print(data['a']['b']['c'])  # 2 - 原字典被修改
```

### 2.2 分隔符

默认使用 `.` 作为分隔符，可自定义：

```python
d1 = dotty(data, separator='.')
d1['a.b.c']  # 使用点号

d2 = dotty(data, separator='/')
d2['a/b/c']  # 使用斜杠
```

### 2.3 转义字符

如果键名包含分隔符，使用转义字符：

```python
data = {'a.b': {'c': 1}}
d = dotty(data)
d['a\.b.c']  # 转义分隔符
```

## 3. 访问方式

### 3.1 点号访问

```python
d = dotty({'user': {'name': '张三'}})

d['user.name']  # '张三'
```

### 3.2 属性访问

```python
d = dotty({'user': {'name': '张三'}})

d.user.name  # '张三'
```

注意：属性访问不支持嵌套列表和特殊键名。

### 3.3 列表索引

```python
data = {'users': [{'name': '张三'}, {'name': '李四'}]}
d = dotty(data)

d['users.0.name']   # '张三'
d['users.1.name']   # '李四'
```

### 3.4 切片操作

```python
data = {'prices': [100, 200, 300, 400, 500]}
d = dotty(data)

d['prices.0:3']   # [100, 200, 300]
d['prices.2:']    # [300, 400, 500]
d['prices.:3']     # [100, 200, 300]
```

### 3.5 自动类型转换

```python
data = {0: 'zero', 1: 'one'}
d = dotty(data)

d['0']   # 'zero' - 字符串 '0' 自动转换为整数键
d[0]     # 'zero' - 整数键
```

## 4. 数据修改

### 4.1 赋值

```python
d = dotty({'user': {'name': '张三'}})

d['user.name'] = '李四'
print(d['user.name'])  # '李四'
```

### 4.2 自动创建路径

```python
d = dotty({})

d['a.b.c'] = 1
print(d['a.b.c'])  # 1
```

### 4.3 列表自动扩展

```python
d = dotty({'items': []})

d['items.0'] = 'first'
d['items.1'] = 'second'
print(d['items'])  # ['first', 'second']
```

### 4.4 删除

```python
d = dotty({'a': {'b': {'c': 1}}})

del d['a.b.c']
print(d['a.b'])  # {}
```

## 5. 安全访问

### 5.1 get 方法

```python
d = dotty({'user': {'name': '张三'}})

d.get('user.name')          # '张三'
d.get('user.age', 30)      # 30 (默认值)
d.get('user.none', 'N/A')  # 'N/A'
```

### 5.2 setdefault 方法

```python
d = dotty({'user': {'name': '张三'}})

d.setdefault('user.profile', {'age': 30})
print(d['user.profile'])  # {'age': 30}
```

## 6. 转换功能

### 6.1 to_dict

```python
d = dotty({'a': {'b': 1}})
plain = d.to_dict()
print(type(plain))  # <class 'dict'>
```

### 6.2 to_json

```python
import json
d = dotty({'a': {'b': 1}})
json_str = d.to_json()
print(json.loads(json_str))  # {'a': {'b': 1}}
```

## 7. 与原生字典对比

| 操作 | 原生字典 | Dotty |
|------|----------|-------|
| 深层访问 | `d['a']['b']['c']` | `d['a.b.c']` |
| 深层赋值 | `d['a']['b']['c'] = 1` | `d['a.b.c'] = 1` |
| 列表访问 | `d['list'][0]` | `d['list.0']` |
| 切片访问 | `d['list'][0:3]` | `d['list.0:3']` |
| 默认值 | 手动处理 | `d.get('key', default)` |
| 内存占用 | - | 增加代理开销 |
