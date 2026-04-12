# Converters 模块

数据转换工具，提供日期、数字、百分比等常用转换功能。

## 日期转换

### date_to_str

日期转换为字符串。

```python
from FQBase.Util import date_to_str
from datetime import datetime
import pandas as pd

# datetime 转字符串
date_to_str(datetime.now())  # '2024-01-15'

# pandas Timestamp 转字符串
date_to_str(pd.Timestamp('2024-01-15'))  # '2024-01-15'

# 自定义格式
date_to_str(datetime.now(), '%Y/%m/%d')  # '2024/01/15'
date_to_str(datetime.now(), '%Y%m%d')  # '20240115'
```

---

### str_to_date

字符串转换为日期。

```python
from FQBase.Util import str_to_date

# 解析日期
dt = str_to_date('2024-01-15')  # datetime(2024, 1, 15)

# 自定义格式
dt = str_to_date('2024/01/15', '%Y/%m/%d')  # datetime(2024, 1, 15)
```

---

## 代码转换

### normalize_code

标准化股票代码。

```python
from FQBase.Util import normalize_code

normalize_code('  600000  ')  # '600000'
normalize_code('600000')       # '600000'
normalize_code('abc')         # 'ABC'
normalize_code(600000)        # '600000'
```

---

## 数字转换

### parse_number

解析数字，处理异常。

```python
from FQBase.Util import parse_number

parse_number('123.45')          # 123.45
parse_number('invalid')         # 0.0
parse_number('123.45', default=1.0)  # 123.45
parse_number(None, default=1.0)  # 1.0
parse_number('', default=0.0)    # 0.0
```

---

### safe_divide

安全除法。

```python
from FQBase.Util import safe_divide

safe_divide(10, 2)           # 5.0
safe_divide(10, 0)           # 0.0
safe_divide(10, 0, default=-1)  # -1
safe_divide(10, 3)           # 3.333...
```

---

## 百分比转换

### percentage_change

计算百分比变化。

```python
from FQBase.Util import percentage_change

# 上涨
percentage_change(110, 100)   # 10.0 (10%)

# 下跌
percentage_change(90, 100)   # -10.0 (-10%)

# 不变
percentage_change(100, 100)  # 0.0 (0%)

# 昨日价格为0
percentage_change(100, 0)     # 0.0 (避免除零)
```

---

### format_percentage

格式化百分比。

```python
from FQBase.Util import format_percentage

# 小数转百分比字符串
format_percentage(0.1)        # '10.00%'
format_percentage(0.1234)   # '12.34%'
format_percentage(0.12345, decimals=3)  # '12.345%'

# 负数百分比
format_percentage(-0.1)     # '-10.00%'
```

---

## 使用示例

### 数据清洗

```python
from FQBase.Util import parse_number, normalize_code, safe_divide

def clean_stock_data(raw_data):
    """清洗股票数据"""
    return {
        'code': normalize_code(raw_data.get('stockCode', '')),
        'price': parse_number(raw_data.get('price'), default=0.0),
        'change': percentage_change(
            parse_number(raw_data.get('current', 0)),
            parse_number(raw_data.get('previous', 0))
        ),
        'volume_ratio': safe_divide(
            parse_number(raw_data.get('volume', 0)),
            parse_number(raw_data.get('avgVolume', 0)),
            default=0.0
        )
    }

raw = {
    'stockCode': '  600000  ',
    'price': '123.45',
    'current': '124.00',
    'previous': '120.00',
    'volume': '1000000',
    'avgVolume': '0'
}

cleaned = clean_stock_data(raw)
print(cleaned)
```

### 格式化输出

```python
from FQBase.Util import format_percentage, date_to_str
from datetime import datetime

def format_stock_display(stock):
    """格式化股票信息用于显示"""
    change = percentage_change(stock['close'], stock['prev_close'])

    return {
        'code': stock['code'],
        'date': date_to_str(stock['date'], '%Y-%m-%d'),
        'price': f"¥{stock['close']:.2f}",
        'change': f"{'+' if change >= 0 else ''}{format_percentage(change/100)}"
    }
```

### 报表生成

```python
from FQBase.Util import date_to_str, parse_number, format_percentage

def generate_report(data_list):
    """生成简单报表"""
    report_lines = []
    report_lines.append(f"报表日期: {date_to_str(datetime.now())}")
    report_lines.append("-" * 50)

    for item in data_list:
        name = item['name']
        value = parse_number(item['value'])
        pct = parse_number(item['pct'])

        report_lines.append(
            f"{name:20s} {value:>10.2f} {format_percentage(pct):>10s}"
        )

    return "\n".join(report_lines)
```

---

## 相关文档

- [Util 模块](../README.md)
- [格式转换](../transformer.md)
- [日期工具](../date/README.md)