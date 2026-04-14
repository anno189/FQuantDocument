---
title: Circuit Breaker 模块 - 集成指南
description: Circuit Breaker 熔断器模块第三方集成指南
tag:
  - fqbase
  - circuit_breaker
---

# Circuit Breaker 模块 - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) → **[集成指南](./integrations.md)** |


## 概述

本文档介绍如何将 Circuit Breaker 熔断器与其他系统和服务集成。

## HTTP 客户端集成

### requests 库集成

```python
import requests
from FQBase.Foundation import circuit_breaker, CircuitBreakerOpenException

@circuit_breaker(name="http_api", failure_threshold=5, recovery_timeout=30)
def call_http_api(url, method="GET", **kwargs):
    response = requests.request(method, url, **kwargs)
    response.raise_for_status()
    return response.json()

def robust_http_call(url, fallback=None):
    try:
        return call_http_api(url)
    except CircuitBreakerOpenException:
        return fallback
    except requests.RequestException:
        return fallback
```

### aiohttp 集成

```python
import aiohttp
from FQBase.Foundation import circuit_breaker, CircuitBreakerOpenException

@circuit_breaker(name="async_http", failure_threshold=5, recovery_timeout=60)
async def async_http_get(session, url):
    async with session.get(url) as response:
        return await response.json()

async def robust_async_call(url, fallback=None):
    try:
        async with aiohttp.ClientSession() as session:
            return await async_http_get(session, url)
    except CircuitBreakerOpenException:
        return fallback
```

## 数据库集成

### SQLAlchemy 集成

```python
from sqlalchemy import create_engine
from FQBase.Foundation import CircuitBreaker

db_breaker = CircuitBreaker(
    name="database",
    failure_threshold=10,
    recovery_timeout=60
)

def execute_with_circuit(sql, *args, **kwargs):
    try:
        return db_breaker.call(
            lambda: engine.execute(sql, *args, **kwargs)
        )
    except CircuitBreakerOpenException:
        # 降级到只读副本
        return read_replica.execute(sql, *args, **kwargs)
```

### Redis 集成

```python
import redis
from FQBase.Foundation import circuit_breaker

redis_client = redis.Redis(host='localhost', port=6379)

@circuit_breaker(name="redis", failure_threshold=3, recovery_timeout=10)
def redis_get(key):
    return redis_client.get(key)

@circuit_breaker(name="redis", failure_threshold=3, recovery_timeout=10)
def redis_set(key, value, ttl=None):
    if ttl:
        return redis_client.setex(key, ttl, value)
    return redis_client.set(key, value)
```

## 消息队列集成

### RabbitMQ 集成

```python
import pika
from FQBase.Foundation import CircuitBreaker

mq_breaker = CircuitBreaker(name="rabbitmq", failure_threshold=5)

def publish_message(exchange, routing_key, message):
    try:
        return mq_breaker.call(
            lambda: channel.basic_publish(exchange, routing_key, message)
        )
    except CircuitBreakerOpenException:
        # 消息持久化到本地，稍后重试
        save_to_local_queue(exchange, routing_key, message)
```

### Kafka 集成

```python
from kafka import KafkaProducer
from FQBase.Foundation import circuit_breaker

@circuit_breaker(name="kafka", failure_threshold=5, recovery_timeout=30)
def kafka_send(topic, value):
    future = producer.send(topic, value=value)
    return future.get(timeout=10)
```

## 框架集成

### Flask 集成

```python
from flask import Flask, jsonify
from FQBase.Foundation import circuit_breaker, CircuitBreakerOpenException

app = Flask(__name__)

@app.route('/api/data')
@circuit_breaker(name="flask_api", failure_threshold=3)
def get_data():
    return fetch_from_service()

@app.errorhandler(CircuitBreakerOpenException)
def handle_circuit_open(e):
    return jsonify({
        "error": "service_unavailable",
        "message": "服务暂不可用，请稍后重试",
        "retry_after": e.recovery_timeout
    }), 503
```

### FastAPI 集成

```python
from fastapi import FastAPI, HTTPException
from FQBase.Foundation import circuit_breaker, CircuitBreakerOpenException

app = FastAPI()

@app.get("/api/data")
@circuit_breaker(name="fastapi_data", failure_threshold=5)
async def get_data():
    return await fetch_data()

@app.exception_handler(CircuitBreakerOpenException)
async def circuit_exception_handler(request, exc):
    raise HTTPException(
        status_code=503,
        detail={
            "error": "circuit_breaker_open",
            "message": f"服务暂不可用，请 {exc.recovery_timeout} 秒后重试"
        }
    )
```

### Django 集成

```python
from django.http import JsonResponse
from FQBase.Foundation import circuit_breaker, CircuitBreakerOpenException

@circuit_breaker(name="django_api", failure_threshold=5)
def django_service_call(request):
    return fetch_data()

def service_view(request):
    try:
        data = django_service_call(request)
        return JsonResponse(data)
    except CircuitBreakerOpenException:
        return JsonResponse({
            "error": "service_unavailable"
        }, status=503)
```

## 监控集成

### Prometheus 集成

```python
from prometheus_client import Counter, Histogram
from FQBase.Foundation import CircuitBreaker

circuit_state_changes = Counter(
    'circuit_breaker_state_changes_total',
    'Circuit breaker state changes',
    ['name', 'old_state', 'new_state']
)

def on_state_change(breaker):
    circuit_state_changes.labels(
        name=breaker.name,
        old_state=breaker._state.value,
        new_state=breaker.state.value
    ).inc()

breaker = CircuitBreaker(name="api", on_state_change=on_state_change)
```

## 分布式追踪集成

### Jaeger 集成

```python
from jaeger_client import Tracer
from FQBase.Foundation import CircuitBreaker

tracer = Tracer(service_name="my-service")

def traced_call(breaker, func, *args, **kwargs):
    with tracer.start_span("circuit_breaker_call") as span:
        span.set_tag("circuit_name", breaker.name)
        span.set_tag("circuit_state", breaker.state.value)
        
        try:
            result = breaker.call(func, *args, **kwargs)
            span.set_tag("result", "success")
            return result
        except CircuitBreakerOpenException as e:
            span.set_tag("result", "rejected")
            span.set_tag("retry_after", e.recovery_timeout)
            raise
```

## 集成最佳实践

1. **装饰器优先** - 使用装饰器方式最简洁
2. **做好降级** - 熔断打开时必须有备选方案
3. **统一管理** - 使用 CircuitBreakerManager 统一管理
4. **监控告警** - 集成监控告警系统

## 相关文档

- [API参考](./api.md)
- [技术架构](./architecture.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
