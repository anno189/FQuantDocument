# TDX 连接池与健康检查架构

## 概述

本文档详细说明 TDX 适配器中 **连接池 (Connection Pool)** 和 **健康检查 (Health Check)** 的架构设计、职责边界和协作关系。

---

## 架构分层

```
┌─────────────────────────────────────────────────────────────┐
│                      TdxBaseAdapter                         │
│                   (适配器管理层)                             │
├─────────────────────────────────────────────────────────────┤
│  - health_check()        # 健康检查/故障探测                  │
│  - _connect()            # 初始化连接标志                     │
│  - _ip_selector          # IP 选择管理                        │
│  - _hq_connection()      # 获取 HQ 连接（上下文管理器）        │
│  - _ex_connection()      # 获取 EX-HQ 连接（上下文管理器）     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    TdxConnectionPool                         │
│                    (连接池管理层)                             │
├─────────────────────────────────────────────────────────────┤
│  - get_hq_connection()   # 获取 HQ 连接                        │
│  - return_hq_connection() # 归还 HQ 连接                      │
│  - get_ex_connection()   # 获取 EX-HQ 连接                    │
│  - return_ex_connection() # 归还 EX-HQ 连接                   │
│  - close_all()           # 关闭所有连接                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       pytdx API                              │
│                    (底层网络库)                               │
├─────────────────────────────────────────────────────────────┤
│  - TdxHq_API.connect()   # TCP 连接                          │
│  - TdxExHq_API.connect() # TCP 连接                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 职责边界

### TdxBaseAdapter - 业务协调层

| 职责 | 说明 |
|------|------|
| IP 管理 | 通过 `_ip_selector` 选择最优服务器 IP |
| 健康探测 | `health_check()` 检查数据源是否可用 |
| 连接协调 | `_hq_connection()` / `_ex_connection()` 协调连接池 |
| 重试决策 | 失败时决定是否重新选择 IP 重试 |
| 状态管理 | 管理 `self._connected` 连接标志 |

**不负责：**
- 连接的具体创建和销毁
- 连接的复用逻辑
- 连接池的线程安全

### TdxConnectionPool - 连接管理层

| 职责 | 说明 |
|------|------|
| 连接创建 | `_create_hq_connection()` / `_create_ex_connection()` |
| 连接复用 | 从池中获取可用连接，避免重复创建 |
| 连接归还 | `return_hq_connection()` / `return_ex_connection()` |
| 连接缓存 | 维护空闲连接队列 |
| 资源清理 | `close_all()` 关闭所有连接 |

**不负责：**
- IP 如何选择
- 何时创建/归还连接的业务逻辑
- 失败后的重试策略

---

## 健康检查 (health_check)

### 方法签名

```python
def health_check(self) -> bool:
    """健康检查

    Returns:
        bool: 数据源是否健康
    """
```

### 内部实现

```python
def health_check(self) -> bool:
    try:
        ip, port = self._get_mainmarket_ip()
        if ip is None:
            return False
        api = TdxHq_API()
        timeout = max(self._timeout, 1.0)
        with api.connect(ip, port, time_out=timeout):
            return api.get_security_list(0, 1) is not None
    except (ConnectionError, OSError, TimeoutError) as e:
        logger.warning(f"Tdx health check failed: {str(e)}")
        return False
    except Exception as e:
        logger.warning(f"Tdx unexpected error during health check: {str(e)}")
        return False
```

### 使用场景

| 场景 | 说明 |
|------|------|
| **定时监控** | Celery 定时任务每隔 N 分钟检查数据源状态 |
| **API 端点** | Web 服务提供 `/health` 端点返回数据源状态 |
| **故障切换前验证** | 切换到备用数据源前确认当前数据源是否真的不可用 |
| **启动检查** | 应用启动时验证数据源可用性 |

### 注意事项

- `health_check()` **当前未被主动调用**，属于"备用能力"
- 实际取数时的重试由 `@retry` 装饰器处理
- 如需激活监控，需配合 `DataSourceHealthCheck` 使用

---

## 连接池 (TdxConnectionPool)

### 类图

```
TdxConnectionPool (单例)
├── _hq_pool: Queue          # HQ 连接池
├── _ex_pool: Queue          # EX-HQ 连接池
├── _hq_count: int          # 当前 HQ 连接数
├── _ex_count: int          # 当前 EX-HQ 连接数
├── _max_connections: int    # 最大连接数 (10)
└── 方法:
    ├── get_hq_connection(ip, port, timeout)
    ├── return_hq_connection(api)
    ├── get_ex_connection(ip, port, timeout)
    ├── return_ex_connection(api)
    └── close_all()
```

### 获取连接流程

```
用户调用 _hq_connection()
    │
    ▼
get_tdx_pool().get_hq_connection(ip, port, timeout)
    │
    ├── 尝试从池中获取连接
    │       │
    │       ├── 成功 → 返回连接
    │       │
    │       └── 失败（池空）→ 创建新连接
    │               │
    │               ├── 创建成功 → 返回连接
    │               │
    │               └── 创建失败 → 返回 None
    │
    ▼
返回 TdxHq_API 实例
```

### 归还连接流程

```
用户使用完连接（上下文管理器退出）
    │
    ▼
finally: pool.return_hq_connection(api)
    │
    ├── 连接正常 → 放回池中供复用
    │
    └── 连接异常 → 断开连接，不放回池中
```

### 配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `maxsize` | 10 | 每个池的最大连接数 |
| 超时 | 10s | 创建连接时的超时时间 |

---

## 容错机制

### 两级容错设计

```
┌─────────────────────────────────────────────────────────────┐
│                    第1级：IP 切换（TdxBaseAdapter）          │
├─────────────────────────────────────────────────────────────┤
│  触发条件：TDX 服务器 A 断开                                   │
│  行为：自动选择 TDX 服务器 B                                  │
│  机制：@retry 装饰器 + _ip_selector                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼（第1级全部失败）
┌─────────────────────────────────────────────────────────────┐
│                 第2级：数据源切换（DataSourceFacade）         │
├─────────────────────────────────────────────────────────────┤
│  触发条件：TDX 完全不可用（所有 IP 都挂）                      │
│  行为：切换到 AkShare / EFinance                             │
│  机制：_fetch_with_fallback()                                │
└─────────────────────────────────────────────────────────────┘
```

### @retry 装饰器

```python
# TdxStockAdapter.get_stock_day
@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
def get_stock_day(self, code, start, end, frequence="day"):
    # 失败后自动重试，重新选 IP
```

### IP 选择器

```python
# _ip_selector.select_best_ip() 在以下时机被调用：
# 1. __init__() - 初始化时
# 2. @retry 重试时 - 失败后重新选择
# 3. health_check() - （当前未使用）
```

---

## 状态标志

| 标志 | 位置 | 说明 |
|------|------|------|
| `self._connected` | TdxBaseAdapter | 适配器连接状态（只是标志，非真实连接） |
| `self._ip_selector` | TdxBaseAdapter | IP 选择器，缓存当前最优 IP |
| `_hq_pool` / `_ex_pool` | TdxConnectionPool | 实际连接队列 |

**注意**：`self._connected = True` 只表示"IP 选择成功"，不表示真实网络连接可用。真实连接由连接池管理。

---

## 健康检查与连接池的关系

### 共同点

- 都与"连接"相关
- 都处理网络异常

### 区别

| 维度 | health_check() | @retry + 连接池 |
|------|----------------|----------------|
| **目的** | 探测/监控 | 自动恢复 |
| **调用时机** | 需要时手动调用 | 取数失败时自动触发 |
| **是否切换 IP** | 否（当前实现） | 是 |
| **返回内容** | bool | 实际数据 |
| **激活状态** | 未激活 | 正常工作中 |

### 协作场景

```
场景：TDX 服务器中断

1. 用户调用 get_stock_day()
       │
       ▼
2. @retry 检测到连接失败
       │
       ▼
3. _ip_selector.select_best_ip() 重新选 IP
       │
       ▼
4. 使用新 IP 重试
       │
       ├── 成功 → 返回数据 ✓
       │
       └── 失败（所有 IP 都挂）
               │
               ▼
5. health_check() 探测（如果被调用）
       │
       ▼
6. DataSourceFacade 切换到 AkShare
```

---

## 相关文档

- [TDX README](README.md)
- [TDX Base API](base.md)
- [TDX 开发指南](base_development.md)
- [TDX FAQ](base_faq.md)
- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](../adapters/README.md)
