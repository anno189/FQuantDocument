# Logger API 参考

**模块路径**: `FQBase.Core.logger`
**源码**: [logger.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/logger.py)

---

## 一、FQL logger 类

### `FQLogger.__init__(name: str)`

初始化 Logger 实例。

| 参数 | 类型 | 说明 |
|------|------|------|
| `name` | `str` | Logger 名称 |

### `FQLogger.initialize(config_path: str = None)`

显式初始化日志系统（类方法，线程安全）。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `config_path` | `str` | `None` | 日志配置文件路径 |

**配置路径优先级**:
1. `config_path` 参数
2. `FQ_LOGGING_CONFIG` 环境变量
3. `{FQBase}/Config/logging.yaml`

### `FQLogger.debug(msg: str)`

输出调试信息。

### `FQLogger.info(msg: str)`

输出普通信息。

### `FQLogger.warning(msg: str)`

输出警告信息。

### `FQLogger.error(msg: str)`

输出错误信息。

### `FQLogger.exception(msg: str)`

输出异常信息（自动包含堆栈）。

### `FQLogger.progress(current: int, total: int, job_name: str = None, job_params: str = None)`

输出进度信息。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `current` | `int` | - | 当前进度序号 |
| `total` | `int` | - | 总数 |
| `job_name` | `str` | `None` | 任务名称 |
| `job_params` | `str` | `None` | 任务参数 |

**输出示例**:
```
The 1 of Total 1216， PROGRESS 0.08%
##JOB04 Now Saving INDEX_DAY==== 000000 from 2026-03-24 to 2026-03-25
```

---

## 二、便捷函数

### `init_logging(config_path: str = None)`

显式初始化日志系统。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `config_path` | `str` | `None` | 日志配置文件路径 |

### `get_logger(name: str = 'FQData') -> FQLogger`

获取 FQLogger 实例（线程安全）。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | `str` | `'FQData'` | Logger 名称 |

**返回值**: FQLogger 实例

---

## 三、环境变量

| 变量名 | 说明 |
|--------|------|
| `FQ_LOGGING_CONFIG` | 日志配置文件路径 |
| `FQ_LOG_DIR` | 日志文件目录（默认 `~/.fqdata/logs`） |

---

## 四、相关文档

| 文档 | 说明 |
|------|------|
| [framework.md](framework.md) | 框架概述 |
| [architecture.md](architecture.md) | 架构设计 |
| [design.md](design.md) | 设计决策 |
| [usage.md](usage.md) | 使用指南 |
| [best-practices.md](best-practices.md) | 最佳实践 |
