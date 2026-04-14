# Local 适配器最佳实践

## 概述

本文档汇集了 Local 适配器的最佳实践建议，帮助开发者更高效、更稳定地使用该模块。

---

## 性能优化

### 1. 合理设置基础路径

**反例：** 不设置基础路径，每次使用绝对路径

```python
adapter = LocalAdapter()
df = adapter.read_csv("/data/stocks/600000.csv")
df = adapter.read_csv("/data/stocks/600036.csv")
```

**正例：** 设置基础路径，简化调用

```python
adapter = LocalAdapter(base_path="/data/stocks")
df = adapter.read_csv("600000.csv")
df = adapter.read_csv("600036.csv")
```

---

### 2. 批量操作优化

**反例：** 循环内单独读取

```python
codes = ['600000', '600036', '601318']
for code in codes:
    df = adapter.read_csv(f"/data/{code}.csv")  # 重复解析路径
```

**正例：** 使用 CSVReader 批量处理

```python
from FQData.DataSource.adapters.local import CSVReader

reader = CSVReader(base_path="/data")
for code in codes:
    df = reader.read(f"{code}.csv")
```

---

### 3. 日期解析优化

**反例：** 每次读取后手动转换日期

```python
df = adapter.read_csv("data.csv")
df['date'] = pd.to_datetime(df['date'])
```

**正例：** 使用内置日期解析

```python
df = reader.read_with_date_parse("data.csv")  # 自动解析日期列
```

---

## 数据处理

### 1. 读取后验证

```python
def read_and_validate(file_path, required_columns):
    df = adapter.read_csv(file_path)

    if df is None:
        return None

    missing = set(required_columns) - set(df.columns)
    if missing:
        logger.warning(f"Missing columns: {missing}")
        return None

    return df
```

---

### 2. 数据清洗

```python
def clean_kline_data(df):
    if df is None or df.empty:
        return df

    df = df.copy()

    numeric_cols = ['open', 'high', 'low', 'close', 'volume']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    df = df.dropna()

    return df
```

---

### 3. 增量读取

```python
def incremental_read(reader, file_path, last_date):
    df = reader.read_with_date_parse(file_path)

    if df is None or df.empty:
        return None

    df = df.sort_values('date')

    if last_date:
        last_dt = pd.to_datetime(last_date)
        df = df[df['date'] > last_dt]

    return df
```

---

## 错误处理

### 1. 防御性读取

```python
def safe_read(file_path, encoding='utf-8'):
    if not adapter.file_exists(file_path):
        logger.error(f"File not found: {file_path}")
        return None

    df = adapter.read_csv(file_path, encoding=encoding)

    if df is None:
        logger.error(f"Failed to read file: {file_path}")
        return None

    return df
```

---

### 2. 降级处理

```python
def read_with_fallback(file_path):
    encodings = ['utf-8', 'gbk', 'gb2312']

    for enc in encodings:
        df = adapter.read_csv(file_path, encoding=enc)
        if df is not None:
            logger.info(f"Successfully read with encoding: {enc}")
            return df

    logger.error(f"Failed to read file with all encodings: {file_path}")
    return None
```

---

### 3. 超时处理（大文件）

```python
import signal

class TimeoutError(Exception):
    pass

def read_with_timeout(file_path, timeout=30):
    def timeout_handler(signum, frame):
        raise TimeoutError("Read timeout")

    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(timeout)

    try:
        df = adapter.read_csv(file_path)
        return df
    finally:
        signal.alarm(0)
```

---

## 文件管理

### 1. 目录创建

```python
def ensure_dir(file_path):
    path = Path(file_path)
    path.parent.mkdir(parents=True, exist_ok=True)
```

---

### 2. 文件备份

```python
import shutil
from datetime import datetime

def backup_file(file_path):
    if not Path(file_path).exists():
        return False

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f"{file_path}.{timestamp}.bak"

    shutil.copy2(file_path, backup_path)
    return True
```

---

### 3. 文件锁定

```python
import fcntl

def write_with_lock(df, file_path):
    with open(file_path, 'a') as f:
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)
        try:
            df.to_csv(f, index=False)
        finally:
            fcntl.flock(f.fileno(), fcntl.LOCK_UN)
```

---

## 缓存策略

### 1. 内存缓存

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def read_cached(file_path):
    return adapter.read_csv(file_path)
```

---

### 2. 选择性缓存

```python
class CachingReader:
    def __init__(self, base_path, ttl=300):
        self.reader = CSVReader(base_path=base_path)
        self._cache = {}
        self._ttl = ttl

    def read(self, file_path):
        import time

        if file_path in self._cache:
            data, timestamp = self._cache[file_path]
            if time.time() - timestamp < self._ttl:
                return data

        data = self.reader.read(file_path)
        if data is not None:
            self._cache[file_path] = (data, time.time())

        return data
```

---

## 日志记录

### 1. 操作日志

```python
import structlog

logger = structlog.get_logger()

def logged_read(file_path):
    logger.info("reading_file", path=file_path)

    df = adapter.read_csv(file_path)

    if df is not None:
        logger.info("read_success", path=file_path, rows=len(df))
    else:
        logger.warning("read_failed", path=file_path)

    return df
```

---

### 2. 性能日志

```python
import time

def timed_read(file_path):
    start = time.time()

    df = adapter.read_csv(file_path)

    duration = time.time() - start
    logger.info(f"Read {file_path} in {duration:.3f}s, {len(df) if df is not None else 0} rows")

    return df
```

---

## 安全建议

### 1. 路径验证

```python
from pathlib import Path

def safe_read(base_path, user_path):
    base = Path(base_path).resolve()
    target = (base / user_path).resolve()

    if not str(target).startswith(str(base)):
        raise ValueError("Path traversal detected")

    return adapter.read_csv(target)
```

---

### 2. 文件类型检查

```python
def validate_csv(file_path):
    if not file_path.endswith('.csv'):
        logger.warning(f"Non-CSV file: {file_path}")
        return False

    if not adapter.file_exists(file_path):
        return False

    info = reader.get_info(file_path)
    if info['size_bytes'] > 100 * 1024 * 1024:  # 100MB
        logger.warning(f"Large file: {file_path}")

    return True
```

---

## 生产环境建议

### 1. 监控

```python
from prometheus_client import Counter, Histogram

csv_reads = Counter('csv_reads_total', 'CSV read operations', ['status'])
csv_read_duration = Histogram('csv_read_duration_seconds', 'CSV read duration')
csv_rows = Histogram('csv_rows_read', 'CSV rows read', buckets=[100, 1000, 10000, 100000])

def monitored_read(file_path):
    start = time.time()
    try:
        df = adapter.read_csv(file_path)
        csv_reads.labels(status='success').inc()
        if df is not None:
            csv_rows.observe(len(df))
        return df
    except Exception as e:
        csv_reads.labels(status='error').inc()
        raise
    finally:
        csv_read_duration.observe(time.time() - start)
```

---

### 2. 健康检查

```python
def health_check():
    try:
        adapter.health_check()

        test_file = adapter.list_files("*.csv")
        if test_file is not None:
            return True
    except Exception as e:
        logger.error(f"Health check failed: {e}")

    return False
```

---

## 测试建议

### 1. Mock 文件系统

```python
from unittest.mock import patch, MagicMock

def test_read_csv():
    with patch('pathlib.Path.exists', return_value=True):
        with patch('pandas.read_csv', return_value=pd.DataFrame({'a': [1, 2, 3]})):
            df = adapter.read_csv("test.csv")
            assert df is not None
            assert len(df) == 3
```

---

### 2. 测试数据生成

```python
import pytest

@pytest.fixture
def sample_csv(tmp_path):
    df = pd.DataFrame({
        'date': pd.date_range('2024-01-01', periods=10),
        'open': np.random.rand(10) * 100,
        'close': np.random.rand(10) * 100,
    })

    file_path = tmp_path / "test.csv"
    df.to_csv(file_path, index=False)

    return file_path

def test_read(sample_csv):
    df = adapter.read_csv(sample_csv)
    assert len(df) == 10
```

---

## 相关文档

- [Local README](README.md)
- [Local 框架文档](framework.md)
- [Local 架构说明](architecture.md)
- [Local 设计文档](design.md)
- [Local API 参考](api.md)
- [Local 使用指南](usage.md)
- [Local FAQ](faq.md)
- [Local 更新日志](changelog.md)
- [DataSource 模块](../README.md)
- [DataSource API](../api.md)
- [适配器索引](./README.md)
