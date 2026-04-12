# module-FQUtil-exception.md

# 模块迁移报告: FQUtil-exception

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | FQData.QAUtil.QAError | FQUtil.exception_handler |
| **原文件** | `_bak/server/FQData/FQData/QAUtil/QAError.py` | `FQBase/FQBase/FQUtil/exception_handler.py` |
| **功能** | 错误类定义 | 统一异常处理系统 |

## 迁移对比

### 原实现 (QAError.py)

```python
class QAError_fetch_data(RuntimeError):
    def __init__(self, res):
        RuntimeError.__init__(self, 'QA FETCH DATA ERROR', res)

class QAError_no_data_in_database(RuntimeError):
    def __init__(self, res):
        RuntimeError.__init__(self, 'QA FETCH NO DATA ERROR', res)

class QAError_crawl_data_web(RuntimeError):
    def __init__(self, res):
        RuntimeError.__init__(self, 'QA CRAWLER ERROR', res)

class QAError_database_connection(RuntimeError):
    def __init__(self, res):
        RuntimeError.__init__(self, 'QA DATABASE CONNECTION ERROR', res)

class QAError_web_connection(RuntimeError):
    def __init__(self, res):
        RuntimeError.__init__(self, 'QA WEB CONNECTION ERROR', res)

class QAError_market_enging_down(RuntimeError):
    def __init__(self, res):
        RuntimeError.__init__(self, 'QA MARKET ENGING DOWN ERROR', res)
```

### 迁移后 (exception_handler.py)

```python
class FQException(Exception):
    """FQuant 异常基类"""
    ERROR_CODE_PREFIX = "FQ"

    def __init__(self, message: str, code: Optional[str] = None, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.code = code or self.__class__.__name__
        self.details = details or {}
        super().__init__(self.message)

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            'error_code': self.code,
            'message': self.message,
            'details': self.details,
            'exception_type': self.__class__.__name__
        }

# 数据源异常
class DataSourceException(FQException):
    ERROR_CODE_PREFIX = "FQ-DS"

class DataFetchException(DataSourceException):
    """数据获取异常"""
    pass

class DataParseException(DataSourceException):
    """数据解析异常"""
    pass

class DataSaveException(DataSourceException):
    """数据保存异常"""
    pass

# 策略异常
class StrategyException(FQException):
    ERROR_CODE_PREFIX = "FQ-ST"

class StrategyInitException(StrategyException):
    pass

class StrategyExecuteException(StrategyException):
    pass

# 配置异常
class ConfigException(FQException):
    ERROR_CODE_PREFIX = "FQ-CF"

class ConfigLoadException(ConfigException):
    pass

class ConfigValidationException(ConfigException):
    pass

# 网络异常
class NetworkException(FQException):
    ERROR_CODE_PREFIX = "FQ-NET"

class RedisException(FQException):
    ERROR_CODE_PREFIX = "FQ-REDIS"

class CeleryException(FQException):
    ERROR_CODE_PREFIX = "FQ-CELERY"
```

## 异常映射关系

| 原异常 | 迁移后 | 说明 |
|--------|--------|------|
| `QAError_fetch_data` | `DataFetchException` | 数据获取异常 |
| `QAError_no_data_in_database` | `DataSourceException` | 数据源异常 |
| `QAError_crawl_data_web` | `DataFetchException` | 爬虫/获取异常 |
| `QAError_database_connection` | `RedisException` | 数据库连接异常 |
| `QAError_web_connection` | `NetworkException` | 网络连接异常 |
| `QAError_market_enging_down` | `StrategyException` | 交易引擎异常 |

## 架构改进

### 继承体系对比

**原架构**:
```
RuntimeError (内置)
  └── QAError_fetch_data
  └── QAError_no_data_in_database
  └── ...
```

**新架构**:
```
Exception (内置)
  └── FQException (统一基类)
        ├── DataSourceException
        │     ├── DataFetchException
        │     ├── DataParseException
        │     └── DataSaveException
        ├── StrategyException
        │     ├── StrategyInitException
        │     └── StrategyExecuteException
        ├── ConfigException
        ├── NetworkException
        ├── RedisException
        └── CeleryException
```

## 新增功能

| 功能 | 说明 |
|------|------|
| 错误码系统 | `ERROR_CODE_PREFIX` + 类名 |
| 错误详情 | `details` 字典保存附加信息 |
| `to_dict()` | 异常转字典便于序列化 |
| `handle_exception` | 异常处理装饰器 |
| `safe_execute` | 安全执行装饰器 (异常返回默认值) |

## 使用示例

### 抛出异常
```python
from FQUtil.exception_handler import DataFetchException, FQException

# 新接口
raise DataFetchException("Failed to fetch data", code="FQ-DS-001")

# 带详情
raise DataFetchException(
    "Failed to fetch 000001",
    code="FQ-DS-001",
    details={'symbol': '000001', 'date': '2026-03-28'}
)

# 获取异常信息
try:
    ...
except FQException as e:
    print(e.code)      # FQ-DS-001
    print(e.message)    # Failed to fetch data
    print(e.to_dict())  # 完整字典
```

### 兼容旧接口
```python
# 兼容模式 - 可在 FQUtil/__init__.py 添加
QAError_fetch_data = DataFetchException
QAError_no_data_in_database = DataSourceException
QAError_crawl_data_web = DataFetchException
QAError_database_connection = RedisException
QAError_web_connection = NetworkException
QAError_market_enging_down = StrategyException
```

### 使用装饰器
```python
from FQUtil.exception_handler import handle_exception, safe_execute

@handle_exception
def fetch_data():
    ...

@safe_execute(default_return=[])
def get_data_list():
    return risky_operation()
```

## 相关文件

- [exception_handler.py](../../FQBase/FQBase/FQUtil/exception_handler.py) - 本模块
- [logger.md](module-FQUtil-logger.md) - 日志模块
- [tools.md](module-FQUtil-tools.md) - 工具模块

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **向后兼容** | ⏳ 需添加兼容别名 |
| **API文档** | ✅ Docstring完整 |
| **架构改进** | ✅ 统一继承体系 |
| **新增功能** | ✅ 错误码、详情、装饰器 |
