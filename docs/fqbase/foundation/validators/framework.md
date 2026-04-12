# 框架文档

## 验证器框架概述

### 两种验证模式

```
┌─────────────────────────────────────────────────────────┐
│                    验证器框架                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐      ┌─────────────────┐          │
│  │   函数式验证     │      │   规则式验证     │          │
│  │   (Function)    │      │   (Validator)   │          │
│  ├─────────────────┤      ├─────────────────┤          │
│  │ validate_code() │      │ Validator 类    │          │
│  │ validate_date() │      │ - 规则定义       │          │
│  │ validate_market │      │ - 错误收集       │          │
│  │ ...             │      │ - 批量验证       │          │
│  └─────────────────┘      └─────────────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 函数式验证

### 特点

- 简单直接，返回 `True/False`
- 一元验证（单个值 → 布尔结果）
- 轻量级，适合单点验证

### 函数列表

| 函数 | 验证内容 | 返回值 |
|------|----------|--------|
| `validate_code(code)` | 股票代码 | `bool` |
| `validate_date(date_str, format)` | 日期格式 | `bool` |
| `validate_date_range(start, end)` | 日期范围 | `bool` |
| `validate_date_range_with_tz(...)` | 带时区日期范围 | `bool` |
| `validate_market(market)` | 市场代码 | `bool` |
| `validate_frequency(freq)` | K线周期 | `bool` |
| `validate_dict(data, keys)` | 字典键 | `bool` |
| `validate_positive_number(value)` | 正数 | `bool` |
| `validate_percentage(value)` | 百分比 | `bool` |

### 验证流程

```
输入值
   │
   ▼
┌─────────────────────┐
│ 类型/格式检查        │
└────────┬────────────┘
         │
    ┌────┴────┐
    │  验证   │
    │  通过?  │
    └────┬────┘
         │
    ┌────┴────┐
   Yes       No
    │         │
    ▼         ▼
  True      False
```

---

## 规则式验证

### Validator 类架构

```python
class Validator:
    def __init__(self):
        self._errors: List[str] = []  # 错误收集

    def add_error(self, message: str)   # 添加错误
    def has_errors(self) -> bool       # 检查是否有错
    def get_errors(self) -> List[str]   # 获取所有错误
    def clear_errors(self)              # 清除错误
    def validate(self, value, rules) -> bool  # 规则验证
```

### 支持的规则

| 规则名 | 参数类型 | 说明 |
|--------|----------|------|
| `required` | `bool` | 值不能为 None 或空字符串 |
| `type` | `type` | 必须匹配的类型 |
| `min` | `number` | 数值最小值 |
| `max` | `number` | 数值最大值 |
| `pattern` | `str` | 正则表达式模式 |
| `choices` | `tuple` | 可选值列表 |

### 验证流程

```
validate(value, rules)
        │
        ▼
┌───────────────────┐
│ clear_errors()    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ 遍历每条规则      │
└────────┬──────────┘
         │
         ▼
   ┌─────┴─────┐
   │ 规则命中? │
   └─────┬─────┘
    Yes  │  No
    │    │
    ▼    └───▶ 继续下一条规则
┌───────────────┐
│ 执行验证      │
└───────┬───────┘
        │
   ┌────┴────┐
   │ 通过?   │
   └────┬────┘
   Yes  │  No
   │    │
   ▼    ▼
继续    add_error()
下一条   │
规则    ▼
   ┌────┴────┐
   │ has_    │
   │ errors? │
   └────┬────┘
        │
   ┌────┴────┐
   Yes      No
   │        │
   ▼        ▼
 return   return
 False    True
```

---

## 验证函数详解

### validate_code

验证股票代码格式：`^\d{6}$`

```
有效: "000001", "600000", "300001"
无效: "00001" (不足6位), "ABCDEF" (非数字), "" (空)
```

### validate_date

验证日期字符串格式，默认 `%Y-%m-%d`

```
有效: "2024-01-01", "2023-12-31"
无效: "2024/01/01" (分隔符错误), "2024-13-01" (无效月份)
```

### validate_market

验证市场代码，支持: `SH`, `SZ`, `BJ`, `HK`, `US`

```
有效: "SH", "sh", "SH\n" (自动 strip)
无效: "NY", "TYO", "SGP"
```

### validate_frequency

验证K线周期

```
有效: "1m", "5m", "15m", "30m", "60m", "1d", "1w", "1M",
      "1D", "1W", "1M", "120m", "240m"
无效: "2h" (不支持小时), "0m" (不能为0), "m" (无数字)
```

### validate_date_range

验证日期范围：`start_date <= end_date`

```
有效: validate_date_range("2024-01-01", "2024-12-31")
无效: validate_date_range("2024-12-31", "2024-01-01") (反序)
```

### validate_date_range_with_tz

带时区偏移的日期范围验证

```
tz_offset: +8 表示北京时间
validate_date_range_with_tz("2024-01-01", "2024-01-02", tz_start=8, tz_end=8)
```

---

## 验证器组合

### 组合多个验证

```python
def validate_trade_params(code: str, date: str, market: str) -> tuple[bool, list]:
    errors = []

    if not validate_code(code):
        errors.append(f"Invalid code: {code}")

    if not validate_date(date):
        errors.append(f"Invalid date: {date}")

    if not validate_market(market):
        errors.append(f"Invalid market: {market}")

    return len(errors) == 0, errors
```

### 链式验证

```python
# 第一层：格式验证
if not validate_date(start_date) or not validate_date(end_date):
    return False

# 第二层：范围验证
if not validate_date_range(start_date, end_date):
    return False

# 第三层：业务规则验证
start = datetime.strptime(start_date, '%Y-%m-%d')
end = datetime.strptime(end_date, '%Y-%m-%d')
if (end - start).days > 365:
    return False
```
