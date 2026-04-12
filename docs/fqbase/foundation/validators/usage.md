# 使用指南

## 基础验证

### 股票代码验证

```python
from FQBase.Foundation.validators import validate_code

# 验证单条
validate_code("000001")  # True (平安银行)
validate_code("600000")  # True (浦发银行)
validate_code("300001")  # True (宁德时代)

# 无效代码
validate_code("00001")   # False (不足6位)
validate_code("ABCDEF")   # False (非数字)
validate_code("")         # False (空字符串)
validate_code(None)      # False (None)
```

### 日期验证

```python
from FQBase.Foundation.validators import validate_date

# 标准格式
validate_date("2024-01-01")  # True
validate_date("2024-12-31")  # True

# 自定义格式
validate_date("01/01/2024", "%m/%d/%Y")  # True
validate_date("20240101", "%Y%m%d")       # True

# 无效格式
validate_date("2024/01/01")  # False
validate_date("01-01-2024")  # False
```

---

## 日期范围验证

### 简单日期范围

```python
from FQBase.Foundation.validators import validate_date_range

# 正常范围
validate_date_range("2024-01-01", "2024-12-31")  # True

# 反序（无效）
validate_date_range("2024-12-31", "2024-01-01")  # False

# 边界相等
validate_date_range("2024-01-01", "2024-01-01")  # True

# 无效日期
validate_date_range("invalid", "2024-12-31")  # False
```

### 带时区范围

```python
from FQBase.Foundation.validators import validate_date_range_with_tz

# 北京时间范围
validate_date_range_with_tz(
    "2024-01-01",
    "2024-01-02",
    tz_start=8,
    tz_end=8
)  # True

# 跨时区比较 (2024-01-01 08:00+8 > 2024-01-01 00:00+0)
validate_date_range_with_tz(
    "2024-01-01",
    "2024-01-01",
    tz_start=8,
    tz_end=0
)  # True
```

---

## 市场与频率验证

### 市场验证

```python
from FQBase.Foundation.validators import validate_market

# 支持的市场
validate_market("SH")  # True  上海
validate_market("SZ")  # True  深圳
validate_market("BJ")  # True  北京
validate_market("HK")  # True  香港
validate_market("US")  # True  美国

# 大小写不敏感
validate_market("sh")  # True
validate_market("Sh")  # True

# 不支持的市场
validate_market("NY")   # False 纽约
validate_market("LD")  # False 伦敦
validate_market("TYO") # False 东京
```

### K线频率验证

```python
from FQBase.Foundation.validators import validate_frequency

# 分钟级别
validate_frequency("1m")   # True
validate_frequency("5m")    # True
validate_frequency("15m")   # True
validate_frequency("30m")   # True
validate_frequency("60m")   # True
validate_frequency("120m")  # True

# 日级别
validate_frequency("1d")    # True
validate_frequency("5d")    # True

# 周级别
validate_frequency("1w")    # True
validate_frequency("4w")    # True

# 月级别
validate_frequency("1M")    # True
validate_frequency("3M")    # True

# 大小写不敏感
validate_frequency("1D")    # True
validate_frequency("1W")    # True
validate_frequency("1M")    # True

# 无效格式
validate_frequency("2h")    # False (不支持小时)
validate_frequency("0m")    # False (不能为0)
validate_frequency("m")     # False (缺少数字)
```

---

## 数值验证

### 正数验证

```python
from FQBase.Foundation.validators import validate_positive_number

validate_positive_number(1)       # True
validate_positive_number(0.1)     # True
validate_positive_number("100")   # True (字符串转数字)
validate_positive_number(0)       # False (零不是正数)
validate_positive_number(-1)      # False
validate_positive_number("abc")   # False
```

### 百分比验证

```python
from FQBase.Foundation.validators import validate_percentage

validate_percentage(0)    # True
validate_percentage(50)   # True
validate_percentage(100)  # True
validate_percentage(-1)   # False
validate_percentage(101)  # False
```

---

## 字典验证

### 必需键验证

```python
from FQBase.Foundation.validators import validate_dict

data = {
    "code": "000001",
    "name": "平安银行",
    "price": 12.50
}

# 单个必需键
validate_dict(data, ["code"])  # True

# 多个必需键
validate_dict(data, ["code", "name"])  # True
validate_dict(data, ["code", "price"])  # True

# 缺少键
validate_dict(data, ["code", "volume"])  # False

# 非字典
validate_dict("not a dict", ["code"])  # False
validate_dict(None, ["code"])          # False
```

---

## Validator 类使用

### 基础用法

```python
from FQBase.Foundation.validators import Validator

validator = Validator()

# 验证数字范围
result = validator.validate(50, {"min": 0, "max": 100})
print(result)  # True

# 验证失败
result = validator.validate(-1, {"min": 0, "max": 100})
print(result)  # False
print(validator.get_errors())  # ["Value must be >= 0"]
```

### 组合多个规则

```python
validator = Validator()

# 必填 + 类型 + 范围
result = validator.validate(75, {
    "required": True,
    "type": int,
    "min": 0,
    "max": 100
})
```

### 类型验证

```python
validator = Validator()

validator.validate("hello", {"type": str})     # True
validator.validate(123, {"type": str})        # False
validator.validate([1, 2], {"type": list})    # True
validator.validate((1, 2), {"type": list})    # False
```

### 正则验证

```python
validator = Validator()

# 邮箱验证
validator.validate("user@example.com", {
    "pattern": r'^[\w.-]+@[\w.-]+\.\w+$'
})  # True

# 手机号验证
validator.validate("13812345678", {
    "pattern": r'^1[3-9]\d{9}$'
})  # True

validator.validate("12345678901", {
    "pattern": r'^1[3-9]\d{9}$'
})  # False
```

### 选择集验证

```python
validator = Validator()

validator.validate("SH", {"choices": ("SH", "SZ", "BJ")})  # True
validator.validate("HK", {"choices": ("SH", "SZ", "BJ")}) # False
```

---

## 实际应用场景

### API 参数验证

```python
from FQBase.Foundation.validators import (
    validate_code,
    validate_date,
    validate_market,
    validate_frequency
)

def get_stock_data(code: str, start_date: str, end_date: str,
                   market: str, freq: str) -> dict:
    errors = []

    if not validate_code(code):
        errors.append(f"Invalid stock code: {code}")

    if not validate_date(start_date):
        errors.append(f"Invalid start date: {start_date}")

    if not validate_date(end_date):
        errors.append(f"Invalid end date: {end_date}")

    if errors:
        raise ValueError(f"Validation failed: {errors}")

    if not validate_market(market):
        raise ValueError(f"Invalid market: {market}")

    if not validate_frequency(freq):
        raise ValueError(f"Invalid frequency: {freq}")

    # 获取数据
    return fetch_data(code, start_date, end_date, market, freq)
```

### 配置验证

```python
from FQBase.Foundation.validators import (
    validate_dict,
    validate_positive_number,
    validate_percentage
)

def validate_config(config: dict) -> bool:
    required_keys = ["host", "port", "timeout", "retry_percent"]
    if not validate_dict(config, required_keys):
        return False

    if not validate_positive_number(config["port"]):
        return False

    if not validate_percentage(config["retry_percent"]):
        return False

    return True
```

### 用户输入验证

```python
from FQBase.Foundation.validators import Validator

def validate_user_input(data: dict) -> tuple[bool, list]:
    validator = Validator()
    errors = []

    # 验证代码
    if not validator.validate(data.get("code"), {"required": True, "pattern": r'^\d{6}$'}):
        errors.extend(validator.get_errors())

    # 验证价格
    price = data.get("price")
    if not validator.validate(price, {"required": True, "type": (int, float), "min": 0}):
        errors.extend(validator.get_errors())

    # 验证数量
    quantity = data.get("quantity")
    if not validator.validate(quantity, {"required": True, "type": int, "min": 1}):
        errors.extend(validator.get_errors())

    return len(errors) == 0, errors
```

---

## 批量验证

```python
from FQBase.Foundation.validators import validate_code

codes = ["000001", "600000", "ABCDEF", "300001", "INVALID"]

valid_codes = []
invalid_codes = []

for code in codes:
    if validate_code(code):
        valid_codes.append(code)
    else:
        invalid_codes.append(code)

print(f"Valid: {valid_codes}")
print(f"Invalid: {invalid_codes}")
```
