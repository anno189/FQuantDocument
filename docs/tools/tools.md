# Tools

工具函数库

## 时间函数

### QA_util_if_tradetime_ext(_time)
判断时间是否是交易时间，返回Boolean

### get_tradetime_min(_time=None, default=None)
返回交易时间。
开盘时间的长短
        0 ~ 240：交易分钟
        -30 ~ -1: 盘前
        -50：盘中暂停交易
        -60：错误的交易时间，理论上不会返回
        -100: 非交易时间

## Redis管理
### celery_Redis_Clean(db=None)
临时工具函数，清除redis的数据

## 数据持久化函数


### celery_Redis_Check(db=None)
打印redis数据

## 工具函数
### data_awaycrowds(data, columns)
计算离群值

返回：
离群数据：DafaFrame
上限偏离值: dec(4)
下限偏离值: dec(4)