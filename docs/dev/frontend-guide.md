# FQuant 前端开发指南

## 1. 技术栈概述

`FQuantWeb2` 是一个基于 **Nuxt.js** (Vue.js 框架) 的前端应用，专注于市场数据的可视化展示。

*   **UI 框架**: [Quasar UI](https://quasar.dev/)，提供了丰富的 Vue 组件（如 `q-page`, `q-tabs`, `q-table` 等）。
*   **图表库**: [ECharts](https://echarts.apache.org/zh/index.html)，通过 [vue-echarts](https://github.com/ecomfe/vue-echarts) 插件集成到 Vue 中。
*   **网络请求**: [Axios](https://axios-http.com/)，封装在 `utils/http.js` 中。
*   **状态管理**: [Pinia](https://pinia.vuejs.org/)，定义在 `composables/store.ts` 中。

## 2. 目录结构

*   **`pages/`**: 存放所有页面文件。文件名即路由名（例如 `pages/after/industry.vue` 对应路由 `/after/industry`）。
*   **`components/`**: 存放可复用的 Vue 组件和布局组件。
*   **`utils/`**: 存放工具类函数，如网络请求封装。
*   **`public/`**: 存放静态资源。

## 3. 开发工作流

1.  **启动开发服务器**:
    ```bash
    yarn install
    yarn dev
    ```
    开发服务器默认运行在 `http://localhost:3000`。

2.  **创建新页面**:
    在 `pages/` 目录下创建 `.vue` 文件。

3.  **数据对接**:
    *   **无需配置代理或 Mock**: 前端直接从测试服务器（如 `https://stock.1dian.site/h5/data/`）获取后端生成的 JSON 文件。
    *   **调用方式**: 在组件的 `mounted` 钩子或 `setup` 中，使用 `http.get` 获取绝对路径的 JSON 数据。

4.  **渲染图表**:
    *   后端会生成完整的 ECharts `option` 配置对象。
    *   前端通过 `v-chart` 组件渲染，并将获取到的 JSON 直接传递给 `:option` 属性。

## 4. 示例代码：数据获取与图表展示

以下是一个典型的页面组件结构示例：

```vue
<template>
  <q-page>
    <!-- 使用 Quasar 组件布局 -->
    <div class="q-pa-md">
      <!-- 使用 v-chart 渲染 ECharts -->
      <v-chart class="my-chart" :option="chartOption" autoresize />
    </div>
  </q-page>
</template>

<script lang="ts">
import http from '@/utils/http'
import VChart from 'vue-echarts'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { VChart },
  setup() {
    const chartOption = ref({})

    const loadData = async () => {
      // 直接调用测试服务器上的 JSON 数据
      const res = await http.get('https://stock.1dian.site/h5/data/market_emotion.json')
      chartOption.value = res.data
    }

    return { chartOption, loadData }
  },
  mounted() {
    this.loadData()
  }
})
</script>

<style scoped>
.my-chart {
  height: 400px;
}
</style>
```

## 5. 开发建议

*   **优先复用 Quasar 组件**: 尽量使用 Quasar 提供的 UI 组件以保持界面风格一致。
*   **关注 ECharts 性能**: 对于大数据量的图表，确保在 `v-chart` 上使用 `autoresize` 属性。
*   **参考现有页面**: 在开发新页面前，建议先阅读 `pages/` 目录下已有的成熟页面代码（如 `industry.vue`），以了解项目的数据加载和布局模式。
