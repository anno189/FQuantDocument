# stock_open_mins0

说明：临时保存统计个股状态

更新：交易日龙虎榜更新，竞价结束后分析。

文件：CAnalysisRealTime.py / ToolsLhbData.py

列：

```
'code', 'data', 'sign'
```

- code:代码
- date: 时间
- sign: 标记
  - FX: 龙虎榜负反馈，保存为下一个交易日，`每日盘后运算龙虎榜时更新`
  - JJ: 竞价放量，换手大于0.7%，`每日竞价后更新`
  - RA: 竞价涨幅超3%，`每日竞价后更新`
  - CYQ: 断板竞价高开超预期，`每日竞价后更新`
  - YQ0：昨日涨停符合预期，`每日竞价后更新`
  - YQ1：昨日涨停超预期，`每日竞价后更新`



竞价完成后分析，并输出。


查看：

```
from direct_redis import DirectRedis
r = DirectRedis(host='localhost', port=6379)
r.get('stock_open_mins0')
```

---


