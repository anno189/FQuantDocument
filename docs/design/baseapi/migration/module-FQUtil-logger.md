# module-FQUtil-logger.md

# 模块迁移报告: FQUtil-logger

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **模块名称** | QUANTAXIS.QAUtil.QALogs | FQUtil.logger |
| **原文件** | `_bak/server/FQData/FQData/QAUtil/QALogs.py` | `FQBase/FQBase/FQUtil/logger.py` |
| **功能** | 日志记录工具 | 统一日志系统 |

## 迁移对比

### 原实现 (QALogs.py)

```python
# 使用 zenlog 第三方库
from zenlog import logging

def QA_util_log_debug(logs, ui_log=None, ui_progress=None):
    logging.debug(logs)

def QA_util_log_info(logs, ui_log=None, ui_progress=None, ui_progress_int_value=None):
    logging.info(logs)
    # UI日志支持
    if ui_log is not None:
        if isinstance(logs, str):
            ui_log.emit(logs)
        if isinstance(logs, list):
            for iStr in logs:
                ui_log.emit(iStr)
    # 进度支持
    if ui_progress is not None and ui_progress_int_value is not None:
        ui_progress.emit(ui_progress_int_value)

def QA_util_log_expection(logs, ui_log=None, ui_progress=None):
    logging.exception(logs)
```

### 迁移后 (logger.py)

```python
# 使用标准库 logging
from FQUtil.logger import get_logger, FQLogger

# 兼容旧接口
def FQ_util_log_debug(logs, ui_log=None, ui_progress=None):
    _logger = logging.getLogger('FQData')
    _logger.debug(logs)

def FQ_util_log_info(logs, ui_log=None, ui_progress=None, ui_progress_int_value=None):
    _logger = logging.getLogger('FQData')
    _logger.info(logs)
    # UI日志和进度支持...

# 新增面向对象接口
class FQLogger:
    """统一的日志记录器 - 单例模式"""
    def debug(self, msg: str): ...
    def info(self, msg: str): ...
    def warning(self, msg: str): ...
    def error(self, msg: str): ...
    def exception(self, msg: str): ...
    def progress(self, current: int, total: int, job_name: str = None, job_params: str = None): ...
```

## 功能差异

| 功能 | 原实现 | 迁移后 |
|------|--------|--------|
| 日志级别 | debug, info, exception | debug, info, warning, error, exception |
| UI日志支持 | ✅ `ui_log.emit()` | ✅ `ui_log.emit()` |
| 进度输出 | ✅ `ui_progress.emit()` | ✅ 增强的 `progress()` 方法 |
| 日志文件 | ❌ 无 | ✅ RotatingFileHandler (10MB轮转) |
| YAML配置 | ❌ 无 | ✅ `logging.yaml` |
| 单例模式 | ❌ 函数式 | ✅ `FQLogger` 类 |
| 第三方依赖 | zenlog | 无 |

## 进度输出对比

### 原实现
```python
if ui_progress is not None and ui_progress_int_value is not None:
    ui_progress.emit(ui_progress_int_value)  # 只能输出整数进度值
```

### 迁移后 - 增强的 progress() 方法
```python
def progress(self, current: int, total: int, job_name: str = None, job_params: str = None):
    percent = (current / total * 100) if total > 0 else 0
    self._logger.warning(f"The {current} of Total {total}， PROGRESS {percent:.2f}%")
    if job_name:
        if job_params:
            self._logger.warning(f"{job_name} {job_params}")
        else:
            self._logger.warning(job_name)
```

**示例输出**:
```
The 0 of Total 1216， PROGRESS 0.00%
The 1 of Total 1216， PROGRESS 0.08%
##JOB04 Now Saving INDEX_DAY==== 000001 from 2026-03-24 to 2026-03-25
```

## 文件结构

```
FQBase/FQBase/
├── FQUtil/
│   └── logger.py          # 统一日志系统 (本模块)
└── FQConfig/
    └── logging.yaml       # 日志配置文件
```

## 相关文件

- [logger.py](../../FQBase/FQBase/FQUtil/logger.py) - 本模块
- [logging.yaml](../../FQBase/FQBase/FQConfig/logging.yaml) - 日志配置
- [tools.py](module-FQUtil-tools.md) - 工具模块
- [sql.py](module-FQUtil-sql.md) - 数据库工具
- [parallel.md](module-FQUtil-parallel.md) - 并行计算

## 迁移状态

| 项目 | 状态 |
|------|------|
| **功能完整性** | ✅ 完成 |
| **向后兼容** | ✅ 提供 `FQ_util_log_*` 兼容接口 |
| **API文档** | ✅ Docstring完整 |
| **测试覆盖** | ⏳ 待补充 |
| **第三方依赖移除** | ✅ 用标准logging替代zenlog |

## 使用示例

### 新接口 (推荐)
```python
from FQUtil.logger import get_logger

logger = get_logger(__name__)
logger.info("Info message")
logger.warning("Warning message")
logger.progress(0, 100, "Job Name", "params")
```

### 兼容旧接口
```python
from FQUtil.logger import FQ_util_log_info

FQ_util_log_info("message", ui_log=ui_log, ui_progress=ui_progress)
```
