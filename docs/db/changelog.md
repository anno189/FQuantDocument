# 数据维护日志

## 2025

### 07.26
- stock_data_extent
  - 新增：`tan10`, `HSE05`
- stock_data_factor, index_data_factor
  - 新增：`spcms`, `spcmm`, `spcml`
  - 删除：`spcm60`

### 07.14
- stock_limit_block_0
  - 新增：昨曾涨停概念统计
  - 列：`date`, `blockname`, `scount`, `srate`
  - 从2025-01-01开始
- stock_limit_block_1
  - 新增：昨日涨停概念统计, 统计当日涨停的概念
    - 涨停分类：全部涨停，连板涨停，首板涨停
    - 当日曾经涨停概念统计保存在stock_limit_block_0中
  - 列：`date`, `blockname`, `amean`, `asum`, `acount`, `bmean`, `bsum`, `bcount`, `cmean`, `csum`, `ccount`
  - 从2025-01-01开始

### 07.13
- stock_data_extent
  - 删除 `R9`, `R29` 列 (不在监控预测监管)
  - 增加 `HS05`, `HS10`; 5日换手和10日换手，全股本换手，HSZ 需要结合 gubenZ 使用。
  - 新增 `tan3`, `T34`; 3日线的上升角度。
- index_data_extent
  - 删除 `R9`, `R29` 列（未使用）
  - 新增 `A10`, `A20`, `A250`;
    - 使用金额均值，不使用换手率/成交量均值
    - 10日大于250日为指数多头条件之一
- stock_amo_pct
  - 删除资金流向表
    - 使用效率低，手工维护工作量大。

### 03.03
- stock_data_factor
  - 删除: MACD 相关字段，运算中从未使用
    - MACD本质上是MA的变形
- stock_amo_pct
  - 新增：每日资金流向
    - 需要从聚宽取数，每日手工操作。
    - 目前应用于集合竞价后的过滤
- stock_data_extent
  - 修改字段名称`H`、`L`、`A10`、`A20`、`A60`、`A120`、`A250`、`H3`、`H5`、`H20`、`L20`、`H60`、`L60`、`H120`、`L120`、`H250`、`L250`、`R3`、`R5`、`R9`、`R10`、`R20`、`R29`、`R30`、`R60`、`R120`、`R250`、`VL20`
  - 新增`lr`、`hr`、`or`


## 2024

### 09.14
- stock_data_extent
  - 删除：`HSL05`，`HSL10`，`HSL20`，暂无实际应用逻辑，删除
  - 新增：`MA450`, `CMA450`，450日收盘价平均值，应用于涨停选股，结合银山谷使用。
- 补充：退市代码
