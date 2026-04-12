# FQData 开发指南

## 环境准备

### 依赖要求

FQData 依赖以下 Python 包：

```
FQBase >= 1.0.0
pandas >= 1.3.0
numpy >= 1.20.0
pymongo >= 4.0.0
pytdx >= 1.0.0
```

### 安装

```bash
pip install FQBase pandas numpy pymongo pytdx
```

### 环境变量

```bash
export FQDATA_MONGO_HOST=localhost
export FQDATA_MONGO_PORT=27017
export FQDATA_MONGO_DATABASE=fqdata
```

---

## 项目结构

```
FQData/
├── DataSource/          # 数据源抽象层
│   ├── base.py         # 适配器基类
│   ├── registry.py     # 数据源注册表
│   ├── facade.py       # 统一入口
│   ├── health_check.py # 健康检查
│   └── adapters/       # 适配器实现
│       ├── tdx/        # 通达信适配器
│       ├── eastmoney/  # 东方财富适配器
│       └── ...
├── DataStore/          # 存储抽象层
│   ├── base.py         # 存储适配器基类
│   ├── facade.py        # 统一入口
│   ├── mongodb_adapter.py
│   ├── transaction.py   # 事务管理
│   ├── query.py         # 查询函数
│   └── savers/         # 数据持久化
├── DataStruct/         # 数据结构层
│   ├── base.py         # 基类
│   ├── stock.py        # 股票数据
│   ├── index.py        # 指数数据
│   └── ...
└── normalizer.py       # 代码规范化工具
```

---

## 新增数据源适配器

### 1. 创建适配器类

```python
from FQData.DataSource.base import DataSourceAdapter

class MyDataAdapter(DataSourceAdapter):
    def __init__(self):
        super().__init__("my_adapter")

    def connect(self):
        self._connected = True
        return True

    def disconnect(self):
        self._connected = False

    def is_connected(self) -> bool:
        return self._connected

    def get_security_bars(self, code, category, start, end):
        # 实现获取K线数据
        pass

    def get_instrument_bars(self, code, category, start, end):
        # 实现获取期货/期权数据
        pass

    def get_transaction_data(self, code, start, end):
        # 实现获取成交明细
        pass
```

### 2. 注册适配器

```python
from FQData.DataSource import register_source

register_source('my_adapter', MyDataAdapter)
```

### 3. 使用适配器

```python
from FQData import get_datasource

ds = get_datasource()
ds.set_mode('my_adapter')
```

---

## 新增存储适配器

### 1. 实现存储适配器

```python
from FQData.DataStore.base import StorageAdapter

class MyStorageAdapter(StorageAdapter):
    def __init__(self):
        super().__init__("my_storage")

    def connect(self):
        self._connected = True
        return True

    def disconnect(self):
        self._connected = False

    def is_connected(self) -> bool:
        return self._connected

    def insert_one(self, collection, document, filter=None):
        # 实现插入单条
        pass

    def insert_many(self, collection, documents):
        # 实现批量插入
        pass

    def find(self, collection, query, projection=None):
        # 实现查询
        pass
```

### 2. 注册存储

```python
from FQData.DataStore import get_datastore

store = get_datastore()
store._registry.register('my_storage', MyStorageAdapter())
store.set_primary_storage('my_storage')
```

---

## 新增数据结构

### 1. 继承基类

```python
from FQData.DataStruct import QuotationDataStructBase

class MyDataStruct(QuotationDataStructBase):
    def _init_subclass(self):
        self._market_type = 'custom'

    def resample(self, level):
        # 实现重采样
        pass
```

### 2. 注册类型

```python
from FQData.DataStruct import register_datastruct

register_datastruct('my_data', MyDataStruct)
```

---

## 测试

### 单元测试

```python
import pytest
from FQData import get_datasource, save_single_stock_day

def test_get_stock_day():
    ds = get_datasource()
    data = ds.get_stock_day(code='600000', start='2024-01-01', end='2024-01-31')
    assert data is not None
    assert len(data) > 0

def test_save_stock_day():
    data = pd.DataFrame({...})
    result = save_single_stock_day('600000', data)
    assert result is True
```

### 运行测试

```bash
pytest tests/
```

---

## 调试

### 启用日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)

from FQData import get_datasource

ds = get_datasource()
data = ds.get_stock_day(code='600000')
```

### 健康检查

```python
from FQData import get_datasource, get_datastore

ds = get_datasource()
store = get_datastore()

ds_status = ds.health_check()
store_status = store.health_check()

print(f"数据源: {ds_status}")
print(f"存储: {store_status}")
```

---

## 相关文档

- [README](README.md)
- [API 参考](api.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [FAQ](faq.md)
- [DataSource](datasource/README.md)
- [DataStore](datastore/README.md)
- [DataStruct](datastruct/README.md)