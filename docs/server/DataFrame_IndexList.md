## DataFrame_IndexList

说明： 常用指数列表

更新：交易日盘前9:05分更新，参见 [celery](celery.md)。

- 数据表：[index_day](http://47.52.36.164:8001/app/quantaxis/quantaxis/index_day/view) 
- 数据表：
  - 指数：GLOBALMAP().BASEDATAPATH+'widthindex.csv' 
  - 三级行业
  - 概念

- 数据来源：通达信
- 文件：CMarket.py

列：

```
['code', 'name', 'type', 'pre_close', 'vol', 'amount', 'vrate', 'arate', 'pre_rate']
```

- vrate: 全市场成交量占比
- arate: 全市场成交金额占比
- type: 类型，'M', '', 'N', 'I3', 'C'
  - M: 宽指
  - N：产业链指数
  - C：概念
  - I3：三级行业



查看：

```
from direct_redis import DirectRedis
r = DirectRedis(host='localhost', port=6379)
r.get('DataFrame_IndexList')
```


---





