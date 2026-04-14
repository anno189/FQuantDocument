---
title: Cache - 安全指南
description: Cache 模块安全配置与最佳实践
tag:
  - fqbase
  - cache
---

# Cache - 安全指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → **[安全指南](./security.md)** → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |

## 概述

本指南介绍 Cache 模块的安全配置和最佳实践。

## 认证

### Redis 认证

```python
from FQBase.Cache import RedisCacheAdapter

redis = RedisCacheAdapter(
    host='localhost',
    port=6379,
    password='your_redis_password'
)
```

### MongoDB 认证

```python
from FQBase.Cache import MongoCacheAdapter

mongo = MongoCacheAdapter(
    connection_string='mongodb://user:password@localhost:27017',
    database='cache_db',
    collection='cache'
)
```

## 数据保护

### 敏感数据

**建议：** 不要缓存敏感信息

```python
# ❌ 不好：缓存敏感信息
cache.set("user:password:1", "secret")

# ✅ 好：完全不缓存敏感信息
```

### 序列化安全

**建议：** 使用 safe_mode 禁用 pickle

```python
# 禁用 pickle，仅使用 msgpack
redis = RedisCacheAdapter(safe_mode=True)
```

### 传输加密

**建议：** 使用 SSL/TLS 连接

```python
# 生产环境使用 SSL
redis = RedisCacheAdapter(
    host='localhost',
    port=6379,
    ssl=True,
    ssl_cert_reqs='required'
)
```

## 输入验证

### 键验证

```python
import re

class SecureCache:
    def __init__(self, cache):
        self.cache = cache
        self.key_pattern = re.compile(r'^[\w:.-]+$')
    
    def _validate_key(self, key: str) -> bool:
        if not key or len(key) > 1024:
            return False
        if not self.key_pattern.match(key):
            return False
        return True
    
    def set(self, key, value, ttl=None):
        if not self._validate_key(key):
            raise ValueError(f"Invalid cache key: {key}")
        return self.cache.set(key, value, ttl)
```

## 网络安全

### 限制网络访问

```bash
# Redis 配置绑定到本地
bind 127.0.0.1

# 使用防火墙限制访问
iptables -A INPUT -p tcp --dport 6379 -s 127.0.0.1 -j ACCEPT
iptables -A INPUT -p tcp --dport 6379 -j DROP
```

## 安全最佳实践

1. **使用强密码**：Redis 和 MongoDB 使用强密码
2. **启用 SSL/TLS**：生产环境使用加密连接
3. **限制网络访问**：只允许受信任的 IP 访问
4. **定期轮换凭据**：定期更换密码
5. **监控访问日志**：记录异常访问
6. **使用 safe_mode**：禁用 pickle 避免代码执行风险
7. **不要缓存敏感信息**：密码、Token 等不要缓存

---

## 相关文档

- [API参考](./api.md)
- [最佳实践](./best-practices.md)
- [配置指南](./configuration.md)
