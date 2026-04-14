---
title: 统一日志系统 - API参考
description: 统一日志系统 API 参考文档
tag:
  - fqbase
  - logger

summary:
  purpose: api-reference
  core_classes:
    - FQLogger
  core_functions:
    - get_logger
    - init_logging
---

# 统一日志系统 - API参考

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → **[API参考](./api.md)** |

## 类

### FQLogger

**位置：** `FQBase/Core/logger.py`

**描述：** 统一的日志记录器类 - 多实例单例模式（按 name 区分）

```python
from FQBase.Core.logger import FQLogger
```

#### 方法

##### debug

```python
logger.debug(msg: str)
```

**描述：** 输出调试信息

##### info

```python
logger.info(msg: str)
```

**描述：** 输出普通信息

##### warning

```python
logger.warning(msg: str)
```

**描述：** 输出警告信息

##### error

```python
logger.error(msg: str)
```

**描述：** 输出错误信息

##### exception

```python
logger.exception(msg: str)
```

**描述：** 输出异常信息（包含堆栈）

##### progress

```python
logger.progress(current: int, total: int, job_name: str = None, job_params: str = None)
```

**描述：** 输出进度信息

## 函数

### get_logger

```python
from FQBase.Core.logger import get_logger

logger = get_logger(name: str = 'FQData')
```

**描述：** 获取 FQLogger 实例（线程安全）

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| name | str | 否 | 'FQData' | Logger 名称 |

**返回：** `FQLogger` 实例

---

### init_logging

```python
from FQBase.Core.logger import init_logging

init_logging(config_path: str = None)
```

**描述：** 显式初始化日志系统

**参数：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| config_path | str | 否 | None | 日志配置文件路径 |

---

## 环境变量

| 变量 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| FQ_LOGGING_CONFIG | str | - | 日志配置文件路径 |
| FQ_LOG_DIR | str | ~/.fqdata/logs | 日志文件存储目录 |

---

## 相关文档

- [使用指南](./usage.md)
- [配置指南](./configuration.md)
