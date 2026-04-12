# Tdx Adapter 功能审计报告

**审计时间**: 2026-03-31
**审计路径**: `FQDataSource/adapters/tdx/`
**审计结果**: ✅ 功能完整

---

## 一、功能统计

| 类别 | 文件 | 方法数 |
|------|------|--------|
| **股票** | stock.py | 7 |
| **指数** | index.py | 2 |
| **债券** | bond.py | 4 |
| **期货** | future.py | 5 |
| **港股** | hkstock.py | 5 |
| **期权** | option.py | 13 |
| **扩展市场** | extension.py | 14 |
| **宏观数据** | macro.py | 2 |
| **汇率数据** | exchange.py | 2 |
| **实时行情** | realtime.py | 5 |
| **分笔数据** | transaction.py | 3 |
| **工具函数** | tools.py | 7 |
| **IP管理** | ip_selector.py | 4 |
| **总计** | | **71** |

---

## 二、详细功能清单

### 2.1 股票数据 (TdxStockAdapter)

| 方法 | 功能 | 频率 |
|------|------|------|
| `get_stock_list()` | 获取股票列表 | - |
| `get_index_list()` | 获取指数列表 | - |
| `get_bond_list()` | 获取债券列表 | - |
| `get_bond2stock_list()` | 获取可转债正股列表 | - |
| `get_stock_day()` | 获取股票日线 | day/week/month/quarter/year |
| `get_stock_min()` | 获取股票分钟 | 1/5/15/30/60min |
| `get_stock_info()` | 获取股票信息 | - |
| `get_stock_xdxr()` | 获取除权除息数据 | - |
| `get_stock_block()` | 获取股票板块数据 | - |

### 2.2 指数数据 (TdxIndexAdapter)

| 方法 | 功能 | 频率 |
|------|------|------|
| `get_index_day()` | 获取指数日线 | day/week/month/quarter/year |
| `get_index_min()` | 获取指数分钟 | 1/5/15/30/60min |

### 2.3 债券数据 (TdxBondAdapter)

| 方法 | 功能 | 频率 |
|------|------|------|
| `get_bond_day()` | 获取债券日线 | day |
| `get_bond_min()` | 获取债券分钟 | 1/5/15/30/60min |
| `get_bond2stock_day()` | 获取可转债日线 | day |
| `get_bond2stock_min()` | 获取可转债分钟 | 1/5/15/30/60min |

### 2.4 期货数据 (TdxFutureAdapter)

| 方法 | 功能 | 频率 |
|------|------|------|
| `get_extensionmarket_list()` | 获取期货市场列表 | - |
| `get_future_day()` | 获取期货日线 | day |
| `get_future_min()` | 获取期货分钟 | 1/5/15/30/60min |
| `get_future_realtime()` | 获取期货实时行情 | - |
| `get_future_transaction()` | 获取期货历史分笔 | - |
| `get_future_transaction_realtime()` | 获取期货实时分笔 | - |

### 2.5 港股数据 (TdxHKStockAdapter)

| 方法 | 功能 | 频率 |
|------|------|------|
| `get_hkstock_day()` | 获取港股日线 | day |
| `get_hkstock_min()` | 获取港股分钟 | 1/5/15/30/60min |
| `get_hkstock_realtime()` | 获取港股实时行情 | - |
| `get_hkindex_day()` | 获取港指日线 | day |
| `get_hkindex_min()` | 获取港指分钟 | 1/5/15/30/60min |

### 2.6 期权数据 (TdxOptionAdapter)

| 方法 | 功能 |
|------|------|
| `get_option_day()` | 获取期权日线 |
| `get_option_min()` | 获取期权分钟 |
| `get_option_realtime()` | 获取期权实时行情 |
| `get_option_50etf_contract_time_to_market()` | 50ETF期权合约到期日 |
| `get_option_300etf_contract_time_to_market()` | 300ETF期权合约到期日 |
| `get_commodity_option_CF_contract_time_to_market()` | 商品期权(PTA)合约到期日 |
| `get_commodity_option_RU_contract_time_to_market()` | 商品期权(橡胶)合约到期日 |
| `get_commodity_option_C_contract_time_to_market()` | 商品期权(棉花)合约到期日 |
| `get_commodity_option_CU_contract_time_to_market()` | 商品期权(铜)合约到期日 |
| `get_commodity_option_AU_contract_time_to_market()` | 商品期权(黄金)合约到期日 |
| `get_commodity_option_AL_contract_time_to_market()` | 商品期权(铝)合约到期日 |
| `get_commodity_option_M_contract_time_to_market()` | 商品期权(豆粕)合约到期日 |
| `get_commodity_option_SR_contract_time_to_market()` | 商品期权(白糖)合约到期日 |
| `get_option_all_contract_time_to_market()` | 所有期权合约到期日 |

### 2.7 扩展市场 (TdxExtensionAdapter)

| 方法 | 功能 |
|------|------|
| `get_extensionmarket_count()` | 获取扩展市场数量 |
| `get_extensionmarket_info()` | 获取扩展市场信息 |
| `get_extensionmarket_list()` | 获取扩展市场列表 |
| `get_future_list()` | 获取期货列表 |
| `get_goods_list()` | 获取商品列表 |
| `get_globalindex_list()` | 获取全球指数列表 |
| `get_globalfuture_list()` | 获取国际期货列表 |
| `get_hkstock_list()` | 获取港股列表 |
| `get_hkindex_list()` | 获取港指列表 |
| `get_hkfund_list()` | 获取港基金列表 |
| `get_usstock_list()` | 获取美股列表 |
| `get_option_list()` | 获取期权列表 |
| `get_stock_terminated()` | 获取终止上市股票 |
| `get_macroindex_list()` | 获取宏观指数列表 |
| `get_exchange_rate_list()` | 获取汇率列表 |

### 2.8 宏观数据 (TdxMacroAdapter)

| 方法 | 功能 | 频率 |
|------|------|------|
| `get_macroindex_day()` | 获取宏观指数日线 | day |
| `get_macroindex_min()` | 获取宏观指数分钟 | 1/5/15/30/60min |

### 2.9 汇率数据 (TdxExchangeAdapter)

| 方法 | 功能 | 频率 |
|------|------|------|
| `get_exchange_rate_day()` | 获取汇率日线 | day |
| `get_exchange_rate_min()` | 获取汇率分钟 | 1/5/15/30/60min |

### 2.10 实时行情 (TdxRealtimeAdapter)

| 方法 | 功能 |
|------|------|
| `get_stock_realtime()` | 获取股票实时行情 |
| `get_index_realtime()` | 获取指数实时行情 |
| `get_bond_realtime()` | 获取债券实时行情 |
| `get_depth_market_data()` | 获取深度市场数据 |
| `get_realtime()` | 通用实时行情接口 |

### 2.11 分笔数据 (TdxTransactionAdapter)

| 方法 | 功能 |
|------|------|
| `get_stock_transaction()` | 获取股票历史分笔 |
| `get_index_transaction()` | 获取指数历史分笔 |
| `get_stock_transaction_realtime()` | 获取股票实时分笔 |

### 2.12 工具函数 (TdxToolsAdapter)

| 方法 | 功能 |
|------|------|
| `get_security_bars()` | 获取证券K线 |
| `get_wholemarket_list()` | 获取全市场列表 |
| `get_tdx_industry()` | 获取通达信行业分类 |
| `get_stock_latest()` | 获取股票最新K线 |
| `get_bond2stock_realtime()` | 获取可转债正股实时 |
| `get_index_latest()` | 获取指数最新K线 |
| `get_stock_liutonggubenZ()` | 获取流通股本数据 |

### 2.13 IP管理 (TdxIPSelector)

| 方法 | 功能 |
|------|------|
| `get_ip_list()` | 获取可用IP列表 |
| `get_best_ip()` | 获取最优IP |
| `get_mainmarket_ip()` | 获取主板市场IP |
| `get_extensionmarket_ip()` | 获取扩展市场IP |

---

## 三、支持的频率类型

| 频率 | 代码 | 支持市场 |
|------|------|----------|
| 日线 | day | 股票/指数/期货/债券/期权/宏观/汇率 |
| 周线 | week | 股票/指数/期货 |
| 月线 | month | 股票/指数/期货 |
| 季线 | quarter | 股票/指数/期货 |
| 年线 | year | 股票/指数/期货 |
| 1分钟 | 1min/1m/one | 股票/指数/期货/债券/宏观/汇率 |
| 5分钟 | 5min/5m/five | 股票/指数/期货/债券/宏观/汇率 |
| 15分钟 | 15min/15m/fifteen | 股票/指数/期货/债券/宏观/汇率 |
| 30分钟 | 30min/30m/half | 股票/指数/期货/债券/宏观/汇率 |
| 60分钟 | 60min/60m/1h | 股票/指数/期货/债券/宏观/汇率 |

---

## 四、支持的数据库操作

| 方法 | 功能 |
|------|------|
| `get_stock_liutonggubenZ()` | MongoDB获取流通股本 |

---

## 五、审计结论

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 股票数据 | ✅ | 7个方法，支持日线和分钟线 |
| 指数数据 | ✅ | 2个方法，支持日线和分钟线 |
| 债券数据 | ✅ | 4个方法，支持可转债 |
| 期货数据 | ✅ | 5个方法，支持分笔 |
| 港股数据 | ✅ | 5个方法，支持实时 |
| 期权数据 | ✅ | 13个方法，支持13种期权 |
| 扩展市场 | ✅ | 14个方法 |
| 宏观数据 | ✅ | 2个方法 |
| 汇率数据 | ✅ | 2个方法 |
| 实时行情 | ✅ | 5个方法 |
| 分笔数据 | ✅ | 3个方法 |
| 工具函数 | ✅ | 7个方法 |
| IP管理 | ✅ | 4个方法 |

**最终结论**: ✅ **功能完整**，共71个公共方法，覆盖股票、指数、债券、期货、港股、期权、宏观、汇率等市场
