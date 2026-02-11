## DataFrame_Concept

  说明：概念列表。

  更新：交易日盘前9:05分更新，参见 [celery](celery.md)。

  文件：BBlock.py

  数据表：[code_stock_concept](http://47.52.36.164:8001/app/quantaxis/quantaxis/code_stock_concept/view)

  数据表：[code_stock_industry](http://47.52.36.164:8001/app/quantaxis/quantaxis/code_stock_industry/view)

  - [code_stock_industry 数据表说明](/db/code_stock_industry)

  - [code_stock_concept 数据表说明](/db/code_stock_concept)

  列：

  ```
  'code', 'name', 'n1name', 'count'
  ```

  
查看：

```
from direct_redis import DirectRedis
r = DirectRedis(host='localhost', port=6379)
r.get('DataFrame_Concept')
```



  
