# TDX 适配器设计文档

## 概述

本文档记录 TDX 适配器的核心设计决策，包括架构选择、模式应用、接口设计和性能考量。

---

## 设计目标

| 目标 | 说明 |
|------|------|
| **高可用性** | 通过 IP 切换和重试机制保证服务连续性 |
| **高性能** | 连接复用、IP 缓存、数据缓存减少网络开销 |
| **易扩展** | 清晰的适配器层次便于新增数据类型 |
| **线程安全** | 支持多线程并发访问 |
| **容错处理** | 完善的异常体系和降级策略 |

---

## 核心设计模式

### 1. 适配器模式 (Adapter Pattern)

```
DataSourceAdapter (抽象接口)
    │
    ├── TdxBaseAdapter (实现通用逻辑)
    │       │
    │       ├── TdxStockAdapter
    │       ├── TdxIndexAdapter
    │       └── ...
    │
    ├── AkShareAdapter
    └── EastMoneyAdapter
```

**设计理由：**

- 统一的数据获取接口，上层应用无需关心数据来源
- 便于数据源切换（TDX ↔ AkShare ↔ EastMoney）
- 新增数据源只需实现抽象方法

### 2. 单例模式 (Singleton Pattern)

**应用场景：**

| 组件 | 说明 |
|------|------|
| `TdxConnectionPool` | 全局唯一连接池，避免资源耗尽 |
| `TdxIPSelector` | 全局唯一 IP 选择器，共享最优 IP 缓存 |

**实现方式：**

```python
class TdxConnectionPool:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
```

### 3. 上下文管理器模式 (Context Manager Pattern)

连接获取/归还自动化：

```python
with self._hq_connection() as api:
    data = api.get_security_bars(...)
# 自动归还连接，无需手动处理
```

**优势：**

- 异常安全，连接总能被正确归还
- 代码简洁，避免忘记释放连接
- 资源管理清晰

### 4. 模板方法模式 (Template Method Pattern)

基类定义算法骨架，具体实现由子类完成：

```python
class TdxBaseAdapter:
    def get_stock_day(self, code, start, end, frequence):
        # 通用逻辑：验证、转换、异常处理
        # ...
        # 调用抽象方法获取数据
        return self._fetch_data(...)

    def _fetch_data(self, ...):  # 子类实现
        raise NotImplementedError
```

### 5. 装饰器模式 (Decorator Pattern)

使用 `@retry` 装饰器为方法自动添加重试能力：

```python
@retry(stop_max_attempt_number=3, wait_random_min=50, wait_random_max=100)
def get_stock_day(self, code, start, end, frequence):
    ...
```

**优势：**

- 业务逻辑与重试逻辑分离
- 可灵活配置重试参数
- 统一的重试行为

---

## 接口设计

### 抽象基类接口

```python
class DataSourceAdapter(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        """数据源名称"""
        pass

    @property
    @abstractmethod
    def is_connected(self) -> bool:
        """是否已连接"""
        pass

    @abstractmethod
    def health_check(self) -> bool:
        """健康检查"""
        pass

    @abstractmethod
    def disconnect(self) -> None:
        """断开连接"""
        pass
```

### 具体适配器接口

```python
class TdxStockAdapter(TdxBaseAdapter):
    def get_stock_list(self, type_: str = 'stock') -> pd.DataFrame:
        """获取股票列表"""

    def get_stock_day(self, code, start, end, frequence='day') -> pd.DataFrame:
        """获取股票日线"""

    def get_stock_min(self, code, start, end, frequence='1min') -> pd.DataFrame:
        """获取股票分钟线"""

    def get_stock_info(self, code: str) -> pd.DataFrame:
        """获取股票基本信息"""

    def get_stock_xdxr(self, code: str) -> pd.DataFrame:
        """获取除权除息信息"""
```

### 返回值规范

| 数据类型 | 返回格式 | 说明 |
|----------|----------|------|
| 列表数据 | `pd.DataFrame` | 统一使用 DataFrame |
| 单条数据 | `pd.DataFrame` | 单行 DataFrame |
| 无数据 | `None` | 未找到数据时返回 |
| 错误 | 抛出异常 | 使用统一的异常类 |

### DataFrame 字段规范

| 数据类型 | 必有字段 |
|----------|----------|
| K 线数据 | `date`, `open`, `high`, `low`, `close`, `volume`, `amount` |
| 列表数据 | `code`, `name`, `sse` |
| 实时行情 | `code`, `name`, `price`, `volume`, `bid`, `ask` |

---

## 连接管理设计

### 双连接池架构

```
TdxConnectionPool
    │
    ├── _hq_pool (Queue)
    │       └── TdxHq_API 实例
    │           用于：股票、指数、债券、实时行情
    │
    └── _ex_pool (Queue)
            └── TdxExHq_API 实例
                用于：期货、期权、港股、扩展市场
```

**设计理由：**

- HQ 和 EX-HQ 使用不同的网络协议
- 避免混用导致的连接问题
- 便于分别控制连接数

### 连接获取策略

```
1. 尝试从池中获取 (非阻塞)
       │
       ▼
2. 池空 → 检查是否达到上限
       │
       ├── 未达上限 → 创建新连接
       │
       └── 达到上限 → 返回 None / 等待
```

### 连接归还策略

```
操作完成（正常/异常）
       │
       ▼
finally 块执行
       │
       ├── 正常 → 放回池中
       │
       └── 异常 → 断开连接（不归还）
                   原因：异常可能表示连接已损坏
```

---

## IP 选择策略

### 测速流程

```
1. 获取所有候选 IP 列表
2. 并行测速（多进程）
3. 按响应时间排序
4. 选择最优 IP
5. 缓存结果
```

### IP 类型

| 类型 | 说明 | 端口 |
|------|------|------|
| 主板市场 | 股票、指数、债券 | 7709 |
| 扩展市场 | 期货、期权、港股 | 7709 |

### 缓存机制

| 缓存项 | TTL | 说明 |
|--------|-----|------|
| IP 列表 | 86400s | 测速结果缓存 |
| 最优 IP | 进程生命周期 | 内存缓存 |

### 容错设计

```python
# 支持配置排除列表
exclude_ip = SETTING.get_config(
    section='IPLIST',
    option='exclude',
    default_value=[]
)

# 支持配置默认 IP（优先使用）
default_ip = SETTING.get_config(
    section='IPLIST',
    option='default',
    default_value={'stock': None, 'future': None}
)
```

---

## 数据获取策略

### 分段请求

单次请求限制（通达信协议）：

| 数据类型 | 单次最大条数 |
|----------|-------------|
| K 线数据 | 800 条 |
| 证券列表 | 1000 条 |

**分段实现：**

```python
lens = util_get_trade_gap(start_date, end_date)
data = pd.concat([
    api.get_security_bars(category, market, code, offset, 800)
    for offset in range(0, lens, 800)
], axis=0)
```

### 日期范围计算

```python
start_date = str(start)[0:10]  # 截取日期部分
today = datetime.now().date()
lens = util_get_trade_gap(start_date, str(today))
```

### 数据清洗

```python
# 去除无效数据
data = data[data['open'] != 0]

# 数值精度处理
for col in data.columns:
    if pd.api.types.is_numeric_dtype(data[col]):
        data[col] = data[col].round(6)
```

---

## 错误处理设计

### 异常层次

```
DataSourceError
    ├── DataSourceConnectionError
    │       ├── 连接超时
    │       ├── 连接拒绝
    │       └── 网络不可达
    │
    ├── DataNotFoundError
    │       ├── 代码不存在
    │       ├── 日期范围无数据
    │       └── 市场不支持
    │
    └── DataSourceAPIError
            ├── API 调用失败
            ├── 数据解析失败
            └── 协议错误
```

### 错误码规范

| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| `TDX_NOT_CONNECTED` | 未连接 | 检查网络 |
| `TDX_NO_IP` | 无法获取 IP | 检查配置 |
| `EMPTY_CODE` | 代码为空 | 检查输入 |
| `INVALID_CODE` | 代码格式错误 | 检查代码 |
| `TDX_TIMEOUT` | 请求超时 | 重试 |
| `TDX_SERVER_ERROR` | 服务器错误 | 切换 IP |

---

## 性能优化设计

### 1. 连接复用

```
场景：短时间内多次请求
结果：复用同一连接，避免重复建立 TCP 连接

预估节省：每次连接建立约 50-100ms
```

### 2. IP 缓存

```
场景：服务长时间运行
结果：避免每次请求都测速

预估节省：每次测速约 500-1000ms（多 IP 测速）
```

### 3. 并行测速

```python
from FQBase.Util.parallel import ParallelProcess

ps = ParallelProcess()
ps.run(_ping_ip, ips)  # 多进程并行
results = list(ps.get_results())
```

### 4. 数据类型优化

```python
# 使用合适的数据类型减少内存
data['volume'] = data['volume'].astype('int64')
data['amount'] = data['amount'].astype('float64')
```

---

## 可测试性设计

### 依赖注入

```python
class TdxBaseAdapter:
    def __init__(self, name: str = "tdx", timeout: float = None):
        self._ip_selector = TdxIPSelector()  # 可替换
        self._timeout = timeout
```

### Mock 能力

```python
# 测试时可以使用 Mock IP Selector
class MockIPSelector:
    def select_best_ip(self):
        return {'ip': '127.0.0.1', 'port': 7709}
```

---

## 版本演进

### v1.0 (初始版本)

- 基于 pytdx 封装
- 支持股票日线、分钟线
- 同步阻塞设计

### v2.0 (架构优化)

- 引入连接池
- 引入 IP 选择器
- 添加重试机制
- 支持期货、期权数据

### v3.0 (增强版)

- 优化数据处理性能
- 增加健康检查机制
- 支持更多数据源
- 完善错误处理

---

## 设计权衡

### 1. 单例 vs 工厂

**选择单例：** 连接池必须全局唯一，避免资源竞争

**代价：** 测试难度增加，需使用依赖注入框架

### 2. 同步 vs 异步

**选择同步：** 金融数据要求严格顺序，避免数据不一致

**代价：** 高并发场景性能受限

### 3. 重试 vs 熔断

**选择重试：** 网络抖动是暂时性问题，重试可解决

**未采用熔断：** 实现复杂，当前规模暂不需要

---

## 相关文档

- [TDX README](README.md)
- [TDX 架构说明](architecture.md)
- [TDX 框架文档](framework.md)
- [TDX API 参考](api.md)
- [TDX 使用指南](usage.md)
- [TDX 最佳实践](best-practices.md)
- [TDX 开发指南](development.md)
- [TDX FAQ](faq.md)
- [TDX 更新日志](changelog.md)
- [TDX 配置说明](config.md)
- [TDX 连接池与健康检查](connection_pool.md)
