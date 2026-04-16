---
title: 随机数生成工具
description: 股票代码和随机字符串生成工具
tag:
  - fqbase
  - crypto
  - utility

summary:
  type: utility
  complexity: minimal
  maturity: stable
  functions:
    - random_stock_code
    - random_string
    - random_with_topic
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "生成随机股票代码用于测试"
    - "生成随机账号或Token用于测试"
    - "模拟数据时随机采样"
  warnings:
    - "生成的股票代码可能是真实存在的，需注意"
    - "不是加密安全的随机数"
  limitations:
    - "仅用于测试和模拟，不是真正的加密工具"

relationships:
  belongs_to:
    - fquant.fqbase.util
  depends_on: []
  import_path:
    - from FQBase.Util.crypto import random_stock_code, random_string
---

# 随机数生成工具

## 一句话总览

📌 **股票代码和随机字符串生成工具，支持多市场代码和加密安全随机数**

**TL;DR**：
- 核心能力：股票代码生成、随机字符串、安全随机数
- 入门难度：🟢 简单

## 快速开始

```python
from FQBase.Util.crypto import random_stock_code, random_string

# 生成股票代码
codes = random_stock_code(stock_number=5)
print(codes)  # ['600234', '000123', '300456', ...]

# 生成随机字符串
s = random_string(topic='Acc', length=8)
print(s)  # Acc3kF9mNp
```

## 函数列表

### random_stock_code

```python
from FQBase.Util.crypto import random_stock_code

codes = random_stock_code(stock_number=10, markets=['SH', 'SZ'])
```

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| stock_number | int | 否 | 生成个数（默认：10） |
| markets | List[str] | 否 | 市场列表，默认 ['SH', 'SZ'] |

**返回：** `List[str]` - 股票代码列表

**市场代码说明：**
- SH (沪市): 600000-609999, 688xxx (科创板)
- SZ (深市): 000xxx, 001xxx, 002xxx (中小板), 003xxx, 300xxx (创业板)
- BJ (北交所): 8xxxxx, 4xxxxx
- HK (港股): xxxxx (5位数)
- US (美股): xxxxxxx (6-7位)

**示例：**

```python
# 生成5个沪市股票代码
codes = random_stock_code(stock_number=5, markets=['SH'])
print(codes)  # ['600234', '688123', '602345', ...]

# 生成多市场股票代码
codes = random_stock_code(stock_number=10, markets=['SH', 'SZ', 'US'])
print(codes)  # ['600234', '000123', '300456', 'A12345', ...]
```

---

### random_string

```python
from FQBase.Util.crypto import random_string

s = random_string(topic='Acc', length=8)
```

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| topic | str | 否 | 开头标识（默认：'Acc'） |
| length | int | 否 | 总长度（默认：8） |

**返回：** `str` - 随机字符串，格式为 `{topic}_{random}`

**示例：**

```python
# 生成默认长度的随机字符串
s = random_string()
print(s)  # Acc3kF9mNp

# 自定义长度和前缀
s = random_string(topic='Token', length=16)
print(s)  # Token4aB7cD8eF9g
```

---

### random_with_topic

```python
from FQBase.Util.crypto import random_with_topic

s = random_with_topic(topic='Acc', length=8)
```

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| topic | str | 否 | 开头标识（默认：'Acc'） |
| length | int | 否 | 长度（默认：8） |

**返回：** `str` - 随机字符串，格式为 `{topic}_{random}`

**示例：**

```python
# 生成随机账号
account = random_with_topic()
print(account)  # Acc3kF9mNp

# 生成随机Token
token = random_with_topic(topic='Token', length=32)
print(token)  # Token4aB7cD8eF9gH0iJ1kL2mN3oP
```

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01-15 | 初始版本 |
