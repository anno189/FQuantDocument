# XDXR算法一致性审计报告

**源文件**: `QASU/save_tdx.py`
**目标文件**: `DataStore/savers/tdx_stock_saver.py`, `DataStore/savers/tdx_parallel_saver.py`
**审计时间**: 2026-04-04
**审计结果**: ❌ 算法不一致

---

## 源算法: `QA_SU_save_stock_xdxr_quick`

### 核心算法逻辑 (L674-754):

```python
def QA_SU_save_stock_xdxr_quick(end_date=None, client=DATABASE, ui_log=None, ui_progress=None):
    stock_list = QA_fetch_get_stock_list().code.unique().tolist()
    stock_list_bj = fetch_stock_list_bj().code.unique().tolist()
    stock_list.extend(stock_list_bj)

    coll = client.stock_xdxr
    coll_adj = client.stock_adj

    def __saving_work(code, coll, coll_adj):
        xdxr_server = QA_fetch_get_stock_xdxr(code)
        xdxr_server_ = xdxr_server.copy()
        xdxr_server_['date'] = pd.to_datetime(xdxr_server_['date'], utc=False)
        xdxr_db = QA_fetch_stock_xdxr(code)

        try:
            assert_frame_equal(xdxr_server_, xdxr_db)
            xdxr_list.append(code)  # 数据相同，记录到列表
        except Exception as e:
            # 数据不一致，更新 xdxr_db
            coll.delete_many({'code': code})
            coll.insert_many(QA_util_to_json_from_pandas(xdxr_server), ordered=False)

            # 计算前复权因子
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
| 1 | `xdxr_server = QA_fetch_get_stock_xdxr(code)` | 从服务器获取XDXR数据 |
| 2 | `xdxr_db = QA_fetch_stock_xdxr(code)` | 从数据库获取XDXR数据 |
| 3 | `assert_frame_equal(xdxr_server_, xdxr_db)` | **对比两者是否完全一致** |
| 4 | 如果一致 → `xdxr_list.append(code)` | 记录到待处理列表 |
| 5 | 如果不一致 → `coll.delete_many + insert_many` | **删除旧数据，插入新数据** |
| 6 | 计算 `qfq = _QA_data_stock_to_fq(data, xdxr_server, 'qfq')` | **计算前复权因子** |
| 7 | `coll_adj.delete_many + insert_many` | **删除旧复权因子，插入新复权因子** |

---

## 目标算法: `save_stock_xdxr_quick` → `save_stock_xdxr`

### 核心算法逻辑 (L450-471):

```python
def save_stock_xdxr_quick(code_list: Optional[List[str]] = None) -> int:
    return save_stock_xdxr(code_list if code_list else None)

def save_single_stock_xdxr(code: str) -> bool:
    return save_stock_xdxr(code)

def save_stock_xdxr(code: Optional[str] = None) -> bool:
    # ...
    for c in code_list:
        df = fetcher.get_stock_xdxr(c)
        if df is not None and not df.empty:
            if not datastore.save_stock_xdxr(df, code=c):
                existing = datastore.query_stock_xdxr(c)
                if existing is not None and len(existing) > 0:
                    logger.info(f"XDXR data for {c} already exists (duplicate key is OK)")
                else:
                    success = False
```

### 目标算法关键步骤:

| 步骤 | 操作 | 说明 |
|------|------|------|
| 1 | `xdxr_server = fetcher.get_stock_xdxr(code)` | 从服务器获取XDXR数据 |
| 2 | `datastore.save_stock_xdxr(df, code=c)` | 直接保存 |
| 3 | 如果失败 → `query_stock_xdxr(c)` | 查询已存在的数据 |
| 4 | **没有复权因子计算** | ❌ 缺失 |

---

## 算法不一致分析

### 不一致项 1: 数据对比逻辑

| 项目 | 源算法 | 目标算法 |
|------|--------|----------|
| 对比方式 | `assert_frame_equal(xdxr_server_, xdxr_db)` | ❌ **完全没有对比** |
| 对比目的 | 判断数据是否变化 | N/A |
| 变化时处理 | 删除旧数据，插入新数据 | 直接插入(依赖数据库唯一键) |

### 不一致项 2: 复权因子计算

| 项目 | 源算法 | 目标算法 |
|------|--------|----------|
| 调用函数 | `_QA_data_stock_to_fq(data, xdxr_server, 'qfq')` | ❌ **完全没有计算** |
| 保存集合 | `coll_adj.delete_many + insert_many` | ❌ **完全没有操作** |
| 影响 | 更新stock_adj表的前复权因子 | XDXR数据无复权因子 |

### 不一致项 3: 北交所股票支持

| 项目 | 源算法 | 目标算法 |
|------|--------|----------|
| 股票列表 | `stock_list.extend(stock_list_bj)` | ❌ **没有北交所支持** |
| 说明 | 包含沪深+北交所 | 只包含沪深 |

---

## 审计结论

### ❌ 严重不一致: `save_stock_xdxr_quick` 和 `save_single_stock_xdxr`

**问题**:

1. **缺失数据对比逻辑**: 源算法会对比服务器和数据库的XDXR数据，只有不一致时才更新
2. **缺失复权因子计算**: 源算法在XDXR更新后会计算并保存前复权因子到 `stock_adj` 表
3. **缺失北交所股票**: 源算法包含北交所股票列表

**影响**:
- 目标算法不会计算复权因子(`adj`字段)
- 目标算法不会更新 `stock_adj` 表
- 依赖数据库唯一键冲突来处理更新，不够精确

### ✅ 一致部分: `save_stock_xdxr`

`save_stock_xdxr` 函数本身通过调用 `datastore.save_stock_xdxr` 实现了XDXR数据的基本保存功能，但**仍然缺失复权因子计算**。

---

## 修复建议

1. **修复 `save_stock_xdxr`**: 在保存XDXR后，需要调用复权因子计算逻辑
2. **参考 `tdx_parallel_saver.py` 中的 `_xdxr_saving_work`**: 该函数实现了完整的XDXR更新和复权因子计算
3. **添加北交所股票支持**: 在获取股票列表时同时获取北交所列表

---

## 相关源函数

| 函数 | 状态 |
|------|------|
| `QA_SU_save_stock_xdxr_quick` | ❌ 算法不一致 |
| `QA_SU_save_stock_xdxr_one` | ❌ 算法不一致 |
| `QA_SU_save_stock_xdxr` | ❌ 缺失复权计算 |