## GetData API

### fetch_stock_list_bj: 取北交所代码

fetch_stock_list_bj()

return: dataframe

```
'code', 'name', 'zongguben', 'liutongguben', 'ipo_date', 'dq','updated_date'
```

### getMarketHighStock：取市场高标

getMarketHighStock(end_date, count=20)

​	count: 数量

return：dataframe

```
'code', 'name', 'RATE5', 'RATE10', 'RATE20'
```

### JsonMarketStatusData: 返回市场状态的判断

JsonMarketStatusData(end_date)

return：dataframe

```
'date', 'status_', 'recommend_', 'chance_', 'type_', 'ind_', 'ins_','emo_'
```

### get_future_day

get_future_day(code, start_date=None, end_date=None)

用途：
        get_future_day 的替代函数，仅在此处使用
        未使用 FutureData 类，直接自己取数了，QA 中的 get_future_day 需要修改，故未使用。

参数：
        code: 代码， 5_CNTY, 8_ATY
        start_date: 开始时间
        end_date: 结束时间

返回：
        DataFrame



### GetStockList: 全市场证券基本信息

GetStockList(end_date=None)

用途：

​	初始化函数组。获取全市场证券基本信息和基本面信息。

参数：

​	end_date: 指定时间

返回：DataFrame

```
'code', 'liutongguben', 'ipo_date', 'zongguben', 'name', 'sse', 'ST',
 'mtype', 'ipodays', 'industry', 'industry1', 'industry2', 'index_',
 'bond_id', 'date', 'last_close', 'low', 'high', 'volume', 'amount',
 'limitup', 'limitdo', 'hprice', 'hcount', 'hstop', 'lstop', 'gx5',
 'gx20', 'mvm5d', 'liutongshizhi', 'sort_', 'HHVH120', 'LLVL120', 'HSL',
 'RATE', 'RATE3', 'RATE5', 'AMOUNT20', 'CF01B20', 'CF01B120', 'tag',
 'RGene', 'new', 'Rate120', 'memos', 'mint', 'R1', 'R2', 'R3', 'N3',
 'N4', 'step', 'gubenZ', 'HSZ', 'adj'
```

使用说明：

- 每日开盘前初始化([celery 定时器](/server/celery)，InitData)当天证券列表并填入 redis 缓存 [DataFrame_StockList](/server/DataFrame_StockList)
- limitup/limitdown: 仅在当日运算根据 ST 情况运算涨跌停，其他时间不考虑 ST 情况。因为未保存历史 ST 变化情况。
- open, vol, bid_vol1, ask_vol1, bid_vol2, ask_vol2, ask, bid, bid1amo, ask1amo, oamo, vrate, orate, omemos, hsl, lb, 为当日竞价信息



def getMarketDataDays(start_date=None, end_date=None, lt=250, coll_data=DATABASE.market_data_base):
    #coll_data: DATABASE.market_data_base, DATABASE.market_data_extent, 
    #lt: 0, end_date; >0, start ~ end
    #
    


def getIndexExtentWeightDays(code, start_date, end_date, client=DATABASE):
    



def getIndexFactorDays(code, start_date, end_date, client=DATABASE):
    


def getIndexCorrDays(code, start_date, end_date, client=DATABASE):
    


def getIndexRateDays(code, start_date, end_date, date='str'):
    #取指数及净值，r+code 作为列代码
    #date包括 dt和str 两种可能，FQData 中存储为 datetime，自行运算存储为 str，为 merge 运算使用。


def getStockExtentDays(end_date=None, lists=None, columns=None,client=DATABASE):
    



def getStockFactorDays(end_date=None, lists=None, columns=None, client=DATABASE):
    


def getStrategyPoolsData(end_date=None, str_code=None, client=DATABASE):
    #str_code: list
    




#取横向切片的数据(每天)
def getDayData(end_date=None, lists=None, columns=None, coll=DATABASE.stock_data_factor):
    end_date = GLOBALMAP.TODAY() if end_date is None else QA_util_get_real_date(end_date)
    


#取纵向切片的数据(每股)
def getDaysDatas(end_date=None, start_date=None, lists=None, columns=None, coll=DATABASE.stock_data_factor):



#取策略池数据
def get_date_strategy_pools(end_date, strategy_code='str60', client=DATABASE):



def calu_limit(end_date, data_open=pd.DataFrame({}), client=DATABASE):
    #date, yestoday
    #data_open, today open
    #real, True：实盘，False：回测
    




def getliutongshizhiZ(end_date, stocklist_, client=DATABASE):





def CaluTomorrowRate(end_date, data, tomodays=10, col_ = None, days=True, today=True, client=DATABASE):
    #end_date: 起始日期
    #data：数据，需要包括收盘价，
    #输出需要包含，开盘涨幅，竞价成交金额，竞价成交量昨日占比。



def getRstopGene(end_date=None):
    '''
        #初始化函数组
        #涨停基因，统计近一年中所有涨停连板两次以上的个股名称及最高板
    '''





def get_stock_open_data(end_date, data=None, client=DATABASE):
    #data: pd, 代码列表




​        



def getlimitopen(end_date, days=15, tomodays=10, day_=True, today=True, client=DATABASE):
    #end_date: 开盘日期
    #days: 15, 15天 N 板
    #tommorrows: 输出后10天涨幅
    #days：True 输出列是日期还是 T0，T1个数
    #today：True 今天是否
    end_date = QA_util_get_real_date(end_date)





def update_limit_rate_csv(end_date=None):




def update_limit_date_recommend(end_date=None):




​    

