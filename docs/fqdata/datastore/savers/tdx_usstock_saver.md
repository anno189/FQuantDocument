# 美股数据持久化 (tdx_usstock_saver)

**状态：待实现**

美股数据持久化模块，目前处于待开发状态。

## 模块路径

```
FQData.DataStore.savers.tdx_usstock_saver
```

## 迁移状态

**SKIPPED** - 等待美股数据源适配器实现

## 计划功能

以下函数将在美股数据源适配器实现后迁移：

| 函数 | 说明 |
|------|------|
| `save_single_usstock_day` | 保存单只美股日线 |
| `save_usstock_day` | 批量保存美股日线 |
| `save_single_usstock_min` | 保存单只美股分钟线 |
| `save_usstock_min` | 批量保存美股分钟线 |
| `save_usstock_list` | 保存美股列表 |

## 相关文档

- [DataStore 模块](../README.md)
- [Savers 模块索引](README.md)
