# network 子模块

网络工具模块，提供 URL 可访问性检查和延迟测量功能。

## 模块路径

`FQBase.Util.network`

## 函数列表

| 函数 | 说明 |
|------|------|
| `web_ping` | ping URL 获取延迟（毫秒） |
| `check_url_accessible` | 检查 URL 是否可访问 |

## 快速开始

### ping 检测

```python
from FQBase.Util import web_ping

latency = web_ping("localhost", count=1)
print(latency)  # 返回延迟毫秒数，失败返回 None
```

### URL 可访问性检查

```python
from FQBase.Util import check_url_accessible

if check_url_accessible("http://localhost:8080"):
    print("URL 可访问")
else:
    print("URL 不可访问")
```

## API 参考

### web_ping

```python
def web_ping(url: str, count: int = 1) -> Optional[int]
```

ping URL 获取延迟。

**参数**：
- `url`: URL 地址（仅支持主机名或 IP，不支持 URL 路径）
- `count`: ping 次数，默认 1

**返回**：延迟毫秒数，失败返回 None

**安全说明**：
- 使用正则过滤移除危险字符
- 使用 `shell=False` 防止命令注入
- 仅接受有效的主机名或 IP 地址字符（字母、数字、点、连字符、冒号）

### check_url_accessible

```python
def check_url_accessible(url: str, timeout: int = 5) -> bool
```

检查 URL 是否可访问。

**参数**：
- `url`: URL 地址
- `timeout`: 超时秒数，默认 5

**返回**：是否可访问

**说明**：使用 `urllib.request`，无命令注入风险

## 相关文档

| 文档 | 说明 |
|------|------|
| [README](../README.md) | 模块首页 |
| [codec.md](codec.md) | 股票代码转换 |
| [file.md](file.md) | 文件操作 |
| [parallel.md](parallel.md) | 并行计算 |
| [bar.md](bar.md) | 时间索引 |
| [converters.md](converters.md) | 数据转换 |
| [transformer.md](transformer.md) | 格式转换 |