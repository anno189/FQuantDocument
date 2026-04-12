# Logger 设计文档

**模块路径**: `FQBase.Core.logger`
**源码**: [logger.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/logger.py)

---

## 一、多实例单例模式

```python
class FQLogger:
    _instances: Dict[str, 'FQLogger'] = {}  # 类级别实例缓存

    def __init__(self, name: str):
        self._name = name
        self._logger = logging.getLogger(name)  # 委托给标准库
```

**决策**: 使用类变量存储实例缓存，实现按 name 单例，每个 name 对应一个 FQLogger 实例。

---

## 二、双重检查锁定

```python
def get_logger(name: str = 'FQData') -> FQLogger:
    # 第一次检查 - 减少锁竞争
    if name not in FQLogger._instances:
        with FQLogger._instances_lock:
            if name not in FQLogger._instances:
                FQLogger._instances[name] = FQLogger(name)
    return FQLogger._instances[name]
```

**决策**: 双重检查锁定 (DCL) 减少锁竞争，提高并发性能。

---

## 三、懒加载初始化

```python
def get_logger(name: str = 'FQData') -> FQLogger:
    FQLogger.initialize()  # 首次使用时初始化
    ...
```

**决策**: 首次使用时才初始化，延迟加载，避免启动开销。

---

## 四、自动降级配置

```python
if os.path.exists(cls._config_path):
    try:
        logging.config.dictConfig(config)
    except Exception as e:
        cls._setup_default_logging()  # 降级到默认配置
else:
    cls._setup_default_logging()
```

**决策**: 配置加载失败时自动降级到默认配置，确保日志功能可用。

---

## 五、第三方库日志控制

```python
for logger_name in ['pymongo', 'asyncio', 'matplotlib']:
    logging.getLogger(logger_name).setLevel(logging.INFO)
```

**决策**: 自动设置第三方库日志级别，避免噪音日志干扰。
