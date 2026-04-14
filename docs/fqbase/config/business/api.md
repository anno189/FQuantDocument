---
title: Business - API参考
description: Business 业务配置模块 API 参考文档
tag:
  - fqbase
  - config

summary:
  purpose: api-reference
---

# Business - API参考

## 常量

### 交易常量

| 常量 | 说明 |
|------|------|
| ORDER_DIRECTION | 订单方向：BUY, SELL |
| TIME_CONDITION | 时间条件：GFD, IOC, FOK |
| VOLUME_CONDITION | 成交量条件：ANY, MIN, ALL |
| EXCHANGE_ID | 交易所：SH, SZ, CFFEX, DCE, CZCE, SHFE |
| OFFSET | 开平仓：OPEN, CLOSE |
| ORDER_MODEL | 订单模式：LIMIT, MARKET, STOP |
| ORDER_STATUS | 订单状态 |
| AMOUNT_MODEL | 金额模式 |
| RUNNING_ENVIRONMENT | 运行环境 |
| MARKET_TYPE | 市场类型：SH, SZ, BJ |
| DATASOURCE | 数据源 |
| OUTPUT_FORMAT | 输出格式 |
| RUNNING_STATUS | 运行状态 |
| CURRENCY_TYPE | 货币类型 |
| FREQUENCE | 频率 |
| DATABASE_TABLE | 数据库表 |
| TRADE_STATUS | 交易状态 |
| MARKET_ERROR | 市场错误 |
| BROKER_TYPE | 券商类型 |
| EVENT_TYPE | 事件类型 |
| MARKET_EVENT | 市场事件 |
| ENGINE_EVENT | 引擎事件 |
| ACCOUNT_EVENT | 账户事件 |
| BROKER_EVENT | 券商事件 |
| ORDER_EVENT | 订单事件 |

### 函数

#### get_datasource_priority

```python
from FQBase.Config.business import get_datasource_priority

priority = get_datasource_priority() -> List[str]
```

#### get_health_check_config

```python
from FQBase.Config.business import get_health_check_config

config = get_health_check_config() -> dict
```

### 数据

| 常量 | 说明 |
|------|------|
| FINANCIAL_INDICATORS | 财务指标映射 |
| FINANCIAL_CATEGORIES | 财务分类 |
| TDX_info_ip_list | 通达信资讯 IP 列表 |
| TDX_stock_ip_list | 通达信股票 IP 列表 |
| TDX_future_ip_list | 通达信期货 IP 列表 |
| exclude_from_TDX_stock_ip_list | 排除的股票 IP 列表 |

---

## 相关文档

- [使用指南](./usage.md)
