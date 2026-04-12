# Logger 最佳实践

**模块路径**: `FQBase.Core.logger`
**源码**: [logger.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/logger.py)

---

## 一、日志级别使用

```python
logger.debug("调试信息")    # 仅调试时输出
logger.info("普通信息")     # 正常运行时输出
logger.warning("警告信息")  # 警告信息
logger.error("错误信息")    # 错误已发生
logger.exception("异常")    # 异常信息（包含堆栈）
```

---

## 二、日志消息格式

```python
# 推荐：结构化消息
logger.info(f"行情获取完成: code={code} count={len(data)} duration={elapsed:.2f}s")

# 不推荐：模糊消息
logger.info("数据获取完成")
```

---

## 三、异常记录

```python
try:
    data = fetch_data(code)
except Exception:
    logger.exception(f"获取 {code} 数据失败")
    raise
```

---

## 四、配置化管理

```python
# logging.yaml
version: 1
disable_existing_loggers: false

formatters:
  default:
    format: '[%(asctime)s] %(levelname)s [%(name)s:%(lineno)d] %(message)s'
    datefmt: '%Y-%m-%d %H:%M:%S'

handlers:
  console:
    class: logging.StreamHandler
    formatter: default
    stream: ext://sys.stdout

  file:
    class: logging.handlers.RotatingFileHandler
    formatter: default
    filename: /var/log/fquant/fquant.log
    maxBytes: 10485760  # 10MB
    backupCount: 5

loggers:
  MarketData:
    level: DEBUG
    handlers: [console, file]

root:
    level: INFO
    handlers: [console, file]
```

---

## 五、多环境配置

```python
import os
from FQBase.Core import init_logging

env = os.getenv('ENV', 'development')

config_map = {
    'development': '/opt/fquant/config/dev-logging.yaml',
    'staging': '/opt/fquant/config/staging-logging.yaml',
    'production': '/etc/fquant/logging.yaml',
}

init_logging(config_map.get(env, '/opt/fquant/config/dev-logging.yaml'))
```

---

## 六、动态日志级别

```python
import logging
from FQBase.Core import get_logger

logger = get_logger('MarketData')

# 调试时临时设置 DEBUG 级别
logger._logger.setLevel(logging.DEBUG)

# 生产时恢复 INFO
logger._logger.setLevel(logging.INFO)
```
