---
title: runtime - 运行时上下文
description: 全局日期单例类和获取当前交易日的便捷函数
tag:
  - fqdata
  - trade
  - runtime

summary:
  type: utility
  complexity: minimal
  maturity: stable
  classes:
    - name: GlobalDate
      description: 全局日期单例类，用于获取当前交易日
  functions:
    - name: get_today
      description: 获取当前交易日（便捷函数）
  constants:
    - name: TRADING_DAY_START_TIME
      description: 交易日开始时间（800表示8:00）
    - name: GLOBALDATE
      description: 全局日期单例实例
  features:
    is_singleton: true
    has_cache: true
    is_thread_unsafe: true
  usage_scenarios:
    - "场景1：获取当前交易日（考虑时间因素）"
    - "场景2：需要全局统一的日期管理"
    - "场景3：需要强制刷新日期缓存"
  warnings:
    - "警告1：非线程安全，多线程环境下需自行加锁"
    - "警告2：缓存机制可能导致日期更新延迟"
  limitations:
    - "限制1：仅支持上交所交易日判断"
    - "限制2：交易日开始时间硬编码为8:00"

relationships:
  belongs_to:
    - fquant.fqdata.trade
  depends_on:
    - fquant.fqdata.trade.datetime
  used_by:
    - fquant.fqdata
    - fquant.fqalgorithm

api:
  signatures:
    GlobalDate:
      type: class
      description: 全局日期单例类
      properties: "TODAY, DAY, NOW"
      methods: "refresh()"
    get_today:
      type: function
      signature: "() -> str"
      description: 获取当前交易日
    GLOBALDATE:
      type: instance
      description: GlobalDate单例实例
  examples:
    GlobalDate: |
      from FQData.Trade.runtime import GLOBALDATE
      
      # 获取当前交易日
      today = GLOBALDATE.TODAY  # '2024-01-15'
      
      # 获取当前时间
      now = GLOBALDATE.NOW  # '2024-01-15 14:30'
      
      # 强制刷新缓存
      GLOBALDATE.refresh()
    get_today: |
      from FQData.Trade.runtime import get_today
      
      # 获取当前交易日
      today = get_today()  # '2024-01-15'

usage:
  quick_example: |
    from FQData.Trade.runtime import get_today, GLOBALDATE
    
    # 使用便捷函数
    today = get_today()
    
    # 使用单例类
    today = GLOBALDATE.TODAY
    now = GLOBALDATE.NOW
---

# runtime 运行时上下文

## 一句话总览

📌 **全局日期单例类和获取当前交易日的便捷函数**

## ⚠️ AI 开发必读

### 使用场景

✅ **应该使用**：
- 获取当前交易日（考虑时间因素）
- 需要全局统一的日期管理
- 需要强制刷新日期缓存

❌ **不应该使用**：
- 多线程环境下直接使用（非线程安全）
- 需要判断非上交所的交易日

### 注意事项

1. **非线程安全**
   - ❌ 错误做法：多线程环境下直接调用 get_today()
   - ✅ 正确做法：自行加锁或使用线程局部存储

2. **缓存机制**
   - 说明：每天 8:00 后更新缓存，可能导致日期更新延迟

### 已知限制

- 仅支持上交所交易日判断
- 交易日开始时间硬编码为 8:00

### 依赖

| 依赖类型 | 模块 | 说明 |
|---------|------|------|
| 必须 | FQData.Trade.datetime | 日期时间工具 |

**TL;DR**：
- 核心能力：全局日期单例、交易日获取
- 入门难度：🟢 简单
- 依赖：datetime 子模块

## 快速开始

```python
from FQData.Trade.runtime import get_today, GLOBALDATE

# 使用便捷函数
today = get_today()

# 使用单例类
today = GLOBALDATE.TODAY
now = GLOBALDATE.NOW

# 强制刷新缓存
GLOBALDATE.refresh()
```

## GlobalDate 类

```python
from FQData.Trade.runtime import GLOBALDATE

# 获取当前交易日（考虑时间因素）
# 每天 8:00 前返回前一交易日，8:00 后返回当日交易日
today = GLOBALDATE.TODAY

# 同 TODAY
day = GLOBALDATE.DAY

# 获取当前时间字符串
now = GLOBALDATE.NOW  # '2024-01-15 14:30'

# 强制刷新缓存
GLOBALDATE.refresh()
```

### 属性说明

| 属性 | 类型 | 描述 |
|------|------|------|
| TODAY | str | 当前交易日（格式：YYYY-MM-DD） |
| DAY | str | 同 TODAY |
| NOW | str | 当前时间（格式：YYYY-MM-DD HH:MM） |

### 方法说明

| 方法 | 描述 |
|------|------|
| refresh() | 强制刷新缓存，下一次访问时重新获取日期 |

## get_today 函数

```python
from FQData.Trade.runtime import get_today

# 获取当前交易日
# 每天 8:00 前返回前一交易日
# 8:00 后返回当日交易日（如果当日是交易日）或最近交易日
today = get_today()  # '2024-01-15'
```

### 逻辑说明

```
当前时间 < 8:00  → 返回前一交易日
当前时间 >= 8:00 → 返回当日交易日或最近交易日
```

## 常量

### TRADING_DAY_START_TIME

```python
from FQData.Trade.runtime import TRADING_DAY_START_TIME

# 交易日开始时间（800 = 8:00）
print(TRADING_DAY_START_TIME)  # 800
```

## 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| 导入错误 | 模块路径不正确 | 使用 `from FQData.Trade.runtime import ...` |
| 日期不更新 | 缓存未刷新 | 调用 `GLOBALDATE.refresh()` 强制刷新 |
| 多线程问题 | 非线程安全 | 自行添加线程锁 |

## 变更日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0.0 | 2024-01 | 初始版本，包含全局日期管理 |
