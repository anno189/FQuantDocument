---
title: Business - API参考
description: Business 业务配置模块 API 参考文档
tag:
  - fqbase
  - config

summary:
  purpose: api-reference
  core_classes:
    - DataSourceConfig
    - TDXIPListManager
  core_functions:
    - get_datasource_priority
    - get_health_check_config
---

# Business - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → **[API参考](./api.md)** → [使用指南](./usage.md) |

## 函数

### get_datasource_priority

```python
from FQBase.Config.business import get_datasource_priority

priority = get_datasource_priority(asset_type: str) -> List[str]
```

**描述：** 获取指定资产类型的数据源优先级

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| asset_type | str | 是 | 资产类型 (stock/index/future/bond/option/hk_stock/us_stock/exchange_rate) |

**返回：** 数据源代号列表

**示例：**

```python
priority = get_datasource_priority('stock')
# ['tdx', 'tushare']
```

---

### get_health_check_config

```python
from FQBase.Config.business import get_health_check_config

config = get_health_check_config() -> Dict[str, Any]
```

**描述：** 获取健康检查配置

**返回：**

| 键 | 类型 | 描述 |
|----|------|------|
| enabled | bool | 是否启用 |
| timeout | int | 超时时间(秒) |
| startup_check | bool | 启动时检查 |
| on_demand_check | bool | 按需检查 |

---

### reload_datasource_config

```python
from FQBase.Config.business import reload_datasource_config

reload_datasource_config() -> None
```

**描述：** 重新加载数据源配置，清除缓存并重新初始化

---

## 类

### DataSourceConfig

**位置：** `FQBase/Config/business/datasource_config.py`

**描述：** 数据源配置单例类

#### 方法

##### get

```python
value = config.get(key: str, default: Any = None) -> Any
```

**描述：** 获取配置值，支持点号分隔的键

**参数：**

| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| key | str | 是 | 配置键，支持点号分隔 (如 'datasources.stock.priority') |
| default | Any | 否 | 默认值 |

##### get_priority

```python
priority = config.get_priority(asset_type: str) -> List[str]
```

**描述：** 获取指定资产类型的数据源优先级

##### get_health_check_enabled

```python
enabled = config.get_health_check_enabled() -> bool
```

**描述：** 获取健康检查是否启用

##### get_health_check_timeout

```python
timeout = config.get_health_check_timeout() -> int
```

**描述：** 获取健康检查超时时间(秒)

---

### TDXIPListManager

**位置：** `FQBase/Config/business/ip_list.py`

**描述：** 通达信 IP 列表管理器（延迟加载）

#### 类方法

##### get_info_list

```python
ip_list = TDXIPListManager.get_info_list() -> List[Dict]
```

**描述：** 获取通达信资讯 IP 列表

##### get_stock_list

```python
ip_list = TDXIPListManager.get_stock_list() -> List[Dict]
```

**描述：** 获取通达信股票 IP 列表

##### get_future_list

```python
ip_list = TDXIPListManager.get_future_list() -> List[Dict]
```

**描述：** 获取通达信期货 IP 列表

##### exclude_from_stock_ip_list

```python
ip_list = TDXIPListManager.exclude_from_stock_ip_list(exclude_ip_list: List[str]) -> List[Dict]
```

**描述：** 从股票 IP 列表中排除指定 IP

##### exclude_from_future_ip_list

```python
ip_list = TDXIPListManager.exclude_from_future_ip_list(exclude_ip_list: List[str]) -> List[Dict]
```

**描述：** 从期货 IP 列表中排除指定 IP

---

### reload_ip_list

```python
from FQBase.Config.business import reload_ip_list

reload_ip_list() -> None
```

**描述：** 重新加载 IP 列表

---

## 常量

### IP 列表路径

| 常量 | 说明 |
|------|------|
| TDX_INFO_IP_FILE_PATH | 通达信资讯 IP 文件路径 |
| TDX_STOCK_IP_FILE_PATH | 通达信股票 IP 文件路径 |
| TDX_FUTURE_IP_FILE_PATH | 通达信期货 IP 文件路径 |

### IP 列表便捷函数

| 函数 | 说明 |
|------|------|
| get_TDX_info_ip_list() | 获取资讯 IP 列表 |
| get_TDX_stock_ip_list() | 获取股票 IP 列表 |
| get_TDX_future_ip_list() | 获取期货 IP 列表 |
| exclude_from_TDX_stock_ip_list(exclude_ip_list) | 从股票列表排除 IP |
| exclude_from_TDX_future_ip_list(exclude_ip_list) | 从期货列表排除 IP |

---

## 相关文档

- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
