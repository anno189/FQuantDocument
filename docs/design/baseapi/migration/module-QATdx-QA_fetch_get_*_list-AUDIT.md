# 迁移一致性审计报告

**文件**: `QA_fetch_get_*_list` 函数族
**审计时间**: 2026-04-05
**审计结果**: ⚠️ 1 个问题已修复，1 个源文件问题

## 函数对照表

| # | 源函数 | 目标函数 | 过滤条件 | 状态 |
|---|--------|----------|---------|------|
| 1 | `QA_fetch_get_stock_list` | `TdxStockAdapter.get_stock_list` | `sec=="stock_cn"` | ✅ |
| 2 | `QA_fetch_get_index_list` | `TdxStockAdapter.get_index_list` | `sec=="index_cn"` | ✅ |
| 3 | `QA_fetch_get_bond_list` | `TdxStockAdapter.get_bond_list` | `sec=="bond_cn"` | ✅ |
| 4 | `QA_fetch_get_bond2stock_list` | `TdxStockAdapter.get_bond2stock_list` | `sec=="bond2_cn"` | ✅ |
| 5 | `QA_fetch_get_extensionmarket_list` | `TdxExtensionAdapter.get_extensionmarket_list` | `category > 0` | ✅ |
| 6 | `QA_fetch_get_future_list` | `TdxExtensionAdapter.get_future_list` | `market in (42,28,29,30,38,47,27,33,62,8)` | ✅ |
| 7 | `QA_fetch_get_globalindex_list` | `TdxExtensionAdapter.get_globalindex_list` | `market in (12,37)` | ✅ |
| 8 | `QA_fetch_get_goods_list` | `TdxExtensionAdapter.get_goods_list` | `market in (50,76,46)` | ✅ |
| 9 | `QA_fetch_get_globalfuture_list` | `TdxExtensionAdapter.get_globalfuture_list` | `market in (14,15,16,17,18,19,20,77,39)` | ✅ |
| 10 | `QA_fetch_get_hkstock_list` | `TdxExtensionAdapter.get_hkstock_list` | `market in (31,48)` | ✅ |
| 11 | `QA_fetch_get_hkindex_list` | `TdxExtensionAdapter.get_hkindex_list` | `market==27` | ✅ |
| 12 | `QA_fetch_get_hkfund_list` | `TdxExtensionAdapter.get_hkfund_list` | `market==49` | ✅ |
| 13 | `QA_fetch_get_usstock_list` | `TdxExtensionAdapter.get_usstock_list` | `market in (74,40,41)` | ✅ 已修复 |
| 14 | `QA_fetch_get_macroindex_list` | `TdxExtensionAdapter.get_macroindex_list` | `market==38` | ✅ |
| 15 | `QA_fetch_get_option_list` | `TdxExtensionAdapter.get_option_list` | `category==12 and market!=1` | ✅ |
| 16 | `QA_fetch_get_exchangerate_list` | `TdxExtensionAdapter.get_exchange_rate_list` | `market in (10,11) and category==4` | ✅ |
| 17 | `QA_fetch_get_wholemarket_list` | `TdxToolsAdapter.get_wholemarket_list` | concat(hq + kz) | ✅ |

## 修复记录

| 日期 | 函数 | 操作 | 说明 |
|------|------|------|------|
| 2026-04-05 | `get_usstock_list` | 修复 extension.py:229 | 添加 `market==40` |
| 2026-04-05 | `get_option_list` | 修复 extension.py:249 | 修复为 `category==12 and market!=1` |

## 源文件问题 (不影響目標代碼)

### `QA_fetch_get_hkstock_list` 重复定义 (QATdx.py:2906)

| 位置 | 过滤条件 | 说明 |
|------|---------|------|
| QATdx.py:1813 | `market==31 or market==48` | ✅ 正确定义 |
| QATdx.py:2916 | `category==2 and market==31` | ❌ 错误定义 |

**说明**: 源文件存在两个 `QA_fetch_get_hkstock_list` 定义，第二个定义使用了错误的过滤条件。目标代码已采用正确的第一个定义，不受影响。

## 统计

| 指标 | 数值 |
|------|------|
| 总函数数 | 17 |
| 算法一致 | 16 |
| 存在问题 | 1 (源文件问题) |

---

**审计人**: Migration Checker
**审计日期**: 2026-04-05