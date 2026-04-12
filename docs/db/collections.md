# MongoDB 数据库集合详情

## 概述

本文档详细记录了 FQuant 项目 MongoDB 数据库 `quantaxis` 的所有集合信息。

## 数据库连接信息

| 配置项 | 值 |
|--------|-----|
| 数据库名 | `quantaxis` |
| MongoDB URI | `mongodb://10.211.55.16:27017/quantaxis` |
| 连接驱动 | PyMongo |
| 连接管理器 | FQBase.DataStore.mongo_client.MongoClientManager |

---

## 集合详情

### 1. stock_day - 个股日线数据

**说明:** 主板股票的日线行情数据，包含开高低收、成交量成交额等基本行情信息。

**索引:**
- `code_1_date_stamp_1`: 股票代码 + 日期戳复合索引
- `code_1`: 股票代码索引
- `date_1`: 日期索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 交易日期，格式 YYYY-MM-DD |
| code | string | 股票代码 |
| open | float | 开盘价 |
| close | float | 收盘价 |
| high | float | 最高价 |
| low | float | 最低价 |
| vol | float | 成交量（手） |
| amount | float | 成交金额（元） |
| date_stamp | float | 日期戳 |

---

### 2. stock_adj - 个股复权数据

**说明:** 个股前复权因子数据，用于将历史价格调整为复权后价格。

**索引:**
- `code_1_date_1`: 股票代码 + 日期复合索引 **(unique)**

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 交易日期 |
| code | string | 股票代码 |
| adj | float | 复权因子 |

---

### 3. stock_data_extent - 个股扩展数据

**说明:** 包含丰富技术指标因子的个股数据。

**索引:**
- `code_1_date_1`: 股票代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 交易日期 |
| code | string | 股票代码 |
| open | float | 开盘价（前复权） |
| high | float | 最高价（前复权） |
| low | float | 最低价（前复权） |
| close | float | 收盘价（前复权） |
| volume | float | 成交量 |
| amount | float | 成交金额 |
| adj | float | 复权因子 |
| ... | 71个字段 | 包含各种技术指标 |

---

### 4. stock_data_base - 个股基本数据

**说明:** 使用未复权价格的基本行情数据，用于计算涨跌停等需要精确价格的操作。

**索引:**
- `code_1_date_1`: 股票代码 + 日期复合索引
- `code_1`: 股票代码索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 交易日期 |
| code | string | 股票代码 |
| open | float | 开盘价（未复权） |
| last_close | float | 昨日收盘价（未复权） |
| low | float | 最低价 |
| high | float | 最高价 |
| volume | float | 成交量 |
| amount | float | 成交金额 |
| limitup | float | 次日涨停价（非ST） |
| limitdown | float | 次日跌停价（非ST） |
| hprice | int | 涨跌停标记 0/1/-1 |
| hcount | int | 连板数量 |
| hstop | int | 今日曾涨停 |
| lstop | int | 今日曾跌停 |
| gx5 | int | 短线情绪指标 |
| gx20 | int | 中线情绪指标 |
| minvolmean5day | float | 5日每分钟均量（用于量比计算） |
| delisting | int | 是否退市（低于1元或市值） |

---

### 5. stock_data_factor - 个股因子数据

**说明:** 包含各种技术因子的个股数据。

**索引:**
- `code_1_date_1`: 股票代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 交易日期 |
| code | string | 股票代码 |
| Vol100 | float | 量指标 |
| K09, D09, J09 | float | KDJ(9日) 指标 |
| K34, D34, J34 | float | KDJ(34日) 指标 |
| ... | 53个字段 | 各种技术因子 |

---

### 6. stock_data_corr - 个股相关性数据

**说明:** 用于计算个股与指数或板块的相关性数据。

**索引:**
- `code_1_date_1`: 股票代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 股票代码 |
| date | string | 交易日期 |
| Xaxis5, Yaxis5 | float | 5日相关性坐标 |
| Xaxis11, Yaxis11 | float | 11日相关性坐标 |
| Xaxis21, Yaxis21 | float | 21日相关性坐标 |
| weight5 | float | 5日权重 |

---

### 7. index_day - 指数日线数据

**说明:** 指数日线行情数据，包含涨跌家数统计。

**索引:**
- `code_1_date_stamp_1`: 指数代码 + 日期戳复合索引
- `date_1`: 日期索引
- `code_1`: 指数代码索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 交易日期 |
| code | string | 指数代码 |
| open | float | 开盘点位 |
| close | float | 收盘点位 |
| high | float | 最高点位 |
| low | float | 最低点位 |
| vol | float | 成交量 |
| amount | float | 成交金额 |
| up_count | int | 上涨家数 |
| down_count | int | 下跌家数 |
| date_stamp | float | 日期戳 |

---

### 8. index_data_factor - 指数因子数据

**说明:** 指数技术因子数据。

**索引:**
- `code_1_date_1`: 指数代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 交易日期 |
| code | string | 指数代码 |
| vol | float | 成交量 |
| up_count | int | 上涨家数 |
| down_count | int | 下跌家数 |
| Vol100 | float | 量指标 |
| K09, D09, J09 | float | KDJ(9日) 指标 |
| ... | 56个字段 | 各种技术因子 |

---

### 9. index_data_extent - 指数扩展数据

**说明:** 包含更多指标的指数扩展数据。

**索引:**
- `code_1_date_1`: 指数代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 交易日期 |
| code | string | 指数代码 |
| open | float | 开盘点位 |
| close | float | 收盘点位 |
| high | float | 最高点位 |
| low | float | 最低点位 |
| vol | float | 成交量 |
| amount | float | 成交金额 |
| up_count | int | 上涨家数 |
| ... | 53个字段 | 更多技术指标 |

---

### 10. index_data_corr - 指数相关性数据

**说明:** 指数间相关性数据。

**索引:**
- `code_1_date_1`: 指数代码 + 日期复合索引

---

### 11. industry_data_base - 行业基本数据

**说明:** 行业板块的基本行情统计数据。

**索引:**
- `code_1_date_1`: 行业代码 + 日期复合索引
- `date_1`: 日期索引
- `code_1`: 行业代码索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 行业代码 |
| name | string | 行业名称 |
| date | string | 交易日期 |
| type | string | 板块类型 |
| count | int | 成分股数量 |
| ma6020c | float | 60日均线收盘价 |
| mac2060 | float | 20日均线与60日均线差值 |
| u60 | int | 60日线上股数 |
| d60 | int | 60日线下股数 |

---

### 12. concept_data_base - 概念基本数据

**说明:** 概念板块的基本行情统计数据。

**索引:**
- `code_1_date_1`: 概念代码 + 日期复合索引
- `code_1_date_1_type_1`: 概念代码 + 日期 + 类型复合索引
- `date_1`: 日期索引

---

### 13. stock_block - 股票板块数据

**说明:** 股票所属板块信息。

**索引:**
- `code_1`: 股票代码索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 股票代码 |
| blockname | string | 板块名称 |
| type | string | 板块类型（概念/行业/风格） |

---

### 14. financial - 财务数据

**说明:** 个股财务报表数据，包含丰富的财务指标。

**索引:**
- `code_1`: 股票代码索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 股票代码 |
| report_date | string | 报告日期 |
| 001-587 | 各种类型 | 财务指标代码 |

**常用财务指标代码:**
| 代码 | 说明 |
|------|------|
| 001 | 报告类型 |
| 002 | 股票代码 |
| 003 | 公告日期 |
| 004 | 报告日期 |
| ... | 更多指标 |

---

### 15. stock_xdxr - 个股除权除息数据

**说明:** 股票的除权除息事件记录。

**索引:**
- `code_1_date_1_name_1`: 股票代码 + 日期 + 事件名称复合索引 **(unique)**

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 股票代码 |
| date | string | 除权除息日期 |
| category | string | 事件类别 |
| name | string | 事件名称 |
| fenhong | float | 分红金额 |
| peigujia | float | 配股价格 |
| songzhuangu | float | 送转股数量 |
| peigu | float | 配股数量 |
| suogu | float | 缩股数量 |
| liquidity_before | float | 变动前流通股本 |
| liquidity_after | float | 变动后流通股本 |

---

### 16. index_stocks - 指数成分股

**说明:** 指数的成分股列表及其变更日期。

**索引:**
- `code_1`: 股票代码索引
- `code_1_date_1`: 股票代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 成分股代码 |
| index_ | string | 指数代码 |
| date | string | 纳入/剔除日期 |

---

### 17. stock_data_limit - 个股涨停序列

**说明:** 记录股票涨停的详细信息。

**索引:**
- `date_1_code_1`: 日期 + 股票代码复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 股票代码 |
| date | string | 涨停日期 |
| start_ | string | 涨停开始时间 |
| end_ | string | 涨停结束时间 |
| ts_ | float | 封单金额（万元） |
| one_ | int | 是否为一字板 |
| N1, N2, N3 | int | 连板计数 |

---

### 18. stock_concept_hot_list - 概念热度列表

**说明:** 概念板块的热度排行数据。

**索引:**
- `code_1`: 概念代码索引
- `code_1_date_1`: 概念代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 日期 |
| code | string | 概念代码 |
| cname | string | 概念名称 |
| memo | string | 备注 |

---

### 19. market_data_base - 市场基本数据

**说明:** 全市场每日的行情统计。

**索引:**
- `date_1`: 日期索引
- `code_1`: 市场代码索引
- `code_1_date_1`: 市场代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 交易日期 |
| amount | float | 总成交额 |
| SHamount | float | 上海成交额 |
| SZamount | float | 深圳成交额 |
| amount300 | float | 沪深300成交额 |
| amount500 | float | 中证500成交额 |
| liutongshizhi | float | 流通市值 |
| liutongshizhi300 | float | 沪深300流通市值 |
| liutongshizhi500 | float | 中证500流通市值 |

---

### 20. market_data_extent - 市场扩展数据

**说明:** 扩展的市场统计数据。

**索引:**
- `code_1`: 市场代码索引
- `code_1_date_1`: 市场代码 + 日期复合索引

---

### 21. market_data_open - 竞价数据

**说明:** 集合竞价阶段的市场数据统计。

**索引:**
- `code_1`: 市场代码索引
- `code_1_date_1`: 市场代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 日期 |
| upcount | int | 上涨家数 |
| docount | int | 下跌家数 |
| u5count | int | 5日线上家数 |
| d5count | int | 5日线下家数 |
| vtoprate | float | 涨停股比例 |
| vtopzdb | float | 涨停股波动率 |
| v300rate | float | 沪深300涨跌家数比 |
| v300zdb | float | 沪深300波动率 |

---

### 22. market_status - 市场状态

**说明:** 当前市场状态信息。

**索引:**
- `date_1`: 日期索引
- `code_1`: 市场代码索引
- `code_1_date_1`: 市场代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 日期 |
| status_ | string | 市场状态 |
| recommend_ | string | 推荐状态 |
| chance_ | string | 机会状态 |
| type_ | string | 类型 |
| ind_ | string | 行业状态 |
| ins_ | string | 指数状态 |
| emo_ | string | 情绪状态 |

---

### 23. stock_info - 股票信息

**说明:** 股票的基本信息。

**索引:**
- `code_1`: 股票代码索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| market | string | 市场（SH/SZ） |
| code | string | 股票代码 |
| name | string | 股票名称 |
| liutongguben | float | 流通股本 |
| province | string | 省份 |
| industry | string | 所属行业 |
| updated_date | string | 更新日期 |
| ipo_date | string | 上市日期 |
| zongguben | float | 总股本 |
| guojiagu | float | 国家股 |

---

### 24. stock_list - 股票列表

**说明:** 主板股票列表基本信息。

**索引:**
- `_id_`: 默认索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 股票代码 |
| name | string | 股票名称 |
| sse | string | 交易所代码 |
| sec | string | 证券类别 |

---

### 25. stock_list_bj - 北交所股票列表

**说明:** 北京证券交易所股票列表。

**索引:**
- `code_1`: 股票代码索引 **(unique)**

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 股票代码 |
| name | string | 股票名称 |
| zongguben | float | 总股本 |
| liutongguben | float | 流通股本 |
| ipo_date | string | 上市日期 |
| dq | string | 地区 |
| updated_date | string | 更新日期 |

---

### 26. index_list - 指数列表

**说明:** 指数的基本信息列表。

**索引:**
- `code_1`: 指数代码索引
- `code_1_date_1`: 指数代码 + 日期复合索引

---

### 27. etf_list - ETF列表

**说明:** 交易所交易基金(ETF)基本信息。

**索引:**
- `code_1`: ETF代码索引
- `code_1_date_1`: ETF代码 + 日期复合索引

---

### 28. etf_day - ETF日线数据

**说明:** ETF日线行情数据。

**索引:**
- `code_1`: ETF代码索引
- `code_1_date_1`: ETF代码 + 日期复合索引

---

### 29. etf_min - ETF分钟数据

**说明:** ETF分钟级行情数据。

**索引:**
- `code_1`: ETF代码索引
- `code_1_date_1`: ETF代码 + 日期复合索引

---

### 30. bond_list - 债券列表

**说明:** 债券基本信息列表。

**索引:**
- `code_1`: 债券代码索引
- `code_1_date_1`: 债券代码 + 日期复合索引

---

### 31. cbnew_list - 可转债列表

**说明:** 可转换债券的详细信息。

**索引:**
- `bond_id_1_stock_id_1`: 债券ID + 股票ID复合索引
- `code_1`: 债券代码索引
- `code_1_date_1`: 债券代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| bond_id | string | 债券代码 |
| bond_nm | string | 债券名称 |
| stock_id | string | 正股代码 |
| stock_nm | string | 正股名称 |
| price_tips | float | 提示价格 |
| btype | string | 债券类型 |
| convert_price | float | 转股价 |
| redeem_price | float | 赎回价 |
| force_redeem_price | float | 强赎价 |

---

### 32. bond2stock_list - 可转债正股列表

**说明:** 可转债对应的正股股票列表。

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 正股代码 |
| name | string | 正股名称 |
| sse | string | 交易所 |
| sec | string | 证券类别 |

---

### 33. option_list - 期权列表

**说明:** 期权合约基本信息。

**索引:**
- `code_1`: 期权代码索引
- `code_1_date_1`: 期权代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| category | string | 期权类别 |
| market | string | 市场 |
| code | string | 期权代码 |
| name | string | 期权名称 |
| desc | string | 描述 |

---

### 34. future_list - 期货列表

**说明:** 期货合约基本信息。

**索引:**
- `code_1`: 期货代码索引
- `code_1_date_1`: 期货代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| category | string | 期货类别 |
| market | string | 市场 |
| code | string | 期货代码 |
| name | string | 期货名称 |
| desc | string | 描述 |

---

### 35. index_min - 指数分钟数据

**说明:** 指数分钟级行情数据。

**索引:**
- `code_1`: 指数代码索引
- `code_1_date_1`: 指数代码 + 日期复合索引

---

### 36. index_min_data_factor - 指数分钟因子数据

**说明:** 指数分钟级别的技术因子数据。

**索引:**
- `code_1_date_1_time_1`: 指数代码 + 日期 + 时间复合索引
- `code_1_date_1`: 指数代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 指数代码 |
| date | string | 日期 |
| time | string | 时间 |
| type | string | 数据类型 |
| CF01A20, CF01B20... | float | 各种因子值 |

---

### 37. stock_min - 股票分钟数据

**说明:** 股票分钟级行情数据。

**索引:**
- `_id_`: 默认索引

---

### 38. stock_week - 股票周线数据

**说明:** 股票周线行情数据。

**索引:**
- `code_1`: 股票代码索引
- `code_1_date_1`: 股票代码 + 日期复合索引

---

### 39. stock_month - 股票月线数据

**说明:** 股票月线行情数据。

**索引:**
- `code_1`: 股票代码索引
- `code_1_date_1`: 股票代码 + 日期复合索引

---

### 40. stock_year - 股票年线数据

**说明:** 股票年线行情数据。

**索引:**
- `code_1`: 股票代码索引
- `code_1_date_1`: 股票代码 + 日期复合索引

---

### 41. stock_data_open - 个股竞价数据

**说明:** 集合竞价阶段数据，用于计算涨停封单金额。

**索引:**
- `date_1_code_1`: 日期 + 股票代码复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 股票代码 |
| date | string | 日期 |
| price | float | 开盘价格 |
| vol | float | 成交量（手） |
| bid | float | 买盘金额（百元） |
| ask | float | 卖盘金额（百元） |
| bid_vol1 | float | 买一量（手） |
| bid_vol2 | float | 买二量（手） |
| ask_vol1 | float | 卖一量（手） |
| ask_vol2 | float | 卖二量（手） |

---

### 42. stock_data_open_extent - 个股竞价扩展数据

**说明:** 竞价阶段的扩展指标数据。

**索引:**
- `code_1_date_1`: 股票代码 + 日期复合索引 **(unique)**

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 股票代码 |
| date | string | 日期 |
| ar | float | 竞价涨幅 |
| vr | float | 竞价成交量比 |
| or | float | 竞价量比 |
| lb | float | 量比 |
| hsl | float | 换手率 |
| retreat | float | 回撤 |
| asort_ | float | 排序指标 |

---

### 43. stock_data_gubenZ - 流通股本数据

**说明:** 股票流通股本变动数据。

**索引:**
- `date_1_code_1`: 日期 + 股票代码复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| date | string | 日期 |
| code | string | 股票代码 |
| liutonggubenZ | float | 流通A股 |

---

### 44. stock_limit_block_0 - 涨停板块类型0

**说明:** 涨停股票的板块统计（类型0）。

**索引:**
- `date_1`: 日期索引
- `code_1`: 板块代码索引
- `code_1_date_1`: 板块代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| blockname | string | 板块名称 |
| scount | int | 涨停股数量 |
| srate | float | 涨停股比例 |
| date | string | 日期 |

---

### 45. stock_limit_block_1 - 涨停板块类型1

**说明:** 涨停股票的板块统计（类型1），包含更多衍生指标。

**索引:**
- `date_1`: 日期索引
- `code_1`: 板块代码索引
- `code_1_date_1`: 板块代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| blockname | string | 板块名称 |
| amean | float | 涨停股均价 |
| asum | float | 涨停股成交额总和 |
| acount | int | 涨停股数量 |
| bmean | float | 部分衍生指标 |
| bsum | float | 部分衍生指标 |
| bcount | int | 部分衍生指标 |
| cmean | float | 部分衍生指标 |

---

### 46. strategy_pools - 策略池

**说明:** 策略选股池记录。

**索引:**
- `code_1_date_1`: 股票代码 + 日期复合索引
- `code_1`: 股票代码索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 股票代码 |
| date | string | 日期 |
| pools | string | 策略池名称 |
| count | int | 出现次数 |

---

### 47. usersetting - 用户设置

**说明:** 用户个性化设置。

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| section | string | 配置区段 |
| exclude | string | 排除项 |
| default | string | 默认值 |

---

### 48. code_province - 省市代码表

**说明:** 股票所属省市代码对照表。

**索引:**
- `code_1`: 省市代码索引
- `code_1_date_1`: 省市代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| province | string | 省份 |
| name | string | 名称 |
| code | string | 股票代码 |

---

### 49. code_stock_concept - 概念代码表

**说明:** 概念板块代码对照表。

**索引:**
- `code_1`: 概念代码索引
- `code_1_date_1`: 概念代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 概念代码 |
| name | string | 概念名称 |
| n1name | string | 上级概念 |

---

### 50. code_stock_industry - 行业代码表

**说明:** 股票行业分类代码表，包含三级行业分类。

**索引:**
- `code_1`: 行业代码索引
- `code_1_date_1`: 行业代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| c1 | string | 一级行业代码 |
| n1 | string | 一级行业名称 |
| c2 | string | 二级行业代码 |
| n2 | string | 二级行业名称 |
| i2 | string | 二级行业指数 |
| c3 | string | 三级行业代码 |
| n3 | string | 三级行业名称 |
| i3 | string | 三级行业指数 |
| note | string | 备注 |

---

### 51. code_stock_yjhy - 业绩行业表

**说明:** 股票业绩行业分类。

**索引:**
- `code_1`: 股票代码索引
- `code_1_date_1`: 股票代码 + 日期复合索引

**字段说明:**
| 字段 | 类型 | 说明 |
|------|------|------|
| block | string | 行业板块 |
| name | string | 股票名称 |
| code | string | 股票代码 |

---

### 52. index_data_rps - 指数RPS数据

**说明:** 指数相对强弱指标数据。

**索引:**
- `code_1_date_1`: 指数代码 + 日期复合索引

---

### 53. test_collection - 测试集合

**说明:** 用于测试的集合。

---

## 数据分类汇总

### 行情数据类

| 集合 | 说明 |
|------|------|
| stock_day | 个股日线 |
| index_day | 指数日线 |
| stock_week | 个股周线 |
| stock_month | 个股月线 |
| stock_year | 个股年线 |
| stock_min | 个股分钟 |
| index_min | 指数分钟 |

### 因子数据类

| 集合 | 说明 |
|------|------|
| stock_data_factor | 个股因子 |
| stock_data_corr | 相关性数据 |
| index_data_factor | 指数因子 |
| index_data_corr | 指数相关性 |
| index_min_data_factor | 指数分钟因子 |

### 扩展数据类

| 集合 | 说明 |
|------|------|
| stock_data_extent | 个股扩展 |
| index_data_extent | 指数扩展 |

### 基本数据类

| 集合 | 说明 |
|------|------|
| stock_data_base | 个股基本（未复权，用于涨跌停计算） |
| concept_data_base | 概念数据 |
| industry_data_base | 行业数据 |
| market_data_base | 市场数据 |
| market_data_extent | 市场扩展 |

### 列表配置类

| 集合 | 说明 |
|------|------|
| stock_list | 股票列表 |
| stock_list_bj | 北交所股票 |
| index_list | 指数列表 |
| etf_list | ETF列表 |
| bond_list | 债券列表 |
| option_list | 期权列表 |
| future_list | 期货列表 |
| stock_info | 股票信息 |

### 板块数据类

| 集合 | 说明 |
|------|------|
| stock_block | 板块成分 |
| code_stock_industry | 行业分类 |
| code_stock_concept | 概念分类 |
| stock_concept_hot_list | 概念热度 |

### 事件数据类

| 集合 | 说明 |
|------|------|
| stock_xdxr | 除权除息 |
| stock_adj | 复权因子 |

### 涨停数据类

| 集合 | 说明 |
|------|------|
| stock_data_limit | 涨停序列 |
| stock_limit_block_0 | 涨停板块0 |
| stock_limit_block_1 | 涨停板块1 |
| stock_data_open | 竞价数据 |
| stock_data_open_extent | 竞价扩展 |

### 财务数据类

| 集合 | 说明 |
|------|------|
| financial | 财务报表 |
| stock_data_gubenZ | 流通股本 |

---

*文档更新时间: 2026-04-10*
