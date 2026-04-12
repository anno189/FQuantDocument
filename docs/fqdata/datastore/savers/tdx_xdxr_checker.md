# 除权除息检查器 (tdx_xdxr_checker)

检测并补全除权除息数据完整性。

## 模块路径

```
FQData.DataStore.savers.tdx_xdxr_checker
```

## 核心功能

| 功能 | 说明 |
|------|------|
| 除权除息检测 | 检测最后交易日的除权除息数据是否完整 |
| 数据补全 | 自动补全缺失的除权除息数据 |

## 主要函数

### check_stock_xdxr

```python
def check_stock_xdxr() -> List[str]
```

检测除权除息数据完整性并补全。

检测最后交易日的除权除息数据是否完整，找出缺失的股票代码并尝试补全。

**返回：** 缺失数据的股票代码列表

**示例：**

```python
from FQData import check_stock_xdxr

missing_codes = check_stock_xdxr()
print(f"缺失数据的股票: {missing_codes}")
```

---

## 工作流程

1. 获取所有股票列表
2. 查询最后交易日的除权除息数据
3. 比对找出缺失的股票代码
4. 调用 `save_stock_xdxr` 补全数据
5. 返回缺失代码列表

---

## 数据源

- [tdx_stock_saver](./tdx_stock_saver.md) - save_stock_xdxr 函数

## 相关文档

- [DataStore 模块](../README.md)
- [Savers 模块索引](README.md)
- [除权除息数据](../query/xdxr.md)
