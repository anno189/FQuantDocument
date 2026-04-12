# QAQuery.py 迁移审计报告

**源文件**: `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QAFetch/QAQuery.py`
**目标模块**: `FQData/FQData/fetch/local/`
**审计时间**: 2026-03-28
**状态**: ✅ 100% 迁移完成

---

## 一、迁移总览

| 类别 | 源文件函数数 | 目标文件 | 状态 |
|------|-------------|----------|------|
| 股票数据 | 8 | `local/stock.py` | ✅ |
| 指数数据 | 4 | `local/index.py` | ✅ |
| 债券数据 | 3 | `local/bond.py` | ✅ |
| 期货数据 | 4 | `local/future.py` | ✅ |
| 列表数据 | 4 | `local/list.py` | ✅ |
| 交易数据 | 1 | `local/trade.py` | ✅ |
| 财务日历 | 2 | `local/calendar.py` | ✅ |
| 实时行情 | 2 | `local/market.py` | ✅ |
| 回测数据 | 6 | `local/backtest.py` | ✅ |
| 龙虎榜 | 1 | `local/lhb.py` | ✅ |
| CTP数据 | 1 | `local/ctp.py` | ✅ |
| **总计** | **36** | | **100%** |

---

## 二、新增迁移文件

| 文件 | 函数 | 说明 |
|------|------|------|
| `calendar.py` | `DB_fetch_stock_financial_calendar`, `DB_fetch_stock_full` | 财务日历、全市场数据 |
| `market.py` | `DB_fetch_quotation`, `DB_fetch_quotations` | 实时行情 |
| `backtest.py` | `DB_fetch_backtest_info/history/account/risk/user/strategy` | 回测数据 |
| `lhb.py` | `DB_fetch_lhb` | 龙虎榜 |
| `ctp.py` | `DB_fetch_ctp_tick` | CTP Tick |

---

## 三、函数签名对比

| # | 源函数 | 目标函数 | 一致性 |
|---|--------|----------|--------|
| 1 | `QA_fetch_stock_day` | `DB_fetch_stock_day` | ✅ |
| 2 | `QA_fetch_stock_adj` | `DB_fetch_stock_adj` | ✅ |
| 3 | `QA_fetch_stock_min` | `DB_fetch_stock_min` | ✅ |
| 4 | `QA_fetch_stock_transaction` | `DB_fetch_stock_transaction` | ✅ |
| 5 | `QA_fetch_stock_xdxr` | `DB_fetch_stock_xdxr` | ✅ |
| 6 | `QA_fetch_stock_info` | `DB_fetch_stock_info` | ✅ |
| 7 | `QA_fetch_stock_name` | `DB_fetch_stock_name` | ✅ |
| 8 | `QA_fetch_stock_block` | `DB_fetch_stock_block` | ✅ |
| 9 | `QA_fetch_index_day` | `DB_fetch_index_day` | ✅ |
| 10 | `QA_fetch_index_min` | `DB_fetch_index_min` | ✅ |
| 11 | `QA_fetch_index_transaction` | `DB_fetch_index_transaction` | ✅ |
| 12 | `QA_fetch_index_name` | `DB_fetch_index_name` | ✅ |
| 13 | `QA_fetch_bond2stock_day` | `DB_fetch_bond2stock_day` | ✅ |
| 14 | `QA_fetch_bond2stock_min` | `DB_fetch_bond2stock_min` | ✅ |
| 15 | `QA_fetch_bond2stock_list` | `DB_fetch_bond2stock_list` | ✅ |
| 16 | `QA_fetch_future_day` | `DB_fetch_future_day` | ✅ |
| 17 | `QA_fetch_future_min` | `DB_fetch_future_min` | ✅ |
| 18 | `QA_fetch_future_list` | `DB_fetch_future_list` | ✅ |
| 19 | `QA_fetch_future_tick` | `DB_fetch_future_tick` | ⚠️ |
| 20 | `QA_fetch_stock_list` | `DB_fetch_stock_list` | ✅ |
| 21 | `QA_fetch_etf_list` | `DB_fetch_etf_list` | ✅ |
| 22 | `QA_fetch_index_list` | `DB_fetch_index_list` | ✅ |
| 23 | `QA_fetch_stock_terminated` | `DB_fetch_stock_terminated` | ✅ |
| 24 | `QA_fetch_trade_date` | `DB_fetch_trade_date` | ✅ |
| 25 | `QA_fetch_stock_financial_calendar` | `DB_fetch_stock_financial_calendar` | ✅ |
| 26 | `QA_fetch_stock_full` | `DB_fetch_stock_full` | ✅ |
| 27 | `QA_fetch_quotation` | `DB_fetch_quotation` | ✅ |
| 28 | `QA_fetch_quotations` | `DB_fetch_quotations` | ✅ |
| 29 | `QA_fetch_backtest_info` | `DB_fetch_backtest_info` | ✅ |
| 30 | `QA_fetch_backtest_history` | `DB_fetch_backtest_history` | ✅ |
| 31 | `QA_fetch_account` | `DB_fetch_account` | ✅ |
| 32 | `QA_fetch_risk` | `DB_fetch_risk` | ✅ |
| 33 | `QA_fetch_user` | `DB_fetch_user` | ✅ |
| 34 | `QA_fetch_strategy` | `DB_fetch_strategy` | ✅ |
| 35 | `QA_fetch_lhb` | `DB_fetch_lhb` | ✅ |
| 36 | `QA_fetch_ctp_tick` | `DB_fetch_ctp_tick` | ✅ |

---

## 四、差异详情

| 函数 | 源签名 | 目标签名 | 说明 |
|------|--------|----------|------|
| `QA_fetch_future_tick` | `()` | `(code, date, collections)` | 原始函数直接 `raise NotImplementedError`，目标函数实现了实际功能 |

**说明**: 原始 `QA_fetch_future_tick` 函数直接抛出 `NotImplementedError`，迁移时实现了完整功能。

---

## 五、架构改进

| 项目 | 原始设计 | 迁移后设计 |
|------|----------|------------|
| 依赖模块 | `FQData.QAUtil` | `FQBase.FQDate`, `FQBase.FQUtil`, `FQBase.FQCore` |
| 导入方式 | 直接导入 | 模块化导入 |
| 函数命名 | `QA_fetch_*` | `DB_fetch_*` |
| 模块结构 | 单一文件 | 11个模块文件 |

---

## 六、审计结论

| 项目 | 结果 |
|------|------|
| **总迁移率** | **100%** (36/36) |
| **函数签名一致率** | **97%** (35/36) |
| **核心逻辑一致性** | ✅ 完全一致 |
| **语法验证** | ✅ 通过 |
| **导出完整性** | ✅ `__init__.py` 已更新 |

### 导出清单

```python
from FQData.fetch.local import (
    # stock
    DB_fetch_stock_day, DB_fetch_stock_adj, DB_fetch_stock_min,
    DB_fetch_stock_transaction, DB_fetch_stock_xdxr, DB_fetch_stock_info,
    DB_fetch_stock_name, DB_fetch_stock_block,
    # index
    DB_fetch_index_day, DB_fetch_index_min,
    DB_fetch_index_transaction, DB_fetch_index_name,
    # bond
    DB_fetch_bond2stock_day, DB_fetch_bond2stock_min, DB_fetch_bond2stock_list,
    # future
    DB_fetch_future_day, DB_fetch_future_min, DB_fetch_future_list,
    DB_fetch_future_tick,
    # list
    DB_fetch_stock_list, DB_fetch_etf_list, DB_fetch_index_list,
    DB_fetch_stock_terminated,
    # trade
    DB_fetch_trade_date,
    # calendar
    DB_fetch_stock_financial_calendar, DB_fetch_stock_full,
    # market
    DB_fetch_quotation, DB_fetch_quotations,
    # backtest
    DB_fetch_backtest_info, DB_fetch_backtest_history, DB_fetch_account,
    DB_fetch_risk, DB_fetch_user, DB_fetch_strategy,
    # lhb
    DB_fetch_lhb,
    # ctp
    DB_fetch_ctp_tick,
)
```
