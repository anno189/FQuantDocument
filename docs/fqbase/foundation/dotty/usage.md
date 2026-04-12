# Dotty 模块使用指南

## 目录

1. [基础用法](#1-基础用法)
2. [深层嵌套访问](#2-深层嵌套访问)
3. [列表操作](#3-列表操作)
4. [数据修改](#4-数据修改)
5. [安全访问](#5-安全访问)
6. [配置数据处理](#6-配置数据处理)
7. [API 响应处理](#7-api-响应处理)
8. [高级用法](#8-高级用法)

---

## 1. 基础用法

### 1.1 创建 Dotty 实例

```python
from FQBase.Foundation import dotty

d = dotty()  # 空字典

data = {'user': {'name': '张三', 'age': 30}}
d = dotty(data)
```

### 1.2 点号访问

```python
data = {'user': {'profile': {'name': '张三'}}}
d = dotty(data)

name = d['user.profile.name']
print(name)  # '张三'
```

### 1.3 属性访问

```python
d = dotty({'user': {'name': '张三'}})

print(d.user)          # {'name': '张三'}
print(d.user.name)     # '张三'
```

### 1.4 赋值

```python
d = dotty({'user': {'name': '张三'}})

d['user.name'] = '李四'
print(d['user.name'])  # '李四'
print(data['user']['name'])  # '李四' (原字典也被修改)
```

---

## 2. 深层嵌套访问

### 2.1 多层嵌套

```python
data = {
    'company': {
        'department': {
            'team': {
                'member': {
                    'name': '张三'
                }
            }
        }
    }
}

d = dotty(data)
name = d['company.department.team.member.name']
print(name)  # '张三'
```

### 2.2 自动创建路径

```python
d = dotty({})

d['a.b.c.d.e'] = 'deep value'
print(d['a.b.c.d.e'])  # 'deep value'
```

### 2.3 混合类型

```python
data = {
    'settings': {
        'theme': 'dark',
        'notifications': {
            'email': True,
            'sms': False
        }
    }
}

d = dotty(data)
print(d['settings.notifications.email'])  # True
```

---

## 3. 列表操作

### 3.1 列表索引

```python
data = {
    'users': [
        {'name': '张三', 'age': 30},
        {'name': '李四', 'age': 25},
        {'name': '王五', 'age': 35}
    ]
}

d = dotty(data)

print(d['users.0.name'])  # '张三'
print(d['users.1.name'])  # '李四'
print(d['users.2.name'])  # '王五'
```

### 3.2 嵌套列表

```python
data = {
    'companies': [
        {
            'name': 'A公司',
            'employees': [
                {'name': '张三'},
                {'name': '李四'}
            ]
        }
    ]
}

d = dotty(data)
print(d['companies.0.employees.0.name'])  # '张三'
```

### 3.3 切片访问

```python
data = {'prices': [100, 200, 300, 400, 500]}
d = dotty(data)

print(d['prices.0:3'])   # [100, 200, 300]
print(d['prices.1:4'])   # [200, 300, 400]
print(d['prices.3:'])    # [400, 500]
print(d['prices.:2'])    # [100, 200]
```

### 3.4 列表自动扩展

```python
d = dotty({'items': []})

d['items.0'] = 'first'
d['items.1'] = 'second'
d['items.2'] = 'third'

print(d['items'])  # ['first', 'second', 'third']
```

---

## 4. 数据修改

### 4.1 修改现有值

```python
data = {'user': {'name': '张三', 'age': 30}}
d = dotty(data)

d['user.age'] = 31
print(d['user.age'])  # 31
```

### 4.2 添加新键

```python
data = {'user': {'name': '张三'}}
d = dotty(data)

d['user.email'] = 'zhang@example.com'
print(d['user.email'])  # 'zhang@example.com'
```

### 4.3 创建嵌套结构

```python
d = dotty({})

d['config.database.host'] = 'localhost'
d['config.database.port'] = 3306
d['config.cache.host'] = 'redis.example.com'

print(d['config'])
# {'database': {'host': 'localhost', 'port': 3306}, 'cache': {'host': 'redis.example.com'}}
```

### 4.4 删除键

```python
data = {'user': {'name': '张三', 'age': 30, 'email': 'zhang@example.com'}}
d = dotty(data)

del d['user.email']
print(d['user'])  # {'name': '张三', 'age': 30}
```

---

## 5. 安全访问

### 5.1 get 方法

```python
data = {'user': {'name': '张三'}}
d = dotty(data)

print(d.get('user.name'))           # '张三'
print(d.get('user.age', 30))       # 30 (默认值)
print(d.get('user.none', 'N/A'))   # 'N/A'
```

### 5.2 不存在的键

```python
data = {'user': {'name': '张三'}}
d = dotty(data)

try:
    print(d['user.age'])
except KeyError:
    print("键不存在")

print(d.get('user.age'))  # None
```

### 5.3 setdefault 方法

```python
data = {'user': {'name': '张三'}}
d = dotty(data)

d.setdefault('user.profile', {'bio': 'Hello'})
print(d['user.profile'])  # {'bio': 'Hello'}

d.setdefault('user.name', 'default')  # 已存在，返回现有值
print(d['user.name'])  # '张三'
```

---

## 6. 配置数据处理

### 6.1 应用配置

```python
config = {
    'app': {
        'name': 'FQuant',
        'version': '1.0.0',
        'debug': False
    },
    'database': {
        'host': 'localhost',
        'port': 3306,
        'credentials': {
            'username': 'admin',
            'password': 'secret'
        }
    },
    'logging': {
        'level': 'INFO',
        'handlers': {
            'file': {'path': '/var/log/app.log'},
            'console': {'enabled': True}
        }
    }
}

d = dotty(config)

print(d['app.name'])                          # 'FQuant'
print(d['database.credentials.username'])     # 'admin'
print(d['logging.handlers.file.path'])        # '/var/log/app.log'
```

### 6.2 修改配置

```python
d['app.debug'] = True
d['database.port'] = 5432
print(config['app']['debug'])  # True (原字典也被修改)
```

---

## 7. API 响应处理

### 7.1 解析 JSON 响应

```python
import json
from FQBase.Foundation import dotty

api_response = '''
{
    "status": "success",
    "data": {
        "users": [
            {"id": 1, "name": "张三", "profile": {"email": "zhang@example.com"}},
            {"id": 2, "name": "李四", "profile": {"email": "li@example.com"}}
        ]
    }
}
'''

response = json.loads(api_response)
d = dotty(response)

print(d['status'])                    # 'success'
print(d['data.users.0.name'])          # '张三'
print(d['data.users.0.profile.email'])  # 'zhang@example.com'
```

### 7.2 提取嵌套数据

```python
users = [
    {
        'id': 1,
        'name': '张三',
        'addresses': [
            {'city': '北京', 'zip': '100000'},
            {'city': '上海', 'zip': '200000'}
        ]
    }
]

d = dotty({'users': users})

for i in range(len(users)):
    name = d[f'users.{i}.name']
    primary_city = d[f'users.{i}.addresses.0.city']
    print(f"{name}: {primary_city}")
```

---

## 8. 高级用法

### 8.1 自定义分隔符

```python
data = {'a': {'b': {'c': 1}}}
d = dotty(data, separator='/')

print(d['a/b/c'])  # 1
```

### 8.2 转义字符

```python
data = {'a.b': {'c': 1}}
d = dotty(data, separator='.')

print(d['a\.b.c'])  # 1
```

### 8.3 禁用列表索引转换

```python
data = {'items': {0: 'zero', 1: 'one'}}
d = dotty(data, no_list=True)

print(d['items.0'])  # 'zero' (字符串键)
print(d['items[0]']) # 需要用方括号
```

### 8.4 复制 Dotty

```python
data = {'user': {'name': '张三'}}
d1 = dotty(data)

d2 = d1.copy()
d2['user.name'] = '李四'

print(d1['user.name'])  # '张三' (原实例不受影响)
print(d2['user.name'])  # '李四'
```

### 8.5 转换为 JSON

```python
import json
from FQBase.Foundation import dotty, DottyEncoder

data = {'user': {'name': '张三'}}
d = dotty(data)

json_str = d.to_json()
print(json_str)  # '{"user": {"name": "张三"}}'

result = json.loads(json_str)
print(result)    # {'user': {'name': '张三'}}
```

### 8.6 在 JSON 序列化中使用

```python
import json
from FQBase.Foundation import dotty, DottyEncoder

data = {'config': dotty({'a': {'b': 1}})}
json_str = json.dumps(data, cls=DottyEncoder)
print(json_str)  # '{"config": {"a": {"b": 1}}}'
```
