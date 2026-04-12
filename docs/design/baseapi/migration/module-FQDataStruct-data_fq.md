# 迁移一致性审计报告: FQDataStruct-data_fq

## 基本信息

| 项目 | 详情 |
|------|------|
| **源文件** | `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QAData/data_fq.py` |
| **目标文件** | `/Users/A.D.189/FQuant/FQuant.Server/FQData/FQData/DataStruct/adj.py` |
| **审计时间** | 2026-03-31 |
| **审计结果** | ✅ 完全迁移 |

---

## 函数对照表

### 源文件函数 (data_fq.py)

| 原函数 | 类型 | 功能 |
|--------|------|------|
| `IF` | 工具函数 | 序列布尔判断 np.where(S,A,B) |
| `__QA_fetch_stock_xdxr` | 内部函数 | 获取股票除权信息 |
| `_QA_data_stock_to_fq` | 内部函数 | 使用数据库数据进行复权 |
| `QA_data_stock_to_fq` | 公共函数 | 股票日线/分钟线动态复权接口 |
| `QA_data_stock_fq_adj` | 公共函数 | 复权价格计算 |
| `QA_data_stock_liquidity` | 公共函数 | 取流通盘，总股本变化 |

### 目标文件函数 (adj.py)

| 目标函数 | 签名一致性 | 逻辑一致性 | 状态 |
|----------|-----------|-----------|------|
| `IF` | ✅ | ✅ | 已迁移 |
| `fetch_stock_xdxr` | ✅ (重命名) | ✅ | 已迁移 |
| `_data_stock_to_fq` | ✅ (重命名) | ✅ | 已迁移 |
| `data_stock_to_fq` | ✅ (重命名) | ✅ | 已迁移 |
| `data_stock_fq_adj` | ✅ (重命名) | ✅ | 已迁移 |
| `_data_stock_liquidity` | ✅ (重命名) | ✅ | 已迁移 |

---

## 命名映射

| 源函数 | 目标函数 | 变化说明 |
|--------|----------|----------|
| `__QA_fetch_stock_xdxr` | `fetch_stock_xdxr` | 移除 `__` 前缀，改为公共函数 |
| `_QA_data_stock_to_fq` | `_data_stock_to_fq` | 移除 `QA_` 前缀 |
| `QA_data_stock_to_fq` | `data_stock_to_fq` | 移除 `QA_` 前缀 |
| `QA_data_stock_fq_adj` | `data_stock_fq_adj` | 移除 `QA_` 前缀 |
| `QA_data_stock_liquidity` | `_data_stock_liquidity` | 移除 `QA_` 前缀，设为内部函数 |

---

## 依赖更新

### stock.py 引用变更

| 位置 | 旧引用 | 新引用 |
|------|--------|--------|
| `StockDayData.to_qfq()` | `FQData.QAData.data_fq.QA_data_stock_to_fq` | `data_stock_to_fq` |
| `StockDayData.to_hfq()` | `FQData.QAData.data_fq.QA_data_stock_to_fq` | `data_stock_to_fq` |
| `StockDayData.to_liquidity()` | `FQData.QAData.data_fq.QA_data_stock_liquidity` | `_data_stock_liquidity` |
| `StockMinData.to_qfq()` | `FQData.QAData.data_fq.QA_data_stock_to_fq` | `data_stock_to_fq` |
| `StockMinData.to_hfq()` | `FQData.QAData.data_fq.QA_data_stock_to_fq` | `data_stock_to_fq` |

---

## 导出更新

### DataStruct/__init__.py

新增导出:
- `fetch_stock_xdxr`
- `data_stock_to_fq`
- `data_stock_fq_adj`
- `_data_stock_liquidity`

---

## 统计

| 指标 | 数值 |
|------|------|
| 源公共函数数 | 3 |
| 目标公共函数数 | 4 |
| 源内部函数数 | 3 |
| 目标内部函数数 | 4 |
| 迁移率 | 100% |

---

## 审计结论

✅ **完全迁移** - 所有函数已成功迁移到新模块 `FQuant.DataStruct.adj`

1. 核心复权逻辑完整保留
2. 除权数据获取功能已迁移
3. 流通股本计算功能已迁移
4. 依赖关系已完全更新
5. 导出接口已正确配置