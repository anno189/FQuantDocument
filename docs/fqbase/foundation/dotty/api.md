# Dotty 模块 API 参考

## 目录

- [函数](#1-函数)
- [Dotty 类](#2-dotty-类)
- [DottyEncoder 类](#3-dottyencoder-类)

---

## 1. 函数

### dotty

```python
def dotty(dictionary=None, no_list=False)
```

Dotty 工厂函数，创建 Dotty 包装器。

**参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `dictionary` | dict | None | 要包装的字典，None 则创建空字典 |
| `no_list` | bool | False | 若为 True，数字键不转换为列表索引 |

**返回**：`Dotty` 实例

**示例**：

```python
d = dotty()  # 空字典
d = dotty({'a': {'b': 1}})
d = dotty({'items': [1, 2, 3]}, no_list=True)
```

---

## 2. Dotty 类

### 初始化

```python
class Dotty
```

**初始化参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `dictionary` | dict | - | 必填，要包装的字典 |
| `separator` | str | '.' | 分隔符 |
| `esc_char` | str | '\\' | 转义字符 |
| `no_list` | bool | False | 禁用列表索引转换 |

**属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `_data` | dict | 原始字典引用 |
| `separator` | str | 分隔符 |
| `esc_char` | str | 转义字符 |
| `no_list` | bool | 禁用列表索引转换 |

### 访问方法

#### __getitem__

```python
def __getitem__(self, item: str)
```

点号访问嵌套值。

**参数**：`item: str` - 点号分隔的键路径

**返回**：嵌套值

**示例**：

```python
d = dotty({'user': {'name': '张三'}})
d['user.name']  # '张三'
d['user']       # {'name': '张三'}
```

#### __getattr__

```python
def __getattr__(self, item: str)
```

属性访问（仅支持单层）。

**参数**：`item: str` - 属性名

**返回**：属性值

**示例**：

```python
d = dotty({'user': {'name': '张三'}})
d.user          # {'name': '张三'}
d.user.name     # '张三' (通过链式调用)
```

#### __contains__

```python
def __contains__(self, item: str) -> bool
```

深度包含检查。

**参数**：`item: str` - 键路径

**返回**：bool - 是否包含该键路径

**示例**：

```python
d = dotty({'user': {'name': '张三'}})
'user.name' in d  # True
'user.age' in d   # False
```

#### get

```python
def get(self, key: str, default=None)
```

安全获取，支持默认值。

**参数**：
- `key: str` - 键路径
- `default` - 默认值

**返回**：键值或默认值

**示例**：

```python
d = dotty({'user': {'name': '张三'}})
d.get('user.name')          # '张三'
d.get('user.age', 30)       # 30
d.get('user.none', 'N/A')   # 'N/A'
```

### 修改方法

#### __setitem__

```python
def __setitem__(self, key: str, value)
```

点号赋值，自动创建路径。

**参数**：
- `key: str` - 键路径
- `value` - 要设置的值

**示例**：

```python
d = dotty({'user': {'name': '张三'}})
d['user.name'] = '李四'      # 修改嵌套值
d['user.age'] = 30          # 创建新键
d['a.b.c'] = 1             # 自动创建路径
```

#### __delitem__

```python
def __delitem__(self, key: str)
```

删除键。

**参数**：`key: str` - 键路径

**示例**：

```python
d = dotty({'user': {'name': '张三', 'age': 30}})
del d['user.age']
d['user']  # {'name': '张三'}
```

### 列表操作

#### 列表索引

```python
d = dotty({'items': [{'name': 'A'}, {'name': 'B'}]})
d['items.0.name']  # 'A'
d['items.1.name']  # 'B'
```

#### 列表切片

```python
d = dotty({'prices': [100, 200, 300, 400, 500]})
d['prices.0:3']   # [100, 200, 300]
d['prices.2:']    # [300, 400, 500]
d['prices.:3']    # [100, 200, 300]
```

### 其他方法

#### copy

```python
def copy(self) -> Dotty
```

返回 Dotty 的浅拷贝。

**返回**：新的 Dotty 实例

#### pop

```python
def pop(self, key: str, default=None)
```

弹出键值。

**参数**：
- `key: str` - 键路径
- `default` - 默认值

**返回**：弹出的值或默认值

#### setdefault

```python
def setdefault(self, key: str, default=None)
```

设置默认值（键不存在时）。

**参数**：
- `key: str` - 键路径
- `default` - 默认值

**返回**：已存在值或默认值

#### to_dict

```python
def to_dict(self) -> dict
```

转换为原生字典。

**返回**：dict

#### to_json

```python
def to_json(self) -> str
```

转换为 JSON 字符串。

**返回**：JSON 格式字符串

#### fromkeys

```python
@staticmethod
def fromkeys(seq, value=None) -> Dotty
```

类方法，创建带默认值的 Dotty。

**参数**：
- `seq` - 键序列
- `value` - 默认值

**返回**：Dotty 实例

**示例**：

```python
Dotty.fromkeys(['a', 'b', 'c'], 0)
# dotty({'a': 0, 'b': 0, 'c': 0})
```

### 特殊方法

#### __len__

```python
def __len__(self) -> int
```

返回字典元素数量。

#### __eq__

```python
def __eq__(self, other) -> bool
```

相等比较。

#### __hash__

```python
def __hash__(self) -> int
```

哈希值（基于字符串表示）。

#### __str__

```python
def __str__(self) -> str
```

字符串表示。

#### __repr__

```python
def __repr__(self) -> str
```

调试表示。

---

## 3. DottyEncoder 类

```python
class DottyEncoder(json.JSONEncoder)
```

JSON 编码器，用于序列化包含 Dotty 对象的数据。

**方法**：override `default(obj)`

**示例**：

```python
import json
from FQBase.Foundation import dotty, DottyEncoder

data = {'d': dotty({'a': {'b': 1}})}
json_str = json.dumps(data, cls=DottyEncoder)
# '{"d": {"a": {"b": 1}}}'
```
