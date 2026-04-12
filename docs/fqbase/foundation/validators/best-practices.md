# 最佳实践

## 验证时机

### 防御式验证

```python
# 推荐：在入口处验证
def process_order(order_data: dict):
    if not validate_dict(order_data, ["code", "quantity", "price"]):
        raise ValueError("Missing required fields")

    if not validate_code(order_data["code"]):
        raise ValueError(f"Invalid code: {order_data['code']}")

    if not validate_positive_number(order_data["quantity"]):
        raise ValueError(f"Invalid quantity: {order_data['quantity']}")

    # 业务逻辑
    ...

# 不推荐：延迟到业务逻辑中验证
def process_order(order_data: dict):
    # 业务逻辑中发现问题
    if db.insert(order_data) fails:
        raise error  # 错误时机
```

### 验证失败处理

```python
# 推荐：明确的错误信息
def validate_stock_code(code: str) -> None:
    if not validate_code(code):
        raise ValidationError(f"Stock code must be 6 digits, got: {code}")

# 不推荐：模糊的错误信息
def validate_stock_code(code: str) -> None:
    if not validate_code(code):
        raise ValidationError("Invalid input")
```

---

## 函数选择

### 根据场景选择验证器

| 场景 | 推荐函数 | 原因 |
|------|----------|------|
| 单一值验证 | `validate_code()` | 简单直接 |
| 组合验证 | `Validator` 类 | 收集所有错误 |
| 批量验证 | 函数式组合 | 可并行化 |
| 表单验证 | `Validator` | 一次返回所有错误 |

### 避免过度验证

```python
# 过度：每个字段单独验证
if validate_code(code) and validate_market(market) and validate_date(date):
    ...

# 适度：使用 Validator 组合
validator = Validator()
validator.validate(code, {"pattern": r'^\d{6}$'})
validator.validate(market, {"choices": ("SH", "SZ", "BJ")})
validator.validate(date, {"pattern": r'^\d{4}-\d{2}-\d{2}$'})

if validator.has_errors():
    return validator.get_errors()
```

---

## 错误处理

### 使用 ValidationError

```python
from FQBase.Foundation.validators import ValidationError, validate_code

def get_stock_info(code: str) -> dict:
    if not validate_code(code):
        raise ValidationError(f"Invalid stock code: {code}")

    return stock_api.get_info(code)
```

### 错误收集模式

```python
from FQBase.Foundation.validators import Validator

class FormValidator:
    def __init__(self):
        self.validator = Validator()
        self.errors = []

    def validate(self, data: dict) -> bool:
        self.errors = []

        # 字段1
        self.validator.clear_errors()
        if not self.validator.validate(data.get("code"), {"required": True}):
            self.errors.append(f"code: {self.validator.get_errors()}")

        # 字段2
        self.validator.clear_errors()
        if not self.validator.validate(data.get("price"), {"required": True, "min": 0}):
            self.errors.append(f"price: {self.validator.get_errors()}")

        return len(self.errors) == 0
```

---

## 日期验证最佳实践

### 时区处理

```python
# 推荐：明确时区
from FQBase.Foundation.validators import validate_date_range_with_tz

# 北京交易所数据
validate_date_range_with_tz(
    start_date="2024-01-01",
    end_date="2024-12-31",
    tz_start=8,
    tz_end=8
)

# 美国市场数据
validate_date_range_with_tz(
    start_date="2024-01-01",
    end_date="2024-12-31",
    tz_start=-5,  # 美东时间
    tz_end=-5
)
```

### 日期格式一致性

```python
# 推荐：统一日期格式
DEFAULT_DATE_FORMAT = "%Y-%m-%d"

def parse_date(date_str: str) -> datetime:
    if not validate_date(date_str, DEFAULT_DATE_FORMAT):
        raise ValueError(f"Invalid date format: {date_str}")
    return datetime.strptime(date_str, DEFAULT_DATE_FORMAT)
```

---

## 数值验证

### 浮点数精度

```python
# 验证百分比时考虑浮点误差
def validate_rate(value: float, tolerance: float = 1e-9) -> bool:
    try:
        num = float(value)
        return -tolerance <= num <= 100 + tolerance
    except (ValueError, TypeError):
        return False
```

### 边界值测试

```python
# 边界值验证
validate_positive_number(0.0001)  # True (最小正数)
validate_positive_number(0)       # False (零)
validate_positive_number(-0.0001) # False (负数)

validate_percentage(0)    # True
validate_percentage(100) # True
validate_percentage(0.1) # True
```

---

## 正则表达式

### 预编译正则

```python
import re
from typing import Pattern

# 推荐：模块级预编译
EMAIL_PATTERN = re.compile(r'^[\w.-]+@[\w.-]+\.\w+$')
PHONE_PATTERN = re.compile(r'^1[3-9]\d{9}$')

def validate_email(email: str) -> bool:
    return bool(EMAIL_PATTERN.match(email))

def validate_phone(phone: str) -> bool:
    return bool(PHONE_PATTERN.match(phone))

# 不推荐：每次调用重新编译
def validate_email(email: str) -> bool:
    return bool(re.match(r'^[\w.-]+@[\w.-]+\.\w+$', email))
```

### 常用正则模式

```python
# 股票代码
STOCK_CODE_PATTERN = re.compile(r'^\d{6}$')

# 日期 (YYYY-MM-DD)
DATE_PATTERN = re.compile(r'^\d{4}-\d{2}-\d{2}$')

# 时间 (HH:MM:SS)
TIME_PATTERN = re.compile(r'^\d{2}:\d{2}:\d{2}$')

# 百分比
PERCENTAGE_PATTERN = re.compile(r'^\d+(\.\d+)?$')
```

---

## 性能优化

### 批量验证

```python
from concurrent.futures import ThreadPoolExecutor
from FQBase.Foundation.validators import validate_code

def batch_validate_codes(codes: list) -> list:
    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(validate_code, codes))
    return results

# 使用
codes = ["000001"] * 1000 + ["INVALID"] * 10
results = batch_validate_codes(codes)
```

### 短路求值

```python
# 推荐：短路验证
def validate_trade_params(params: dict) -> bool:
    required_fields = ["code", "quantity", "price"]

    # 遇到第一个错误就返回
    for field in required_fields:
        if field not in params:
            return False

    if not validate_code(params["code"]):
        return False

    if not validate_positive_number(params["quantity"]):
        return False

    return True

# 不推荐：收集所有错误（需要所有验证都执行）
def validate_trade_params(params: dict) -> list:
    errors = []
    # 所有验证都执行
    if "code" not in params:
        errors.append("missing code")
    if "quantity" not in params:
        errors.append("missing quantity")
    # ...
    return errors
```

---

## 测试策略

### 单元测试

```python
import pytest
from FQBase.Foundation.validators import (
    validate_code,
    validate_date,
    validate_market,
    Validator
)

class TestValidateCode:
    def test_valid_codes(self):
        assert validate_code("000001") is True
        assert validate_code("600000") is True
        assert validate_code("300001") is True

    def test_invalid_codes(self):
        assert validate_code("00001") is False
        assert validate_code("ABCDEF") is False
        assert validate_code("") is False
        assert validate_code(None) is False

class TestValidator:
    def test_required_rule(self):
        validator = Validator()
        assert validator.validate(None, {"required": True}) is False
        assert validator.validate("", {"required": True}) is False
        assert validator.validate("value", {"required": True}) is True

    def test_type_rule(self):
        validator = Validator()
        assert validator.validate(123, {"type": int}) is True
        assert validator.validate("123", {"type": str}) is True
        assert validator.validate(123, {"type": str}) is False
```

### 边界值测试

```python
class TestPercentage:
    def test_boundary_values(self):
        assert validate_percentage(0) is True
        assert validate_percentage(100) is True
        assert validate_percentage(-0.001) is False
        assert validate_percentage(100.001) is False

class TestDateRange:
    def test_edge_cases(self):
        # 最小时间跨度
        assert validate_date_range("2024-01-01", "2024-01-01") is True

        # 最大时间跨度
        assert validate_date_range("2000-01-01", "2024-12-31") is True
```

---

## 反模式

### 1. 验证后不处理

```python
# 反模式
validate_code(user_input)
# 忘记检查返回值！

# 正确
if not validate_code(user_input):
    raise ValueError(f"Invalid code: {user_input}")
```

### 2. 双重验证

```python
# 反模式
if not validate_code(code):
    raise ValueError("Invalid code")

# 业务逻辑中再次验证
if not re.match(r'^\d{6}$', code):
    raise ValueError("Invalid code again")

# 正确：验证一次
if not validate_code(code):
    raise ValueError(f"Invalid code: {code}")
```

### 3. 吞掉异常

```python
# 反模式
try:
    validate_date(date_str)
except Exception:
    pass  # 静默忽略

# 正确
if not validate_date(date_str):
    raise ValueError(f"Invalid date: {date_str}")
```

### 4. 过度宽松验证

```python
# 反模式
validate_frequency("9999h")  # True，但不合法

# 正确：添加业务规则
def validate_realistic_frequency(freq: str) -> bool:
    if not validate_frequency(freq):
        return False

    # 提取数字部分
    num = int(freq[:-1])
    unit = freq[-1].lower()

    # 业务规则限制
    if unit == 'm' and num > 240:  # 最多4小时
        return False
    if unit == 'd' and num > 30:   # 最多30天
        return False

    return True
```
