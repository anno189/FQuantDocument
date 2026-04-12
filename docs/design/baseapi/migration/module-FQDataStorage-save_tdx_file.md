# 迁移一致性审计报告

**文件**: `save_tdx_file.py`
**审计时间**: 2026-03-28
**审计结果**: ❌ 未迁移

---

## 一、基本信息

| 项目 | 详情 |
|------|------|
| **源文件** | `/Users/A.D.189/FQuant/FQuant.Server/_bak/server/FQData/FQData/QASU/save_tdx_file.py` |
| **目标文件** | 不存在 |
| **迁移状态** | ❌ 未迁移 |
| **函数数量** | 源: 1 / 目标: 0 |

---

## 二、函数分析

### 源函数: `QA_save_tdx_to_mongo`

**功能**: 通达信分钟线文件导入MongoDB

**签名**:
```python
def QA_save_tdx_to_mongo(file_dir, client=DATABASE)
```

**参数**:
- `file_dir`: 文件目录路径
- `client`: MongoDB连接 (default: DATABASE)

**逻辑**:
1. 使用 `pytdx.reader.TdxMinBarReader` 读取通达信分钟线文件
2. 遍历目录下的文件
3. 筛选 sh6*/sz0*/sz3* 股票代码
4. 解析文件并添加 market, code, datetime, date, time_stamp, date_stamp 字段
5. 存入 MongoDB `stock_min_five` 集合

---

## 三、迁移状态

| 项目 | 状态 | 说明 |
|------|------|------|
| **函数迁移** | ❌ 未迁移 | 目标文件 `storage/savers/file.py` 不存在 |
| **main.py 引用** | ⚠️ 引用缺失 | main.py line 521 尝试导入但失败 |

### main.py 中的引用

```python
# main.py line 520-522
def QA_SU_save_stock_min_5(file_dir, client=DATABASE):
    from .file import QA_save_tdx_to_mongo  # ❌ file.py 不存在
    return QA_save_tdx_to_mongo(file_dir, client)
```

---

## 四、依赖分析

| 源依赖 | 说明 | 状态 |
|--------|------|------|
| `pytdx.reader.TdxMinBarReader` | 通达信数据读取 | ⚠️ 需保留 |
| `FQData.QAUtil.DATABASE` | MongoDB配置 | ✅ 可用 FQBase 替代 |
| `FQData.QAUtil.QA_util_date_stamp` | 日期转时间戳 | ✅ 可用 FQBase 替代 |
| `FQData.QAUtil.QA_util_time_stamp` | 时间转时间戳 | ✅ 可用 FQBase 替代 |
| `FQData.QAUtil.QA_util_log_info` | 日志 | ✅ 可用 FQBase 替代 |

---

## 五、问题记录

1. **目标文件缺失**: `storage/savers/file.py` 不存在
2. **main.py 引用断开**: `QA_SU_save_stock_min_5` 函数无法正常工作
3. **功能未实现**: 该函数负责导入本地通达信分钟线文件，功能独特未被其他模块替代

---

## 六、建议

1. **创建 `file.py`**: 实现 `QA_save_tdx_to_mongo` 函数
2. **命名规范**: 重命名为 `TDX_save_tdx_to_mongo` 或 `TDX_import_tdx_min_file`
3. **依赖更新**: 使用 FQBase 替代 FQData.QAUtil

---

## 七、迁移对照速查

| 原始函数 | 迁移后函数 | 模块 | 状态 |
|---------|-----------|------|------|
| `QA_save_tdx_to_mongo` | ❌ 未迁移 | FQData.storage.savers.file | ❌ |

---

## 八、审计结论

**审计结果**: ❌ **未迁移**

该文件包含独特的分钟线文件导入功能，但目标文件 `file.py` 不存在，导致 main.py 中的引用无法工作。需要创建目标文件并实现迁移。
