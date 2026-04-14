# Validators 模块

输入验证器 - 金融数据验证工具集。

## 概述

`validators` 模块提供量化交易场景下的输入验证功能，包括股票代码、日期、市场、频率等常用数据的验证。支持函数式验证和规则式验证两种模式。

```yaml
summary:
  type: utility
  complexity: low
  maturity: stable
  # ⚠️ AI 开发必需信息
  usage_scenarios:
    - "验证股票代码格式是否正确"
    - "验证日期格式是否有效"
    - "验证市场代码是否支持"
    - "验证频率参数是否合法"
  warnings:
    - "不同市场的代码规则不同，需注意"
  limitations:
    - "仅支持已知市场，不支持自定义市场"

relationships:
  depends_on: []
  import_path:
    - from FQBase.Foundation.validators import validate_code
```

## 快速开始

```python
from FQBase.Foundation.validators import (
    validate_code,
    validate_date,
    validate_market,
    validate_frequency
)

# 验证股票代码
validate_code("000001")  # True
validate_code("00001")   # False (不足6位)
validate_code("ABCDEF")  # False (非数字)

# 验证日期
validate_date("2024-01-01")  # True
validate_date("2024/01/01")  # False (格式错误)

# 验证市场
validate_market("SH")  # True
validate_market("NY")  # False (无效市场)

# 验证频率
validate_frequency("1d")   # True
validate_frequency("60m")  # True
validate_frequency("2h")   # False (无效单位)
```

## 核心组件

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

## 特性

- **金融场景优化**: 针对股票代码、日期、市场等金融数据的专用验证
- **双模式验证**: 函数式（简单场景）+ 规则式（复杂场景）
- **零依赖**: 仅使用 Python 标准库
- **可组合**: 验证函数可组合使用

## 使用场景

- API 请求参数验证
- 数据清洗预处理
- 配置文件校验
- 用户输入验证

## 文档索引

- [API 参考](api.md) - 完整接口文档
- [使用指南](usage.md) - 详细使用示例
- [开发指南](development.md) - 开发环境、调试、测试
- [最佳实践](best-practices.md) - 设计模式和注意事项
- [架构设计](architecture.md) - 内部实现和流程
- [设计决策](design.md) - 设计选择和权衡
- [FAQ](faq.md) - 常见问题解答
