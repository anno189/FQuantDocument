## DataFrame_Realtime

说明：分时数据保存

更新：交易日每分钟，参见 [celery](celery.md)。

文件：CAnalysisRealTime.py

列：

```
'code', 'o', 'h', 'l', 'c', 'mv', 'avg', 'u', 'd', 's', 'ur', 'dr'
```

- mv：分钟最大换手
- avg：日内平均价格
- s: ['U', 'D']，c > avg / c < avg
- ur:  h/c
- dr:  l / min(c, o)


查看：

```
from direct_redis import DirectRedis
r = DirectRedis(host='localhost', port=6379)
r.get('DataFrame_Realtime')
```

---






