---
title: 通知服务 - 性能调优
description: 通知服务性能优化指南
tag:
  - fqbase
  - core
  - notification
---

# 通知服务 - 性能调优

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → [安全指南](./security.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) → **[性能调优](./performance.md)** |


## 概述

本章节提供通知服务模块的性能优化指南，帮助开发者提升通知发送效率。

## 性能指标

### 关键指标

| 指标 | 描述 | 目标 |
|------|------|------|
| 延迟 | 同步发送响应时间 | < 1s |
| 吞吐量 | 每秒发送数 | > 10 RPS |
| CPU 使用率 | CPU 利用率 | < 30% |
| 错误率 | 发送失败百分比 | < 1% |

### 测量性能

```python
import time
from FQBase.Core.notification import sendWechat

# 测量单次发送延迟
start = time.time()
result = sendWechat('性能测试消息')
latency = (time.time() - start) * 1000

print(f"发送延迟: {latency:.2f}ms")
print(f"发送结果: {result}")

# 测量批量发送吞吐量
start = time.time()
count = 0
for i in range(100):
    if sendWechat(f'消息 {i}'):
        count += 1
elapsed = time.time() - start

print(f"吞吐量: {count / elapsed:.2f} RPS")
```

## 优化策略

### 1. 使用异步发送

**优化前（同步）：**

```python
# 慢 - 每次等待网络响应
for i in range(100):
    sendWechat(f'消息 {i}')
```

**优化后（异步）：**

```python
# 快 - 并发发送
from FQBase.Core.notification import NotificationManager

manager = NotificationManager()
futures = []
for i in range(100):
    future = manager.send_async(f'消息 {i}', channel='DEFAULT')
    futures.append(future)

# 等待所有完成
for future in futures:
    result = future.result()
```

### 2. 消息批量合并

**优化前（单独发送）：**

```python
# 慢 - N 次网络调用
alerts = get_alerts()  # 假设有 100 条告警
for alert in alerts:
    sendWechat(f"告警: {alert}")
```

**优化后（合并发送）：**

```python
# 快 - 1 次网络调用
alerts = get_alerts()
if alerts:
    combined_message = "📢 告警汇总\n\n" + "\n".join(f"- {a}" for a in alerts)
    sendWechat(combined_message)
```

### 3. 线程池调优

```python
from concurrent.futures import ThreadPoolExecutor
from FQBase.Core import notification

# 创建更大的线程池
large_executor = ThreadPoolExecutor(max_workers=20)

# 替换默认 executor（在模块导入后）
notification._executor = large_executor
```

### 4. 连接复用

代码已通过单例模式和 handler 缓存实现连接复用。

### 5. 超时配置

```python
# 适当增加超时时间，避免慢速网络导致失败
# 修改 DEFAULT_TIMEOUT（在模块中）
notification.DEFAULT_TIMEOUT = 10
```

## 资源限制

### 配置限制

```python
# 在初始化时配置
class NotificationConfig:
    MAX_WORKERS = 10          # 线程池大小
    DEFAULT_TIMEOUT = 10     # 默认超时（秒）
    MAX_BATCH_SIZE = 50       # 最大批量大小
    RATE_LIMIT_PER_MINUTE = 60  # 每分钟限制
```

### 监控资源使用

```python
import psutil
from FQBase.Core.notification import NotificationManager

def monitor_notification_performance():
    """监控通知服务性能"""
    import threading
    
    stats = {
        'sent': 0,
        'failed': 0,
        'total_latency': 0
    }
    
    def track_performance():
        manager = NotificationManager()
        original_send = manager.send
        
        def tracked_send(content, channel='DEFAULT'):
            start = time.time()
            result = original_send(content, channel)
            latency = time.time() - start
            
            with threading.Lock():
                stats['total_latency'] += latency
                if result:
                    stats['sent'] += 1
                else:
                    stats['failed'] += 1
            
            return result
        
        manager.send = tracked_send
    
    return stats
```

## 性能最佳实践

1. **优先使用异步发送**：高并发场景使用 `send_async()`
2. **批量合并消息**：减少网络调用次数
3. **合理配置超时**：根据网络环境调整
4. **监控发送成功率**：及时发现异常
5. **限制发送频率**：避免触发限流

## 基准测试

### 运行基准测试

```python
import time
from FQBase.Core.notification import NotificationManager

def benchmark_sync():
    """同步发送基准测试"""
    manager = NotificationManager()
    
    iterations = 100
    start = time.time()
    
    for i in range(iterations):
        manager.send(f'测试消息 {i}', channel='DEFAULT')
    
    elapsed = time.time() - start
    return {
        'method': 'sync',
        'iterations': iterations,
        'total_time': elapsed,
        'avg_time': elapsed / iterations,
        'rps': iterations / elapsed
    }

def benchmark_async():
    """异步发送基准测试"""
    manager = NotificationManager()
    
    iterations = 100
    start = time.time()
    
    futures = []
    for i in range(iterations):
        future = manager.send_async(f'测试消息 {i}', channel='DEFAULT')
        futures.append(future)
    
    for future in futures:
        future.result()
    
    elapsed = time.time() - start
    return {
        'method': 'async',
        'iterations': iterations,
        'total_time': elapsed,
        'avg_time': elapsed / iterations,
        'rps': iterations / elapsed
    }

# 运行基准测试
print("同步发送:", benchmark_sync())
print("异步发送:", benchmark_async())
```

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [技术架构](./architecture.md)
