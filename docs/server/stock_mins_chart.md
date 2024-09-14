## stock_mins_chart

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
  - FX: 龙虎榜负反馈，保存为下一个交易日
  - JJ: 竞价放量，换手大于0.7%
  - RA: 竞价涨幅超3%

- count： 放量次数

---





