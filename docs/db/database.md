## 基础数据表

- 指数

  - future_day 扩展数据
  - index_day 指数数据
  - index_option_50etf_qvix 50ETF 期权
  - ~~owner_index_day~~

- 个股

  - stock_day

  - stock_week

  - stock_xdxr

  - bond2stock_day 可转债数据

  - financial 个股财务数据

## 运算数据表

- 全市场

  - market_data_base 市场基本统计数据

  - market_data_extent 市场扩展统计数据

  - market_data_open 

  - market_status 市场状态分析

- 指数/板块

  - index_data_corr

  - index_data_factor

  - index_data_extent

  - index_data_rps

  - index_min_data_factor 指数分钟指标数据

  - concept_data_base 概念基本统计数据

  - industry_data_base 行业基本统计数据

- 个股

  - stock_data_base

  - stock_data_corr

  - stock_data_extent

  - stock_data_factor

  - stock_data_limit

  - stock_data_open

  - stock_data_rps

  - stock_data_week_extent

  - stock_adj

## [基础代码表](db/basecode.md)

- 基础数据

  - code_province 省市表，外部数据导入
  - stock_concept 概念表，外部数据导入
  - stock_industry 行业表，外部数据导入

- 指数

  - future_list 扩展数据列表
  - index_list 指数列表

- 个股

  - stock_info， 基本信息
  - stock_list，主板个股列表
  - stock_list_bj，北交所个股列表
  - bond2stock_list 可转债列表
  - cbnew_list 可转债列表对照表，数量来源：集思录

- 成份股

  - index_stocks 指数成份股

  - stock_block 通达信板块成分表，包括概念、三级行业、风格

## 回测数据表

- 选股池
  - strategy_pools
- 回测信息
  - pools_networth
  - pools_tradelog
  - pools_owner
  - pools_traderecord



## Stock_data_base 个股基本数据

- 价格使用未复权数据（复权后数据运算涨跌停会存在0.01元的误差，导致涨跌停和连板运算不正确），其他个股数据表均保存前复权数据，并使用前复权数据运算。
- 涨跌停价格为次日，均按照非 ST 运算，ST 股的涨跌停在开盘初始化的时候运算
  - market.marketInitStockBaseData()
  - 其他统计ST 不参与运算，
    - 原则上不交易 ST
    - ST 状态为动态的，暂无数据。

```text-plain
 "date": "2009-12-29", 日期
 "code": "601299", 时间
 "open": 4.92, 开盘价格
 "last_close": 4.83, 收盘价格
 "low": 4.8, 最低价格
 "high": 5.01, 最高价格
 "volume": 9753615, 成交量，单位：手
 "amount": 5591718190, 成交金额，单位：元
 "limitup": 5.31, 次日涨停价格
 "limitdown": 4.35, 次日跌停价格
 "hprice": 0, 涨跌停，0/1/-1
 "hcount": 0, 连板数量
 "hstop": 0, 今日曾涨停
 "lstop": 0, 今日曾跌停
 "gx5": 0, 短线情绪
 "gx20": 0, 中线情绪
 "minvolmean5day": 40640.06, 每分钟成交量（用于计算分时量比）
 "Delisting": 0 是否退市（低于1元或市值）
```

## stock_data_open 个股竞价数据表

- 开始时间：2016-01-04，历史数据从聚宽取数。2023年2月后，从通达信实盘获取。
  - 不包含2015年涨停数据是因为2015年涨停太多了，数据样本失真。
- 若当日未能获取数据，需要从聚宽中补充数据。
- 因为服务器的响应原因，数据在9:27分保存。
- 买①，卖①，用于运算涨跌停封单金额。

```text-plain
"code": "000001", 代码
"date": "2022-01-04", 日期
"price": 16.48, 开盘价格
"vol": 10579.09, 成交量，单位：手
"ask": 3908, #卖盘金额，单位：百元
"bid": 3546.91, #买盘金额，单位：百元
"ask_vol1": 906, 卖①，单位：手
"ask_vol2": 1754, 卖②，单位：手
"bid_vol1": 905.91, 买①，单位：手
"bid_vol2": 59 买②，单位：手
```

## stock_data_limit 个股涨停序列

- 开始时间: 2016-01-01，历史时间从聚宽取数。
  - 不包含2015年涨停数据是因为2015年涨停太多了，数据样本失真。