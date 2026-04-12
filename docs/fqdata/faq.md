# FQData 常见问题

## 数据获取

### Q: 数据源连接失败怎么办？

**A:** 检查网络连接和数据源服务状态。

```python
from FQData import get_datasource

ds = get_datasource()

status = ds.health_check()
print(status.details)

ds.set_mode('tdx')
```

### Q: 如何处理获取数据为空？

**A:** 检查代码和市场是否正确。

```python
from FQData.normalizer import get_stock_market

market = get_stock_market('600000')
print(f"市场: {market}")

data = ds.get_stock_day(code='600000', start='2024-01-01')
if data is None or len(data) == 0:
    print("数据为空，检查代码或日期范围")
```

### Q: 复权数据获取异常？

**A:** 确保日期范围正确，尝试不同的复权类型。

```python
data_qfq = ds.get_stock_day(
    code='600000',
    start='2024-01-01',
    adjust='qfq'
)

data_hfq = ds.get_stock_day(
    code='600000',
    start='2024-01-01',
    adjust='hfq'
)
```

---

## 数据存储

### Q: MongoDB 连接失败？

**A:** 检查 MongoDB 服务状态和配置。

```python
from FQData.DataStore import MongoDBAdapter

adapter = MongoDBAdapter(
    host='localhost',
    port=27017,
    database='fqdata'
)

print(f"连接状态: {adapter.is_connected}")
```

### Q: 保存数据失败？

**A:** 检查数据格式和必填字段。

```python
required = ['open', 'high', 'low', 'close', 'volume']
print(f"数据列: {data.columns.tolist()}")
print(f"数据为空: {data.empty}")

result = save_single_stock_day('600000', data)
if not result:
    print("保存失败，检查数据格式")
```

### Q: 如何批量保存数据？

**A:** 使用批量保存函数或并行保存。

```python
from FQData import save_stock_day, save_stock_day_parallel

save_stock_day(['600000', '000001'], {
    '600000': data1,
    '000001': data2
})

save_stock_day_parallel(
    codes=['600000', '000001'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4
)
```

---

## 数据查询

### Q: 查询结果为空？

**A:** 检查查询条件和数据存在性。

```python
from FQData import query_stock_day

df = query_stock_day(code='600000', start='2024-01-01', end='2024-12-31')

if df is None or len(df) == 0:
    print("无数据，可能未存储或查询条件错误")

print(f"数据范围: {df.index.get_level_values('date').min()} ~ {df.index.get_level_values('date').max()}")
```

### Q: 如何查询特定日期范围？

**A:** 使用 start 和 end 参数。

```python
df = query_stock_day(
    code='600000',
    start='2024-01-01',
    end='2024-06-30'
)
```

---

## 数据结构

### Q: 数据结构创建失败？

**A:** 确保 DataFrame 索引和列名正确。

```python
print(f"索引: {df.index.names}")
print(f"列: {df.columns.tolist()}")

df = df.set_index(['date', 'code'])

stock_day = StockDayData(df)
print(f"验证: {stock_day.validate()}")
```

### Q: 如何处理多只股票数据？

**A:** 使用 splits 或 security_gen。

```python
stock_multi = StockDayData(df_multi)

for stock in stock_multi.security_gen:
    print(f"代码: {stock.code[0]}, 数据量: {len(stock)}")
```

### Q: 复权计算不正确？

**A:** 检查复权因子数据。

```python
from FQData.DataStruct import fetch_stock_adj, data_stock_to_fq

adj_data = fetch_stock_adj(code='600000', start='2024-01-01')

if adj_data is None or len(adj_data) == 0:
    print("复权因子为空")

fq_data = data_stock_to_fq(original_data, adj_data)
```

---

## 代码工具

### Q: 代码分类返回 undefined？

**A:** 检查代码格式和长度。

```python
from FQData.normalizer import for_sz, for_sh

code = '600000'
print(f"长度: {len(code)}")
print(f"前缀: {code[:2]}")

result = for_sh(code)
print(f"分类: {result}")
```

### Q: 市场判断错误？

**A:** 使用正确的判断逻辑。

```python
from FQData.normalizer import code_to_market, get_stock_market

market = code_to_market('600000')
print(f"市场: {market}")

name = get_stock_market('600000')
print(f"市场名称: {name}")
```

---

## 性能问题

### Q: 数据获取太慢？

**A:** 使用并行获取或缓存。

```python
from FQData import save_stock_day_parallel

save_stock_day_parallel(
    codes=codes,
    start='2024-01-01',
    end='2024-12-31',
    workers=8
)
```

### Q: 存储占用过高？

**A:** 定期清理或压缩数据。

```python
from FQData import get_datastore

store = get_datastore()
store._primary_storage.cleanup()
```

---

## 其他问题

### Q: 如何检查系统健康状态？

**A:** 使用健康检查接口。

```python
from FQData import get_datasource, get_datastore

ds = get_datasource()
store = get_datastore()

ds_health = ds.health_check()
store_health = store.health_check()

print(f"数据源: {ds_health}")
print(f"存储: {store_health}")
```

### Q: 事务回滚如何处理？

**A:** 事务自动回滚，无需手动处理。

```python
from FQData import TransactionManager

tm = TransactionManager()

try:
    with tm.begin() as tx:
        tx.insert('stock_day', data)
        raise Exception("模拟错误")
except Exception as e:
    print(f"异常: {e}")
    print("事务已自动回滚")
```

### Q: 如何处理大量数据？

**A:** 分批处理，使用生成器。

```python
def process_large_data(codes, batch_size=100):
    for i in range(0, len(codes), batch_size):
        batch = codes[i:i+batch_size]
        yield batch
```

---

## 相关文档

- [README](README.md)
- [API 参考](api.md)
- [使用指南](usage.md)
- [最佳实践](best-practices.md)
- [开发指南](development.md)
- [DataSource](datasource/README.md)
- [DataStore](datastore/README.md)
- [DataStruct](datastruct/README.md)