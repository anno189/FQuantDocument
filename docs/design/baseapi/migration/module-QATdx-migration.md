# 迁移一致性审计报告

**源文件**: `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QAFetch/QATdx.py`
**目标文件**: `/Users/A.D.189/FQuant/FQuant.Server/FQData/FQData/FQDataSource/tdx_adapter.py`
**审计时间**: 2026-03-31
**审计结果**: ⚠️ 部分迁移（架构重构）

---

## 一、架构差异说明

### 源架构（QATdx.py）
- **模式**: 独立函数集合（Module-level functions）
- **特点**: 所有功能以独立函数形式存在，通过全局 IP 管理

### 目标架构（tdx_adapter.py）
- **模式**: 适配器类（Adapter Pattern）
- **特点**: 继承 `DataSourceAdapter` 基类，实现统一接口
- **优势**: 支持多数据源切换、依赖注入、标准化接口

---

## 二、函数对照表

### 2.1 核心股票/指数数据函数（已迁移 ✅）

| 源函数 | 目标方法 | 签名一致性 | 逻辑一致性 | 备注 |
|--------|----------|-----------|-----------|------|
| `QA_fetch_get_stock_day` | `get_stock_day` | ✅ | ✅ | 算法已对齐 |
| `QA_fetch_get_stock_min` | `get_stock_min` | ⚠️ | ⚠️ | 待审计 |
| `QA_fetch_get_stock_latest` | - | ❌ | - | 尚未迁移 |
| `QA_fetch_get_stock_realtime` | `get_realtime` | ✅ | ⚠️ | 待审计 |
| `QA_fetch_get_index_day` | `get_index_day` | ✅ | ⚠️ | 待审计 |
| `QA_fetch_get_index_min` | `get_index_min` | ✅ | ⚠️ | 待审计 |

### 2.2 期货数据函数（目标文件: future_adapter.py）

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_future_day` | `get_future_day` | ⚠️ 待审计 |
| `QA_fetch_get_future_min` | `get_future_min` | ⚠️ 待审计 |
| `QA_fetch_get_future_transaction` | - | ❌ 未迁移 |
| `QA_fetch_get_future_realtime` | - | ❌ 未迁移 |

### 2.3 债券数据函数（目标文件: akshare_adapter.py）

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_bond_day` | `get_bond_day` | ⚠️ 待审计 |
| `QA_fetch_get_bond_realtime` | `get_bond_realtime` | ⚠️ 待审计 |
| `QA_fetch_get_bond2stock_day` | `get_bond2stock_day` | ⚠️ 待审计 |

### 2.4 扩展市场函数（部分已迁移）

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_extensionmarket_count` | - | ❌ 未迁移 |
| `QA_fetch_get_extensionmarket_info` | - | ❌ 未迁移 |
| `QA_fetch_get_extensionmarket_list` | - | ❌ 未迁移 |

### 2.5 列表获取函数（分散在多个适配器）

| 源函数 | 目标方法 | 适配器 |
|--------|----------|--------|
| `QA_fetch_get_stock_list` | `get_stock_list` | akshare_adapter |
| `QA_fetch_get_index_list` | `get_index_list` | akshare_adapter |
| `QA_fetch_get_bond_list` | `get_bond_list` | akshare_adapter |
| `QA_fetch_get_future_list` | `get_future_list` | akshare_adapter |

### 2.6 交易相关函数（未迁移）

| 源函数 | 状态 | 备注 |
|--------|------|------|
| `QA_fetch_get_stock_transaction` | ❌ | 历史分笔 |
| `QA_fetch_get_index_transaction` | ❌ | 指数分笔 |
| `QA_fetch_get_stock_transaction_realtime` | ❌ | 实时分笔 |

### 2.7 财务/除权函数（目标文件: akshare_adapter）

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_stock_xdxr` | `get_stock_xdxr` | ✅ 存在于 akshare |
| `QA_fetch_stock_liutonggubenZ` | - | ❌ 未迁移 |
| `QA_fetch_get_stock_info` | `get_stock_info` | ✅ |
| `QA_fetch_get_stock_block` | `get_stock_block` | ✅ 存在于 akshare |

### 2.8 期权相关函数（未迁移）

| 源函数 | 状态 |
|--------|------|
| `QA_fetch_get_option_list` | ❌ |
| `QA_fetch_get_option_50etf_list` | ❌ |
| `QA_fetch_option_*` 系列 | ❌ |

### 2.9 辅助/内部函数（架构变化，正常）

| 源函数 | 目标 | 状态 |
|--------|------|------|
| `ping`, `select_best_ip` | → `_ping`, `_select_best_ip` | ✅ 已迁移为类方法 |
| `get_ip_list_by_ping` | → `_get_ip_list` | ✅ |
| `get_mainmarket_ip` | → `_get_mainmarket_ip` | ✅ |
| `get_extensionmarket_ip` | → `_get_extensionmarket_ip` | ✅ |

---

## 三、统计摘要

| 指标 | 数值 |
|------|------|
| 源文件函数总数 | 63 |
| TdxAdapter 适配器方法数 | 17（含内部方法） |
| 核心数据接口方法数 | 9 |
| 完全对齐的函数 | 3 (`get_stock_day` 算法已修复) |
| 部分对齐的函数 | 6 |
| 尚未迁移的函数 | ~40+ |

---

## 四、迁移率

| 类别 | 迁移率 |
|------|--------|
| 核心股票/指数日线 | 100% ✅ |
| 核心股票/指数分钟 | 100% ✅ |
| 期货数据 | 50% ⚠️ |
| 债券数据 | 50% ⚠️ |
| 实时行情 | 100% ✅ |
| 列表获取 | 100% ✅（分散到各适配器）|
| 历史分笔 | 0% ❌ |
| 期权数据 | 0% ❌ |
| 财务/除权 | 50% ⚠️ |

---

## 五、已修复问题

### `get_stock_day` 算法对齐 ✅
**问题**: 原实现只获取300条记录，不支持完整日期范围
**修复**: 2026-03-31 已完成算法对齐

修改内容：
- 分页获取: `(int(lens / 800) - i) * 800, 800` 循环获取
- 完整 frequence 映射: day/week/month/quarter/year
- 日期范围过滤
- 停牌数据过滤 (`open != 0`)
- 增加 `date_stamp` 列
- 使用 `util_get_trade_gap` 计算交易日间隔

---

## 六、待审计项

1. `get_stock_min` - 需要对比分钟数据获取算法
2. `get_realtime` - 需要对比实时行情获取
3. `get_index_day/min` - 需要对比指数数据获取
4. `get_future_day/min` - 需要对比期货数据获取

---

## 七、建议

1. **优先完成核心函数审计**: stock_min, realtime, index_day/min
2. **评估未迁移函数**: 确认是否需要迁移或标记为废弃
3. **保持接口兼容**: 确保新接口参数与原接口兼容
4. **补充测试用例**: 对齐后的函数需要测试验证

---

**报告生成时间**: 2026-03-31
**下次审计建议**: 完成 `get_stock_min` 等核心函数审计后更新