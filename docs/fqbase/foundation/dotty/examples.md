---
title: Dotty 嵌套字典 - 案例库
description: Dotty 实际应用场景与示例
tag:
  - fqbase
  - dotty
---

# Dotty 嵌套字典 - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [核心概念](./concepts.md) → **[案例库](./examples.md)** |


## 概述

本文档展示 Dotty 在实际项目中的应用场景。

## 基础示例

### 示例 1：配置文件访问

**场景描述：** 访问嵌套的配置文件

**代码实现：**

```python
from FQBase.Foundation import dotty

# 配置文件
config = {
    'database': {
        'host': 'localhost',
        'port': 5432,
        'pool': {
            'min': 5,
            'max': 20
        }
    },
    'cache': {
        'enabled': True,
        'ttl': 3600
    }
}

d = dotty(config)

# 访问配置
db_host = d['database.host']  # localhost
db_port = d['database.port']  # 5432
pool_min = d['database.pool.min']  # 5
pool_max = d['database.pool.max']  # 20
cache_enabled = d['cache.enabled']  # True
```

**适用场景：**
- 读取多层级配置文件
- 访问 JSON 配置

---

### 示例 2：API 响应处理

**场景描述：** 处理嵌套的 API 响应数据

**代码实现：**

```python
from FQBase.Foundation import dotty

# API 响应
response = {
    'data': {
        'user': {
            'profile': {
                'name': '张三',
                'avatar': 'https://example.com/avatar.jpg'
            },
            'settings': {
                'notifications': {
                    'email': True,
                    'sms': False
                }
            }
        }
    },
    'meta': {
        'code': 200,
        'message': 'success'
    }
}

d = dotty(response)

# 提取数据
user_name = d['data.user.profile.name']  # 张三
avatar_url = d['data.user.profile.avatar']  # https://...
email_notify = d['data.user.settings.notifications.email']  # True
response_code = d['meta.code']  # 200
```

**适用场景：**
- 解析嵌套的 JSON API 响应
- 提取深层数据

---

## 进阶示例

### 示例 3：动态数据构建

**场景描述：** 构建复杂的数据结构

**代码实现：**

```python
from FQBase.Foundation import dotty

d = dotty()

# 动态构建嵌套结构
d['users.0.name'] = '张三'
d['users.0.age'] = 30
d['users.1.name'] = '李四'
d['users.1.age'] = 25

# 转换为普通字典
result = d.to_dict()
print(result)
# {
#     'users': [
#         {'name': '张三', 'age': 30},
#         {'name': '李四', 'age': 25}
#     ]
# }
```

**适用场景：**
- 构建测试数据
- 动态生成配置

---

### 示例 4：列表数据处理

**场景描述：** 处理包含列表的嵌套数据

**代码实现：**

```python
from FQBase.Foundation import dotty

data = {
    'orders': [
        {'id': 1, 'items': [{'product': 'A', 'price': 10}, {'product': 'B', 'price': 20}]},
        {'id': 2, 'items': [{'product': 'C', 'price': 15}]}
    ]
}

d = dotty(data)

# 访问列表元素
first_order_id = d['orders.0.id']  # 1
second_order_item = d['orders.1.items.0.product']  # C

# 列表切片
all_first_items = d['orders[:].items.0.product']  # ['A', 'C']
```

**适用场景：**
- 处理订单、商品等包含列表的业务数据
- 提取列表中特定位置的元素

---

## 最佳实践

1. **使用 get 方法处理可选键**：避免 KeyError
2. **注意直接修改原字典**：使用 copy() 创建副本
3. **合理使用点号深度**：过深可能影响性能

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [核心概念](./concepts.md)
