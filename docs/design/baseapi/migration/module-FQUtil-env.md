# FQUtil.env - 环境变量工具

> 版本: v1.0
> 更新时间: 2026-03-26

---

## 一、模块概述

`FQUtil.env` 提供环境变量加载和管理功能，支持从 `.env` 文件读取配置。

**迁移状态**: ✅ 已完成从 `FQData.QAUtil.QAEnv` 的迁移

---

## 二、导入方式

```python
from FQBase.FQUtil.env import load_env, get_env
```

---

## 三、快速开始

```python
# 1. 在应用入口加载环境变量（只需调用一次）
from FQBase.FQUtil.env import load_env
load_env()

# 2. 在业务代码中获取环境变量
from FQBase.FQUtil.env import get_env, get_env_int, get_env_bool

api_key = get_env('API_KEY')           # 字符串
port = get_env_int('PORT', 8080)       # 整数
debug = get_env_bool('DEBUG', False)   # 布尔
```

---

## 四、函数列表

### 4.1 load_env

加载 `.env` 环境变量配置文件。

```python
def load_env(env_file: str = None) -> bool
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| env_file | str | None | 环境文件路径，默认从当前目录查找 `.env` |

**返回值**: bool - 是否加载成功

```python
from FQBase.FQUtil.env import load_env

# 使用默认 .env 文件
load_env()

# 指定文件路径
load_env('/path/to/.env.production')
```

**注意**: 多次调用只有第一次生效，除非调用 `reload_env()`

---

### 4.2 get_env

获取字符串类型的环境变量。

```python
def get_env(key: str, default: Optional[str] = None) -> Optional[str]
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| key | str | - | 环境变量名 |
| default | str | None | 默认值 |

```python
from FQBase.FQUtil.env import get_env

api_key = get_env('API_KEY')              # 无默认值
api_key = get_env('API_KEY', 'default')  # 有默认值
```

---

### 4.3 get_env_int

获取整数类型的环境变量。

```python
def get_env_int(key: str, default: int = 0) -> int
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| key | str | - | 环境变量名 |
| default | int | 0 | 默认值 |

```python
from FQBase.FQUtil.env import get_env_int

port = get_env_int('PORT', 8080)
timeout = get_env_int('TIMEOUT', 30)
```

---

### 4.4 get_env_bool

获取布尔类型的环境变量。

```python
def get_env_bool(key: str, default: bool = False) -> bool
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| key | str | - | 环境变量名 |
| default | bool | False | 默认值 |

**True 值**: `true`, `1`, `yes`, `on`（不区分大小写）

```python
from FQBase.FQUtil.env import get_env_bool

debug = get_env_bool('DEBUG', False)
enable_cache = get_env_bool('ENABLE_CACHE', True)
```

---

### 4.5 get_env_list

获取列表类型的环境变量。

```python
def get_env_list(key: str, default: list = None, sep: str = ',') -> list
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| key | str | - | 环境变量名 |
| default | list | None | 默认值 |
| sep | str | `,` | 分隔符 |

```python
from FQBase.FQUtil.env import get_env_list

# WHITE_LIST=192.168.1.1,192.168.1.2,192.168.1.3
ips = get_env_list('WHITE_LIST')
# ['192.168.1.1', '192.168.1.2', '192.168.1.3']

# 使用分号分隔
paths = get_env_list('PATHS', sep=';')
```

---

### 4.6 is_production

判断是否为生产环境。

```python
def is_production() -> bool
```

**返回值**: bool - 是否为生产环境

**判断依据**: `ENV` 环境变量等于 `production`

```python
from FQBase.FQUtil.env import is_production

if is_production():
    print('Running in production mode')
```

---

### 4.7 is_development

判断是否为开发环境。

```python
def is_development() -> bool
```

**返回值**: bool - 是否为开发环境

**判断依据**: `ENV` 环境变量等于 `development`

```python
from FQBase.FQUtil.env import is_development

if is_development():
    print('Running in development mode')
```

---

### 4.8 is_debug

判断是否为调试模式。

```python
def is_debug() -> bool
```

**返回值**: bool - 是否为调试模式

**判断依据**: `DEBUG` 环境变量为 `true/1/yes/on`

```python
from FQBase.FQUtil.env import is_debug

if is_debug():
    print('Debug mode enabled')
```

---

### 4.9 reload_env

重新加载环境变量。

```python
def reload_env()
```

**注意**: 调用后会重置 `load_env()` 的加载状态，下次调用 `get_env_*` 时会重新读取 `.env` 文件。

```python
from FQBase.FQUtil.env import reload_env

# 修改 .env 文件后重新加载
reload_env()
```

---

## 五、完整函数列表

| 函数 | 说明 |
|------|------|
| `load_env()` | 加载 .env 文件 |
| `get_env()` | 获取字符串值 |
| `get_env_int()` | 获取整数值 |
| `get_env_bool()` | 获取布尔值 |
| `get_env_list()` | 获取列表值 |
| `is_production()` | 判断生产环境 |
| `is_development()` | 判断开发环境 |
| `is_debug()` | 判断调试模式 |
| `reload_env()` | 重新加载环境变量 |

---

## 六、环境变量说明

### 默认环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `ENV` | `development` | 环境标识 |
| `DEBUG` | `False` | 调试模式 |

### .env 文件格式

```bash
# 注释
ENV=production
DEBUG=false
API_KEY=your-api-key-here
PORT=8080

# 列表格式
WHITE_LIST=192.168.1.1,192.168.1.2
```

---

## 七、迁移说明

### 历史迁移

| 日期 | 变更 |
|------|------|
| 2026-03-26 | 从 `FQData.QAUtil.QAEnv` 迁移到 `FQBase.FQUtil.env` |

### 迁移示例

```python
# 旧代码
from FQData.QAUtil.QAEnv import load_env, get_env

# 新代码
from FQBase.FQUtil.env import load_env, get_env
```

---

## 八、相关文档

- [module-FQUtil.md](./module-FQUtil.md) - FQUtil 模块索引