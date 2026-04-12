# 期货数据持久化 (tdx_future_saver)

提供期货日线/分钟线数据保存功能。

## 模块路径

```
FQData.DataStore.savers.tdx_future_saver
```

## 核心功能

| 功能 | 说明 |
|------|------|
| 期货日线 | 保存单只/批量/全部期货日线数据 |
| 期货分钟线 | 保存单只/批量/全部期货分钟线数据 |
| 期货列表 | 保存期货列表 |

## 主要函数

### save_single_future_day

```python
def save_single_future_day(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> bool
```

保存单个期货日线数据。

**参数：**
- `code`: 期货代码
- `start_date`: 开始日期，默认为数据库起始日期
- `end_date`: 结束日期，默认为今日

**返回：** 保存是否成功

**示例：**

```python
from FQData import save_single_future_day

result = save_single_future_day('IF2401', start_date='2024-01-01')
print(f"保存结果: {result}")
```

---

### save_future_day

```python
def save_future_day(
    code_list: Optional[List[str]] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> int
```

批量保存期货日线数据。

**参数：**
- `code_list`: 期货代码列表，None 表示全部期货
- `start_date`: 开始日期
- `end_date`: 结束日期

**返回：** 成功保存的数量

---

### save_future_day_all

```python
def save_future_day_all(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
) -> int
```

保存所有期货日线数据。

**参数：**
- `start_date`: 开始日期
- `end_date`: 结束日期

**返回：** 成功保存的数量

---

### save_single_future_min

```python
def save_single_future_min(
    code: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> bool
```

保存单个期货分钟线数据。

**参数：**
- `code`: 期货代码
- `start_date`: 开始日期
- `end_date`: 结束日期
- `frequence`: 频率，支持 "1min", "5min", "15min", "30min", "60min"

---

### save_future_min

```python
def save_future_min(
    code_list: Optional[List[str]] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> int
```

批量保存期货分钟线数据。

---

### save_future_min_all

```python
def save_future_min_all(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    frequence: str = "1min"
) -> int
```

保存所有期货分钟线数据。

---

### save_future_list

```python
def save_future_list() -> bool
```

保存期货列表。

**返回：** 保存是否成功

---

## 使用示例

### 批量保存期货日线

```python
from FQData import save_future_day, save_future_list

save_future_list()

result = save_future_day(start_date='2024-01-01')
print(f"成功保存 {result} 只期货")
```

### 批量保存期货分钟线

```python
from FQData import save_future_min

result = save_future_min(start_date='2024-01-01', frequence='5min')
print(f"成功保存 {result} 只期货分钟线")
```

---

## 数据源

- [TdxFutureAdapter](../datasource/adapters/tdx/future.md)

## 相关文档

- [DataStore 模块](../README.md)
- [Savers 模块索引](README.md)
- [期货数据结构](../../datastruct/future.md)
