# 架构设计

## 模块结构

```
validators.py
├── 验证函数
│   ├── validate_code()          # 股票代码验证
│   ├── validate_date()          # 日期验证
│   ├── validate_date_range()     # 日期范围验证
│   ├── validate_date_range_with_tz()  # 时区日期范围
│   ├── validate_market()         # 市场验证
│   ├── validate_frequency()      # K线周期验证
│   ├── validate_dict()           # 字典键验证
│   ├── validate_positive_number()  # 正数验证
│   └── validate_percentage()    # 百分比验证
│
├── Validator 类
│   ├── _errors: List[str]       # 错误存储
│   ├── add_error()
│   ├── has_errors()
│   ├── get_errors()
│   ├── clear_errors()
│   └── validate()
│
└── ValidationError 异常
```

---

## 类图

```
┌─────────────────────────────────────────────────────────────────┐
│                      ValidationError                             │
│                      (Exception)                                 │
├─────────────────────────────────────────────────────────────────┤
│  (继承自 Exception)                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         Validator                                │
├─────────────────────────────────────────────────────────────────┤
│  - _errors: List[str]                                            │
├─────────────────────────────────────────────────────────────────┤
│  + __init__()                                                   │
│  + add_error(message: str) -> None                               │
│  + has_errors() -> bool                                         │
│  + get_errors() -> List[str]                                    │
│  + clear_errors() -> None                                        │
│  + validate(value: Any, rules: dict) -> bool                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 函数验证流程

### validate_code 流程

```
输入: "000001"
        │
        ▼
┌───────────────────────┐
│ isinstance(str)?     │
└───────────┬───────────┘
       Yes │ No
           │    │
           ▼    ▼
        True  False
           │
           ▼
┌───────────────────────┐
│ regex: ^\d{6}$       │
│ match("000001")?      │
└───────────┬───────────┘
       Yes │ No
           │    │
           ▼    ▼
        True  False
```

---

## Validator 验证流程

```
┌─────────────────────────────────────────────────────────────────┐
│                    Validator.validate(value, rules)             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   clear_errors()       │
                    │   _errors = []         │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  for rule, value      │
                    │  in rules.items():    │
                    └───────────┬───────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
        ┌──────────┐      ┌──────────┐      ┌──────────┐
        │required │      │   type   │      │   min    │
        └────┬─────┘      └────┬─────┘      └────┬─────┘
             │                 │                 │
             ▼                 ▼                 ▼
      value is None      isinstance(        value < rule
      or value == ''?    value, rule)?           value?
             │                 │                 │
        ┌────┴────┐       ┌────┴────┐        ┌────┴────┐
       Yes│  No   Yes│   No  Yes│   No    Yes│  No
        │    │     │     │     │     │      │    │
        ▼    │     ▼     │     ▼     │      ▼    │
    add_err  │    add_err │    add_err │     add_err│
        │    │     │     │     │     │      │    │
        └────┴─────└─────┴─────└─────┴──────┴────┘
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                    ┌───────────────────────┐
                    │  not has_errors()?     │
                    └───────────┬───────────┘
                               Yes│No
                                │  │
                                ▼  ▼
                             True False
```

---

## 规则处理矩阵

| 规则 | 条件判断 | 错误信息 |
|------|----------|----------|
| `required: True` | `value is None or value == ''` | "Value is required" |
| `type: X` | `not isinstance(value, X)` | "Expected type X.__name__, got Y.__name__" |
| `min: N` | `isinstance(value, int/float) and value < N` | "Value must be >= N" |
| `max: N` | `isinstance(value, int/float) and value > N` | "Value must be <= N" |
| `pattern: R` | `not re.match(R, str(value))` | "Value does not match pattern R" |
| `choices: (A,B)` | `value not in (A,B)` | "Value must be one of (A,B)" |

---

## 模块依赖

```
validators.py
    │
    ├── datetime (标准库)
    │    └── datetime.strptime()
    │
    ├── re (标准库)
    │    └── re.match()
    │
    └── typing (标准库)
         └── Any, List
```

---

## 设计决策

### 函数式 vs 类式验证

```python
# 函数式：轻量、返回 bool
validate_code("000001")  # True/False

# 类式：可收集多条错误
validator = Validator()
validator.validate(data, rules)
validator.get_errors()  # ["error1", "error2"]
```

**为什么同时提供两种?**

- 函数式：简单场景，一行搞定
- 类式：复杂表单，需要知道所有错误而非只第一个
