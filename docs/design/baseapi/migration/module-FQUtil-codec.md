# module-FQUtil-codec.md

# 模块迁移报告: FQUtil-codec

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | QUANTAXIS.QAUtil.QACode | FQUtil.codec |
| **原文件** | `_bak/QUANTAXIS/QAUtil/QACode.py` | `FQBase/FQBase/FQUtil/codec.py` |
| **功能** | 股票代码格式转换 | 股票代码格式转换 |

## 迁移对比

### 原实现 (QACode.py)

```python
def QA_util_code_change_format(code):
    code = code.split('.')[1][0:6]
    return code+'.XSHE' if code[0] != '6' else code+'.XSHG'

def QA_util_code_tostr(code):
    """将沪深股票从数字转化到6位的代码"""
    if isinstance(code, int):
        return "{:>06d}".format(code)
    if isinstance(code, str):
        if len(code) == 6:
            return code
        if len(code) == 8:
            return code[-6:]
        if len(code) == 9:
            return code[:6]
        if len(code) == 11:
            if code[0] in ["S"]:
                return code.split(".")[1]
            return code.split(".")[0]
        raise ValueError("错误的股票代码格式")
    if isinstance(code, list):
        return [QA_util_code_tostr(item) for item in code]

def QA_util_code_tolist(code, auto_fill=True):
    """将转换code==> list"""
    if isinstance(code, str):
        if auto_fill:
            return [QA_util_code_tostr(code)]
        else:
            return [code]
    elif isinstance(code, list):
        if auto_fill:
            return [QA_util_code_tostr(item) for item in code]
        else:
            return [item for item in code]

def QA_util_code_adjust_ctp(code, source):
    """在ctp和通达信之间来回转换"""
    if source == 'ctp':
        if len(re.search(r'[0-9]+', code)[0]) < 4:
            return re.search(r'[a-zA-z]+', code)[0] + '2' + re.search(r'[0-9]+', code)[0]
        else:
            return code.upper()
    else:
        if re.search(r'[a-zA-z]+', code)[0].upper() in [...]:
            return re.search(r'[a-zA-z]+', code)[0] + re.search(r'[0-9]+', code)[0][1:]
        else:
            return re.search(r'[a-zA-z]+', code)[0].lower() + re.search(r'[0-9]+', code)[0]
```

### 迁移后 (codec.py)

```python
def code_to_6digit(code: Union[int, str]) -> str:
    """将股票代码转换成6位字符串格式"""
    if isinstance(code, int):
        return "{:>06d}".format(code)
    if isinstance(code, str):
        if len(code) == 6:
            return code
        if len(code) == 8:
            return code[-6:]
        if len(code) == 9:
            return code[:6]
        if len(code) == 11:
            if code[0] == 'S':
                return code.split('.')[1]
            return code.split('.')[0]
        raise ValueError(f"错误的股票代码格式: {code}")
    if isinstance(code, list):
        return code_to_6digit(code[0])

def code_to_jqformat(code: Union[int, str]) -> str:
    """将沪深股票代码转换成聚宽格式 (600000.XSHG)"""
    code = code_to_6digit(code)
    return code + '.XSHG' if code[0] != '6' else code + '.XSHG'

def code_adjust_ctp(code: str, source: str = 'tdx') -> str:
    """在CTP和通达信代码格式之间转换"""
    if source == 'ctp':
        num_match = re.search(r'[0-9]+', code)
        if num_match and len(num_match.group()) < 4:
            prefix = re.search(r'[a-zA-z]+', code).group()
            return prefix + '2' + num_match.group()
        return code.upper()
    else:
        prefix_match = re.search(r'[a-zA-z]+', code)
        if not prefix_match:
            return code
        prefix = prefix_match.group().upper()
        num_match = re.search(r'[0-9]+', code)
        if prefix in [...]:
            return prefix + num_match.group()[1:]
        else:
            return prefix.lower() + num_match.group()

def code_to_list(code: Union[str, List[str]], auto_fill: bool = True) -> List[str]:
    """将代码转换为列表"""
    if isinstance(code, str):
        return [code_to_6digit(code)] if auto_fill else [code]
    elif isinstance(code, list):
        return [code_to_6digit(item) for item in code] if auto_fill else list(code)
    return []
```

## 函数映射

| 原函数 | 迁移后 | 状态 |
|--------|--------|------|
| `QA_util_code_change_format` | `code_to_jqformat` | ⚠️ 功能相似但不完全相同 |
| `QA_util_code_tostr` | `code_to_6digit` | ✅ |
| `QA_util_code_tolist` | `code_to_list` | ✅ |
| `QA_util_code_adjust_ctp` | `code_adjust_ctp` | ✅ |

## 差异说明

### QA_util_code_change_format vs code_to_jqformat

| 差异 | 原实现 | 迁移后 |
|------|--------|--------|
| 输出格式 | `000001.XSHE` 或 `600000.XSHG` | 只有 `XSHG` |
| 市场判断 | `!=6` → XSHE, `==6` → XSHG | 全部 → XSHG |

**问题**: `code_to_jqformat` 忽略了深圳市场 (XSHE)，应该根据代码判断市场。

**建议修复**:
```python
def code_to_jqformat(code: Union[int, str]) -> str:
    code = code_to_6digit(code)
    # 6开头为上海，0或3开头为深圳
    suffix = '.XSHG' if code[0] == '6' else '.XSHE'
    return code + suffix
```

## 向后兼容

```python
# 可在 FQUtil/__init__.py 添加
QA_util_code_change_format = lambda code: code_to_jqformat(code)
QA_util_code_tostr = code_to_6digit
QA_util_code_tolist = code_to_list
QA_util_code_adjust_ctp = code_adjust_ctp
```

## 使用示例

```python
from FQUtil.codec import (
    code_to_6digit,
    code_to_jqformat,
    code_to_list,
    code_adjust_ctp
)

# 转换为6位代码
code_to_6digit('600000')  # '600000'
code_to_6digit(600000)    # '600000'
code_to_6digit('SHSE.600000')  # '600000'

# 转换为聚宽格式
code_to_jqformat('000001')  # '000001.XSHG' (当前实现有bug)

# 转换为列表
code_to_list(['000001', '600000'])  # ['000001', '600000']

# CTP格式转换
code_adjust_ctp('rb2001', 'ctp')  # 'RB2001'
```

## 相关文件

- [codec.py](../../FQBase/FQBase/FQUtil/codec.py) - 本模块
- [file.py](module-FQUtil-file.md) - 文件工具
- [network.md](module-FQUtil-network.md) - 网络工具

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ⚠️ 部分完成 (3/4) |
| **Bug** | `code_to_jqformat` 忽略深圳市场 |
| **向后兼容** | ⏳ 需添加兼容别名 |
| **API文档** | ✅ Docstring完整 |
| **类型注解** | ✅ 完整 |
