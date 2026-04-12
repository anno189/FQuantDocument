# Tdx Adapter 依赖审计报告

**审计时间**: 2026-03-31
**审计路径**: `FQDataSource/adapters/tdx/`
**审计结果**: ✅ 依赖清晰

---

## 一、外部依赖

### 1.1 第三方库

| 库 | 版本 | 用途 | 使用文件数 |
|-----|------|------|------------|
| `pytdx` | - | 通达信API | 13 |
| `pandas` | - | 数据处理 | 12 |
| `FQBase` | - | 基础设施 | 13 |

### 1.2 pytdx API

| API | 用途 | 使用文件 |
|-----|------|----------|
| `TdxHq_API` | 主板市场行情 | base.py, stock.py, index.py, bond.py, realtime.py, transaction.py, tools.py |
| `TdxExHq_API` | 扩展市场行情 | future.py, hkstock.py, option.py, extension.py, macro.py, exchange.py |

### 1.3 FQBase 依赖

| 模块 | 用途 | 使用文件 |
|------|------|----------|
| `FQBase.Foundation.retry` | 重试修饰器 | 10 |
| `FQBase.Foundation.logger` | 日志记录 | 13 |
| `FQBase.Config` | 配置项 | ip_selector.py |
| `FQBase.Date.timestamp` | 时间戳处理 | stock.py, index.py, bond.py, macro.py, exchange.py |
| `FQBase.Date.trade` | 交易日处理 | transaction.py |
| `FQData.FQDataSource.base` | 异常类 | 全部 |
| `FQData.FQDataStore` | 缓存 | ip_selector.py, extension.py, future.py |

---

## 二、内部依赖

### 2.1 模块间依赖关系

```
base.py (TdxBaseAdapter)
    └── 无内部依赖

stock.py (TdxStockAdapter)
    └── base.py

index.py (TdxIndexAdapter)
    └── base.py

bond.py (TdxBondAdapter)
    └── base.py, stock.py, index.py

future.py (TdxFutureAdapter)
    └── base.py, extension.py

hkstock.py (TdxHKStockAdapter)
    └── base.py, extension.py

option.py (TdxOptionAdapter)
    └── base.py, extension.py

extension.py (TdxExtensionAdapter)
    └── base.py

macro.py (TdxMacroAdapter)
    └── base.py, extension.py

exchange.py (TdxExchangeAdapter)
    └── base.py, extension.py

realtime.py (TdxRealtimeAdapter)
    └── base.py

transaction.py (TdxTransactionAdapter)
    └── base.py

tools.py (TdxToolsAdapter)
    └── base.py, stock.py, extension.py

ip_selector.py (TdxIPSelector)
    └── 无内部依赖
```

### 2.2 依赖深度分析

| 模块 | 直接依赖 | 间接依赖 | 依赖深度 |
|------|----------|----------|----------|
| base.py | 0 | 0 | 1 |
| ip_selector.py | 0 | 0 | 1 |
| stock.py | 1 | 1 | 2 |
| index.py | 1 | 1 | 2 |
| bond.py | 3 | 3 | 2 |
| extension.py | 1 | 1 | 2 |
| realtime.py | 1 | 1 | 2 |
| transaction.py | 1 | 1 | 2 |
| future.py | 2 | 2 | 3 |
| hkstock.py | 2 | 2 | 3 |
| option.py | 2 | 2 | 3 |
| macro.py | 2 | 2 | 3 |
| exchange.py | 2 | 2 | 3 |
| tools.py | 3 | 3 | 3 |

---

## 三、循环依赖检查

### 3.1 检查结果

**✅ 无循环依赖**

依赖链最长为3层，结构清晰：
- `tools.py → stock.py → base.py`
- `macro.py → extension.py → base.py`

---

## 四、依赖问题

### 4.1 发现的问题

| 级别 | 问题 | 位置 | 说明 |
|------|------|------|------|
| ⚠️ 低 | tools.py 依赖 stock.py | tools.py:491 | tools 依赖 stock 可能过深 |
| ⚠️ 低 | 多模块依赖 extension.py | future/hkstock/option/macro/exchange | extension.py 是多个模块的中心依赖点 |

### 4.2 建议

1. **降低工具类依赖**: `tools.py` 中的 `TdxStockAdapter` 仅用于 `get_bond2stock_realtime`，可考虑解耦
2. **extension.py 作为中心模块**: 建议添加更多测试覆盖

---

## 五、依赖统计

| 类型 | 数量 |
|------|------|
| 外部第三方库 | 3 (pytdx, pandas, FQBase) |
| FQBase 子模块 | 6 |
| 内部模块 | 14 |
| 循环依赖 | 0 |

---

## 六、审计结论

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 外部依赖 | ✅ | pytdx, pandas, FQBase |
| 内部依赖 | ✅ | 继承关系清晰 |
| 循环依赖 | ✅ | 无循环 |
| 依赖深度 | ✅ | 最多3层 |
| 单点故障 | ⚠️ | extension.py 被多模块依赖 |

**最终结论**: ✅ **依赖结构清晰合理**
