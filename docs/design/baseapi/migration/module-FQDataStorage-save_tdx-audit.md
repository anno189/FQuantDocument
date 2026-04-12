# 迁移一致性审计报告

**文件**: `QASU/save_tdx.py` → `FQData/FQData/storage/savers/`
**审计时间**: 2026-04-01
**审计结果**: ✅ 完全迁移 (49/49 函数)

---

## 迁移范围说明

- **包含**: Stock, Index/ETF, Future, Bond, Option, Transaction 相关函数
- **排除**: HK Stock (5函数), US Stock (5函数), QA_SU_check_stock_xdxr (检查函数非保存)

---

## 统计

| 指标 | 数值 |
|------|------|
| 源函数总数 | 60 |
| 迁移范围内函数 | 49 |
| 已迁移函数 | 49 |
| 迁移率 | 100% |

---

## 函数对照表

### 股票 (Stock) - 14 函数 ✅

| 源函数 | 目标函数 | 签名一致性 | 状态 |
|--------|----------|-----------|------|
| `QA_SU_save_single_stock_day` | `TDX_save_single_stock_day` | ✅ | ✅ |
| `QA_SU_save_stock_day` | `TDX_save_stock_day` | ✅ | ✅ |
| `QA_SU_save_stock_week` | `TDX_save_stock_week` | ✅ | ✅ |
| `QA_SU_save_stock_month` | `TDX_save_stock_month` | ✅ | ✅ |
| `QA_SU_save_stock_year` | `TDX_save_stock_year` | ✅ | ✅ |
| `QA_SU_save_stock_xdxr_quick` | `TDX_save_stock_xdxr_quick` | ✅ | ✅ |
| `QA_SU_save_stock_xdxr` | `TDX_save_stock_xdxr` | ✅ | ✅ |
| `QA_SU_save_stock_xdxr_one` | `TDX_save_single_stock_xdxr` | ✅ | ✅ |
| `QA_SU_save_single_stock_min` | `TDX_save_single_stock_min` | ✅ | ✅ |
| `QA_SU_save_stock_min` | `TDX_save_stock_min` | ✅ | ✅ |
| `QA_SU_save_stock_list` | `TDX_save_stock_list` | ✅ | ✅ |
| `QA_SU_save_stock_block` | `TDX_save_stock_block` | ✅ | ✅ |
| `QA_SU_save_stock_info` | `TDX_save_stock_info` | ✅ | ✅ |
| `QA_SU_save_stock_transaction` | `TDX_save_stock_transaction` | ✅ | ✅ |

### 指数/ETF (Index/ETF) - 10 函数 ✅

| 源函数 | 目标函数 | 签名一致性 | 状态 |
|--------|----------|-----------|------|
| `QA_SU_save_single_index_day` | `TDX_save_single_index_day` | ✅ | ✅ |
| `QA_SU_save_index_day` | `TDX_save_index_day` | ✅ | ✅ |
| `QA_SU_save_single_index_min` | `TDX_save_single_index_min` | ✅ | ✅ |
| `QA_SU_save_index_min` | `TDX_save_index_min` | ✅ | ✅ |
| `QA_SU_save_index_list` | `TDX_save_index_list` | ✅ | ✅ |
| `QA_SU_save_single_etf_day` | `TDX_save_single_etf_day` | ✅ | ✅ |
| `QA_SU_save_etf_day` | `TDX_save_etf_day` | ✅ | ✅ |
| `QA_SU_save_single_etf_min` | `TDX_save_single_etf_min` | ✅ | ✅ |
| `QA_SU_save_etf_min` | `TDX_save_etf_min` | ✅ | ✅ |
| `QA_SU_save_etf_list` | `TDX_save_etf_list` | ✅ | ✅ |

### 期货 (Future) - 7 函数 ✅

| 源函数 | 目标函数 | 签名一致性 | 状态 |
|--------|----------|-----------|------|
| `QA_SU_save_single_future_day` | `TDX_save_single_future_day` | ✅ | ✅ |
| `QA_SU_save_future_day` | `TDX_save_future_day` | ✅ | ✅ |
| `QA_SU_save_future_day_all` | `TDX_save_future_day_all` | ✅ | ✅ |
| `QA_SU_save_single_future_min` | `TDX_save_single_future_min` | ✅ | ✅ |
| `QA_SU_save_future_min` | `TDX_save_future_min` | ✅ | ✅ |
| `QA_SU_save_future_min_all` | `TDX_save_future_min_all` | ✅ | ✅ |
| `QA_SU_save_future_list` | `TDX_save_future_list` | ✅ | ✅ |

### 债券 (Bond) - 8 函数 ✅

| 源函数 | 目标函数 | 签名一致性 | 状态 |
|--------|----------|-----------|------|
| `QA_SU_save_single_bond_day` | `TDX_save_single_bond_day` | ✅ | ✅ |
| `QA_SU_save_bond_day` | `TDX_save_bond_day` | ✅ | ✅ |
| `QA_SU_save_bond2stock_day` | `TDX_save_bond2stock_day` | ✅ | ✅ |
| `QA_SU_save_single_bond_min` | `TDX_save_single_bond_min` | ✅ | ✅ |
| `QA_SU_save_bond_min` | `TDX_save_bond_min` | ✅ | ✅ |
| `QA_SU_save_bond2stock_min` | `TDX_save_bond2stock_min` | ✅ | ✅ |
| `QA_SU_save_bond_list` | `TDX_save_bond_list` | ✅ | ✅ |
| `QA_SU_save_bond2stock_list` | `TDX_save_bond2stock_list` | ✅ | ✅ |

### 期权 (Option) - 9 函数 ✅

| 源函数 | 目标函数 | 签名一致性 | 状态 |
|--------|----------|-----------|------|
| `QA_SU_save_option_commodity_day` | `TDX_save_option_commodity_day` | ✅ | ✅ |
| `QA_SU_save_option_commodity_min` | `TDX_save_option_commodity_min` | ✅ | ✅ |
| `QA_SU_save_option_50etf_min` | `TDX_save_option_50etf_min` | ✅ | ✅ |
| `QA_SU_save_option_50etf_day` | `TDX_save_option_50etf_day` | ✅ | ✅ |
| `QA_SU_save_option_300etf_min` | `TDX_save_option_300etf_min` | ✅ | ✅ |
| `QA_SU_save_option_300etf_day` | `TDX_save_option_300etf_day` | ✅ | ✅ |
| `QA_SU_save_option_contract_list` | `TDX_save_option_contract_list` | ✅ | ✅ |
| `QA_SU_save_option_day_all` | `TDX_save_option_day_all` | ✅ | ✅ |
| `QA_SU_save_option_min_all` | `TDX_save_option_min_all` | ✅ | ✅ |

### 分笔数据 (Transaction) - 1 函数 ✅

| 源函数 | 目标函数 | 签名一致性 | 状态 |
|--------|----------|-----------|------|
| `QA_SU_save_index_transaction` | `TDX_save_index_transaction` | ✅ | ✅ |

---

## 排除项

| 类别 | 函数数 | 排除原因 |
|------|--------|----------|
| HK Stock | 5 | 用户要求跳过 |
| US Stock | 5 | 用户要求跳过 |
| QA_SU_check_stock_xdxr | 1 | 检查函数，非保存功能 |

---

## 新文件结构

```
FQData/FQData/storage/
├── __init__.py
└── savers/
    ├── __init__.py
    ├── main.py
    ├── tdx_stock_saver.py          # 14函数
    ├── tdx_index_saver.py           # 10函数
    ├── tdx_future_saver.py          # 7函数
    ├── tdx_bond_saver.py            # 8函数
    ├── tdx_option_saver.py          # 9函数
    ├── tdx_transaction_saver.py     # 2函数
    └── tdx_usstock_saver.py        # 占位文件
```

---

## 审计结论

**✅ save_tdx.py 迁移范围内函数已 100% 完成迁移**