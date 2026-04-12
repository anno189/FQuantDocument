# TDX Base 开发指南

## 环境准备

### 依赖要求

TDX 适配器依赖以下 Python 包：

```
pytdx >= 1.0.0
FQBase >= 1.0.0
pandas >= 1.3.0
```

### 安装

```bash
pip install pytdx FQBase pandas
```

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `TDX_DEFAULT_TIMEOUT` | 0.7 | 默认超时时间（秒） |

---

## 创建自定义适配器

### 继承 TdxBaseAdapter

```python
from FQData.DataSource.adapters.tdx.base import TdxBaseAdapter, DataSourceConnectionError
import pandas as pd

class MyTdxAdapter(TdxBaseAdapter):
    def __init__(self, timeout: float = None):
        super().__init__("my_tdx", timeout)

    def get_stock_day(
        self,
        code: str,
        start: str,
        end: str,
        frequence: str = "day"
    ) -> pd.DataFrame:
        if not self._connected:
            raise DataSourceConnectionError("未连接")

        # 实现获取逻辑
        data = self._fetch_data(code, start, end, frequence)
        return data

    def get_stock_min(
        self,
        code: str,
        start: str,
        end: str,
        frequence: str = "1min"
    ) -> pd.DataFrame:
        # 实现获取逻辑
        pass
```

### 实现抽象方法

子类必须实现以下抽象方法：

| 方法 | 说明 |
|------|------|
| `get_stock_day` | 获取股票日线 |
| `get_stock_min` | 获取股票分钟线 |
| `get_index_day` | 获取指数日线 |
| `get_index_min` | 获取指数分钟线 |
| `get_future_day` | 获取期货日线 |
| `get_future_min` | 获取期货分钟线 |
| `get_realtime` | 获取实时行情 |
| `get_stock_info` | 获取股票基本信息 |
| `get_stock_realtime` | 获取股票实时行情 |
| `get_index_realtime` | 获取指数实时行情 |
| `get_bond_realtime` | 获取债券实时行情 |
| `get_depth_market_data` | 获取深度市场数据 |

---

## 调试

### 基本调试

```python
from FQData.DataSource.adapters.tdx.base import TdxBaseAdapter

adapter = TdxBaseAdapter()

print(f"连接状态: {adapter.is_connected}")
print(f"超时时间: {adapter._timeout}")

# 健康检查
health = adapter.health_check()
print(f"健康状态: {health}")
```

### IP 选择器调试

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

selector = TdxIPSelector()

# 获取主板市场 IP
ip, port = selector.get_mainmarket_ip()
print(f"主板市场: {ip}:{port}")

# 获取扩展市场 IP
ip, port = selector.get_extensionmarket_ip()
print(f"扩展市场: {ip}:{port}")

# 自动选择最优 IP
best_ip, best_port = selector.select_best_ip()
print(f"最优服务器: {best_ip}:{best_port}")
```

### 超时调试

```python
from FQData.DataSource.adapters.tdx.base import TdxBaseAdapter

# 设置较长超时时间进行调试
TdxBaseAdapter.set_default_timeout(5.0)

adapter = TdxBaseAdapter(timeout=5.0)

try:
    data = adapter.get_stock_day('600000', '2024-01-01', '2024-01-10')
    print(f"获取成功: {len(data)} 条")
except Exception as e:
    print(f"错误: {e}")
```

---

## 测试

### 单元测试

```python
import pytest
from FQData.DataSource.adapters.tdx.base import TdxBaseAdapter

class TestTdxBaseAdapter:
    def test_init(self):
        adapter = TdxBaseAdapter()
        assert adapter._connected is not None
        assert adapter._timeout > 0

    def test_set_default_timeout(self):
        TdxBaseAdapter.set_default_timeout(2.0)
        assert TdxBaseAdapter.get_default_timeout() == 2.0

    def test_health_check(self):
        adapter = TdxBaseAdapter()
        result = adapter.health_check()
        assert isinstance(result, bool)

    def test_disconnect(self):
        adapter = TdxBaseAdapter()
        adapter.disconnect()
        assert adapter.is_connected is False
```

### 运行测试

```bash
pytest tests/tdx/test_base.py -v
```

---

## 异常处理

### 自定义异常

```python
from FQData.DataSource.adapters.tdx.base import (
    DataSourceConnectionError,
    DataNotFoundError,
    DataSourceAPIError,
)

# 连接异常
try:
    adapter = TdxBaseAdapter()
except DataSourceConnectionError as e:
    print(f"连接失败: {e}")

# 数据未找到
try:
    data = adapter.get_stock_day('000000', '2024-01-01', '2024-12-31')
except DataNotFoundError as e:
    print(f"数据未找到: {e}")

# API 异常
try:
    data = adapter.get_stock_day('600000', '2024-01-01', '2024-12-31')
except DataSourceAPIError as e:
    print(f"API 错误: {e}")
```

### 重试机制

```python
from FQBase.Foundation.retry import retry

class MyTdxAdapter(TdxBaseAdapter):
    @retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
    def get_stock_day(self, code, start, end, frequence="day"):
        # 自动重试逻辑
        return super().get_stock_day(code, start, end, frequence)
```

---

## 配置建议

### 开发环境

```python
import os

os.environ['TDX_DEFAULT_TIMEOUT'] = '5.0'

from FQData.DataSource.adapters.tdx.base import TdxBaseAdapter

TdxBaseAdapter.set_default_timeout(5.0)
```

### 生产环境

```python
import os

os.environ['TDX_DEFAULT_TIMEOUT'] = '0.7'

from FQData.DataSource.adapters.tdx.base import TdxBaseAdapter

TdxBaseAdapter.set_default_timeout(0.7)
```

---

## 相关文档

- [TDX README](README.md)
- [TDX Base API](base.md)
- [TDX FAQ](faq.md)
- [适配器索引](../README.md)