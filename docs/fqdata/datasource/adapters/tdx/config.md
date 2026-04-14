# TDX 适配器配置说明

## 概述

本文档详细说明 TDX 适配器的所有配置选项，包括环境变量、配置文件参数和行为设置。

***

## 环境变量

### TDX\_DEFAULT\_TIMEOUT

设置 TDX 适配器的默认超时时间。

| 属性  | 值       |
| --- | ------- |
| 类型  | `float` |
| 默认值 | `0.7`   |
| 单位  | 秒       |

**示例：**

```bash
export TDX_DEFAULT_TIMEOUT=0.7
```

**在代码中设置：**

```python
import os
os.environ['TDX_DEFAULT_TIMEOUT'] = '1.0'
```

***

## 配置文件

TDX 适配器使用 FQBase 的 SETTING 配置系统，配置文件通常位于项目根目录的 `config.ini` 或 `settings.ini` 文件中。

### IPLIST 配置段

#### exclude - IP 排除列表

指定在 IP 选择时需要排除的服务器。

```ini
[IPLIST]
exclude = [{'ip': '1.2.3.4', 'port': 7709}, {'ip': '5.6.7.8', 'port': 7709}]
```

**默认值：** `[{'ip': '1.1.1.1', 'port': 7709}]`

**说明：**

- 当某个 IP 响应异常或被限制时，可加入此列表
- 格式为 Python 列表字面量
- 每个元素为字典，包含 `ip` 和 `port` 字段

***

#### default - 默认 IP

设置优先使用的默认 IP。

```ini
[IPLIST]
default = {'stock': {'ip': '106.14.201.200', 'port': 7709}, 'future': {'ip': '112.95.244.183', 'port': 7709}}
```

**默认值：** `{'stock': {'ip': None, 'port': None}, 'future': {'ip': None, 'port': None}}`

**说明：**

- `stock` 对应主板市场（股票、指数、债券）
- `future` 对应扩展市场（期货、期权、港股）
- 如果设置的 IP 响应正常（<1s），则优先使用
- 如果 IP 无响应或超时，会自动重新选择最优 IP

***

### 配置示例

#### 完整配置示例

```ini
[FQuant]
debug = false

[IPLIST]
exclude = [
    {'ip': '106.14.201.201', 'port': 7709},
    {'ip': '112.95.244.184', 'port': 7709}
]
default = {'stock': {'ip': '106.14.201.200', 'port': 7709}, 'future': {'ip': '112.95.244.183', 'port': 7709}}
```

#### 开发环境配置

```ini
[IPLIST]
exclude = []
default = {'stock': {'ip': None, 'port': None}, 'future': {'ip': None, 'port': None}}
```

#### 生产环境配置

```ini
[IPLIST]
exclude = [
    {'ip': '1.1.1.1', 'port': 7709}
]
default = {'stock': {'ip': '106.14.201.200', 'port': 7709}, 'future': {'ip': '112.95.244.183', 'port': 7709}}
```

***

## 代码级配置

### 超时配置

#### 实例级别超时

```python
from FQData.DataSource.adapters.tdx import TdxStockAdapter

adapter = TdxStockAdapter(timeout=2.0)
```

#### 类级别默认超时

```python
from FQData.DataSource.adapters.tdx import TdxBaseAdapter

TdxBaseAdapter.set_default_timeout(1.0)
```

### 连接池配置

```python
from FQData.DataSource.adapters.tdx.connection_pool import get_tdx_pool

pool = get_tdx_pool()

print(f"最大连接数: {pool._max_connections}")
print(f"当前 HQ 连接数: {pool.hq_count}")
print(f"当前 EX 连接数: {pool.ex_count}")
```

***

## 配置优先级

配置优先级从高到低：

| 优先级 | 配置方式    | 示例                                        |
| --- | ------- | ----------------------------------------- |
| 1   | 代码中实例参数 | `TdxStockAdapter(timeout=2.0)`            |
| 2   | 代码中类方法  | `TdxBaseAdapter.set_default_timeout(1.0)` |
| 3   | 环境变量    | `export TDX_DEFAULT_TIMEOUT=0.7`          |
| 4   | 配置文件    | `[IPLIST] default = {...}`                |
| 5   | 代码默认值   | `_default_timeout = 0.7`                  |

***

## 运行时配置修改

### 修改超时时间

```python
adapter = TdxStockAdapter(timeout=1.0)
```

### 重置 IP 缓存

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector

TdxIPSelector.reset()
```

### 动态修改连接池大小

```python
pool = get_tdx_pool()

old_max = pool._max_connections
pool._max_connections = 20

print(f"连接池上限: {old_max} -> {pool._max_connections}")
```

***

## 环境特定配置

### 开发环境

```python
import os

os.environ['TDX_DEFAULT_TIMEOUT'] = '5.0'
```

连接池保持较大值，便于调试。

***

### 测试环境

```python
import os

os.environ['TDX_DEFAULT_TIMEOUT'] = '2.0'
```

使用 Mock IP 以避免依赖外部服务。

***

### 生产环境

```python
import os

os.environ['TDX_DEFAULT_TIMEOUT'] = '0.7'
```

连接池限制较小值，确保资源合理使用。

***

## 配置验证

### 验证超时配置

```python
from FQData.DataSource.adapters.tdx import TdxBaseAdapter

print(f"当前默认超时: {TdxBaseAdapter._default_timeout}")
```

### 验证 IP 配置

```python
from FQData.DataSource.adapters.tdx import TdxIPSelector
from FQBase.Config import SETTING

exclude = SETTING.get_config(section='IPLIST', option='exclude', default_value=[])
default_ip = SETTING.get_config(section='IPLIST', option='default', default_value={})

print(f"排除 IP: {exclude}")
print(f"默认 IP: {default_ip}")

best_ip = TdxIPSelector.select_best_ip()
print(f"最优 IP: {best_ip}")
```

***

## 配置错误处理

### 配置文件不存在

```python
from FQBase.Config import SETTING

try:
    default_ip = SETTING.get_config(section='IPLIST', option='default')
except Exception as e:
    print(f"配置读取失败，使用默认值: {e}")
    default_ip = {'stock': {'ip': None, 'port': None}, 'future': {'ip': None, 'port': None}}
```

### 配置格式错误

```python
import ast

default_ip_str = SETTING.get_config(section='IPLIST', option='default')

try:
    default_ip = ast.literal_eval(default_ip_str)
except (ValueError, SyntaxError) as e:
    import json
    try:
        default_ip = json.loads(default_ip_str)
    except json.JSONDecodeError:
        print(f"配置解析失败: {e}")
        default_ip = {'stock': {'ip': None, 'port': None}, 'future': {'ip': None, 'port': None}}
```

***

## 配置与性能的权衡

### 超时时间

| 超时值  | 优点          | 缺点        |
| ---- | ----------- | --------- |
| 0.5s | 快速失败，资源利用率高 | 可能在慢网络下误判 |
| 1.0s | 平衡选择        | 一般场景推荐    |
| 5.0s | 适应慢网络       | 可能造成请求堆积  |

**建议：** 根据实际网络状况调整，一般 0.7-1.0s 较合适。

### IP 缓存时间

| TTL        | 适用场景   |
| ---------- | ------ |
| 3600 (1小时) | 开发测试   |
| 86400 (1天) | 生产环境   |
| 更长         | 静态网络环境 |

### 连接池大小

| 最大连接数 | 适用场景     |
| ----- | -------- |
| 5     | 单应用，低并发  |
| 10    | 中等并发（默认） |
| 20    | 高并发，多实例  |

***

## 相关文档

- [TDX README](README.md)
- [TDX 架构说明](architecture.md)
- [TDX 设计文档](design.md)
- [TDX 框架文档](framework.md)
- [TDX API 参考](api.md)
- [TDX 使用指南](usage.md)
- [TDX 最佳实践](best-practices.md)
- [TDX 开发指南](development.md)
- [TDX FAQ](faq.md)
- [TDX 更新日志](changelog.md)
- [TDX 连接池与健康检查](connection_pool.md)

