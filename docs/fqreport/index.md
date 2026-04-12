---
title: FQReport 盘后复盘
---

# FQReport 盘后复盘

FQReport 是盘后复盘系统，提供涨停复盘、主线复盘、策略复盘、龙虎榜复盘等功能。

## 目录结构

```
FQReport/
├── generators/             # 报告生成器
│   ├── limit_up_report.py   # 涨停复盘
│   ├── main_block_report.py # 主线复盘
│   ├── strategy_report.py   # 策略复盘
│   └── lhb_report.py       # 龙虎榜复盘
├── templates/             # 报告模板
│   └── post_market_report.html
├── storage.py            # 报告存储
├── comparison.py          # 报告对比
├── subscription.py       # 报告订阅
└── scheduler.py          # 复盘调度器
```

## 复盘内容

### 1. 涨停复盘

- 涨停时间分布
- 封板率/炸板率
- 明日开盘预期达成率

### 2. 主线板块复盘

- 主线识别准确率
- 板块切换分析
- 资金流向统计

### 3. 策略表现复盘

- 持仓个股表现
- 买入/卖出点评估
- vs 基准收益对比

### 4. 龙虎榜复盘

- 营业部表现统计
- 正/负反馈验证
- 历史准确率追踪

## 子模块

- [涨停复盘](fqreport/limitup) - 涨停数据分析
- [主线复盘](fqreport/mainblock) - 主线板块分析
- [龙虎榜复盘](fqreport/lhb) - 龙虎榜数据复盘
- [策略复盘](fqreport/strategy) - 策略表现分析