# module-FQDate-trade.md

# 补充: QADate_trade.py 数据迁移

## 基本信息

| 项目 | 原模块 | 迁移后 |
|------|--------|--------|
| **原文件** | `_bak/QUANTAXIS/QAUtil/QADate_trade.py` | `FQBase/FQBase/FQDate/trade_dates_data.py` |
| **文件大小** | ~151KB (主要是交易日数据) | 数据分离存储 |

## 迁移内容

### 1. 交易日数据分离

**原实现**: `trade_date_sse` 列表直接内嵌在 QADate_trade.py 中

**迁移后**: 分离到独立数据文件 `trade_dates_data.py`

```python
# trade_dates_data.py
TRADE_DATE_SSE: List[str] = [
    "1990-12-19",
    "1990-12-20",
    # ... 9000+ 条数据
]
```

### 2. 模块引用

```python
# trade.py
from FQBase.FQDate.trade_dates_data import TRADE_DATE_SSE

trade_date_sse: List[str] = TRADE_DATE_SSE
```

## 数据统计

| 项目 | 数值 |
|------|------|
| 起始日期 | 1990-12-19 |
| 覆盖范围 | ~35年 |
| 数据条目 | ~9000+ 条 |

## 迁移状态

| 项目 | 状态 |
|------|------|
| **数据完整性** | ✅ 完整迁移 |
| **向后兼容** | ✅ `trade_date_sse` 别名 |

## 相关文件

- [trade_dates_data.py](../../FQBase/FQBase/FQDate/trade_dates_data.py) - 交易日数据
- [trade.py](../../FQBase/FQBase/FQDate/trade.py) - 交易日算法
- [FQDate.md](module-FQDate.md) - 主迁移报告
