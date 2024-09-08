# 龙虎榜

## 龙虎榜

### 接口

​	文件：ToolsLhbData.py

​	API：[龙虎榜](/design/lhb)

​	逻辑：[龙虎榜](/design/allhb)

### stock_data_lhb 龙虎榜每日列表

| 代码  | 名称             | 类型    | 备注       |
| ----- | ---------------- | ------- | ---------- |
| code  | 代码             | str(6)  |            |
| name  | 名称             | str(4)  |            |
| date  | 日期             | str(10) | yyyy-mm-dd |
| memos | 解读             |         |            |
| jm    | 龙虎榜净买额     | float   |            |
| mr    | 龙虎榜买入额     | float   |            |
| mc    | 龙虎榜卖出额     | float   |            |
| cj    | 龙虎榜成交额     | float   |            |
| zcj   | 市场总成交额     | float   |            |
| jmb   | 净买额占总成交比 | float   |            |
| cjb   | 成交额占总成交比 | float   |            |
| type_ | 上榜原因         |         |            |

- 外部数据导入

  - 东财数据，akshare 接口
  - save_lhb_data_eastmoney，按日保存
  - save_lhb_month_eastmoney，按月保存
  - load_lhb_data_eastmoney，按日读取

- 数据维护

  - celery 每日20:50更新，save_data_lhb_2000

- 数据示例

  ```
      "code": "000007",
      "name": "全新好",
      "date": "2024-01-29",
      "memos": "实力游资买入，成功率42.33%",
      "jm": 630546.2,
      "mr": 7511694.4,
      "mc": 6881148.2,
      "cj": 14392842.6,
      "zcj": 13534346,
      "jmb": 4.6588597632,
      "cjb": 106.3430962974,
      "type_": "连续三个交易日内，涨幅偏离值累计达到12%的ST证券、*ST证券和未完成股改证券"
  ```

### stock_data_lhb_day 龙虎榜每日明显

| 代码  | 名称       | 类型      | 备注             |
| ----- | ---------- | --------- | ---------------- |
| date  | 日期       | str(10)   | yyyy-mm-dd       |
| code  | 代码       | str(6)    |                  |
| yybmc | 营业部简称 | str(6)    |                  |
| buy   | 买入金额   | int       |                  |
| brate | 买入占比   | float     |                  |
| sell  | 卖出金额   | int       |                  |
| srate | 卖出占比   | float     |                  |
| je    | 净额       | float     | 存在负数         |
| type_ | 上榜原因   | str       |                  |
| tag   | 交易方向   | string(1) | B: 买入/ S: 卖出 |

- 外部数据导入

  - 东财数据，akshare 接口

  - save_stock_lhb_stock_detail：保存某日某股龙虎榜明细数据

  - save_stock_lhb_day：保存某日龙虎榜明细数据

  - load_stock_lhb_day: 从数据库中读取某日某股龙虎榜详细信息

- 数据维护
  1. celery每日20:50自动更新，save_data_lhb_2000
  2. 每次更新删除原来的数据

- 数据示例

  ```
      "yybmc": "深股通专用",
      "buy": 6701863,
      "brate": 0.0139195754,
      "sell": 10820537,
      "srate": 0.022473942,
      "je": -4118674,
      "type_": "连续三个交易日内，涨幅偏离值累计达到20%的证券",
      "code": "000595",
      "date": "2024-01-02",
      "tag": "S"
  ```

  
