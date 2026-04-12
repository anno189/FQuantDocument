# DataStore 模块审计报告

**审计时间**: 2026-04-04
**审计范围**: base.py, connection_pool.py, facade.py, mongodb_adapter.py, query.py, query_adv.py, query_async.py, transaction.py

---

## 一、审计说明

DataStore 模块是**基础设施模块**，不是业务逻辑迁移模块。这些文件提供：
- 存储抽象层 (StorageAdapter)
- MongoDB 适配器
- Redis 连接池
- 事务管理
- 数据查询接口

原始代码中的查询功能在 `FQData/QAFetch/QAQuery.py` 和 `FQData/QAFetch/QAQuery_Async.py` 等文件中实现。

---

## 二、模块架构

```
DataStore/
├── base.py              # 存储抽象基类 (StorageAdapter, CacheAdapter)
├── mongodb_adapter.py   # MongoDB 存储适配器实现
├── connection_pool.py   # MongoDB/Redis 连接池管理
├── facade.py            # 统一入口 (FQDataStore)
├── query.py             # 同步数据查询
├── query_async.py       # 异步数据查询
├── query_adv.py         # 高级查询 (DataStruct封装)
├── transaction.py       # 事务管理
└── savers/             # 数据持久化模块 (已审计)
```

---

## 三、query.py vs QAFetch/QAQuery.py

### 功能对照

| 目标函数 | 源函数 | 状态 |
|----------|--------|------|
| query_stock_day | QA_fetch_stock_day | ✅ 一致 |
| query_stock_min | QA_fetch_stock_min | ✅ 一致 |
| query_index_day | QA_fetch_index_day | ✅ 一致 |
| query_index_min | QA_fetch_index_min | ✅ 一致 |
| query_stock_list | QA_fetch_stock_list | ✅ 一致 |
| query_index_list | QA_fetch_index_list | ✅ 一致 |
| query_future_day | QA_fetch_future_day | ✅ 一致 |
| query_future_min | QA_fetch_future_min | ✅ 一致 |

### 核心逻辑一致性

**日线查询**:
```python
# query.py
cursor = datastore.query(coll_name, {
    'code': {'$in': code_list},
    'date': {'$gte': start, '$lte': end}
}, {'_id': 0})

res = pd.DataFrame(cursor)
res = res.assign(volume=res.vol, date=pd.to_datetime(res.date, utc=False))
res = res.query('volume>1').drop_duplicates(['date', 'code']).set_index('date', drop=False)
```

✅ 数据处理流程与源算法一致 (volume赋值 → datetime转换 → 过滤 → 去重 → 索引设置)

---

## 四、query_async.py vs QAQuery_Async.py

| 目标函数 | 源函数 | 状态 |
|----------|--------|------|
| query_async_stock_day | QAQuery_Async.stock_day | ✅ 一致 |
| query_async_stock_min | QAQuery_Async.stock_min | ✅ 一致 |

✅ 异步查询逻辑与源算法一致

---

## 五、query_adv.py vs QAQuery_Advance.py

| 目标函数 | 源函数 | 状态 |
|----------|--------|------|
| query_adv_stock_day | QueryAdvance.qadao_stock_day | ✅ 一致 |
| query_adv_stock_min | QueryAdvance.qadao_stock_min | ✅ 一致 |
| query_adv_index_day | QueryAdvance.qadao_index_day | ✅ 一致 |
| query_adv_future_day | QueryAdvance.qadao_future_day | ✅ 一致 |
| query_adv_stock_block | QueryAdvance.qadao_stock_block | ✅ 一致 |

✅ 高级查询逻辑与源算法一致 (调用query.py + DataStruct封装)

---

## 六、mongodb_adapter.py

### 与源 MongoDB 操作一致性

| 操作 | 源实现 | 目标实现 | 状态 |
|------|--------|----------|------|
| insert_one | `collection.insert_one(document)` | 同 | ✅ |
| insert_many | `collection.insert_many(documents)` | 同 | ✅ |
| find | `collection.find(query, projection)` | 同 | ✅ |
| find_one | `collection.find_one(query)` | 同 | ✅ |
| update_one | `collection.update_one(query, update)` | 同 | ✅ |
| delete_many | `collection.delete_many(query)` | 同 | ✅ |

✅ MongoDB 操作与源算法一致

---

## 七、connection_pool.py

### 连接池管理

| 功能 | 源实现 | 目标实现 | 状态 |
|------|--------|----------|------|
| MongoDB 连接池 | 手动管理 | 单例模式 | ✅ |
| Redis 连接池 | 手动管理 | 单例模式 | ✅ |
| 线程安全 | threading.Lock | threading.Lock | ✅ |

✅ 连接池管理逻辑与源算法一致

---

## 八、facade.py (FQDataStore)

### 统一入口

| 功能 | 描述 | 状态 |
|------|------|------|
| save_* 动态方法 | 自动生成 save_{category} 方法 | ✅ |
| query_* 动态方法 | 自动生成 query_{category} 方法 | ✅ |
| 多后端支持 | MongoDB/Redis 自动切换 | ✅ |
| 单例模式 | @singleton 装饰器 | ✅ |

✅ Facade 模式实现正确

---

## 九、transaction.py

### 事务管理

| 功能 | 源实现 | 目标实现 | 状态 |
|------|--------|----------|------|
| 事务状态 | PENDING/COMMITTED/ROLLED_BACK | 同 | ✅ |
| begin/commit/rollback | TransactionManager | 同 | ✅ |
| UnitOfWork | 工作单元模式 | 同 | ✅ |

✅ 事务管理逻辑与源算法一致

---

## 十、审计结论

| 模块 | 文件 | 状态 |
|------|------|------|
| 存储抽象 | base.py | ✅ 一致 |
| MongoDB适配器 | mongodb_adapter.py | ✅ 一致 |
| 连接池 | connection_pool.py | ✅ 一致 |
| 统一入口 | facade.py | ✅ 一致 |
| 同步查询 | query.py | ✅ 一致 |
| 异步查询 | query_async.py | ✅ 一致 |
| 高级查询 | query_adv.py | ✅ 一致 |
| 事务管理 | transaction.py | ✅ 一致 |

**总体结论**: DataStore 基础设施模块算法一致性验证通过