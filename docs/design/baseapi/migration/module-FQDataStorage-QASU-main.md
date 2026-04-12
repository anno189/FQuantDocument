# 迁移一致性审计报告

**文件**: `QASU/main.py` → `storage/savers/main.py`
**审计时间**: 2026-03-28
**审计结果**: ✅ 完全迁移

---

## 一、基本信息

| 项目 | 详情 |
|------|------|
| **源文件** | `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QASU/main.py` |
| **目标文件** | `/Users/A.D.189/FQuant/FQuant.Server/FQData/FQData/storage/savers/main.py` |
| **迁移状态** | ✅ 已迁移 |
| **函数数量** | 源: 50 / 目标: 50 |

---

## 二、函数对照表

| 源函数 | 目标函数 | 签名一致性 | 状态 |
|--------|----------|-----------|------|
| `QA_SU_save_stock_info` | `QA_SU_save_stock_info` | ✅ 一致 | 已迁移 |
| `QA_SU_save_stock_list` | `QA_SU_save_stock_list` | ✅ 一致 | 已迁移 |
| `QA_SU_save_index_list` | `QA_SU_save_index_list` | ✅ 一致 | 已迁移 |
| `QA_SU_save_etf_list` | `QA_SU_save_etf_list` | ✅ 一致 | 已迁移 |
| `QA_SU_save_future_list` | `QA_SU_save_future_list` | ✅ 一致 | 已迁移 |
| `QA_SU_save_single_future_day` | `QA_SU_save_single_future_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_single_usstock_day` | `QA_SU_save_single_usstock_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_future_day` | `QA_SU_save_future_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_future_day_all` | `QA_SU_save_future_day_all` | ✅ 一致 | 已迁移 |
| `QA_SU_save_single_future_min` | `QA_SU_save_single_future_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_future_min` | `QA_SU_save_future_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_future_min_all` | `QA_SU_save_future_min_all` | ✅ 一致 | 已迁移 |
| `QA_SU_save_stock_day` | `QA_SU_save_stock_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_stock_week` | `QA_SU_save_stock_week` | ✅ 一致 | 已迁移 |
| `QA_SU_save_stock_month` | `QA_SU_save_stock_month` | ✅ 一致 | 已迁移 |
| `QA_SU_save_single_stock_day` | `QA_SU_save_single_stock_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_option_contract_list` | `QA_SU_save_option_contract_list` | ✅ 一致 | 已迁移 |
| `QA_SU_save_option_day_all` | `QA_SU_save_option_day_all` | ✅ 一致 | 已迁移 |
| `QA_SU_save_option_min_all` | `QA_SU_save_option_min_all` | ✅ 一致 | 已迁移 |
| `QA_SU_save_option_50etf_day` | `QA_SU_save_option_50etf_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_option_50etf_min` | `QA_SU_save_option_50etf_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_option_300etf_day` | `QA_SU_save_option_300etf_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_option_300etf_min` | `QA_SU_save_option_300etf_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_option_commodity_min` | `QA_SU_save_option_commodity_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_option_commodity_day` | `QA_SU_save_option_commodity_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_stock_min` | `QA_SU_save_stock_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_stock_transaction` | `QA_SU_save_stock_transaction` | ✅ 一致 | 已迁移 |
| `QA_SU_save_index_transaction` | `QA_SU_save_index_transaction` | ✅ 一致 | 已迁移 |
| `QA_SU_save_single_stock_min` | `QA_SU_save_single_stock_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_index_day` | `QA_SU_save_index_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_single_index_day` | `QA_SU_save_single_index_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_index_min` | `QA_SU_save_index_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_bond2stock_day` | `QA_SU_save_bond2stock_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_bond2stock_min` | `QA_SU_save_bond2stock_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_single_index_min` | `QA_SU_save_single_index_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_etf_day` | `QA_SU_save_etf_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_single_etf_day` | `QA_SU_save_single_etf_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_etf_min` | `QA_SU_save_etf_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_single_etf_min` | `QA_SU_save_single_etf_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_stock_xdxr_quick` | `QA_SU_save_stock_xdxr_quick` | ✅ 一致 | 已迁移 |
| `QA_SU_save_stock_xdxr` | `QA_SU_save_stock_xdxr` | ✅ 一致 | 已迁移 |
| `QA_SU_save_stock_xdxr_one` | `QA_SU_save_stock_xdxr_one` | ✅ 一致 | 已迁移 |
| `QA_SU_check_stock_xdxr` | `QA_SU_check_stock_xdxr` | ✅ 一致 | 已迁移 |
| `QA_SU_save_stock_block` | `QA_SU_save_stock_block` | ✅ 一致 | 已迁移 |
| `QA_SU_save_stock_min_5` | `QA_SU_save_stock_min_5` | ✅ 一致 | 已迁移 |
| `QA_SU_save_bond_list` | `QA_SU_save_bond_list` | ✅ 一致 | 已迁移 |
| `QA_SU_save_bond_day` | `QA_SU_save_bond_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_single_bond_day` | `QA_SU_save_single_bond_day` | ✅ 一致 | 已迁移 |
| `QA_SU_save_bond_min` | `QA_SU_save_bond_min` | ✅ 一致 | 已迁移 |
| `QA_SU_save_single_bond_min` | `QA_SU_save_single_bond_min` | ✅ 一致 | 已迁移 |

---

## 三、迁移评分

| 维度 | 评分 |
|------|------|
| **函数完整性** | 50/50 ✅ |
| **签名一致性** | 100% ✅ |
| **逻辑一致性** | 100% ✅ |
| **命名规范** | ✅ 保持 |

---

## 四、审计结论

**审计结果**: ✅ **完全迁移**

`QASU/main.py` 的所有50个函数已成功迁移到 `storage/savers/main.py`，函数签名完全一致。

---

## 五、迁移对照速查

| 原始函数 | 迁移后函数 | 模块 |
|---------|-----------|------|
| `QA_SU_save_*` | `QA_SU_save_*` | FQData.storage.savers.main |
