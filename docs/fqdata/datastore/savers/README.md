# DataStore Savers 模块

通达信数据持久化模块，提供从通达信数据源获取数据并保存到存储层的功能。

## 模块结构

```
savers/
├── __init__.py                  # 模块入口
├── tdx_stock_saver.py           # 股票数据持久化
├── tdx_index_saver.py           # 指数/ETF 数据持久化
├── tdx_future_saver.py           # 期货数据持久化
├── tdx_bond_saver.py            # 债券数据持久化
├── tdx_option_saver.py          # 期权数据持久化
├── tdx_transaction_saver.py     # 成交明细持久化
├── tdx_parallel_saver.py         # 并行数据持久化
├── tdx_financial_saver.py       # 财务数据持久化
├── tdx_xdxr_checker.py          # 除权除息检查
├── tdx_index_stocks_saver.py    # 指数成分股持久化
├── province_saver.py             # 省份代码持久化
├── tdx_concept_saver.py         # 概念数据持久化
├── tdx_industry_saver.py         # 行业数据持久化
└── tdx_usstock_saver.py         # 美股数据持久化
```

## 功能分类

### 股票数据 (Stock)

```python
from FQData import (
    save_single_stock_day,
    save_stock_day,
    save_stock_week,
    save_stock_month,
    save_stock_year,
    save_stock_min,
    save_single_stock_min,
    save_stock_xdxr,
    save_stock_xdxr_quick,
    save_single_stock_xdxr,
    save_stock_list,
    save_stock_block,
    save_stock_info,
)
```

| 函数 | 说明 |
|------|------|
| `save_single_stock_day` | 保存单只股票日线 |
| `save_stock_day` | 批量保存股票日线 |
| `save_stock_week` | 保存股票周线 |
| `save_stock_month` | 保存股票月线 |
| `save_stock_year` | 保存股票年线 |
| `save_stock_min` | 保存股票分钟线 |
| `save_single_stock_min` | 保存单只股票分钟线 |
| `save_stock_xdxr` | 批量保存除权除息 |
| `save_stock_xdxr_quick` | 快速保存除权除息 |
| `save_single_stock_xdxr` | 保存单只股票除权除息 |
| `save_stock_list` | 保存股票列表 |
| `save_stock_block` | 保存股票板块 |
| `save_stock_info` | 保存股票信息 |

### 指数/ETF 数据 (Index/ETF)

```python
from FQData import (
    save_single_index_day,
    save_index_day,
    save_single_index_min,
    save_index_min,
    save_index_list,
    save_single_etf_day,
    save_etf_day,
    save_single_etf_min,
    save_etf_min,
    save_etf_list,
)
```

| 函数 | 说明 |
|------|------|
| `save_single_index_day` | 保存单只指数日线 |
| `save_index_day` | 批量保存指数日线 |
| `save_single_index_min` | 保存单只指数分钟 |
| `save_index_min` | 批量保存指数分钟线 |
| `save_index_list` | 保存指数列表 |
| `save_single_etf_day` | 保存单只ETF日线 |
| `save_etf_day` | 批量保存ETF日线 |
| `save_single_etf_min` | 保存单只ETF分钟 |
| `save_etf_min` | 批量保存ETF分钟线 |
| `save_etf_list` | 保存ETF列表 |

### 期货数据 (Future)

```python
from FQData import (
    save_single_future_day,
    save_future_day,
    save_future_day_all,
    save_single_future_min,
    save_future_min,
    save_future_min_all,
    save_future_list,
)
```

| 函数 | 说明 |
|------|------|
| `save_single_future_day` | 保存单只期货日线 |
| `save_future_day` | 批量保存期货日线 |
| `save_future_day_all` | 保存所有期货日线 |
| `save_single_future_min` | 保存单只期货分钟 |
| `save_future_min` | 批量保存期货分钟线 |
| `save_future_min_all` | 保存所有期货分钟线 |
| `save_future_list` | 保存期货列表 |

### 债券数据 (Bond)

```python
from FQData import (
    save_single_bond_day,
    save_bond_day,
    save_bond2stock_day,
    save_single_bond_min,
    save_bond_min,
    save_bond2stock_min,
    save_bond_list,
    save_bond2stock_list,
    save_jisilu_bond_cbnewlist,
    get_bond_cbnewlist,
)
```

| 函数 | 说明 |
|------|------|
| `save_single_bond_day` | 保存单只债券日线 |
| `save_bond_day` | 批量保存债券日线 |
| `save_bond2stock_day` | 保存可转债日线 |
| `save_single_bond_min` | 保存单只债券分钟 |
| `save_bond_min` | 批量保存债券分钟线 |
| `save_bond2stock_min` | 保存可转债分钟线 |
| `save_bond_list` | 保存债券列表 |
| `save_bond2stock_list` | 保存可转债列表 |
| `save_jisilu_bond_cbnewlist` | 从集思录保存可转债列表 |
| `get_bond_cbnewlist` | 获取可转债列表 |

### 期权数据 (Option)

```python
from FQData import (
    save_option_commodity_day,
    save_option_commodity_min,
    save_option_50etf_day,
    save_option_50etf_min,
    save_option_300etf_day,
    save_option_300etf_min,
    save_option_contract_list,
    save_option_day_all,
    save_option_min_all,
)
```

| 函数 | 说明 |
|------|------|
| `save_option_commodity_day` | 保存商品期权日线 |
| `save_option_commodity_min` | 保存商品期权分钟 |
| `save_option_50etf_day` | 保存50ETF期权日线 |
| `save_option_50etf_min` | 保存50ETF期权分钟 |
| `save_option_300etf_day` | 保存300ETF期权日线 |
| `save_option_300etf_min` | 保存300ETF期权分钟 |
| `save_option_contract_list` | 保存期权合约列表 |
| `save_option_day_all` | 保存所有期权日线 |
| `save_option_min_all` | 保存所有期权分钟线 |

### 成交明细 (Transaction)

```python
from FQData import (
    save_stock_transaction,
    save_index_transaction,
)
```

| 函数 | 说明 |
|------|------|
| `save_stock_transaction` | 保存股票成交明细 |
| `save_index_transaction` | 保存指数成交明细 |

### 并行数据持久化 (Parallel)

```python
from FQData import (
    save_stock_day_parallel,
    save_index_day_parallel,
    save_etf_day_parallel,
    save_stock_xdxr_parallel,
    save_stock_xdxr_one,
)
```

| 函数 | 说明 |
|------|------|
| `save_stock_day_parallel` | 并行保存股票日线 |
| `save_index_day_parallel` | 并行保存指数日线 |
| `save_etf_day_parallel` | 并行保存ETF日线 |
| `save_stock_xdxr_parallel` | 并行保存除权除息 |
| `save_stock_xdxr_one` | 保存单只股票除权除息 |

### 财务数据 (Financial)

```python
from FQData import (
    save_financial_files,
    save_financial_one,
    get_financial_download_status,
)
```

| 函数 | 说明 |
|------|------|
| `save_financial_files` | 批量保存财务报表 |
| `save_financial_one` | 保存单只股票财务报表 |
| `get_financial_download_status` | 获取财务下载状态 |

### 其他数据

```python
from FQData import (
    check_stock_xdxr,
    save_tdx_index_stocks_from_csv,
    save_tdx_index_stocks_all_from_csv,
    save_index_stocks,
    save_index_stocks_batch,
    save_province_code_from_csv,
    load_province_code,
    save_tdx_concept_from_csv,
    load_tdx_concept,
    get_tdx_concept_name,
    get_tdx_concept_code,
    save_tdx_industry_from_csv,
    load_tdx_industry,
    get_tdx_industry_name,
    get_tdx_industry_code,
)
```

| 函数 | 说明 |
|------|------|
| `check_stock_xdxr` | 检查除权除息数据 |
| `save_tdx_index_stocks_from_csv` | 从CSV保存指数成分股 |
| `save_tdx_index_stocks_all_from_csv` | 保存所有指数成分股 |
| `save_index_stocks` | 保存指数成分股 |
| `save_index_stocks_batch` | 批量保存指数成分股 |
| `save_province_code_from_csv` | 从CSV保存省份代码 |
| `load_province_code` | 加载省份代码 |
| `save_tdx_concept_from_csv` | 从CSV保存概念数据 |
| `load_tdx_concept` | 加载概念数据 |
| `get_tdx_concept_name` | 获取概念名称 |
| `get_tdx_concept_code` | 获取概念代码 |
| `save_tdx_industry_from_csv` | 从CSV保存行业数据 |
| `load_tdx_industry` | 加载行业数据 |
| `get_tdx_industry_name` | 获取行业名称 |
| `get_tdx_industry_code` | 获取行业代码 |

---

## 快速开始

### 保存股票日线

```python
from FQData import save_single_stock_day

result = save_single_stock_day('600000', data)
print(f"保存结果: {result}")
```

### 批量保存股票

```python
from FQData import save_stock_day

codes = ['600000', '000001', '000002']
save_stock_day(codes)
```

### 并行保存

```python
from FQData import save_stock_day_parallel

result = save_stock_day_parallel(
    codes=['600000', '000001', '000002'],
    start='2024-01-01',
    end='2024-12-31',
    workers=4
)
print(f"成功: {result['success_count']}")
```

---

## 文档索引

| 文档 | 说明 |
|------|------|
| [README](README.md) | 本文档，模块索引 |
| [股票 Saver](tdx_stock_saver.md) | 股票数据持久化详细文档 |
| [指数 Saver](tdx_index_saver.md) | 指数/ETF数据持久化详细文档 |
| [期货 Saver](tdx_future_saver.md) | 期货数据持久化详细文档 |
| [债券 Saver](tdx_bond_saver.md) | 债券数据持久化详细文档 |
| [期权 Saver](tdx_option_saver.md) | 期权数据持久化详细文档 |
| [分笔 Saver](tdx_transaction_saver.md) | 成交明细持久化详细文档 |
| [并行 Saver](tdx_parallel_saver.md) | 并行数据持久化详细文档 |
| [财务 Saver](tdx_financial_saver.md) | 财务报表数据持久化详细文档 |
| [除权除息检查器](tdx_xdxr_checker.md) | 除权除息检查详细文档 |
| [指数成分股 Saver](tdx_index_stocks_saver.md) | 指数成分股持久化详细文档 |
| [省份 Saver](province_saver.md) | 省份代码持久化详细文档 |
| [概念 Saver](tdx_concept_saver.md) | 概念数据持久化详细文档 |
| [行业 Saver](tdx_industry_saver.md) | 行业数据持久化详细文档 |
| [美股 Saver](tdx_usstock_saver.md) | 美股数据持久化详细文档 |

## 相关文档

- [DataStore 模块](../README.md)
- [DataStore API](../api.md)
- [FQData 模块](../../README.md)