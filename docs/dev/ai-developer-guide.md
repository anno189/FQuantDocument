---
title: AI 开发者指南
description: 专门为 AI 开发者编写的 FQuant 项目指南
tag:
  - fquant
  - ai-developer
  - guide
---

# AI 开发者指南

> **重要**：本文档专门为 AI 开发者编写，作为第一个开发者使用 FQuant 项目时的参考指南。

---

## 一、项目简介

### FQuant 是什么

FQuant 是一个**量化投资分析系统**，用于处理金融数据、构建交易策略、进行回测分析。

### 项目结构

```
FQuant.Server/
├── FQBase/           # 基础模块（工具库、基础设施）
├── FQData/           # 数据层（数据获取、存储）
├── FQFactor/         # 因子层（技术指标、因子）
├── FQMarket/         # 市场层（策略、回测）
├── FQServer/         # 服务层（API、任务调度）
└── FQAlgorithm/      # 算法体系
```

---

## 二、核心模块速览

### 2.1 FQBase（基础模块）

| 模块 | 作用 | 何时使用 |
|------|------|---------|
| **Core** | 核心组件：事件总线、日志、通知 | 需要事件驱动、日志记录、通知推送时 |
| **Foundation** | 基础组件：重试、校验、异常、单例等 | 需要基础设施支持时 |
| **Util** | 工具函数：编解码、文件、网络、并行等 | 需要通用工具时 |
| **Date** | 日期处理：时间戳、交易日历 | 需要日期/时间处理时 |
| **Config** | 配置管理：环境变量、配置文件 | 需要配置管理时 |
| **Cache** | 缓存系统：Redis、内存缓存 | 需要缓存加速时 |
| **DataStore** | 数据存储：MongoDB 客户端 | 需要数据库操作时 |
| **Crawler** | 爬虫：浏览器自动化 | 需要网页抓取时 |

### 2.2 模块选择指南

```
需要做... → 使用...
─────────────────────────────────
日志记录 → FQBase.Core.logger
事件驱动 → FQBase.Core.event_bus
发送通知 → FQBase.Core.notification
重试机制 → FQBase.Foundation.retry
输入校验 → FQBase.Foundation.validators
统一异常 → FQBase.Foundation.exceptions
日期处理 → FQBase.Date
配置读取 → FQBase.Config
数据缓存 → FQBase.Cache
数据库操作 → FQBase.DataStore
文件处理 → FQBase.Util.file
编解码 → FQBase.Util.codec
并行处理 → FQBase.Util.parallel
网络请求 → FQBase.Util.network
```

---

## 三、模块依赖关系

### 3.1 核心依赖链

```
FQBase.Util (工具层)
    ↓
FQBase.Foundation (基础层) ← FQBase.Config
    ↓
FQBase.Core (核心层) ← FQBase.Cache, FQBase.DataStore
    ↓
FQData / FQMarket / FQAlgorithm (业务层)
```

### 3.2 模块间调用规则

| 调用方向 | 允许 | 示例 |
|---------|------|------|
| Util → Foundation | ✅ | `from FQBase.Foundation.retry import retry` |
| Foundation → Core | ✅ | `from FQBase.Core.event_bus import EventBus` |
| Core → 其他 | ⚠️ 谨慎 | 避免循环依赖 |
| 上层 → 下层 | ✅ | FQData 可以调用 FQBase 任何模块 |
| 下层 → 上层 | ❌ 禁止 | Foundation 不能调用 FQData |

### 3.3 常用导入路径

```python
# Core 模块
from FQBase.Core import get_event_bus, get_logger, NotificationManager

# Foundation 模块
from FQBase.Foundation import validate, retry, FQException

# Util 模块
from FQBase.Util import bar, file, codec, parallel

# Date 模块
from FQBase.Date import QADate, get_trade_date

# Config 模块
from FQBase.Config import get_config, Env

# Cache 模块
from FQBase.Cache import get_cache

# DataStore 模块
from FQBase.DataStore import get_mongo_client
```

---

## 四、量化业务规则（重要！）

> 以下规则是 FQuant 特有的业务规则，开发时必须遵守！

### 4.1 数据过滤规则

#### 停牌日过滤
```python
# 从数据库取数时，必须过滤停牌日
# 条件：vol > 1
df = df[df['vol'] > 1]  # 过滤停牌日数据
```

#### 原因
停牌日的数据记录存在，但 O/C/H/W 为上日收盘价格，V/A 为最小浮点数。

### 4.2 涨停计算规则

```python
# 涨停计算不考虑 ST 股票
# 原因：
# 1. 暂时无法获取历史 ST 数据
# 2. 交易中不参与 ST 股票的交易
```

### 4.3 复权规则

```python
# 复权需要考虑：
# 1. 复权参数
# 2. 价格
# 3. 总股本和流通股

# 注意：
# - 价格为前复权价格，运算市值时需要使用复权数据 (values / adj)
# - 历史换手率使用流通股
# - 可流通股只能从财务报告体现，会存在滞后性
# - 目前使用流通股运算换手率
```

### 4.4 数据源规则

| 数据类型 | 数据源 | 注意事项 |
|---------|-------|---------|
| A股 | 通达信 | 标准数据源 |
| 港股 | 通达信 / Sina / Yahoo | **注意：通达信延迟15分钟** |
| 北交所 | 北交所官网 | 不能从通达信获取 |
| 指数 | 通达信 | - |
| 期货 | 通达信 | - |
| 债券 | 通达信 | - |

### 4.5 除权除息分类

| 分类ID | 含义 |
|-------|------|
| 1 | 除权除息 |
| 2 | 送配股上市 |
| 3 | 非流通股上市 |
| 4 | 未知股本变动 |
| 5 | 股本变化 |
| 6 | 增发新股 |
| 7 | 股份回购 |
| 8 | 增发新股上市 |
| 9 | 转配股上市 |
| 10 | 可转债上市 |
| 11 | 扩缩股 |
| 12 | 非流通股缩股 |
| 13 | 送认购权证 |
| 14 | 送认沽期权 |

---

## 五、已知问题和限制

### 5.1 数据问题

| 问题 | 影响 | 解决方案 |
|------|------|---------|
| stock_info 可能漏掉某日数据 | 通达信服务器问题 | 初始化时打补丁过滤 |
| 部分换手率存在错误 | 财务数据或复权导致 | 日常交易使用流通股计算 |
| stock_adj 可能漏掉当天数据 | 原因不明 | 可能导致运算错误 |
| 涨停计算可能差1分钱 | 四舍五入问题，可能先复权再算涨跌停 | - |

### 5.2 服务器数据限制

| 问题 | 说明 |
|------|------|
| 竞价数据 | 9:15~9:25 不可获取，9:27 通过 realtime 获取 |
| 近端次新 (880885) | 数据存在问题，但不影响后期运算 |
| 北交所代码 | 不能从通达信获取，需从北交所官网获取 |

---

## 六、开发规范

### 6.1 代码风格

```python
# ✅ 正确
from typing import Optional, Dict, Any
import logging

class DataProcessor:
    """数据处理器。
    
    用于处理和转换数据。
    
    Args:
        config: 配置字典
        debug: 是否启用调试模式
    """
    
    def __init__(self, config: Dict[str, Any], debug: bool = False) -> None:
        self.config = config
        self.debug = debug
        self.logger = logging.getLogger(__name__)
    
    def process(self, data: Any) -> Optional[Any]:
        """处理数据。
        
        Args:
            data: 输入数据
            
        Returns:
            处理后的数据
            
        Raises:
            ValueError: 数据无效时
        """
        if not data:
            raise ValueError("数据不能为空")
        return data

# ❌ 错误
class dp:  # 类名不符合规范
    def p(d):  # 没有类型提示
        pass
```

### 6.2 日志规范

```python
# ✅ 使用 FQBase 日志
from FQBase.Core import get_logger

logger = get_logger(__name__)

logger.info("处理开始")
logger.warning("数据可能有问题")
logger.error("处理失败", exc_info=True)

# ❌ 错误
print("debug info")  # 不使用 print
```

### 6.3 异常处理

```python
# ✅ 正确
from FQBase.Foundation import FQException

try:
    result = process_data(data)
except ValueError as e:
    logger.error(f"数据处理失败: {e}")
    raise FQException(f"处理失败: {e}") from e

# ❌ 错误
try:
    result = process_data(data)
except:  # 不捕获具体异常
    pass
```

### 6.4 数据库操作

```python
# ✅ 必须创建索引
collection.create_index([("code", 1), ("date", 1)], name="code_date_idx")

# ✅ 停牌日过滤
df = df[df['vol'] > 1]
```

---

## 七、快速参考

### 7.1 常用代码片段

```python
# 获取事件总线
from FQBase.Core import get_event_bus
event_bus = get_event_bus()

# 获取日志
from FQBase.Core import get_logger
logger = get_logger(__name__)

# 发送通知
from FQBase.Core import NotificationManager
notifier = NotificationManager()
notifier.send("标题", "内容", channel="wechat")

# 日期处理
from FQBase.Date import QADate, get_trade_date
trade_dates = QADate.get_trade_date_list("2024-01-01", "2024-12-31")

# 配置读取
from FQBase.Config import get_config
config = get_config()

# 缓存使用
from FQBase.Cache import get_cache
cache = get_cache()

# 重试装饰器
from FQBase.Foundation import retry
@retry(max_attempts=3, delay=1)
def fetch_data():
    pass
```

### 7.2 常见错误排查

| 错误 | 可能原因 | 解决方案 |
|------|---------|---------|
| 数据为空 | 可能是停牌日 | 检查 vol > 1 |
| 复权计算错误 | 没有使用 adj | values / adj |
| 涨停计算不准 | ST 股票处理问题 | 过滤 ST 股票 |
| 港股数据延迟 | 使用了通达信数据 | 考虑换用 Sina/Yahoo |
| 北交所数据获取失败 | 数据源问题 | 从北交所官网获取 |

---

## 八、文档索引

| 需要了解... | 查看文档 |
|------------|---------|
| 模块 API 用法 | `FQuantDocument/docs/fqbase/` |
| 数据处理规则 | `docs/dev/development.md` |
| 项目架构 | `docs/architecture/overview.md` |
| 数据库设计 | `docs/db/` |

---

> **AI 开发者提示**：本文档解决的核心问题 - "我不知道的东西"：
> - 这些规则在哪里定义？→ 本文档第四、五章
> - 这个函数应该什么时候用？→ 本文档第二章
> - 这个模块依赖什么？→ 本文档第三章
