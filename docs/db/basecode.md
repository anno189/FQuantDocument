## ISSUE

- [ ] code_stock_industry的调用需要统一，目前使用的外部导入方法和数据库取数两种。
- [ ] cbnew_list 字段待补齐

## 基础数据

### code_province 省市表，外部数据导入

| 代码     | 名称 | 类型   | 备注            |
| -------- | ---- | ------ | --------------- |
| province | 代码 | int    |                 |
| name     | 名称 | str(3) | 31个省市+深圳市 |
| code     | 指数 | str(6) | 对应的板块代码  |

- 外部数据导入，code_province.csv
- 共计32条数据
- code可以转换成指数代码 8802xx
- 关联数据表：stock_info，关联字段：province
- **数据表未使用**

### code_stock_concept 概念表，外部数据导入

| 代码   | 名称 | 类型      | 备注                     |
| ------ | ---- | --------- | ------------------------ |
| code   | 代码 | string(6) | 通达信概念               |
| name   | 名称 | string(4) |                          |
| n1name | 分类 | string    | 概念大分类；会动态调整。 |
| count  | 数量 | int       |                          |

- 外部数据导入，code_tdx_block.csv

  ```
  QA.save_tdx_concept_from_csv(GLOBALMAP().BASEDATAPATH + 'code_tdx_block.csv')
  ```

- 概念分类包括：内容, 医疗健康, 数据, 新基建, 新材料, 新能源, 新能源车, 消费, 消费电子, 物流, 物联网, 环保, 环境, 装备, 金融, 风格；分类会动态调整
- 数据维护
  1. code_tdx_block.csv 需手动更新并上传至服务器 /data
  2. 每日16:00 自动更新，参见 celery
  3. 必要时，手动更新
  4. 每日18:00 校验新增概念，对比stock_concept和 stock_block 中概念的一致性，需手工维护概念新增与减少。减少的概念需要删除对应数据（代码会重复使用）

###  code_stock_industry 行业表，外部数据导入

| 代码       | 名称       | 类型   | 备注                                        |
| ---------- | ---------- | ------ | ------------------------------------------- |
| c1         | 一级代码   | string | 13个                                        |
| n1         | 一级名称   | string |                                             |
| c2         | 二级代码   | string | 56个                                        |
| n2         | 二级名称   | string |                                             |
| i2         | 通达信代码 | string |                                             |
| c3         | 三级代码   | string | 110个                                       |
| n3         | 三级名称   | string |                                             |
| i3         | 通达信代码 | string |                                             |
| note       | 行业说明   | string |                                             |
| style      | 风格       | string | 价值 62/成长 48                             |
| industrial | 产业链     | string | 上游 38/中游 32/下游 40                     |
| cycle      | ？？       | string | 周期 35/非周期 75                           |
| Valuation  | 风格       | int    | 深度价值:1:54 / 价值成长:2:46 / 高成长:3:10 |

- 外部数据导入，code_tdx_block.csv

  ```
  QA.save_tdx_concept_from_csv(GLOBALMAP().BASEDATAPATH + 'code_tdx_block.csv')
  ```

- 行业分三级，共计110条记录

- 一级行业：交通运输, 信息产业, 公用事业, 可选消费, 商贸零售, 建筑地产, 日常消费, 材料, 社会服务, 综合, 能源, 装备制造, 金融

## 指数

### index_list 指数列表

| 代码          | 名称     | 类型      | 备注                   |
| ------------- | -------- | --------- | ---------------------- |
| code          | 代码     | string(6) |                        |
| volunit       | 单位     | int       | 不详，未使用           |
| decimal_point | 浮点位数 | int       | 未使用，默认：2        |
| name          | 名称     | string(4) |                        |
| pre_close     | 昨日收盘 | dec(10)   | 未使用                 |
| sse           | 市场     | str(2)    | 未使用，默认：sh/sz    |
| sec           | 市场     | str(8)    | 未使用，默认：index_cn |

- 通达信取数
- 包括：宽指，行业，风格，概念等
  - 880981 - 880993 TDX行业，通达信一级行业13个
  - 880501 - 880800，880899 - 880980 概念
  - 880301 - 880497 行业
  - 880201 - 880232 地区
  - 880001 - 880099 宽指
  - 880801 - 880898 风格
- 仅在取数据时使用，其它时未调用。
  - 宽指使用外部数据，调用时临时加载
  - 概念使用code_stock_concept数据
  - 行业使用code_stock_industry数据
- 对应数据：index_day

### future_list 扩展数据列表

| 代码     | 名称   | 类型   | 备注                         |
| -------- | ------ | ------ | ---------------------------- |
| category | 分类   | int    | 3,5,8,10,12                  |
| market   | 市场   | int    | 8,27,28,29,30,33,38,42,47,62 |
| code     | 代码   | str(6) |                              |
| name     | 名称   | str    |                              |
| desc     | 小数位 | -      |                              |

- 通达信取数
- category和market组合，构成市场代码
  - 3/28：期货
  - 3/29：期货
  - 3/30:   期货
  - 3/42:  期货板块指数
  - 3/47: 股指期货
  - 5/27: 港股通指数
  - 5/47: 股指期货连续，IH50/IZ100/IF300/IC500/IM1000
  - 5/62: 港股
  - 8/33: 美股
  - 10/38: 主要经济指标
  - 12/8: 股指期货
- 对应日线数据：future_day
  - 日常未保存，仅取指定的部分数据。

## 个股

### stock_info， 基本信息

| 代码               | 名称         | 类型   | 备注                                     |
| ------------------ | ------------ | ------ | ---------------------------------------- |
| market             | 市场         | int    |                                          |
| code               | 代码         | str(6) |                                          |
| liutongguben       | 流通股本     | int    |                                          |
| province           | 省           | int    | 字典 code_province                       |
| industry           | 行业         | int    | 二级行业，未对应字典 code_stock_industry |
| updated_date       | 更新时间     | int    |                                          |
| ipo_date           | 上市时间     | int    |                                          |
| zongguben          | 总股本       | int    |                                          |
| guojiagu           | 国家股       | int    |                                          |
| faqirenfarengu     | 发起人法人股 | int    |                                          |
| farengu            | 法人股       | int    |                                          |
| bgu                | B 股         | int    |                                          |
| hgu                | H 股         | int    |                                          |
| zhigonggu          | 职工股       | int    |                                          |
| zongzichan         | 总资产       | int    |                                          |
| liudongzichan      | 流动资产     | int    |                                          |
| gudingzichan       | 固定资产     | int    |                                          |
| wuxingzichan       | 无形资产     | int    |                                          |
| gudongrenshu       | 股东人数     | int    |                                          |
| liudongfuzhai      | 流动负债     | int    |                                          |
| changqifuzhai      | 长期负债     | int    |                                          |
| zibengongjijin     | 资本公积金   | int    |                                          |
| jingzichan         | 净资产       | int    |                                          |
| zhuyingshouru      | 主营收入     | int    |                                          |
| zhuyinglirun       | 主营利润     | int    |                                          |
| yingshouzhangkuan  | 应收账款     | int    |                                          |
| yingyelirun        | 营业利润     | int    |                                          |
| touzishouyu        | 投资收入     | int    |                                          |
| jingyingxianjinliu | 经营现金流   | int    |                                          |
| zongxianjinliu     | 总现金流     | int    |                                          |
| cunhuo             | 存货         | int    |                                          |
| lirunzonghe        | 利润总和     | int    |                                          |
| shuihoulirun       | 税后利润     | int    |                                          |
| jinglirun          | 净利润       | int    |                                          |
| weifenpeilirun     | 未分配利润   | int    |                                          |
| meigujingzichan    | 每股净资产   | int    |                                          |
| baoliu2            | 保留字段     |        |                                          |

- 通达信取数
- 行业通过 stock_block 表获取

### stock_list，主板个股列表

| 代码          | 名称       | 类型   | 备注     |
| ------------- | ---------- | ------ | -------- |
| code          | 代码       | str(6) |          |
| volunit       |            |        | 无效字段 |
| decimal_point |            |        | 无效字段 |
| name          | 名称       | str    |          |
| pre_close     | 昨日收盘价 | dec    | 无效字段 |
| sse           | 市场       | str    | sz / sh  |
| sec           | 市场       | str    | stock_cn |

- 通达信取数
- 仅使用code、name、sse
  - 仅此表存在股票名称
  - 每日更新数据股票名称会变化
- 运算
  - 根据名称中的'ST'识别是否被 ST，ST标志仅当日有效，历史信息未保存。
  - 根据股票是否有可转债，在名称中加入*标志。

### stock_list_bj，北交所个股列表

| 代码         | 名称     | 类型   | 备注                      |
| ------------ | -------- | ------ | ------------------------- |
| code         | 代码     | str(6) |                           |
| name         | 名称     | str    |                           |
| zongguben    | 总股本   | int    |                           |
| liutongguben | 流通股本 | int    |                           |
| ipo_date     | 上市日期 | str    |                           |
| dq           | 地区     | str    | 未与字典code_province对应 |
| updated_date | 更新时间 | str    |                           |

- 北交所取数，通达信暂无数据接口
- 行业通过 stock_block 表获取

### bond2stock_list 可转债列表

| 代码          | 名称       | 类型   | 备注          |
| ------------- | ---------- | ------ | ------------- |
| code          | 代码       | str(6) |               |
| volunit       |            |        | 无效字段      |
| decimal_point |            |        | 无效字段      |
| name          | 名称       | str    |               |
| pre_close     | 昨日收盘价 | dec    | 无效字段      |
| sse           | 市场       | str    | sz / sh       |
| sec           | 市场       | str    | bond2_cn |

- 通达信取数

### cbnew_list 可转债列表对照表

| 代码               | 名称     | 类型   | 备注 |
| ------------------ | -------- | ------ | ---- |
| bond_id            | 转债代码 | str(6) |      |
| bond_nm            | 转债名称 | str    |      |
| stock_id           | 股票代码 | str(6) |      |
| stock_nm           | 股票名称 | str    |      |
| price_tips         |          | str    |      |
| btype              |          | str    |      |
| convert_price      |          | dec    |      |
| redeem_price       |          | dec    |      |
| force_redeem_price |          | dec    |      |
| curr_iss_amt       |          | dec    |      |

- 数量来源：集思录，akshare 取数
- 字段名称待补全
- 运算
  - 目前使用转债(正股)代码/名称等四个字段

## 成份股

### index_stocks 指数成份股



### stock_block 通达信板块成分表，包括概念、三级行业、风格

