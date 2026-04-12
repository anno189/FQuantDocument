# Logger 使用指南

**模块路径**: `FQBase.Core.logger`
**源码**: [logger.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQBase/FQBase/Core/logger.py)

---

## 一、基本使用

```python
from FQBase.Core import get_logger

logger = get_logger(__name__)

logger.debug("调试信息")
logger.info("普通信息")
logger.warning("警告信息")
logger.error("错误信息")
logger.exception("异常信息")  # 自动包含堆栈
```

---

## 二、模块级 Logger

```python
# data_service.py
from FQBase.Core import get_logger

logger = get_logger(__name__)  # 使用模块名

class MarketDataService:
    def fetch_realtime(self, codes):
        logger.info(f"开始获取实时行情: {codes}")
        # ...
```

---

## 三、进度日志

```python
logger = get_logger('Downloader')
total = 1216

for i in range(total):
    stock_code = f"{i:06d}"
    logger.progress(
        i + 1,
        total,
        "##JOB04 Now Saving INDEX_DAY====",
        f"{stock_code} from 2026-03-24 to 2026-03-25"
    )
    download_stock_data(stock_code)
```

---

## 四、模块化使用

```python
# 数据服务
market_logger = get_logger('MarketData')

# 策略执行
strategy_logger = get_logger('Strategy')

# 风控
risk_logger = get_logger('RiskControl')

# 交易执行
trade_logger = get_logger('TradeExecutor')
```

---

## 五、量化交易场景

### 5.1 数据服务日志

```python
from FQBase.Core import get_logger

logger = get_logger('MarketData')

class MarketDataService:
    def __init__(self):
        self.logger = logger
        self.logger.info("MarketDataService 初始化")

    def fetch_daily(self, code: str, start_date: str, end_date: str):
        self.logger.info(f"获取历史数据: {code} from {start_date} to {end_date}")
        try:
            data = self._query_db(code, start_date, end_date)
            self.logger.info(f"获取成功: {code}, {len(data)} 条")
            return data
        except Exception:
            self.logger.exception(f"获取失败: {code}")
            raise
```

### 5.2 策略执行日志

```python
logger = get_logger('Strategy')

class StrategyExecutor:
    def __init__(self, name: str):
        self.name = name
        self.logger = get_logger(f'Strategy.{name}')

    def generate_signals(self, market_data):
        self.logger.info(f"开始生成信号, 数据量: {len(market_data)}")

        signals = []
        for code, data in market_data.items():
            signal = self._analyze(data)
            if signal:
                signals.append(signal)
                self.logger.info(f"信号: {code} {signal['action']}")

        self.logger.info(f"信号生成完成, 共 {len(signals)} 个")
        return signals
```

### 5.3 风控日志

```python
logger = get_logger('RiskControl')

class RiskController:
    def __init__(self):
        self.logger = logger

    def pre_trade_check(self, account: str, order: dict):
        self.logger.info(f"交易前风控检查: 账户 {account}")

        checks = {
            'position_limit': self._check_position(order),
            'cash_sufficient': self._check_cash(order),
            'price_deviation': self._check_deviation(order),
        }

        for name, result in checks.items():
            if not result:
                self.logger.warning(f"风控拒绝: {name}")
                return False

        self.logger.info("风控检查通过")
        return True
```

### 5.4 交易执行日志

```python
logger = get_logger('TradeExecutor')

class TradeExecutor:
    def __init__(self, broker: str):
        self.broker = broker
        self.logger = get_logger(f'Trade.{broker}')

    def submit_order(self, order: dict):
        self.logger.info(
            f"提交订单: {order['code']} {order['action']} "
            f"数量: {order.get('volume')} 价格: {order.get('price')}"
        )
        try:
            result = self._send(order)
            if result['status'] == 'filled':
                self.logger.info(
                    f"成交: {result['filled_price']} x {result['filled_volume']}"
                )
            return result
        except Exception:
            self.logger.exception("订单执行异常")
            raise
```

### 5.5 数据下载进度

```python
logger = get_logger('DataDownloader')

class StockDataDownloader:
    def download_all(self, codes: list):
        total = len(codes)
        success = 0
        failed = 0

        self.logger.info(f"开始下载，共 {total} 只股票")

        for i, code in enumerate(codes, 1):
            try:
                self.download_single(code)
                success += 1
                self.logger.progress(
                    i, total,
                    "##JOB04 Now Saving INDEX_DAY====",
                    f"{code} {i}/{total}"
                )
            except Exception as e:
                failed += 1
                self.logger.error(f"下载失败: {code}, {e}")

        self.logger.info(f"下载完成: 成功 {success}, 失败 {failed}")

        return {'success': success, 'failed': failed}
```

---

## 六、日志输出格式

### 6.1 默认格式

```
[2024-01-15 10:30:00] INFO [MarketData:42] 获取数据成功
```

| 字段 | 格式 | 示例 |
|------|------|------|
| 时间戳 | `%(asctime)s` | `2024-01-15 10:30:00` |
| 级别 | `%(levelname)s` | `INFO` |
| 名称 | `%(name)s` | `MarketData` |
| 行号 | `%(lineno)d` | `42` |
| 消息 | `%(message)s` | `获取数据成功` |

### 6.2 进度日志格式

```
The 1 of Total 1216， PROGRESS 0.08%
##JOB04 Now Saving INDEX_DAY==== 000000 from 2026-03-24 to 2026-03-25
```
