---
title: Converters
description: 数据转换工具，包含日期、代码、数字转换函数
tag:
  - fqbase
  - util
  - utility

summary:
  type: utility
  complexity: minimal
  maturity: stable
  functions:
    - date_to_str
    - str_to_date
    - normalize_code
    - parse_number
    - safe_divide
    - percentage_change
    - format_percentage
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "日期格式统一转换（不同数据源日期格式不同）"
    - "数字安全除法（避免除零错误）"
    - "百分比变化计算"
  warnings:
    - "safe_divide 分母为0时返回0或默认值，需注意"
    - "date_to_str 默认格式可能不符合需求"
  limitations:
    - "仅支持常见的日期格式"

relationships:
  belongs_to:
    - fquant.fqbase.util
  depends_on: []
  import_path:
    - from FQBase.Util.converters import date_to_str, parse_number
---

# Converters

## 一句话总览

📌 **数据转换工具，日期、代码、数字格式转换**

**TL;DR**：
- 核心能力：日期转换、代码标准化、数字处理、百分比计算
- 入门难度：🟢 简单

## 快速开始

```python
from FQBase.Util.converters import date_to_str, parse_number

date_str = date_to_str('2024-01-01')
num = parse_number('123.45')
```

## 函数列表

### date_to_str

```python
from FQBase.Util.converters import date_to_str

result = date_to_str(date, format='%Y-%m-%d')
```

**描述：** 日期转换为字符串

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| date | datetime \| str \| pd.Timestamp | 是 | 日期对象 |
| format | str | 否 | 输出格式，默认 '%Y-%m-%d' |

**返回：** `str` - 日期字符串

**示例：**

```python
from datetime import datetime
date_str = date_to_str(datetime(2024, 1, 1))
print(date_str)  # '2024-01-01'
```

---

### str_to_date

```python
from FQBase.Util.converters import str_to_date

result = str_to_date(date_str, format='%Y-%m-%d')
```

**描述：** 字符串转换为日期

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| date_str | str | 是 | 日期字符串 |
| format | str | 否 | 输入格式，默认 '%Y-%m-%d' |

**返回：** `datetime` - datetime 对象

**示例：**

```python
date = str_to_date('2024-01-01')
print(date)  # 2024-01-01 00:00:00
```

---

### normalize_code

```python
from FQBase.Util.converters import normalize_code

result = normalize_code(code)
```

**描述：** 标准化股票代码

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| code | str | 是 | 原始代码 |

**返回：** `str` - 标准化后的代码

**示例：**

```python
code = normalize_code('600000')
print(code)  # '600000'
```

---

### parse_number

```python
from FQBase.Util.converters import parse_number

result = parse_number(value, default=0.0)
```

**描述：** 解析数字，处理异常

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| value | Any | 是 | 待解析的值 |
| default | float | 否 | 默认值，默认 0.0 |

**返回：** `float` - 解析后的数字

**示例：**

```python
num = parse_number('123.45')
print(num)  # 123.45

num = parse_number(None, default=0.0)
print(num)  # 0.0
```

---

### safe_divide

```python
from FQBase.Util.converters import safe_divide

result = safe_divide(a, b, default=0.0)
```

**描述：** 安全除法，避免除零错误

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| a | float | 是 | 被除数 |
| b | float | 是 | 除数 |
| default | float | 否 | 默认值，默认 0.0 |

**返回：** `float` - 计算结果

**示例：**

```python
result = safe_divide(10, 2)
print(result)  # 5.0

result = safe_divide(10, 0)
print(result)  # 0.0
```

---

### percentage_change

```python
from FQBase.Util.converters import percentage_change

result = percentage_change(current, previous)
```

**描述：** 计算百分比变化

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| current | float | 是 | 当前值 |
| previous | float | 是 | 上一个值 |

**返回：** `float` - 百分比变化 (如 5.0 表示 5%)

**示例：**

```python
change = percentage_change(105, 100)
print(change)  # 5.0
```

---

### format_percentage

```python
from FQBase.Util.converters import format_percentage

result = format_percentage(value, decimals=2)
```

**描述：** 格式化百分比

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| value | float | 是 | 百分比值 (如 0.1 表示 10%) |
| decimals | int | 否 | 小数位数，默认 2 |

**返回：** `str` - 格式化后的字符串

**示例：**

```python
formatted = format_percentage(0.1)
print(formatted)  # '10.00%'
```

---

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01-01 | 初始版本 |
