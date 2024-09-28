# A股公告

文件：

逻辑：[公告](/design/al/#)

数据：东财数据接口，不存储，akshare

## 报告

### get_market_report: 得到指定类型的市场报告。

数据来源: 东方财富

数据接口: akshare

#### 声明

get_market_report(end_date=None)

#### 入口参数

- end_date=None，交易日期

#### 返回：无

#### 调用：

##### stock_notice_report：akshare 接口

描述: 东方财富网-数据中心-公告大全-沪深京 A 股公告

#### 算法说明

1. 分类调用："持股变动", "风险提示", "资产重组", "重大事项"，填充到 [DataFrame_StockList](/server/DataFrame_StockList)
   1. 仅处理公告类型。
   2. 持股变动，分增持/减持/转让/持股变动（其他持股变动）
   3. 风险提示，分退市/异动/风险（其他风险提示）
   4. 融资公告，重大事项不区别明细

2. 每交易日盘中每小时更新，更新日期为当前交易日和上一个交易日。
3. 用于股票信息列表在不同系统中的显示。
4. 每次更新重新运算，不保存上次运算数据。

### get_market_report_all2json: 得到全部类型的市场报告。

数据来源: 东方财富

数据接口: akshare

#### 声明

get_market_report_all(end_date=None)

#### 入口参数

- end_date=None，交易日期

#### 返回：无

#### 调用：

##### stock_notice_report：akshare 接口

描述: 东方财富网-数据中心-公告大全-沪深京 A 股公告

#### 算法说明

1. 分类调用：全部，填充到前端 json
2. 每交易日每4小时更新，更新日期为当前交易日和上一个交易日。
3. 去除大部分类型，仅显示指定类型
4. 写入 json
