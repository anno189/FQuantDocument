# 龙虎榜

## 功能
- 针对当日龙虎榜进行统计分心

## 数据获取
- 数据来源：akshare，东财数据

### 保存数据
- save_lhb_data_eastmoney(end_date=None, client=DATABASE), 保存龙虎榜数据
- save_lhb_month_eastmoney(year=2024, month=1, client=DATABASE)，按月保存龙虎榜数据
- save_stock_lhb_day(end_date=None)，保存每日个股龙虎榜数据

### 统计数据
- saveLhb2Json(end_date=None, renew=True, client=DATABASE)，分析并输出到 lhb.json和Pools_limit_corr_ma450.json

## 调用
- 20:50，save_data_lhb_2000，更新龙虎榜数据
- 06:00/21:00，day_saveLhb2Json，统计龙虎榜数据，每日2次

