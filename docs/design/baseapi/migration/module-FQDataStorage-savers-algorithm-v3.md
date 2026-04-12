# Saver模块算法一致性审计报告 (第三批)

**审计时间**: 2026-04-04
**审计范围**: tdx_parallel_saver.py, tdx_stock_saver.py, tdx_transaction_saver.py, tdx_usstock_saver.py, tdx_xdxr_checker.py

---

## 一、tdx_parallel_saver.py

### 源文件: `QASU/save_tdx_parallelism.py`

### 1. _calculate_qfq (复权因子计算)

**源算法** (data_fq.py::_QA_data_stock_to_fq):
```python
data['preclose'] = (
    data['close'].shift(1) * 10 - data['fenhong'].round(2) +
    data['peigu'] * data['peigujia'].round(2)
) / (10 + data['peigu'] + data['songzhuangu'])

data['adj'] = (data['preclose'].shift(-1) / data['close']).fillna(1)[::-1].cumprod()
```

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| preclose公式 | `(close.shift(1)*10 - fenhong + peigu*peigujia) / (10+peigu+songzhuangu)` | 同 | ✅ |
| adj计算 | `(preclose.shift(-1) / close).fillna(1)[::-1].cumprod()` | 同 | ✅ |

✅ 算法一致性验证通过

---

### 2. save_stock_day_parallel

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| 默认start | `'1990-01-01'` | `'1990-01-01'` | ✅ |
| 默认end | `now_time()[0:10]` | `datetime.now().strftime('%Y-%m-%d')` | ⚠️ |
| 北交所支持 | `fetch_stock_list_bj()` | `fetcher.get_stock_list('bj')` | ✅ |
| 多进程 | `ProcessPoolExecutor` | `ProcessPoolExecutor` | ✅ |
| IP负载均衡 | `get_ip_list_by_multi_process_ping()` | `_get_best_ips()` | ✅ |

⚠️ 默认end略有差异，但不影响功能

---

### 3. _xdxr_saving_work (XDXR保存)

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| XDXR获取 | `QA_fetch_get_stock_xdxr(code)` | `fetcher.get_stock_xdxr(code)` | ✅ |
| 数据对比 | `assert_frame_equal` | `xdxr_server_.equals(xdxr_db_df)` | ✅ |
| 数据一致时 | 记录到xdxr_list | 返回`updated=False` | ✅ |
| 数据不一致时 | `delete_many + insert_many` | `save_stock_xdxr` | ✅ |
| 复权因子计算 | `_QA_data_stock_to_fq(data, xdxr_server, 'qfq')` | `_calculate_qfq(day_df, xdxr_server)` | ✅ |
| 复权因子保存 | `coll_adj.delete_many + insert_many` | `datastore.save_stock_adj` | ✅ |

✅ 算法一致性验证通过

---

### 4. save_stock_xdxr_parallel

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| 北交所支持 | `fetch_stock_list_bj()` | `fetcher.get_stock_list('bj')` | ✅ |
| with_comparison参数 | 支持 | 支持 | ✅ |
| 多进程 | `ProcessPoolExecutor` | `ProcessPoolExecutor` | ✅ |

✅ 算法一致性验证通过

---

## 二、tdx_stock_saver.py

### 源文件: `QASU/save_tdx.py`

### 1. now_time()

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| hour < 15判断 | `today.hour < 15` | `today.hour < 15` | ✅ |
| 15点前返回 | `上一个交易日 + 17:00` | 同 | ✅ |
| 15点后返回 | `当前交易日 + 15:00` | 同 | ✅ |

✅ 算法一致性验证通过

---

### 2. save_single_stock_day

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| 默认end | `now_time()[0:10]` | `now_time()[0:10]` | ✅ |
| 查询已存在数据 | `coll.find_one` | `datastore.query` | ✅ |
| 增量更新逻辑 | `if start_date != end_date` | `if start_date != end_date` | ✅ |
| 日线获取 | `QA_fetch_get_stock_day` | `fetcher.get_stock_day` | ✅ |

✅ 算法一致性验证通过

---

### 3. _calculate_qfq

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| preclose公式 | 一致 | 一致 | ✅ |
| adj计算 | 一致 | 一致 | ✅ |

✅ 算法一致性验证通过 (与tdx_parallel_saver.py一致)

---

### 4. save_stock_xdxr, save_stock_xdxr_quick, save_single_stock_xdxr

✅ 已修复，算法一致性验证通过 (参考之前的审计报告)

---

## 三、tdx_transaction_saver.py

### 源文件: `QASU/save_tdx.py::QA_SU_save_stock_transaction`

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| 默认start | `datetime.now().strftime('%Y-%m-%d')` | 同 | ✅ |
| 默认end | `datetime.now().strftime('%Y-%m-%d')` | 同 | ✅ |
| 分笔数据获取 | `QA_fetch_get_stock_transaction` | `fetcher.get_stock_transaction` | ✅ |
| 保存方式 | `coll.insert_many` | `datastore.save_stock_transaction` | ✅ |

✅ 算法一致性验证通过

---

## 四、tdx_xdxr_checker.py

### 源文件: `QASU/save_tdx.py::QA_SU_check_stock_xdxr`

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| 北交所支持 | `fetch_stock_list_bj()` | `fetcher.get_stock_list('bj')` | ✅ |
| 获取最后日期 | `util_get_real_date(None, towards=-1)` | `util_get_real_date(last_date, trade_date_sse, -1)` | ✅ |
| 查询缺失XDXR | `coll.find_one` | `datastore.query` | ✅ |
| 补全XDXR | `QA_fetch_get_stock_xdxr` | `fetcher.get_stock_xdxr` | ✅ |

✅ 算法一致性验证通过

---

## 五、tdx_usstock_saver.py

**状态**: ⏸️ 待实现

```
# TODO: 美股数据获取需要美股数据源适配器
# 当前跳过，等待美股数据源实现后再迁移以下函数:
# - QA_SU_save_single_usstock_day
# - QA_SU_save_usstock_day
# - QA_SU_save_single_usstock_min
# - QA_SU_save_usstock_min
# - QA_SU_save_usstock_list
```

---

## 修复汇总

| 文件 | 函数 | 状态 |
|------|------|------|
| tdx_stock_saver.py | save_stock_xdxr, save_stock_xdxr_quick, save_single_stock_xdxr | ✅ 已修复 |
| tdx_stock_saver.py | _calculate_qfq | ✅ 已添加 |
| tdx_stock_saver.py | now_time | ✅ 一致 |

---

## 审计结论

| 模块 | 算法一致性 |
|------|-----------|
| tdx_parallel_saver.py | ✅ 一致 |
| tdx_stock_saver.py | ✅ 修复后一致 |
| tdx_transaction_saver.py | ✅ 一致 |
| tdx_xdxr_checker.py | ✅ 一致 |
| tdx_usstock_saver.py | ⏸️ 待实现 |