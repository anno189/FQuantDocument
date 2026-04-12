# 归档文档说明

此目录包含已失效或过时的文档，这些文档对应的代码模块已被重构或废弃。

## 归档原因

这些文档原本描述的模块已经经历了架构调整：

1. **C*Data 系列** (`module-C*.md`) - 旧的 C++ 风格数据结构，已被新的 FQDataStruct 替代
2. **Tools* 系列** (`module-Tools*.md`) - 旧的工具模块，已迁移到 FQBase.FQUtil
3. **module-FQData-fetch 系列** - 数据获取模块已重构为 FQDataSource 适配器模式
4. **module-Parameter** - 参数管理已整合到 FQConfig 模块
5. **module-bblock, module-monitormarket** - 板块和市场监控已整合到 FQMarket

## 对应新文档

| 旧文档 | 新文档位置 |
|--------|-----------|
| module-CStockData | [FQDataStruct 数据结构](../../fqbase/datastruct) |
| module-CIndexData | [FQDataStruct 数据结构](../../fqbase/datastruct) |
| module-ToolsSaveData | [FQDataSource 数据源](../../fqbase/datasource) |
| module-ToolsGetData | [FQDataSource 数据源](../../fqbase/datasource) |
| module-RedisAdapter | [FQDataStore 数据存储](../../fqbase/datastore) |
| module-FQData-fetch-tdx-* | [FQDataSource 数据源](../../fqbase/datasource) |
| module-Parameter | [FQConfig 配置中心](../../fqbase/config) |

## 查看迁移报告

详细的迁移差异分析请参阅：

- [FQDataStruct 迁移报告](./migration/module-FQDataStruct-base)
- [FQConfig 迁移报告](./migration/module-FQConfig-constants)
- [FQUtil 迁移报告](./migration/module-FQUtil-parallel)
- [FQDate 迁移报告](./migration/module-FQDate-trade)
