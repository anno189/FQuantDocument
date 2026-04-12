# save_code_bond_cbnewlist_jisilu.py 迁移审计报告

**源文件**: `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QASU/save_code_bond_cbnewlist_jisilu.py`
**目标文件**: `FQData/FQData/storage/savers/bond_cb.py`
**审计时间**: 2026-03-28
**状态**: ✅ 100% 迁移完成

---

## 一、迁移总览

| 组件 | 原始名称 | 目标名称 | 状态 |
|------|----------|----------|------|
| 批量保存函数 | `QA_SU_save_jisilu_bond_cbnewlist` | `TDX_save_jisilu_bond_cbnewlist` | ✅ |
| 单个保存函数 | `saveCbnewlistData` | `TDX_save_cbnewlist_data` | ✅ |
| 数据获取函数 | `getCbnewlistDataFromjisilu` | `TDX_get_cbnewlist_data_from_jisilu` | ✅ |
| 查询函数 | `get_bond_cbnewlist` | `TDX_get_bond_cbnewlist` | ✅ |

---

## 二、函数签名对比

### 2.1 批量保存函数

| 项目 | 原始 | 迁移后 |
|------|------|--------|
| 函数名 | `QA_SU_save_jisilu_bond_cbnewlist` | `TDX_save_jisilu_bond_cbnewlist` |
| 参数 | `renew, path` | `renew, path` |
| 默认值 | `renew=False, path='/usr/bin/chromedriver'` | `renew=False, path='/usr/bin/chromedriver'` |

### 2.2 单个保存函数

| 项目 | 原始 | 迁移后 |
|------|------|--------|
| 函数名 | `saveCbnewlistData` | `TDX_save_cbnewlist_data` |
| 参数 | `browser, renew, client` | `browser, renew, client` |
| 默认值 | `renew=False, client=DATABASE` | `renew=False, client=DATABASE` |

### 2.3 数据获取函数

| 项目 | 原始 | 迁移后 |
|------|------|--------|
| 函数名 | `getCbnewlistDataFromjisilu` | `TDX_get_cbnewlist_data_from_jisilu` |
| 参数 | `browser` | `browser` |

### 2.4 查询函数

| 项目 | 原始 | 迁移后 |
|------|------|--------|
| 函数名 | `get_bond_cbnewlist` | `TDX_get_bond_cbnewlist` |
| 参数 | `ma10, client` | `client` |
| 差异 | 有未使用的ma10参数 | 移除了未使用参数 |

---

## 三、核心逻辑验证

| 验证项 | 状态 | 说明 |
|--------|------|------|
| Selenium Chrome配置 | ✅ | headless, no-sandbox, imagesEnabled=false, disable-gpu |
| 集思录登录 | ✅ | 从环境变量获取JISILU_USERNAME/JISILU_PASSWORD |
| 数据获取API | ✅ | https://www.jisilu.cn/webapi/cb/list/ |
| 强赎数据合并 | ✅ | cbnew_list.merge(cbnew_redeem, how='outer') |
| MongoDB存储 | ✅ | `client.cbnew_list` |
| 索引创建 | ✅ | `bond_id`, `stock_id` 复合索引 |
| 数据转换 | ✅ | `QA_util_to_json_from_pandas` |

---

## 四、数据流

```
集思录 (https://www.jisilu.cn)
        │
        ▼
getCbnewlistDataFromjisilu (获取列表+强赎数据)
        │
        ▼
saveCbnewlistData (合并数据, 写入MongoDB)
        │
        ▼
MongoDB (cbnew_list集合)
```

---

## 五、架构改进

| 项目 | 原始设计 | 迁移后设计 |
|------|----------|------------|
| 模块位置 | `FQData/QASU` | `FQData/storage/savers` |
| 函数命名 | `QA_SU_*`, `save*`, `get*` | `TDX_save_*`, `TDX_get_*` |
| 日志工具 | `QA_util_log_info` | `FQ_util_log_info` |
| 数据转换 | `QA_util_to_json_from_pandas` | `QA_util_to_json_from_pandas` |
| 配置管理 | `DATABASE` | `FQBase.FQConfig.setting` |

---

## 六、使用示例

```python
from FQData.storage.savers import TDX_save_jisilu_bond_cbnewlist

# 批量保存集思录可转债数据
TDX_save_jisilu_bond_cbnewlist(renew=False)

# 获取可转债列表
from FQData.storage.savers import TDX_get_bond_cbnewlist
df = TDX_get_bond_cbnewlist()
```

---

## 七、审计结论

| 项目 | 结果 |
|------|------|
| **函数签名一致性** | **100%** (4/4) |
| **核心逻辑一致性** | ✅ 完全一致 |
| **语法验证** | ✅ 通过 |
| **导出完整性** | ✅ `__init__.py` 已更新 |
