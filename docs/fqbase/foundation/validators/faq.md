# FAQ

## 基础问题

### Q: validators 模块提供哪些验证功能？

`validators` 模块提供量化交易场景下的输入验证功能：

| 验证函数 | 说明 |
|----------|------|
| `validate_code()` | 验证股票代码（6位数字） |
| `validate_date()` | 验证日期字符串 |
| `validate_date_range()` | 验证日期范围 |
| `validate_date_range_with_tz()` | 验证带时区的日期范围 |
| `validate_market()` | 验证市场代码 |
| `validate_frequency()` | 验证K线周期 |
| `validate_dict()` | 验证字典必需键 |
| `validate_positive_number()` | 验证正数 |
| `validate_percentage()` | 验证百分比 (0-100) |

此外还有 `Validator` 类支持规则式验证。

---

### Q: 如何快速验证一个股票代码？

```python
from FQBase.Foundation.validators import validate_code

# 验证股票代码
validate_code("000001")  # True
validate_code("600000")  # True
validate_code("ABCDEF")  # False
```

---

### Q: 函数式验证和规则式验证有什么区别？

**函数式验证**：简单直接，一行代码验证一个类型

```python
from FQBase.Foundation.validators import validate_code, validate_date

validate_code("000001")  # 直接返回 True/False
validate_date("2024-01-01")  # 直接返回 True/False
```

**规则式验证**：通过配置规则验证复杂场景

```python
from FQBase.Foundation.validators import Validator

validator = Validator()
rules = {
    'required': True,
    'type': str,
    'min': 0,
    'max': 100
}

is_valid = validator.validate(50, rules)
errors = validator.get_errors()
```

**选择建议**：
- 单一字段验证 → 函数式
- 复杂验证逻辑 → 规则式

---

## 股票代码问题

### Q: 为什么股票代码必须是6位数字？

中国A股市场的股票代码统一为6位数字格式：
- 上交所股票：6开头（如 600000 浦发银行）
- 深交所主板：0开头（如 000001 平安银行）
- 深交所创业板：3开头（如 300001 宁德时代）

```python
validate_code("600000")  # True - 上交所
validate_code("000001")  # True - 深交所主板
validate_code("300001")  # True - 创业板
validate_code("12345")   # False - 不足6位
validate_code("ABCDEF")  # False - 非数字
```

---

### Q: 支持验证港股、美股代码吗？

`validate_code()` 函数仅支持A股6位数字格式。

如需验证其他市场代码，可以使用正则表达式自定义验证：

```python
import re

def validate_hk_code(code: str) -> bool:
    """验证港股代码"""
    pattern = r'^\d{5}$'
    return bool(re.match(pattern, code))

def validate_us_code(code: str) -> bool:
    """验证美股代码"""
    pattern = r'^[A-Z]{1,5}$'
    return bool(re.match(pattern, code))

validate_hk_code("00700")  # True - 腾讯
validate_us_code("AAPL")   # True - 苹果
```

---

## 日期问题

### Q: 支持哪些日期格式？

默认格式：`%Y-%m-%d`（如 2024-01-01）

```python
from FQBase.Foundation.validators import validate_date

validate_date("2024-01-01")  # True
validate_date("2024-12-31")  # True
```

**支持自定义格式：**

```python
validate_date("2024/01/01", "%Y/%m/%d")  # True
validate_date("01-01-2024", "%m-%d-%Y")  # True
validate_date("20240101", "%Y%m%d")  # True
```

---

### Q: 如何验证日期范围的开始和结束？

使用 `validate_date_range()` 函数：

```python
from FQBase.Foundation.validators import validate_date_range

# 正常范围
validate_date_range("2024-01-01", "2024-12-31")  # True

# 逆序范围（错误）
validate_date_range("2024-12-31", "2024-01-01")  # False

# 带时区
from FQBase.Foundation.validators import validate_date_range_with_tz

validate_date_range_with_tz(
    "2024-01-01 00:00", "2024-12-31 23:59",
    tz_start=8,  # 北京时间
    tz_end=8
)  # True
```

---

### Q: 日期验证是否自动处理时区？

`validate_date()` 不处理时区，只验证日期格式。

如需验证带时区的日期范围，使用 `validate_date_range_with_tz()`：

```python
from FQBase.Foundation.validators import validate_date_range_with_tz

# 北京时间 2024-01-01 00:00 vs 纽约时间 2024-01-01 00:00
# 北京时间的时间点更晚
result = validate_date_range_with_tz(
    "2024-01-01",
    "2024-01-01",
    tz_start=8,
    tz_end=-5
)
print(result)  # False - 北京0点比纽约0点晚8小时
```

---

## 市场代码问题

### Q: 支持哪些市场？

```python
from FQBase.Foundation.validators import validate_market

validate_market("SH")  # True - 上海
validate_market("SZ")  # True - 深圳
validate_market("BJ")  # True - 北京
validate_market("HK")  # True - 香港
validate_market("US")  # True - 美国

validate_market("NY")  # False - 不支持
validate_market("TSE")  # False - 不支持
```

**支持的大小写：**

```python
validate_market("sh")  # True - 自动转大写
validate_market("Sh")  # True - 自动转大写
```

---

## K线周期问题

### Q: 支持哪些K线周期？

```python
from FQBase.Foundation.validators import validate_frequency

# 分钟级
validate_frequency("1m")   # True - 1分钟
validate_frequency("5m")   # True - 5分钟
validate_frequency("15m")  # True - 15分钟
validate_frequency("30m")  # True - 30分钟
validate_frequency("60m")  # True - 60分钟

# 日级
validate_frequency("1d")   # True - 日线
validate_frequency("1D")   # True - 日线（同样有效）

# 周级
validate_frequency("1w")   # True - 周线

# 月级
validate_frequency("1M")   # True - 月线

# 无效格式
validate_frequency("1h")   # False - 不支持小时
validate_frequency("2m")   # False - 只能是1m
```

---

### Q: 为什么支持大小写？

兼容不同数据源的格式约定：

```python
validate_frequency("1d")   # True
validate_frequency("1D")   # True
validate_frequency("1m")   # True
validate_frequency("1M")   # True - 月线（非分钟）
```

**注意**：大小写含义不同：
- `1m` = 1分钟
- `1M` = 1月

---

## 规则验证问题

### Q: Validator 类支持哪些规则？

| 规则 | 说明 | 示例 |
|------|------|------|
| `required` | 必填检查 | `{'required': True}` |
| `type` | 类型检查 | `{'type': str}` |
| `min` | 最小值 | `{'min': 0}` |
| `max` | 最大值 | `{'max': 100}` |
| `pattern` | 正则匹配 | `{'pattern': r'^\d{6}$'}` |
| `choices` | 枚举检查 | `{'choices': ['SH', 'SZ']}` |

---

### Q: 如何验证多个字段？

```python
from FQBase.Foundation.validators import Validator

validator = Validator()

def validate_stock_query(params: dict) -> bool:
    """验证股票查询参数"""
    errors = []

    # 验证代码
    if not validator.validate(params.get('code'), {'required': True, 'pattern': r'^\d{6}$'}):
        errors.extend([f"code: {e}" for e in validator.get_errors()])

    # 验证日期
    if not validator.validate(params.get('start_date'), {'required': True}):
        errors.extend([f"start_date: {e}" for e in validator.get_errors()])

    # 验证市场
    if not validator.validate(params.get('market'), {'choices': ['SH', 'SZ', 'BJ']}):
        errors.extend([f"market: {e}" for e in validator.get_errors()])

    return len(errors) == 0

# 使用
params = {
    'code': '000001',
    'start_date': '2024-01-01',
    'market': 'SZ'
}
print(validate_stock_query(params))  # True
```

---

### Q: 如何自定义验证规则？

```python
from FQBase.Foundation.validators import Validator

class StockValidator(Validator):
    """股票专用验证器"""

    def validate_stock_code(self, code: str) -> bool:
        """验证股票代码"""
        self.clear_errors()
        return self.validate(code, {
            'required': True,
            'type': str,
            'pattern': r'^\d{6}$'
        })

    def validate_trade_date_range(self, start: str, end: str) -> bool:
        """验证交易日期范围"""
        self.clear_errors()

        if not self.validate(start, {'required': True}):
            return False

        if not self.validate(end, {'required': True}):
            return False

        from FQBase.Foundation.validators import validate_date_range
        if not validate_date_range(start, end):
            self.add_error("Start date must be before end date")
            return False

        return not self.has_errors()

# 使用
validator = StockValidator()

if validator.validate_stock_code("000001"):
    print("Valid stock code")
else:
    print(f"Errors: {validator.get_errors()}")
```

---

## 错误处理问题

### Q: 验证失败时如何获取详细错误信息？

```python
from FQBase.Foundation.validators import Validator

validator = Validator()

rules = {
    'required': True,
    'type': int,
    'min': 0,
    'max': 100
}

# 验证失败的值
validator.validate(-10, rules)

# 获取所有错误
if validator.has_errors():
    for error in validator.get_errors():
        print(f"Error: {error}")
```

---

### Q: 如何在验证失败时抛出异常？

```python
from FQBase.Foundation.validators import Validator, ValidationError

validator = Validator()

def validate_or_raise(value, rules, field_name="value"):
    """验证值，失败时抛出异常"""
    if not validator.validate(value, rules):
        errors = validator.get_errors()
        raise ValidationError(f"{field_name}: {', '.join(errors)}")
    return value

# 使用
try:
    validate_or_raise("not a number", {'required': True, 'type': int}, "age")
except ValidationError as e:
    print(f"Validation failed: {e}")
```

---

### Q: 如何在循环中累积错误？

```python
from FQBase.Foundation.validators import Validator

validator = Validator()
all_errors = []

def validate_item(index: int, item: dict) -> bool:
    """验证单个项目，累积错误"""
    validator.clear_errors()

    rules = {
        'required': True,
        'type': str
    }

    if not validator.validate(item.get('name'), rules):
        for error in validator.get_errors():
            all_errors.append(f"Item[{index}].name: {error}")

    if not validator.validate(item.get('value'), {'type': int, 'min': 0}):
        for error in validator.get_errors():
            all_errors.append(f"Item[{index}].value: {error}")

    return not validator.has_errors()

# 验证多个项目
items = [
    {'name': 'item1', 'value': 10},
    {'name': '', 'value': -1},  # 有错误
    {'name': 'item3', 'value': 20}
]

results = [validate_item(i, item) for i, item in enumerate(items)]

if all_errors:
    print("Validation errors found:")
    for error in all_errors:
        print(f"  - {error}")
```

---

## 常见错误

### Q: 错误：`Value is required`

**原因**：值为 `None` 或空字符串

```python
validator = Validator()

# 触发错误
validator.validate(None, {'required': True})  # False
validator.validate("", {'required': True})     # False

# 正确用法
validator.validate("value", {'required': True})  # True
```

---

### Q: 错误：`Expected type X, got Y`

**原因**：值类型不匹配

```python
validator = Validator()

# 触发错误
validator.validate("123", {'type': int})  # False - 字符串不是整数

# 正确用法
validator.validate(123, {'type': int})  # True
validator.validate("123", {'type': str})  # True
```

---

### Q: 错误：正则表达式不匹配

**原因**：值不符合正则模式

```python
validator = Validator()

rules = {'pattern': r'^\d{6}$'}

# 触发错误
validator.validate("ABCDEF", rules)  # False - 非数字
validator.validate("12345", rules)   # False - 只有5位

# 正确用法
validator.validate("000001", rules)  # True
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [开发指南](development.md)
- [最佳实践](best-practices.md)
- [架构设计](architecture.md)
- [设计决策](design.md)