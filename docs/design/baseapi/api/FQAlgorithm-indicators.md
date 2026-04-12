# FQAlgorithm 指标计算模块 API 设计文档

## 模块概述

**路径**: `FQBase/FQAlgorithm/Indicators/calculator.py`
**功能**: 提供统一的指标计算接口，包含0级核心函数、1级应用函数、2级技术指标
**架构**: 面向对象 (IndicatorCalculator类) + 函数式双入口

---

## 一、架构设计

### 1.1 类结构

```python
class IndicatorCalculator:
    """指标计算器"""
    def calculate(self, name: str, data, **kwargs) -> Any
    def calculate_multi(self, names: List[str], data, **kwargs) -> Dict[str, Any]
    def list_indicators(self, category: Optional[str] = None) -> Dict
    def get_indicator_info(self, name: str) -> Optional[Dict]
```

### 1.2 函数分类

| 级别 | 数量 | 说明 |
|------|------|------|
| **0级：核心工具函数** | 28 | 底层数学/统计运算 |
| **1级：应用层函数** | 30 | 通过0级函数组合实现 |
| **2级：技术指标函数** | 19 | 经典技术分析指标 |

---

## 二、0级核心工具函数

### 2.1 数学运算

| 函数 | 签名 | 说明 |
|------|------|------|
| `IF` | `(condition, true_val, false_val)` | 序列布尔判断 |
| `RD` | `(N, D=4)` | 四舍五入取D位小数 |
| `RET` | `(S, N=1)` | 返回序列倒数第N个值 |
| `ABS` | `(S)` | 绝对值 |
| `POW` | `(S, N)` | 求S的N次方 |
| `SQRT` | `(S)` | 平方根 |
| `MAX` | `(S1, S2)` | 序列max |
| `MIN` | `(S1, S2)` | 序列min |
| `numpy_round` | `(arr, decimals=2)` | 四舍六入五成双 |

### 2.2 序列运算

| 函数 | 签名 | 说明 |
|------|------|------|
| `REF` | `(values, n)` | N日前的值 |
| `REF_STR` | `(Series, N)` | N日前的字符串值 |
| `DIFF` | `(Series, N=1)` | 差分 |
| `STD` | `(Series, N)` | 标准差 (通达信) |
| `SUM` | `(S, N=0)` | N天累计和 |
| `CONST` | `(Series, N)` | 常量填充 |
| `HHV` | `(values, n)` | N日内最高值 |
| `LLV` | `(values, n)` | N日内最低值 |
| `HHVBARS` | `(Series, N)` | N日内最高值位置 |
| `LLVBARS` | `(Series, N)` | N日内最低值位置 |
| `SUMBARS` | `(X, A)` | 累加达到A的周期数 |

### 2.3 移动平均

| 函数 | 签名 | 说明 |
|------|------|------|
| `MA` | `(Series, N)` | 简单移动平均 |
| `EMA` | `(Series, N)` | 指数移动平均 |
| `SMA` | `(values, n, m)` | 中国式SMA |
| `WMA` | `(S, N)` | 加权移动平均 |
| `DMA` | `(S, A)` | 动态移动平均 |

### 2.4 线性回归

| 函数 | 签名 | 说明 |
|------|------|------|
| `SLOPE` | `(S, N)` | N周期线性回归斜率 |
| `FORCAST` | `(S, N)` | N周期线性回归预测 |
| `AVEDEV` | `(Series, N)` | 平均绝对偏差 |

### 2.5 辅助函数

| 函数 | 签名 | 说明 |
|------|------|------|
| `FILPLINEUP` | `(S)` | 线翻转向上 |
| `FILPLINEDOWN` | `(S)` | 线翻转向下 |
| `UPLINE` | `(S, M)` | 上穿横线 |
| `DOWNLINE` | `(S, M)` | 下穿横线 |
| `LAST` | `(S, A, B)` | 条件持续 |
| `ANGLELSeries` | `(Series)` | 计算角度 |

---

## 三、1级应用层函数

### 3.1 条件统计

| 函数 | 签名 | 说明 |
|------|------|------|
| `COUNT` | `(COND, N)` | 统计N天内满足条件的次数 |
| `EVERY` | `(S, N)` | 最近N天是否都是True |
| `EXIST` | `(S, N)` | N日内是否存在满足条件的日 |
| `FILTER` | `(BUY, N)` | 过滤连续出现的信号 |
| `TFILTER` | `(A, B, N)` | 交易信号过滤 |

### 3.2 周期计算

| 函数 | 签名 | 说明 |
|------|------|------|
| `BARSLAST` | `(COND)` | 上一次条件成立到当前的周期数 |
| `BARSLASTCOUNT` | `(COND)` | 统计连续满足条件的周期数 |
| `BARSSINCE` | `(Series)` | 第一个条件成立到当前的周期数 |
| `BARSSINCEN` | `(S, N)` | N周期内第一次S条件成立到现在 |
| `ISLASTBAR` | `(Series)` | 判断是否为最后一个周期 |
| `CURRBARSCOUNT` | `(Series)` | 当前周期数 |
| `BARSPOSITIVESUM` | `(Series)` | 正数的合计 |

### 3.3 交叉判断

| 函数 | 签名 | 说明 |
|------|------|------|
| `CROSS` | `(series1, series2)` | 金叉死叉信号 |
| `CROSSUP` | `(A, B)` | 上穿 |
| `CROSSDOWN` | `(A, B)` | 下穿 |
| `LONGCROSS` | `(S1, S2, N)` | 维持N周期后交叉 |
| `VALUEWHEN` | `(S, X)` | 条件成立时取X值 |

### 3.4 区间判断

| 函数 | 签名 | 说明 |
|------|------|------|
| `BETWEEN` | `(Series, L, R)` | A处于L和R之间 |
| `RANGE` | `(Series, L, R)` | A在B和C范围之间 |
| `TOPRANGE` | `(S)` | 当前最高是近多少周期内最高 |
| `LOWRANGE` | `(S)` | 当前最低是近多少周期内最低 |

### 3.5 信号处理

| 函数 | 签名 | 说明 |
|------|------|------|
| `BACKSET` | `(COND, N)` | 将当前位置到N周期前设为1 |
| `MAXROLL` | `(Series, N=0)` | 滚动最大值 |
| `MINROLL` | `(Series, N=0)` | 滚动最小值 |

### 3.6 百分位统计

| 函数 | 签名 | 说明 |
|------|------|------|
| `Percentile` | `(Series)` | 百分位数 |
| `PercentileSeries` | `(Series, N)` | 滚动百分位 |

### 3.7 绘图辅助

| 函数 | 签名 | 说明 |
|------|------|------|
| `DValue` | `(SeriesClose, SeriesValues)` | 计算差值 |
| `ZIG` | `(k, x=0.003, type=0)` | 之字转向 |
| `PLOYLINE` | - | 折线 (未实现) |
| `DRAWLINE` | - | 画直线 (未实现) |

### 3.8 数据转换

| 函数 | 签名 | 说明 |
|------|------|------|
| `INTPART` | `(Series)` | 取整 |

---

## 四、2级技术指标函数

### 4.1 趋势类指标

| 函数 | 签名 | 返回值 | 说明 |
|------|------|--------|------|
| `MACD` | `(CLOSE, SHORT=12, LONG=26, M=9)` | `(DIF, DEA, MACD)` | MACD指标 |
| `KDJ` | `(CLOSE, HIGH, LOW, N=9, M1=3, M2=3)` | `(K, D, J)` | KDJ指标 |
| `RSI` | `(CLOSE, N=24)` | `RSI` | RSI指标 |
| `DMI` | `(CLOSE, HIGH, LOW, M1=14, M2=6)` | `(PDI, MDI, ADX, ADXR)` | 动向指标 |
| `TRIX` | `(CLOSE, M1=12, M2=20)` | `(TRIX, TRMA)` | 三重指数平滑平均线 |
| `MTM` | `(CLOSE, N=12, M=6)` | `(MTM, MTMMA)` | 动量指标 |
| `ROC` | `(CLOSE, N=12, M=6)` | `(ROC, MAROC)` | 变动率指标 |

### 4.2 波动类指标

| 函数 | 签名 | 返回值 | 说明 |
|------|------|--------|------|
| `BOLL` | `(CLOSE, N=20, P=2)` | `(UPPER, MID, LOWER)` | 布林带 |
| `ATR` | `(CLOSE, HIGH, LOW, N=20)` | `ATR` | 真实波动 |
| `CCI` | `(CLOSE, HIGH, LOW, N=14)` | `CCI` | CCI指标 |
| `EMV` | `(HIGH, LOW, VOL, N=14, M=9)` | `(EMV, MAEMV)` | 简易波动指标 |
| `DPO` | `(CLOSE, M1=20, M2=10, M3=6)` | `(DPO, MADPO)` | 区间震荡线 |

### 4.3 超买超卖类指标

| 函数 | 签名 | 返回值 | 说明 |
|------|------|--------|------|
| `WR` | `(CLOSE, HIGH, LOW, N=10, N1=6)` | `(WR, WR1)` | 威廉指标 |
| `BIAS` | `(CLOSE, L1=6, L2=12, L3=24)` | `(BIAS1, BIAS2, BIAS3)` | 乖离率 |

### 4.4 成交量类指标

| 函数 | 签名 | 返回值 | 说明 |
|------|------|--------|------|
| `VR` | `(CLOSE, VOL, M1=26)` | `VR` | 容量比率 |
| `OBV` | `(CLOSE, VOL)` | `OBV` | 能量潮指标 |
| `MFI` | `(CLOSE, HIGH, LOW, VOL, N=14)` | `MFI` | 资金流量指标 |

### 4.5 通道类指标

| 函数 | 签名 | 返回值 | 说明 |
|------|------|--------|------|
| `BBI` | `(CLOSE, M1=3, M2=6, M3=12, M4=20)` | `BBI` | 多空指标 |
| `TAQ` | `(HIGH, LOW, N)` | `(UP, MID, DOWN)` | 唐安奇通道 |
| `KTN` | `(CLOSE, HIGH, LOW, N=20, M=10)` | `(UPPER, MID, LOWER)` | 肯特纳交易通道 |

### 4.6 其他指标

| 函数 | 签名 | 返回值 | 说明 |
|------|------|--------|------|
| `MASS` | `(HIGH, LOW, N1=9, N2=25, M=6)` | `(MASS, MA_MASS)` | 梅斯线 |

---

## 五、使用示例

### 5.1 直接函数调用

```python
from FQBase.FQAlgorithm.Indicators.calculator import MA, EMA, MACD

close = get_close_data()
ma5 = MA(close, 5)
ma10 = MA(close, 10)
dif, dea, macd = MACD(close)
```

### 5.2 通过 IndicatorCalculator

```python
from FQBase.FQAlgorithm.Indicators import IndicatorCalculator

calc = IndicatorCalculator()

dif, dea, macd = calc.calculate('MACD', close)
results = calc.calculate_multi(['MA', 'EMA', 'KDJ'], data)
```

### 5.3 计算周期指标

```python
from FQBase.FQAlgorithm.Indicators.calculator import CROSS, HHV, LLV

# 金叉买入信号
signal = CROSS(MA(close, 5), MA(close, 10))

# 最近20天最高价
hhv_20 = HHV(close, 20)

# 最近20天最低价
llv_20 = LLV(close, 20)
```

---

## 六、依赖关系

```
                    ┌─────────────────┐
                    │   IndicatorCalculator   │
                    │      (Facade)     │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   0级核心函数   │  │   1级应用函数   │  │   2级技术指标   │
│   (28个)     │  │   (30个)     │  │   (19个)     │
└───────────────┘  └───────────────┘  └───────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  numpy, pandas  │
                    └─────────────────┘
```

---

## 七、命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 类 | PascalCase | `IndicatorCalculator` |
| 函数 | PascalCase | `MA`, `MACD`, `KDJ` |
| 参数 | camelCase | `closePrice`, `high`, `low` |

---

## 八、扩展指南

### 8.1 添加新指标

```python
def MY_INDICATOR(CLOSE: np.ndarray, N: int = 20) -> np.ndarray:
    """自定义指标"""
    return MA(CLOSE, N) * 2 - STD(CLOSE, N)
```

### 8.2 注册到 IndicatorRegistry

```python
from FQBase.FQAlgorithm.Indicators.registry import IndicatorRegistry

registry = IndicatorRegistry.get_instance()
registry.register('MY_INDICATOR', MY_INDICATOR, category='custom')
```

---

## 九、文件位置

| 文件 | 说明 |
|------|------|
| `FQBase/FQAlgorithm/Indicators/calculator.py` | 指标计算函数 |
| `FQBase/FQAlgorithm/Indicators/__init__.py` | 模块导出 |
| `FQBase/FQAlgorithm/Indicators/registry.py` | 注册表 |
| `FQBase/FQAlgorithm/Indicators/base.py` | 基类定义 |
