# Config/business 业务配置文档

**模块路径**: `FQBase.Config.business`
**源码**: [business/](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Config/business)

---

## 一、概述

business 子模块提供量化交易业务相关的配置，包括交易常量、数据源配置、财务指标映射和 IP 列表配置。

---

## 二、交易常量 (constants.py)

### 2.1 订单方向

```python
class ORDER_DIRECTION:
    BUY = 1           # 买入
    SELL = -1         # 卖出
    BUY_OPEN = 2       # 买入开仓
    BUY_CLOSE = 3      # 买入平仓
    SELL_OPEN = -2     # 卖出开仓
    SELL_CLOSE = -3    # 卖出平仓
    SELL_CLOSETODAY = -4  # 卖出平今
    BUY_CLOSETODAY = 4     # 买入平今
```

### 2.2 时间条件

```python
class TIME_CONDITION:
    IOC = 'IOC'    # 即时成交
    GFS = 'GFS'    # 当日有效
    GTD = 'GTD'    # 指定时间有效
    GTC = 'GTC'    # 取消前有效
    GFA = 'GFA'    # 集合竞价有效
```

### 2.3 交易所

```python
class EXCHANGE_ID:
    SSE = 'sse'      # 上海证券交易所
    SZSE = 'szse'    # 深圳证券交易所
    SHFE = 'SHFE'    # 上海期货交易所
    DCE = 'DCE'      # 大连商品交易所
    CZCE = 'CZCE'    # 郑州商品交易所
    CFFEX = 'CFFEX'  # 中国金融期货交易所
    INE = 'INE'      # 上海国际能源交易中心
```

### 2.4 市场类型

```python
class MARKET_TYPE:
    STOCK_CN = 'stock_cn'       # A股
    STOCK_CN_B = 'stock_cn_b'   # B股
    STOCK_HK = 'stock_hk'       # 港股
    STOCK_US = 'stock_us'       # 美股
    FUTURE_CN = 'future_cn'     # 国内期货
    OPTION_CN = 'option_cn'    # 期权
    INDEX_CN = 'index_cn'      # 指数
    FUND_CN = 'fund_cn'        # 基金
    BOND_CN = 'bond_cn'        # 债券
```

### 2.5 订单状态

```python
class ORDER_STATUS:
    NEW = 'new'              # 新订单
    SUCCESS_ALL = 'success_all'   # 全部成交
    SUCCESS_PART = 'success_part' # 部分成交
    QUEUED = 'queued'        # 排队中
    CANCEL_ALL = 'cancel_all'     # 已撤单
    CANCEL_PART = 'cancel_part'  # 部分撤单
    FAILED = 'failed'       # 失败
```

### 2.6 运行环境

```python
class RUNNING_ENVIRONMENT:
    BACKETEST = 'backtest'    # 回测
    SIMULATION = 'simulation' # 模拟交易
    REAL = 'real'            # 实盘
    RANDOM = 'random'        # 随机交易
```

---

## 三、数据源配置 (datasource_config.py)

### 3.1 DataSourceConfig 类

```python
class DataSourceConfig:
    def get(self, key: str, default=None) -> Any
    def get_priority(self, asset_type: str) -> List[str]
    def get_health_check_enabled() -> bool
    def get_health_check_timeout() -> int
```

### 3.2 便捷函数

```python
def get_datasource_priority(asset_type: str) -> List[str]
def get_health_check_config() -> Dict[str, Any]
```

---

## 四、财务指标映射 (financial_mapping.py)

财务指标映射用于将不同数据源的财务指标进行统一命名和分类。

---

## 五、IP 列表配置 (ip_list.py)

```python
TDX_info_ip_list      # 通达信资讯 IP 列表
TDX_stock_ip_list     # 通达信股票 IP 列表
TDX_future_ip_list    # 通达信期货 IP 列表
exclude_from_TDX_stock_ip_list  # 排除的股票 IP
```
