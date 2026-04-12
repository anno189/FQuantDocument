# DataSource 开发指南

## 模块简介

DataSource 模块提供统一的数据源接口，支持多数据源动态切换。目前支持通达信(TDX)和东方财富(EastMoney)适配器。

### 核心组件

| 组件 | 说明 |
|------|------|
| `DataSource` | 数据源统一入口 |
| `DataSourceRegistry` | 数据源注册表 |
| `DataSourceAdapter` | 适配器基类 |
| `TdxStockAdapter` | 通达信股票适配器 |
| `TdxIndexAdapter` | 通达信指数适配器 |
| `TdxFutureAdapter` | 通达信期货适配器 |

---

## 开发环境

### 环境要求

- Python 3.8+
- pytdx (通达信数据接口)
- pymongo (MongoDB 存储)
- pytest

### 安装

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQData
pip install -e .
```

### 验证安装

```python
from FQData.DataSource import get_datasource

ds = get_datasource()
print(ds)  # <FQData.DataSource.facade.DataSource object at ...>
```

---

## 本地调试

### 基本调试流程

```python
from FQData.DataSource import get_datasource, DataSourceMode

# 获取数据源
ds = get_datasource()

# 设置模式
ds.set_mode(DataSourceMode.TDX)

# 调试：打印请求参数
data = ds.get_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-01-10'
)
print(f"获取数据: {len(data)} 条")
```

### 调试适配器

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter()

# 测试连接
try:
    data = adapter.get_security_bars(
        code='600000',
        category=9,  # 日线
        start=0,
        count=10
    )
    print(f"连接成功，数据: {data}")
except Exception as e:
    print(f"连接失败: {e}")
```

### 调试多数据源切换

```python
from FQData.DataSource import get_datasource

ds = get_datasource()

# 切换到 TDX
ds.set_mode('tdx')
data_tdx = ds.get_stock_day('600000')
print(f"TDX 数据: {len(data_tdx)} 条")

# 切换到东方财富
ds.set_mode('eastmoney')
data_em = ds.get_stock_day('600000')
print(f"东方财富数据: {len(data_em)} 条")
```

---

## 测试指南

### 运行测试

```bash
cd /Users/A.D.189/FQuant/FQuant.Server/FQData
pytest -v FQData/DataSource/
```

### 测试结构

```python
import pytest
from FQData.DataSource import get_datasource, DataSourceMode

class TestDataSource:
    def test_get_datasource_singleton(self):
        ds1 = get_datasource()
        ds2 = get_datasource()
        assert ds1 is ds2  # 单例模式

    def test_set_mode(self):
        ds = get_datasource()
        ds.set_mode(DataSourceMode.TDX)
        assert ds._current_mode == DataSourceMode.TDX

    def test_get_stock_day(self):
        ds = get_datasource()
        ds.set_mode(DataSourceMode.TDX)
        data = ds.get_stock_day('600000', start='2024-01-01', end='2024-01-10')
        assert data is not None
        assert len(data) > 0

class TestTdxAdapter:
    def test_connection(self):
        adapter = TdxStockAdapter()
        assert adapter.is_connected()

    def test_get_bars(self):
        adapter = TdxStockAdapter()
        data = adapter.get_security_bars('600000', 9, 0, 10)
        assert len(data) <= 10
```

---

## 代码规范

### 适配器命名

```python
# 推荐：明确的适配器命名
class TdxStockAdapter:
    """通达信股票适配器"""
    pass

class EastMoneyFundAdapter:
    """东方财富基金适配器"""
    pass

# 避免：过于通用的命名
class DataAdapter:
    """数据适配器...什么数据？"""
    pass
```

### 方法命名

```python
# 推荐：清晰的动词命名
def get_security_bars(self, code, category, start, count):
    """获取证券K线"""
    pass

def query_stock_day(self, code, start, end):
    """查询股票日线"""
    pass

# 避免：模糊的命名
def get_data(self, params):
    """获取数据"""
    pass
```

---

## 调试技巧

### 查看健康状态

```python
from FQData.DataSource import DataSourceHealthCheck

checker = DataSourceHealthCheck()

# 检查所有适配器
status = checker.check()
print(f"状态: {status.status}")
print(f"消息: {status.message}")
print(f"详情: {status.details}")
```

### 追踪数据源切换

```python
from FQData.DataSource import get_datasource

ds = get_datasource()

# 设置切换回调
def on_mode_change(old_mode, new_mode):
    print(f"模式切换: {old_mode} -> {new_mode}")

ds.set_mode_change_callback(on_mode_change)
```

---

## 常见问题

### Q: 数据获取失败

```python
# 检查网络连接
from FQData.DataSource import DataSourceHealthCheck

checker = DataSourceHealthCheck()
status = checker.check_adapter('tdx')

if not status.is_healthy:
    print(f"TDX 适配器不可用: {status.message}")
```

### Q: 如何添加新的数据源适配器

```python
from FQData.DataSource import DataSourceAdapter, register_source

class MyAdapter(DataSourceAdapter):
    def __init__(self):
        self._connected = False

    def connect(self):
        # 初始化连接
        self._connected = True

    def get_stock_day(self, code, start, end):
        # 实现获取逻辑
        return data

# 注册适配器
register_source('my_adapter', MyAdapter)
```

---

## 相关文档

- [API 参考](api.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [FAQ](faq.md)