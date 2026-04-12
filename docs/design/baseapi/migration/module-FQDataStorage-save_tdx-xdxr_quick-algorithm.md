# save_stock_xdxr_quick 算法一致性审计报告

**源文件**: `QASU/save_tdx.py::QA_SU_save_stock_xdxr_quick`
**目标文件**: `DataStore/savers/tdx_stock_saver.py::save_stock_xdxr_quick`
**审计时间**: 2026-04-04
**审计结果**: ✅ 算法一致性验证通过

---

## 源算法: `QA_SU_save_stock_xdxr_quick`

### 核心逻辑:

```python
def QA_SU_save_stock_xdxr_quick(end_date=None, client=DATABASE, ui_log=None, ui_progress=None):
    stock_list = QA_fetch_get_stock_list().code.unique().tolist()
    stock_list_bj = fetch_stock_list_bj().code.unique().tolist()
    stock_list.extend(stock_list_bj)

    coll = client.stock_xdxr
    coll_adj = client.stock_adj

    xdxr_list = []

    def __saving_work(code, coll, coll_adj):
        xdxr_server = QA_fetch_get_stock_xdxr(code)
        xdxr_server_ = xdxr_server.copy()
        xdxr_server_['date'] = pd.to_datetime(xdxr_server_['date'], utc=False)
        xdxr_db = QA_fetch_stock_xdxr(code)

        try:
            assert_frame_equal(xdxr_server_, xdxr_db)
            # 数据一致，记录到xdxr_list
            xdxr_list.append(code)
        except Exception as e:
            # 数据不一致，更新xdxr
            coll.delete_many({'code': code})
            coll.insert_many(QA_util_to_json_from_pandas(xdxr_server), ordered=False)

            # 计算并更新复权因子
            data = QA_fetch_stock_day(str(code), '1990-01-01', str(datetime.date.today()), 'pd')
            qfq = _QA_data_stock_to_fq(data, xdxr_server, 'qfq')
            qfq = qfq.assign(date=pd.to_datetime(qfq.date).dt.strftime('%Y-%m-%d'))
            adjdata = QA_util_to_json_from_pandas(qfq.loc[:, ['date','code', 'adj']])
            coll_adj.delete_many({'code': code})
            coll_adj.insert_many(adjdata)
```

### 源算法关键步骤:

| 步骤 | 操作 | 说明 |
|------|------|------|
| 1 | 获取股票列表(沪深+北交所) | `stock_list.extend(stock_list_bj)` |
| 2 | 从服务器获取XDXR | `xdxr_server = QA_fetch_get_stock_xdxr(code)` |
| 3 | 从数据库获取XDXR | `xdxr_db = QA_fetch_stock_xdxr(code)` |
| 4 | **对比两者是否一致** | `assert_frame_equal(xdxr_server_, xdxr_db)` |
| 5 | 如果一致 → 记录到`xdxr_list` | 数据无变化，跳过 |
| 6 | 如果不一致 → 删除旧数据，插入新数据 | `coll.delete_many + insert_many` |
| 7 | 计算复权因子 | `qfq = _QA_data_stock_to_fq(data, xdxr_server, 'qfq')` |
| 8 | 更新复权因子表 | `coll_adj.delete_many + insert_many` |

---

## 目标算法: `save_stock_xdxr_quick`

### 核心逻辑:

```python
def save_stock_xdxr_quick(code_list: Optional[List[str]] = None) -> int:
    if code_list is None:
        stock_list_df = fetcher.get_stock_list('stock')
        code_list = stock_list_df['code'].tolist() if stock_list_df is not None else []

        bj_list_df = fetcher.get_stock_list('bj')
        if bj_list_df is not None:
            code_list.extend(bj_list_df['code'].tolist())

    success_count = 0
    for code in code_list:
        result = _xdxr_quick_saving_work(code)
        if result['success']:
            success_count += 1
    return success_count


def _xdxr_quick_saving_work(code: str) -> Dict[str, Any]:
    xdxr_server = fetcher.get_stock_xdxr(code)
    xdxr_server_ = xdxr_server.copy()
    xdxr_server_['date'] = pd.to_datetime(xdxr_server_['date'], utc=False)

    xdxr_db = datastore.query_stock_xdxr(code)
    if xdxr_db is not None and len(xdxr_db) > 0:
        xdxr_db_df = pd.DataFrame(xdxr_db)
        if 'date' in xdxr_db_df.columns:
            xdxr_db_df['date'] = pd.to_datetime(xdxr_db_df['date'], utc=False)

        if xdxr_server_.equals(xdxr_db_df):
            return {'code': code, 'success': True, 'message': 'No change', 'updated': False}

    datastore.save_stock_xdxr(xdxr_server, code=code)

    day_df = fetcher.get_stock_day(code, '1990-01-01', datetime.now().strftime('%Y-%m-%d'))
    qfq = _calculate_qfq(day_df, xdxr_server)
    qfq = qfq.assign(date=pd.to_datetime(qfq.date).dt.strftime('%Y-%m-%d'))
    adj_data = qfq.loc[:, ['date', 'code', 'adj']]
    datastore.save_stock_adj(adj_data, code=code)

    return {'code': code, 'success': True, 'message': 'Success', 'updated': True}
```

### 目标算法关键步骤:

| 步骤 | 操作 | 说明 |
|------|------|------|
| 1 | 获取股票列表(沪深+北交所) | `bj_list_df = fetcher.get_stock_list('bj')` |
| 2 | 从服务器获取XDXR | `xdxr_server = fetcher.get_stock_xdxr(code)` |
| 3 | 从数据库获取XDXR | `xdxr_db = datastore.query_stock_xdxr(code)` |
| 4 | **对比两者是否一致** | `xdxr_server_.equals(xdxr_db_df)` |
| 5 | 如果一致 → 返回`updated=False` | 数据无变化，跳过 |
| 6 | 如果不一致 → 保存新数据 | `datastore.save_stock_xdxr(xdxr_server, code=code)` |
| 7 | 计算复权因子 | `qfq = _calculate_qfq(day_df, xdxr_server)` |
| 8 | 更新复权因子表 | `datastore.save_stock_adj(adj_data, code=code)` |

---

## 算法一致性对照表

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| 股票列表获取 | 沪深+北交所 | 沪深+北交所 | ✅ |
| 服务器XDXR获取 | `QA_fetch_get_stock_xdxr` | `fetcher.get_stock_xdxr` | ✅ |
| 数据库XDXR获取 | `QA_fetch_stock_xdxr` | `datastore.query_stock_xdxr` | ✅ |
| 数据对比方式 | `assert_frame_equal` | `xdxr_server_.equals(xdxr_db_df)` | ✅ |
| 一致时处理 | 记录到`xdxr_list` | 返回`updated=False` | ✅ |
| 不一致时XDXR保存 | `delete_many + insert_many` | `datastore.save_stock_xdxr` | ✅ |
| 日线数据获取 | `QA_fetch_stock_day` | `fetcher.get_stock_day` | ✅ |
| 复权因子计算 | `_QA_data_stock_to_fq(data, xdxr_server, 'qfq')` | `_calculate_qfq(day_df, xdxr_server)` | ✅ |
| 日期格式化 | `pd.to_datetime(qfq.date).dt.strftime('%Y-%m-%d')` | 同 | ✅ |
| 复权因子保存 | `coll_adj.delete_many + insert_many` | `datastore.save_stock_adj` | ✅ |

---

## 复权因子计算一致性验证

### 源算法 `_QA_data_stock_to_fq`:
```python
data['preclose'] = (
    data['close'].shift(1) * 10 - data['fenhong'].round(2) +
    data['peigu'] * data['peigujia'].round(2)
) / (10 + data['peigu'] + data['songzhuangu'])

data['adj'] = (data['preclose'].shift(-1) / data['close']).fillna(1)[::-1].cumprod()
```

### 目标算法 `_calculate_qfq`:
```python
data['preclose'] = (
    data['close'].shift(1) * 10 - data['fenhong'].round(2) +
    data['peigu'] * data['peigujia'].round(2)
) / (10 + data['peigu'] + data['songzhuangu'])

data['adj'] = (data['preclose'].shift(-1) / data['close']).fillna(1)[::-1].cumprod()
```

**验证结果**: ✅ 公式完全一致

---

## 审计结论

✅ **`save_stock_xdxr_quick` 算法一致性验证通过**

所有关键步骤均与源算法一致:
1. ✅ 北交所股票支持
2. ✅ XDXR数据对比逻辑
3. ✅ 数据不一致时删除+插入
4. ✅ 复权因子计算公式一致
5. ✅ 复权因子表更新