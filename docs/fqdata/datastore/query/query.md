# 查询核心 (query.py)

提供从存储层查询各类行情和基础数据的功能，包含通用查询和回测查询。

## 模块路径

```
FQData.DataStore.query.query
```

## 通用查询

### query_stock_day

```python
def query_stock_day(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询股票日线数据。

---

### query_stock_adj

```python
def query_stock_adj(
    code: Union[str, List[str]],
    start: str,
    end: str,
    collections: str = None
) -> pd.DataFrame
```

查询股票复权系数 ADJ。

---

### query_stock_min

```python
def query_stock_min(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd',
    frequence: str = '1min'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询股票分钟线数据。

---

### query_stock_transaction

```python
def query_stock_transaction(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd',
    frequence: str = 'tick'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询股票分笔数据。

---

### query_index_transaction

```python
def query_index_transaction(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd',
    frequence: str = 'tick'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询指数分笔数据。

---

### query_trade_date

```python
def query_trade_date() -> pd.Series
```

获取交易日期序列。

---

### query_stock_list

```python
def query_stock_list() -> pd.DataFrame
```

获取股票列表（沪深）。

---

### query_stock_list_bj

```python
def query_stock_list_bj() -> pd.DataFrame
```

获取北交所股票列表。

---

### query_stock_list_all

```python
def query_stock_list_all(debug: bool = True) -> pd.DataFrame
```

获取所有股票列表（沪深 + 北交所）。

---

### refresh_stock_list_all_cache

```python
def refresh_stock_list_all_cache()
```

刷新股票列表缓存（供 Celery 定时任务调用）。

---

### query_bond2stock_list

```python
def query_bond2stock_list() -> pd.DataFrame
```

获取可转债正股列表。

---

### query_etf_list

```python
def query_etf_list() -> pd.DataFrame
```

获取ETF列表。

---

### query_index_list

```python
def query_index_list() -> pd.DataFrame
```

获取指数列表。

---

### query_stock_terminated

```python
def query_stock_terminated() -> pd.DataFrame
```

获取已退市股票列表。

---

### query_stock_full

```python
def query_stock_full(date: str, format: str = 'pd') -> Union[pd.DataFrame, np.ndarray, List]
```

获取全市场某一日的数据。

---

### query_bond2stock_day

```python
def query_bond2stock_day(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询可转债正股日线数据。

---

### query_index_day

```python
def query_index_day(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询指数日线数据。

---

### query_index_min

```python
def query_index_min(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd',
    frequence: str = '1min'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询指数分钟线数据。

---

### query_bond2stock_min

```python
def query_bond2stock_min(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd',
    frequence: str = '1min'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询可转债正股分钟数据。

---

### query_future_day

```python
def query_future_day(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd'
) -> Union[pd.DataFrame, np.ndarray, List, Dict]
```

查询期货日线数据。

---

### query_future_min

```python
def query_future_min(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    format: str = 'pd',
    frequence: str = '1min'
) -> Union[pd.DataFrame, np.ndarray, List]
```

查询期货分钟数据。

---

### query_future_list

```python
def query_future_list() -> pd.DataFrame
```

获取期货列表。

---

### query_future_tick

```python
def query_future_tick()
```

查询期货tick数据（暂未实现）。

---

### query_ctp_tick

```python
def query_ctp_tick(
    code: Union[str, List[str]],
    start_date: str,
    end_date: str,
    frequence: str,
    format: str = 'pd'
) -> pd.DataFrame
```

查询CTP Tick数据。

---

### query_stock_xdxr

```python
def query_stock_xdxr(code: Union[str, List[str]], format: str = 'pd') -> pd.DataFrame
```

查询股票除权信息。

---

### query_stock_block

```python
def query_stock_block(code: str = None, format: str = 'pd') -> pd.DataFrame
```

查询股票板块数据。

---

### query_stock_info

```python
def query_stock_info(code: Union[str, List[str]], format: str = 'pd') -> pd.DataFrame
```

查询股票基本信息。

---

### query_stock_name

```python
def query_stock_name(code: Union[str, List[str]]) -> Union[str, pd.DataFrame]
```

查询股票名称。

---

### query_index_name

```python
def query_index_name(code: Union[str, List[str]]) -> Union[str, pd.DataFrame]
```

查询指数名称。

---

### query_etf_name

```python
def query_etf_name(code: Union[str, List[str]]) -> Union[str, pd.DataFrame]
```

查询ETF名称。

---

### query_quotation

```python
def query_quotation(code: str, date: date = None) -> pd.DataFrame
```

查询实时行情存储结果。

---

### query_quotations

```python
def query_quotations(date: date = None) -> pd.DataFrame
```

查询全部实时行情存储结果。

---

### query_account

```python
def query_account(message: Dict = None) -> List
```

查询账户信息。

---

### query_risk

```python
def query_risk(message: Dict = None) -> List
```

查询风险信息。

---

### query_user

```python
def query_user(user_cookie: str) -> List
```

查询用户信息。

---

### query_strategy

```python
def query_strategy(message: Dict = None) -> List
```

查询策略信息。

---

### query_lhb

```python
def query_lhb(date: str) -> pd.DataFrame
```

查询龙虎榜数据。

---

## 回测查询

### query_backtest_info

```python
def query_backtest_info(
    user: str = None,
    account_cookie: str = None,
    strategy: str = None,
    stock_list: str = None
) -> Dict
```

查询回测账户信息。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| user | str | 用户标识 |
| account_cookie | str | 账户cookie |
| strategy | str | 策略标识 |
| stock_list | str | 股票列表 |

---

### query_backtest_history

```python
def query_backtest_history(cookie: str = None) -> pd.DataFrame
```

查询回测历史。

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| cookie | str | 回测cookie |

---

## 相关文档

- [Query 模块 README](./README.md)
- [股票查询](./stock.md)
- [指数查询](./index.md)
- [期货查询](./future.md)
