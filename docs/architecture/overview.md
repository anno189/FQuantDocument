---
title: 系统架构总览
---

# FQuant 系统架构总览

## 架构分层图

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FQuant.Server                               │
├────────────────┬────────────────┬────────────────┬────────────────┤
│    FQConfig    │    FQCore      │   FQDataSource │   FQDataStore │
│   (配置中心)     │   (核心抽象层)   │   (数据源适配)   │   (存储适配)   │
├────────────────┴────────────────┴────────────────┴────────────────┤
│                      FQDataStruct                                │
│                      (数据结构层)                                  │
├──────────────────────────────────────────────────────────────────┤
│                         FQAlgorithm                              │
│              (算法体系: 指标 + 因子 + 过滤器 + 信号)                │
├──────────────────────────────────────────────────────────────────┤
│                         FQMarket                                 │
│              (市场层: 策略 + 回测 + 实时分析)                       │
├──────────────────────────────────────────────────────────────────┤
│                         FQServer                                 │
│                   (服务层: Celery + Flask)                       │
├──────────────────────────────────────────────────────────────────┤
│                      FQNotification                             │
│                      (通知服务: 微信/Server酱)                     │
├──────────────────────────────────────────────────────────────────┤
│                         FQUtil                                   │
│                    (跨模块工具: 日志/异常/指标)                      │
└──────────────────────────────────────────────────────────────────┘
```

## 核心模块说明

### ✅ FQBase - 基础模块（已完成）

| 模块 | 说明 | 状态 |
|-----|------|------|
| **FQConfig** | 配置中心：路径、市场常量、Redis、日志配置 | ✅ 已完成 |
| **FQCore** | 核心抽象：数据结构基类、验证器、缓存、事件总线、转换器 | ✅ 已完成 |
| **FQDataSource** | 数据源抽象：TdxAdapter、AkShareAdapter、EFinanceAdapter | ✅ 已完成 |
| **FQDataStore** | 存储抽象：MongoDBAdapter、RedisAdapter、连接池、事务管理 | ✅ 已完成 |
| **FQDataStruct** | 数据结构：Stock、Index、Future、Bond、Block、Financial | ✅ 已完成 |
| **FQDate** | 日期算法：交易日判断、时间戳转换（8555个交易日数据） | ✅ 已完成 |
| **FQNotification** | 通知服务：企业微信、Server酱、PushBear | ✅ 已完成 |
| **FQUtil** | 跨模块工具：统一日志、异常处理、编解码、并行计算、SQL工具 | ✅ 已完成 |

### ✅ FQAlgorithm - 算法体系（已完成）

| 模块 | 说明 | 状态 |
|-----|------|------|
| **Indicators** | 指标库：趋势(MA,MACD)、动量(KDJ,RSI)、波动(BOLL,ATR,CCI)、量价(OBV) | ✅ 已完成 |
| **Factors** | 因子库：Alpha因子、风险因子、市场因子 | ✅ 已完成 |
| **Filters** | 过滤器：基类、管道、价格/成交量/技术/风险过滤器 | ✅ 已完成 |
| **Signals** | 信号生成：信号生成器、复合信号 | ✅ 已完成 |
| **Evaluators** | 评估器：绩效评估、风险指标、参数优化（遗传算法） | ✅ 已完成 |
| **preprocessing** | 数据预处理：缺失值填充、异常值处理、标准化 | ✅ 已完成 |
| **feature_engineering** | 特征工程：特征生成、特征选择 | ✅ 已完成 |
| **model_evaluator** | 模型评估：回测评估器 | ✅ 已完成 |

### 🔄 FQMarket - 市场层（部分完成）

| 模块 | 说明 | 状态 |
|-----|------|------|
| **StrategyPools** | 策略池：55+策略文件（sp_*, bs_*） | ✅ 已完成 |
| **Simulate** | 回测系统：CPoolsSimulate 回测引擎 | ✅ 已完成 |
| **FQUtil/Tools** | 工具模块：BBlock、MonitorMarket、ToolsGetData 等 | ✅ 已完成 |
| **AnalysisTools** | 分析工具：市场数据、概念数据、行业数据等 | ✅ 已完成 |

### ✅ FQServer - 服务层（已完成）

| 模块 | 说明 | 状态 |
|-----|------|------|
| **Celery** | 任务调度：15个定时任务、支持 tasks.yaml 多环境配置 | ✅ 已完成 |
| **Flask** | API服务：K线图表等 | ✅ 已完成 |
| **FileSync** | 文件同步服务 | ✅ 已完成 |
| **FTP** | FTP服务 | ✅ 已完成 |

### 🔄 FQFactor - 因子层（已完成）

| 模块 | 说明 | 状态 |
|-----|------|------|
| **Indicator** | 25个技术指标：MACD、KDJ、RSI、BOLL、BIAS等 | ✅ 已完成 |
| **BaseFunction** | 公共函数库 | ✅ 已完成 |
| **Analysis** | 分析工具 | ✅ 已完成 |

### 🔄 FQData - 数据层（已完成）

| 模块 | 说明 | 状态 |
|-----|------|------|
| **QAData** | 数据结构：QADataStruct、base_datastruct | ✅ 已完成 |
| **QAFetch** | 数据获取：QATdx、AkShare、同花顺等 | ✅ 已完成 |
| **QASU** | 数据存储：save_tdx、save_financialfiles 等 | ✅ 已完成 |
| **QAUtil** | 工具层：日期、代码转换、缓存等 | ✅ 已完成 |

## 项目目录结构

```
FQuant.Server/
├── FQBase/                      # ✅ 基础模块
│   ├── FQBase/
│   │   ├── FQConfig/           # ✅ 配置中心
│   │   ├── FQCore/             # ✅ 核心抽象
│   │   ├── FQDataSource/       # ✅ 数据源适配
│   │   ├── FQDataStore/        # ✅ 存储适配
│   │   ├── FQDataStruct/       # ✅ 数据结构
│   │   ├── FQDate/             # ✅ 日期算法
│   │   ├── FQNotification/     # ✅ 通知服务
│   │   ├── FQUtil/             # ✅ 工具库
│   │   └── FQAlgorithm/        # ✅ 算法体系
│   └── setup.py
│
├── FQData/                       # ✅ 数据层
│   ├── FQData/
│   │   ├── QAData/            # 数据结构
│   │   ├── QAFetch/           # 数据获取
│   │   ├── QASU/              # 数据存储
│   │   └── QAUtil/            # 工具层
│   └── requirements.txt
│
├── FQFactor/                     # ✅ 因子层
│   ├── FQFactor/
│   │   ├── Indicator/         # 25个技术指标
│   │   ├── Factor/            # 因子
│   │   ├── Analysis/          # 分析工具
│   │   └── BaseFunction.py    # 公共函数
│   └── requirements.txt
│
├── FQMarket/                     # 🔄 市场层
│   ├── FQMarket/
│   │   ├── FQUtil/            # 工具模块
│   │   ├── StrategyPools/     # 55+策略文件
│   │   ├── Simulate/          # 回测系统
│   │   └── RealTime/          # 实时分析
│   └── requirements.txt
│
├── FQServer/                     # ✅ 服务层
│   ├── Celery/                 # Celery任务
│   ├── Flask/                   # Flask API
│   ├── FileSync/               # 文件同步
│   └── FTP/                    # FTP服务
│
├── FQAlgorithm/                  # ✅ 算法体系
├── docs/                         # 设计文档
└── .env                          # 环境变量
```

## 技术栈

| 类别 | 技术 |
|-----|------|
| **语言** | Python 3.11+ |
| **数据处理** | pandas, numpy |
| **数据库** | MongoDB, Redis |
| **任务调度** | Celery |
| **Web服务** | Flask |
| **数据源** | Tdx (通达信), AkShare, EFinance, 同花顺 |
| **量化指标** | TALib (可选), pandas-ta |
| **配置管理** | YAML, dotenv |
| **日志** | logging.yaml |

## 实施阶段

| 阶段 | 内容 | 状态 |
|-----|------|------|
| 阶段一 | 基础设施重构（FQConfig/FQCore/FQUtil） | ✅ 已完成 |
| 阶段二 | 数据源与存储抽象（FQDataSource/FQDataStore） | ✅ 已完成 |
| 阶段三 | 算法体系重构（FQAlgorithm） | ✅ 已完成 |
| 阶段四 | 回测系统增强 | 🔄 进行中 |
| 阶段五 | 预警与复盘系统（FQAlert/FQReport） | 🔄 未开始 |
| 阶段六 | 任务调度与API服务 | 🔄 未开始 |
| 阶段七 | FQMarket 工具层重构 | 🔄 未开始 |
| 阶段八 | FQData 数据层重构 | 🔄 未开始 |