# Parameter 模块文档

## 模块概述

Parameter 模块提供全局参数配置、时间管理、路径配置、消息推送等功能。该模块是整个量化系统的基础配置模块，包含各类常量定义、全局变量、消息推送接口等。

## 核心功能

- **时间管理**: 提供今日、交易日等时间计算
- **路径配置**: 配置系统各类文件路径
- **消息推送**: 企业微信、Server酱等消息推送接口
- **常量定义**: 定义各类系统常量、阈值、板块列表等

## 依赖模块

- corpwechatbot
- QAUtil

---

## 全局常量

### 分时周期配置

```python
defaultDayTicks = defaultdict(lambda: 240)
defaultDayTicks['HSI'] = 330  # 恒生指数为330个周期
```

### 证券类型

```python
defaultSType = defaultdict(lambda: '其他')
defaultSType['INDEX'] = '指数'
defaultSType['STOCK'] = '股票'
```

### 评分阈值

```python
defaultGrade = defaultdict(lambda: 0)
defaultGrade['连板'] = 56        # 连板打分阈值
defaultGrade['资金量'] = 300      # 成交金额15000亿
defaultGrade['高标涨幅'] = 20      # 高标涨幅统计前10个
defaultGrade['封板'] = 1           # 刻度
```

### 市值分位阈值

```python
defshizhiValues = [25, 30, 80, 300]  # 微盘、小盘、中盘、大盘
```

### 取数偏移量

```python
DAYOFFSET = 260  # 取数运算偏移量
```

### 板块剔除列表

#### 陈旧概念剔除
```python
old_con_drop = [
    '小米概念', '百度概念', '粤港澳', '风沙治理', 'IT设备',
    '边缘计算', '信创', '操作系统', '新能源车', '特斯拉',
    # ... 更多概念
]
```

#### 风格标签剔除
```python
style_block_drop = [
    '板块趋势', '非周期股', '通达信88', '中字头', '陆股通买',
    # ... 更多风格标签
]
```

### 概念主题列表

```python
n1name_list = [
    't_', 'T0', 'T1', 'T2', '交通运输', 'AI', '医疗健康',
    '数据', '基建', '新材料', '新能源', '智能设备', '消费',
    '消费电子', '环保', '能源', '装备', '金融'
]
```

### 指数列表

#### 宽基指数
```python
indexListM = [
    '000001', '399001', '399006', '000688', '000016',
    '000300', '000903', '000905', '000852', '000985',
    '880529', '880008', '880007', '399303'
]
```

#### 其他指数
```python
indexListN = [
    '399372', '399373', '399374', '399375', '399376',
    '399377', '000922', '000986', '000987', '000989',
    # ... 更多指数
]
```

### 独立板块列表

这些板块具有独立逻辑，不应被主线算法的重叠度判定"吞噬"：

```python
independent_block_list = ['黄金概念', '白酒概念']
```

### ZIG指标参数

```python
defaultZIG = defaultdict(lambda: 0.0005)
defaultZIG['STOCK'] = 0.003
```

---

## 类定义

### class GLOBALMAP()

全局参数类，提供时间和路径配置。

#### 静态方法

##### TODAY()

获取今日交易日（8点更换时间）。

**返回值:**
- `str`: 今日交易日

**功能说明:**
- 当前时间 <= 8:00 返回昨日交易日
- 当前时间 > 8:00 返回今日交易日

**代码示例:**
```python
from FQMarket.FQUtil.Parameter import GLOBALMAP

today = GLOBALMAP.TODAY()
print(today)
```

##### TODAYEND()

获取今日交易日（16点更换时间）。

**返回值:**
- `str`: 今日交易日

**功能说明:**
- 当前时间 <= 16:00 返回昨日交易日
- 当前时间 > 16:00 返回今日交易日

**代码示例:**
```python
from FQMarket.FQUtil.Parameter import GLOBALMAP

today_end = GLOBALMAP.TODAYEND()
print(today_end)
```

##### DAY()

获取今日日期（不考虑时间）。

**返回值:**
- `str`: 今日日期

**代码示例:**
```python
from FQMarket.FQUtil.Parameter import GLOBALMAP

day = GLOBALMAP.DAY()
print(day)
```

##### NOW()

获取当前时间。

**返回值:**
- `str`: 当前时间，格式为'YYYY-MM-DD HH:MM'

**代码示例:**
```python
from FQMarket.FQUtil.Parameter import GLOBALMAP

now = GLOBALMAP.NOW()
print(now)
```

#### 路径配置

```python
INDEXPATH = '/var/www/stock/'              # 网页根目录
JSONDATAPATH = INDEXPATH + 'h5/data/'     # JSON数据路径
WEBPOOLSPATH = INDEXPATH + 'h5/data/JoinPools/'  # 网页股票池路径
IMGDATAPATH = INDEXPATH + 'h5/image/'     # 图片路径

ROOTPATH = '/root/FQuant/'                 # 项目根目录
TEMPLATEPATH = ROOTPATH + 'template/'      # 模板路径
POOLSPATH = ROOTPATH + 'poolsdata/'        # 股票池数据路径
BASEDATAPATH = ROOTPATH + 'data/'          # 基础数据路径

start_date = '2014-01-01'                   # 数据起始日期
```

---

## 消息推送函数

### sendText2Wechat(content)

发送文本消息到企业微信。

**参数:**
- `content` (str): 消息内容

**代码示例:**
```python
from FQMarket.FQUtil.Parameter import sendText2Wechat

sendText2Wechat('这是一条测试消息')
```

### sendBondStock2Wechat(content)

发送可转债股票消息到企业微信。

**参数:**
- `content` (str): 消息内容

### sendVolPrice2Wechat(content)

发送量价齐升消息到企业微信。

**参数:**
- `content` (str): 消息内容

### sendHighWechat(content)

发送机会消息到企业微信。

**参数:**
- `content` (str): 消息内容

### sendLimitWechat(content)

发送打板消息到企业微信。

**参数:**
- `content` (str): 消息内容

### sendInsMinWechat(content)

发送行业消息到企业微信。

**参数:**
- `content` (str): 消息内容

### sendText2SystemWechat(content)

发送系统信息到企业微信（分离推送）。

**参数:**
- `content` (str): 消息内容

**代码示例:**
```python
from FQMarket.FQUtil.Parameter import sendText2SystemWechat

sendText2SystemWechat('系统初始化完成')
```

---

## Server酱推送

### class ServerChan()

Server酱消息推送类。

#### \_\_init\_\_(self, serverchan_key)

初始化Server酱。

**参数:**
- `serverchan_key` (str): Server酱密钥

#### send(self, title, body='')

发送消息（GET方式）。

**参数:**
- `title` (str): 消息标题
- `body` (str, optional): 消息内容

**返回值:**
- `dict`: 响应结果

#### post(self, title, body='')

发送消息（POST方式）。

**参数:**
- `title` (str): 消息标题
- `body` (str, optional): 消息内容

**返回值:**
- `Response`: 响应对象

### sendMessage2ServerChan(title, body)

发送消息到Server酱。

**参数:**
- `title` (str): 消息标题
- `body` (str): 消息内容

**代码示例:**
```python
from FQMarket.FQUtil.Parameter import sendMessage2ServerChan

sendMessage2ServerChan('标题', '消息内容')
```

---

## 月度板块日历

```python
stockCalendar = [
    {'month': '一月', 'block': [['次新股', '#'], ['超跌次新股', '#']]},
    {'month': '二月', 'block': [['电影', '#']]},
    # ... 更多月份
]
```

---

## 股票池配置

### class STOCKPOOLS()

股票池配置类。

```python
PAPA = {...}    # 个股统计
HOT = {...}     # 热门股量化统计
NEW = {...}     # 次新股量化统计
LOW = {...}     # 活跃超跌股统计
ADD = {...}     # 业绩预增股统计
SONG = {...}    # 预高送转统计
QIAN = {...}    # 高送转预期统计
```

### class CUSTOMPOLLS()

自定义股票池配置类。

```python
CUSTOM = '自选条件选股'
```

---

## 龙虎榜说明

### class BRANDNOTE()

龙虎榜说明模板类。

```python
D3D20 = '连续三个交易日收盘价格跌幅偏离值累计达到%s%'
D3U20 = '连续三个交易日收盘价格涨幅偏离值累计达到%s%'
D1D07 = '日价格跌幅偏离值达到%s%'
D1U07 = '日价格涨幅偏离值达到%s%'
D1H20 = '日换手率达到%s%'
D1Z15 = '日价格振幅达到%s%'
```

---

## 指标标记

### class INDICATOR_MARK()

指标分析结果标记类。

```python
UP = 'u'          # 多头/上升
NORMAL = 'n'      # 盘整
DOWN = 'd'        # 空头/下降
STATUS = 'S'      # 状态
EXCHANGE = 'E'    # 交易
TREND = 'T'       # 趋势
```
