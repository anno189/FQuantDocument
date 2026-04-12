# Config/business API 参考

**模块路径**: `FQBase.Config.business`
**源码**: [business/](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Config/business)

---

## 一、交易常量 API

### ORDER_DIRECTION 类

订单方向常量。

| 常量 | 值 | 说明 |
|------|-----|------|
| `BUY` | `1` | 买入 |
| `SELL` | `-1` | 卖出 |
| `BUY_OPEN` | `2` | 买入开仓 |
| `BUY_CLOSE` | `3` | 买入平仓 |
| `SELL_OPEN` | `-2` | 卖出开仓 |
| `SELL_CLOSE` | `-3` | 卖出平仓 |
| `SELL_CLOSETODAY` | `-4` | 卖出平今 |
| `BUY_CLOSETODAY` | `4` | 买入平今 |

### TIME_CONDITION 类

时间条件常量。

| 常量 | 值 | 说明 |
|------|-----|------|
| `IOC` | `'IOC'` | 即时成交 |
| `GFS` | `'GFS'` | 当日有效 |
| `GTD` | `'GTD'` | 指定时间有效 |
| `GTC` | `'GTC'` | 取消前有效 |
| `GFA` | `'GFA'` | 集合竞价有效 |

### EXCHANGE_ID 类

交易所 ID 常量。

| 常量 | 值 | 说明 |
|------|-----|------|
| `SSE` | `'sse'` | 上海证券交易所 |
| `SZSE` | `'szse'` | 深圳证券交易所 |
| `SHFE` | `'SHFE'` | 上海期货交易所 |
| `DCE` | `'DCE'` | 大连商品交易所 |
| `CZCE` | `'CZCE'` | 郑州商品交易所 |
| `CFFEX` | `'CFFEX'` | 中国金融期货交易所 |
| `INE` | `'INE'` | 上海国际能源交易中心 |

### MARKET_TYPE 类

市场类型常量。

| 常量 | 值 | 说明 |
|------|-----|------|
| `STOCK_CN` | `'stock_cn'` | A股 |
| `STOCK_CN_B` | `'stock_cn_b'` | B股 |
| `STOCK_HK` | `'stock_hk'` | 港股 |
| `STOCK_US` | `'stock_us'` | 美股 |
| `FUTURE_CN` | `'future_cn'` | 国内期货 |
| `OPTION_CN` | `'option_cn'` | 期权 |
| `INDEX_CN` | `'index_cn'` | 指数 |
| `FUND_CN` | `'fund_cn'` | 基金 |
| `BOND_CN` | `'bond_cn'` | 债券 |

### ORDER_STATUS 类

订单状态常量。

| 常量 | 值 | 说明 |
|------|-----|------|
| `NEW` | `'new'` | 新订单 |
| `SUCCESS_ALL` | `'success_all'` | 全部成交 |
| `SUCCESS_PART` | `'success_part'` | 部分成交 |
| `QUEUED` | `'queued'` | 排队中 |
| `CANCEL_ALL` | `'cancel_all'` | 已撤单 |
| `CANCEL_PART` | `'cancel_part'` | 部分撤单 |
| `FAILED` | `'failed'` | 失败 |

### RUNNING_ENVIRONMENT 类

运行环境常量。

| 常量 | 值 | 说明 |
|------|-----|------|
| `BACKETEST` | `'backtest'` | 回测 |
| `SIMULATION` | `'simulation'` | 模拟交易 |
| `REAL` | `'real'` | 实盘 |
| `RANDOM` | `'random'` | 随机交易 |

---

## 二、数据源配置 API

### DataSourceConfig 类

数据源配置单例。

### `DataSourceConfig.get(key: str, default=None) -> Any`

获取配置值，支持点号分隔。

| 参数 | 类型 | 说明 |
|------|------|------|
| `key` | `str` | 配置键，如 `'datasources.stock.priority'` |
| `default` | `Any` | 默认值 |

**返回值**: 配置值

### `DataSourceConfig.get_priority(asset_type: str) -> List[str]`

获取指定资产类型的数据源优先级。

| 参数 | 类型 | 说明 |
|------|------|------|
| `asset_type` | `str` | 资产类型 |

**支持的资产类型**: `stock`, `index`, `future`, `bond`, `option`, `hk_stock`, `us_stock`, `exchange_rate`

### `DataSourceConfig.get_health_check_enabled() -> bool`

获取健康检查是否启用。

**返回值**: 是否启用

### `DataSourceConfig.get_health_check_timeout() -> int`

获取健康检查超时时间（秒）。

**返回值**: 超时时间

---

## 三、便捷函数

### `get_datasource_priority(asset_type: str) -> List[str]`

获取数据源优先级。

| 参数 | 类型 | 说明 |
|------|------|------|
| `asset_type` | `str` | 资产类型 |

**返回值**: 数据源代号列表

### `get_health_check_config() -> Dict[str, Any]`

获取健康检查配置。

**返回值**:
```python
{
    'enabled': True,
    'timeout': 5,
    'startup_check': True,
    'on_demand_check': True
}
```

---

## 四、财务指标映射 API

### FINANCIAL_INDICATORS

财务指标映射字典。

### FINANCIAL_CATEGORIES

财务指标分类。

---

## 五、IP 列表 API

### TDX_info_ip_list

通达信资讯 IP 列表。

### TDX_stock_ip_list

通达信股票 IP 列表。

### TDX_future_ip_list

通达信期货 IP 列表。

### exclude_from_TDX_stock_ip_list

排除的股票 IP 列表。
