# 数据处理规范

本文档介绍因子函数中的数据处理规范。

## 1. 数据格式

### 1.1 输入格式

因子函数接受两种输入格式：

| 格式 | 类型 | 说明 |
|------|------|------|
| DataFrame | `pd.DataFrame` | 包含OHLCV列的数据框 |
| Array | `np.ndarray` | 纯价格数组 |

### 1.2 DataFrame 格式

```python
# 标准列名（小写）
data.columns = ['date', 'open', 'high', 'low', 'close', 'volume']

# 或大写
data.columns = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume']
```

### 1.3 Array 格式

```python
# 一维数组视为收盘价
close = np.array([10.0, 10.5, 11.0, 10.8, 11.2])
```

## 2. 数据提取函数

### 2.1 _validate_data

提取收盘价数据：

```python
def _validate_data(data: Union[pd.DataFrame, np.ndarray]) -> np.ndarray:
    """验证并提取价格数据"""
    if isinstance(data, pd.DataFrame):
        if "close" in data.columns:
            return data["close"].values
        return data.iloc[:, 0].values  # 默认取第一列
    return np.asarray(data)
```

### 2.2 _get_ohlcv

提取完整OHLCV数据：

```python
def _get_ohlcv(data: Union[pd.DataFrame, dict]) -> dict:
    """获取OHLCV数据"""
    if isinstance(data, pd.DataFrame):
        return {
            "open": data.get("open", data.get("Open", pd.Series([0])["Open"])).values,
            "high": data.get("high", data.get("High", pd.Series([0])["High"])).values,
            "low": data.get("low", data.get("Low", pd.Series([0])["Low"])).values,
            "close": data.get("close", data.get("Close", pd.Series([0])["Close"])).values,
            "volume": data.get("volume", data.get("Volume", pd.Series([0])["Volume"])).values,
        }
    return data
```

## 3. 指标数据需求

### 3.1 纯价格指标

只需收盘价：

| 指标 | 说明 |
|------|------|
| MA | 移动平均 |
| EMA | 指数移动平均 |
| RSI | 相对强弱指标 |
| ROC | 变动率指标 |

### 3.2 需要OHLCV的指标

需要完整OHLCV：

| 指标 | 说明 |
|------|------|
| ATR | 真实波动幅度 |
| KDJ | 随机指标 |
| WR | 威廉指标 |
| CCI | 顺势指标 |
| BOLL | 布林带 |

### 3.3 需要成交量的指标

| 指标 | 说明 |
|------|------|
| OBV | 能量潮 |
| VR | 虚拟成交量比率 |
| MFI | 资金流量指标 |
| EMV | 简易波动指标 |

## 4. 数据验证

### 4.1 类型检查

```python
def validate_input(data):
    if not isinstance(data, (pd.DataFrame, np.ndarray)):
        raise TypeError("data must be DataFrame or ndarray")

    if isinstance(data, np.ndarray):
        if data.ndim != 1:
            raise ValueError("array must be 1-dimensional")
```

### 4.2 长度检查

```python
def validate_length(data, min_period=1):
    length = len(data)
    if length < min_period:
        raise ValueError(f"data length {length} < minimum {min_period}")
```

### 4.3 NaN处理

```python
# 检测NaN
has_nan = np.any(np.isnan(data))

# 填充NaN
data = np.nan_to_num(data, nan=0.0)

# 或使用pandas填充
series = pd.Series(data).fillna(method='ffill')
```

## 5. 常见模式

### 5.1 滚动窗口计算

```python
# 简单滚动平均
result = pd.Series(close).rolling(window=n, min_periods=1).mean()

# 滚动标准差
result = pd.Series(close).rolling(window=n).std()

# 滚动最大最小值
high_max = pd.Series(high).rolling(window=n).max()
low_min = pd.Series(low).rolling(window=n).min()
```

### 5.2 指数加权

```python
# 指数移动平均
ema = pd.Series(close).ewm(span=n, min_periods=1, adjust=False).mean()

# 指定alpha
alpha = 0.1
ema = pd.Series(close).ewm(alpha=alpha).mean()
```

### 5.3 差分与移位

```python
# N日前的值
ref = np.roll(data, n)
ref[:n] = data[0]  # 填充头部

# 差分
diff = np.diff(data, n=1)
diff = np.insert(diff, 0, 0)  # 补齐长度
```

## 6. 性能优化

### 6.1 避免循环

```python
# 推荐：向量化操作
result = pd.Series(close).rolling(20).mean()

# 不推荐：循环
result = np.zeros(len(close))
for i in range(20, len(close)):
    result[i] = np.mean(close[i-20:i])
```

### 6.2 使用内置函数

```python
# 推荐：使用numpy/pandas内置
result = np.maximum(arr1, arr2)
result = pd.Series(arr).rolling(10).sum()

# 不推荐：自定义循环
```

### 6.3 内存考虑

```python
# 避免创建中间变量
result = (pd.Series(close).ewm(span=12).mean() - pd.Series(close).ewm(span=26).mean())

# 而不是
ema12 = pd.Series(close).ewm(span=12).mean()
ema26 = pd.Series(close).ewm(span=26).mean()
diff = ema12 - ema26  # 多创建一个数组
```
