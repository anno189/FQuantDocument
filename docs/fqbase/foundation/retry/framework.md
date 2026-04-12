# Retry 模块框架

## 1. 概述

Retry 模块提供重试机制，用于处理暂时性故障。通过重试策略和延迟，帮助程序在临时故障后自动恢复。

### 1.1 解决的问题

```python
# 无重试 - 一次失败即失败
def fetch_data():
    return api.get()  # 网络抖动时直接失败

# 有重试 - 自动重试暂时恢复
@retry(stop_max_attempt_number=3)
def fetch_data():
    return api.get()  # 网络抖动时会自动重试
```

### 1.2 何时使用重试

- 网络请求可能暂时失败
- 调用外部 API 可能遇到限流
- 数据库连接可能暂时不可用
- 任何可能快速恢复的临时故障

### 1.3 不适合重试的场景

- 业务逻辑错误（如验证失败）
- 认证/授权失败
- 资源耗尽（如磁盘满）
- 确定性失败

## 2. 重试策略

### 2.1 固定/随机延迟

```python
@retry(wait_random_min=100, wait_random_max=500)
def fetch_data():
    return api.get()
```

**等待时间**：`random.randint(100, 500) / 1000.0` 秒

| 尝试 | 等待时间范围 |
|------|--------------|
| 1 | 100-500ms |
| 2 | 100-500ms |
| 3 | 100-500ms |

### 2.2 指数退避

```python
@retry_with_exponential_backoff(base_wait=100, max_wait=5000)
def fetch_data():
    return api.get()
```

**等待时间**：`min(base_wait * 2^(attempt-1), max_wait) / 1000.0` 秒

| 尝试 | 计算 | 等待时间 |
|------|------|----------|
| 1 | min(100 * 2^0, 5000) | 100ms |
| 2 | min(100 * 2^1, 5000) | 200ms |
| 3 | min(100 * 2^2, 5000) | 400ms |
| 4 | min(100 * 2^3, 5000) | 800ms |
| 5 | min(100 * 2^4, 5000) | 1600ms |

## 3. 异常过滤

### 3.1 重试所有异常

```python
@retry()  # 默认重试所有异常
def fetch_data():
    return api.get()
```

### 3.2 仅重试特定异常

```python
@retry(retry_on_exception=(ConnectionError, TimeoutError))
def fetch_data():
    return api.get()
```

**行为**：
- `ConnectionError` → 重试
- `TimeoutError` → 重试
- `ValidationError` → 立即抛出

## 4. 回调机制

### 4.1 on_retry 回调

```python
def log_retry(attempt, exception):
    logger.warning(f"Attempt {attempt} failed: {exception}")

@retry(on_retry=log_retry)
def fetch_data():
    return api.get()
```

### 4.2 使用场景

- 记录重试日志
- 发送监控指标
- 执行清理操作

## 5. 最大总时间

### 5.1 时间限制

```python
@retry_with_exponential_backoff(
    max_attempts=10,
    max_total_time=30.0  # 30秒后不再重试
)
def fetch_data():
    return api.get()
```

### 5.2 行为

- 如果总耗时超过 `max_total_time`，立即停止重试
- 抛出最后一次捕获的异常

## 6. 核心组件

| 组件 | 说明 |
|------|------|
| `retry` | 固定/随机延迟重试装饰器 |
| `retry_with_exponential_backoff` | 指数退避重试装饰器 |
| `async_retry_with_exponential_backoff` | 异步指数退避重试 |
| `RetryContext` | 重试上下文，手动控制 |
| `RetryError` | 重试失败异常 |
| `create_retry_context` | 创建重试上下文工厂函数 |
