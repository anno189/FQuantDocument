# DataSource 模块 - 开发指南

## 概述

本指南帮助开发者理解、扩展和调试 DataSource 模块。

## 开发环境设置

### 环境要求

- Python 3.8+
- pytdx >= 1.80
- pandas >= 1.5.0
- FQBase >= 1.0.0

### 安装依赖

```bash
pip install -e "FQData[datasource]"
```

### 验证安装

```python
from FQData.DataSource import get_datasource

ds = get_datasource()
print(ds.health_check())
```

## 项目结构

```
FQData/
└── DataSource/
    ├── __init__.py           # 模块导出
    ├── base.py              # 基类和协议
    ├── facade.py             # 统一入口
    ├── registry.py           # 注册表
    ├── health_check.py       # 健康检查
    └── adapters/
        ├── tdx/            # 通达信适配器
        ├── akshare/         # AkShare 适配器
        ├── efinance/         # EFinance 适配器
        ├── eastmoney/        # 东方财富适配器
        ├── ths/             # 同花顺适配器
        ├── exchange/         # 交易所适配器
        └── jisilu/          # 集思录适配器
```

## 创建自定义适配器

### 1. 创建适配器类

```python
from FQData.DataSource import DataSourceAdapter

class MyAdapter(DataSourceAdapter):
    def __init__(self):
        super().__init__("my_adapter")
        self._connected = False

    def connect(self) -> bool:
        """建立连接"""
        try:
            # 连接逻辑
            self._connected = True
            return True
        except Exception:
            return False

    def disconnect(self) -> None:
        """断开连接"""
        self._connected = False

    def health_check(self) -> bool:
        """健康检查"""
        return self._connected

    def get_stock_day(self, code, start, end, frequence="day"):
        """获取股票日线"""
        # 实现逻辑
        pass
```

### 2. 注册适配器

```python
from FQData.DataSource import register_source

register_source('my_adapter', MyAdapter)
```

### 3. 使用适配器

```python
from FQData import get_datasource

ds = get_datasource()
ds.set_mode('my_adapter')

data = ds.get_stock_day('600000', '2024-01-01', '2024-12-31')
```

## 测试

### 运行测试

```bash
pytest tests/DataSource/
```

### 编写测试

```python
import pytest
from FQData.DataSource import DataSourceAdapter

class TestMyAdapter:
    def setup_method(self):
        self.adapter = MyAdapter()

    def test_connect(self):
        assert self.adapter.connect() is True

    def test_health_check(self):
        self.adapter.connect()
        assert self.adapter.health_check() is True

    def test_disconnect(self):
        self.adapter.connect()
        self.adapter.disconnect()
        assert self.adapter.is_connected is False
```

## 调试

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)

logger = logging.getLogger('FQData.DataSource')
logger.setLevel(logging.DEBUG)
```

### 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 连接超时 | 网络问题/IP被封 | 更换IP |
| 数据返回为空 | 代码错误/日期范围错误 | 检查参数 |
| 适配器未注册 | 注册时机问题 | 在模块导入时注册 |
| 健康检查失败 | 服务未启动 | 启动数据源服务 |

## 代码规范

### 命名规范

- 类名：`PascalCase`，如 `TdxStockAdapter`
- 方法名：`snake_case`，如 `get_stock_day`
- 常量：`UPPER_SNAKE_CASE`，如 `DEFAULT_TIMEOUT`

### 类型注解

```python
from typing import Optional, List, Union
import pandas as pd

def get_stock_day(
    self,
    code: Union[str, List[str]],
    start: str,
    end: str,
    frequence: str = "day"
) -> Optional[pd.DataFrame]:
    pass
```

### 文档字符串

```python
def get_stock_day(self, code: str, start: str, end: str) -> Optional[pd.DataFrame]:
    """获取股票日线数据。

    Args:
        code: 证券代码
        start: 开始日期 (YYYY-MM-DD)
        end: 结束日期 (YYYY-MM-DD)

    Returns:
        包含日线数据的 DataFrame，失败返回 None

    Raises:
        DataSourceError: 数据源错误

    Example:
        >>> adapter = TdxStockAdapter()
        >>> df = adapter.get_stock_day('600000', '2024-01-01', '2024-01-10')
        >>> print(df.head())
    """
    pass
```

## 贡献指南

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/my-feature`)
3. 提交更改 (`git commit -am 'Add my feature'`)
4. 推送到分支 (`git push origin feature/my-feature`)
5. 创建 Pull Request

## 相关文档

- [API 参考](./api.md)
- [架构文档](./architecture.md)
- [设计文档](./design.md)
- [最佳实践](./best-practices.md)
