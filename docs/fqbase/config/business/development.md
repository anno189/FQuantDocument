---
title: Business - 开发指南
description: Business 业务配置模块开发指南与贡献指南
tag:
  - fqbase
  - config
---

# Business - 开发指南

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🔵 开发者 | [README](./README.md) → [技术架构](./architecture.md) → [API参考](./api.md) → **[开发指南](./development.md)** |

## 概述

如何开发和贡献 Business 模块

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
pip install -e FQuant.Server
```

## 项目结构

```
Config/business/
├── __init__.py          # 模块导出
├── datasource_config.py # 数据源配置
└── ip_list.py          # IP列表管理
```

## 代码规范

### 添加新的数据源

```python
# 在 datasource_config.py 中添加
class DataSourceConfig:
    def get_priority(self, asset_type: str) -> List[str]:
        # 支持新的资产类型
        return self.get(f'datasources.{asset_type}.priority', [])
```

### 添加新的IP列表

```python
# 在 ip_list.py 中添加新的IP列表类型
class TDXIPListManager:
    @classmethod
    def get_xxx_list(cls) -> List[Dict]:
        cls._ensure_loaded()
        return cls._xxx_list.copy() if cls._xxx_list else []
```

## 测试

```bash
# 运行测试
pytest tests/

# 验证配置加载
python -c "from FQBase.Config.business import get_datasource_priority; print(get_datasource_priority('stock'))"
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
