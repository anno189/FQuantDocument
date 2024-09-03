## DataFrame_StockVRate

说明：实时运算量比临时库。近5分钟数据。

更新：交易日每分钟，参见 [celery](celery.md)。

文件：CAnalysisRealTime.py

列：

```
'code', 'volratio_1', 'volratio_2', 'close_1', 'close_2', 'close_3',
 'close_4', 'close_5', 'count', 'vcount', 'tcount', 'mean', 'industry',
 'ipodays', 'name', 'close', 'volratio', 'rate', 'rup', 'rdown'
```

- count: 涨幅大于1.5% N 分钟
- vcount/tcount: 连续放量N分钟
- mean：分钟平均价
- rup：5分钟最小涨幅
- rdown: 5分钟最大跌幅

---





