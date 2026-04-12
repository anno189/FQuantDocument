---
title: FQServer 服务层
---

# FQServer 服务层

FQServer 是系统的服务层，提供 Celery 定时任务、Flask API、文件同步和 FTP 服务。

## 目录结构

```
FQServer/
├── Celery/                    # 异步任务调度
│   ├── Application.py         # Celery应用实例
│   ├── Config.py             # 任务配置加载器（支持tasks.yaml）
│   ├── TaskData.py           # 数据任务定义
│   ├── TaskMessage.py        # 消息推送任务
│   ├── config/
│   │   └── tasks.yaml        # 定时任务配置
│   ├── Service/              # 推送服务
│   │   ├── ServerChan.py     # Server酱推送
│   │   ├── UniPush.py        # 统一推送
│   │   └── News.py           # 新闻资讯
│   └── Webpage/              # 网页监控
│       ├── Parameter.py      # 参数配置
│       ├── poolsmoniter.py   # 股票池监控
│       └── industrymoniter.py # 行业监控
│
├── Flask/                    # Web API服务
│   └── server.py             # Flask应用
│
├── FileSync/                 # 文件同步服务
│   └── server.py
│
└── FTP/                      # FTP服务
    └── myFTPServer.py
```

## Celery 定时任务

### 任务配置 (tasks.yaml)

支持多环境配置，自动读取 `CELERY_ENV` 环境变量。

```yaml
defaults:
  redis:
    host: "127.0.0.1"
    port: 6379
    db: 5

  celery:
    broker_url: "redis://127.0.0.1:6379/5"
    result_backend: "redis://127.0.0.1:6379/6"

environments:
  development:
    redis:
      host: "127.0.0.1"
    task_time_limit: 3600

  production:
    redis:
      host: "10.0.0.1"
    task_time_limit: 7200
```

### 内置任务 (15个)

| 任务名称 | 执行时间 | 功能描述 |
|---------|---------|---------|
| send-market-realtime-1min | 交易时间每分钟 | 实时市场数据推送 |
| send-market-realtime-1500 | 15:00 | 收盘数据最终处理 |
| pre-market-open-works-0801 | 08:01 | 开盘前准备（价格推算） |
| init-data-0910 | 09:05 | 交易日数据初始化 |
| check-market-status-0926 | 09:28 | 市场状态检查 |
| check-market-status-1135 | 11:35 | 市场状态检查 |
| pre-market-close-works-1456 | 14:56 | 收盘前提醒 |
| correct-market-limit-data-1516 | 15:16 | 修正涨停封单数据 |
| save-market-data-1603 | 16:03 | 保存日线数据 |
| update-market-data-1825 | 18:25 | 量化运算 |
| update-market-data-1905 | 19:05 | 盘后更新 |
| save-lhb-data-2050 | 20:50 | 保存龙虎榜数据 |
| save-base-data-0101 | 01:01 | 保存基础数据（除权除息） |
| rotate-logs-6h | 每6小时 | 日志轮转 |
| check-market-hourly | 多时间点 | 市场报告更新 |

### 推送服务

```python
from FQServer.Celery.Service.ServerChan import ServerChan, sendMessage2ServerChan
from FQServer.Celery.Service.UniPush import UniPush
from FQServer.Celery.Service.News import News

# Server酱推送
serverchan = ServerChan()
serverchan.send("消息内容")

# 统一推送
unipush = UniPush()
unipush.send(title, content)

# 新闻推送
news = News()
news.send_daily_news()
```

### 网页监控

```python
from FQServer.Celery.Webpage.poolsmoniter import PoolsMonitor
from FQServer.Celery.Webpage.industrymoniter import IndustryMonitor

# 股票池监控
monitor = PoolsMonitor()
monitor.check_pools()

# 行业监控
industry_monitor = IndustryMonitor()
industry_monitor.check_industry()
```

## Flask API

```python
from FQServer.Flask.server import app

@app.route('/api/market')
def market_data():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

## FileSync 文件同步

```python
from FQServer.FileSync.server import FileSyncServer

server = FileSyncServer()
server.start()
```

## FTP 服务

```python
from FQServer.FTP.myFTPServer import FTPServer

server = FTPServer()
server.start()
```

## 快速开始

### 启动 Celery Worker

```bash
cd FQuant.Server/FQServer
celery -A Celery.Application worker --loglevel=info
```

### 启动 Celery Beat

```bash
celery -A Celery.Application beat --loglevel=info
```

### 启动 Flask 服务

```bash
python -m FQServer.Flask.server
```

### 任务调度配置

```python
from FQServer.Celery.Config import ConfigLoader

config = ConfigLoader()
tasks = config.get_tasks()

for task_name, task_config in tasks.items():
    print(f"{task_name}: {task_config['schedule']}")
```