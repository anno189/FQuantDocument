# 指标注册系统

FQFactor 使用注册表模式管理指标函数，支持动态注册、查询和调用。

## 1. 概述

### 1.1 核心组件

| 组件 | 说明 |
|------|------|
| `IndicatorRegistry` | 单例注册表，管理所有指标 |
| `IndicatorInfo` | 指标信息数据类 |
| `IndicatorCategory` | 指标分类枚举 |
| `@register_indicator` | 指标注册装饰器 |

### 1.2 架构图

```
┌─────────────────────────────────────────────────────┐
│              IndicatorRegistry (单例)                 │
├─────────────────────────────────────────────────────┤
│  _indicators: Dict[str, IndicatorInfo]             │
│                                                     │
│  "MA"    → IndicatorInfo(name="MA", func=MA, ...)  │
│  "EMA"   → IndicatorInfo(name="EMA", func=EMA, ...) │
│  "MACD"  → IndicatorInfo(name="MACD", func=MACD, ...)│
└─────────────────────────────────────────────────────┘
                           ▲
                           │ register()
                           │
┌─────────────────────────────────────────────────────┐
│  @register_indicator("MA", category=TREND, ...)    │
│  def MA(data, period=20):                           │
│      ...                                            │
└─────────────────────────────────────────────────────┘
```

## 2. IndicatorCategory 分类

```python
from FQFactor.indicators.registry import IndicatorCategory

class IndicatorCategory(Enum):
    TREND      = "trend"       # 趋势指标
    MOMENTUM   = "momentum"    # 动量指标
    VOLATILITY = "volatility"  # 波动率指标
    VOLUME     = "volume"      # 成交量指标
    SENTIMENT  = "sentiment"   # 市场情绪
    CUSTOM     = "custom"      # 自定义
```

## 3. IndicatorInfo 数据类

```python
@dataclass
class IndicatorInfo:
    """指标信息"""
    name: str                    # 指标名称
    func: Callable              # 指标函数
    category: IndicatorCategory  # 指标分类
    params: Dict[str, Any]      # 默认参数
    description: str = ""       # 描述
    outputs: Optional[Dict[str, str]] = None  # 输出说明
```

## 4. IndicatorRegistry API

### 4.1 获取实例

```python
from FQFactor.indicators.registry import IndicatorRegistry

# 获取单例实例
registry = IndicatorRegistry.get_instance()
```

### 4.2 注册指标

```python
# 方式1: 使用装饰器（推荐）
@register_indicator("MA", category=IndicatorCategory.TREND, params={"period": 20})
def MA(data, period=20):
    ...

# 方式2: 手动注册
registry.register(
    name="MA",
    func=MA,
    category=IndicatorCategory.TREND,
    params={"period": 20},
    description="移动平均线"
)
```

### 4.3 查询指标

```python
# 获取单个指标
info = registry.get("MA")
print(info.name)      # "MA"
print(info.func)      # <function MA>
print(info.params)    # {"period": 20}

# 检查是否存在
exists = registry.exists("MA")  # True

# 列出所有指标
all_indicators = registry.list_all()

# 按分类列出
trend_indicators = registry.list_by_category(IndicatorCategory.TREND)
momentum_indicators = registry.list_by_category(IndicatorCategory.MOMENTUM)
```

### 4.4 调用指标

```python
# 通过注册表调用
registry = IndicatorRegistry.get_instance()
ma_func = registry.get("MA").func

result = ma_func(data, period=5)
```

## 5. register_indicator 装饰器

### 5.1 完整签名

```python
def register_indicator(
    name: str,                           # 指标名称
    category: IndicatorCategory,          # 分类
    params: Optional[Dict[str, Any]],    # 默认参数
    description: str = "",                # 描述
    outputs: Optional[Dict[str, str]] = None  # 输出说明
)
```

### 5.2 使用示例

```python
# 基本用法
@register_indicator("RSI", category=IndicatorCategory.MOMENTUM, params={"period": 24})
def RSI(data, period=24):
    ...

# 带描述
@register_indicator(
    "MACD",
    category=IndicatorCategory.TREND,
    params={"fast": 12, "slow": 26, "signal": 9},
    description="MACD指标 (Moving Average Convergence Divergence)"
)
def MACD(data, fast=12, slow=26, signal=9):
    ...

# 多输出指标
@register_indicator(
    "BOLL",
    category=IndicatorCategory.VOLATILITY,
    params={"n": 20, "p": 2},
    outputs={"upper": "上轨", "mid": "中轨", "lower": "下轨"}
)
def BOLL(data, n=20, p=2):
    ...
```

## 6. 扩展注册表

### 6.1 自定义分类

```python
from FQFactor.indicators.registry import IndicatorCategory

# 扩展分类
IndicatorCategory.CUSTOM = "custom"  # 不推荐修改源码

# 建议：创建新的枚举值（在项目中扩展）
class MyCategory(Enum):
    CUSTOM = "custom"
```

### 6.2 插件式注册

```python
# indicators/my_indicators.py

from FQFactor.indicators.registry import register_indicator, IndicatorCategory

@register_indicator("MY_INDICATOR", category=IndicatorCategory.CUSTOM)
def my_indicator(data, param1=10):
    ...

# 在项目初始化时导入即可自动注册
# from FQFactor.indicators.my_indicators import *
```

## 7. 最佳实践

### 7.1 始终使用装饰器

```python
# 推荐
@register_indicator("MA", category=IndicatorCategory.TREND, params={"period": 20})
def MA(data, period=20):
    ...

# 不推荐
def MA(data, period=20):
    ...
registry.register("MA", MA, IndicatorCategory.TREND, {"period": 20})
```

### 7.2 参数命名规范

```python
# 推荐：使用通用参数名
params={"period": 20}  # period 比 n 更通用

# 不推荐
params={"n": 20}
```

### 7.3 保持分类一致

```python
# MACD 是趋势指标
@register_indicator("MACD", category=IndicatorCategory.TREND)

# RSI 是动量指标
@register_indicator("RSI", category=IndicatorCategory.MOMENTUM)

# BOLL 是波动率指标
@register_indicator("BOLL", category=IndicatorCategory.VOLATILITY)
```

## 8. 调试注册表

```python
# 打印所有已注册的指标
registry = IndicatorRegistry.get_instance()
for name, info in registry.list_all().items():
    print(f"{name}: {info.category.value}")

# 按分类统计
from collections import Counter
categories = Counter(info.category for info in registry.list_all().values())
print(categories)
# Counter({<IndicatorCategory.TREND: 'trend'>: 10, ...})
```
