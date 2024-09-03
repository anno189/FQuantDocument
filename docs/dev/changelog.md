## 更新日志：

### 2024.06.13

1. 算法：合并 redis 中的 stocklist和 stockdata，针对开盘集合竞价结果，优化stocklist的算法，提高后期运算效率。

### 2024.06.01

1. 算法：优化 xdxr 的数据运算，新增函数QA_SU_save_stock_xdxr_quick，每日下载xdxr 数据，仅更新新增 xdxr 和 adj。如果没有 xdxr 更新，则补充 adj 为1。
2. 算法：每日开盘前检查当日xdxr 信息，如果存在当日股本变化，则重新计算adj 数据，用于统一交易日当天的涨跌幅。
3. 算法：新增函数 check_adj_days，每日监测 adj 是否变化，如何变化，则重新运算对应的股票因子，待处理。

### 2024.04.22

1. 算法：修订 quantstat的版本升级导致的文件存储错误。

### 2024.04.04

1. 数据：维护 

   stock_data_base

   ，删除退市Delisting字段，修改字段名称，mvm5d和limitdo。

   1.  stock_data_base表新增索引，{date: 1, RGene:1}
   2. 重新运算数据表

2. 算法：marketInitStockBaseData新增 R1, N3, N4, 对应 stock_data_limit 中的信息。

   1. 新增文件 ToolsLimitData，新增函数 getlimitopen， CaluTomorrowRate
      1. getlimitopen中的推荐算法使用2021 ~ 2024年涨停数据统计。统计竞价买入，次日收盘止损或大于2的平均值大于0.5。相关文件：[涨停板研究](http://47.52.36.164:8002/notebooks/涨停板研究.ipynb)

3. 数据：维护 

   market_data_base

   1. 删除高标涨幅相关数据：T30amount、T30rate、T30dayrate、T50amount、T50rate、T50dayrate、T100amount、T100rate、T100dayrate
   2. 新增竞价涨停、竞价跌停、收盘涨停、收盘跌停、收盘高标跌停数据。从涉及竞价数据2016年开始。
   3. 重新运算数据。

### 2024.03.30

1. 数据：维护 

   stock_data_base

   ，使用未复权数据运算涨跌停价格

   1. 在开盘前运算当日 ST 的涨跌停数据 marketInitStockBaseData()
   2. 同步涨停信息 stock_data_limit 到2021年。

2. 数据：维护 [stock_data_limit](http://47.52.36.164:8001/app/quantaxis/quantaxis/stock_data_limit/view/1)，根据 stock_data_base的涨跌停数据，从聚宽中取数。

3. 算法：完善 

   stock_data_limit

    数据，增加烂板和大长腿的判断。

   1. 对应标识：烂板M，大长腿 V

### 2024.03.26

1. 数据：维护 

   market_data_base

   ，

   market_data_extent

    删除部分统计数据。

   1. 'ind_corr', 'len_ind_corr', 'ind_spcorr', 'len_ind_spcorr', 'ind_wr', 'len_ind_wr', 
   2. 'ins_corr', 'len_ins_corr', 'ins_spcorr', 'len_ins_spcorr', 'ins_wr', 'len_ins_wr', 
   3. 'con_corr', 'len_con_corr', 'con_spcorr', 'len_con_spcorr', 'con_wr', 'len_con_wr',
   4. GConCount, GCon, GIndCount, GInd

2. 数据：删除 stock_data_position。基金持仓数据。基本上不会用到。

### 2024.03.20

1. 算法：完善 

   stock_data_limit

    数据，增加 N 天 N 板以及板型数据

   1. 板型：一字，一字分歧，秒板(1分钟内涨停)，秒板分歧，强势(10分钟内涨停)，强势分歧
   2. 补充2015年起数据

### 2024.03.15

1. 算法：去除 corr选股及相关输出，去除选股结果叠加及相关输出。
2. 算法：增加公告过滤分类
3. 数据：[strategy_pools](http://47.52.36.164:8001/app/quantaxis/quantaxis/strategy_pools/view)，删除 bias36和 corr_all 的数据
4. 策略：新增辨识度选股

### 2024.02.09

1. 算法：更新QA_fetch_get_future_list，基金market从93变更为33
2. 数据：新增保存宽指基金数据。用于模拟盘回测。
   - 基金数据滞后，晚上10点或次日更新。
3. 算法：模拟盘，新增弱市投机开仓 ETF。
   1. 根据信号开仓大小盘基金。使用9支基金。

### 2024.02.02

1. 算法：根据竞价结果给出昨日涨停个股今日放量提示。
   1. 回测结果：昨日换手率在5~50，竞价超预期，竞价换手率0.5~5，成功率在40%~50%之间。
   2. 应用需结合日内行业，成交金额等。
2. 前端：不在显示行业放量4%
   1. 原因：无法应用。
   2. 数据：暂未去除运算部分。

### 2024.01.25

1. 数据：使用聚宽数据，更新完善竞价数据。函数get_call_auction。
   1. 数据从2022-01-01 ~ 2024-01-25，此后数据继续使用QA_fetch_get_stock_realtime在竞价结束后更新
   2. 聚宽成交量数据是通达信的100倍，需要降低数量级使用。
   3. 后续竞价数据将运算涨停板次日开盘结果，用于涨停板回测。
2. 数据：删除stock_data_init的存储及运算，使用stock_data_base 表，
3. 算法：剔除竞价15 ~25分钟的运算逻辑，原因为通达信数据已不可用。
4. 数据：涨停股涨停序列
   1. 应用：竞价结束后，推出选股结果。条件：超预期成功率50%，放量。
5. 源码：更新QADate_trade，交易日历库多了一天2021-09-20，必须删除！每年更新的时候需要检查。

### 2024.01.17

1. 数据：北交所涨停计算直接截取小数后两位，不使用四舍五入。并重新运算，更新stock_data_base数据表。
2. 更新package 版本，并消除影响
   1. pandas = 2.1.5，主要影响 groupby.sum()，fillna('ffill')
   2. quantstat=0.6，qs.HTML待处理
   3. 分离 block 函数。

### 2024.01.12

1. 新增DataFrame_StockData数据列 memos，标记空间、梯队、高标、中位、启动、低位、反包等信息。
2. 调整竞价结果显示，新增启动列，使用 memos 列。
3. 调整：实时市场→日内高标：±5，并分离北交所
4. 调整：盘中-情绪-今日跌停，显示分离北交所
5. 更新 python package，并重新更新redis 缓存。
   1. pandas 2不向下兼容redis 的保存数据，需要重新生成。
6. DataFrame_StockList新增 sse 列，盘中分离北交所使用
7. 发布 FWA 2.1.8.0112
8. 新增：盘中-实时-情绪指数：高标和中位的涨幅