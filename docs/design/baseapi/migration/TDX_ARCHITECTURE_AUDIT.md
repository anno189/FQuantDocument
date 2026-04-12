# Tdx Adapter 架构审计报告

**审计时间**: 2026-03-31
**审计路径**: `FQDataSource/adapters/tdx/`
**审计结果**: ✅ 架构合理

---

## 一、模块结构概览

```
adapters/tdx/
├── __init__.py          # 模块导出 (14个类)
├── base.py               # 基类 (TdxBaseAdapter)
├── ip_selector.py        # IP选择器 (TdxIPSelector)
├── stock.py              # 股票数据 (TdxStockAdapter) - 10方法
├── index.py              # 指数数据 (TdxIndexAdapter) - 2方法
├── bond.py               # 债券数据 (TdxBondAdapter) - 2方法
├── future.py             # 期货数据 (TdxFutureAdapter) - 4方法
├── hkstock.py            # 港股数据 (TdxHKStockAdapter) - 3方法
├── option.py             # 期权数据 (TdxOptionAdapter) - 2方法
├── extension.py          # 扩展市场 (TdxExtensionAdapter) - 3方法
├── macro.py              # 宏观数据 (TdxMacroAdapter) - 2方法
├── exchange.py           # 汇率数据 (TdxExchangeAdapter) - 2方法
├── realtime.py           # 实时行情 (TdxRealtimeAdapter) - 4方法
├── transaction.py        # 分笔数据 (TdxTransactionAdapter) - 3方法
└── tools.py             # 内部/废弃函数 (TdxToolsAdapter) - 7方法
```

---

## 二、类继承关系

```
DataSourceAdapter (FQDataSource.base)
    └── TdxBaseAdapter (base.py)
            ├── TdxStockAdapter (stock.py)
            ├── TdxIndexAdapter (index.py)
            ├── TdxBondAdapter (bond.py)
            ├── TdxFutureAdapter (future.py)
            ├── TdxHKStockAdapter (hkstock.py)
            ├── TdxOptionAdapter (option.py)
            ├── TdxExtensionAdapter (extension.py)
            ├── TdxMacroAdapter (macro.py)
            ├── TdxExchangeAdapter (exchange.py)
            ├── TdxRealtimeAdapter (realtime.py)
            ├── TdxTransactionAdapter (transaction.py)
            └── TdxToolsAdapter (tools.py)

TdxIPSelector (ip_selector.py)  # 独立类，不继承
```

---

## 三、Retry 修饰器使用统计

| 文件 | 方法数 | 使用状态 |
|------|--------|----------|
| `stock.py` | 10 | ✅ 全部使用 `@retry` |
| `index.py` | 2 | ✅ 全部使用 `@retry` |
| `bond.py` | 2 | ✅ 全部使用 `@retry` |
| `realtime.py` | 4 | ✅ 全部使用 `@retry` |
| `future.py` | 4 | ✅ 全部使用 `@retry` |
| `hkstock.py` | 3 | ✅ 全部使用 `@retry` |
| `macro.py` | 2 | ✅ 全部使用 `@retry` |
| `exchange.py` | 2 | ✅ 全部使用 `@retry` |
| `extension.py` | 3 | ✅ 全部使用 `@retry` |
| `option.py` | 2 | ✅ 全部使用 `@retry` |
| `transaction.py` | 3 | ✅ 全部使用 `@retry` |

**总计**: 37 个公共方法使用 `@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)`

---

## 四、命名规范一致性

### 4.1 类命名

| 模式 | 数量 | 示例 |
|------|------|------|
| `Tdx*Adapter` | 12 | `TdxStockAdapter`, `TdxIndexAdapter` |
| `TdxIPSelector` | 1 | IP选择器 (独立类) |

### 4.2 方法命名

| 模式 | 数量 | 示例 |
|------|------|------|
| `get_*` | 35 | `get_stock_day`, `get_stock_list` |
| `_fetch_*` | 3 | `_fetch_stock_transaction` |
| `_select_*` | 2 | `_select_market_code` |
| `_util_*` | 2 | `_util_date_stamp` |
| `_get_*` | 1 | `_get_extensionmarket_list` |
| `_parse_*` | 1 | `_parse_tdx_timestamp` |

---

## 五、BaseAdapter 抽象方法

### 5.1 TdxBaseAdapter 定义的抽象方法

| 方法 | 签名 | 子类实现 |
|------|------|----------|
| `get_stock_day` | `(code, start, end, frequence="day")` | ✅ TdxStockAdapter |
| `get_stock_min` | `(code, start, end, frequence="1min")` | ✅ TdxStockAdapter |
| `get_index_day` | `(code, start, end)` | ✅ TdxIndexAdapter |
| `get_index_min` | `(code, start, end, frequence="1min")` | ✅ TdxIndexAdapter |
| `get_future_day` | `(code, start, end, frequence="day", category=None)` | ✅ TdxFutureAdapter |
| `get_future_min` | `(code, start, end, frequence="1min", category=None)` | ✅ TdxFutureAdapter |
| `get_realtime` | `(code)` | ✅ TdxRealtimeAdapter |
| `get_stock_info` | `(code)` | ✅ TdxStockAdapter |

### 5.2 TdxBaseAdapter 提供的公共方法

| 方法 | 说明 |
|------|------|
| `_get_mainmarket_ip()` | 获取主板市场IP |
| `_get_extensionmarket_ip()` | 获取扩展市场IP |
| `health_check()` | 健康检查 |
| `disconnect()` | 断开连接 |

---

## 六、模块依赖关系

```
base.py (TdxBaseAdapter)
├── DataSourceAdapter (FQDataSource.base)
├── TdxIPSelector (ip_selector.py)
└── pytdx.hq/ptexhq

stock.py (TdxStockAdapter)
├── base.py (TdxBaseAdapter)
├── FQBase.Date.timestamp
└── pytdx.hq

index.py (TdxIndexAdapter)
├── base.py
├── pytdx.hq

bond.py (TdxBondAdapter)
├── base.py
├── stock.py (TdxStockAdapter)
├── realtime.py (TdxRealtimeAdapter)
└── pytdx.hq

future.py (TdxFutureAdapter)
├── base.py
├── pytdx.exhq

hkstock.py (TdxHKStockAdapter)
├── base.py
└── pytdx.exhq

option.py (TdxOptionAdapter)
├── base.py
└── pytdx.exhq

extension.py (TdxExtensionAdapter)
├── base.py
└── pytdx.exhq

macro.py (TdxMacroAdapter)
├── base.py
└── pytdx.exhq

exchange.py (TdxExchangeAdapter)
├── base.py
└── pytdx.exhq

realtime.py (TdxRealtimeAdapter)
├── base.py
└── pytdx.hq

transaction.py (TdxTransactionAdapter)
├── base.py
└── pytdx.hq

tools.py (TdxToolsAdapter)
├── base.py
└── pytdx.hq

ip_selector.py (TdxIPSelector)
├── FQBase.Config
└── pytdx.hq/ptexhq
```

---

## 七、审计结论

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 模块结构 | ✅ | 14个模块，职责清晰 |
| 继承关系 | ✅ | 所有适配器正确继承 TdxBaseAdapter |
| 抽象方法实现 | ✅ | 8个抽象方法全部实现 |
| Retry 修饰器 | ✅ | 37个方法全部使用 `@retry` |
| 导出完整性 | ✅ | __init__.py 导出所有14个类 |
| 命名一致性 | ✅ | 方法命名规范统一 |
| 无循环依赖 | ✅ | 依赖关系清晰 |
| IP选择器实例化 | ✅ | `self._ip_selector = TdxIPSelector()` |

**最终结论**: ✅ **架构优秀**
