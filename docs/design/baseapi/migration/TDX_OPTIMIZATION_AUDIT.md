# Tdx Adapter 优化审计报告

**审计时间**: 2026-03-31
**审计路径**: `DataSource/adapters/tdx/`
**审计结果**: ⭐⭐⭐⭐⭐ 优化良好

---

## 一、API 调用优化

### 1.1 分页策略 ✅

| 市场 | 分页大小 | 实现 |
|------|----------|------|
| 股票日线 | 800条/页 | `for i in range(int(lens / 800) + 1)` |
| 指数日线 | 800条/页 | `for i in range(int(lens / 800) + 1)` |
| 期货日线 | 500条/页 | `for i in range(int(num / 500) + 1)` |
| 债券日线 | 800条/页 | `for i in range(int(lens / 800) + 1)` |
| 期权日线 | 800条/页 | `for i in range(int(lens / 800) + 1)` |
| 港股日线 | 800条/页 | `for i in range(int(lens / 800) + 1)` |
| 历史分笔 | 2000条/页 | `for i in range(int(num / 2000) + 1)` |

**代码示例**:
```python
# stock.py - 分页获取日线数据
for i in range(int(lens / 800) + 1):
    data.append(api.to_df(api.get_security_bars(
        frequence, int(code_market.market),
        str(code), (int(lens / 800) - i) * 800, 800
    )))
```

### 1.2 数据合并 ✅

| 操作 | 方法 | 评估 |
|------|------|------|
| 批量合并 | `pd.concat([...], axis=0)` | ✅ 高效 |
| 索引重置 | `ignore_index=True` | ✅ 正确 |
| 排序 | `sort=False` | ✅ 避免不必要排序 |

**代码示例**:
```python
# 高效的数据合并
data = pd.concat(data_list, axis=0, sort=False).reset_index(drop=True)
```

---

## 二、缓存机制

### 2.1 IP 列表缓存 ✅

| 项目 | 值 |
|------|-----|
| 缓存键 | `tdx_ip_list_{type}` |
| TTL | 86400 秒 (1天) |
| 实现 | `FQDataStore` |

**代码**:
```python
# ip_selector.py
cache_key = f"tdx_ip_list_{type_}"
results = cache.get(cache_key)
if results is not None:
    return results
```

### 2.2 扩展市场缓存 ✅

| 项目 | 值 |
|------|-----|
| 缓存键 | `tdx_extensionmarket_list` |
| TTL | 86400 秒 (1天) |
| 实现 | `FQDataStore` |

---

## 三、重试机制

### 3.1 配置 ✅

| 参数 | 值 | 说明 |
|------|-----|------|
| 最大重试次数 | 3 | `stop_max_attempt_number=3` |
| 最小等待 | 50ms | `wait_random_min=50` |
| 最大等待 | 100ms | `wait_random_max=100` |

### 3.2 使用统计

| 方法 | @retry |
|------|--------|
| `get_stock_day` | ✅ |
| `get_stock_min` | ✅ |
| `get_index_day` | ✅ |
| `get_index_min` | ✅ |
| `get_bond_day` | ✅ |
| `get_bond_min` | ✅ |
| `get_future_day` | ✅ |
| `get_future_min` | ✅ |
| `get_hkstock_day` | ✅ |
| `get_hkstock_min` | ✅ |
| `get_macroindex_day` | ✅ |
| `get_macroindex_min` | ✅ |
| `get_exchange_rate_day` | ✅ |
| `get_exchange_rate_min` | ✅ |
| `get_stock_realtime` | ✅ |
| `get_index_realtime` | ✅ |
| `get_bond_realtime` | ✅ |
| `get_depth_market_data` | ✅ |
| `get_option_day` | ✅ |
| `get_option_min` | ✅ |
| `get_stock_transaction` | ✅ |
| `get_index_transaction` | ✅ |
| `get_stock_transaction_realtime` | ✅ |
| `get_extensionmarket_*` | ✅ |
| `get_future_realtime` | ✅ |

**总计**: 27+ 方法使用 `@retry`

---

## 四、代码结构优化

### 4.1 重复代码模式

**发现**: 多个文件有相似的分页+合并模式

```python
# 通用模式
data = pd.concat([
    api.to_df(api.get_security_bars(...))
    for i in range(int(lens / 800) + 1)
], axis=0, sort=False)
```

### 4.2 可优化项

| 问题 | 文件 | 建议 |
|------|------|------|
| 重复分页逻辑 | 多个文件 | 提取为基类方法 |
| 硬编码页大小 | 多个文件 | 提取为常量 |

### 4.3 建议优化

**选项 1**: 在 `TdxBaseAdapter` 中添加通用方法

```python
class TdxBaseAdapter(DataSourceAdapter):
    def _fetch_with_pagination(self, api, fetch_func, lens, page_size=800, **kwargs):
        """通用分页获取方法"""
        data = pd.concat([
            api.to_df(fetch_func(**kwargs, offset=i*page_size, page_size=page_size))
            for i in range(int(lens / page_size) + 1)
        ], axis=0, sort=False)
        return data
```

**选项 2**: 保持现状

- 优点: 代码直观，易于调试
- 缺点: 有一定重复

---

## 五、并发优化

### 5.1 多进程 Ping IP ✅

```python
# ip_selector.py
from multiprocessing import Pool

with Pool(processes=multiprocessing.cpu_count()) as pool:
    results = pool.map(_ping_ip, ip_list)
```

### 5.2 评估

| 方法 | 评估 |
|------|------|
| 多进程 | ✅ 有效利用多核 |
| 线程池 | 不适用 (I/O密集型) |

---

## 六、审计结论

| 检查项 | 状态 | 说明 |
|--------|------|------|
| API分页 | ✅ | 800条/页 |
| 缓存机制 | ✅ | IP/扩展市场 86400秒 |
| 重试机制 | ✅ | 3次重试 |
| 并发处理 | ✅ | 多进程 |
| DataFrame优化 | ✅ | 高效合并 |

### 总体评估

**⭐⭐⭐⭐⭐ 优化良好**

当前代码已充分优化:
- 分页策略避免数据量超限
- 缓存减少重复API调用
- 重试机制提高稳定性
- 多进程并发加速

### 低优先级建议

1. **代码重复**: 可考虑提取通用分页方法 (可选)
2. **硬编码常量**: 可提取页大小为常量 (可选)
