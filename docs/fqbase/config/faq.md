---
title: Config - 常见问题
description: Config 配置中心常见问题与解答
tag:
  - fqbase
  - config
---

# Config - 常见问题

## 阅读路径

| 角色 | 阅读路径 |
|------|---------|
| 🟡 运维/安全 | [README](./README.md) → [配置指南](./configuration.md) → [故障排查](./troubleshooting.md) → **[常见问题](./faq.md)** |


## 一般问题

### Q: 如何加载环境变量？

**A:** 使用 `load_env()` 函数：

```python
from FQBase.Config import load_env
load_env()
```

### Q: .env 文件应该放在哪里？

**A:** 默认放在项目根目录，也可以通过 `FQ_ENV_PATH` 环境变量指定位置。

### Q: 环境变量和配置文件哪个优先级高？

**A:** 系统环境变量 > .env 文件 > 代码默认值

## 使用问题

### Q: 如何获取带默认值的配置？

**A:** 使用 `get_env` 函数的第二个参数：

```python
value = get_env('KEY_NAME', 'default_value')
```

### Q: 敏感配置如何处理？

**A:** 使用 `get_secure_env` 函数，它会检测占位符：

```python
api_key = get_secure_env('API_KEY')
# 如果是占位符，返回 None
```

### Q: 如何在 Celery 中使用配置？

**A:** 使用 `reload_env()` 动态重载：

```python
from FQBase.Config import reload_env

# Celery 任务中
@app.task
def my_task():
    reload_env()  # 重新加载最新配置
    # 执行任务
```

## 交易常量问题

### Q: 交易常量在哪里定义？

**A:** 在 `FQBase.Config.business.constants` 模块中：

```python
from FQBase.Config import ORDER_DIRECTION, EXCHANGE_ID
```

### Q: 如何查看所有可用的常量？

**A:** 查看 `__all__` 列表：

```python
from FQBase.Config import __all__
print(__all__)
```

## 故障排查

### Q: get_env 返回 None 怎么办？

**A:** 
1. 确认已调用 `load_env()`
2. 检查 .env 文件是否存在
3. 检查环境变量名称是否正确

### Q: 配置值类型不对怎么办？

**A:** 显式转换类型：

```python
port = int(get_env('PORT', '27017'))
```

## 相关文档

- [API参考](./api.md)
- [使用指南](./usage.md)
- [最佳实践](./best-practices.md)
- [故障排查](./troubleshooting.md)
