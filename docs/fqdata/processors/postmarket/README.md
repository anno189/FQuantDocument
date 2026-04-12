# postmarket 子模块

盘后数据处理模块，提供日线数据保存和因子计算功能。

## 模块路径

`FQData.Processors.postmarket`

## 模块结构

```
postmarket/
├── __init__.py
├── base.py              # 盘后处理器基类和结果类
├── daily_saver.py      # 日线数据保存器
└── factor_calculator.py # 因子计算器
```

## 核心组件

### DailySaver

日线数据保存器，继承自 `PostMarketProcessor`。

**功能**:
- 保存股票列表（含北交所）
- 保存债券列表
- 保存概念数据
- 保存指数日线
- 保存股票日线
- 更新除权除息数据

**使用示例**:

```python
from FQData.Processors.postmarket import DailySaver

saver = DailySaver()
result = saver.save(
    date="2024-01-01",
    save_xdxr=True,
    save_bond=True,
    save_concept=True
)

print(f"成功保存: {result.saved_count}")
print(f"错误: {result.errors}")
```

### FactorCalculator

盘后因子计算器，继承自 `PostMarketProcessor`。

**功能**:
- 市场因子计算 (Beta, Volatility, Sharpe)
- 指数因子计算
- 行业/概念 RPS 计算
- 策略池计算 (强势股、突破、N日等)

**使用示例**:

```python
from FQData.Processors.postmarket import FactorCalculator

calculator = FactorCalculator()
result = calculator.calculate(
    date="2024-01-01",
    calculate_rps=True,
    calculate_pools=True
)

print(f"计算的因子: {result.computed_factors}")
print(f"策略池: {result.strategy_pools}")
```

### DailySaveResult

日线保存结果数据类。

| 属性 | 类型 | 说明 |
|------|------|------|
| `success` | bool | 是否成功 |
| `date` | str | 交易日期 |
| `saved_count` | Dict[str, int] | 各类型保存数量 |
| `errors` | Dict[str, str] | 错误信息 |
| `timestamp` | datetime | 执行时间 |

### FactorCalculateResult

因子计算结果数据类。

| 属性 | 类型 | 说明 |
|------|------|------|
| `success` | bool | 是否成功 |
| `date` | str | 交易日期 |
| `computed_factors` | List[str] | 已计算的因子列表 |
| `strategy_pools` | Dict[str, int] | 策略池统计 |
| `sector_metrics` | Dict | 板块指标 |
| `errors` | Dict[str, str] | 错误信息 |

## 依赖关系

```
DailySaver
├── tdx_stock_saver
│   ├── save_stock_list
│   ├── save_stock_list_bj
│   ├── save_stock_day
│   ├── save_stock_block
│   └── save_stock_xdxr
├── tdx_bond_saver
│   └── save_bond2stock_list
└── tdx_index_saver
    ├── save_index_day
    └── save_single_index_day

FactorCalculator
├── get_datastore
├── FQFactor.factors (RiskFactors, MarketFactors)
└── query_stock_day / query_index_day
```

## 相关文档

- [Processors 模块](../README.md)
- [Pipeline 模块](../pipeline/README.md)
- [DataStore 模块](../datastore/README.md)