---
title: Business - 故障排查
description: Business 业务配置模块常见问题与解决方案
tag:
  - fqbase
  - config
---

# Business - 故障排查

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维 | [README](./README.md) → [技术架构](./architecture.md) → [配置指南](./configuration.md) → **[故障排查](./troubleshooting.md)** |

## 概述

Business 模块的常见问题和解决方案

## 常见问题

### 问题1: 配置文件不存在

**症状：**
- 使用默认IP列表
- 警告信息

**可能原因：**
- 配置文件未创建

**解决方案：**

1. 检查配置文件是否存在：
```python
from FQBase.Config import SETTING_PATH
import os

ip_file = f"{SETTING_PATH}/stock_ip.json"
print(f"文件存在: {os.path.exists(ip_file)}")
```

2. 创建配置文件：
```bash
mkdir -p ~/.fqdata/setting
# 创建 stock_ip.json 文件
```

---

### 问题2: 获取配置返回空值

**症状：**
- `get_datasource_priority` 返回空列表

**可能原因：**
- datasource.yaml 配置不正确
- 配置键名错误

**解决方案：**

1. 检查配置文件格式：
```python
import yaml
config_path = '/path/to/datasource.yaml'
with open(config_path) as f:
    config = yaml.safe_load(f)
print(config)
```

2. 检查配置键名：
```yaml
datasources:
  stock:
    priority: ['tdx', 'tushare']
```

---

### 问题3: IP列表未更新

**症状：**
- 修改JSON文件后获取的还是旧数据

**可能原因：**
- 缓存未刷新

**解决方案：**

```python
from FQBase.Config.business import reload_ip_list

# 刷新IP列表
reload_ip_list()

# 重新获取
from FQBase.Config.business import get_TDX_stock_ip_list
ips = get_TDX_stock_ip_list()
```

## 错误参考

| 错误 | 描述 | 解决方案 |
|------|------|---------|
| FileNotFoundError | 配置文件不存在 | 检查路径或创建文件 |
| KeyError | 配置键不存在 | 检查键名 |
| json.JSONDecodeError | JSON格式错误 | 检查JSON格式 |

## 相关文档

- [常见问题](./faq.md)
- [最佳实践](./best-practices.md)
- [API参考](./api.md)
