# save_10jqka_fund_position.py 迁移审计报告

**源文件**: `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QASU/save_10jqka_fund_position.py`
**目标文件**: `FQData/FQData/storage/savers/stock_position.py`
**审计时间**: 2026-03-28
**状态**: ✅ 100% 迁移完成

---

## 一、迁移总览

| 组件 | 原始名称 | 目标名称 | 状态 |
|------|----------|----------|------|
| 批量保存函数 | `QA_SU_save_10jqka_position` | `TDX_save_10jqka_position` | ✅ |
| 单个保存函数 | `savePositionData` | `TDX_save_position_data` | ✅ |
| 数据获取函数 | `getPositionDataFrom10jqka` | `TDX_get_position_data_from_10jqka` | ✅ |

---

## 二、函数签名对比

### 2.1 批量保存函数

| 项目 | 原始 | 迁移后 |
|------|------|--------|
| 函数名 | `QA_SU_save_10jqka_position` | `TDX_save_10jqka_position` |
| 参数 | `date, renew, path` | `date, renew, path` |
| 默认值 | `date='2021-12-31', renew=False, path='/usr/bin/chromedriver'` | `date='2021-12-31', renew=False, path='/usr/bin/chromedriver'` |

### 2.2 单个保存函数

| 项目 | 原始 | 迁移后 |
|------|------|--------|
| 函数名 | `savePositionData` | `TDX_save_position_data` |
| 参数 | `browser, code, date, renew, client` | `browser, code, date, renew, client` |
| 默认值 | `date='2021-12-31', renew=False, client=DATABASE` | `date='2021-12-31', renew=False, client=DATABASE` |

### 2.3 数据获取函数

| 项目 | 原始 | 迁移后 |
|------|------|--------|
| 函数名 | `getPositionDataFrom10jqka` | `TDX_get_position_data_from_10jqka` |
| 参数 | `browser, code, date` | `browser, code, date` |
| 默认值 | `date='2021-12-31'` | `date='2021-12-31'` |

---

## 三、核心逻辑验证

| 验证项 | 状态 | 说明 |
|--------|------|------|
| Selenium Chrome配置 | ✅ | headless, no-sandbox, imagesEnabled=false, disable-gpu |
| Redis股票列表获取 | ✅ | DirectRedis获取DataFrame_StockList |
| ipo_date过滤 | ✅ | `stocklist_[stocklist_['ipo_date'] <= date]` |
| 批量遍历 | ✅ | `for item in range(len(stock_list))` |
| 分页数据获取 | ✅ | while循环，page递增，total<size*page停止 |
| MongoDB存储 | ✅ | `coll_base_data.insert_many()` |
| 重复数据处理 | ✅ | `renew`参数控制删除或跳过 |
| 日志输出 | ✅ | `FQ_util_log_info()` |
| 异常处理 | ✅ | `try/except` |

---

## 四、架构改进

| 项目 | 原始设计 | 迁移后设计 |
|------|----------|------------|
| 模块位置 | `FQData/QASU` | `FQData/storage/savers` |
| 函数命名 | `QA_SU_*`, `save*` | `TDX_save_*` |
| 日志工具 | `QA_util_log_info` | `FQ_util_log_info` |
| 数据转换 | `QA_util_to_json_from_pandas` | `QA_util_to_json_from_pandas` |
| 配置管理 | `DATABASE` | `FQBase.FQConfig.setting` |

---

## 五、数据流

```
同花顺API (http://basic.10jqka.com.cn)
        │
        ▼
getPositionDataFrom10jqka (分页获取)
        │
        ▼
savePositionData (数据清洗)
        │
        ▼
MongoDB (stock_data_position集合)
```

---

## 六、使用示例

```python
from FQData.storage.savers import TDX_save_10jqka_position

# 批量保存基金持仓数据
TDX_save_10jqka_position(date='2021-12-31', renew=False)

# 单独保存某只股票
from selenium import webdriver
browser = webdriver.Chrome()
TDX_save_position_data(browser, '000001', date='2021-12-31')
```

---

## 七、审计结论

| 项目 | 结果 |
|------|------|
| **函数签名一致性** | **100%** (3/3) |
| **核心逻辑一致性** | ✅ 完全一致 |
| **语法验证** | ✅ 通过 |
| **导出完整性** | ✅ `__init__.py` 已更新 |
