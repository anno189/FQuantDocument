# FQDataSource 架构重构最终方案

**状态**: 待 Review
**版本**: v1.0
**日期**: 2026-03-31

---

## 一、目标

将 `FQDataSource` 模块从**扁平化单文件结构**重构为**按数据源分类的模块化结构**，实现：

1. **职责分离** - 每个数据源独立管理
2. **代码复用** - 公共逻辑抽取到 core
3. **易于扩展** - 新增数据源只需新建文件夹
4. **可测试性** - 核心逻辑独立于适配器

---

## 二、目标结构

```
FQDataSource/
│
├── core/                              # 核心公共模块
│   ├── __init__.py
│   ├── base.py                        # DataSourceAdapter 基类
│   ├── registry.py                    # 数据源注册表
│   ├── facade.py                      # 统一入口
│   └── exceptions.py                   # 统一异常定义
│
├── adapters/                          # 适配器实现
│   │
│   ├── tdx/                           # 通达信适配器
│   │   ├── __init__.py
│   │   ├── base.py                    # TdxBaseAdapter
│   │   ├── ip_selector.py              # ⭐ IP 选择器（抽取）
│   │   ├── stock.py                   # 股票 (get_stock_day/min)
│   │   ├── index.py                   # 指数 (get_index_day/min)
│   │   ├── future.py                  # 期货 (get_future_day/min)
│   │   ├── hkstock.py                 # 港股 (get_hkstock_day/min)
│   │   ├── option.py                  # 期权
│   │   ├── realtime.py                # 实时行情
│   │   └── transaction.py             # 历史分笔
│   │
│   ├── akshare/                       # AkShare 适配器
│   │   ├── __init__.py
│   │   ├── base.py                    # AkShareBaseAdapter
│   │   ├── stock.py                   # 股票
│   │   ├── bond.py                    # 债券
│   │   ├── option.py                  # 期权
│   │   ├── macro.py                   # 宏观/汇率
│   │   └── realtime.py                # 实时
│   │
│   └── db/                            # 数据库适配器
│       ├── __init__.py
│       ├── base.py                    # DBBBaseAdapter
│       ├── mongo.py                   # MongoDB
│       └── redis.py                   # Redis 缓存
│
└── __init__.py                        # 统一导出
```

---

## 三、IP 选择器模块设计

### 3.1 位置

```
FQDataSource/adapters/tdx/ip_selector.py
```

### 3.2 功能

| 方法 | 功能 |
|------|------|
| `ping(ip, port, timeout)` | 测试服务器连通性 |
| `select_best_ip(ip_list)` | 从列表中选择最优服务器 |
| `get_mainmarket_ip()` | 获取主板最优 IP |
| `get_extensionmarket_ip()` | 获取扩展市场最优 IP |
| `get_all_ips()` | 获取所有 IP 并按延迟排序 |
| `refresh_ips()` | 刷新 IP 列表缓存 |

### 3.3 设计要点

```python
class TdxIPSelector:
    """通达信服务器 IP 选择器（单例）"""

    HQ_IP_LIST = [...]      # 主板 IP 列表
    EX_IP_LIST = [...]      # 扩展市场 IP 列表
    CACHE_DURATION = 86400  # 缓存 24 小时

    _cache = {}             # 内部缓存

    @classmethod
    def get_mainmarket_ip(cls, force_refresh=False) -> Tuple[str, int]:
        """获取主板市场最优 IP"""
        cache_key = "mainmarket"
        if not force_refresh and cache_key in cls._cache:
            return cls._cache[cache_key]

        ip, port = cls.select_best_ip(cls.HQ_IP_LIST)
        cls._cache[cache_key] = (ip, port)
        return ip, port

    @classmethod
    def get_extensionmarket_ip(cls, force_refresh=False) -> Tuple[str, int]:
        """获取扩展市场最优 IP"""
        ...

    @classmethod
    def select_best_ip(cls, ip_list: List[dict]) -> Tuple[str, int]:
        """并发测速，选择最优"""
        ...
```

### 3.4 依赖抽取的函数

| 原函数 (QATdx.py) | 新位置 | 功能 |
|-------------------|--------|------|
| `ping(ip, port)` | `ip_selector.ping()` | 连通性测试 |
| `select_best_ip(ip_list)` | `ip_selector.select_best_ip()` | 最优选择 |
| `get_ip_list_by_ping()` | `ip_selector.get_all_ips()` | 并发测速 |
| `get_mainmarket_ip()` | `ip_selector.get_mainmarket_ip()` | 主板 IP |
| `get_extensionmarket_ip()` | `ip_selector.get_extensionmarket_ip()` | 扩展市场 IP |
| `select_best_ip_list()` | `ip_selector.get_best_ip_list()` | 最优列表 |

---

## 四、适配器基类设计

### 4.1 DataSourceAdapter (core/base.py)

```python
class DataSourceAdapter(ABC):
    """数据源适配器基类"""

    def __init__(self, config: dict = None):
        self._config = config or {}
        self._connected = False

    @abstractmethod
    def connect(self) -> bool:
        """建立连接"""
        pass

    @abstractmethod
    def disconnect(self) -> None:
        """断开连接"""
        pass

    @abstractmethod
    def health_check(self) -> bool:
        """健康检查"""
        pass

    @property
    def name(self) -> str:
        """数据源名称"""
        return self.__class__.__name__

    def __enter__(self):
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.disconnect()
```

### 4.2 TdxBaseAdapter (adapters/tdx/base.py)

```python
class TdxBaseAdapter(DataSourceAdapter):
    """通达信适配器基类"""

    def __init__(self, config: dict = None):
        super().__init__(config)
        self._ip_selector = TdxIPSelector

    def _get_mainmarket_ip(self) -> Tuple[str, int]:
        return self._ip_selector.get_mainmarket_ip()

    def _get_extensionmarket_ip(self) -> Tuple[str, int]:
        return self._ip_selector.get_extensionmarket_ip()

    def connect(self) -> bool:
        ...

    def disconnect(self) -> None:
        ...

    def health_check(self) -> bool:
        ...
```

---

## 五、通达信函数迁移对照表

### 5.1 股票数据 → `adapters/tdx/stock.py`

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_stock_day` | `get_stock_day` | ✅ 已对齐 |
| `QA_fetch_get_stock_min` | `get_stock_min` | ✅ 已对齐 |
| `QA_fetch_get_stock_latest` | `get_stock_latest` | ❌ 待迁移 |
| `QA_fetch_get_stock_realtime` | `get_realtime` | ❌ 待迁移 |
| `QA_fetch_stock_liutonggubenZ` | 工具函数 | ❌ 待迁移 |

### 5.2 指数数据 → `adapters/tdx/index.py`

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_index_day` | `get_index_day` | ✅ 已对齐 |
| `QA_fetch_get_index_min` | `get_index_min` | ✅ 已对齐 |
| `QA_fetch_get_index_latest` | `get_index_latest` | ❌ 待迁移 |
| `QA_fetch_get_index_realtime` | `get_realtime` | ❌ 待迁移 |

### 5.3 期货数据 → `adapters/tdx/future.py`

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_future_day` | `get_future_day` | ✅ 已对齐 |
| `QA_fetch_get_future_min` | `get_future_min` | ✅ 已对齐 |
| `QA_fetch_get_future_transaction` | `get_transaction` | ❌ 待迁移 |
| `QA_fetch_get_future_realtime` | `get_realtime` | ❌ 待迁移 |
| `QA_fetch_get_future_list` | `get_list` | ❌ 待迁移 |

### 5.4 港股数据 → `adapters/tdx/hkstock.py`

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_hkstock_day` | `get_day` | ❌ 待迁移 |
| `QA_fetch_get_hkstock_min` | `get_min` | ❌ 待迁移 |
| `QA_fetch_get_hkstock_list` | `get_list` | ❌ 待迁移 |
| `QA_fetch_get_hkstock_realtime` | `get_realtime` | ❌ 待迁移 |
| `QA_fetch_get_hkindex_*` | `get_index_*` | ❌ 待迁移 |

### 5.5 期权数据 → `adapters/tdx/option.py`

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_option_list` | `get_list` | ❌ 待迁移 |
| `QA_fetch_get_option_50etf_*` | `get_50etf_*` | ❌ 待迁移 |
| `QA_fetch_get_commodity_option_*` | `get_commodity_*` | ❌ 待迁移 |

### 5.6 实时行情 → `adapters/tdx/realtime.py`

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_stock_realtime` | `get_stock` | ❌ 待迁移 |
| `QA_fetch_get_index_realtime` | `get_index` | ❌ 待迁移 |
| `QA_fetch_depth_market_data` | `get_depth` | ❌ 待迁移 |

### 5.7 历史分笔 → `adapters/tdx/transaction.py`

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_stock_transaction` | `get_stock` | ❌ 待迁移 |
| `QA_fetch_get_index_transaction` | `get_index` | ❌ 待迁移 |
| `QA_fetch_get_stock_transaction_realtime` | `get_stock_realtime` | ❌ 待迁移 |

### 5.8 扩展市场 → `adapters/tdx/extension.py`

| 源函数 | 目标方法 | 状态 |
|--------|----------|------|
| `QA_fetch_get_extensionmarket_count` | `get_count` | ❌ 待迁移 |
| `QA_fetch_get_extensionmarket_info` | `get_info` | ❌ 待迁移 |
| `QA_fetch_get_extensionmarket_list` | `get_list` | ❌ 待迁移 |
| `QA_fetch_get_stock_terminated` | `get_terminated` | ❌ 待迁移 |

---

## 六、迁移状态统计

| 类别 | 总数 | 已迁移 | 待迁移 | 完成率 |
|------|------|--------|--------|--------|
| 股票日线/分钟 | 5 | 2 | 3 | 40% |
| 指数日线/分钟 | 4 | 2 | 2 | 50% |
| 期货数据 | 5 | 2 | 3 | 40% |
| 港股数据 | 5+ | 0 | 5+ | 0% |
| 期权数据 | 10+ | 0 | 10+ | 0% |
| 实时行情 | 3 | 0 | 3 | 0% |
| 历史分笔 | 3 | 0 | 3 | 0% |
| 扩展市场 | 4 | 0 | 4 | 0% |
| **合计** | **40+** | **6** | **35+** | **~15%** |

---

## 七、实施计划

### 阶段一：基础设施重构

| 任务 | 优先级 | 工作内容 |
|------|--------|----------|
| 创建文件夹结构 | P0 | 创建 `core/`, `adapters/tdx/` 等 |
| 抽取 IP 选择器 | P0 | 创建 `ip_selector.py` |
| 重构 TdxBaseAdapter | P0 | 继承新的基类结构 |
| 迁移现有方法 | P0 | 将已对齐的 6 个函数迁移到新结构 |

### 阶段二：核心功能完善

| 任务 | 优先级 | 工作内容 |
|------|--------|----------|
| 实现实时行情 | P1 | `realtime.py` |
| 实现港股数据 | P1 | `hkstock.py` |
| 实现期货交易数据 | P1 | `future.py` 扩展 |

### 阶段三：扩展功能

| 任务 | 优先级 | 工作内容 |
|------|--------|----------|
| 实现期权数据 | P2 | `option.py` |
| 实现历史分笔 | P2 | `transaction.py` |
| 实现扩展市场 | P2 | `extension.py` |

### 阶段四：收尾

| 任务 | 优先级 | 工作内容 |
|------|--------|----------|
| 更新注册与导出 | P3 | 更新 `registry.py`, `__init__.py` |
| 更新门面入口 | P3 | 更新 `facade.py` |
| 删除旧文件 | P3 | 清理 `tdx_adapter.py` 等 |
| 文档更新 | P3 | 更新迁移文档 |

---

## 八、向后兼容

### 8.1 别名导出

```python
# FQDataSource/__init__.py

# 新结构
from .adapters.tdx.stock import TdxStockAdapter as TdxStockAdapter
from .adapters.tdx.index import TdxIndexAdapter
from .adapters.tdx.future import TdxFutureAdapter

# 向后兼容别名（deprecated）
TdxAdapter = TdxStockAdapter  # 警告：将在未来版本移除

__all__ = [
    'TdxStockAdapter',
    'TdxIndexAdapter',
    'TdxFutureAdapter',
    'TdxHKStockAdapter',  # 未来
    'TdxOptionAdapter',   # 未来
    # ... 其他
]
```

### 8.2 迁移提示

```python
# 旧用法（deprecated）
from FQDataSource import TdxAdapter
adapter = TdxAdapter()

# 新用法
from FQDataSource import TdxStockAdapter
adapter = TdxStockAdapter()
```

---

## 九、风险与注意事项

| 风险 | 缓解措施 |
|------|----------|
| 迁移过程中服务中断 | 保持旧文件直到新结构完全就绪 |
| IP 选择器单例问题 | 使用类变量而非实例变量 |
| 并发连接数限制 | TdxHq_API 内部已处理 |
| 实时数据重连 | 添加自动重连机制 |

---

## 十、验收标准

- [ ] 文件夹结构符合设计
- [ ] `TdxIPSelector` 正常工作
- [ ] 已对齐的 6 个函数在新结构下测试通过
- [ ] 向后兼容别名可用
- [ ] 单元测试覆盖核心逻辑
- [ ] 文档更新完成

---

**待审阅内容**：
1. 文件夹结构是否合理？
2. IP 选择器设计是否满足需求？
3. 函数分组是否正确？
4. 迁移优先级是否妥当？
5. 向后兼容方案是否足够？