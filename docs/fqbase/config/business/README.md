# Config/business 业务配置文档

**模块路径**: `FQBase.Config.business`
**源码**: [business/](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Config/business)

---

## 一、概述

business 子模块提供量化交易业务相关的配置，包括交易常量、数据源配置、财务指标映射和 IP 列表配置。

---

## 二、快速开始

### 导入交易常量

```python
from FQBase.Config import ORDER_DIRECTION, EXCHANGE_ID, ORDER_STATUS

direction = ORDER_DIRECTION.BUY
exchange = EXCHANGE_ID.SSE
status = ORDER_STATUS.NEW
```

### 获取数据源优先级

```python
from FQBase.Config import get_datasource_priority, get_health_check_config

priority = get_datasource_priority('stock')
health_config = get_health_check_config()
```

---

## 三、子模块

| 子模块 | 说明 |
|--------|------|
| `constants.py` | 交易常量定义 |
| `datasource_config.py` | 数据源配置 |
| `financial_mapping.py` | 财务指标映射 |
| `ip_list.py` | IP 列表配置 |
