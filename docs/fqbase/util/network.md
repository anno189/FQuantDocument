---
title: Network
description: 网络工具，提供URL检测和网络延迟测量功能
tag:
  - fqbase
  - util
  - utility

summary:
  type: utility
  complexity: minimal
  maturity: stable
  functions:
    - web_ping
    - check_url_accessible
---

# Network

## 一句话总览

📌 **网络工具，URL可访问性检测和网络延迟测量**

**TL;DR**：
- 核心能力：URL检测、网络延迟、ping测试
- 入门难度：🟢 简单

## 快速开始

```python
from FQBase.Util.network import check_url_accessible, web_ping

if check_url_accessible('https://example.com'):
    latency = web_ping('example.com')
```

## 函数列表

### web_ping

```python
from FQBase.Util.network import web_ping

result = web_ping(url, count=1)
```

**描述：** Ping URL获取延迟

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| url | str | 是 | URL地址（仅支持主机名或IP） |
| count | int | 否 | ping次数，默认1 |

**返回：** `Optional[int]` - 延迟毫秒数，失败返回 None

**示例：**

```python
latency = web_ping('google.com')
print(f'延迟: {latency}ms')
```

---

### check_url_accessible

```python
from FQBase.Util.network import check_url_accessible

result = check_url_accessible(url, timeout=5)
```

**描述：** 检查URL是否可访问

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| url | str | 是 | URL地址 |
| timeout | int | 否 | 超时秒数，默认5 |

**返回：** `bool` - URL是否可访问

**示例：**

```python
if check_url_accessible('https://api.example.com'):
    print('API可访问!')
```

---

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01-01 | 初始版本 |
