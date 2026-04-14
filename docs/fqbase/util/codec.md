---
title: Codec
description: 股票代码格式转换工具
tag:
  - fqbase
  - util
  - utility

summary:
  type: utility
  complexity: minimal
  maturity: stable
  functions:
    - code_to_6digit
    - code_to_jqformat
    - code_adjust_ctp
    - code_to_list
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "统一不同数据源的股票代码格式"
    - "将代码转换为聚宽格式用于数据查询"
    - "期货CTP和通达信格式互转"
  warnings:
    - "港股代码转换可能有特殊处理"
    - "期货代码字母大小写需注意"
  limitations:
    - "仅支持沪深股票和期货，不支持基金、期权等"

relationships:
  belongs_to:
    - fquant.fqbase.util
  depends_on: []
  import_path:
    - from FQBase.Util.codec import code_to_6digit
---

# Codec

## 一句话总览

📌 **股票代码格式转换工具，支持多种格式互转**

**TL;DR**：
- 核心能力：6位代码、聚宽格式、CTP格式、通达信格式
- 入门难度：🟢 简单

## 快速开始

```python
from FQBase.Util.codec import code_to_6digit

code = code_to_6digit(600000)
```

## 函数列表

### code_to_6digit

```python
from FQBase.Util.codec import code_to_6digit

result = code_to_6digit(code)
```

**描述：** 将股票代码转换成6位字符串格式，支持聚宽格式(600000.XSHG)、掘金格式(SHSE.600000)、Wind格式(600000.SH)等

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| code | int \| str | 是 | 股票代码，支持多种格式 |

**返回：** `str` - 6位字符串格式的股票代码

**示例：**

```python
code = code_to_6digit(600000)
print(code)  # '600000'

code = code_to_6digit('600000.XSHG')
print(code)  # '600000'
```

---

### code_to_jqformat

```python
from FQBase.Util.codec import code_to_jqformat

result = code_to_jqformat(code)
```

**描述：** 将沪深股票代码转换成聚宽格式 (600000.XSHG)

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| code | int \| str | 是 | 股票代码 |

**返回：** `str` - 聚宽格式的股票代码

**示例：**

```python
code = code_to_jqformat(600000)
print(code)  # '600000.XSHG'
```

---

### code_adjust_ctp

```python
from FQBase.Util.codec import code_adjust_ctp

result = code_adjust_ctp(code, source='tdx')
```

**描述：** 在CTP和通达信代码格式之间转换

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| code | str | 是 | 期货代码 |
| source | str | 否 | 源格式，'pytdx' 或 'ctp'，默认 'tdx' |

**返回：** `str` - 转换后的代码

**示例：**

```python
code = code_adjust_ctp('rb2105', source='tdx')
print(code)  # 'RB2105'
```

---

### code_to_list

```python
from FQBase.Util.codec import code_to_list

result = code_to_list(code, auto_fill=True)
```

**描述：** 将代码转换为列表

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| code | str \| List[str] | 是 | 股票代码或代码列表 |
| auto_fill | bool | 否 | 是否自动补齐6位，默认 True |

**返回：** `List[str]` - 股票代码列表

**示例：**

```python
codes = code_to_list('600000')
print(codes)  # ['600000']
```

---

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01-01 | 初始版本 |
