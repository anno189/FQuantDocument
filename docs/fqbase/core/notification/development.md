---
title: 通知服务 - 开发指南
description: 通知服务开发指南与贡献指南
tag:
  - fqbase
  - core
  - notification
---

# 通知服务 - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → **[开发指南](./development.md)** → [最佳实践](./best-practices.md) |


## 概述

本指南帮助开发者理解通知服务模块的内部实现，并提供开发贡献指导。

## 开发环境设置

### 前置要求

- Python 3.8+
- Git
- pip
- corpwechatbot 库（用于企业微信）

### 设置

```bash
# 克隆仓库
git clone https://github.com/fquant/fquant.git
cd fquant

# 安装依赖
pip install -e FQuant.Server/FQBase

# 安装开发依赖
pip install corpwechatbot requests pytest
```

## 项目结构

```
FQBase/Core/
├── notification.py          # 主要实现
├── logger.py                # 日志模块
└── Foundation/
    └── singleton.py         # 单例模式实现
```

## 代码规范

### 样式指南

- 遵循 PEP 8
- 使用类型提示
- 编写文档字符串

### 代码示例

```python
from typing import Dict, Optional
import threading
from ..Foundation.singleton import singleton
from .logger import get_logger

logger = get_logger(__name__)

class CustomHandler(NotificationHandler):
    """自定义通知处理器

    参数:
        channel: 渠道标识

    属性:
        _client: 客户端实例

    示例:
        >>> handler = CustomHandler(channel='DEFAULT')
        >>> handler.send('Hello')
        True
    """

    def __init__(self, channel: str = 'DEFAULT') -> None:
        self.channel = channel
        self._client = None

    def send(self, content: str, **kwargs) -> bool:
        """发送通知

        参数:
            content: 消息内容

        返回:
            是否发送成功
        """
        if not content:
            logger.warning("消息内容为空")
            return False
        
        # 实现发送逻辑
        return True
```

## 扩展通知渠道

### 创建自定义处理器

```python
from FQBase.Core.notification import NotificationHandler, NotificationManager
from typing import Dict

class DingTalkHandler(NotificationHandler):
    """钉钉通知处理器示例"""

    def __init__(self, webhook_url: str) -> None:
        self.webhook_url = webhook_url

    def send(self, content: str, **kwargs) -> bool:
        """发送钉钉消息"""
        import requests
        
        data = {
            "msgtype": "text",
            "text": {
                "content": content
            }
        }
        
        try:
            response = requests.post(
                self.webhook_url,
                json=data,
                timeout=5
            )
            return response.status_code == 200
        except Exception as e:
            print(f"发送失败: {e}")
            return False

# 注册自定义处理器
manager = NotificationManager()
manager.register('dingtalk', DingTalkHandler(webhook_url='your_webhook_url'))

# 使用自定义处理器
manager.send('钉钉消息', channel='dingtalk')  # 注意：需要修改 send 方法支持
```

### 修改 send 方法支持自定义渠道

如果需要使用自定义渠道，可以直接调用注册的处理器：

```python
handler = manager.get_handler('dingtalk')
if handler:
    result = handler.send('自定义渠道消息')
```

## 测试

### 运行测试

```bash
# 运行测试
pytest tests/

# 测试特定模块
pytest tests/fqbase/core/test_notification.py -v
```

### 编写测试

```python
import pytest
from unittest.mock import Mock, patch
from FQBase.Core.notification import (
    NotificationManager,
    WecomHandler,
    ServerChanHandler,
    PushBearHandler,
    NotificationHandler
)

class TestNotificationManager:
    def test_singleton(self):
        """测试单例模式"""
        manager1 = NotificationManager()
        manager2 = NotificationManager()
        assert manager1 is manager2

    def test_send_to_default_channel(self):
        """测试发送到默认渠道"""
        manager = NotificationManager()
        # 需要 mock 网络请求
        with patch.object(WecomHandler, 'send', return_value=True):
            result = manager.send('测试消息', channel='DEFAULT')
            assert result is True

    def test_send_all(self):
        """测试广播发送"""
        manager = NotificationManager()
        with patch.object(WecomHandler, 'send', return_value=True):
            results = manager.send_all('广播消息')
            assert isinstance(results, dict)

class TestServerChanHandler:
    def test_initialization(self):
        """测试初始化"""
        handler = ServerChanHandler(serverchan_key='test_key')
        assert handler.serverchan_key == 'test_key'

    def test_send_without_key(self):
        """测试无 Key 发送"""
        handler = ServerChanHandler(serverchan_key='')
        result = handler.send('测试消息')
        assert result is False
```

## 调试

### 启用调试日志

```python
import logging

# 启用调试日志
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("FQBase.Core.notification")
logger.setLevel(logging.DEBUG)
```

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 发送失败返回 False | 网络问题或配置错误 | 检查环境变量配置 |
| WecomHandler 创建失败 | 缺少 corpwechatbot 库 | pip install corpwechatbot |
| 异步发送阻塞 | 线程池满 | 增大线程池大小 |

## 贡献

1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 添加测试
5. 提交 Pull Request

## 相关文档

- [API参考](./api.md)
- [设计原则](./design.md)
- [最佳实践](./best-practices.md)
