---
title: datetime 日期时间模块
description: 日期时间工具模块，包含时间戳转换、日期计算、交易日判断等功能
tag:
  - fqdata
  - trade
  - datetime

summary:
  type: utility
  complexity: medium
  maturity: stable
  sub_modules:
    - timestamp
    - trade
  key_functions:
    - util_get_real_date
    - util_if_trade
    - util_get_next_trade_date
    - util_get_pre_trade_date
    - util_date_gap
  api_coverage:
    total: 51
    covered: 51
    public: 51
  features:
    has_pure_functions: true
    is_thread_safe: true
    depends_on:
      - datetime
      - pandas
  usage_scenarios:
    - "场景1：时间戳与日期字符串之间的转换"
    - "场景2：判断是否为交易日"
    - "场景3：获取前后交易日"
    - "场景4：日期计算和间隔"
  warnings:
    - "警告1：部分函数依赖静态交易日数据"
    - "警告2：仅支持上交所交易日判断"
  limitations:
    - "限制1：交易日数据需要手动更新"
    - "限制2：时区处理可能因配置不同而有差异"

relationships:
  belongs_to:
    - fquant.fqdata.trade
  depends_on:
    - datetime
    - pandas
  used_by:
    - fquant.fqdata
    - fquant.fqalgorithm

api:
  signatures:
    util_get_real_date:
      description: "获取指定日期对应的交易日"
    util_if_trade:
      description: "判断是否为交易日"
    util_get_next_trade_date:
      description: "获取下一个交易日"
    util_get_pre_trade_date:
      description: "获取前一个交易日"
    util_date_gap:
      description: "日期加减计算"
  exceptions:
    - name: ValueError
      when: "日期格式不正确"
      solution: "使用 YYYY-MM-DD 格式"
  best_practices:
    - "使用前检查日期格式"
    - "批量操作时使用 vectorized 函数"

usage:
  quick_example: |
    from FQData.Trade.datetime import util_if_trade, util_get_next_trade_date
    
    # 判断是否为交易日
    is_trade = util_if_trade('2024-01-15')
    
    # 获取下一个交易日
    next_date = util_get_next_trade_date('2024-01-15')
---

# datetime 日期时间模块

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟢 新手入门 | [README](./README.md) → [快速入门](./quick-start.md) → [使用指南](./usage.md) → [案例库](./examples.md) |
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) |
| 🟡 运维/安全 | [README](./README.md) → [技术架构](./architecture.md) → [故障排查](./troubleshooting.md) → [常见问题](./faq.md) |
| 📚 案例库 | **[案例库](./examples.md)** |
| 📖 索引 | [README](./README.md) → [变更日志](./changelog.md) |


## 一句话总览

📌 **日期时间工具模块，提供时间戳转换、交易日判断、日期计算等功能**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 时间戳与日期字符串之间的转换
- 判断是否为交易日
- 获取前后交易日
- 日期计算和间隔

❌ **不应该使用**：
- 需要动态获取最新交易日数据
- 需要判断除上交所外的其他市场交易日

### 注意事项

1. **部分函数依赖静态交易日数据**
   - 说明：trade_dates_data.py 包含上交所历史交易日数据

2. **仅支持上交所交易日判断**
   - 说明：其他市场的交易日可能不同

### 已知限制

- 交易日数据需要手动更新
- 时区处理可能因配置不同而有差异

**TL;DR**：
- 核心能力：时间戳转换、交易日判断、日期计算
- 入门难度：🟢 简单
- 依赖：datetime、pandas

## 子模块概览

| 子模块 | 说明 | 文档 |
|--------|------|------|
| timestamp.py | 时间戳转换工具 | - |
| trade.py | 交易日工具 | - |

## 快速链接

| 文档 | 说明 |
|------|------|
| [快速入门](./quick-start.md) | 5分钟快速上手 |
| [API参考](./api.md) | API参考文档 |
| [使用指南](./usage.md) | 详细使用指南 |
| [最佳实践](./best-practices.md) | 最佳实践 |
| [故障排查](./troubleshooting.md) | 故障排查 |

## 相关文档

| 类型 | 文档 | 链接 |
|------|------|------|
| 项目首页 | FQData首页 | [README](../README.md) |
| 父模块 | Trade模块 | [README](../README.md) |
