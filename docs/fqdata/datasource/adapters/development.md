# DataSource Adapters 模块 - 开发指南

## 概述

本指南帮助开发者理解、扩展和调试 DataSource Adapters 模块。

## 开发环境设置

### 环境要求

- Python 3.8+
- pytdx >= 1.80 (TDX 适配器)
- akshare >= 1.10 (AkShare 适配器)
- selenium (集思录适配器)

### 安装依赖

```bash
pip install pytdx akshare selenium
```

## 创建自定义适配器

### 1. 基于 TDX 创建

```python
from FQData.DataSource.adapters.tdx import TdxBaseAdapter

class MyTdxAdapter(TdxBaseAdapter):
    def __init__(self):
        super().__init__("my_tdx")

    def get_custom_data(self, code: str, start: str, end: str):
        connector = self._get_connector()
        # 实现自定义数据获取逻辑
        return data
```

### 2. 基于 AkShare 创建

```python
from FQData.DataSource.adapters.akshare import AkShareAdapter

class MyAkShareAdapter(AkShareAdapter):
    def __init__(self):
        super().__init__()

    def get_custom_data(self):
        url = "https://api.example.com/data"
        return self._request(url, {})
```

### 3. 独立函数适配器

```python
import pandas as pd
import requests

def get_custom_data(code: str, start: str, end: str) -> pd.DataFrame:
    """自定义数据获取函数"""
    url = f"https://api.example.com/{code}"
    params = {'start': start, 'end': end}
    response = requests.get(url, params=params)
    return pd.DataFrame(response.json())
```

## 测试

### TDX 适配器测试

```python
import pytest
from FQData.DataSource.adapters.tdx import TdxStockAdapter

class TestTdxStockAdapter:
    def setup_method(self):
        self.adapter = TdxStockAdapter()

    def test_get_security_bars(self):
        data = self.adapter.get_security_bars('600000', 9, 0, 10)
        assert data is not None
        assert len(data) > 0

    def teardown_method(self):
        self.adapter.disconnect()
```

### 东方财富适配器测试

```python
import pytest
from FQData.DataSource.adapters.eastmoney import get_stock_fund_flow

class TestEastMoneyAdapter:
    def test_get_stock_fund_flow(self):
        data = get_stock_fund_flow('600000')
        assert data is not None
        assert 'code' in data.columns or len(data) >= 0
```

## 调试

### 启用日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger('FQData.DataSource.adapters')
logger.setLevel(logging.DEBUG)
```

### 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 连接超时 | 网络问题/IP被封 | 更换TDX服务器IP |
| 数据为空 | 代码错误 | 检查股票代码格式 |
| 限速触发 | 请求过快 | 降低请求频率 |
| Selenium报错 | ChromeDriver问题 | 检查ChromeDriver安装 |

## 代码规范

### 命名规范

```python
# 类名: PascalCase
class TdxStockAdapter:
class AkShareBondAdapter:

# 方法名: snake_case
def get_security_bars(self):
def get_stock_fund_flow(code: str):

# 常量: UPPER_SNAKE_CASE
MAX_POOL_SIZE = 10
DEFAULT_TIMEOUT = 30
```

### 类型注解

```python
from typing import Optional, List, Dict
import pandas as pd

def get_security_bars(
    self,
    code: str,
    category: int,
    start: int,
    count: int
) -> Optional[pd.DataFrame]:
    """获取证券bars数据。

    Args:
        code: 证券代码
        category: 周期类型
        start: 起始位置
        count: 获取数量

    Returns:
        DataFrame 或 None
    """
    pass
```

## 贡献指南

1. Fork 仓库
2. 创建特性分支
3. 编写代码和测试
4. 提交 Pull Request

## 相关文档

- [API 参考](./api.md)
- [架构文档](./architecture.md)
- [设计文档](./design.md)
- [最佳实践](./best-practices.md)
