## Redis Data

### 调用

[direct_redis](https://github.com/yonghee12/direct-redis)：Serialize any python datatypes and does redis actions using redis-py。支持 pandas, numpy。

```python
from direct_redis import DirectRedis
r = DirectRedis(host='localhost', port=6379)

r.set('Today', '2024-01-01')
r.get('Today')
r.delete('Today')
```

### Key

#### 列表

|      | Key                                                       | 类型      | 说明             | 备注                                   |
| ---- | --------------------------------------------------------- | --------- | ---------------- | -------------------------------------- |
| 1    | [DataFrame_StockList](/server/DataFrame_StockList)       | DataFrame | 股票列表         |                                        |
| 2    | [DataFrame_BlockList](/server/DataFrame_BlockList)       | DataFrame | 板块列表         |                                        |
| 3    | [DataFrame_BaseInfoList](/server/DataFrame_BaseInfoList) | DataFrame | 基本财务数据     | 暂时未设置，未使用                     |
| 4    | [DataFrame_KZZbondList](/server/DataFrame_KZZbondList)   | DataFrame | 可转债列表       |                                        |
| 5    | [DataFrame_IndexList](/server/DataFrame_IndexList)       | DataFrame | 指数列表         |                                        |
| 6 | DataFrame_ConceptList   | DataFrame | 行业列表 | 可以合并到 BlockList |

#### 分时运算


|      | Key                                                         | 类型      | 说明             | 备注                                   |
| ---- | ----------------------------------------------------------- | --------- | ---------------- | -------------------------------------- |
| 1    | [DataFrame_StockVRate](/server/DataFrame_StockVRate)       | DataFrame | 量比运算临时数据 | 实时运算个股量比累计增加时使用         |
| 2    | [DataFrame_StockVRateDay](/server/DataFrame_StockVRateDay) | DataFrame | 量比结果数据     | 实时运算个股量比累计增加时使用         |
| 3    | [DataFrame_LimitUpTime](/server/DataFrame_LimitUpTime)     | DataFrame | 涨停时间         | 盘中实时保存涨停各股的时间，精确到分钟 |
| 4    | [datalimitup](/server/datalimitup)                         | DataFrame | 涨停打板跟踪     | 涨停且120日新高                        |
| 5    | GradeCalculateAmount2                                       | Dec(, 2)  | 预测市场资金量比 | 非实时运算，需要保存数据               |
| 6    | RTCOUNTTHRESHOLD                                            | str       | 日内做T标志      | BUY/SELL                               |
| 7    | [DataFrame_StockScoreDay](/server/DataFrame_StockScoreDay) | DataFrame | 分时个股打分     | 暂未使用                               |

#### 竞价

|      | Key                                                         | 类型      | 说明             | 备注                                                |
| ---- | ----------------------------------------------------------- | --------- | ---------------- | --------------------------------------------------- |
| 1    | [DataFrame_Realtime](/server/DataFrame_Realtime)           | DataFrame | 分时数据保存     |                                                     |
| 2    | AMOUNTRATE                                                  | dict, k:v | 成交金额分时权重 | 近一年分钟的平均值运算权重。                        |
| 3    | [DataFrame_BlockYestoday](/server/DataFrame_BlockYestoday) | DataFrame | 昨日高标数据保存 | '昨日涨停', '昨日上榜', '近期高标',用于取个股公告。 |

#### 临时存储

|      | Key              | 类型      | 说明                   | 备注                  |
| ---- | ---------------- | --------- | ---------------------- | --------------------- |
| 1    | getlbhyyb        | DataFrame | 东财龙虎榜营业部列表   | 临时保存，每日更新    |
| 2    | get_lhbyyb_date  | DataFrame | 东财龙虎榜每日榜单列表 | 临时保存，每日更新    |
| 3    | stock_mins_chart | DataFrame | 每日实时分时图股票列表 | 龙虎榜正反馈+竞价放量 |



### 已不使用，待清空

DataFrame_StockIncCount

DataFrame_predata/DataFrame_pretopdata: 竞价15,20,25分钟数据保存，因通达信数据传输方式改变，已无法使用。



---

### ISSUE

- [ ] DataFrame_ConceptList合并到DataFrame_IndexList
- [ ] datalimitup，跟踪逻辑待修订
- [ ] RTCOUNTTHRESHOLD, 删除标志
- [ ] AMOUNTRATE, 可以每分钟运算，并不影响效率
