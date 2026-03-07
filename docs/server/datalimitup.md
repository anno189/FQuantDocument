## datalimitup

说明：封板且120日新高。

更新：交易日每分钟，参见 [celery](celery.md)。

文件：CAnalysisRealTime.py

列：

```
'active2', 'code', 'open', 'high', 'low', 'close', 'vol', 's_vol',
 'b_vol', 'bid_vol1', 'ask_vol1', 'bid_vol2', 'ask_vol2', 'ask', 'bid',
 'liutongguben', 'ipo_date', 'zongguben', 'name', 'sse', 'ST', 'mtype',
 'ipodays', 'industry', 'industry1', 'industry2', 'index_', 'bond_id',
 'date', 'last_close', 'volume', 'amount', 'limitup', 'limitdo',
 'hprice', 'hcount', 'hstop', 'lstop', 'gx5', 'gx20', 'mvm5d',
 'liutongshizhi', 'sort_', 'HHVH120', 'LLVL120', 'HSL', 'RATE', 'RATE3',
 'RATE5', 'AMOUNT20', 'CF01B20', 'CF01B120', 'tag', 'RGene', 'new',
 'Rate120', 'memos', 'mint', 'R1', 'R2', 'R3', 'N3', 'N4', 'step',
 'gubenZ', 'rate', 'limit', 'volratio', 'time'
```


查看：

```
from direct_redis import DirectRedis
r = DirectRedis(host='localhost', port=6379)
r.get('datalimitup')
```

---


## ISSUE

- [ ] 精简列（节约内存）
- [ ] 120日板是否有价值或新增其他提醒推送



