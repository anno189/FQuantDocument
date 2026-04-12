# Dotty 开发指南

## 模块简介

`dotty` 模块提供嵌套字典的点号访问功能，使用点号(`.`)连接实现深层键值访问。

### 核心功能

| 功能 | 说明 |
|------|------|
| 点号访问 | `d['user.profile.name']` 替代 `d['user']['profile']['name']` |
| 属性访问 | `d.user.profile.name` |
| 深度设置 | `d['user.profile.name'] = 'value'` |
| 自动创建 | 自动创建中间字典 |
| 列表支持 | 支持列表索引访问 |

---

## 开发环境

### 环境要求

- Python 3.8+
- pytest（用于测试）

### 安装

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pip install -e .
```

### 验证安装

```bash
python -c "from FQBase.Foundation.dotty import dotty; print('OK')"
```

---

## 本地调试

### 基本调试流程

```python
from FQBase.Foundation.dotty import dotty

# 创建包装器
data = {'user': {'profile': {'name': '张三', 'age': 30}}}
d = dotty(data)

# 读取深层值
print(d['user.profile.name'])  # 张三

# 设置深层值
d['user.profile.age'] = 31
print(d['user.profile.age'])  # 31
```

### 调试属性访问

```python
from FQBase.Foundation.dotty import dotty

data = {'config': {'database': {'host': 'localhost', 'port': 5432}}}
d = dotty(data)

# 属性访问
print(d.config.database.host)  # localhost

# 检查键是否存在
print('config.database.host' in d)  # True
```

### 调试列表访问

```python
from FQBase.Foundation.dotty import dotty

data = {'users': [{'name': 'Alice'}, {'name': 'Bob'}]}
d = dotty(data)

# 列表索引访问
print(d['users.0.name'])  # Alice
print(d['users.1.name'])  # Bob

# 列表切片
d2 = dotty({'items': [1, 2, 3, 4, 5]})
print(d2['items:3'])  # [1, 2, 3]
print(d2['items:2:4'])  # [2, 3]
```

---

## 测试指南

### 运行测试

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pytest -v FQBase/Foundation/test_dotty.py
```

### 测试结构

```python
import pytest
from FQBase.Foundation.dotty import dotty

class TestDotty:
    def test_basic_get(self):
        data = {'a': {'b': {'c': 1}}}
        d = dotty(data)
        assert d['a.b.c'] == 1

    def test_basic_set(self):
        d = dotty()
        d['a.b.c'] = 1
        assert d['a.b.c'] == 1

    def test_list_access(self):
        data = {'items': [1, 2, 3]}
        d = dotty(data)
        assert d['items.0'] == 1
        assert d['items.1'] == 2

    def test_contains(self):
        data = {'user': {'name': 'test'}}
        d = dotty(data)
        assert 'user.name' in d
        assert 'user.email' not in d
```

---

## 代码规范

### 创建规范

```python
# 推荐：从现有字典创建
data = {'user': {'name': 'test'}}
d = dotty(data)

# 推荐：创建空 Dotty
d = dotty()
d['config'] = {}

# 避免：直接操作原始字典
data = {}
d = dotty(data)
# 直接修改 data 不会反映到 d
```

### 访问路径规范

```python
# 推荐：使用点号分隔
d['user.profile.name']

# 避免：混合访问方式
d['user']['profile']['name']  # 不推荐

# 避免：过深的路径
d['a.b.c.d.e.f.g']  # 考虑重构数据结构
```

---

## 调试技巧

### 打印完整数据

```python
from FQBase.Foundation.dotty import dotty

d = dotty()
d['user.profile.name'] = 'test'

# 转换为字典
print(d.to_dict())  # {'user': {'profile': {'name': 'test'}}}

# 转换为 JSON
print(d.to_json())  # {"user": {"profile": {"name": "test"}}}
```

### 检查键是否存在

```python
d = dotty({'user': {'name': 'test'}})

# 使用 in 操作符
if 'user.name' in d:
    print(d['user.name'])
else:
    print("Key not found")

# 使用 get 方法
value = d.get('user.email', 'default@example.com')
```

### 处理缺失键

```python
d = dotty({'user': {'name': 'test'}})

# get 方法返回默认值
name = d.get('user.name')  # 'test'
email = d.get('user.email')  # None
email = d.get('user.email', 'unknown')  # 'unknown'
```

---

## 常见问题

### Q: Dotty 和原始字典有什么区别？

```python
# 原始字典需要层层访问
data = {'user': {'profile': {'name': 'test'}}}
name = data['user']['profile']['name']  # 繁琐

# Dotty 使用点号访问
d = dotty(data)
name = d['user.profile.name']  # 简洁

# 注意：Dotty 包装原字典，不复制数据
d['user.profile.name'] = 'new'
print(data['user']['profile']['name'])  # 'new' - 原字典也被修改
```

### Q: 如何处理包含点号的键名？

```python
d = dotty()

# 使用转义字符
d['user\.name'] = 'test'  # 键名包含点号
print(d['user\.name'])  # 'test'
```

### Q: 数字键会自动转为列表索引吗？

```python
# 默认行为：数字键转为列表索引
data = {'items': [{'name': 'a'}, {'name': 'b'}]}
d = dotty(data)
print(d['items.0.name'])  # 'a'

# 设置 no_list=True 禁用此行为
d = dotty(data, no_list=True)
# d['items.0'] 会尝试查找键名为 '0' 的字典键，而非列表索引
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)
- [FAQ](faq.md)