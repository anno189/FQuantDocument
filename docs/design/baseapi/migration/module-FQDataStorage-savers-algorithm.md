# Saver模块算法一致性审计报告

**审计时间**: 2026-04-04
**审计范围**: tdx_bond_saver.py, tdx_concept_saver.py, tdx_financial_saver.py, tdx_future_saver.py

---

## 一、tdx_bond_saver.py

### 1. save_jisilu_bond_cbnewlist

**源文件**: `QASU/save_code_bond_cbnewlist_jisilu.py::saveCbnewlistData`

| 对比项 | 源算法 | 目标算法(修复前) | 状态 |
|--------|--------|------------------|------|
| renew=False且数据存在 | 返回 None | 返回 True | ❌ |
| insert数据 | `QA_util_to_json_from_pandas(data)` | `data.to_dict('records')` | ✅ |
| 日志格式 | `##JOB99 Now Saving cbnew_list ====` | `##JOB99 Now Saving cbnew_list, inserted {result}` | ✅ |

**修复后状态**: ✅ 已修复

```python
# 修复后
if datastore.query(coll_name, query_id) is not None:
    if not renew:
        logger.info("cbnew_list already exists, skip (use renew=True to overwrite)")
        return None  # 与源算法一致
```

---

### 2. get_bond_cbnewlist

**源文件**: `QASU/save_code_bond_cbnewlist_jisilu.py::get_bond_cbnewlist`

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| DataFrame构建 | `pd.DataFrame([item for item in ref])` | `pd.DataFrame(cursor)` | ✅ |
| _id删除 | `.drop('_id', axis=1, inplace=False)` | 条件删除 | ✅ |
| 合并tdx_list | `data.merge(tdx_list, how='left', left_on='bond_id', right_on='code')` | ✅ |
| 过滤空code | `data[data['code'] != '']` | ✅ |
| 返回列 | `['code', 'name', 'stock_id', 'stock_nm', 'sse', 'price_tips']` | ✅ |

✅ 算法一致性验证通过

---

## 二、tdx_concept_saver.py

### 1. save_tdx_concept_from_csv

**源文件**: `QASU/save_code_tdx_concept.py::save_tdx_concept_from_csv`

| 对比项 | 源算法 | 目标算法(修复前) | 状态 |
|--------|--------|------------------|------|
| 空数据检查位置 | 在delete之后 | 在delete之前 | ❌ |
| 删除逻辑 | 无条件delete两次 | 有条件delete一次 | ❌ |
| insert数据 | `QA_util_to_json_from_pandas(data)` | `data.to_dict('records')` | ✅ |
| 日志 | `##JOB99 Now Saving code_stock_concept data ====` | `inserted {result} records` | ✅ |

**修复后状态**: ✅ 已修复

```python
# 修复后
query_id = {}
datastore._primary_storage.delete_many(coll_name, query_id)

if data.empty:
    return None

datastore._primary_storage.delete_many(coll_name, query_id)
datastore._primary_storage.insert_many(coll_name, data.to_dict('records'))
```

---

### 2. load_tdx_concept

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| 查询 | `find({})` | `query(coll_name, {})` | ✅ |
| _id/count删除 | `.drop(['_id', 'count'], errors='ignore')` | 条件删除 | ✅ |
| 索引设置 | `.set_index('code', drop=False)` | ✅ |
| blockData计算 | `groupby('blockname').count()` | ✅ |
| 合并方式 | `merge(blockData, how='left', left_on='name', right_on='blockname')` | ✅ |

✅ 算法一致性验证通过

---

## 三、tdx_financial_saver.py

### 1. save_financial_files

**源文件**: `QASU/save_financialfiles.py::QA_SU_save_financial_files`

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| 下载方式 | `download_financialzip()` 或 `download_financialzip_fromtdx()` | ✅ | ✅ |
| 文件过滤 | `item[0:4] != 'gpcw'` | ✅ | ✅ |
| 日期提取 | `int(item.split('.')[0][-8:])` | 目标用字符串切片 | ⚠️ |
| 解析方式 | `parse_filelist([item]).reset_index()` | `_parse_filelist([item])` | ✅ |
| 去重 | `drop_duplicates(subset=['code', 'report_date'])` | ✅ | ✅ |
| report_date类型 | `int` | `int` | ✅ |
| 插入方式 | `update_one upsert` | `save_financial` | ⚠️ |
| 内存不足处理 | `insert_many` | 逐条插入 | ✅ |

⚠️ 存在细微差异，但核心逻辑一致

---

## 四、tdx_future_saver.py

### 1. save_single_future_day

**源文件**: `QASU/save_tdx.py::QA_SU_save_single_future_day`

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| 默认start | `'2015-01-01'` | `'2015-01-01'` | ✅ |
| 默认end | `now_time()[0:10]` | `datetime.now().strftime('%Y-%m-%d')` | ✅ |
| 日线获取 | `QA_fetch_get_future_day` | `fetcher.get_future_day` | ✅ |
| 保存方式 | `coll.insert_many` | `datastore.save_future_day` | ✅ |

✅ 算法一致性验证通过

---

### 2. save_future_day

| 对比项 | 源算法 | 目标算法 | 状态 |
|--------|--------|----------|------|
| 默认start | `'2015-01-01'` | `'2015-01-01'` | ✅ |
| 获取期货列表 | `QA_fetch_get_future_list` | `fetcher.get_future_list` | ✅ |
| 循环调用single | `for code in stock_list: save_single_future_day(code)` | ✅ | ✅ |

✅ 算法一致性验证通过

---

## 修复汇总

| 文件 | 函数 | 修复内容 |
|------|------|----------|
| tdx_bond_saver.py | save_jisilu_bond_cbnewlist | renew=False且数据存在时返回None |
| tdx_concept_saver.py | save_tdx_concept_from_csv | 无条件delete两次，空数据检查位置调整 |

---

## 审计结论

1. **tdx_bond_saver.py**: ✅ 修复后算法一致
2. **tdx_concept_saver.py**: ✅ 修复后算法一致
3. **tdx_financial_saver.py**: ⚠️ 核心逻辑一致，存在实现细节差异
4. **tdx_future_saver.py**: ✅ 算法一致性验证通过