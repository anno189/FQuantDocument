---
title: Foundation 模块 - 案例库
description: Foundation 模块业务场景示例
tag:
  - fqbase
  - foundation
---

# Foundation 模块 - 案例库

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → **[案例库](./examples.md)** |

## 子模块案例库

| 子模块 | 案例库 | 说明 |
|--------|--------|------|
| validators | [案例库](./validators/examples.md) | 输入验证 |
| exceptions | [案例库](./exceptions/examples.md) | 统一异常 |
| retry | [案例库](./retry/examples.md) | 重试装饰器 |
| dotty | [案例库](./dotty/examples.md) | 字典访问 |
| singleton | [案例库](./singleton/examples.md) | 单例模式 |
| lifecycle | [案例库](./lifecycle/examples.md) | 生命周期 |
| container | [案例库](./container/examples.md) | 依赖注入 |
| circuit_breaker | [案例库](./circuit_breaker/examples.md) | 熔断器 |

---

## 场景 1: 股票数据校验

**业务需求**：用户输入股票代码，系统需要验证格式是否正确，并查询相关数据。

```python
from FQBase.Foundation import validators

# 验证股票代码
code = "600000"
if validators.validate_code(code):
    print(f"{code} 是有效的股票代码")
else:
    print(f"{code} 是无效的股票代码")

# 验证市场
market = "SH"
if validators.validate_market(market):
    print(f"{market} 是有效市场")
```

---

## 场景 2: 统一错误响应

**业务需求**：API 接口需要统一的错误响应格式，便于前端处理。

```python
from FQBase.Foundation.exceptions import DataSourceException, FQException

try:
    data = fetch_stock_data("600000")
except DataSourceException as e:
    # 返回统一错误格式
    return {
        "success": False,
        "error": {
            "code": e.code,
            "message": e.message,
            "details": e.details
        }
    }
```

---

## 场景 3: 外部 API 调用重试

**业务需求**：调用第三方行情数据接口，网络不稳定时需要自动重试。

```python
from FQBase.Foundation import retry

@retry(max_attempts=3, delay=1)
def fetch_quote(symbol: str):
    response = requests.get(f"http://api.example.com/quote/{symbol}")
    return response.json()

# 自动重试 3 次
quote = fetch_quote("600000")
```

---

## 场景 4: 嵌套配置读取

**业务需求**：读取多层嵌套的配置文件，如数据库配置。

```python
from FQBase.Foundation import dotty

config = {
    "database": {
        "primary": {
            "host": "localhost",
            "port": 5432
        }
    }
}

d = dotty(config)
host = d["database.primary.host"]  # localhost
port = d["database.primary.port"]  # 5432
```

---

## 场景 5: 全局配置管理

**业务需求**：应用全局配置需要全局唯一实例，避免重复初始化。

```python
from FQBase.Foundation import singleton

@singleton
class AppConfig:
    def __init__(self):
        self.settings = {}
        self.load()

    def load(self):
        self.settings = {"debug": True, "version": "1.0"}

# 全局唯一
config1 = AppConfig()
config2 = AppConfig()
assert config1 is config2  # True
```

---

## 场景 6: 服务健康检查

**业务需求**：定时检查各服务健康状态，用于监控告警。

```python
from FQBase.Foundation.lifecycle import HealthCheckable, CompositeHealthCheck

class DatabaseService(HealthCheckable):
    def health_check(self):
        return {"status": "healthy", "connections": 10}

class CacheService(HealthCheckable):
    def health_check(self):
        return {"status": "healthy", "hit_rate": 0.85}

# 组合检查
checker = CompositeHealthCheck()
checker.register('database', DatabaseService())
checker.register('cache', CacheService())

# 批量检查
results = checker.check_all()
for name, status in results.items():
    print(f"{name}: {status['status']}")
```

---

## 场景 7: 微服务依赖注入

**业务需求**：微服务架构中，服务依赖需要灵活管理，支持接口替换。

```python
from FQBase.Foundation import ServiceContainer

# 定义接口
class CacheInterface:
    def get(self, key): pass
    def set(self, key, value): pass

# 开发环境实现
class DevCache(CacheInterface):
    def get(self, key):
        return None  # 开发环境不用缓存
    def set(self, key, value):
        pass

# 生产环境实现
class RedisCache(CacheInterface):
    def get(self, key):
        return redis.get(key)
    def set(self, key, value):
        redis.set(key, value)

# 容器注册
container = ServiceContainer()
container.register_singleton(CacheInterface, RedisCache)  # 生产环境

# 使用
cache = container.get(CacheInterface)
```

---

## 场景 8: 外部服务熔断

**业务需求**：调用外部支付服务，失败时熔断，避免雪崩。

```python
from FQBase.Foundation import CircuitBreaker

breaker = CircuitBreaker(
    name="payment",
    failure_threshold=5,
    success_threshold=2,
    recovery_timeout=60
)

def call_payment(order_id):
    with breaker:
        # 调用外部支付 API
        return payment_api.charge(order_id)

# 连续失败 5 次后熔断
for i in range(10):
    try:
        result = call_payment(f"ORDER-{i}")
        print(f"订单 {i} 支付成功")
    except Exception as e:
        print(f"订单 {i} 支付失败: {e}")
```

---

## 场景 9: 异步任务重试

**业务需求**：后台异步任务处理，需要失败重试确保成功。

```python
from FQBase.Foundation import retry

@retry(max_attempts=3, delay=5)
def process_notification(user_id: int, message: str):
    """发送通知，失败自动重试"""
    send_sms(user_id, message)

# 触发通知
process_notification(123, "您的订单已发货")
```

---

## 场景 10: 限流器

**业务需求**：API 接口限流，防止恶意请求。

```python
from FQBase.Foundation import CircuitBreaker

# 使用熔断器做简单限流
rate_limiter = CircuitBreaker(
    name="api_rate",
    failure_threshold=100,  # 阈值
    recovery_timeout=60
)

def handle_request(user_id):
    with rate_limiter:
        # 处理请求
        return process_request(user_id)
```
