# FQuant 过滤器体系文档

> 版本: 2026-03-24  
> 更新: 基于代码审计结果补充完整过滤器体系  
> 关联: [StrategyPools/](file:///Users/A.D.189/FQuant/FQuant.Server/FQMarket/FQMarket/StrategyPools/)

---

## 一、过滤器体系概述

FQuant 过滤器体系用于在选股过程中对股票池进行多维度筛选。过滤器按优先级执行，支持链式调用和组合逻辑。

### 1.1 过滤器分类

| 分类 | 说明 | 示例 |
|------|------|------|
| **价格类** | 基于价格数据的过滤 | 最低价限制、最高价限制 |
| **成交量类** | 基于成交量的过滤 | 成交额、换手率、量比 |
| **技术类** | 基于技术指标的过滤 | KDJ状态、均线多头 |
| **风险类** | 基于风险指标的过滤 | ST过滤、退市风险 |
| **市值类** | 基于市值的过滤 | 流通市值、总市值 |
| **板块类** | 基于板块属性的过滤 | 行业、概念、风格 |

---

## 二、基础过滤器

### 2.1 价格类过滤器

| 过滤器 | 条件 | 说明 | 典型值 |
|--------|------|------|--------|
| **最低价限制** | `close > 1` | 剔除低价股 | > 1元 |
| **最高价限制** | `close < 500` | 剔除高价股 | < 500元 |
| **涨跌幅限制** | `abs(close/prev_close - 1) < 0.15` | 剔除异常波动 | < 15% |
| **波动率过滤** | `std(close,20) > 0.02` | 剔除波动过低 | > 2% |

### 2.2 成交量类过滤器

| 过滤器 | 条件 | 说明 | 典型值 |
|--------|------|------|--------|
| **最小成交额** | `amount > 5,000,000` | 剔除低流动性 | > 500万 |
| **量比过滤** | `vol_ratio > 0.5` | 活跃度筛选 | > 0.5 |
| **换手率过滤** | `HSL > 0.01` | 流动性筛选 | > 1% |
| **5日换手过滤** | `HSL05 > 0.05` | 中期活跃度 | > 5% |

### 2.3 技术类过滤器

| 过滤器 | 条件 | 说明 |
|--------|------|------|
| **KDJ状态** | `(JLong > JLMA)` | KDJ多头排列 |
| **KDJ金叉** | `(J09 > JShort) & (JShort > JLong)` | 短期金叉 |
| **均线多头** | `close > MA5 > MA20` | 均线多头排列 |
| **MACD红柱** | `MACD > 0` | 动量向上 |
| **均线支撑** | `close > MA5` | 短期支撑 |
| **强势状态** | `(close > MA5) & (close > MA60)` | 强势股 |

### 2.4 风险类过滤器

| 过滤器 | 条件 | 说明 |
|--------|------|------|
| **ST过滤** | `st_status == 0` | 剔除ST股 |
| **退市风险** | `Delisting == 0` | 剔除退市风险股 |
| **停牌过滤** | `vol > 0` | 剔除停牌股 |
| **异常波动** | `vol < 1` (停盘) | 剔除异常 |

### 2.5 市值类过滤器

| 过滤器 | 条件 | 说明 | 典型值 |
|--------|------|------|--------|
| **流通市值** | `liutongshizhiZ > 10` | 剔除极小市值 | > 10亿 |
| **总市值** | `total_shizhi > 20` | 规模筛选 | > 20亿 |
| **市值分位** | `shizhi_quantile > 0.1` | 分位点筛选 | > 10% |

---

## 三、复合过滤器

### 3.1 强势股过滤器 (sp_strong)

```python
# 基础条件
(close > MA5) & (close > MA60)

# 扩展条件
((close > MA5) & (close > MA20) & (close > MA60))  # 均线多头排列
& (HSL > 0.02)  # 换手率>2%
& (amount > 100000000)  # 成交额>1亿
```

### 3.2 量价齐升过滤器

```python
# 价格条件
(close > open)  # 阳线
& (close > REF(close, 1))  # 上涨

# 成交量条件
& (vol > MA(vol, 5) * 1.5)  # 放量
& (amount > 50000000)  # 成交额>5000万
```

### 3.3 KDJ综合过滤器

```python
# KDJ条件
(data['JLong'] > data['JLMA'])  # KDJ多头排列
| (
    ((data['J09'] > data['JShort']) & (data['JShort'] > data['JLong']))  # 短期金叉
    | ((data['J34'] > data['K34']) | (data['J89'] > data['K89']) | (data['J200'] > data['K200']))  # 中长期金叉
)
```

### 3.4 成交金额过滤器

```python
# 成交额条件
((data['open'] + data['close'] + data['low'] + data['high']) * 36 * 20000 < data['amount'])
& (data['amount'] > 50000000)  # 成交额>5000万
```

---

## 四、过滤器管道设计

### 4.1 过滤器管道类 (建议实现)

```python
# FQAlgorithm/Filters/pipeline.py
from typing import List, Callable
import pandas as pd

class FilterPipeline:
    """过滤器管道，按优先级执行"""

    def __init__(self):
        self.filters: List[tuple] = []

    def add_filter(self, filter_func: Callable, priority: int = 100):
        """添加过滤器，设置优先级
        
        优先级规则:
        - 0-50: 风险类过滤器 (最先执行)
        - 51-100: 基础类过滤器
        - 101-150: 技术类过滤器
        - 151-200: 策略类过滤器
        """
        self.filters.append((priority, filter_func))
        self.filters.sort(key=lambda x: x[0])

    def execute(self, data: pd.DataFrame) -> pd.DataFrame:
        """按优先级执行过滤"""
        result = data
        for priority, filter_func in self.filters:
            result = filter_func(result)
            if len(result) == 0:
                break
        return result

    def get_filter_chain(self) -> List[str]:
        """获取过滤器链信息"""
        return [f"Priority {p}: {f.__name__}" for p, f in self.filters]
```

### 4.2 过滤器基类 (建议实现)

```python
# FQAlgorithm/Filters/base.py
from abc import ABC, abstractmethod
import pandas as pd

class BaseFilter(ABC):
    """过滤器基类"""

    def __init__(self, name: str, priority: int = 100):
        self.name = name
        self.priority = priority

    @abstractmethod
    def filter(self, data: pd.DataFrame) -> pd.DataFrame:
        """执行过滤逻辑"""
        pass

    def __call__(self, data: pd.DataFrame) -> pd.DataFrame:
        return self.filter(data)

class PriceFilter(BaseFilter):
    """价格过滤器"""
    
    def __init__(self, min_price: float = 1.0, max_price: float = 500.0):
        super().__init__("PriceFilter", priority=50)
        self.min_price = min_price
        self.max_price = max_price
    
    def filter(self, data: pd.DataFrame) -> pd.DataFrame:
        return data[
            (data['close'] > self.min_price) & 
            (data['close'] < self.max_price)
        ]

class VolumeFilter(BaseFilter):
    """成交量过滤器"""
    
    def __init__(self, min_amount: float = 5000000):
        super().__init__("VolumeFilter", priority=60)
        self.min_amount = min_amount
    
    def filter(self, data: pd.DataFrame) -> pd.DataFrame:
        return data[data['amount'] > self.min_amount]

class RiskFilter(BaseFilter):
    """风险过滤器"""
    
    def __init__(self):
        super().__init__("RiskFilter", priority=10)
    
    def filter(self, data: pd.DataFrame) -> pd.DataFrame:
        return data[
            (data.get('st_status', 0) == 0) &
            (data.get('vol', 1) > 0)
        ]
```

---

## 五、策略过滤器应用

### 5.1 策略池过滤器统计

| 策略类型 | 文件数 | 典型过滤器组合 |
|----------|--------|----------------|
| 强势股策略 | 15 | 均线多头 + 放量 + 非ST |
| 量价策略 | 10 | 量价齐升 + 换手率 |
| 连板策略 | 8 | 涨停基因 + 封板率 |
| 相关性策略 | 6 | 相关系数 + 板块强度 |
| 买入策略 | 4 | 金叉 + 放量 + 支撑位 |

### 5.2 典型策略过滤器示例

#### sp_strong - 强势股策略

```python
# 基础过滤
filters = [
    RiskFilter(),  # 风险过滤 (ST、停牌)
    PriceFilter(min_price=2.0),  # 价格过滤
    VolumeFilter(min_amount=10000000),  # 成交量过滤
]

# 策略特定过滤
def strong_filter(data):
    return data[
        (data['close'] > data['MA5']) &
        (data['close'] > data['MA60']) &
        (data['HSL'] > 0.02)
    ]
```

#### sp_pricevol - 量价策略

```python
# 量价齐升过滤
def pricevol_filter(data):
    return data[
        (data['close'] > data['open']) &  # 阳线
        (data['vol'] > data['vol_ma5'] * 1.5) &  # 放量
        (data['amount'] > 50000000)  # 成交额
    ]
```

#### sp_kdjvol - KDJ量能策略

```python
# KDJ + 量能过滤
def kdjvol_filter(data):
    return data[
        (data['JLong'] > data['JLMA']) &  # KDJ多头
        (data['vol'] > data['vol_ma5']) &  # 放量
        (data['HSL'] > 0.01)  # 换手率
    ]
```

---

## 六、过滤器优先级体系

### 6.1 推荐优先级分配

| 优先级范围 | 过滤器类型 | 说明 |
|------------|------------|------|
| 0-20 | 风险过滤器 | ST、退市、停牌 (最先执行) |
| 21-40 | 基础过滤器 | 价格、成交量基础筛选 |
| 41-60 | 市值过滤器 | 流通市值、总市值 |
| 61-80 | 技术基础过滤器 | 均线、KDJ基础状态 |
| 81-100 | 技术高级过滤器 | MACD、RSI等复合指标 |
| 101-120 | 策略特定过滤器 | 各策略特有逻辑 |
| 121-150 | 板块过滤器 | 行业、概念筛选 |
| 151-200 | 排序/限制过滤器 | TopN、排序截取 |

### 6.2 执行顺序示例

```
输入股票池 (5000只)
    │
    ▼
[Priority 10] RiskFilter - 剔除ST/停牌 (剩余 4800只)
    │
    ▼
[Priority 30] PriceFilter - 价格范围 (剩余 4500只)
    │
    ▼
[Priority 50] VolumeFilter - 成交额 (剩余 2000只)
    │
    ▼
[Priority 70] TechnicalFilter - 均线多头 (剩余 800只)
    │
    ▼
[Priority 90] KDJFilter - KDJ金叉 (剩余 300只)
    │
    ▼
[Priority 110] StrategyFilter - 策略特定 (剩余 100只)
    │
    ▼
[Priority 150] TopNFilter - 取Top 50
    │
    ▼
输出股票池 (50只)
```

---

## 七、动态过滤器调整

### 7.1 市场环境自适应

```python
class AdaptiveFilter:
    """自适应过滤器"""
    
    def __init__(self):
        self.market_condition = 'normal'
    
    def adjust_filters(self, market_data):
        """根据市场环境调整过滤器参数"""
        
        # 判断市场环境
        if market_data['index_change'] > 0.03:
            self.market_condition = 'bull'
        elif market_data['index_change'] < -0.03:
            self.market_condition = 'bear'
        else:
            self.market_condition = 'normal'
        
        # 调整过滤器参数
        if self.market_condition == 'bull':
            # 牛市：放宽条件，追求收益
            return {
                'min_amount': 3000000,  # 降低成交额要求
                'min_hsl': 0.005,       # 降低换手率要求
            }
        elif self.market_condition == 'bear':
            # 熊市：收紧条件，控制风险
            return {
                'min_amount': 10000000,  # 提高成交额要求
                'min_hsl': 0.02,         # 提高换手率要求
            }
        else:
            # 正常市场：标准条件
            return {
                'min_amount': 5000000,
                'min_hsl': 0.01,
            }
```

### 7.2 过滤器参数配置化

```yaml
# config/filters.yaml
filters:
  risk:
    enabled: true
    priority: 10
    params:
      exclude_st: true
      exclude_delisting: true
      exclude_suspended: true
  
  price:
    enabled: true
    priority: 30
    params:
      min_price: 2.0
      max_price: 500.0
  
  volume:
    enabled: true
    priority: 50
    params:
      min_amount: 5000000
      min_hsl: 0.01
  
  technical:
    enabled: true
    priority: 70
    params:
      ma_bull: true
      kdj_golden_cross: false
```

---

## 八、使用示例

### 8.1 基础使用

```python
from FQAlgorithm.Filters import FilterPipeline, RiskFilter, PriceFilter, VolumeFilter

# 创建过滤器管道
pipeline = FilterPipeline()

# 添加过滤器
pipeline.add_filter(RiskFilter(), priority=10)
pipeline.add_filter(PriceFilter(min_price=2.0, max_price=500.0), priority=30)
pipeline.add_filter(VolumeFilter(min_amount=5000000), priority=50)

# 执行过滤
filtered_data = pipeline.execute(stock_data)
print(f"过滤前: {len(stock_data)} 只, 过滤后: {len(filtered_data)} 只")
```

### 8.2 策略特定过滤

```python
# 强势股策略过滤器
def create_strong_filter():
    pipeline = FilterPipeline()
    
    # 基础过滤
    pipeline.add_filter(RiskFilter(), priority=10)
    pipeline.add_filter(PriceFilter(min_price=5.0), priority=30)
    pipeline.add_filter(VolumeFilter(min_amount=10000000), priority=50)
    
    # 策略特定过滤
    def strong_condition(data):
        return data[
            (data['close'] > data['MA5']) &
            (data['close'] > data['MA60']) &
            (data['HSL'] > 0.02)
        ]
    
    pipeline.add_filter(strong_condition, priority=100)
    return pipeline
```

---

## 九、审计发现

### 9.1 代码问题

| 问题 | 位置 | 严重程度 | 建议 |
|------|------|----------|------|
| 过滤器分散 | StrategyPools/ | P2 | 统一过滤器体系 |
| 缺少过滤器基类 | - | P2 | 创建 BaseFilter |
| 过滤器参数硬编码 | 各策略文件 | P2 | 配置化过滤器参数 |

### 9.2 文档问题

| 问题 | 状态 | 建议 |
|------|------|------|
| filter.md 内容不完整 | ✅ 已补充 | 本文档 |
| 过滤器优先级未文档化 | ✅ 已补充 | 添加优先级体系 |
| 动态调整机制未文档化 | ✅ 已补充 | 添加自适应逻辑 |

---

## 十、参考资料

- [FQMarket/StrategyPools/](file:///Users/A.D.189/FQuant/FQuant.Server/FQMarket/FQMarket/StrategyPools/) - 策略池实现
- [FQFactor/BaseFunction.py](file:///Users/A.D.189/FQuant/FQuant.Server/FQFactor/FQFactor/BaseFunction.py) - 基础函数
- [new-design.md](file:///Users/A.D.189/FQuant/FQuantDocument/docs/design/new-design.md) - 设计方案

---

*本文档基于代码审计结果生成，与代码实现保持一致*
