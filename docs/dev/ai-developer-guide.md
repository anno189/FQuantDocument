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

### 3.3 开发原则（必须遵守）

> **FQuant 项目本身就是一个迁移、创建和重构的过程，所有的模块都可以重构。**
> 
> **但每个新创建、重构或迁移的功能，都必须重新测试。**

#### 规则 1：重构无畏，测试必行

```python
# ✅ 正确：可以大胆重构
class OldAdapter:
    pass

# → 重构为 →
class NewAdapter:
    pass

# ⚠️ 但重构后必须：
# 1. 编写或更新测试用例
# 2. 运行测试验证功能正常
# 3. 确认测试覆盖核心场景
```

#### 规则 2：测试驱动重构

| 重构阶段 | 任务 | 测试要求 |
|---------|------|---------|
| 重构前 | 确认现有测试通过 | ✅ 必须 |
| 重构中 | 保持接口兼容 | 增量测试 |
| 重构后 | 新测试验证 | ✅ 必须 |

#### 规则 3：风险评估而非风险回避

| 评估维度 | 考虑因素 |
|---------|---------|
| 收益 | 代码减少、复杂度降低、可维护性提升 |
| 成本 | 改动范围、测试工作量 |
| 风险 | 影响范围、可回滚难度 |

**决策原则**：收益 > 成本 时，坚决重构

#### 规则 4：小步快跑，逐步验证

- 大型重构拆分为多个小步骤
- 每步完成后验证功能正常
- 出现问题可快速定位和回滚

---

### 3.4 常用导入路径

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
| 北交所 | 北交所官网 | 代码北交所官网，数据通达信获取 |
| 指数 | 通达信 | EX连接 |
| 期货 | 通达信 | EX连接 |
| 债券 | 通达信 | EX连接 |

#### 4.4.1 通达信市场 ID 配置

> **重要**：以下配置来自通达信官方文档，是 EX 市场数据获取的核心参数

```python
"""
通达信市场 ID 配置表
market: 市场ID
category: 分类ID
name: 市场名称
short_name: 简称
"""

## 期权 OPTION
# market=4  category=12  郑州商品期权  OZ
# market=5  category=12  大连商品期权  OD
# market=6  category=12  上海商品期权  OS
# market=7  category=12  中金所期权    OJ
# market=8  category=12  上海股票期权  QQ
# market=9  category=12  深圳股票期权

## 汇率 EXCHANGERATE
# market=10 category=4   基本汇率      FE
# market=11 category=4   交叉汇率      FX

## 全球 GLOBALMARKET
# market=37 category=11 全球指数(静态) FW
# market=12 category=5  国际指数      WI
# market=13 category=3  国际贵金属     GO
# market=14 category=3  伦敦金属      LM
# market=15 category=3  伦敦石油      IP
# market=16 category=3  纽约商品      CO
# market=17 category=3  纽约石油      NY
# market=18 category=3  芝加哥谷      CB
# market=19 category=3  东京工业品    TO
# market=20 category=3  纽约期货      NB
# market=77 category=3  新加坡期货    SX
# market=39 category=3  马来期货      ML

## 港股 HKMARKET
# market=27 category=5  香港指数      FH
# market=31 category=2  香港主板      KH
# market=48 category=2  香港创业板    KG
# market=49 category=2  香港基金      KT
# market=43 category=1  B股转H股      HB

## 期货现货
# market=42 category=3  商品指数      TI
# market=60 category=3  主力期货合约  MA
# market=28 category=3  郑州商品      QZ
# market=29 category=3  大连商品      QD
# market=30 category=3  上海期货      QS
# market=46 category=11 上海黄金      SG
# market=47 category=3  中金所期货    CZ
# market=50 category=3  渤海商品      BH
# market=76 category=3  齐鲁商品      QL

## 基金
# market=33 category=8  开放式基金    FU
# market=34 category=9  货币型基金    FB
# market=35 category=8  招商理财产品  LC
# market=36 category=9  招商货币产品  LB
# market=56 category=8  阳光私募基金  TA
# market=57 category=8  券商集合理财  TB
# market=58 category=9  券商货币理财  TC

## 美股 USA STOCK
# market=74 category=13 美国股票      US
# market=40 category=11 中国概念股    CH
# market=41 category=11 美股知名公司  MG

## 其他
# market=38 category=10 宏观指标      HG
# market=44 category=1  股转系统      SB
# market=54 category=6  国债预发行    GY
# market=62 category=5  中证指数      ZZ
# market=70 category=5  扩展板块指数  UZ
# market=71 category=2  港股通        GH
```

#### 4.4.2 市场 ID 速查表

| 市场类型 | market ID | category ID | 说明 |
|---------|-----------|-------------|------|
| 港股主板 | 31 | 2 | |
| 港股创业板 | 48 | 2 | |
| 港股基金 | 49 | 2 | |
| 香港指数 | 27 | 5 | |
| 期权(商品) | 4-7 | 12 | 郑州/大连/上海商品/中金所 |
| 期权(股票) | 8-9 | 12 | 上海/深圳股票期权 |
| 基本汇率 | 10 | 4 | |
| 交叉汇率 | 11 | 4 | |
| 宏观指标 | 38 | 10 | |
| 美股 | 74 | 13 | |
| 中国概念股 | 40 | 11 | |
| 美股知名公司 | 41 | 11 | |
| 期货(郑州) | 28 | 3 | |
| 期货(大连) | 29 | 3 | |
| 期货(上海) | 30 | 3 | |
| 期货(中金所) | 47 | 3 | |
| 上海黄金 | 46 | 11 | |
| 基金(开放) | 33 | 8 | |
| 基金(货币) | 34 | 9 | |

#### 4.4.3 A股主板/指数市场代码映射

> 以下映射用于确定股票和指数对应的主板市场 (SH/SZ/BJ)

```python
# 股票市场代码 (_select_market_code)
# 返回值: 0=SZ(深圳), 1=SH(上海), 2=BJ(北京)
def _select_market_code(code):
    code = str(code)
    if code[:2] in ['43', '83', '87', '92']:  # 北交所
        return 2
    if code[0] in ['5', '6', '9'] or code[:3] in ["009", "110", "111", "113", "118", "132", "201", "202", "203", "204"]:
        return 1  # 上海
    return 0  # 深圳

# 指数市场代码 (_select_index_code)
# 返回值: 0=SZ(深圳), 1=SH(上海), 2=BJ(北京)
def _select_index_code(code):
    code = str(code)
    if (code[0] == '3') | (code[0:3] in ['123', '127', '128']):
        return 0  # 深圳
    return 1  # 上海

# 债券市场代码 (_select_bond_market_code)
def _select_bond_market_code(code):
    code = str(code)
    if code[0:3] in ['101', '104', '105', '106', '107', '108', '109',
                     '112', '114', '115', '116', '117', '119', '110', '111', '113', '118',
                     '131', '139']:
        return 0  # 深圳
    return 1  # 上海
```

| 代码前缀 | 市场 | 说明 |
|---------|------|------|
| 0, 3, 2 | SZ(深圳) | 主板、中小板、创业板 |
| 6, 5, 9 | SH(上海) | 主板、科创板、B股 |
| 4 | BJ(北交所) | 北交所 |
| 43, 83, 87, 92 | BJ(北交所) | 北交所 |
| 1(债券) | SH(上海) | 上海债券 |
| 0(债券) | SZ(深圳) | 深圳债券 |

#### 4.4.4 频率类型映射

> 以下映射用于 K 线数据的频率参数

```python
def _select_type(frequence):
    """将人类可读的频率转换为通达信 category"""
    if frequence in ['day', 'd', 'D', 'DAY', 'Day']:
        return 9    # 日线
    elif frequence in ['w', 'W', 'Week', 'week']:
        return 5    # 周线
    elif frequence in ['month', 'M', 'm', 'Month']:
        return 6    # 月线
    elif frequence in ['Q', 'Quarter', 'q']:
        return 10   # 季线
    elif frequence in ['y', 'Y', 'year', 'Year']:
        return 11   # 年线
    elif str(frequence) in ['5', '5m', '5min', 'five']:
        return 0    # 5分钟
    elif str(frequence) in ['1', '1m', '1min', 'one']:
        return 8    # 1分钟
    elif str(frequence) in ['15', '15m', '15min', 'fifteen']:
        return 1    # 15分钟
    elif str(frequence) in ['30', '30m', '30min', 'half']:
        return 2    # 30分钟
    elif str(frequence) in ['60', '60m', '60min', '1h']:
        return 3    # 60分钟
    return 9  # 默认日线
```

| 频率 | category | 说明 |
|------|----------|------|
| 1min | 8 | 1分钟线 |
| 5min | 0 | 5分钟线 |
| 15min | 1 | 15分钟线 |
| 30min | 2 | 30分钟线 |
| 60min | 3 | 60分钟线 |
| day | 9 | 日线 |
| week | 5 | 周线 |
| month | 6 | 月线 |
| quarter | 10 | 季线 |
| year | 11 | 年线 |

#### 4.4.5 IP 连接类型

> 通达信数据源分为两种连接类型

| 连接类型 | 用途 | 端口 | 示例 |
|---------|------|------|------|
| HQ (行情) | A股、指数、债券 | 7709 | `TdxHq_API` |
| EX-HQ (扩展行情) | 期货、期权、港股、汇率 | 7709 | `TdxExHq_API` |

#### 4.4.6 可转债数据处理逻辑

> 可转债 (Bond2Stock) 数据根据代码前缀判断市场，深市和沪市调用不同的接口

```python
def select_bond_market_code(code):
    """判断可转债市场"""
    if str(code).startswith(('0', '1')):
        return 0  # 深圳
    return 1  # 上海

def get_bond2stock_day(code, start, end, frequence):
    if select_bond_market_code(code) == 0:  # 深圳
        return get_stock_day(code, start, end, frequence)  # 调用股票接口
    else:  # 上海
        return get_index_day(code, start, end, frequence)  # 调用指数接口
```

**深市 vs 沪市区别**：

| 市场 | 代码前缀 | 数据来源接口 |
|------|---------|-------------|
| **深圳可转债** | 0, 1 开头 | `get_stock_day` (股票接口) |
| **上海可转债** | 其他 | `get_index_day` (指数接口) |

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
| 竞价数据 | 9:15~9:25 不可获取价格，9:27 可以通过 realtime 获取 |
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
