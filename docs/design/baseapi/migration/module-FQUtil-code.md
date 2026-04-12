# module-FQUtil-code.md

# 模块迁移报告: FQUtil-code

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAFetch.base | FQUtil |
| **原文件** | `_bak/server/FQData/FQData/QAFetch/base.py` | `FQBase/FQBase/FQUtil/code.py` |
| **功能** | 市场代码选择、HTTP headers | 代码分类工具 |

## 迁移概览

| 对比项 | 原实现 | 迁移后 |
|--------|--------|--------|
| **headers** | `headers` 变量 | `headers` 常量 |
| **债券市场选择** | `_select_bond_market_code()` | `_select_bond_market_code()` |
| **市场代码选择** | `_select_market_code()` | `_select_market_code()` |
| **指数代码选择** | `_select_index_code()` | `_select_index_code()` |
| **股票市场** | `get_stock_market()` | `get_stock_market()` |
| **频率类型** | `_select_type()` | `_select_type()` |

---

## 函数对比

### headers

```python
# 原实现
headers = {
    'Accept': 'text/html,application/xhtml+xml,...',
    'User-Agent': 'Mozilla/5.0...'
}

# 迁移后 - 完全一致
headers = {
    'Accept': 'text/html,application/xhtml+xml,...',
    'User-Agent': 'Mozilla/5.0...'
}
```

### _select_bond_market_code(code)

```python
# 原实现
def _select_bond_market_code(code):
    if code[0:3] in ['101', '104', ...]:
        return 0
    else:
        return 1

# 迁移后 - 完全一致
def _select_bond_market_code(code: str) -> int:
    if code[0:3] in ['101', '104', ...]:
        return 0
    else:
        return 1
```

### _select_market_code(code)

```python
# 原实现
def _select_market_code(code):
    code = str(code)
    if code[:2] in ['43', '83', '87', '92']:
        return 2
    if code[0] in ['5', '6', '9'] or code[:3] in ["009", "110", ...]:
        return 1
    return 0

# 迁移后 - 完全一致，仅添加类型注解
def _select_market_code(code: str) -> int:
    code = str(code)
    if code[:2] in ['43', '83', '87', '92']:
        return 2
    if code[0] in ['5', '6', '9'] or code[:3] in ["009", "110", ...]:
        return 1
    return 0
```

### _select_index_code(code)

```python
# 原实现
def _select_index_code(code):
    code = str(code)
    if (code[0] == '3') | (code[0:3] in ['123', '127', '128']):
        return 0
    return 1

# 迁移后 - 完全一致
def _select_index_code(code: str) -> int:
    code = str(code)
    if (code[0] == '3') | (code[0:3] in ['123', '127', '128']):
        return 0
    return 1
```

### get_stock_market(code)

```python
# 原实现
def get_stock_market(code):
    market = ['SH', 'SZ', 'BJ']
    return market[_select_market_code(code)]

# 迁移后 - 完全一致
def get_stock_market(code: str) -> str:
    market = ['SH', 'SZ', 'BJ']
    return market[_select_market_code(code)]
```

### _select_type(frequence)

```python
# 原实现
def _select_type(frequence):
    if frequence in ['day', 'd', 'D', 'DAY', 'Day']:
        frequence = 9
    # ... 其他分支

# 迁移后 - 完全一致
def _select_type(frequence: str) -> int:
    if frequence in ['day', 'd', 'D', 'DAY', 'Day']:
        return 9
    # ... 其他分支
```

---

## 方法映射

| 原函数 | 迁移后 | 状态 |
|--------|--------|------|
| `headers` | `headers` | ✅ |
| `_select_bond_market_code(code)` | `_select_bond_market_code(code: str) -> int` | ✅ |
| `_select_market_code(code)` | `_select_market_code(code: str) -> int` | ✅ |
| `_select_index_code(code)` | `_select_index_code(code: str) -> int` | ✅ |
| `get_stock_market(code)` | `get_stock_market(code: str) -> str` | ✅ |
| `_select_type(frequence)` | `_select_type(frequence: str) -> int` | ✅ |

---

## 使用示例

### 原接口

```python
from FQData.QAFetch.base import (
    headers,
    _select_bond_market_code,
    _select_market_code,
    _select_index_code,
    get_stock_market,
    _select_type,
)

market = get_stock_market('000001')  # 'SZ'
market_code = _select_market_code('600000')  # 1
freq = _select_type('day')  # 9
```

### 新接口

```python
from FQUtil.code import (
    headers,
    _select_bond_market_code,
    _select_market_code,
    _select_index_code,
    get_stock_market,
    _select_type,
)

market = get_stock_market('000001')  # 'SZ'
market_code = _select_market_code('600000')  # 1
freq = _select_type('day')  # 9
```

---

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **API 兼容性** | ✅ 函数签名一致 |
| **类型注解** | ✅ 已添加 |
| **测试覆盖** | ✅ 原接口已兼容 |

---

## 相关文件

- [FQUtil.md](./module-FQUtil.md) - FQUtil 主文档
- [codec.md](./module-FQUtil-codec.md) - 编码工具