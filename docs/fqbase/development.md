---
title: FQBase - 开发指南
description: FQBase 开发指南与贡献指南
tag:
  - fqbase
---

# FQBase - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [框架集成](./framework.md) → [技术架构](./architecture.md) → [设计原则](./design.md) → [API参考](./api.md) → **[开发指南](./development.md)** → [最佳实践](./best-practices.md) |

## 子模块开发指南

| 子模块 | 开发指南 | 说明 |
|--------|----------|------|
| Core | [开发指南](./core/development.md) | 事件总线、日志、通知 |
| Foundation | [开发指南](./foundation/development.md) | 验证、异常、重试、单例 |
| Util | [开发指南](./util/development.md) | 工具函数 |
| Config | [开发指南](./config/development.md) | 配置管理 |
| Cache | [开发指南](./cache/development.md) | 缓存抽象 |
| Date | [开发指南](./date/usage.md) | 日期时间 |
| DataStore | [开发指南](./datastore/usage.md) | 数据存储 |
| Crawler | [开发指南](./crawler/usage.md) | 网页爬虫 |


## 概述

如何开发和贡献 FQBase 项目。

## 开发环境设置

### 前置要求

- Python 3.8+
- Git
- pip

### 设置

```bash
# 克隆仓库
git clone https://github.com/fquant/fquant.git
cd FQuant

# 安装依赖
pip install -e FQuant.Server/FQBase

# 安装开发依赖
pip install -e "FQuant.Server/FQBase[dev]"
```

## 项目结构

```
FQBase/
├── __init__.py          # 模块导出
├── Core/                # 核心组件
│   ├── event_bus.py     # 事件总线
│   ├── logger.py        # 日志系统
│   └── notification.py  # 通知服务
├── Foundation/          # 基础组件
│   ├── validators.py    # 验证器
│   ├── exceptions.py   # 异常
│   └── retry.py        # 重试机制
├── Util/                # 工具函数
├── Config/              # 配置管理
├── Cache/               # 缓存
├── Date/                # 日期时间
├── DataStore/           # 数据存储
└── Crawler/            # 网页爬虫
```

## 代码规范

### 样式指南

- 遵循 PEP 8
- 使用类型提示
- 编写文档字符串

### 代码示例

```python
from typing import Optional, Dict, Any

class MyClass:
    """简短描述。

    更长的描述（如果需要）。

    参数:
        param1: param1 的描述
        param2: param2 的描述

    属性:
        attr1: attr1 的描述

    示例:
        >>> obj = MyClass(param1="value")
        >>> obj.process()
    """

    def __init__(self, param1: str, param2: Optional[int] = None) -> None:
        self.param1 = param1
        self.param2 = param2

    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """处理输入数据。

        参数:
            input_data: 要处理的输入数据

        返回:
            处理后的数据

        异常:
            ValueError: 如果输入无效
        """
        if not input_data:
            raise ValueError("需要输入数据")
        return {"result": input_data}
```

## 测试

### 运行测试

```bash
# 运行所有测试
pytest tests/FQBase/

# 运行特定测试
pytest tests/FQBase/test_event_bus.py

# 带覆盖率运行
pytest --cov=FQBase tests/
```

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
