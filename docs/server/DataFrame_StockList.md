## DataFrame_StockList

说明：股票列表（不包含退市股）。

更新：交易日盘前9:05分更新，参见 [celery](celery.md)。

列：

```
'code', 'liutongguben', 'ipo_date', 'zongguben', 'name', 'sse', 'ST',
'mtype', 'ipodays', 'industry', 'industry1', 'industry2', 'index_',
'bond_id', 'date', 'last_close', 'low', 'high', 'volume', 'amount',
'limitup', 'limitdo', 'hprice', 'hcount', 'hstop', 'lstop', 'gx5',
'gx20', 'mvm5d', 'liutongshizhi', 'sort_', 'HHVH120', 'LLVL120', 'HSL',
'RATE', 'RATE3', 'RATE5', 'AMOUNT20', 'CF01B20', 'CF01B120', 'J34',
'J89', 'J200', 'CR1', 'tag', 'RGene', 'new', 'Rate120', 'memos', 'mint',
'R1', 'R2', 'R3', 'N3', 'N4', 'step', 'gubenZ', 'HSZ', 'adj'
```

- sse: ['sz', 'sh', 'bj']
- mtype: ['ZB', 'ZX', 'CY', 'KC', 'BJ']
- index_: ['000009', '000010', '000133', '000300', '000852','000905','000999','399009','399010', '399330','880823','931023']
- bond_id: 对应可转债，如果有多个则保留一个。
- last_close, low, high, volume, amount：昨日数据
- sort_: 昨日成交金额排行
- tag: ['机构/行业', '不活跃', '机构/超大', '波动', '情绪', '次新股', '新股']，以近日换手和成交金额进行判断。
- memos: ['首板, 5天2板，1连板, 秒板分歧']；标记高度，空间，梯队，昨日板型，负反馈，反包等信息
- mint: 连板
- R1/R2/R3: 连板接力推荐
- N3: 连板
- N4: 板型
- step: 板型说明, 检查是否可以删除
