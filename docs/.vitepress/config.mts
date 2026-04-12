import { defineConfig , type DefaultTheme } from 'vitepress'
import markdownittasklists from 'markdown-it-task-lists'

export default defineConfig({
  title: "FQuant Document",
  description: "FQuant 量化交易系统开发文档",
  markdown: {
    math: true,
    config: (md) => {
          md.use(markdownittasklists)
      },
  },
  ignoreDeadLinks: true,

  themeConfig: {
    outline: {
      level: 'deep'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: '架构设计', link: '/architecture/' },
      { text: 'FQBase', link: '/fqbase/README' },
      { text: 'FQData', link: '/fqdata/README' },
      { text: 'FQAlgorithm', link: '/fqalgorithm/index' },
      { text: 'FQMarket', link: '/fqmarket/index' },
      { text: 'FQServer', link: '/fqserver/index' },
      { text: 'FQReport', link: '/fqreport/index' },
      { text: '开发', link: '/dev/' },
    ],
    sidebar: {
      '/': [
        { text: '首页', link: '/' },
        { text: 'Markdown 语法', link: '/markdown' },
        { text: '使用说明', link: '/readme' },
      ],

      '/guide/': {
        base: '/guide/',
        items: [
          { text: '指南', items: [
            { text: '项目介绍', link: 'index' },
            { text: '安装部署', link: 'installation' },
            { text: '快速开始', link: 'quickstart' },
          ]},
          { text: '开发说明', items: [
            { text: '开发须知', link: '/dev/development' },
            { text: '后端开发指南', link: '/dev/backend-guide' },
            { text: '前端开发指南', link: '/dev/frontend-guide' },
            { text: '工作流程', link: '/dev/workflow' },
            { text: '版本更新', link: '/dev/changelog' },
            { text: 'Issue', link: '/dev/issue' },
          ]},
        ]
      },

      '/architecture/': {
        base: '/architecture/',
        items: [
          { text: '架构设计', items: [
            { text: '系统架构总览', link: 'overview' },
            { text: '模块关系图', link: 'modules' },
            { text: '重构计划', link: 'refactoring' },
            { text: '设计文档', link: 'design' },
          ]},
        ]
      },

      '/fqbase/': {
        base: '/fqbase/',
        items: [
          { text: '基础文档', items: [
            { text: '快速开始', link: 'quick-start' },
            { text: '架构', link: 'architecture' },
            { text: '设计', link: 'design' },
            { text: '开发指南', link: 'development' },
            { text: '最佳实践', link: 'best-practices' },
            { text: 'API 规范', link: 'api-spec' },
            { text: '应用示例', link: 'application-examples' },
            { text: '系统集成', link: 'system-integration' },
          ]},
          { text: 'Foundation 基础组件', items: [
            { text: 'circuit_breaker 熔断器', link: 'foundation/circuit_breaker/README' },
            { text: 'container 容器', link: 'foundation/container/README' },
            { text: 'dotty 配置库', link: 'foundation/dotty/README' },
            { text: 'lifecycle 生命周期', link: 'foundation/lifecycle/README' },
            { text: 'retry 重试', link: 'foundation/retry/README' },
            { text: 'singleton 单例', link: 'foundation/singleton/README' },
            { text: 'validators 验证器', link: 'foundation/validators/README' },
          ]},
          { text: 'Core 核心服务', items: [
            { text: 'eventbus 事件总线', link: 'core/eventbus/README' },
            { text: 'logger 日志', link: 'core/logger/README' },
            { text: 'notification 通知', link: 'core/notification/README' },
            { text: 'notification_template 通知模板', link: 'core/notification_template/README' },
          ]},
          { text: 'Config 配置中心', items: [
            { text: 'config 概览', link: 'config/README' },
            { text: 'core 核心配置', link: 'config/core/README' },
            { text: 'business 业务配置', link: 'config/business/README' },
          ]},
          { text: 'Cache 缓存层', link: 'cache/README' },
          { text: 'DataStore 数据存储', items: [
            { text: 'datastore 概览', link: 'datastore/datastore' },
            { text: 'mongo_client Mongo客户端', link: 'datastore/mongo_client/README' },
            { text: 'mongo_db Mongo数据库', link: 'datastore/mongo_db/README' },
          ]},
          { text: 'Date 日期工具', link: 'date/README' },
          { text: 'Crawler 爬虫', items: [
            { text: 'browser 浏览器', link: 'crawler/browser/README' },
          ]},
          { text: 'Util 工具库', items: [
            { text: 'bar K线工具', link: 'util/bar' },
            { text: 'codec 编解码', link: 'util/codec' },
            { text: 'converters 转换器', link: 'util/converters' },
            { text: 'file 文件工具', link: 'util/file' },
            { text: 'network 网络工具', link: 'util/network' },
            { text: 'parallel 并行', link: 'util/parallel' },
            { text: 'transformer 转换器', link: 'util/transformer' },
          ]},
        ]
      },

      '/fqdata/': {
        base: '/fqdata/',
        items: [
          { text: '基础文档', items: [
            { text: 'README', link: 'README' },
            { text: '最佳实践', link: 'best-practices' },
            { text: '开发指南', link: 'development' },
            { text: 'FAQ', link: 'faq' },
            { text: '使用指南', link: 'usage' },
            { text: 'API', link: 'api' },
          ]},
          { text: 'DataSource 数据源', items: [
            { text: '概览', link: 'datasource/README' },
            { text: 'API', link: 'datasource/api' },
            { text: '最佳实践', link: 'datasource/best-practices' },
            { text: '开发指南', link: 'datasource/development' },
            { text: 'FAQ', link: 'datasource/faq' },
            { text: '使用指南', link: 'datasource/usage' },
            { text: 'adapters 适配器', link: 'datasource/adapters/README' },
            { text: 'tdx 通达信', link: 'datasource/adapters/tdx/README' },
            { text: 'akshare AkShare', link: 'datasource/adapters/akshare/README' },
            { text: 'efinance EFinance', link: 'datasource/adapters/efinance/README' },
            { text: 'eastmoney 东方财富', link: 'datasource/adapters/eastmoney/README' },
            { text: 'ths 同花顺', link: 'datasource/adapters/ths/README' },
            { text: 'jisilu 集思录', link: 'datasource/adapters/jisilu/README' },
            { text: 'exchange 交易所', link: 'datasource/adapters/exchange/README' },
          ]},
          { text: 'DataStore 数据存储', items: [
            { text: '概览', link: 'datastore/README' },
            { text: 'API', link: 'datastore/api' },
            { text: '最佳实践', link: 'datastore/best-practices' },
            { text: '开发指南', link: 'datastore/development' },
            { text: 'FAQ', link: 'datastore/faq' },
            { text: '使用指南', link: 'datastore/usage' },
            { text: 'savers 存储适配器', link: 'datastore/savers/README' },
            { text: 'query 数据查询', link: 'datastore/query/README' },
            { text: '  - stock 股票查询', link: 'datastore/query/stock' },
            { text: '  - index 指数查询', link: 'datastore/query/index' },
            { text: '  - future 期货查询', link: 'datastore/query/future' },
            { text: '  - bond 债券查询', link: 'datastore/query/bond' },
            { text: '  - etf ETF查询', link: 'datastore/query/etf' },
          ]},
          { text: 'DataStruct 数据结构', items: [
            { text: '概览', link: 'datastruct/README' },
            { text: 'API', link: 'datastruct/api' },
            { text: '最佳实践', link: 'datastruct/best-practices' },
            { text: '开发指南', link: 'datastruct/development' },
            { text: 'FAQ', link: 'datastruct/faq' },
            { text: '使用指南', link: 'datastruct/usage' },
            { text: 'stock 股票', link: 'datastruct/stock' },
            { text: 'bond 债券', link: 'datastruct/bond' },
            { text: 'future 期货', link: 'datastruct/future' },
            { text: 'index 指数', link: 'datastruct/index' },
            { text: 'financial 财务', link: 'datastruct/financial' },
            { text: 'block 板块', link: 'datastruct/block' },
            { text: 'indicator 指标', link: 'datastruct/indicator' },
            { text: 'adj 复权', link: 'datastruct/adj' },
            { text: 'resample 重采样', link: 'datastruct/resample' },
            { text: 'realtime 实时', link: 'datastruct/realtime' },
            { text: 'transaction 交易', link: 'datastruct/transaction' },
            { text: 'series 序列', link: 'datastruct/series' },
            { text: 'security_list 证券列表', link: 'datastruct/security_list' },
          ]},
          { text: 'Pipeline 流水线', link: 'pipeline/README' },
          { text: 'Processors 处理器', items: [
            { text: '概览', link: 'processors/README' },
            { text: 'realtime 实时处理', link: 'processors/realtime/README' },
            { text: 'postmarket 盘后处理', link: 'processors/postmarket/README' },
          ]},
        ]
      },

      '/fqalgorithm/': {
        base: '/fqalgorithm/',
        items: [
          { text: '基础文档', items: [
            { text: 'README', link: 'index' },
          ]},
          { text: 'FQFactor 因子系统', items: [
            { text: '概览', link: 'fqfactor/index' },
            { text: '数据处理', link: 'fqfactor/data-handling' },
            { text: '开发指南', link: 'fqfactor/development-guide' },
            { text: '指标规范', link: 'fqfactor/indicator-specification' },
            { text: '因子注册', link: 'fqfactor/registry' },
          ]},
          { text: '信号生成器', items: [
            { text: 'API', link: 'signal-generator-api' },
            { text: '开发指南', link: 'signal-generator-dev' },
            { text: '示例', link: 'signal-generator-examples' },
          ]},
        ]
      },

      '/fqmarket/': {
        base: '/fqmarket/',
        items: [
          { text: 'FQMarket 市场层', items: [
            { text: 'README', link: 'index' },
          ]},
        ]
      },

      '/fqserver/': {
        base: '/fqserver/',
        items: [
          { text: 'FQServer 服务层', items: [
            { text: '服务端说明', link: 'index' },
          ]},
          { text: '数据接口', items: [
            { text: 'DataFrame_StockList', link: '/server/DataFrame_StockList' },
            { text: 'DataFrame_BlockList', link: '/server/DataFrame_BlockList' },
            { text: 'DataFrame_Concept', link: '/server/DataFrame_Concept' },
            { text: 'DataFrame_IndexList', link: '/server/DataFrame_IndexList' },
            { text: 'DataFrame_Realtime', link: '/server/DataFrame_Realtime' },
            { text: 'DataFrame_LimitUpTime', link: '/server/DataFrame_LimitUpTime' },
          ]},
        ]
      },

      '/fqreport/': {
        base: '/fqreport/',
        items: [
          { text: 'FQReport 盘后复盘', items: [
            { text: 'README', link: 'index' },
          ]},
        ]
      },

      '/dev/': {
        base: '/dev/',
        items: [
          { text: '开发指南', items: [
            { text: '开发须知', link: 'development' },
            { text: '后端开发指南', link: 'backend-guide' },
            { text: '后端项目地图', link: 'project-map-backend' },
            { text: '前端开发指南', link: 'frontend-guide' },
            { text: '前端项目地图', link: 'project-map-frontend' },
            { text: '工作流程', link: 'workflow' },
          ]},
        ]
      },

      '/db/': {
        base: '/db/',
        items: [
          { text: '数据库', items: [
            { text: '数据库', link: 'database' },
            { text: '变更说明', link: 'changelog' },
            { text: '基础代码表', link: 'basecode' },
            { text: '财务数据', link: 'financial' },
            { text: '龙虎榜', link: 'lhb' },
          ]},
        ]
      },

      '/design/': {
        base: '/design/',
        items: [
          { text: '设计逻辑', items: [
            { text: '情绪', link: 'emotions' },
            { text: '算法', link: 'algorithm' },
          ]},
          { text: 'FQBase 重构', items: [
            { text: '单例模式重构', link: 'fqbase/singleton_refactor' },
            { text: 'EventBus 模块集成', link: 'fqbase/eventbus_module_integration' },
          ]},
          { text: '游资心得', items: [
            { text: '不颜不语', link: 'thinks/byby' },
            { text: '92科比', link: 'thinks/92kb' },
          ]},
          { text: '算法设计', items: [
            { text: '龙虎榜', link: 'al/lhb' },
            { text: '龙虎榜 V1', link: 'al/lhbv1' },
            { text: '游资', link: 'al/yq' },
          ]},
          { text: '算法API', items: [
            { text: '龙虎榜', link: 'alapi/lhb' },
            { text: '沪深京A股公告', link: 'alapi/report' },
            { text: '市场风格', link: 'alapi/marktestyle' },
          ]},
          { text: '基础API', items: [
            { text: '获取数据', link: 'baseapi/GetData' },
          ]},
        ]
      },

    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/A-D-189/FQuant' }
    ]
  }
})