# FAQ

## 基础问题

### Q: dotty 是什么？

dotty 是一个嵌套字典访问包装器，使用点号(`.`)连接实现深层键值访问。

```python
from FQBase.Foundation.dotty import dotty

data = {'user': {'profile': {'name': '张三', 'age': 30}}}
d = dotty(data)

# 点号访问深层值
print(d['user.profile.name'])  # 张三
print(d['user.profile.age'])   # 30
```

---

### Q: 如何创建 Dotty 对象？

```python
from FQBase.Foundation.dotty import dotty

# 从现有字典创建
data = {'a': 1, 'b': 2}
d = dotty(data)

# 创建空 Dotty
d = dotty()
d['key'] = 'value'

# 直接创建带数据的 Dotty
d = dotty({'user': {'name': 'test'}})
```

---

## 访问问题

### Q: 如何读取嵌套值？

```python
data = {'user': {'profile': {'name': 'test'}}}
d = dotty(data)

# 点号访问
print(d['user.profile.name'])  # test

# 属性访问
print(d.user.profile.name)  # test
```

---

### Q: 如何设置嵌套值？

```python
d = dotty()

# 自动创建中间路径
d['user.profile.name'] = 'test'
print(d['user.profile.name'])  # test

# 覆盖已有值
d['user.profile.name'] = 'new'
print(d['user.profile.name'])  # new
```

---

### Q: 如何检查键是否存在？

```python
data = {'user': {'name': 'test'}}
d = dotty(data)

# 使用 in 操作符
print('user.name' in d)  # True
print('user.email' in d)  # False
print('user.profile.age' in d)  # False
```

---

### Q: 如何获取不存在的键？

```python
d = dotty({'user': {'name': 'test'}})

# get 方法返回默认值
name = d.get('user.name')  # 'test'
email = d.get('user.email')  # None
email = d.get('user.email', 'unknown')  # 'unknown'
```

---

## 列表问题

### Q: 如何访问列表元素？

```python
data = {'users': [{'name': 'Alice'}, {'name': 'Bob'}]}
d = dotty(data)

# 使用数字索引
print(d['users.0.name'])  # Alice
print(d['users.1.name'])  # Bob
```

---

### Q: 如何使用列表切片？

```python
data = {'items': [1, 2, 3, 4, 5]}
d = dotty(data)

# 前3个元素
print(d['items:3'])  # [1, 2, 3]

# 2到4个元素
print(d['items:2:4'])  # [2, 3, 4]

# 最后3个元素
print(d['items:-3:-1'])  # [3, 2] (反向)
```

---

### Q: 数字键什么时候是列表索引？

```python
data = {'items': ['a', 'b', 'c'], '0': 'zero'}

# 默认：数字键优先作为列表索引
d = dotty(data)
print(d['items.0'])  # 'a'

# 设置 no_list=True：数字键作为字典键
d = dotty(data, no_list=True)
print(d['0'])  # 'zero'
```

---

## 数据修改问题

### Q: 修改 Dotty 会影响原字典吗？

```python
data = {'user': {'name': 'test'}}
d = dotty(data)

# 修改 Dotty 会直接修改原字典
d['user.name'] = 'new'
print(data['user']['name'])  # 'new'
```

---

### Q: 如何复制 Dotty？

```python
data = {'user': {'name': 'test'}}
d = dotty(data)

# 复制字典
d_copy = d.copy()
d_copy['user.name'] = 'changed'
print(d['user.name'])  # 'test' - 原 Dotty 不受影响
```

---

### Q: 如何删除键？

```python
data = {'user': {'name': 'test', 'age': 30}}
d = dotty(data)

# 使用 del
del d['user.age']
print('user.age' in d)  # False

# 使用 pop
value = d.pop('user.name')
print(value)  # 'test'
```

---

## 转义问题

### Q: 键名包含点号怎么办？

```python
d = dotty()

# 使用转义字符
d['user\.name'] = 'test'  # 键名包含点号
print(d['user\.name'])  # 'test'
```

---

### Q: 分隔符可以自定义吗？

```python
d = dotty({'user': {'name': 'test'}}, separator='->')

# 使用自定义分隔符
print(d['user->name'])  # test
```

---

## 类型转换问题

### Q: 如何转换为普通字典？

```python
d = dotty({'user': {'name': 'test'}})

# to_dict 方法
data_dict = d.to_dict()
print(type(data_dict))  # <class 'dict'>

# 验证数据独立
data_dict['user']['name'] = 'changed'
print(d['user.name'])  # 'test' - 原数据不受影响
```

---

### Q: 如何转换为 JSON？

```python
d = dotty({'user': {'name': 'test', 'age': 30}})

# to_json 方法
json_str = d.to_json()
print(json_str)  # {"user": {"name": "test", "age": 30}}
```

---

## 常见错误

### Q: 错误：`KeyError: '...'`

**原因**：键路径不存在

```python
d = dotty({'user': {'name': 'test'}})

# 触发错误
try:
    print(d['user.email'])  # KeyError
except KeyError:
    print("Key not found")

# 解决方法：使用 get 方法
print(d.get('user.email', 'default'))  # 'default'
```

---

### Q: 错误：`AttributeError`

**原因**：访问不存在的属性

```python
d = dotty({'user': {'name': 'test'}})

# 触发错误
try:
    print(d.user.email)  # None 而不是 AttributeError
except AttributeError:
    print("Attribute error")
```

---

### Q: 修改没有生效？

**原因**：键路径中间值不是字典或列表

```python
d = dotty({'user': 'not a dict'})

# 触发错误
try:
    d['user.profile.name'] = 'test'  # 无法在字符串下创建路径
except (TypeError, AttributeError):
    print("Cannot create path in non-dict value")
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)