# 通达信取数完全迁移方案

**源文件**: `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QAFetch/QATdx.py`
**目标模块**: `FQData.FQDataSource`
**创建时间**: 2026-03-31
**状态**: 待执行

---

## 一、背景与目标

### 1.1 背景

`QATdx.py` 是 FQData 原有的通达信数据获取模块，包含 63 个函数，涵盖了：
- A股日线/分钟线
- 指数数据
- 期货数据
- 期权数据
- 港股数据
- 全球市场数据
- 历史分笔
- 实时行情等

### 1.2 目标

将所有通达信特有函数迁移到 `FQData.FQDataSource` 模块，采用适配器模式：
- 继承 `DataSourceAdapter` 基类
- 统一接口风格
- 算法与原函数完全对齐

---

## 二、现有适配器结构

```
FQDataSource/
├── base.py                    # DataSourceAdapter 基类
├── tdx_adapter.py            # 通达信主适配器（已部分迁移）
├── akshare_adapter.py         # AkShare 适配器（多子类）
├── efinance_adapter.py         # EFinance 适配器
├── registry.py               # 数据源注册
├── facade.py                  # 统一入口
└── __init__.py
```

### 现有适配器

| 适配器 | 数据类型 | 状态 |
|--------|----------|------|
| `TdxAdapter` | A股日线/分钟/指数/期货 | ⚠️ 部分迁移，算法已对齐 |
| `AkShareAdapter` | 债券/港股/期权/宏观等 | ✅ 已完整实现 |
| `FutureAdapter` | 期货日线/分钟 | ✅ Akshare版 |
| `IndexAdapter` | 指数日线/分钟 | ✅ Akshare版 |
| `EFinanceAdapter` | A股日线/分钟 | ✅ 已实现 |

---

## 三、函数分类与目标适配器

### 3.1 股票数据类 → `TdxAdapter`

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_security_bars` | - | ❌ 内部API，可移除 |
| `QA_fetch_get_stock_day` | `get_stock_day` | ✅ 已迁移并对齐 |
| `QA_fetch_get_stock_min` | `get_stock_min` | ✅ 已迁移并对齐 |
| `QA_fetch_get_stock_latest` | - | ❌ 未迁移 |
| `QA_fetch_get_stock_realtime` | `get_realtime` | ⚠️ 待审计 |
| `QA_fetch_depth_market_data` | - | ❌ 未迁移 |
| `QA_fetch_get_stock_transaction` | - | ❌ 未迁移 |
| `QA_fetch_get_stock_transaction_realtime` | - | ❌ 未迁移 |

### 3.2 指数数据类 → `TdxAdapter`

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_index_day` | `get_index_day` | ✅ 已迁移并对齐 |
| `QA_fetch_get_index_min` | `get_index_min` | ✅ 已迁移并对齐 |
| `QA_fetch_get_index_latest` | - | ❌ 未迁移 |
| `QA_fetch_get_index_realtime` | - | ❌ 未迁移 |
| `QA_fetch_get_index_transaction` | - | ❌ 未迁移 |

### 3.3 债券数据类 → `TdxAdapter` 或 `BondAdapter`

| 源函数 | 目标方法 | 状态 | 备注 |
|--------|----------|------|------|
| `QA_fetch_get_bond_day` | - | ❌ 未迁移 | Akshare已有 |
| `QA_fetch_get_bond_min` | - | ❌ 未迁移 | Akshare已有 |
| `QA_fetch_get_bond_realtime` | - | ❌ 未迁移 | Akshare已有 |
| `QA_fetch_get_bond2stock_day` | - | ❌ 未迁移 | Akshare已有 |
| `QA_fetch_get_bond2stock_min` | - | ❌ 未迁移 | Akshare已有 |
| `QA_fetch_get_bond2stock_realtime` | - | ❌ 未迁移 | Akshare已有 |
| `QA_fetch_get_bond_list` | - | ❌ 未迁移 | Akshare已有 |

### 3.4 期货数据类 → `FutureAdapter` (Tdx)

**目标文件**: `future_tdx_adapter.py`（新建）

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_future_day` | `get_future_day` | ✅ 已迁移并对齐 |
| `QA_fetch_get_future_min` | `get_future_min` | ✅ 已迁移并对齐 |
| `QA_fetch_get_future_transaction` | `get_future_transaction` | ❌ 未迁移 |
| `QA_fetch_get_future_transaction_realtime` | `get_future_transaction_realtime` | ❌ 未迁移 |
| `QA_fetch_get_future_realtime` | `get_future_realtime` | ❌ 未迁移 |
| `QA_fetch_get_future_list` | `get_future_list` | ❌ 未迁移 |

### 3.5 港股数据类 → `HKStockAdapter` (Tdx)

**目标文件**: `hkstock_tdx_adapter.py`（新建）

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_hkstock_day` | `get_hkstock_day` | ❌ 未迁移 |
| `QA_fetch_get_hkstock_min` | `get_hkstock_min` | ❌ 未迁移 |
| `QA_fetch_get_hkstock_list` | `get_hkstock_list` | ❌ 未迁移 |
| `QA_fetch_get_hkstock_realtime` | `get_hkstock_realtime` | ❌ 未迁移 |
| `QA_fetch_get_hkindex_*` | - | ❌ 未迁移 |
| `QA_fetch_get_hkfund_*` | - | ❌ 未迁移 |

### 3.6 全球市场类 → `GlobalMarketAdapter` (Tdx)

**目标文件**: `global_tdx_adapter.py`（新建）

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_globalindex_*` | - | ❌ 未迁移 |
| `QA_fetch_get_globalfuture_*` | - | ❌ 未迁移 |
| `QA_fetch_get_goods_list` | - | ❌ 未迁移 |

### 3.7 期权数据类 → `OptionAdapter` (Tdx)

**目标文件**: `option_tdx_adapter.py`（新建）

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_option_list` | - | ❌ 未迁移 |
| `QA_fetch_get_option_50etf_*` | - | ❌ 未迁移 |
| `QA_fetch_get_option_300etf_*` | - | ❌ 未迁移 |
| `QA_fetch_get_commodity_option_*` | - | ❌ 未迁移 |
| `QA_fetch_get_option_all_contract_time_to_market` | - | ❌ 未迁移 |

### 3.8 扩展市场类 → `ExtensionMarketAdapter` (Tdx)

**目标文件**: `extension_tdx_adapter.py`（新建）

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_extensionmarket_count` | - | ❌ 未迁移 |
| `QA_fetch_get_extensionmarket_info` | - | ❌ 未迁移 |
| `QA_fetch_get_extensionmarket_list` | - | ❌ 未迁移 |
| `QA_fetch_get_stock_terminated` | - | ❌ 未迁移 |

### 3.9 汇率/宏观类 → 合并到现有适配器

| 源函数 | 目标适配器 | 状态 |
|--------|----------|------|
| `QA_fetch_get_exchangerate_list` | `ExchangeRateAdapter` (Akshare) | ✅ 已有 |
| `QA_fetch_get_exchangerate_day` | `ExchangeRateAdapter` (Akshare) | ✅ 已有 |
| `QA_fetch_get_macroindex_list` | `MacroIndexAdapter` (Akshare) | ✅ 已有 |
| `QA_fetch_get_macroindex_day` | `MacroIndexAdapter` (Akshare) | ✅ 已有 |

### 3.10 辅助/工具类

| 源函数 | 处理方式 | 状态 |
|--------|----------|------|
| `QA_fetch_get_stock_xdxr` | 合并到 `TdxAdapter` | ❌ 未迁移 |
| `QA_fetch_stock_liutonggubenZ` | 工具函数 | ❌ 未迁移 |
| `QA_fetch_get_stock_info` | 合并到 `TdxAdapter` | ❌ 未迁移 |
| `QA_fetch_get_stock_block` | 合并到 `TdxAdapter` | ❌ 未迁移 |
| `QA_fetch_get_tdx_industry` | 工具函数 | ❌ 未迁移 |
| `QA_data_stock_to_liutonggubenZ` | 工具函数 | ❌ 未迁移 |
| `QA_fetch_get_wholemarket_list` | 工具函数 | ❌ 未迁移 |

---

## 四、新增适配器文件结构

```
FQDataSource/
├── base.py                       # 基类（不变）
├── tdx_adapter.py                 # TdxAdapter（已迁移：股票/指数/期货）
│
├── tdx_future_adapter.py         # 新建：期货（TdxExHq_API）
├── tdx_hkstock_adapter.py        # 新建：港股
├── tdx_global_adapter.py         # 新建：全球市场
├── tdx_option_adapter.py         # 新建：期权
├── tdx_extension_adapter.py       # 新建：扩展市场
├── tdx_transaction_adapter.py    # 新建：历史分笔
│
├── akshare_adapter.py            # AkShare（不变）
├── efinance_adapter.py           # EFinance（不变）
├── registry.py                   # 注册（更新）
├── facade.py                     # 门面（更新）
└── __init__.py                  # 导出（更新）
```

---

## 五、迁移优先级

### 第一优先级（核心功能，必须迁移）

| 优先级 | 函数组 | 原因 |
|--------|--------|------|
| P0 | `get_stock_day/min` | ✅ 已完成 |
| P0 | `get_index_day/min` | ✅ 已完成 |
| P0 | `get_future_day/min` | ✅ 已完成 |
| P1 | `get_future_transaction` | 核心功能 |
| P1 | `get_hkstock_day/min` | 港股数据 |
| P1 | `get_option_*` | 期权数据 |

### 第二优先级（重要但非核心）

| 优先级 | 函数组 | 原因 |
|--------|--------|------|
| P2 | `get_stock_latest` | 最新行情 |
| P2 | `get_index_latest` | 指数最新 |
| P2 | `get_bond_*` | 债券数据 |
| P2 | `get_extensionmarket_*` | 市场列表 |

### 第三优先级（可选/低频）

| 优先级 | 函数组 | 原因 |
|--------|--------|------|
| P3 | `get_globalindex/future` | 全球市场 |
| P3 | `get_macroindex` | 宏观指标 |
| P3 | `get_exchangerate` | 汇率数据 |

---

## 六、TdxExHq_API 相关函数详解

### 6.1 期货市场 (Market ID)

| Category | 名称 | 说明 |
|----------|------|------|
| 2 | 渤商所 | 渤海商品 |
| 3 | 期货（主力） | - |
| 5 | 期货（指数） | 899050 |
| 6 | 期货（指定） | - |
| 8 | 现货指数 | - |
| 27 | 港股指数 | - |
| 28 | 郑州商品 | - |
| 29 | 大连商品 | - |
| 30 | 上海期货 | - |
| 31 | 港股主板 | - |
| 33 | 开放式基金 | - |
| 34 | 货币型基金 | - |
| 37 | 全球指数 | - |
| 38 | 宏观指标 | - |
| 40 | 中国概念股 | - |
| 41 | 美股知名公司 | - |
| 42 | 商品指数 | - |
| 46 | 上海黄金 | - |
| 47 | 中金所期货 | - |
| 48 | 港股创业板 | - |
| 49 | 港股基金 | - |
| 50 | 渤海商品 | - |
| 56 | 阳光私募基金 | - |
| 57 | 券商集合理财 | - |
| 58 | 券商货币理财 | - |
| 60 | 主力期货合约 | - |
| 70 | 扩展板块指数 | - |
| 71 | 港股通 | - |
| 74 | 美国股票 | - |
| 76 | 齐鲁商品 | - |
| 77 | 新加坡期货 | - |

### 6.2 分笔数据参数

```python
# 历史分笔
apix.get_history_transaction_data(market, code, offset, size, date)
# 实时分笔
apix.get_transaction_data(market, code, offset, size)
```

---

## 七、算法对齐清单

### 7.1 已对齐函数

| 函数 | 状态 | 对齐内容 |
|------|------|----------|
| `get_stock_day` | ✅ | 分页800、lens计算、停牌过滤、date_stamp |
| `get_stock_min` | ✅ | 分页800、lens*240、20800上限、date_stamp/time_stamp |
| `get_index_day` | ✅ | index_bars API、ETF区分、date_stamp |
| `get_index_min` | ✅ | index_bars API、lens*240*2.5、208000上限 |
| `get_future_day` | ✅ | 分页700、category映射、date_stamp |
| `get_future_min` | ✅ | 分页700、lens*240*2.5、20800上限 |

### 7.2 待对齐函数

| 函数 | 缺失内容 |
|------|----------|
| `get_stock_realtime` | 多票批量获取 |
| `get_index_realtime` | 指数实时 |
| `get_bond_*` | 债券相关 |
| `get_hkstock_*` | 港股数据 |
| `get_option_*` | 期权数据 |

---

## 八、依赖关系

### 8.1 内部依赖

```
TdxAdapter
├── get_stock_day     # 依赖: _get_mainmarket_ip, code_to_6digit
├── get_stock_min     # 依赖: _get_mainmarket_ip, code_to_6digit, util_get_trade_gap
├── get_index_day     # 依赖: _get_mainmarket_ip, code_to_6digit, util_get_trade_gap
├── get_index_min     # 依赖: _get_mainmarket_ip, code_to_6digit, util_get_trade_gap
└── get_future_*     # 依赖: _get_extensionmarket_ip (TdxExHq_API)

ExtensionMarketAdapter (NEW)
├── get_extensionmarket_list  # 依赖: _get_extensionmarket_ip
├── get_extensionmarket_info
└── get_extensionmarket_count

FutureAdapter (NEW via TdxExHq_API)
├── get_future_day            # 依赖: extension_market_list
├── get_future_min
├── get_future_transaction
└── get_future_realtime

HKStockAdapter (NEW via TdxExHq_API)
├── get_hkstock_day
├── get_hkstock_min
└── get_hkstock_list
```

### 8.2 外部依赖

| 依赖 | 用途 |
|------|------|
| `pytdx.hq.TdxHq_API` | A股、指数 |
| `pytdx.exhq.TdxExHq_API` | 期货、期权、港股 |
| `FQBase.Date.trade.util_get_trade_gap` | 交易日计算 |
| `FQBase.Date.timestamp.util_date_stamp` | 日期戳 |
| `FQBase.Date.timestamp.util_time_stamp` | 时间戳 |
| `FQBase.Util.codec.code_to_6digit` | 代码格式化 |

---

## 九、执行计划

### 阶段一：核心适配器完善（TdxAdapter）

1. [x] `get_stock_day` - ✅ 已完成
2. [x] `get_stock_min` - ✅ 已完成
3. [x] `get_index_day` - ✅ 已完成
4. [x] `get_index_min` - ✅ 已完成
5. [x] `get_future_day` - ✅ 已完成
6. [x] `get_future_min` - ✅ 已完成
7. [ ] `get_stock_realtime` - 待实现
8. [ ] `get_index_realtime` - 待实现
9. [ ] `get_stock_info` - 待实现

### 阶段二：新建期货适配器

1. [ ] 创建 `tdx_future_adapter.py`
2. [ ] 实现 `get_future_transaction`
3. [ ] 实现 `get_future_transaction_realtime`
4. [ ] 实现 `get_future_realtime`
5. [ ] 实现 `get_future_list`

### 阶段三：新建港股适配器

1. [ ] 创建 `tdx_hkstock_adapter.py`
2. [ ] 实现 `get_hkstock_day`
3. [ ] 实现 `get_hkstock_min`
4. [ ] 实现 `get_hkstock_list`
5. [ ] 实现 `get_hkstock_realtime`

### 阶段四：新建期权适配器

1. [ ] 创建 `tdx_option_adapter.py`
2. [ ] 实现期权列表获取
3. [ ] 实现期权日线/分钟线

### 阶段五：扩展市场与辅助

1. [ ] 创建 `tdx_extension_adapter.py`
2. [ ] 创建 `tdx_global_adapter.py`
3. [ ] 迁移辅助函数

### 阶段六：注册与集成

1. [ ] 更新 `registry.py` 注册新适配器
2. [ ] 更新 `facade.py` 统一入口
3. [ ] 更新 `__init__.py` 导出

---

## 十、风险与注意事项

### 10.1 API 限制

- **分笔数据**：需要高权限，可能被拒绝
- **实时数据**：需要持续连接，断线需重连
- **期货夜盘**：特殊时间段处理

### 10.2 数据一致性

- 日期格式：`YYYY-MM-DD` vs `YYYYMMDD`
- 时间戳：北京时间 vs UTC
- 复权数据：原接口不支持，标记为 TODO

### 10.3 性能考虑

- 分页大小：股票 800，期货 700
- 并发连接：TdxHq_API 支持 multithread
- 缓存策略：IP 列表缓存 86400 秒

---

## 十一、验收标准

### 11.1 功能验收

- [ ] 所有 `get_*` 方法能正确获取数据
- [ ] 输出 DataFrame 格式与原函数一致
- [ ] 异常处理与原函数一致

### 11.2 算法验收

- [ ] 分页逻辑一致
- [ ] 日期计算一致
- [ ] 输出列一致（含 `date_stamp`、`time_stamp`）

### 11.3 接口验收

- [ ] 继承 `DataSourceAdapter`
- [ ] 统一异常类型
- [ ] 支持 `ip`、`port` 参数覆盖

---

**文档版本**: v1.0
**下次更新**: 阶段一完成后