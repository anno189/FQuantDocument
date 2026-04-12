# Logging 配置文档

**文件路径**: `FQBase/Config/core/logging.yaml`
**源码**: [logging.yaml](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Config/core/logging.yaml)

---

## 一、概述

`logging.yaml` 是 FQuant 框架的**统一日志配置**文件，基于 Python `logging.config.dictConfig` 标准格式。

**解决的问题**：
- 日志格式不统一
- 日志输出位置混乱
- 日志级别难以管理
- 缺乏日志轮转机制

---

## 二、配置结构

```yaml
version: 1                    # 必须为 1
disable_existing_loggers: false # 保留现有 logger

formatters:                   # 日志格式
  default: ...
  detailed: ...
  json: ...
  simple: ...

handlers:                      # 日志处理器
  console: ...
  file: ...
  error_file: ...

loggers:                      # 模块 logger
  FQData: ...
  FQMarket: ...

root:                         # 根 logger
  level: INFO
  handlers: [console, file, error_file]
```

---

## 三、Formatters（格式化器）

| 名称 | 格式 | 用途 |
|------|------|------|
| `default` | `[时间] 级别 [模块:行号] 消息` | 默认控制台输出 |
| `detailed` | `[时间] 级别 [模块.函数:行号] 消息` | 详细文件输出 |
| `json` | JSON 格式 | 结构化日志 |
| `simple` | 仅消息 | 简单输出 |

### 3.1 格式说明

| 占位符 | 说明 | 示例 |
|--------|------|------|
| `%(asctime)s` | 时间戳 | `2024-01-15 10:30:00` |
| `%(levelname)s` | 日志级别 | `INFO`, `DEBUG` |
| `%(name)s` | Logger 名称 | `FQData` |
| `%(lineno)d` | 行号 | `42` |
| `%(funcName)s` | 函数名 | `fetch_data` |
| `%(message)s` | 日志消息 | `获取数据成功` |

---

## 四、Handlers（处理器）

| 名称 | 类型 | 输出 | 级别 |
|------|------|------|------|
| `console` | StreamHandler | 控制台 (stdout) | INFO |
| `file` | RotatingFileHandler | ../../logs/fquant.log | DEBUG |
| `error_file` | RotatingFileHandler | ../../logs/error.log | ERROR |

### 4.1 RotatingFileHandler 参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `maxBytes` | 10485760 (10MB) | 单文件最大大小 |
| `backupCount` | 5 | 保留的备份文件数 |

**轮转规则**：
- 当文件达到 10MB 时，自动轮转
- 保留 5 个备份文件 (fquant.log.1 ~ fquant.log.5)
- 超过 5 个时，删除最旧的

---

## 五、Loggers（模块日志器）

| 模块 | 级别 | 处理器 | 说明 |
|------|------|--------|------|
| `FQData` | DEBUG | console, file | 数据模块 |
| `FQMarket` | DEBUG | console, file | 市场模块 |
| `FQServer` | DEBUG | console, file | 服务器模块 |
| `FQFactor` | DEBUG | console, file | 因子模块 |
| `celery` | INFO | console, file | Celery 任务 |
| `pymongo` | INFO | console | MongoDB 驱动 |
| `asyncio` | INFO | console | 异步框架 |
| `matplotlib` | INFO | console | 绘图库 |
| `FQWorker` | DEBUG | console | Worker 模块 |
| `root` | INFO | console, file, error_file | 根日志器 |

---

## 六、日志级别

| 级别 | 值 | 用途 |
|------|-----|------|
| `DEBUG` | 10 | 调试信息 |
| `INFO` | 20 | 普通信息 |
| `WARNING` | 30 | 警告信息 |
| `ERROR` | 40 | 错误信息 |
| `CRITICAL` | 50 | 严重错误 |

---

## 七、日志文件位置

| 文件 | 说明 |
|------|------|
| `../../logs/fquant.log` | 主日志文件 |
| `../../logs/error.log` | 错误日志（仅 ERROR 及以上） |

**路径说明**：
- 相对于 `{FQuant}/Config/core/` 目录
- 实际路径为 `{FQuant}/logs/fquant.log`

---

## 八、使用方式

### 8.1 Python 代码加载

```python
import logging.config
import yaml

with open('FQBase/Config/core/logging.yaml', 'r') as f:
    config = yaml.safe_load(f)
    logging.config.dictConfig(config)
```

### 8.2 环境变量配置

```python
import os
os.environ['FQ_LOGGING_CONFIG'] = '/path/to/logging.yaml'
```

---

## 九、自定义配置

### 9.1 添加新的 Formatter

```yaml
formatters:
  custom:
    format: '[%(asctime)s] [%(name)s] %(levelname)s: %(message)s'
    datefmt: '%Y-%m-%d %H:%M:%S'
```

### 9.2 添加新的 Handler

```yaml
handlers:
  syslog:
    class: logging.handlers.SysLogHandler
    level: WARNING
    formatter: default
    address: ['localhost', 514]
```

### 9.3 修改模块日志级别

```yaml
loggers:
  FQData:
    level: DEBUG  # 改为 DEBUG 获取更详细日志
```

---

## 十、最佳实践

| 实践 | 说明 |
|------|------|
| 生产环境使用 `INFO` | 减少日志量 |
| 开发环境使用 `DEBUG` | 获取详细信息 |
| 定期清理日志 | 使用 logrotate 或 backupCount |
| 监控 ERROR 日志 | 及时发现问题 |
| 结构化日志 | 生产环境使用 JSON 格式 |
