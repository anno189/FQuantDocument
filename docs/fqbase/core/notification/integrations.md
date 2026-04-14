---
title: 通知服务 - 集成指南
description: 通知服务第三方集成指南
tag:
  - fqbase
  - core
  - notification
---

# 通知服务 - 集成指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → [开发指南](./development.md) → [使用指南](./usage.md) → [最佳实践](./best-practices.md) → **[集成指南](./integrations.md)** |


## 概述

本指南详细介绍如何将通知服务与其他系统和服务集成。

## 与 Celery 集成

### 任务完成通知

在 Celery 任务中集成通知服务：

```python
from celery import Celery
from FQBase.Core.notification import sendWechat

app = Celery('tasks')

@app.task(bind=True)
def process_data(self, data_id):
    """处理数据并发送通知"""
    try:
        # 处理逻辑
        result = process(data_id)

        # 发送成功通知
        sendWechat(f"任务完成: {data_id}", channel='SYSTEM')

        return result
    except Exception as e:
        # 发送失败通知
        sendWechat(f"任务失败: {data_id}, 错误: {str(e)}", channel='SYSTEM')
        raise
```

### 定时任务通知

```python
from celery import Celery
from celery.schedules import crontab
from FQBase.Core.notification import NotificationManager

app = Celery('tasks')

@app.task
def daily_report():
    """生成每日报告"""
    manager = NotificationManager()

    # 生成报告
    report = generate_daily_report()

    # 发送报告
    manager.send(report, channel='SYSTEM')

@app.task
def health_check():
    """健康检查任务"""
    manager = NotificationManager()

    issues = check_system_health()

    if issues:
        manager.send(f"健康检查异常:\n{issues}", channel='SYSTEM')
    else:
        manager.send("系统运行正常", channel='SYSTEM')

# 配置定时任务
app.conf.beat_schedule = {
    'daily-report': {
        'task': 'tasks.daily_report',
        'schedule': crontab(hour=8, minute=0),
    },
    'health-check': {
        'task': 'tasks.health_check',
        'schedule': crontab(minute='*/30'),
    },
}
```

## 与 Flask/Django 集成

### Flask 集成

```python
from flask import Flask, request, jsonify
from FQBase.Core.notification import sendWechat, NotificationManager

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    """处理外部 webhook 并发送通知"""
    data = request.json

    # 验证请求
    if not validate_webhook(data):
        return jsonify({'error': 'Invalid request'}), 400

    # 发送通知
    message = f"收到新请求:\n类型: {data.get('type')}\n内容: {data.get('content')}"
    result = sendWechat(message, channel='SYSTEM')

    return jsonify({'success': result})

@app.route('/notify', methods=['POST'])
def notify():
    """通用通知接口"""
    data = request.json
    channel = data.get('channel', 'DEFAULT')
    message = data.get('message', '')

    manager = NotificationManager()
    result = manager.send(message, channel=channel)

    return jsonify({'success': result})
```

### Django 集成

```python
# notifications/views.py
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from FQBase.Core.notification import sendWechat, NotificationManager

@require_POST
def webhook(request):
    """处理 webhook"""
    import json
    data = json.loads(request.body)

    message = f"收到通知:\n{data.get('message', '')}"
    result = sendWechat(message, channel='DEFAULT')

    return JsonResponse({'success': result})

# notifications/tasks.py
from celery import shared_task
from FQBase.Core.notification import sendWechat

@shared_task
def notify_order_status(order_id, status, details):
    """通知订单状态"""
    message = f"订单状态变更\n订单号: {order_id}\n状态: {status}"
    channel = 'BOND' if details.get('is_bond') else 'DEFAULT'

    sendWechat(message, channel=channel)
```

## 与日志系统集成

### 错误日志告警

```python
import logging
from FQBase.Core.notification import NotificationManager

class NotificationHandler(logging.Handler):
    """日志处理器，发送错误日志通知"""

    def __init__(self, channel='SYSTEM', level=logging.ERROR):
        super().__init__()
        self.channel = channel
        self.manager = NotificationManager()
        self.setLevel(level)

    def emit(self, record):
        """发送日志通知"""
        if record.levelno >= self.level:
            message = self.format(record)
            try:
                self.manager.send(message, channel=self.channel)
            except Exception:
                pass  # 避免通知失败导致程序崩溃

# 配置日志处理器
logger = logging.getLogger('myapp')
handler = NotificationHandler(channel='SYSTEM', level=logging.ERROR)
handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)
```

### 结构化日志

```python
import json
from FQBase.Core.notification import NotificationManager

class StructuredLogger:
    """结构化日志记录器，支持通知"""

    def __init__(self, name: str, notify_on_error: bool = True):
        self.logger = logging.getLogger(name)
        self.notify_on_error = notify_on_error
        self.manager = NotificationManager()

    def log(self, level: str, message: str, **kwargs):
        """记录日志"""
        log_data = {
            'message': message,
            **kwargs
        }
        self.logger.log(getattr(logging, level), json.dumps(log_data))

        # 如果是错误且开启通知
        if self.notify_on_error and level == 'ERROR':
            self.manager.send(
                f"日志告警\n{message}\n详情: {json.dumps(kwargs)}",
                channel='SYSTEM'
            )

# 使用
logger = StructuredLogger('myapp')
logger.log('INFO', '处理数据', data_id=123, count=100)
logger.log('ERROR', '处理失败', error='timeout', data_id=123)
```

## 与监控系统集成

### Prometheus 指标

```python
from prometheus_client import Counter, Gauge
from FQBase.Core.notification import NotificationManager

# 定义指标
NOTIFICATION_SENT = Counter('notification_sent_total', 'Total notifications sent',
                             ['channel', 'status'])
NOTIFICATION_LATENCY = Gauge('notification_latency_seconds', 'Notification latency',
                              ['channel'])

class InstrumentedNotificationManager(NotificationManager):
    """带监控的通知管理器"""

    def send(self, content: str, channel: str = 'DEFAULT') -> bool:
        import time

        start = time.time()
        try:
            result = super().send(content, channel)
            NOTIFICATION_SENT.labels(channel=channel, status='success' if result else 'failure').inc()
            return result
        finally:
            latency = time.time() - start
            NOTIFICATION_LATENCY.labels(channel=channel).set(latency)
```

### 自定义监控

```python
from FQBase.Core.notification import NotificationManager, sendWechat

class NotificationMonitor:
    """通知服务监控"""

    def __init__(self):
        self.manager = NotificationManager()
        self.stats = {'sent': 0, 'failed': 0}

    def track_send(self, result: bool):
        """跟踪发送结果"""
        if result:
            self.stats['sent'] += 1
        else:
            self.stats['failed'] += 1

    def get_stats(self):
        """获取统计信息"""
        total = self.stats['sent'] + self.stats['failed']
        success_rate = self.stats['sent'] / total if total > 0 else 0

        return {
            'total': total,
            'sent': self.stats['sent'],
            'failed': self.stats['failed'],
            'success_rate': success_rate
        }

    def report_stats(self):
        """报告统计信息"""
        stats = self.get_stats()
        message = f"通知统计\n" \
                  f"总数: {stats['total']}\n" \
                  f"成功: {stats['sent']}\n" \
                  f"失败: {stats['failed']}\n" \
                  f"成功率: {stats['success_rate']:.1%}"

        sendWechat(message, channel='SYSTEM')

# 全局监控器
monitor = NotificationMonitor()

# 在发送时使用
def tracked_send(message: str, channel: str):
    result = sendWechat(message, channel)
    monitor.track_send(result)
    return result
```

## 与配置系统集成

### 环境变量配置

```python
import os
from FQBase.Config.core.env import get_secure_env, get_env
from FQBase.Core.notification import NotificationManager, WecomHandler

class ConfiguredNotificationManager(NotificationManager):
    """支持环境变量配置的通知管理器"""

    def _init_default_handlers(self):
        # 从环境变量读取配置
        corpid = get_secure_env('WECOM_CORPID')

        # 初始化各渠道
        for channel in ['DEFAULT', 'BOND', 'SYSTEM']:
            secret = get_secure_env(f'WECOM_SECRET_{channel}')
            agentid = get_env(f'WECOM_AGENTID_{channel}', '1000010')

            if secret:
                self._handlers[f'wecom_{channel.lower()}'] = WecomHandler(channel=channel)

        # 其他渠道
        self._handlers['serverchan'] = ServerChanHandler()
        self._handlers['pushbear'] = PushBearHandler()
```

### YAML 配置

```yaml
# config/notification.yaml
notification:
  enabled: true
  channels:
    wecom:
      DEFAULT:
        agentid: "1000010"
      BOND:
        agentid: "1000011"
      SYSTEM:
        agentid: "1000012"
  rate_limit:
    per_minute: 60
```

```python
import yaml
from FQBase.Core.notification import NotificationManager

class YAMLConfiguredNotificationManager(NotificationManager):
    """支持 YAML 配置的通知管理器"""

    def __init__(self, config_path: str = None):
        super().__init__()
        self.config = self._load_config(config_path)

    def _load_config(self, config_path: str) -> dict:
        if config_path:
            with open(config_path) as f:
                return yaml.safe_load(f)
        return {}
```

## 集成最佳实践

1. **使用单例模式**：通过 NotificationManager 单例避免重复初始化
2. **异步处理**：高并发场景使用异步发送
3. **错误处理**：始终处理发送失败的情况
4. **限流保护**：实现限流避免触发第三方服务限流
5. **监控集成**：集成监控指标便于运维

## 相关文档

- [API参考](./api.md)
- [技术架构](./architecture.md)
- [开发指南](./development.md)
- [最佳实践](./best-practices.md)
