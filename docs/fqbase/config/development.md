---
title: Config - 开发指南
description: FQBase 配置中心开发指南与贡献指南
tag:
  - fqbase
  - config
---

# Config - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → **[开发指南](./development.md)** → [最佳实践](./best-practices.md) |

## 子模块开发指南

| 子模块 | 开发指南 | 说明 |
|--------|----------|------|
| base | [开发指南](./base/development.md) | 基础配置开发 |
| business | [开发指南](./business/development.md) | 业务配置开发 |


## 概述

介绍如何开发和贡献配置中心模块。

## 开发环境设置

### 前置要求

- Python 3.8+
- Git
- pip

### 设置

```bash
# 克隆仓库
git clone https://github.com/fquant/fquant.git
cd fquant

# 安装依赖
pip install -e .

# 安装开发依赖
pip install -e ".[dev]"
```

## 项目结构

```
Config/
├── __init__.py          # 模块导出
├── base/                # 基础配置
│   ├── __init__.py
│   ├── env.py           # 环境变量管理
│   ├── setting.py       # MongoDB 配置
│   ├── cache_config.py  # 缓存配置
│   └── config_watcher.py # 配置监听
├── business/            # 业务配置
│   ├── __init__.py
│   ├── datasource_config.py
│   └── ip_list.py
└── tests/               # 测试
```

## 代码规范

### 样式指南

- 遵循 PEP 8
- 使用类型提示
- 编写文档字符串

### 代码示例

```python
from typing import Optional, Any
import os

def get_env(key: str, default: Optional[Any] = None) -> Any:
    """获取环境变量值，支持默认值。

    参数:
        key: 环境变量名称
        default: 默认值

    返回:
        环境变量值或默认值

    示例:
        >>> get_env('DEBUG', False)
        False
    """
    return os.environ.get(key, default)
```

## 测试

### 运行测试

```bash
# 运行所有测试
pytest tests/Config/

# 运行特定测试
pytest tests/Config/test_env.py

# 带覆盖率运行
pytest --cov=FQBase.Config tests/
```

### 编写测试

```python
import pytest
from FQBase.Config import get_env, load_env

class TestEnv:
    def test_get_env_with_default(self):
        result = get_env('NON_EXISTENT', 'default_value')
        assert result == 'default_value'

    def test_load_env(self, tmp_path):
        env_file = tmp_path / ".env"
        env_file.write_text("TEST_KEY=test_value")
        load_env(str(env_file))
        assert get_env('TEST_KEY') == 'test_value'
```

## 调试

### 启用调试日志

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("fqbase.config")
```

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| get_env 返回 None | 环境变量未加载 | 先调用 load_env() |
| DATABASE 连接失败 | MongoDB 服务未运行 | 检查 MongoDB 服务 |
| 缓存配置无效 | cache_type 不正确 | 使用 'redis' 或 'mongo' |

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
