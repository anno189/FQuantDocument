---
title: DataStruct - 开发指南
description: DataStruct 数据结构模块开发指南与贡献指南
tag:
  - fqdata
  - datastruct
---

# DataStruct - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[开发指南](./development.md)** |

## 概述

如何开发和贡献 DataStruct 模块。

## 开发环境设置

### 前置要求

- Python 3.8+
- Git
- pip

### 设置

```bash
# 克隆仓库
git clone https://github.com/fquant/fquant.git
cd fquant

# 安装依赖
pip install -e .

# 安装开发依赖
pip install -e ".[dev]"
```

## 项目结构

```
FQData/
├── DataStruct/
│   ├── __init__.py          # 模块导出
│   ├── _base.py             # 核心基类
│   ├── _indicators.py       # 指标计算 Mixin
│   ├── _operations.py       # 数据操作 Mixin
│   ├── _io.py              # 序列化 IO Mixin
│   ├── stock.py             # 股票数据
│   ├── index.py             # 指数数据
│   ├── future.py            # 期货数据
│   ├── bond.py              # 债券数据
│   └── resample.py          # 重采样
```

## 代码规范

### 样式指南

- 遵循 PEP 8
- 使用类型提示
- 编写文档字符串

### 代码示例

```python
from typing import Optional, Dict, Any
import pandas as pd

class QuotationDataStructBase:
    """行情数据结构基类。

    参数:
        data: 行情数据 DataFrame
        if_fq: 复权类型

    示例:
        >>> data = pd.DataFrame(...)
        >>> stock = StockDayData(data)
        >>> print(stock)
    """

    def __init__(
        self,
        data: pd.DataFrame,
        if_fq: str = 'qfq'
    ) -> None:
        self._data = data
        self._if_fq = if_fq
```

## 测试

### 运行测试

```bash
# 运行所有测试
pytest tests/

# 运行特定测试
pytest tests/DataStruct/

# 带覆盖率运行
pytest --cov=FQData.DataStruct tests/
```

### 编写测试

```python
import pytest
import pandas as pd
from FQData.DataStruct import StockDayData

class TestStockDayData:
    def test_select_code(self):
        data = pd.DataFrame(...)
        stock = StockDayData(data)
        result = stock.select_code('000001')
        assert len(result) > 0

    def test_empty_data(self):
        data = pd.DataFrame()
        stock = StockDayData(data)
        assert stock.validate() == False
```

## 调试

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQData.DataStruct")
```

## 贡献

1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 添加测试
5. 提交 Pull Request

## 相关文档

- [API参考](./api.md)
- [技术架构](./architecture.md)
- [最佳实践](./best-practices.md)
