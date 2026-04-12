# FQConfig.paths - 路径配置

> 版本: v2.0
> 更新时间: 2026-03-26

---

## 一、模块概述

`FQConfig.paths` 提供系统路径配置功能，包括：
- FQData 主目录路径
- 各子目录路径（setting, cache, log, download, strategy, bin）
- 动态日期计算（交易日判断）
- 当前时间属性（TODAY, DAY, NOW）

**迁移状态**: ✅ 已完成从 `FQData.QASetting.QALocalize` 的迁移

---

## 二、导入方式

```python
# 使用大写常量
from FQBase.FQConfig.paths import FQDATA_PATH, SETTING_PATH, CACHE_PATH, LOG_PATH

# 或通过 FQConfig 访问
from FQBase.FQConfig import Config
log_path = Config.get('paths.LOG_PATH')
```

---

## 三、路径常量（大写）

| 常量 | 说明 | 默认值 |
|------|------|--------|
| `FQDATA_PATH` | FQData 主目录 | `~/.fqdata` |
| `SETTING_PATH` | 设置目录 | `~/.fqdata/setting` |
| `CACHE_PATH` | 缓存目录 | `~/.fqdata/cache` |
| `LOG_PATH` | 日志目录 | `~/.fqdata/log` |
| `DOWNLOAD_PATH` | 下载目录 | `~/.fqdata/downloads` |
| `STRATEGY_PATH` | 策略目录 | `~/.fqdata/strategy` |
| `BIN_PATH` | 二进制目录 | `~/.fqdata/bin` |

---

## 四、Config 类属性

### 4.1 动态日期属性

| 属性 | 说明 |
|------|------|
| `TODAY` | 当前日期（8:00 前为前一交易日，8:00 后为当日） |
| `DAY` | 当前日期（始终为今天） |
| `NOW` | 当前时间字符串，格式 `%Y-%m-%d %H:%M` |

### 4.2 路径属性

| 属性 | 说明 |
|------|------|
| `ROOTPATH` | FQUANT_ROOT_PATH 环境变量 |
| `INDEXPATH` | FQUANT_INDEX_PATH 环境变量 |
| `JSONDATAPATH` | INDEXPATH + 'h5/data/' |
| `WEBPOOLSPATH` | INDEXPATH + 'h5/data/JoinPools/' |
| `IMGDATAPATH` | INDEXPATH + 'h5/image/' |
| `TEMPLATEPATH` | ROOTPATH + 'template/' |
| `POOLSPATH` | ROOTPATH + 'poolsdata/' |
| `BASEDATAPATH` | ROOTPATH + 'data/' |

### 4.3 配置属性

| 属性 | 说明 |
|------|------|
| `host` | Redis 主机，默认 'localhost' |
| `CHROME_DRIVER_PATH` | Chrome 驱动路径 |
| `start_date` | 起始日期，默认 '2021-01-01' |

---

## 五、环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `FQUANT_ROOT_PATH` | 根目录路径 | - |
| `FQUANT_INDEX_PATH` | 指数路径 | - |
| `FQUANT_START_DATE` | 起始日期 | '2021-01-01' |
| `FQUANT_FQDATA_PATH` | FQData 目录 | `~/.fqdata` |
| `REDIS_HOST` | Redis 主机 | 'localhost' |
| `CHROME_DRIVER_PATH` | Chrome 驱动 | '/usr/bin/chromedriver' |

---

## 六、完整导出列表

| 名称 | 说明 |
|------|------|
| `FQDATA_PATH` | FQData 主目录 |
| `SETTING_PATH` | 设置目录 |
| `CACHE_PATH` | 缓存目录 |
| `LOG_PATH` | 日志目录 |
| `DOWNLOAD_PATH` | 下载目录 |
| `STRATEGY_PATH` | 策略目录 |
| `BIN_PATH` | 二进制目录 |
| `_paths` | `_PathConfig` 实例 |
| `GLOBALMAP` | `_PathConfig` 实例别名 |

---

## 七、Config.get() 用法

```python
from FQBase.FQConfig import Config

# 获取路径
root = Config.get('paths.ROOTPATH')
today = Config.get('paths.TODAY')
log_dir = Config.get('paths.LOG_PATH')
download_dir = Config.get('paths.DOWNLOAD_PATH')
```

---

## 八、迁移说明

### 历史迁移

| 日期 | 变更 |
|------|------|
| 2026-03-26 | 从 `FQData.QASetting.QALocalize` 迁移到 `FQBase.FQConfig.paths` |
| 2026-03-26 | 统一使用大写常量，不再提供小写别名 |

### 迁移示例

```python
# 旧代码
from FQData.QASetting.QALocalize import qa_path, setting_path, download_path

# 新代码
from FQBase.FQConfig.paths import FQDATA_PATH, SETTING_PATH, DOWNLOAD_PATH
```

---

## 九、相关文档

- [module-FQConfig.md](./module-FQConfig.md) - FQConfig 模块索引
- [module-FQConfig-setting.md](./module-FQConfig-setting.md) - 设置管理模块