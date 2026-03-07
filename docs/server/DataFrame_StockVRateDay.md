## DataFrame_StockVRateDay

说明：保存个股连续3分钟放量的次数及时间段

更新：交易日每分钟，参见 [celery](celery.md)。

文件：CAnalysisRealTime.py

列：

```
'code', 'name', 'datetime', 'volratio', 'count', 'rate'
```

- datetime: 放量时间，
- volratio: 量比
- count： 放量次数


查看：

```
from direct_redis import DirectRedis
r = DirectRedis(host='localhost', port=6379)
r.get('DataFrame_StockVRateDay')
```

---






