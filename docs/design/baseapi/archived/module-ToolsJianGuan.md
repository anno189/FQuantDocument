# ToolsJianGuan 模块文档

## 模块概述

ToolsJianGuan 模块提供监管数据获取和处理功能，用于从证监会、交易所等官方渠道获取监管信息、问询函、处罚公告等重要监管数据。

## 核心功能

- **监管公告获取**: 获取证监会、交易所发布的监管公告
- **问询函收集**: 收集上市公司问询函信息
- **处罚公告**: 获取违规处罚公告
- **监管数据保存**: 将监管数据保存到数据库

## 依赖模块

- selenium
- Parameter
- ToolsSaveData

## 函数列表

| 函数名 | 功能描述 |
|--------|----------|
| getCSRCAnnouncement | 获取证监会公告 |
| getExchangeInquiry | 获取交易所问询函 |
| getPunishmentInfo | 获取处罚信息 |
| saveJianguanData | 保存监管数据到数据库 |

---

## 函数详细说明

### getCSRCAnnouncement()

从证监会官网获取最新监管公告。

**返回值:**
- `list`: 公告列表，每个元素为包含标题、链接、时间等信息的字典

**功能说明:**
- 使用Selenium WebDriver打开证监会官网
- 获取监管公告栏目内容
- 解析公告标题、链接、发布时间、发布部门等信息
- 返回公告列表

**代码示例:**
```python
from FQMarket.FQUtil.ToolsJianGuan import getCSRCAnnouncement

# 获取证监会公告
announcements = getCSRCAnnouncement()
for ann in announcements:
    print(ann['title'], ann['department'], ann['time'])
```

### getExchangeInquiry()

获取交易所发布的问询函信息。

**返回值:**
- `list`: 问询函列表，每个元素为包含股票代码、标题、链接、时间等信息的字典

**功能说明:**
- 从深交所和上交所官网获取问询函
- 包含年报问询函、重组问询函等各类问询
- 解析涉及的股票代码、问询类型、发布时间等
- 返回问询函列表

**代码示例:**
```python
from FQMarket.FQUtil.ToolsJianGuan import getExchangeInquiry

# 获取问询函
inquiries = getExchangeInquiry()
for inquiry in inquiries:
    print(inquiry['code'], inquiry['title'], inquiry['type'])
```

### getPunishmentInfo()

获取违规处罚信息。

**返回值:**
- `list`: 处罚信息列表，每个元素为包含主体、处罚类型、金额、时间等信息的字典

**功能说明:**
- 从证监会、交易所获取行政处罚决定
- 包含市场禁入、罚款、警告等处罚类型
- 解析处罚对象、处罚事由、处罚金额等信息
- 返回处罚信息列表

**代码示例:**
```python
from FQMarket.FQUtil.ToolsJianGuan import getPunishmentInfo

# 获取处罚信息
punishments = getPunishmentInfo()
for p in punishments:
    print(p['subject'], p['type'], p['amount'])
```

### saveJianguanData(data_list, data_type='announcement')

将监管数据保存到MongoDB数据库。

**参数:**
- `data_list` (list): 监管数据列表
- `data_type` (str, optional): 数据类型，默认为'announcement'

**返回值:**
- `int`: 保存的数据数量

**功能说明:**
- 将监管数据保存到jianguan_data集合
- 根据数据类型分类保存（公告、问询函、处罚等）
- 自动去重，避免重复保存
- 记录数据来源和获取时间

**代码示例:**
```python
from FQMarket.FQUtil.ToolsJianGuan import getCSRCAnnouncement, saveJianguanData

# 获取并保存证监会公告
announcements = getCSRCAnnouncement()
count = saveJianguanData(announcements, data_type='announcement')
print(f'保存了 {count} 条监管公告')
```
