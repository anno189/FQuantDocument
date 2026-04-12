# dotty 模块文档

## 模块概述

dotty 模块是 FQuant 量化交易系统的嵌套字典访问工具模块，提供对嵌套字典的深度键值访问能力，使用点号(`.`)连接实现链式访问。该模块基于 [dotty\_dict](https://github.com/pawelzny/dotty_dict) 库集成，为整个量化系统提供便捷的嵌套数据操作支持。

### 核心特性

- **点号链式访问**: `data['user.profile.name']` 代替 `data['user']['profile']['name']`
- **代理模式**: 不复制原字典，所有修改双向同步
- **自动类型转换**: 数字字符串自动转为列表索引
- **列表切片支持**: `data.items[0:3].name` 语法
- **LRU 缓存优化**: `@lru_cache(maxsize=32)` 加速重复访问
- **JSON 序列化**: 支持 `to_json()` 和 `to_dict()` 转换

## 导入方式

```python
# 方式1: 从 FQUtil 直接导入 (推荐)
from FQBase.FQBase.FQUtil import dotty, Dotty, DottyEncoder

# 方式2: 导入整个 FQUtil 模块
import FQBase.FQBase.FQUtil as FQUtil
d = FQUtil.dotty({'a': {'b': 1}})
```

## 核心功能

### `dotty()` - 工厂函数

**功能说明**: 创建 Dotty 包装器，包裹现有字典或创建新字典。

**参数说明**:

- `dictionary=None`: 任意字典或类字典对象，默认为空字典
- `no_list=False`: 若为 True，则数字键不会转换为列表索引

**返回值**: Dotty 实例

**使用示例**:

```python
# 创建空 Dotty
d = dotty()

# 创建带数据的 Dotty
data = {'user': {'name': '张三'}}
d = dotty(data)

# 禁用数字键转列表
d = dotty({'items': {'0': 'value'}}, no_list=True)
```

**异常说明**:

- `AttributeError`: 如果传入的 `dictionary` 参数不是字典或类字典对象，将抛出 `AttributeError`

```python
# 非字典输入会抛出 AttributeError
try:
    dotty(['not', 'valid'])
except AttributeError as e:
    print(f"错误: {e}")  # Dictionary must be type of dict
```

### `Dotty` - 核心类

**功能说明**: 字典包装器，支持点号深度访问。包裹字典并提供代理，快速访问深层键值。

**构造函数参数**:

- `dictionary`: 任意字典或类字典对象
- `separator='.'`: 链接深度访问的分隔符，默认 `.`
- `esc_char='\\'`: 分隔符转义字符
- `no_list=False`: 若为 True，则数字键不会转换为列表索引

### 比较运算

#### 相等比较 `d == other`

**功能说明**: Dotty 可以与普通字典或另一个 Dotty 进行相等比较。

**返回值**: 布尔值

**使用示例**:

```python
# Dotty 与普通字典比较
plain = {'a': 1, 'b': 2}
d = dotty(plain)
print(d == plain)  # True

# 两个 Dotty 比较
d1 = dotty({'a': 1})
d2 = dotty({'a': 1})
print(d1 == d2)  # True

# 与非映射类型比较
print(d == [('a', 1), ('b', 2)])  # False
print(d == {1, 2, 3})  # False
```

#### 哈希 `hash(d)`

**功能说明**: Dotty 对象可被哈希（基于字符串表示）。

**返回值**: 整数哈希值

**使用示例**:

```python
d = dotty({'a': 1, 'b': 2})
print(hash(d))  # 可以获取哈希值

# 可用于字典键或集合
s = {d, dotty({'c': 3})}
print(len(s))  # 2
```

#### `str(d)` - 字符串表示

**功能说明**: 返回 Dotty 包装的字典的字符串表示。

**返回值**: 字符串

**使用示例**:

```python
d = dotty({'a': 1, 'b': 2})
print(str(d))  # {'a': 1, 'b': 2}
```

#### `repr(d)` - 官方表示

**功能说明**: 返回 Dotty 对象的官方表示字符串。

**返回值**: 字符串，格式为 `Dotty(dictionary={...}, separator='.', esc_char='\\')`

**使用示例**:

```python
d = dotty({'a': 1})
print(repr(d))
# Dotty(dictionary={'a': 1}, separator='.', esc_char='\\')
```

### 深度访问

#### `d['a.b.c']` - 方括号访问

**功能说明**: 使用点号链式访问嵌套字典的值。

**使用示例**:

```python
data = {'user': {'profile': {'name': '张三', 'age': 30}}}
d = dotty(data)

# 深度读取
print(d['user.profile.name'])  # '张三'
print(d['user.profile.age'])    # 30

# 深度写入
d['user.profile.city'] = '北京'
print(d['user.profile.city'])   # '北京'
```

#### `d.a.b.c` - 属性访问

**功能说明**: 直接使用属性链式访问嵌套字典的值。

**使用示例**:

```python
data = {'user': {'profile': {'name': '张三'}}}
d = dotty(data)

# 属性链式访问
print(d.user.profile.name)  # '张三'
```

### 列表操作

#### 列表索引 `d['list.0']`

**功能说明**: 数字字符串自动转换为列表索引。

**使用示例**:

```python
data = {'scores': [90, 85, 92, 88]}
d = dotty(data)

print(d['scores.0'])  # 90
print(d['scores.1'])  # 85
print(d['scores.-1']) # 报错，不支持负索引
```

**特殊说明**: 如果字段值为 `None`，访问列表索引会返回 `None` 而不抛出异常：

```python
data = {'field': None}
d = dotty(data)
print(d['field.0'])  # None (不会抛出异常)
```

#### 列表切片 `d['list.0:3']`

**功能说明**: 支持 Python 切片语法访问列表子集。

**使用示例**:

```python
data = {'items': [10, 20, 30, 40, 50]}
d = dotty(data)

print(d['items.0:3'])    # [10, 20, 30]
print(d['items.1:4'])    # [20, 30, 40]
print(d['items.:3'])     # [10, 20, 30]
print(d['items.3:'])    # [40, 50]
```

#### 列表切片提取字段 `d['list.:2.field']`

**功能说明**: 切片操作可以与字段访问组合，快速提取列表中每个元素的特定字段。

**使用示例**:

```python
data = {
    'annotations': [
        {'label': 'app', 'value': 'webapi'},
        {'label': 'role', 'value': 'admin'},
        {'label': 'service', 'value': 'mail'},
        {'label': 'database', 'value': 'postgres'}
    ]
}
d = dotty(data)

# 获取所有 annotations 的 label 字段
print(d['annotations.:.label'])    # ['app', 'role', 'service', 'database']

# 获取前 2 个的 label
print(d['annotations.:2.label'])   # ['app', 'role']

# 获取从第 3 个开始的所有 label
print(d['annotations.2:.label'])   # ['service', 'database']

# 隔一个取一个
print(d['annotations.::2.label'])  # ['app', 'service']
```

#### 嵌套切片 + 字段

**功能说明**: 支持多层嵌套的列表切片和字段访问组合。

```python
data = {
    'field': [
        [
            {'nestedsubfield': 'value001'},
            {'nestedsubfield': 'value002'}
        ],
        [
            {'nestedsubfield': 'value101'},
            {'nestedsubfield': 'value102'}
        ]
    ]
}
d = dotty(data)

# 两层嵌套的切片+字段
result = d['field.:.nestedsubfield.:.nestedsubfield']
print(result)
# [['value001', 'value002'], ['value101', 'value102']]
```

### 字典操作方法

#### `d.keys()` - 获取键列表

**功能说明**: 返回字典顶层键的列表（不支持点号链式访问）。

**返回值**: 字典键的视图对象

**使用示例**:

```python
data = {'user': {'name': '张三', 'age': 30}, 'status': 'ok'}
d = dotty(data)

keys = sorted(d.keys())
print(keys)  # ['status', 'user']

# 访问深层键的键
deep_keys = sorted(d['user'].keys())
print(deep_keys)  # ['age', 'name']
```

#### `len(d)` - 获取长度

**功能说明**: 返回字典顶层键的数量。

**返回值**: 整数，键的数量

**使用示例**:

```python
data = {'user': {'name': '张三'}, 'status': 'ok', 'data': {}}
d = dotty(data)

print(len(d))       # 3 (顶层键数量)
print(len(d['user']))  # 2 (user 嵌套字典的键数量)
```

#### `d.get(key, default=None)` - 安全获取

**功能说明**: 获取深层键值，键不存在时返回默认值。

**参数说明**:

- `key`: 单个键或点号链式键字符串
- `default`: 键不存在时返回的默认值

**返回值**: 键对应的值或默认值

**使用示例**:

```python
data = {'user': {'profile': {'name': '张三'}}}
d = dotty(data)

print(d.get('user.profile.name'))           # '张三'
print(d.get('user.profile.age', 0))         # 0
print(d.get('not.exist.key', 'default'))     # 'default'
```

#### `d['key'] = value` - 深度赋值

**功能说明**: 设置深层键值，自动创建必要的嵌套结构。

**使用示例**:

```python
d = dotty()

# 自动创建嵌套字典
d['user.profile.name'] = '张三'
d['user.profile.age'] = 30

# 自动创建嵌套列表
d['items.0'] = 'first'
d['items.1'] = 'second'
print(d['items'])  # ['first', 'second']
```

#### `d.pop(key, default=None)` - 弹出值

**功能说明**: 弹出深层键值，键不存在时返回默认值。

**参数说明**:

- `key`: 单个键或点号链式键字符串
- `default`: 键不存在时返回的默认值

**返回值**: 弹出的值或默认值

**使用示例**:

```python
data = {'user': {'name': '张三', 'age': 30}}
d = dotty(data)

name = d.pop('user.name')
print(name)           # '张三'
print(d.get('user.name'))  # None

value = d.pop('not.exist', 'default')
print(value)          # 'default'
```

#### `d.setdefault(key, default=None)` - 不存在则设置

**功能说明**: 获取键值，若键不存在则设置默认值并返回。

**参数说明**:

- `key`: 单个键或点号链式键字符串
- `default`: 键不存在时设置的默认值

**返回值**: 键对应的值或默认值

**使用示例**:

```python
data = {'user': {'name': '张三'}}
d = dotty(data)

# 键已存在，直接返回
name = d.setdefault('user.name', '李四')
print(name)  # '张三'

# 键不存在，设置并返回
city = d.setdefault('user.city', '北京')
print(city)  # '北京'
print(d['user.city'])  # '北京'
```

#### `'key' in d` - 包含检查

**功能说明**: 递归检查深层键是否存在。

**使用示例**:

```python
data = {'user': {'profile': {'name': '张三'}}}
d = dotty(data)

print('user.profile.name' in d)  # True
print('user.profile.age' in d)   # False
print('user.city' in d)          # False
```

#### `del d['key']` - 删除键

**功能说明**: 删除深层键值。

**使用示例**:

```python
data = {'user': {'name': '张三', 'age': 30}}
d = dotty(data)

del d['user.age']
print(d.get('user.age'))  # None
```

### 序列化方法

#### `d.to_dict()` - 转换为字典

**功能说明**: 将 Dotty 对象转换为普通字典。

**返回值**: 普通字典对象

**使用示例**:

```python
data = {'user': {'name': '张三', 'scores': [90, 85]}}
d = dotty(data)

plain_dict = d.to_dict()
print(type(plain_dict))  # <class 'dict'>
print(plain_dict)  # {'user': {'name': '张三', 'scores': [90, 85]}}
```

#### 嵌套 Dotty 对象转换

**功能说明**: 如果字典中包含嵌套的 Dotty 对象，`to_dict()` 会正确递归转换。

```python
# 嵌套 Dotty 转 dict
nested_dot = dotty({'wazaa': 3})
top_dot = dotty({'hello': {'world': 1}})
top_dot['nested.dotty'] = nested_dot

result = top_dot.to_dict()
print(result)
# {'hello': {'world': 1}, 'nested': {'dotty': {'wazaa': 3}}}
```

```python
# 列表中嵌套 Dotty 转 dict
dot_list = [dotty({'dot1': 1}), dotty({'dot2': 2})]
top_dot = dotty({'testlist': dot_list})

result = top_dot.to_dict()
print(result)
# {'testlist': [{'dot1': 1}, {'dot2': 2}]}
```

#### `d.to_json()` - 转换为 JSON 字符串

**功能说明**: 将 Dotty 对象序列化为 JSON 字符串。

**返回值**: JSON 字符串

**使用示例**:

```python
import json
data = {'user': {'name': '张三', 'score': 95.5}}
d = dotty(data)

json_str = d.to_json()
print(json_str)  # {"user": {"name": "张三", "score": 95.5}}

# 使用 json.loads 反解析
parsed = json.loads(json_str)
print(parsed['user']['name'])  # '张三'
```

#### `DottyEncoder` - JSON 编码器

**功能说明**: 自定义 JSON 编码器，用于处理 Dotty 对象的 JSON 序列化。

**使用示例**:

```python
import json
from FQBase.FQBase.FQUtil import dotty, DottyEncoder

data = {'nested': {'value': 123}}
d = dotty(data)

json_str = json.dumps(d, cls=DottyEncoder)
print(json_str)  # {"nested": {"value": 123}}
```

### 其他方法

#### `d.copy()` - 浅拷贝

**功能说明**: 返回 Dotty 包装的字典的浅拷贝。

**返回值**: 新的 Dotty 实例

**使用示例**:

```python
data = {'user': {'name': '张三'}}
d = dotty(data)

d_copy = d.copy()
d_copy['user.name'] = '李四'

print(d['user.name'])   # '张三' (原字典不变)
print(d_copy['user.name'])  # '李四'
```

#### `Dotty.fromkeys(seq, value=None)` - 类方法

**功能说明**: 创建以 seq 为键、value 为值的 Dotty 字典。

**参数说明**:

- `seq`: 键的序列
- `value=None`: 初始值，默认为 None

**返回值**: 新的 Dotty 实例

**使用示例**:

```python
d = Dotty.fromkeys(['a', 'b', 'c'], 0)
print(d['a'])  # 0
print(d['b'])  # 0
print(d['c'])  # 0
```

#### `d._split(key)` - 键分割

**功能说明**: 内部方法，将点号连接的键字符串分割为列表。

**使用示例**:

```python
d = dotty({'a': 1})
keys = d._split('user.profile.name')
print(keys)  # ['user', 'profile', 'name']
```

## 高级用法

### 自定义分隔符

**功能说明**: 使用自定义分隔符替代点号。

**使用示例**:

```python
# 使用冒号作为分隔符
d = Dotty({'a': {'b': 1}}, separator=':')
print(d['a:b'])  # 1

# 使用下划线作为分隔符
d2 = Dotty({'user': {'name': '张三'}}, separator='_')
print(d2['user_name'])  # '张三'
```

### 禁用数字键转列表

**功能说明**: 当字典键确实是数字字符串时，禁用自动转列表索引。

**使用示例**:

```python
# 默认行为：数字键转为列表索引
d1 = dotty({'items': ['a', 'b', 'c']})
print(d1['items.0'])  # 'a'

# 禁用转换：数字键保持为字符串
d2 = dotty({'items': {'0': 'string_key'}}, no_list=True)
print(d2['items.0'])  # 'string_key'
```

### 代理模式验证

**功能说明**: Dotty 不复制原字典，所有修改双向同步。

**使用示例**:

```python
original = {'inner': {'key': 'original'}}
d = dotty(original)

# 通过 Dotty 修改
d['inner.key'] = 'modified'

# 原字典被修改
print(original['inner']['key'])  # 'modified'

# 通过原字典修改
original['inner']['key'] = 'changed'
print(d['inner.key'])  # 'changed'
```

### 转义分隔符

**功能说明**: 如果键中包含点号(`.`)，需要使用转义字符 `\\` 来访问。

**使用示例**:

```python
# 键中包含点号
data = {
    'key.with.dot': {'deeper': 'value'},
    'deep': {'key': 'normal_value'}
}
d = dotty(data)

# 使用转义字符访问
print(d[r'key\.with\.dot.deeper'])  # 'value'

# 普通键访问不受影响
print(d['deep.key'])  # 'normal_value'
```

### 转义转义字符

**功能说明**: 如果键中包含反斜杠和点号，需要双重转义。

**使用示例**:

```python
# 键中包含反斜杠和点号
data = {
    'key.with_backslash\\': {'deeper': 'other value'}
}
d = dotty(data)

# 需要先转义反斜杠，再转义点号
print(d[r'key\.with_backslash\\.deeper'])  # 'other value'
```

### 自动类型转换

**功能说明**: 当访问的键不存在时，Dotty 会自动尝试将键转换为字典中存在的类型。

**使用示例**:

```python
# 字典中同时存在字符串键和整数键
data = {
    '2': 'string_value',
    2: 'int_value',
    'nested': {
        '2': 'nested_string_value',
        3: 'nested_int_value'
    }
}
d = dotty(data)

# 自动识别类型
print(d['2'])               # 'string_value'
print(d[2])                 # 'int_value'
print(d['nested.2'])        # 'nested_string_value'
print(d['nested.3'])        # 'nested_int_value'
```

### LRU 缓存

**功能说明**: `__getitem__` 方法使用 LRU 缓存（最大 32 条），重复访问相同键时直接从缓存返回，提高性能。

**使用示例**:

```python
d = dotty({'x': {'y': {'z': 1}}})

# 清除缓存
d.__getitem__.cache_clear()

# 首次访问（缓存未命中）
print(d['x.y.z'])  # 1

# 再次访问（缓存命中）
print(d['x.y.z'])  # 1

# 查看缓存统计
info = d.__getitem__.cache_info()
print(f"命中: {info.hits}, 未命中: {info.misses}")
# 命中: 1, 未命中: 1
```

### 非标准键类型

**功能说明**: Dotty 支持使用 float、bool、None 等非标准类型作为键。

**使用示例**:

```python
# 使用多种类型的键
data = {
    3.3: 'float_key',
    True: 'bool_key',
    None: 'none_key',
    'nested': {
        4.4: 'nested_float'
    }
}
d = Dotty(data, separator=',')

print(d[3.3])            # 'float_key'
print(d[True])           # 'bool_key'
print(d[None])           # 'none_key'
print(d['nested,4.4'])   # 'nested_float'
```

## 应用场景

### 1. 配置管理

```python
# 多层嵌套配置的读写
config = {
    'database': {
        'host': 'localhost',
        'port': 3306,
        'credentials': {
            'user': 'admin',
            'password': 'secret'
        }
    }
}

d = dotty(config)
print(d['database.host'])              # 'localhost'
print(d['database.credentials.user'])  # 'admin'
```

### 2. API 响应解析

```python
# 解析嵌套的 API 响应
response = {
    'data': {
        'users': [
            {'id': 1, 'name': '张三'},
            {'id': 2, 'name': '李四'}
        ]
    },
    'meta': {'total': 100}
}

d = dotty(response)
print(d['meta.total'])           # 100
print(d['data.users.0.name'])     # '张三'
print(d['data.users.1.name'])    # '李四'
```

### 3. 金融数据操作

```python
# 处理股票 K 线数据
kline_data = {
    'stock': '000001',
    'daily': {
        'open': 12.50,
        'high': 13.20,
        'low': 12.30,
        'close': 13.00,
        'volume': 1000000
    }
}

d = dotty(kline_data)
print(d['daily.close'])           # 13.00
d['daily.return'] = 0.04
print(d['daily.return'])          # 0.04
```

### 4. 策略参数管理

```python
# 管理策略的多层参数
strategy_params = {
    'ma_strategy': {
        'short_window': 5,
        'long_window': 20,
        'thresholds': {
            'entry': 0.02,
            'exit': -0.01
        }
    }
}

d = dotty(strategy_params)
print(d['ma_strategy.thresholds.entry'])  # 0.02
d['ma_strategy.thresholds.stop_loss'] = -0.03
```

## 综合使用示例

### 示例1：基础 CRUD 操作

```python
from FQBase.FQBase.FQUtil import dotty, Dotty

# 1. 创建 Dotty 对象
d = dotty()

# 2. 深度写入（自动创建嵌套结构）
d['user.profile.name'] = '张三'
d['user.profile.age'] = 30
d['user.profile.scores'] = [90, 85, 92]

# 3. 深度读取
print(f"用户名: {d['user.profile.name']}")
print(f"年龄: {d['user.profile.age']}")
print(f"第一个成绩: {d['user.profile.scores.0']}")

# 4. 更新
d['user.profile.age'] = 31
print(f"更新后年龄: {d['user.profile.age']}")

# 5. 删除
del d['user.profile.scores']
print(f"成绩已删除: {d.get('user.profile.scores')}")

# 6. 检查存在性
print(f"是否存在年龄: {'user.profile.age' in d}")
print(f"是否存在成绩: {'user.profile.scores' in d}")
```

### 示例2：列表和切片操作

```python
from FQBase.FQBase.FQUtil import dotty

# 1. 准备数据
data = {
    'portfolio': {
        'stocks': [
            {'code': '000001', 'price': 12.50, 'shares': 1000},
            {'code': '000002', 'price': 8.30, 'shares': 2000},
            {'code': '600000', 'price': 6.20, 'shares': 1500}
        ]
    }
}

d = dotty(data)

# 2. 访问列表元素
print(f"第一只股票: {d['portfolio.stocks.0.code']}")
print(f"第二只股票价格: {d['portfolio.stocks.1.price']}")

# 3. 批量操作
d['portfolio.stocks.2.shares'] = 1800
print(f"第三只股票数量更新: {d['portfolio.stocks.2.shares']}")

# 4. 添加新元素
d['portfolio.stocks.3'] = {'code': '300001', 'price': 15.00, 'shares': 500}
print(f"股票数量: {len(d['portfolio.stocks'])}")
```

### 示例3：JSON 序列化

```python
import json
from FQBase.FQBase.FQUtil import dotty, DottyEncoder

# 1. 创建嵌套数据
market_data = {
    'market': 'A股',
    'data': {
        'index': '上证指数',
        'value': 3200.50,
        'change': 25.30,
        'stocks': [
            {'code': '000001', 'name': '平安银行', 'change_pct': 2.5},
            {'code': '600000', 'name': '浦发银行', 'change_pct': -1.2}
        ]
    }
}

d = dotty(market_data)

# 2. 修改数据
d['data.value'] = 3205.75
d['data.date'] = '2026-03-26'

# 3. 序列化为 JSON
json_str = d.to_json()
print("JSON 输出:")
print(json.dumps(json.loads(json_str), indent=2, ensure_ascii=False))

# 4. 使用 DottyEncoder 直接序列化
json_str2 = json.dumps(d, cls=DottyEncoder, ensure_ascii=False)
print("\n使用 DottyEncoder:")
print(json_str2)
```

### 示例4：安全数据访问

```python
from FQBase.FQBase.FQUtil import dotty

# 模拟不完整的数据
incomplete_data = {
    'user': {
        'name': '张三'
        # 缺少 age, email 等字段
    }
}

d = dotty(incomplete_data)

# 1. 安全获取存在的字段
print(f"姓名: {d.get('user.name')}")

# 2. 安全获取不存在的字段，使用默认值
print(f"年龄: {d.get('user.age', '未知')}")
print(f"邮箱: {d.get('user.email', '未填写')}")
print(f"电话: {d.get('user.phone', '无')}")

# 3. 使用 setdefault 填充默认值
if not d.get('user.age'):
    d.setdefault('user.age', 30)
print(f"设置后年龄: {d['user.age']}")
```

### 示例5：API 请求与响应处理

```python
from FQBase.FQBase.FQUtil import dotty

def make_request(payload):
    """模拟 API 请求"""
    return {
        'status': {'code': 200, 'msg': 'Success'},
        'data': {
            'user': {
                'id': 123,
                'personal': {'name': '张三', 'email': 'zhang@example.com'},
                'privileges': {
                    'granted': ['login', 'guest', 'superuser'],
                    'denied': ['admin'],
                    'history': {
                        'actions': [
                            ['superuser granted', '2026-03-26'],
                            ['login granted', '2026-03-26'],
                        ]
                    }
                }
            }
        }
    }

# 1. 构建请求
request = dotty()
request['request.data.payload'] = {'name': '张三', 'type': 'superuser'}
request['request.data.headers'] = {'content_type': 'application/json'}
request['request.url'] = 'http://api.example.com/user/create'

# 2. 发送请求并处理响应
response = dotty(make_request(request.to_dict()))

# 3. 解析响应
print(f"状态码: {response['status.code']}")  # 200
print(f"用户ID: {response['data.user.id']}")  # 123
print(f"用户名: {response['data.user.personal.name']}")  # '张三'

# 4. 检查权限列表
print(f"是否超级用户: {'superuser' in response['data.user.privileges.granted']}")

# 5. 访问嵌套列表数据
print(f"最近操作: {response['data.user.privileges.history.actions.0.0']}")
```

### 示例6：金融数据批量处理

```python
from FQBase.FQBase.FQUtil import dotty

# 模拟股票持仓数据
portfolio = {
    'account': 'ACC001',
    'positions': [
        {'code': '000001', 'name': '平安银行', 'volume': 1000, 'avg_cost': 12.50},
        {'code': '000002', 'name': '万科A', 'volume': 2000, 'avg_cost': 8.30},
        {'code': '600000', 'name': '浦发银行', 'volume': 1500, 'avg_cost': 6.20}
    ]
}

d = dotty(portfolio)

# 1. 批量获取所有股票的代码
codes = d['positions.:.code']
print(f"持仓股票: {codes}")
# ['000001', '000002', '600000']

# 2. 批量获取前2只股票的名称
names = d['positions.:2.name']
print(f"前2只: {names}")
# ['平安银行', '万科A']

# 3. 计算总市值（需要手动处理）
total_value = 0
for i in range(len(d['positions'])):
    price = d[f'positions.{i}.avg_cost']
    volume = d[f'positions.{i}.volume']
    total_value += price * volume
print(f"总成本: {total_value:.2f}")

# 4. 添加新持仓
d['positions.3'] = {'code': '300001', 'name': '创业板股', 'volume': 500, 'avg_cost': 15.00}
print(f"持仓数量: {len(d['positions'])}")  # 4
```

## Dotty 与普通字典的区别

### 核心区别概览

| 特性 | 普通字典 `dict` | Dotty |
|------|----------------|-------|
| 深度访问 | `d['a']['b']['c']` | `d['a.b.c']` |
| 嵌套赋值 | 需手动创建中间结构 | 自动创建 |
| 列表索引 | 数字下标 | 字符串键自动转索引 |
| 切片访问 | `[1:3]` | `['key.1:3']` |
| 缓存 | 无 | LRU 缓存 |
| 原型模式 | 副本独立 | 修改影响原字典 |

### 1. 深度访问

```python
# 普通字典 - 多层下标访问
data = {'user': {'profile': {'name': '张三'}}}
name = data['user']['profile']['name']  # 繁琐

# Dotty - 点号链式访问
d = dotty(data)
name = d['user.profile.name']  # 简洁
```

### 2. 嵌套赋值

```python
# 普通字典 - 需先创建中间结构
data = {}
data['user'] = {}
data['user']['profile'] = {}
data['user']['profile']['name'] = '张三'
# 或者用 setdefault / defaultdict

# Dotty - 自动创建
d = dotty({})
d['user.profile.name'] = '张三'  # 自动创建所有中间结构
```

### 3. 列表切片

```python
data = {'items': [{'name': 'a'}, {'name': 'b'}, {'name': 'c'}]}

# 普通字典 - 需手动遍历
names = [item['name'] for item in data['items']]

# Dotty - 切片+字段组合
d = dotty(data)
names = d['items.:.name']  # 直接获取所有 name
```

### 4. 代理模式（重要区别）

```python
# 普通字典 - 副本独立
original = {'a': 1}
copy = dict(original)  # 或 original.copy()
copy['a'] = 99
print(original['a'])  # 1 (不变)

# Dotty - 代理模式，共享数据
original = {'a': 1}
d = dotty(original)
d['a'] = 99
print(original['a'])  # 99 (被修改!)
```

### 5. 列表索引

```python
data = {'scores': [90, 85, 92]}

# 普通字典 - 直接用数字下标
score = data['scores'][0]  # 90

# Dotty - 字符串键自动转列表索引
d = dotty(data)
score = d['scores.0']  # 90
```

### 6. 切片访问

```python
data = {'values': [10, 20, 30, 40, 50]}

# 普通字典 - 手动切片
subset = data['values'][1:4]  # [20, 30, 40]

# Dotty - 字符串切片
d = dotty(data)
subset = d['values.1:4']  # [20, 30, 40]
```

### 总结对比表

| 场景 | 普通字典 | Dotty |
|------|---------|-------|
| 浅层数据 | ✅ 直接快速 | ⚡ 略增开销 |
| 深层嵌套 (5层+) | ⚠️ 繁琐难读 | ✅ 简洁优雅 |
| 动态键路径 | ⚠️ 需手动处理 | ✅ 原生支持 |
| 列表+切片 | ⚠️ 需遍历 | ✅ 链式切片 |
| 性能敏感场景 | ✅ 最快 | ⚠️ 有缓存但仍有开销 |
| 数据隔离需求 | ✅ 原型独立 | ⚠️ 共享引用 |
| JSON序列化 | ✅ 原生支持 | ✅ 支持 |

### 何时使用 Dotty

**适合使用 Dotty**:
- 配置项访问 (多层嵌套的配置)
- API 响应解析
- 金融数据结构 (K线、持仓等)
- 需要动态构建深层路径的场景

**不适合使用 Dotty**:
- 性能敏感的热路径 (每次访问都有封装开销)
- 需要保持数据隔离的场景 (使用 `.copy()` 需注意)
- 简单的一层字典操作

## 注意事项

1. **代理模式**: Dotty 不复制原字典，修改会直接影响原字典。如需独立副本，使用 `copy()` 方法
2. **分隔符冲突**: 如果键中包含点号(`.`)，需使用转义字符 `\\`。详细用法参见上文「转义分隔符」章节
3. **转义转义字符**: 如果键中包含反斜杠和点号，需要双重转义 `\\`。详细用法参见上文「转义转义字符」章节
4. **数字键处理**: 默认情况下 `0`, `1` 等数字字符串会转为列表索引，如有字典键确实是数字字符串，使用 `no_list=True`
5. **LRU 缓存**: `__getitem__` 使用 LRU 缓存，缓存大小 32，频繁访问相同键时性能更优
6. **性能考虑**: 对于极深的嵌套（超过 10 层），每次访问会有一定性能开销
7. **类型转换**: `_find_data_type` 方法会自动尝试将键转换为字典中存在的类型
8. **列表切片与字段组合**: `d['list.:2.field']` 这种语法会返回列表中每个元素的 `field` 值组成的列表
9. **错误处理**: 访问不存在的键会抛出 `KeyError`，列表索引越界会抛出 `IndexError`，使用 `get()` 方法可避免异常

## 依赖模块

- `collections.abc.Mapping`: 字典类型检查（Python 3.3+）
- `functools.lru_cache`: LRU 缓存装饰器
- `json`: JSON 序列化支持

## 模块历史

- **来源**: 基于 [dotty\_dict](https://github.com/pawelzny/dotty_dict) v1.3.1 库
- **集成时间**: 2026-03-26
- **集成位置**: FQBase.FQBase.FQUtil.dotty
- **维护者**: FQuant 开发团队

