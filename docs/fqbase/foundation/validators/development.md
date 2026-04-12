# Validators 开发指南

## 模块简介

`validators` 模块提供量化交易场景下的输入验证功能，包括股票代码、日期、市场、频率等数据的验证。

### 核心组件

| 组件 | 类型 | 说明 |
|------|------|------|
| `validate_code()` | 函数 | 验证股票代码格式（6位数字） |
| `validate_date()` | 函数 | 验证日期字符串格式 |
| `validate_date_range()` | 函数 | 验证日期范围 |
| `validate_date_range_with_tz()` | 函数 | 验证带时区的日期范围 |
| `validate_market()` | 函数 | 验证市场代码 |
| `validate_frequency()` | 函数 | 验证K线周期 |
| `validate_dict()` | 函数 | 验证字典必需键 |
| `validate_positive_number()` | 函数 | 验证正数 |
| `validate_percentage()` | 函数 | 验证百分比 (0-100) |
| `Validator` | 类 | 规则式验证器 |
| `ValidationError` | 异常 | 验证异常类 |

---

## 开发环境

### 环境要求

- Python 3.8+
- pytest（用于测试）

### 安装

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pip install -e .
```

### 验证安装

```bash
python -c "from FQBase.Foundation.validators import validate_code, validate_date; print('OK')"
```

---

## 本地调试

### 基本调试流程

```python
from FQBase.Foundation.validators import (
    validate_code,
    validate_date,
    validate_market
)

# 验证股票代码
result = validate_code("000001")
print(f"validate_code result: {result}")  # True

# 验证失败排查
result = validate_code("ABCDEF")
print(f"validate_code result: {result}")  # False
```

### 调试 Validator 类

```python
from FQBase.Foundation.validators import Validator, ValidationError

validator = Validator()

# 添加验证规则
rules = {
    'required': True,
    'type': str,
    'min': 0,
    'max': 100
}

# 验证值
is_valid = validator.validate(50, rules)
print(f"is_valid: {is_valid}")
print(f"errors: {validator.get_errors()}")

# 验证失败
validator.validate(-10, rules)
print(f"errors: {validator.get_errors()}")  # ["Value must be >= 0"]
```

### 调试日期范围验证

```python
from FQBase.Foundation.validators import (
    validate_date_range,
    validate_date_range_with_tz
)

# 基本日期范围
result = validate_date_range("2024-01-01", "2024-12-31")
print(f"range valid: {result}")  # True

# 带时区的日期范围
result = validate_date_range_with_tz(
    "2024-01-01", "2024-12-31",
    tz_start=8,  # 北京时间
    tz_end=-5    # 纽约时间
)
print(f"range with tz valid: {result}")  # True
```

---

## 测试指南

### 运行测试

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQBase
pytest -v FQBase/Foundation/test_validators.py
```

### 测试结构

```python
import pytest
from FQBase.Foundation.validators import (
    validate_code,
    validate_date,
    validate_market,
    validate_frequency,
    Validator,
    ValidationError
)

class TestValidateCode:
    def test_valid_code(self):
        assert validate_code("000001") is True
        assert validate_code("600000") is True

    def test_invalid_code(self):
        assert validate_code("00001") is False   # 不足6位
        assert validate_code("ABCDEF") is False  # 非数字
        assert validate_code("") is False        # 空字符串
        assert validate_code(None) is False       # None

class TestValidateDate:
    def test_valid_date(self):
        assert validate_date("2024-01-01") is True
        assert validate_date("2024-12-31") is True

    def test_invalid_format(self):
        assert validate_date("2024/01/01") is False
        assert validate_date("01-01-2024") is False

class TestValidator:
    def test_required_rule(self):
        validator = Validator()
        assert validator.validate("", {'required': True}) is False
        assert validator.validate(None, {'required': True}) is False
        assert validator.validate("value", {'required': True}) is True

    def test_type_rule(self):
        validator = Validator()
        assert validator.validate(123, {'type': int}) is True
        assert validator.validate("123", {'type': int}) is False
```

### 测试边界条件

```python
class TestBoundaryConditions:
    def test_code_boundary(self):
        assert validate_code("000000") is True  # 最小值
        assert validate_code("999999") is True  # 最大值
        assert validate_code("00000") is False  # 5位
        assert validate_code("0000000") is False  # 7位

    def test_percentage_boundary(self):
        from FQBase.Foundation.validators import validate_percentage

        assert validate_percentage(0) is True      # 边界值
        assert validate_percentage(100) is True   # 边界值
        assert validate_percentage(-1) is False    # 越界
        assert validate_percentage(101) is False  # 越界

    def test_frequency_boundary(self):
        from FQBase.Foundation.validators import validate_frequency

        assert validate_frequency("1m") is True    # 最小周期
        assert validate_frequency("1M") is True    # 月线
        assert validate_frequency("1w") is True    # 周线
        assert validate_frequency("1d") is True   # 日线
```

### 测试验证器规则组合

```python
class TestValidatorRules:
    def test_multiple_rules(self):
        validator = Validator()

        rules = {
            'required': True,
            'type': int,
            'min': 0,
            'max': 100
        }

        assert validator.validate(50, rules) is True
        assert validator.validate(0, rules) is True
        assert validator.validate(100, rules) is True
        assert validator.validate(-1, rules) is False
        assert validator.validate(101, rules) is False
        assert validator.validate("abc", rules) is False

    def test_choices_rule(self):
        validator = Validator()

        rules = {
            'choices': ['SH', 'SZ', 'BJ']
        }

        assert validator.validate('SH', rules) is True
        assert validator.validate('NY', rules) is False

    def test_pattern_rule(self):
        validator = Validator()

        rules = {
            'pattern': r'^\d{6}$'
        }

        assert validator.validate('000001', rules) is True
        assert validator.validate('ABCDEF', rules) is False
```

---

## 代码规范

### 验证函数命名

```python
# 推荐：明确验证类型的命名
def validate_stock_code(code: str) -> bool:
    """验证股票代码"""
    pass

def validate_trading_date(date_str: str) -> bool:
    """验证交易日期"""
    pass

# 避免：过于通用的命名
def validate(value):
    """验证...什么？"""
    pass
```

### 验证函数实现规范

```python
# 推荐：清晰的函数文档和参数验证
def validate_code(code: str) -> bool:
    """验证股票代码格式

    Args:
        code: 股票代码，6位数字

    Returns:
        True if valid, False otherwise

    Example:
        >>> validate_code("000001")
        True
        >>> validate_code("ABCDEF")
        False
    """
    if not code or not isinstance(code, str):
        return False
    pattern = r'^\d{6}$'
    return bool(re.match(pattern, code))

# 避免：缺少文档和类型注解
def validate_code(code):
    return bool(re.match(r'^\d{6}$', code))
```

### Validator 类使用规范

```python
# 推荐：清晰的规则定义
validator = Validator()

rules = {
    'required': True,
    'type': str,
    'min': 6,
    'max': 6,
    'pattern': r'^\d{6}$'
}

is_valid = validator.validate(code, rules)
if not is_valid:
    for error in validator.get_errors():
        print(f"Validation error: {error}")

# 避免：规则不清晰
validator.validate(code, {'type': str})
```

---

## 调试技巧

### 打印验证错误

```python
from FQBase.Foundation.validators import Validator

validator = Validator()

# 测试各种值
test_values = ["000001", "ABCDEF", "", None, "600000"]

for value in test_values:
    validator.validate(value, {'required': True, 'type': str})
    if validator.has_errors():
        print(f"Value {repr(value)} errors: {validator.get_errors()}")
    else:
        print(f"Value {repr(value)} is valid")
```

### 调试正则表达式

```python
import re

# 测试股票代码正则
pattern = r'^\d{6}$'
test_codes = ["000001", "600000", "ABCDEF", "12345", "1234567"]

for code in test_codes:
    match = re.match(pattern, code)
    print(f"Code {code}: {'Match' if match else 'No match'}")
```

### 自定义验证规则调试

```python
from FQBase.Foundation.validators import Validator

validator = Validator()

# 添加自定义验证逻辑
def validate_portfolio(portfolio: dict) -> bool:
    """验证投资组合配置"""
    validator.clear_errors()

    # 必需字段
    if 'stocks' not in portfolio:
        validator.add_error("Missing 'stocks' field")
        return False

    # 验证股票数量
    if not isinstance(portfolio['stocks'], list):
        validator.add_error("'stocks' must be a list")
        return False

    if len(portfolio['stocks']) == 0:
        validator.add_error("'stocks' cannot be empty")
        return False

    return not validator.has_errors()

# 测试
portfolio1 = {"stocks": ["000001", "600000"]}
portfolio2 = {"bonds": ["TB001"]}  # 缺少 stocks

print(f"Portfolio 1 valid: {validate_portfolio(portfolio1)}")
print(f"Portfolio 2 errors: {validator.get_errors()}")
```

---

## 常见问题

### Q: validate_code 为什么只接受6位数字？

股票代码在中国A股市场统一为6位数字格式：
- 上交所股票以 6 开头（如 600000）
- 深交所股票以 0、3 开头（如 000001、300001）

```python
validate_code("000001")  # True
validate_code("600000")  # True
validate_code("300001")  # True
validate_code("12345")   # False - 不足6位
validate_code("ABCDEF")   # False - 非数字
```

### Q: 日期验证支持哪些格式？

默认支持 `%Y-%m-%d` 格式，可通过参数指定其他格式：

```python
validate_date("2024-01-01")       # True
validate_date("2024/01/01", "%Y/%m/%d")  # True
validate_date("01-01-2024", "%m-%d-%Y")  # True
```

### Q: 如何验证自定义格式的日期？

```python
from datetime import datetime

def validate_custom_date(date_str: str, fmt: str) -> bool:
    """验证自定义格式日期"""
    try:
        datetime.strptime(date_str, fmt)
        return True
    except ValueError:
        return False

# 使用
validate_custom_date("20240101", "%Y%m%d")  # True
validate_custom_date("01/01/2024", "%m/%d/%Y")  # True
```

### Q: validate_frequency 支持哪些周期？

```python
# 支持的格式
validate_frequency("1m")   # 1分钟
validate_frequency("5m")   # 5分钟
validate_frequency("15m")  # 15分钟
validate_frequency("30m")  # 30分钟
validate_frequency("60m")  # 60分钟
validate_frequency("1h")    # 1小时（注意：小写d/w/m表示不同周期）

# 注意大小写
validate_frequency("1d")   # 日线
validate_frequency("1D")   # 日线（同样有效）
validate_frequency("1M")   # 月线
validate_frequency("1w")   # 周线
```

### Q: Validator 类的规则执行顺序是怎样的？

规则按照字典的迭代顺序执行，验证会在第一个错误发生时停止：

```python
validator = Validator()

rules = {
    'required': True,
    'type': int,
    'min': 0
}

# 验证 None
validator.validate(None, rules)
print(validator.get_errors())  # ["Value is required"]
# 不会继续检查 type 和 min，因为 required 已失败

# 验证 "abc"
validator.clear_errors()
validator.validate("abc", rules)
print(validator.get_errors())  # ["Expected type int, got str"]
# 不会继续检查 min
```

### Q: 如何在验证失败时抛出异常而非返回 False？

```python
from FQBase.Foundation.validators import Validator, ValidationError

validator = Validator()

def validate_or_raise(value, rules):
    """验证值，失败时抛出异常"""
    if not validator.validate(value, rules):
        errors = validator.get_errors()
        raise ValidationError(f"Validation failed: {', '.join(errors)}")
    return value

# 使用
try:
    validate_or_raise("invalid", {'required': True, 'type': int})
except ValidationError as e:
    print(f"Caught error: {e}")
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)
- [FAQ](faq.md)