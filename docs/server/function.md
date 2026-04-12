# FQuant Celery 任务函数文档

> 版本: 2026-03-24  
> 更新: 基于代码审计结果补充完整任务说明  
> 关联: [FQServer/Celery/TaskData.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQServer/Celery/TaskData.py), [Config.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQServer/Celery/Config.py)

---

## 一、任务调度概述

FQuant 使用 Celery 作为异步任务调度框架，Redis 作为消息队列和结果存储后端。

### 1.1 配置信息

| 配置项 | 当前值 | 位置 | 建议 |
|--------|--------|------|------|
| result_backend | `redis://127.0.0.1:6379/5` | Config.py:10 | 迁移到环境变量 |
| broker_url | `redis://127.0.0.1:6379/6` | Config.py:11 | 迁移到环境变量 |
| timezone | `Asia/Shanghai` | Config.py:13 | - |
| worker_max_tasks_per_child | 40 | Config.py:16 | - |

### 1.2 任务执行时间总览

```
时间轴 (交易日):
08:01  ├─ pre_market_open_works    # 开盘前准备
08:10  ├─ day_get_news_0800        # 更新格隆汇早盘
08:30  ├─ day_get_news_0830        # 更新格隆汇早盘
09:05  ├─ initData                 # 初始化数据
09:28  ├─ checkRealMarketStatus    # 市场状态检查
09:00-11:30, 13:00-15:00  ├─ send_market_realtime (每分钟)  # 实时数据推送
11:35  ├─ checkRealMarketStatus    # 市场状态检查
14:56  ├─ pre_market_close_works   # 收盘前提醒
15:00  ├─ send_market_realtime     # 收盘数据推送
15:16  ├─ correct_market_limit_data # 修正涨停封单数据
16:03  ├─ update1600               # 保存市场数据
18:25  ├─ update1800               # 量化运算
19:05  ├─ update1900               # 盘后更新
20:50  ├─ save_data_lhb_2000       # 更新龙虎榜
20:30  ├─ day_get_news_2000        # 更新收评
21:01  ├─ day_saveLhb2Json         # 龙虎榜运算
21:30  ├─ day_get_news_2000        # 再次更新收评
23:55  ├─ day_get_cctvnews         # 更新新闻联播
01:01  ├─ update2400               # 保存基础数据
06:01  ├─ day_saveLhb2Json         # 龙虎榜运算

定时任务:
*/6h   ├─ rotate_celery_logs       # 日志轮转
指定时间 ├─ hour_get_market_report   # 更新报告
```

---

## 二、数据初始化任务

### 2.1 initData - 交易日初始化

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.initData` |
| **执行时间** | 09:05 (交易日) |
| **执行条件** | `QA_util_if_trade()` 判断为交易日 |
| **主要功能** | 初始化 Redis、stockbase、pools 等数据 |

**执行流程**:
```python
if QA_util_if_trade(str(datetime.date.today())):
    loadInitData()           # 加载初始化数据
    save_hot2json()          # 保存热门股数据
    celerySendMessage2Me()   # 发送完成通知
```

**依赖服务**:
- Redis 连接
- MongoDB 连接
- 微信推送服务

---

## 三、数据保存任务

### 3.1 update1600 - 日线数据保存

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.update1600` |
| **执行时间** | 16:03 (交易日) |
| **运行时长** | 约 90 分钟 |
| **主要功能** | 下载并保存日线数据 |

**执行流程**:
```python
if QA_util_if_trade(str(datetime.date.today())):
    save1600()               # 保存日线数据
    caluFundsNetworth()      # 更新净值
    celerySendMessage2Me()   # 发送完成通知
```

### 3.2 update1800 - 量化运算

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.update1800` |
| **执行时间** | 18:25 (交易日) |
| **主要功能** | 执行量化运算、数据检查、主题更新 |

**执行流程**:
```python
if QA_util_if_trade(str(datetime.date.today())):
    updateBaseData()                    # 更新基础数据
    dailycheckdata()                    # 每日数据检查
    save_icfqs_concept()                # 更新概念数据
    save_stock_concept_hot_list_2json() # 更新热门列表
    compactdb()                         # 压缩数据库
```

### 3.3 update2400 - 基础数据保存

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.update2400` |
| **执行时间** | 01:01 (交易日) |
| **主要功能** | 保存除权除息等基础数据 |

**执行流程**:
```python
if QA_util_if_trade(str(datetime.date.today())):
    save2400()               # 保存财务/除权除息数据
    celerySendMessage2Me()   # 发送完成通知
    compactdb()              # 压缩数据库
```

---

## 四、实时数据任务

### 4.1 send_market_realtime - 实时市场数据

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.send_market_realtime` |
| **执行时间** | 交易时间每分钟 (09:00-11:30, 13:00-15:00) |
| **额外执行** | 15:00 收盘时额外执行一次 |
| **主要功能** | 实时市场统计、数据推送 |

**执行流程**:
```python
msg = marketRealtime()       # 获取实时市场数据
if msg != '':
    celerySendMessage2Me()   # 发送消息通知
```

**监控指标**:
- 成交量预测
- 涨跌分布
- 涨跌停统计
- 主线板块识别

### 4.2 checkRealMarketStatus - 市场状态检查

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.checkRealMarketStatus` |
| **执行时间** | 09:28, 11:35 (交易日) |
| **主要功能** | 检查市场运行状态 |

### 4.3 correct_market_limit_data - 涨停数据修正

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.correct_market_limit_data` |
| **执行时间** | 15:16 (交易日) |
| **主要功能** | 修正涨停封单数据 |

**执行流程**:
```python
if QA_util_if_trade(str(datetime.date.today())):
    markerRealtime1530()     # 15:30 数据修正
```

---

## 五、龙虎榜任务

### 5.1 save_data_lhb_2000 - 龙虎榜数据下载

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.save_data_lhb_2000` |
| **执行时间** | 20:50 (交易日) |
| **主要功能** | 下载龙虎榜原始数据 |

**执行流程**:
```python
saveLhbData()                # 保存龙虎榜数据
celerySendMessage2Me()       # 发送完成通知
```

### 5.2 day_saveLhb2Json - 龙虎榜运算

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.day_saveLhb2Json` |
| **执行时间** | 06:01, 21:01 (交易日) |
| **主要功能** | 龙虎榜数据运算、生成 JSON |

**执行流程**:
```python
saveLhb2Json()               # 龙虎榜数据运算
```

---

## 六、新闻资讯任务

### 6.1 day_get_cctvnews - 新闻联播

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.day_get_cctvnews` |
| **执行时间** | 23:55 |
| **主要功能** | 更新新闻联播数据 |

### 6.2 day_get_news_0800 - 格隆汇早盘

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.day_get_news_0800` |
| **执行时间** | 08:10 (交易日) |
| **主要功能** | 更新格隆汇早盘资讯 |

### 6.3 day_get_news_0830 - 格隆汇早盘

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.day_get_news_0830` |
| **执行时间** | 08:30 (交易日) |
| **主要功能** | 更新格隆汇早盘资讯 |

### 6.4 day_get_news_2000 - 收评

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.day_get_news_2000` |
| **执行时间** | 20:30, 21:30 |
| **主要功能** | 更新收评资讯 |

---

## 七、系统维护任务

### 7.1 rotate_celery_logs - 日志轮转

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.rotate_celery_logs` |
| **执行时间** | 每6小时 |
| **主要功能** | 拆分日志文件，防止日志过大 |

### 7.2 hour_get_market_report - 市场报告

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.hour_get_market_report` |
| **执行时间** | 00:01, 08:01, 09:01, 12:01, 15:01, 20:01 (交易日) |
| **主要功能** | 更新市场报告 |

### 7.3 pre_market_open_works - 开盘前准备

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.pre_market_open_works` |
| **执行时间** | 08:01 (交易日) |
| **主要功能** | 股票池下单提醒、价格推算 |

### 7.4 pre_market_close_works - 收盘前提醒

| 属性 | 说明 |
|------|------|
| **任务名称** | `FQServer.Celery.TaskData.pre_market_close_works` |
| **执行时间** | 14:56 (交易日) |
| **主要功能** | 收盘前提示止损等信息 |

---

## 八、任务依赖关系

```
initData (09:05)
    │
    ▼
send_market_realtime (交易时间每分钟)
    │
    ▼
update1600 (16:03) ──► update1800 (18:25)
    │                       │
    │                       ▼
    │                  save_icfqs_concept
    │                  save_stock_concept_hot_list_2json
    │
    ▼
save_data_lhb_2000 (20:50) ──► day_saveLhb2Json (21:01)
```

---

## 九、任务配置外部化建议

当前 `beat_schedule` 为内联 Python 字典，建议迁移到 YAML 配置：

```yaml
# config/tasks.yaml
tasks:
  - name: send-market-realtime
    schedule: "*/1 9-11,13-14 * * 1-5"
    func: FQServer.Celery.TaskData.send_market_realtime
    enabled: true
    
  - name: save-market-data
    schedule: "3 16 * * 1-5"
    func: FQServer.Celery.TaskData.update1600
    enabled: true
    
  - name: update-quant-data
    schedule: "25 18 * * 1-5"
    func: FQServer.Celery.TaskData.update1800
    enabled: true
    dependencies:
      - save-market-data
```

---

## 十、故障处理指南

### 10.1 常见问题

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 任务未执行 | Celery beat 未启动 | 检查 beat 进程 |
| Redis 连接失败 | Redis 服务未启动 | 启动 Redis 服务 |
| 任务执行超时 | 数据量过大 | 增加超时时间或分批处理 |
| 微信推送失败 | 密钥过期 | 检查 WECOM_SECRET 配置 |

### 10.2 监控检查清单

- [ ] Celery worker 进程运行状态
- [ ] Celery beat 进程运行状态
- [ ] Redis 连接状态
- [ ] MongoDB 连接状态
- [ ] 微信推送服务状态
- [ ] 日志文件大小

---

## 十一、审计发现

### 11.1 代码问题

| 问题 | 位置 | 严重程度 | 建议 |
|------|------|----------|------|
| Redis 连接硬编码 | Config.py:10-11 | P0 | 迁移到环境变量 |
| 任务配置内联 | Config.py:33-139 | P1 | 迁移到 YAML 配置 |
| 缺少任务超时配置 | TaskData.py | P2 | 添加超时设置 |

### 11.2 文档问题

| 问题 | 状态 | 建议 |
|------|------|------|
| function.md 内容缺失 | ✅ 已补充 | 本文档 |
| 任务依赖关系未文档化 | ✅ 已补充 | 添加依赖图 |

---

## 十二、参考资料

- [FQServer/Celery/TaskData.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQServer/Celery/TaskData.py) - 任务实现
- [FQServer/Celery/Config.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQServer/Celery/Config.py) - 任务配置
- [FQServer/Celery/Application.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQServer/Celery/Application.py) - Celery 应用

---

*本文档基于代码审计结果生成，与代码实现保持一致*
