## DataFrame_StockScoreDay

说明：实时个股打分。每分钟运算。

更新：交易日每分钟，参见 [celery](celery.md)。

文件：CAnalysisRealTime.py

列：

```
['code', 'score', '09:31', '09:32', '09:33', '09:34', '09:35', '09:36',
       '09:37', '09:38',
       ...
       '14:54', '14:55', '14:56', '14:57', '14:58', '14:59', 'limit', 'rate',
       'count', '15:00'],
```

- score: 评分
- limit: 涨跌停次数，[241, -241]，每分钟累计
- rate：[DataFrame_StockVRate](DataFrame_StockVRate.md).count
- count：量价提升，分钟合计


查看：

```
from direct_redis import DirectRedis
r = DirectRedis(host='localhost', port=6379)
r.get('DataFrame_StockScoreDay')
```

---








