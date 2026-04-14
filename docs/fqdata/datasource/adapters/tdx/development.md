# TDX 适配器开发指南

## 概述

本文档为希望在 TDX 适配器基础上进行二次开发的开发者提供指导，包括开发环境设置、代码规范、扩展方法和测试策略。

---

## 开发环境设置

### 环境要求

- Python 3.8+
- pip

### 安装依赖

```bash
pip install pytdx>=1.88
pip install pandas
pip install FQBase
```

### 开发环境安装

```bash
cd /Users/A.D.189/FQuant/FQuant.Server

pip install -e ./FQData
pip install -e ./FQBase

pip install pytest
pip install pytest-cov
pip install black
pip install flake8
pip install mypy
```

---

## 项目结构

```
FQData/
└── DataSource/
    └── adapters/
        └── tdx/
            ├── __init__.py           # 模块导出
            ├── base.py               # TdxBaseAdapter 基类
            ├── stock.py              # TdxStockAdapter
            ├── index.py             # TdxIndexAdapter
            ├── future.py             # TdxFutureAdapter
            ├── bond.py               # TdxBondAdapter
            ├── hkstock.py            # TdxHKStockAdapter
            ├── option.py             # TdxOptionAdapter
            ├── realtime.py            # TdxRealtimeAdapter
            ├── transaction.py          # TdxTransactionAdapter
            ├── macro.py              # TdxMacroAdapter
            ├── exchange.py            # TdxExchangeAdapter
            ├── extension.py          # TdxExtensionAdapter
            ├── tools.py              # 工具函数
            ├── ip_selector.py        # IP 选择器
            ├── connection_pool.py     # 连接池
            ├── block.py              # 板块数据
            └── financial.py          # 财务数据
```

---

## 代码规范

### PEP 8 风格

```python
# 缩进：4 空格
def get_stock_day(
    self,
    code: str,
    start: str,
    end: str,
    frequence: str = "day"
) -> Optional[pd.DataFrame]:
    pass

# 行长度：不超过 120 字符
# 导入排序：标准库 > 第三方库 > 本地模块
```

### 类型注解

```python
from typing import Union, List, Optional, Dict, Tuple

def get_stock_day(
    self,
    code: Union[str, List[str]],
    start: str,
    end: str,
    frequence: str = "day"
) -> Optional[pd.DataFrame]:
    ...
```

### 文档字符串

```python
def get_stock_day(
    self,
    code: Union[str, List[str]],
    start: str,
    end: str,
    frequence: str = "day"
) -> Optional[pd.DataFrame]:
    """获取股票日线/周期线数据

    通达信接口获取股票周期K线数据，支持日线、周线、月线、季线、年线

    Args:
        code: 股票代码，支持6位代码字符串或单元素列表
        start: 开始日期，格式 YYYY-MM-DD
        end: 结束日期，格式 YYYY-MM-DD
        frequence: K线频率，可选值:
            - day: 日线 (默认)
            - week: 周线
            - month: 月线
            - quarter: 季线
            - year: 年线

    Returns:
        pd.DataFrame: K线数据，包含 date, open, high, low, close, volume, amount 等列，
            返回 None 表示无数据

    Raises:
        DataSourceConnectionError: 数据源未连接时抛出
        DataNotFoundError: 股票代码为空或格式错误时抛出

    Examples:
        >>> adapter = TdxStockAdapter()
        >>> df = adapter.get_stock_day('000001', '2020-01-01', '2020-12-31')
        >>> print(df.head())
    """
```

---

## 扩展开发

### 新增数据适配器

#### 1. 定义适配器类

```python
from .base import TdxBaseAdapter
from FQData.DataSource.base import DataSourceConnectionError

class TdxNewDataAdapter(TdxBaseAdapter):
    """新型数据适配器"""

    def __init__(self, timeout: float = None):
        super().__init__(name="tdx_new", timeout=timeout)

    def get_new_data(self, code: str, start: str, end: str) -> Optional[pd.DataFrame]:
        """获取新型数据

        Args:
            code: 数据代码
            start: 开始日期
            end: 结束日期

        Returns:
            DataFrame 或 None
        """
        if not self._connected:
            raise DataSourceConnectionError(
                "Tdx数据源未连接",
                code="TDX_NOT_CONNECTED"
            )

        with self._hq_connection() as api:
            data = api.to_df(api.new_api(code, start, end))
            return data
```

#### 2. 导出新适配器

```python
# __init__.py
from .new_adapter import TdxNewDataAdapter

__all__ = [
    'TdxBaseAdapter',
    'TdxStockAdapter',
    'TdxNewDataAdapter',  # 新增
]
```

### 新增工具函数

```python
# tools.py

def get_custom_freq_params(frequence: str) -> tuple:
    """获取自定义频率参数

    Args:
        frequence: 频率

    Returns:
        tuple: (category, type_, lens_multiplier)
    """
    # 实现逻辑
    pass
```

### 扩展连接池

```python
# connection_pool.py

class TdxConnectionPool:
    def __init__(self):
        super().__init__()
        self._custom_pool: Queue = Queue(maxsize=5)

    def get_custom_connection(self, ip: str, port: int, timeout: float = 10):
        """获取自定义连接"""
        # 实现逻辑
        pass
```

---

## 测试开发

### 单元测试

```python
# tests/test_tdx_stock.py

import pytest
from unittest.mock import patch, MagicMock
import pandas as pd

from FQData.DataSource.adapters.tdx import TdxStockAdapter

class TestTdxStockAdapter:
    @pytest.fixture
    def adapter(self):
        with patch('FQData.DataSource.adapters.tdx.ip_selector.TdxIPSelector.select_best_ip'):
            return TdxStockAdapter()

    def test_get_stock_list(self, adapter):
        mock_data = pd.DataFrame({
            'code': ['600000', '600036'],
            'name': ['浦东银行', '招商银行'],
            'sse': ['sh', 'sh']
        })

        with patch.object(adapter, '_hq_connection') as mock_conn:
            mock_api = MagicMock()
            mock_api.get_security_list.return_value = mock_data
            mock_conn.return_value.__enter__.return_value = mock_api

            result = adapter.get_stock_list('stock')

            assert result is not None
            assert len(result) == 2

    def test_get_stock_day_empty_code(self, adapter):
        with pytest.raises(Exception):
            adapter.get_stock_day('', '2024-01-01', '2024-12-31')
```

### Mock IP 选择器

```python
from unittest.mock import patch

@patch('FQData.DataSource.adapters.tdx.ip_selector.TdxIPSelector.select_best_ip')
@patch('FQData.DataSource.adapters.tdx.ip_selector.TdxIPSelector.get_best_ip')
def test_with_mock_ip(mock_get_best, mock_select):
    mock_select.return_value = {
        'stock': {'ip': '127.0.0.1', 'port': 7709},
        'future': {'ip': '127.0.0.1', 'port': 7709}
    }
    mock_get_best.return_value = {'ip': '127.0.0.1', 'port': 7709}

    adapter = TdxStockAdapter()
    # 测试逻辑
```

### 集成测试

```python
# tests/integration/test_tdx_integration.py

import pytest

@pytest.mark.integration
def test_real_data_fetch():
    adapter = TdxStockAdapter()

    try:
        data = adapter.get_stock_day('600000', '2024-01-01', '2024-01-10')
        assert data is not None
        assert len(data) > 0
    except Exception as e:
        pytest.skip(f"Network not available: {e}")
```

### 运行测试

```bash
# 运行所有测试
pytest tests/

# 运行单元测试
pytest tests/unit/

# 运行集成测试
pytest tests/integration/

# 带覆盖率
pytest --cov=FQData.DataSource.adapters.tdx tests/
```

---

## 调试技巧

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQData.DataSource.adapters.tdx")
logger.setLevel(logging.DEBUG)
```

### 调试连接问题

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

# 重置 IP 缓存
TdxIPSelector.reset()

# 手动选择最优 IP
best_ip = TdxIPSelector.select_best_ip()
print(f"最优 IP: {best_ip}")

# 测试特定 IP
delay = TdxIPSelector.ping('106.14.201.200', 7709, 'stock')
print(f"响应时间: {delay.total_seconds():.3f}s")
```

### 调试连接池

```python
from FQData.DataSource.adapters.tdx.connection_pool import get_tdx_pool

pool = get_tdx_pool()

print(f"HQ 连接数: {pool.hq_count}")
print(f"EX 连接数: {pool.ex_count}")

# 关闭所有连接
pool.close_all()
```

### 使用 PyTdx 直接调试

```python
from pytdx.hq import TdxHq_API

api = TdxHq_API()
with api.connect('106.14.201.200', 7709, time_out=1):
    data = api.get_security_bars(9, 1, '600000', 0, 10)
    print(data)
```

---

## 代码审查清单

### 提交前检查

- [ ] 所有新增方法有文档字符串
- [ ] 类型注解完整
- [ ] 异常处理正确
- [ ] `@retry` 装饰器添加
- [ ] 单元测试通过
- [ ] 代码格式化 (`black`)
- [ ] 无 lint 错误 (`flake8`)

### 代码审查要点

| 检查项 | 说明 |
|--------|------|
| 异常类型 | 是否使用了正确的异常类 |
| 返回值 | 是否返回 `None` 或 DataFrame |
| 参数验证 | 是否验证输入参数 |
| 日志记录 | 是否记录重要操作 |
| 超时处理 | 是否考虑超时情况 |
| 重试机制 | 是否添加 `@retry` |

---

## 性能考虑

### 连接复用

```python
# 推荐：复用适配器实例
adapter = TdxStockAdapter()
for code in codes:
    data = adapter.get_stock_day(code, '2024-01-01', '2024-12-31')

# 不推荐：每次创建新实例
for code in codes:
    adapter = TdxStockAdapter()  # 创建新实例，连接无法复用
    data = adapter.get_stock_day(code, '2024-01-01', '2024-12-31')
```

### 批量请求

```python
from concurrent.futures import ThreadPoolExecutor

adapter = TdxStockAdapter()

with ThreadPoolExecutor(max_workers=5) as executor:
    futures = [
        executor.submit(adapter.get_stock_day, code, '2024-01-01', '2024-12-31')
        for code in codes
    ]
    results = [f.result() for f in futures]
```

---

## 贡献指南

### 提交 Pull Request

1. Fork 仓库
2. 创建功能分支 `git checkout -b feature/new-data-adapter`
3. 编写代码和测试
4. 确保所有测试通过
5. 提交代码 `git commit -m "Add new data adapter"`
6. Push 到分支 `git push origin feature/new-data-adapter`
7. 创建 Pull Request

### Issue 报告

报告问题时，请包含：

- Python 版本
- FQData 版本
- 完整的错误堆栈
- 复现步骤
- 预期行为 vs 实际行为

---

## 相关文档

- [TDX README](README.md)
- [TDX 框架文档](framework.md)
- [TDX 架构说明](architecture.md)
- [TDX 设计文档](design.md)
- [TDX API 参考](api.md)
- [TDX 使用指南](usage.md)
- [TDX 最佳实践](best-practices.md)
- [TDX FAQ](faq.md)
- [TDX 更新日志](changelog.md)
- [TDX 配置说明](config.md)
- [TDX 连接池与健康检查](connection_pool.md)
- [TDX Base API](base.md)
- [TDX Base 开发指南](base_development.md)
- [TDX Base FAQ](base_faq.md)
- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](./README.md)
