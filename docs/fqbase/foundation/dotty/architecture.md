# Dotty 模块架构

## 1. 模块结构

```
dotty.py
├── dotty()           # 工厂函数
├── Dotty             # 核心包装器类
│   ├── __init__      # 初始化
│   ├── __getitem__   # 点号访问
│   ├── __setitem__   # 点号赋值
│   ├── __getattr__   # 属性访问
│   ├── __contains__  # 深度包含检查
│   ├── __delitem__   # 删除键
│   ├── _split()      # 键分割
│   └── ...
└── DottyEncoder      # JSON 编码器
```

## 2. 核心组件

### 2.1 dotty() 工厂函数

```python
def dotty(dictionary=None, no_list=False):
    if dictionary is None:
        dictionary = {}
    return Dotty(dictionary, separator='.', esc_char='\\', no_list=no_list)
```

职责：
- 创建 Dotty 实例的工厂函数
- 提供默认参数
- 处理空字典情况

### 2.2 Dotty 类

```python
class Dotty:
    def __init__(self, dictionary, separator='.', esc_char='\\', no_list=False):
        self._data = dictionary      # 原始字典引用
        self.separator = separator   # 分隔符 '.'
        self.esc_char = esc_char     # 转义字符 '\\'
        self.no_list = no_list       # 禁用列表索引转换
```

核心数据结构：
- `_data`：原始字典的引用（不是拷贝）
- `separator`：键路径分隔符
- `esc_char`：分隔符转义字符

### 2.3 DottyEncoder

```python
class DottyEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, '_data'):
            return obj._data
        return json.JSONEncoder.default(self, obj)
```

职责：将 Dotty 对象序列化为 JSON

## 3. 键路径解析

### 3.1 _split() 方法

将点号分隔的键路径分割为列表：

```
"user.profile.name"
        ↓
['user', 'profile', 'name']
```

处理转义字符：
```
"user\.profile.name"  (键名包含点号)
        ↓
['user.profile', 'name']
```

### 3.2 解析流程

```python
def _split(self, key):
    # 1. 替换转义序列为占位符
    key = key.replace(esc_char + separator, '<#esc#>')
    key = key.replace('\\' + esc_char + separator, '<#skp#>' + separator)

    # 2. 分割
    keys = key.split(separator)

    # 3. 恢复转义字符
    for i, k in enumerate(keys):
        keys[i] = k.replace('<#esc#>', separator).replace('<#skp#>', esc_char)

    return keys
```

## 4. 访问机制

### 4.1 __getitem__ 流程

```
d['user.profile.name']
        │
        ▼
_split('user.profile.name') → ['user', 'profile', 'name']
        │
        ▼
get_from(['user', 'profile', 'name'], data)
        │
        ├─── 取出 'user' ──► data['user']
        │
        ├─── 取出 'profile' ──► data['profile']
        │
        └─── 取出 'name' ──► data['name']
```

### 4.2 列表索引处理

```python
if isinstance(data, list) and it.isdigit() and not self.no_list:
    it = int(it)  # 字符串转整数
```

### 4.3 自动类型匹配

```python
@staticmethod
def _find_data_type(item, data):
    # 尝试将字符串键转换为字典中实际存在的类型
    data_types = [type(i) for i in data.keys()]
    for t in set(data_types):
        try:
            if t(item) in data:
                return t(item)
        except ValueError:
            pass
    return item
```

## 5. 赋值机制

### 5.1 __setitem__ 流程

```
d['user.profile.name'] = '张三'
        │
        ▼
_split('user.profile.name') → ['user', 'profile', 'name']
        │
        ▼
set_to(['user', 'profile', 'name'], data, '张三')
        │
        ├─── 有剩余键 ['profile', 'name']
        │        │
        │        ├─── 路径不存在则创建空字典
        │        │
        │        └─── 递归 set_to(['profile', 'name'], data['user'], '张三')
        │
        └─── 无剩余键
                 │
                 └─── data['name'] = '张三'
```

### 5.2 列表自动扩展

```python
@staticmethod
def set_list_index(data, index, value):
    # 确保列表有足够长度
    for _ in range(len(data), int(index) + 1):
        data.append(None)
    data[int(index)] = value
```

## 6. LRU 缓存

### 6.1 缓存策略

```python
@lru_cache(maxsize=32)
def __getitem__(self, item):
    ...
```

使用 `@lru_cache` 缓存 `__getitem__` 的结果：
- 同一路径的多次访问无需重新解析
- 最多缓存 32 个不同路径的结果
- 缓存基于方法调用，不绑定实例状态

### 6.2 缓存失效

由于 `_split()` 不是静态方法，缓存可能返回错误结果（如果分隔符改变）。建议使用固定的 separator。

## 7. 数据流图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户代码                             │
│                    d['user.profile.name']                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Dotty.__getitem__                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      _split() 键解析                        │
│                   ['user', 'profile', 'name']               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               递归 get_from() 深度遍历                      │
│  user → profile → name → 返回最终值                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      原始字典 _data                          │
│               {'user': {'profile': {'name': ...}}}         │
└─────────────────────────────────────────────────────────────┘
```

## 8. 设计权衡

### 8.1 引用 vs 拷贝

**决策**：Dotty 使用原始字典的引用，而非拷贝

**优点**：
- 内存效率高
- 修改直接反映到原字典
- 支持双向同步

**缺点**：
- 可能导致意外修改
- 需要谨慎处理

### 8.2 LRU 缓存大小

**决策**：缓存大小为 32

**考虑**：
- 避免无限缓存增长
- 足够应对常见场景
- 缓存未考虑分隔符变更（已文档说明）

### 8.3 字符串-only 键路径

**决策**：`__getitem__` 期望字符串键路径

```python
if not isinstance(key, str):
    return [key]
```

**影响**：非字符串键直接作为单元素列表处理
