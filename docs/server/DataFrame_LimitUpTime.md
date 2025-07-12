## DataFrame_LimitUpTime

说明：首次涨停时间。

更新：交易日每分钟，参见 [celery](celery.md)。

文件：CAnalysisRealTime.py

列：

```
'code', 'time'
```


查看：

```
from direct_redis import DirectRedis
r = DirectRedis(host='localhost', port=6379)
r.get('DataFrame_LimitUpTime')
```

---



