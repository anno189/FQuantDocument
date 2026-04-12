# Foundation 模块框架

## 1. 概述

Foundation 模块是 FQBase 框架中的通用抽象层，提供基础设计模式、工具和接口，**不包含任何业务逻辑**。

### 1.1 模块定位

```
┌─────────────────────────────────────────────────────────────┐
│                         FQBase                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐               │
│  │    Foundation   │    │      Core       │               │
│  ├─────────────────┤    ├─────────────────┤               │
│  │ 通用抽象层       │    │ 核心服务层       │               │
│  │ • 设计模式       │    │ • Logger        │               │
│  │ • 工具函数       │    │ • EventBus      │               │
│  │ • 验证器         │    │ • Notification  │               │
│  │ • 异常体系       │    │ • Config        │               │
│  └────────┬────────┘    └────────┬────────┘               │
│           │                       │                        │
│           │    Foundation 不依赖 Core                        │
│           └───────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 设计原则

1. **不依赖 Core 层**：Foundation 模块独立存在，不依赖 Logger、EventBus 等核心服务
2. **通用可复用**：所有组件都是通用抽象，不包含业务逻辑
3. **线程安全**：所有组件支持多线程环境
4. **可测试**：设计考虑单元测试和集成测试需求

### 1.3 何时使用 Foundation

- 实现新的核心服务时，使用 Foundation 提供的设计模式
- 构建数据层时，使用 validators 验证输入
- 网络请求使用 retry 和 circuit_breaker 处理故障
- 使用依赖注入容器管理服务依赖

## 2. 子模块

### 2.1 设计模式模块

| 模块 | 类/函数 | 用途 |
|------|---------|------|
| singleton.py | `singleton`, `SingletonMeta` | 单例模式，线程安全 |
| container.py | `ServiceContainer`, `ServiceLocator` | 依赖注入容器 |
| lifecycle.py | `HealthCheckable`, `Initializable`, `Shutdownable` | 生命周期协议 |

### 2.2 容错模块

| 模块 | 类/函数 | 用途 |
|------|---------|------|
| retry.py | `retry`, `retry_with_exponential_backoff` | 重试装饰器 |
| circuit_breaker.py | `CircuitBreaker`, `circuit_breaker` | 熔断器模式 |

### 2.3 工具模块

| 模块 | 类/函数 | 用途 |
|------|---------|------|
| validators.py | `validate_code`, `validate_date`, `Validator` | 输入验证 |
| exceptions.py | `FQException`, `DataSourceException` | 统一异常体系 |
| dotty.py | `dotty`, `Dotty` | 嵌套字典访问 |
| crypto.py | `random_string`, `random_stock_code` | 随机数生成 |

## 3. 核心抽象

### 3.1 单例模式 (Singleton)

```python
@singleton
class MyService:
    pass
```

特性：
- 线程安全的实例创建
- 支持重置（用于测试隔离）
- 支持获取当前实例

### 3.2 依赖注入 (DI Container)

```python
container = ServiceContainer()
container.register_singleton(ICache, RedisCache)
container.register_transient(ILogger, FileLogger)
cache = container.get(ICache)
```

特性：
- 三种生命周期：Singleton、Transient、Scoped
- 循环依赖检测
- 服务定位器支持

### 3.3 熔断器 (Circuit Breaker)

```
CLOSED ──(失败阈值)──► OPEN
  ▲                       │
  │                    (超时)
  │                       │
  └──(成功阈值)──────── HALF_OPEN ──(失败)──► OPEN
```

特性：
- 三种状态：CLOSED、OPEN、HALF_OPEN
- 失败/成功阈值可配置
- 详细指标记录

### 3.4 重试策略 (Retry)

| 策略 | 等待时间 | 适用场景 |
|------|----------|----------|
| 固定延迟 | 随机 [min, max] | 快速恢复的临时故障 |
| 指数退避 | base * 2^(attempt-1) | 网络抖动、限流 |

## 4. 异常体系

### 4.1 异常层次

```
FQException (基类)
├── DataSourceException
│   ├── DataFetchException
│   ├── DataParseException
│   ├── DataSaveException
│   └── DataSourceAPIError
├── StrategyException
│   ├── StrategyInitException
│   └── StrategyExecuteException
├── ConfigException
│   ├── ConfigLoadException
│   └── ConfigValidationException
├── NetworkException
├── RedisException
├── MongoDBException
│   ├── MongoDBConnectionException
│   └── MongoDBOperationException
└── CeleryException
```

### 4.2 异常编码

| 前缀 | 模块 |
|------|------|
| FQ | 通用 |
| FQ-DS | 数据源 |
| FQ-ST | 策略 |
| FQ-CF | 配置 |
| FQ-NET | 网络 |
| FQ-REDIS | Redis |
| FQ-MONGO | MongoDB |
| FQ-CELERY | Celery |
| FQ-CB | 熔断器 |

## 5. 验证器

### 5.1 验证函数

| 函数 | 验证内容 | 示例 |
|------|----------|------|
| `validate_code` | 6位数字股票代码 | "600000" |
| `validate_date` | 日期格式 | "2026-04-03" |
| `validate_market` | 市场代码 | "SH", "SZ", "HK" |
| `validate_frequency` | K线周期 | "1m", "5m", "1d" |
| `validate_dict` | 必需键 | {"code": "600000"} |
| `validate_positive_number` | 正数 | 100.5 |
| `validate_percentage` | 百分比 | 0-100 |

### 5.2 Validator 类

```python
validator = Validator()
validator.validate(value, {
    'required': True,
    'type': str,
    'min': 0,
    'max': 100,
    'pattern': r'^\d{6}$',
    'choices': ['SH', 'SZ']
})
```

## 6. 嵌套字典访问 (Dotty)

### 6.1 点号访问

```python
from FQBase.Foundation import dotty

data = {'user': {'profile': {'name': '张三'}}}
d = dotty(data)

name = d['user.profile.name']  # '张三'
d['user.profile.age'] = 31
```

### 6.2 支持特性

- 链式点号访问
- 列表索引访问
- 切片操作
- 自动类型转换
- 直接修改原字典

## 7. 迁移说明

从原始 FQData 迁移到 FQBase.Foundation：

1. 导入路径变更：`FQData.QAUtil.QADate` → `FQBase.Date`
2. 验证器迁移：`FQData.QAUtil.validate_code` → `FQBase.Foundation.validate_code`
3. 异常迁移：`FQData.QAEexception` → `FQBase.Foundation.FQException`
