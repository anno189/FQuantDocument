# FQData.fetch 模块 API 文档

**模块路径**: `FQData/fetch/`
**生成时间**: 2026-03-28

---

## 一、模块概述

`FQData.fetch` 是数据获取模块，提供从通达信(TDX)、本地数据库(MongoDB)等来源获取金融数据的功能。

### 1.1 模块结构

```
FQData.fetch/
├── tdx/              # 通达信在线数据
│   ├── stock.py      # 股票数据
│   ├── index.py      # 指数数据
│   ├── bond.py       # 债券数据
│   ├── future.py     # 期货/海外市场
│   ├── option.py     # 期权数据
│   ├── executor.py    # 连接池执行器
│   └── Qafinancial.py # 历史财务数据
├── local/            # 本地数据库查询
│   ├── stock.py      # 股票数据
│   ├── index.py      # 指数数据
│   ├── bond.py       # 债券数据
│   ├── future.py     # 期货数据
│   ├── list.py       # 列表数据
│   ├── trade.py      # 交易日数据
│   ├── block.py      # 板块数据
│   ├── calendar.py    # 财务日历
│   ├── market.py     # 实时行情
│   ├── backtest.py   # 回测数据
│   ├── lhb.py        # 龙虎榜
│   └── ctp.py        # CTP Tick
├── advance.py        # 高级封装 (DB_fetch → DataStruct)
└── fetcher.py        # 统一门面 (整合TDX + MongoDB)
```

### 1.2 函数命名规范

| 前缀 | 来源 | 说明 |
|------|------|------|
| `TDX_fetch_*` | tdx/*.py | 通达信在线数据 |
| `DB_fetch_*` | local/*.py | MongoDB本地数据 |
| `fetch_*_adv` | advance.py | 高级封装(DataFrame→DataStruct) |
| `get_*` | fetcher.py | 统一门面函数 |

---

## 二、tdx 模块 (通达信在线数据)

**路径**: `FQData.fetch.tdx`

### 2.1 股票数据 (stock.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `TDX_fetch_get_security_bars` | 获取证券K线 | DataFrame |
| `TDX_fetch_get_stock_day` | 获取股票日线 | DataFrame |
| `TDX_fetch_get_stock_min` | 获取股票分钟线 | DataFrame |
| `TDX_fetch_get_stock_latest` | 获取股票最新数据 | DataFrame |
| `TDX_fetch_get_stock_realtime` | 获取股票实时行情 | DataFrame |
| `TDX_fetch_get_stock_list` | 获取股票列表 | DataFrame |
| `TDX_fetch_get_stock_xdxr` | 获取除权除息数据 | DataFrame |
| `TDX_fetch_get_stock_info` | 获取股票信息 | DataFrame |
| `TDX_fetch_get_stock_terminated` | 获取终止上市股票 | DataFrame |
| `TDX_fetch_get_stock_transaction` | 获取股票交易分笔 | DataFrame |
| `TDX_fetch_get_stock_block` | 获取股票板块数据 | DataFrame |
| `TDX_fetch_depth_market_data` | 获取深度市场数据 | DataFrame |
| `TDX_fetch_get_tdx_industry` | 获取通达信行业分类 | DataFrame |
| `TDX_fetch_stock_liutonggubenZ` | 获取流通股本数据 | DataFrame |
| `TDX_data_stock_to_liutonggubenZ` | 转换流通股本 | DataFrame |

**使用示例**:
```python
from FQData.fetch.tdx import TDX_fetch_get_stock_day

data = TDX_fetch_get_stock_day('000001', '2020-01-01', '2020-12-31')
```

### 2.2 指数数据 (index.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `TDX_fetch_get_index_day` | 获取指数日线 | DataFrame |
| `TDX_fetch_get_index_min` | 获取指数分钟线 | DataFrame |
| `TDX_fetch_get_index_latest` | 获取指数最新数据 | DataFrame |
| `TDX_fetch_get_index_realtime` | 获取指数实时行情 | DataFrame |
| `TDX_fetch_get_index_transaction` | 获取指数交易分笔 | DataFrame |
| `TDX_fetch_get_index_list` | 获取指数列表 | DataFrame |

### 2.3 债券数据 (bond.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `TDX_fetch_get_bond_day` | 获取债券日线 | DataFrame |
| `TDX_fetch_get_bond_min` | 获取债券分钟线 | DataFrame |
| `TDX_fetch_get_bond_realtime` | 获取债券实时行情 | DataFrame |
| `TDX_fetch_get_bond_list` | 获取债券列表 | DataFrame |
| `TDX_fetch_get_bond2stock_day` | 获取可转债转股日线 | DataFrame |
| `TDX_fetch_get_bond2stock_min` | 获取可转债转股分钟线 | DataFrame |
| `TDX_fetch_get_bond2stock_realtime` | 获取可转债转股实时 | DataFrame |
| `TDX_fetch_get_bond2stock_list` | 获取可转债列表 | DataFrame |

### 2.4 期货/海外市场 (future.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `TDX_fetch_get_extensionmarket_count` | 获取扩展市场数量 | DataFrame |
| `TDX_fetch_get_extensionmarket_info` | 获取扩展市场信息 | DataFrame |
| `TDX_fetch_get_extensionmarket_list` | 获取扩展市场列表 | DataFrame |
| `TDX_fetch_get_future_list` | 获取期货列表 | DataFrame |
| `TDX_fetch_get_future_day` | 获取期货日线 | DataFrame |
| `TDX_fetch_get_future_min` | 获取期货分钟线 | DataFrame |
| `TDX_fetch_get_future_transaction` | 获取期货交易分笔 | DataFrame |
| `TDX_fetch_get_future_realtime` | 获取期货实时行情 | DataFrame |
| `TDX_fetch_get_globalindex_list` | 获取全球指数列表 | DataFrame |
| `TDX_fetch_get_hkstock_list` | 获取港股列表 | DataFrame |
| `TDX_fetch_get_hkindex_list` | 获取港股指数列表 | DataFrame |
| `TDX_fetch_get_hkfund_list` | 获取港股基金列表 | DataFrame |
| `TDX_fetch_get_usstock_list` | 获取美股列表 | DataFrame |
| `TDX_fetch_get_macroindex_list` | 获取宏观指数列表 | DataFrame |
| `TDX_fetch_get_exchangerate_list` | 获取汇率列表 | DataFrame |

### 2.5 期权数据 (option.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `TDX_fetch_get_option_list` | 获取期权列表 | DataFrame |
| `TDX_fetch_get_option_all_contract_time_to_market` | 获取所有期权合约上市时间 | DataFrame |
| `TDX_fetch_get_option_50etf_contract_time_to_market` | 获取50ETF期权合约 | DataFrame |
| `TDX_fetch_get_option_300etf_contract_time_to_market` | 获取300ETF期权合约 | DataFrame |
| `TDX_fetch_get_commodity_option_CU_contract_time_to_market` | 铜期权合约 | DataFrame |
| `TDX_fetch_get_commodity_option_RU_contract_time_to_market` | 橡胶期权合约 | DataFrame |
| `TDX_fetch_get_commodity_option_CF_contract_time_to_market` | 棉花期权合约 | DataFrame |
| `TDX_fetch_get_commodity_option_M_contract_time_to_market` | 豆粕期权合约 | DataFrame |
| `TDX_fetch_get_commodity_option_SR_contract_time_to_market` | 白糖期权合约 | DataFrame |
| `TDX_fetch_get_commodity_option_AU_contract_time_to_market` | 黄金期权合约 | DataFrame |
| `TDX_fetch_get_commodity_option_AL_contract_time_to_market` | 铝期权合约 | DataFrame |
| `TDX_fetch_get_commodity_option_C_contract_time_to_market` | 玉米期权合约 | DataFrame |
| `TDX_fetch_get_wholemarket_list` | 获取全市场列表 | DataFrame |

### 2.6 历史财务数据 (Qafinancial.py)

| 类/函数 | 说明 | 返回类型 |
|---------|------|----------|
| `QAHistoryFinancialCrawler` | 历史财务数据爬虫 | class |
| `QAHistoryFinancialReader` | 历史财务数据读取器 | class |
| `get_filename` | 获取文件名 | str |
| `get_md5` | 计算MD5 | str |
| `download_financialzip` | 下载财务数据包 | bool |
| `download_financialzip_fromtdx` | 从通达信下载 | bool |
| `get_and_parse` | 获取并解析 | DataFrame |
| `parse_filelist` | 解析文件列表 | list |
| `parse_all` | 解析所有 | DataFrame |

### 2.7 连接池执行器 (executor.py)

| 类/函数 | 说明 | 返回类型 |
|---------|------|----------|
| `TdxExecutor` | 通达信连接池执行器 | class |
| `get_bar` | 批量获取K线 | list |
| `get_day_once` | 单次获取日K线 | list |
| `bat` | 批量执行器入口 | None |

**使用示例**:
```python
from FQData.fetch.tdx import TdxExecutor, get_bar

# 使用执行器
executor = TdxExecutor(thread_num=2)
data = executor.get_security_bar(['000001', '000002'], 'day', 100)

# 批量获取
data = get_bar(timeout=1, sleep=1)
```

---

## 三、local 模块 (本地数据库查询)

**路径**: `FQData.fetch.local`

### 3.1 股票数据 (stock.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `DB_fetch_stock_day` | 获取股票日线 | DataFrame |
| `DB_fetch_stock_adj` | 获取复权数据 | DataFrame |
| `DB_fetch_stock_min` | 获取股票分钟线 | DataFrame |
| `DB_fetch_stock_transaction` | 获取交易分笔 | DataFrame |
| `DB_fetch_stock_xdxr` | 获取除权除息 | DataFrame |
| `DB_fetch_stock_info` | 获取股票信息 | DataFrame |
| `DB_fetch_stock_name` | 获取股票名称 | DataFrame |
| `DB_fetch_stock_block` | 获取股票板块 | DataFrame |
| `DB_fetch_stock_divyield` | 获取股息率数据 | DataFrame |

### 3.2 指数数据 (index.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `DB_fetch_index_day` | 获取指数日线 | DataFrame |
| `DB_fetch_index_min` | 获取指数分钟线 | DataFrame |
| `DB_fetch_index_transaction` | 获取指数交易分笔 | DataFrame |
| `DB_fetch_index_name` | 获取指数名称 | DataFrame |

### 3.3 债券数据 (bond.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `DB_fetch_bond2stock_day` | 获取可转债转股日线 | DataFrame |
| `DB_fetch_bond2stock_min` | 获取可转债转股分钟线 | DataFrame |
| `DB_fetch_bond2stock_list` | 获取可转债列表 | DataFrame |

### 3.4 期货数据 (future.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `DB_fetch_future_day` | 获取期货日线 | DataFrame |
| `DB_fetch_future_min` | 获取期货分钟线 | DataFrame |
| `DB_fetch_future_list` | 获取期货列表 | DataFrame |
| `DB_fetch_future_tick` | 获取期货tick | DataFrame |

### 3.5 列表数据 (list.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `DB_fetch_stock_list` | 获取股票列表 | DataFrame |
| `DB_fetch_etf_list` | 获取ETF列表 | DataFrame |
| `DB_fetch_index_list` | 获取指数列表 | DataFrame |
| `DB_fetch_stock_terminated` | 获取终止上市股票 | DataFrame |

### 3.6 交易日数据 (trade.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `DB_fetch_trade_date` | 获取交易日列表 | DataFrame |

### 3.7 财务日历 (calendar.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `DB_fetch_stock_financial_calendar` | 获取财报日历 | DataFrame |
| `DB_fetch_stock_full` | 获取全市场某日数据 | DataFrame |
| `DB_fetch_financial_report` | 获取财务报表 | DataFrame |

### 3.8 实时行情 (market.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `DB_fetch_quotation` | 获取单只股票实时行情 | DataFrame |
| `DB_fetch_quotations` | 获取全市场实时行情 | DataFrame |

### 3.9 回测数据 (backtest.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `DB_fetch_backtest_info` | 获取回测信息 | DataFrame |
| `DB_fetch_backtest_history` | 获取回测历史 | DataFrame |
| `DB_fetch_account` | 获取账户信息 | list |
| `DB_fetch_risk` | 获取风险信息 | list |
| `DB_fetch_user` | 获取用户信息 | list |
| `DB_fetch_strategy` | 获取策略信息 | list |

### 3.10 龙虎榜 (lhb.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `DB_fetch_lhb` | 获取龙虎榜数据 | DataFrame |

### 3.11 CTP Tick (ctp.py)

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `DB_fetch_ctp_tick` | 获取CTP Tick数据 | DataFrame |

---

## 四、advance 模块 (高级封装)

**路径**: `FQData.fetch.advance`

将 `DB_fetch_*` 获取的 DataFrame 封装成对应的 DataStruct。

### 4.1 函数列表

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `fetch_stock_day_adv` | 股票日线高级封装 | StockDayData |
| `fetch_stock_min_adv` | 股票分钟线高级封装 | StockMinData |
| `fetch_stock_day_full_adv` | 全市场日线高级封装 | StockDayData |
| `fetch_index_day_adv` | 指数日线高级封装 | IndexDayData |
| `fetch_index_min_adv` | 指数分钟线高级封装 | IndexMinData |
| `fetch_bond2stock_day_adv` | 可转债转股日线高级封装 | Bond2StockDayData |
| `fetch_bond2stock_min_adv` | 可转债转股分钟线高级封装 | Bond2StockMinData |
| `fetch_stock_transaction_adv` | 股票交易分笔高级封装 | StockTransactionData |
| `fetch_index_transaction_adv` | 指数交易分笔高级封装 | IndexTransactionData |
| `fetch_stock_list_adv` | 股票列表高级封装 | DataFrame |
| `fetch_bond2stock_list_adv` | 可转债列表高级封装 | DataFrame |
| `fetch_index_list_adv` | 指数列表高级封装 | DataFrame |
| `fetch_future_day_adv` | 期货日线高级封装 | FutureDayData |
| `fetch_future_min_adv` | 期货分钟线高级封装 | FutureMinData |
| `fetch_future_list_adv` | 期货列表高级封装 | DataFrame |
| `fetch_stock_block_adv` | 股票板块高级封装 | StockBlockData |
| `fetch_financial_report_adv` | 财务报表高级封装 | FinancialData |
| `fetch_stock_financial_calendar_adv` | 财报日历高级封装 | FinancialData |
| `fetch_stock_divyield_adv` | 股息率高级封装 | FinancialData |

**使用示例**:
```python
from FQData.fetch.advance import fetch_stock_day_adv

data = fetch_stock_day_adv('000001', '2020-01-01', '2020-12-31')
print(data.groupby())  # 使用 StockDayData 方法
```

---

## 五、fetcher 模块 (统一门面)

**路径**: `FQData.fetch.fetcher`

整合本地MongoDB和在线TDX数据源的统一API。

### 5.1 类

#### Fetcher
同步数据获取器。

```python
from FQData.fetch.fetcher import Fetcher
from FQBase.FQConfig.constants import MARKET_TYPE, DATASOURCE

fetcher = Fetcher()
data = fetcher.get_quotation('000001', '2020-01-01', '2020-02-01',
                             'day', MARKET_TYPE.STOCK_CN, DATASOURCE.TDX)
```

#### AsyncFetcher
异步数据获取器。

```python
async def main():
    fetcher = AsyncFetcher()
    data = await fetcher.get_quotation('000001', '2020-01-01', '2020-02-01', 'day')
```

### 5.2 函数

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `get_tick` | 统一获取tick数据 | DataFrame |
| `get_realtime` | 统一获取实时行情 | DataFrame |
| `quotation_adv` | 高级K线获取 (支持AUTO数据源) | DataFrame/DataStruct |
| `quotation` | 基础K线获取 | DataFrame/DataStruct |

**使用示例**:
```python
from FQData.fetch.fetcher import quotation_adv
from FQBase.FQConfig.constants import MARKET_TYPE, DATASOURCE, OUTPUT_FORMAT

# 高级用法 - 自动从MongoDB获取，本地缺失从TDX补全
data = quotation_adv(
    code='000001',
    start='2020-01-01',
    end='2020-02-01',
    frequence='day',
    market=MARKET_TYPE.STOCK_CN,
    source=DATASOURCE.AUTO,  # 自动选择
    output=OUTPUT_FORMAT.DATAFRAME
)
```

### 5.3 参数说明

| 参数 | 可选值 | 说明 |
|------|--------|------|
| `market` | `MARKET_TYPE.STOCK_CN`, `FUTURE_CN`, `INDEX_CN`, `OPTION_CN` | 市场类型 |
| `source` | `DATASOURCE.AUTO`, `MONGO`, `TDX` | 数据源 |
| `frequence` | `day`, `week`, `1min`, `5min`, `15min`, `30min`, `60min` | 频率 |
| `output` | `OUTPUT_FORMAT.DATAFRAME`, `DATASTRUCT`, `NDARRAY`, `JSON`, `LIST` | 输出格式 |

---

## 六、迁移对照表

### 6.1 原始名称 → 新名称

| 原始模块 | 迁移后 | 状态 |
|----------|--------|------|
| `QATdx` | `FQData.fetch.tdx` | ✅ |
| `QAQuery` | `FQData.fetch.local` | ✅ |
| `QAQuery_Advance` | `FQData.fetch.advance` | ✅ |
| `Fetcher` | `FQData.fetch.fetcher` | ✅ |

### 6.2 原始函数名 → 新函数名

| 原始 | 新 | 模块 |
|------|-----|------|
| `QA_fetch_get_stock_day` | `TDX_fetch_get_stock_day` | tdx |
| `QA_fetch_stock_day` | `DB_fetch_stock_day` | local |
| `QA_fetch_stock_day_adv` | `fetch_stock_day_adv` | advance |
| `QA_quotation_adv` | `quotation_adv` | fetcher |

---

## 七、导出汇总

```python
# 通达信数据
from FQData.fetch.tdx import (
    TDX_fetch_get_stock_day,
    TDX_fetch_get_index_day,
    TDX_fetch_get_bond_day,
    TDX_fetch_get_future_day,
    TDX_fetch_get_option_list,
    TdxExecutor,
)

# 本地数据库
from FQData.fetch.local import (
    DB_fetch_stock_day,
    DB_fetch_stock_min,
    DB_fetch_index_day,
    DB_fetch_stock_list,
)

# 高级封装
from FQData.fetch.advance import (
    fetch_stock_day_adv,
    fetch_stock_min_adv,
    fetch_index_day_adv,
)

# 统一门面
from FQData.fetch.fetcher import (
    Fetcher,
    AsyncFetcher,
    get_tick,
    get_realtime,
    quotation_adv,
    quotation,
)
```
