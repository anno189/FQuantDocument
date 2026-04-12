# FQData.storage 模块 API 文档

**模块路径**: `FQData/storage/`
**生成时间**: 2026-03-28

---

## 一、模块概述

`FQData.storage` 是数据存储模块，提供将数据保存到MongoDB、本地文件等存储介质的功能。

### 1.1 模块结构

```
FQData.storage/
├── savers/               # 存储函数
│   ├── base.py          # 基础工具
│   ├── main.py          # 统一入口
│   ├── stock.py         # 股票数据存储
│   ├── stock_info.py    # 股票信息存储
│   ├── stock_position.py # 基金持仓存储
│   ├── index.py         # 指数数据存储
│   ├── future.py        # 期货数据存储
│   ├── bond.py          # 债券数据存储
│   ├── bond_cb.py       # 可转债数据存储
│   ├── option.py        # 期权数据存储
│   ├── etf.py           # ETF数据存储
│   ├── hkstock.py       # 港股数据存储
│   ├── usstock.py       # 美股数据存储
│   ├── parallelism.py   # 并行存储
│   ├── financial.py     # 财务数据存储
│   ├── crawler.py       # 爬虫数据存储
│   └── __init__.py
└── __init__.py
```

### 1.2 函数命名规范

| 前缀 | 来源 | 说明 |
|------|------|------|
| `TDX_save_*` | tdx/*.py | 从通达信获取并保存 |
| `DB_save_*` | local/*.py | 从本地数据库操作 |
| `QA_SU_save_*` | main.py | 统一入口API |

---

## 二、base 模块 (基础工具)

**路径**: `FQData/storage/savers/base.py`

| 函数 | 说明 | 返回类型 |
|------|------|----------|
| `get_now_time` | 获取当前时间 | str |
| `create_index_if_not_exists` | 创建MongoDB索引 | None |
| `save_dataframe` | 保存DataFrame到MongoDB | bool |

---

## 三、main 模块 (统一入口)

**路径**: `FQData/storage/savers/main.py`

### 3.1 股票数据存储

| 函数 | 说明 |
|------|------|
| `QA_SU_save_stock_day` | 保存股票日线 |
| `QA_SU_save_stock_week` | 保存股票周线 |
| `QA_SU_save_stock_month` | 保存股票月线 |
| `QA_SU_save_stock_min` | 保存股票分钟线 |
| `QA_SU_save_single_stock_day` | 保存单只股票日线 |
| `QA_SU_save_single_stock_min` | 保存单只股票分钟线 |
| `QA_SU_save_stock_transaction` | 保存股票交易分笔 |
| `QA_SU_save_stock_xdxr` | 保存除权除息数据 |
| `QA_SU_save_stock_xdxr_quick` | 快速保存除权除息 |
| `QA_SU_save_stock_block` | 保存股票板块 |

### 3.2 指数数据存储

| 函数 | 说明 |
|------|------|
| `QA_SU_save_index_day` | 保存指数日线 |
| `QA_SU_save_single_index_day` | 保存单只指数日线 |
| `QA_SU_save_index_min` | 保存指数分钟线 |
| `QA_SU_save_single_index_min` | 保存单只指数分钟线 |
| `QA_SU_save_index_transaction` | 保存指数交易分笔 |
| `QA_SU_save_index_list` | 保存指数列表 |

### 3.3 期货数据存储

| 函数 | 说明 |
|------|------|
| `QA_SU_save_future_day` | 保存期货日线 |
| `QA_SU_save_single_future_day` | 保存单只期货日线 |
| `QA_SU_save_future_min` | 保存期货分钟线 |
| `QA_SU_save_single_future_min` | 保存单只期货分钟线 |
| `QA_SU_save_future_list` | 保存期货列表 |

### 3.4 债券数据存储

| 函数 | 说明 |
|------|------|
| `QA_SU_save_bond_day` | 保存债券日线 |
| `QA_SU_save_single_bond_day` | 保存单只债券日线 |
| `QA_SU_save_bond_min` | 保存债券分钟线 |
| `QA_SU_save_single_bond_min` | 保存单只债券分钟线 |
| `QA_SU_save_bond_list` | 保存债券列表 |
| `QA_SU_save_bond2stock_day` | 保存可转债转股日线 |
| `QA_SU_save_bond2stock_min` | 保存可转债转股分钟线 |

### 3.5 ETF数据存储

| 函数 | 说明 |
|------|------|
| `QA_SU_save_etf_day` | 保存ETF日线 |
| `QA_SU_save_single_etf_day` | 保存单只ETF日线 |
| `QA_SU_save_etf_min` | 保存ETF分钟线 |
| `QA_SU_save_single_etf_min` | 保存单只ETF分钟线 |
| `QA_SU_save_etf_list` | 保存ETF列表 |

### 3.6 期权数据存储

| 函数 | 说明 |
|------|------|
| `QA_SU_save_option_contract_list` | 保存期权合约列表 |
| `QA_SU_save_option_50etf_day` | 保存50ETF期权日线 |

### 3.7 其他

| 函数 | 说明 |
|------|------|
| `QA_SU_save_stock_info` | 保存股票信息 |
| `QA_SU_save_stock_list` | 保存股票列表 |
| `QA_check_stock_xdxr` | 检查除权除息数据 |

---

## 四、stock 模块 (股票数据存储)

**路径**: `FQData/storage/savers/stock.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_stock_day` | 保存股票日线 |
| `TDX_save_single_stock_day` | 保存单只股票日线 |
| `TDX_save_stock_week` | 保存股票周线 |
| `TDX_save_stock_month` | 保存股票月线 |
| `TDX_save_stock_year` | 保存股票年线 |
| `TDX_save_stock_min` | 保存股票分钟线 |
| `TDX_save_single_stock_min` | 保存单只股票分钟线 |
| `TDX_save_stock_list` | 保存股票列表 |
| `TDX_save_stock_info` | 保存股票信息 |
| `TDX_save_stock_xdxr` | 保存除权除息数据 |
| `TDX_save_stock_transaction` | 保存股票交易分笔 |
| `TDX_save_stock_block` | 保存股票板块 |
| `fetch_stock_list_bj` | 获取北京股票列表 |

**使用示例**:
```python
from FQData.storage.savers import TDX_save_stock_day

TDX_save_stock_day('000001', '2020-01-01', '2020-12-31')
```

---

## 五、stock_info 模块 (股票信息存储)

**路径**: `FQData/storage/savers/stock_info.py`

| 类/函数 | 说明 |
|---------|------|
| `IF` | 同花顺F10信息类 |
| `check_trilium_online` | 检查在线状态 |
| `get_stock_info_4code` | 获取股票信息(按代码) |
| `get_stock_info_4name` | 获取股票信息(按名称) |
| `get_stock_10jqka_info` | 获取同花顺F10信息 |
| `get_stock_block` | 获取股票板块 |
| `update_internal_link` | 更新内部链接 |
| `update_compare` | 更新对比数据 |
| `update_finance_data` | 更新财务数据 |
| `stock_10jqka_info_2_trilium` | 转换到Trilium格式 |
| `get_finance_data` | 获取财务数据 |
| `finance_data_2_markdown` | 转换到Markdown格式 |
| `finance_base` | 财务基础数据 |

---

## 六、stock_position 模块 (基金持仓存储)

**路径**: `FQData/storage/savers/stock_position.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_10jqka_position` | 批量保存基金持仓 |
| `TDX_save_position_data` | 保存单只股票持仓 |
| `TDX_get_position_data_from_10jqka` | 从同花顺获取持仓数据 |

**使用示例**:
```python
from FQData.storage.savers import TDX_save_10jqka_position

TDX_save_10jqka_position(date='2021-12-31')
```

---

## 七、index 模块 (指数数据存储)

**路径**: `FQData/storage/savers/index.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_index_day` | 保存指数日线 |
| `TDX_save_single_index_day` | 保存单只指数日线 |
| `TDX_save_index_min` | 保存指数分钟线 |
| `TDX_save_single_index_min` | 保存单只指数分钟线 |
| `TDX_save_index_list` | 保存指数列表 |
| `TDX_save_index_transaction` | 保存指数交易分笔 |

---

## 八、future 模块 (期货数据存储)

**路径**: `FQData/storage/savers/future.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_future_day` | 保存期货日线 |
| `TDX_save_single_future_day` | 保存单只期货日线 |
| `TDX_save_future_min` | 保存期货分钟线 |
| `TDX_save_single_future_min` | 保存单只期货分钟线 |
| `TDX_save_future_list` | 保存期货列表 |

---

## 九、bond 模块 (债券数据存储)

**路径**: `FQData/storage/savers/bond.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_bond_day` | 保存债券日线 |
| `TDX_save_single_bond_day` | 保存单只债券日线 |
| `TDX_save_bond_min` | 保存债券分钟线 |
| `TDX_save_single_bond_min` | 保存单只债券分钟线 |
| `TDX_save_bond_list` | 保存债券列表 |
| `TDX_save_bond2stock_day` | 保存可转债转股日线 |
| `TDX_save_bond2stock_min` | 保存可转债转股分钟线 |
| `TDX_save_bond2stock_list` | 保存可转债列表 |

---

## 十、bond_cb 模块 (可转债数据存储)

**路径**: `FQData/storage/savers/bond_cb.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_jisilu_bond_cbnewlist` | 保存集思录可转债列表 |
| `TDX_save_cbnewlist_data` | 保存可转债数据 |
| `TDX_get_cbnewlist_data_from_jisilu` | 从集思录获取可转债数据 |
| `TDX_get_bond_cbnewlist` | 获取可转债列表 |

---

## 十一、option 模块 (期权数据存储)

**路径**: `FQData/storage/savers/option.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_option_list` | 保存期权列表 |
| `TDX_save_option_50etf_list` | 保存50ETF期权列表 |

---

## 十二、etf 模块 (ETF数据存储)

**路径**: `FQData/storage/savers/etf.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_etf_day` | 保存ETF日线 |
| `TDX_save_single_etf_day` | 保存单只ETF日线 |
| `TDX_save_etf_min` | 保存ETF分钟线 |
| `TDX_save_single_etf_min` | 保存单只ETF分钟线 |
| `TDX_save_etf_list` | 保存ETF列表 |

---

## 十三、hkstock 模块 (港股数据存储)

**路径**: `FQData/storage/savers/hkstock.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_hkstock_day` | 保存港股日线 |
| `TDX_save_single_hkstock_day` | 保存单只港股日线 |
| `TDX_save_hkstock_min` | 保存港股分钟线 |
| `TDX_save_single_hkstock_min` | 保存单只港股分钟线 |
| `TDX_save_hkstock_list` | 保存港股列表 |

---

## 十四、usstock 模块 (美股数据存储)

**路径**: `FQData/storage/savers/usstock.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_usstock_day` | 保存美股日线 |
| `TDX_save_single_usstock_day` | 保存单只美股日线 |
| `TDX_save_usstock_min` | 保存美股分钟线 |
| `TDX_save_single_usstock_min` | 保存单只美股分钟线 |
| `TDX_save_usstock_list` | 保存美股列表 |

---

## 十五、parallelism 模块 (并行存储)

**路径**: `FQData/storage/savers/parallelism.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_stock_day_parallelism` | 并行保存股票日线 |
| `TDX_save_index_day_parallelism` | 并行保存指数日线 |
| `TDX_save_etf_day_parallelism` | 并行保存ETF日线 |
| `TDX_save_stock_xdxr_quick` | 快速保存除权除息 |
| `TDX_save_stock_xdxr_one` | 保存单只除权除息 |
| `TDX_check_stock_xdxr` | 检查除权除息数据 |

**使用示例**:
```python
from FQData.storage.savers import TDX_save_stock_day_parallelism

TDX_save_stock_day_parallelism(['000001', '000002'], '2020-01-01', '2020-12-31')
```

---

## 十六、financial 模块 (财务数据存储)

**路径**: `FQData/storage/savers/financial.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_financial_files` | 保存财务数据文件 |

---

## 十七、crawler 模块 (爬虫数据存储)

**路径**: `FQData/storage/savers/crawler.py`

| 函数 | 说明 |
|------|------|
| `TDX_get_easymonery_fxs_invest` | 获取天天基金数据 |

---

## 十八、industry 模块 (行业数据存储)

**路径**: `FQData/storage/savers/industry.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_industry_from_csv` | 从CSV保存行业数据 |
| `TDX_load_industry` | 加载行业数据 |
| `TDX_get_industry_name` | 获取行业名称 |
| `TDX_get_industry_code` | 获取行业代码 |
| `TDX_calcu_concept_count_322` | 计算概念数量 |

---

## 十九、concept 模块 (概念数据存储)

**路径**: `FQData/storage/savers/concept.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_concept_from_csv` | 从CSV保存概念数据 |
| `TDX_load_concept` | 加载概念数据 |
| `TDX_get_concept_name` | 获取概念名称 |
| `TDX_get_concept_code` | 获取概念代码 |

---

## 二十、province 模块 (地区数据存储)

**路径**: `FQData/storage/savers/province.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_province_from_csv` | 从CSV保存地区数据 |
| `TDX_load_province` | 加载地区数据 |

---

## 二十一、index_stocks 模块 (指数成分股存储)

**路径**: `FQData/storage/savers/index_stocks.py`

| 函数 | 说明 |
|------|------|
| `TDX_save_index_stocks_from_csv` | 从CSV保存指数成分股 |
| `TDX_save_index_stocks_all_from_csv` | 保存所有指数成分股 |
| `TDX_get_index_stocks_list` | 获取指数成分股列表 |

---

## 二十二、导出汇总

```python
from FQData.storage.savers import (
    # base
    get_now_time,
    create_index_if_not_exists,
    save_dataframe,
    # main
    QA_SU_save_stock_day,
    QA_SU_save_stock_list,
    QA_SU_save_index_day,
    QA_SU_save_future_day,
    QA_SU_save_bond_day,
    QA_SU_save_etf_list,
    # stock
    TDX_save_stock_day,
    TDX_save_stock_list,
    TDX_save_stock_info,
    TDX_save_stock_block,
    # stock_position
    TDX_save_10jqka_position,
    # index
    TDX_save_index_day,
    # future
    TDX_save_future_day,
    # bond
    TDX_save_bond_day,
    # parallelism
    TDX_save_stock_day_parallelism,
    # industry
    TDX_save_industry_from_csv,
    TDX_load_industry,
    TDX_get_industry_name,
    TDX_get_industry_code,
    # concept
    TDX_save_concept_from_csv,
    TDX_load_concept,
    TDX_get_concept_name,
    TDX_get_concept_code,
    # province
    TDX_save_province_from_csv,
    TDX_load_province,
    # index_stocks
    TDX_save_index_stocks_from_csv,
    TDX_save_index_stocks_all_from_csv,
    TDX_get_index_stocks_list,
)
```
