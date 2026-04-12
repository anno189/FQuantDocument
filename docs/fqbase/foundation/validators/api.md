# API 参考

## validators 模块

`FQBase.Foundation.validators` 模块提供量化交易场景下的输入验证功能。

---

## 验证函数

### `validate_code`

验证股票代码格式（6位数字）。

```python
def validate_code(code: str) -> bool
```

**参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `code` | `str` | 股票代码 |

**返回值:** `bool` - 是否有效

**有效格式:** `^\d{6}$` (6位数字)

**示例:**

```python
validate_code("000001")  # True
validate_code("600000")  # True
validate_code("00001")   # False
validate_code("ABCDEF")  # False
validate_code("")        # False
validate_code(None)     # False
```

---

### `validate_date`

验证日期字符串格式。

```python
def validate_date(date_str: str, format: str = '%Y-%m-%d') -> bool
```

**参数:**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `date_str` | `str` | - | 日期字符串 |
| `format` | `str` | `'%Y-%m-%d'` | 日期格式 |

**返回值:** `bool` - 是否有效

**示例:**

```python
validate_date("2024-01-01")          # True
validate_date("2024-12-31")          # True
validate_date("2024/01/01")          # False
validate_date("2024-13-01")          # False (无效月份)
validate_date("invalid")             # False
validate_date(None)                  # False
```

---

### `validate_date_range`

验证日期范围。

```python
def validate_date_range(start_date: str, end_date: str,
                        format: str = '%Y-%m-%d') -> bool
```

**参数:**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `start_date` | `str` | - | 开始日期 |
| `end_date` | `str` | - | 结束日期 |
| `format` | `str` | `'%Y-%m-%d'` | 日期格式 |

**返回值:** `bool` - 范围是否有效 (`start <= end`)

**前置条件:** 两个日期字符串必须都是有效日期

**示例:**

```python
validate_date_range("2024-01-01", "2024-12-31")  # True
validate_date_range("2024-12-31", "2024-01-01")  # False (反序)
validate_date_range("2024-01-01", "2024-01-01")  # True (相等)
```

---

### `validate_date_range_with_tz`

验证带时区偏移的日期范围。

```python
def validate_date_range_with_tz(start_date: str, end_date: str,
                                format: str = '%Y-%m-%d',
                                tz_start: int = 0,
                                tz_end: int = 0) -> bool
```

**参数:**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `start_date` | `str` | - | 开始日期 |
| `end_date` | `str` | - | 结束日期 |
| `format` | `str` | `'%Y-%m-%d'` | 日期格式 |
| `tz_start` | `int` | `0` | 开始日期时区偏移（小时） |
| `tz_end` | `int` | `0` | 结束日期时区偏移（小时） |

**返回值:** `bool` - 范围是否有效

**示例:**

```python
# 北京时间 2024-01-01 00:00+8 到 2024-01-02 00:00+8
validate_date_range_with_tz("2024-01-01", "2024-01-02",
                            tz_start=8, tz_end=8)  # True

# 不同时区比较
validate_date_range_with_tz("2024-01-01", "2024-01-01",
                            tz_start=8, tz_end=0)  # True (8:00 > 0:00)
```

---

### `validate_market`

验证市场代码。

```python
def validate_market(market: str) -> bool
```

**参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `market` | `str` | 市场代码 |

**返回值:** `bool` - 是否有效

**支持的市场:**

| 代码 | 市场 |
|------|------|
| `SH` | 上海 |
| `SZ` | 深圳 |
| `BJ` | 北京 |
| `HK` | 香港 |
| `US` | 美国 |

**示例:**

```python
validate_market("SH")   # True
validate_market("sh")   # True (自动转大写)
validate_market("SZ")   # True
validate_market("NY")   # False
validate_market("")     # False
```

---

### `validate_frequency`

验证K线周期。

```python
def validate_frequency(freq: str) -> bool
```

**参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `freq` | `str` | K线周期 |

**返回值:** `bool` - 是否有效

**支持的格式:**

| 格式 | 说明 | 示例 |
|------|------|------|
| `\d+m` | 分钟 | `1m`, `5m`, `15m`, `30m`, `60m`, `120m` |
| `\d+d` | 日 | `1d`, `5d` |
| `\d+w` | 周 | `1w`, `4w` |
| `\d+M` | 月 | `1M`, `3M` |

**正则:** `^(\d+[mMdDwW]|[1-9][mMdDwW])$`

**示例:**

```python
validate_frequency("1m")   # True
validate_frequency("5m")   # True
validate_frequency("60m")  # True
validate_frequency("1d")   # True
validate_frequency("1w")   # True
validate_frequency("1M")   # True
validate_frequency("2h")   # False (不支持小时)
validate_frequency("0m")   # False (不能为0)
validate_frequency("m")    # False (必须有数字)
```

---

### `validate_dict`

验证字典是否包含必需键。

```python
def validate_dict(data: Any, required_keys: List[str]) -> bool
```

**参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `data` | `Any` | 待验证的数据 |
| `required_keys` | `List[str]` | 必需键列表 |

**返回值:** `bool` - 是否包含所有必需键

**示例:**

```python
data = {"code": "000001", "name": "平安银行"}

validate_dict(data, ["code"])           # True
validate_dict(data, ["code", "name"])   # True
validate_dict(data, ["code", "price"])  # False (缺少 price)
validate_dict("not a dict", ["code"])   # False
```

---

### `validate_positive_number`

验证正数。

```python
def validate_positive_number(value: Any) -> bool
```

**参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `value` | `Any` | 待验证的值 |

**返回值:** `bool` - 是否为正数

**示例:**

```python
validate_positive_number(1)      # True
validate_positive_number(0.5)    # True
validate_positive_number("100")  # True (字符串转数字)
validate_positive_number(0)      # False (非正数)
validate_positive_number(-1)     # False
validate_positive_number("abc") # False
```

---

### `validate_percentage`

验证百分比 (0-100)。

```python
def validate_percentage(value: Any) -> bool
```

**参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `value` | `Any` | 待验证的值 |

**返回值:** `bool` - 是否在 0-100 范围内

**示例:**

```python
validate_percentage(0)       # True
validate_percentage(50)     # True
validate_percentage(100)    # True
validate_percentage(101)     # False
validate_percentage(-1)     # False
validate_percentage("50")   # True
validate_percentage("abc")  # False
```

---

## Validator 类

规则式验证器，支持多规则组合和错误收集。

```python
class Validator:
    def __init__(self)
    def add_error(self, message: str) -> None
    def has_errors(self) -> bool
    def get_errors(self) -> List[str]
    def clear_errors(self) -> None
    def validate(self, value: Any, rules: dict) -> bool
```

### `__init__`

初始化验证器。

```python
def __init__(self)
```

---

### `add_error`

添加错误信息。

```python
def add_error(self, message: str) -> None
```

**参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `message` | `str` | 错误信息 |

---

### `has_errors`

检查是否有错误。

```python
def has_errors(self) -> bool
```

**返回值:** `bool` - 是否存在错误

---

### `get_errors`

获取所有错误。

```python
def get_errors(self) -> List[str]
```

**返回值:** `List[str]` - 错误列表的副本

---

### `clear_errors`

清除所有错误。

```python
def clear_errors(self) -> None
```

---

### `validate`

根据规则验证值。

```python
def validate(self, value: Any, rules: dict) -> bool
```

**参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `value` | `Any` | 待验证的值 |
| `rules` | `dict` | 验证规则字典 |

**支持的规则:**

| 规则 | 类型 | 说明 |
|------|------|------|
| `required` | `bool` | 值不能为 None 或空字符串 |
| `type` | `type` | 必须匹配的类型，如 `int`, `str` |
| `min` | `number` | 数值最小值（含） |
| `max` | `number` | 数值最大值（含） |
| `pattern` | `str` | 正则表达式模式 |
| `choices` | `tuple` | 可选值元组 |

**返回值:** `bool` - 是否通过所有验证

**行为:**

- 每次调用前自动清除之前的错误
- 遇到错误立即返回 `False`
- 返回 `True` 当且仅当所有规则都通过

**示例:**

```python
validator = Validator()

# 验证数字范围
validator.validate(50, {"min": 0, "max": 100})  # True
validator.validate(-1, {"min": 0, "max": 100})  # False

# 验证类型
validator.validate("hello", {"type": str})  # True
validator.validate(123, {"type": str})      # False

# 验证正则
validator.validate("user@email.com", {"pattern": r'^[\w.-]+@[\w.-]+\.\w+$'})  # True
validator.validate("invalid", {"pattern": r'^[\w.-]+@[\w.-]+\.\w+$'})          # False
```

---

## ValidationError 异常

验证失败时抛出的异常。

```python
class ValidationError(Exception):
    pass
```

**使用场景:**

```python
from FQBase.Foundation.validators import ValidationError

def strict_validate(value):
    if not validate_positive_number(value):
        raise ValidationError(f"Invalid value: {value}")
    return value
```

---

## 类型注解

```python
from typing import Any, List

def validate_code(code: str) -> bool: ...
def validate_date(date_str: str, format: str = '%Y-%m-%d') -> bool: ...
def validate_date_range(start_date: str, end_date: str, format: str = '%Y-%m-%d') -> bool: ...
def validate_date_range_with_tz(start_date: str, end_date: str, format: str = '%Y-%m-%d', tz_start: int = 0, tz_end: int = 0) -> bool: ...
def validate_market(market: str) -> bool: ...
def validate_frequency(freq: str) -> bool: ...
def validate_dict(data: Any, required_keys: List[str]) -> bool: ...
def validate_positive_number(value: Any) -> bool: ...
def validate_percentage(value: Any) -> bool: ...

class Validator:
    _errors: List[str]
    def __init__(self) -> None: ...
    def add_error(self, message: str) -> None: ...
    def has_errors(self) -> bool: ...
    def get_errors(self) -> List[str]: ...
    def clear_errors(self) -> None: ...
    def validate(self, value: Any, rules: dict) -> bool: ...

class ValidationError(Exception): ...
```
