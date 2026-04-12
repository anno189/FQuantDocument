# Codec 模块

股票代码格式转换工具，支持多种代码格式的相互转换。

## 函数

### code_to_6digit

将股票代码转换成6位字符串格式。

```python
from FQBase.Util import code_to_6digit

# 支持多种格式
code_to_6digit(600000)           # '600000' (整数)
code_to_6digit('600000')          # '600000' (字符串)
code_to_6digit('600000.XSHG')     # '600000' (聚宽格式)
code_to_6digit('SHSE.600000')      # '600000' (掘金格式)
code_to_6digit('600000.SH')        # '600000' (Wind格式)
code_to_6digit('S.SHSE.600000')    # '600000' (带前缀格式)
```

**支持的格式长度**：

| 长度 | 格式 | 示例 |
|------|------|------|
| 6 | 标准格式 | `600000` |
| 8 | 带后缀 | `600000.XSHG` |
| 9 | 掘金格式 | `SHSE.600000` |
| 11 | 带前缀 | `S.SHSE.600000` |

---

### code_to_jqformat

将沪深股票代码转换成聚宽格式。

```python
from FQBase.Util import code_to_jqformat

code_to_jqformat('600000')    # '600000.XSHG'
code_to_jqformat('000001')    # '000001.XSHG'
code_to_jqformat(600000)       # '600000.XSHG'
```

**注意**：统一转换为 `.XSHG` 后缀（上交所）。

---

### code_adjust_ctp

在 CTP 和通达信代码格式之间转换。

```python
from FQBase.Util import code_adjust_ctp

# 通达信转CTP
code_adjust_ctp('IF2401', source='tdx')   # 'IF2401'
code_adjust_ctp('IC2401', source='tdx')   # 'IC2401'

# CTP转通达信
code_adjust_ctp('IF2401', source='ctp')    # 'IF2401'
```

**支持的期货品种**：RM, CJ, OI, CY, AP, SF, SA, UR, FG, LR, CF, WH, IPS, ZC, SPD, MA, TA, JR, SM, PM, RS, SR, RI 等。

---

### code_to_list

将代码转换为列表。

```python
from FQBase.Util import code_to_list

# 单个代码
code_to_list('600000')          # ['600000']
code_to_list(600000)            # ['600000']

# 代码列表
code_to_list(['600000', '000001'])  # ['600000', '000001']

# 不自动填充
code_to_list('600000', auto_fill=False)  # ['600000']
```

---

## 使用示例

### 批量转换股票代码

```python
from FQBase.Util import code_to_6digit, code_to_jqformat

stock_codes = [
    '600000.XSHG',
    '000001.SZSE',
    '000002.XSHE',
    300001,
]

# 转换为6位格式
six_digit_codes = [code_to_6digit(c) for c in stock_codes]
print(six_digit_codes)  # ['600000', '000001', '000002', '300001']

# 批量转为聚宽格式
jq_codes = [code_to_jqformat(c) for c in six_digit_codes]
print(jq_codes)  # ['600000.XSHG', '000001.XSHG', '000002.XSHG', '300001.XSHG']
```

### 期货代码转换

```python
from FQBase.Util import code_adjust_ctp

# 期货代码列表
future_codes = ['IF2401', 'IC2401', 'IH2401']

# 统一转换为CTP格式
ctp_codes = [code_adjust_ctp(code, source='tdx') for code in future_codes]
```

---

## 相关文档

- [Util 模块](../README.md)
- [日期工具](../date/README.md)
- [数据转换](../converters.md)