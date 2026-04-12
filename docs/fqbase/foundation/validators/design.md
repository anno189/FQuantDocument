# 设计决策

## 为什么同时提供函数式和类式验证?

### 函数式验证

```python
validate_code("000001")  # bool
```

**优势:**

- 一行搞定
- 无状态
- 可组合
- 适合简单场景

**局限:**

- 只返回 True/False
- 只能验证一个条件

### 类式验证

```python
validator = Validator()
validator.validate(value, {"min": 0, "max": 100})
validator.get_errors()  # 可以获取详细错误
```

**优势:**

- 可收集多条错误
- 规则可组合
- 可扩展

**局限:**

- 需要实例化
- 代码稍多

### 设计决策

**同时提供两种接口**，让调用者根据场景选择：

```python
# 简单场景：函数式
if not validate_code(code):
    return error

# 复杂场景：类式
validator = Validator()
validator.validate(code, {"type": str, "pattern": r'^\d{6}$'})
validator.validate(price, {"type": (int, float), "min": 0})
validator.validate(market, {"choices": ("SH", "SZ")})
if validator.has_errors():
    return validator.get_errors()
```

---

## 为什么返回 bool 而非异常?

### 方案对比

```python
# 方案 A: 返回 bool (采用)
def validate_code(code: str) -> bool:
    return bool(re.match(r'^\d{6}$', code))

# 方案 B: 抛出异常
def validate_code(code: str) -> None:
    if not re.match(r'^\d{6}$', code):
        raise ValidationError(f"Invalid code: {code}")
```

### 选择原因

| 场景 | bool 更适合 | 异常更适合 |
|------|------------|-----------|
| 条件判断 | ✅ | ❌ |
| 表单验证 | ✅ (收集所有错误) | ❌ |
| 快速失败 | ✅ | ❌ |
| 必填字段 | ❌ | ✅ |

**决策:** 验证函数返回 bool，Validator 类负责收集错误。对于必填字段等场景，推荐使用 Validator 或直接抛异常。

---

## 为什么使用正则而非字符串方法?

### 对比

```python
# 正则实现
def validate_code(code: str) -> bool:
    pattern = r'^\d{6}$'
    return bool(re.match(pattern, code))

# 字符串方法实现
def validate_code(code: str) -> bool:
    return (isinstance(code, str) and
            len(code) == 6 and
            code.isdigit())
```

### 选择正则的原因

```python
# 正则优势：可扩展
# 未来需要支持 8 位代码?
pattern = r'^\d{6,8}$'  # 只需改一处

# 字符串方法劣势：
# 需要修改多处逻辑
```

**决策:** 使用正则，支持模式扩展。

---

## 为什么 validate_date 不自动推断格式?

### 方案对比

```python
# 方案 A: 单一固定格式 (采用)
def validate_date(date_str: str, format: str = '%Y-%m-%d') -> bool:
    try:
        datetime.strptime(date_str, format)
        return True
    except ValueError:
        return False

# 方案 B: 自动推断
def validate_date(date_str: str) -> bool:
    formats = ['%Y-%m-%d', '%Y/%m/%d', '%d-%m-%Y', ...]
    for format in formats:
        if try_parsing(date_str, format):
            return True
    return False
```

### 选择固定格式的原因

1. **明确性**: 调用者明确知道期望的格式
2. **性能**: 不需要尝试多种格式
3. **国际化**: 不同地区日期格式不同，固定格式避免歧义
4. **金融场景**: 数据格式通常是固定的

**决策:** 默认 `%Y-%m-%d`，允许自定义格式。

---

## 为什么 validate_date_range 需要先验证日期有效性?

```python
def validate_date_range(start_date: str, end_date: str, format: str = '%Y-%m-%d') -> bool:
    # 先验证日期格式
    if not validate_date(start_date, format) or not validate_date(end_date, format):
        return False
    # 再比较
    start = datetime.strptime(start_date, format)
    end = datetime.strptime(end_date, format)
    return start <= end
```

### 设计决策

**前置验证确保比较的合法性：**

```python
# 无前置验证的问题
validate_date_range("invalid", "2024-12-31")  # 怎么比较?
validate_date_range("2024-13-01", "2024-12-31")  # 非法日期怎么比?
```

**决策:** 先验证日期有效性，再比较范围，确保结果可预测。

---

## 为什么 validate_frequency 支持多种单位?

```python
# 分钟
validate_frequency("1m"), validate_frequency("60m"), validate_frequency("120m")

# 日
validate_frequency("1d"), validate_frequency("5d")

# 周
validate_frequency("1w"), validate_frequency("4w")

# 月
validate_frequency("1M"), validate_frequency("3M")
```

### 金融数据需求

| 数据类型 | 常见周期 |
|----------|----------|
| 分钟K线 | 1m, 5m, 15m, 30m, 60m |
| 日K线 | 1d, 5d |
| 周K线 | 1w, 4w |
| 月K线 | 1M, 3M |

**决策:** 支持 m/d/w/M 四种单位，覆盖主要金融场景。

---

## 为什么 validate_market 用 uppercase 处理?

```python
def validate_market(market: str) -> bool:
    valid_markets = ['SH', 'SZ', 'BJ', 'HK', 'US']
    return market.upper() in valid_markets
```

### 决策原因

```python
# 用户输入可能大小写混用
validate_market("sh")   # 用户习惯小写
validate_market("Sh")   # 手滑
validate_market("SH")   # 标准

# 自动转大写让验证更友好
```

**注意:** 如果需要区分大小写的市场代码，应使用 `market in valid_markets`（不加 `.upper()`）。

---

## 为什么 Validator.validate 遇到错误立即返回 False?

```python
def validate(self, value: Any, rules: dict) -> bool:
    for rule_name, rule_value in rules.items():
        if rule_name == 'required':
            if value is None or value == '':
                self.add_error(f"Value is required")
                return False  # 立即返回
    # ...
```

### 方案对比

```python
# 立即返回 (采用)
# 优势：性能好，短路求值
# 劣势：只显示第一个错误

# 收集所有错误
# 优势：知道所有问题
# 劣势：性能稍差

validator = Validator()
validator.validate(50, {"min": 0, "max": 100, "required": True})
# 如果 required 失败，不会继续检查 min/max
```

### 设计决策

**立即返回适合大多数场景：**

```python
# 验证失败通常意味着表单有问题
# 显示第一个错误让用户快速修正
```

**如果需要收集所有错误，可以手动拆分成多次验证：**

```python
validator = Validator()
validator.validate(value, {"required": True})
validator.validate(value, {"type": int})
validator.validate(value, {"min": 0})
# 最后统一获取所有错误
```

---

## 为什么使用 List 而非 Set 存储错误?

```python
class Validator:
    def __init__(self):
        self._errors: List[str] = []  # 为什么是 List?
```

### 决策原因

```python
# List 保证顺序：错误按添加顺序显示
validator.add_error("Error 1")
validator.add_error("Error 2")
validator.get_errors()  # ["Error 1", "Error 2"]

# Set 不保证顺序
# {"Error 2", "Error 1"}  # 随机
```

**决策:** 使用 List，保持错误顺序一致。

---

## 为什么 validate_positive_number 允许字符串输入?

```python
validate_positive_number("100")  # True
validate_positive_number("0.5")  # True
```

### 决策原因

```python
# 表单输入通常是字符串
<input type="text" name="price" value="100">

# 需要手动转类型
price = float(request.form['price'])

# 验证函数应该能处理字符串数字
if not validate_positive_number(request.form['price']):
    return error
```

**决策:** 允许字符串输入，减少调用者类型转换负担。

---

## 为什么 validate_percentage 范围是 0-100 而非 0-1?

```python
validate_percentage(50)   # True (50%)
validate_percentage(0.5)  # False (不是 50!)
```

### 决策原因

```python
# 金融场景常用百分比表示
# 涨跌幅: 5% (不是 0.05)
# 佣金率: 0.03% (不是 0.0003)

# 0-1 更适合概率计算
# 胜率: 0.6 (60%)
```

**决策:** 默认 0-100 范围，适合金融场景。如需 0-1 范围，用户可自行转换。

---

## 与 Pydantic 的权衡

### Pydantic 方案

```python
from pydantic import BaseModel, validator

class StockCode(BaseModel):
    code: str

    @validator('code')
    def validate_code(cls, v):
        if not re.match(r'^\d{6}$', v):
            raise ValueError('Invalid code')
        return v
```

### FQBase validators 优势

| 方面 | FQBase validators | Pydantic |
|------|------------------|----------|
| 依赖 | 无 | 需要安装 |
| 复杂度 | 轻量 | 重量级 |
| 灵活性 | 高 (自由组合) | 低 (需要定义模型) |
| 性能 | 快 | 稍慢 |

**决策:** FQBase validators 提供轻量级、无依赖的验证方案，适合不需要完整数据验证框架的场景。
