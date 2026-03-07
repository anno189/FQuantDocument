import { defineConfig , type DefaultTheme } from 'vitepress'
import markdownittasklists from 'markdown-it-task-lists'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FQuant Document",
  description: "FQuant Development Dcouments",
  markdown: {
    math: true,
    config: (md) => {
          md.use(markdownittasklists)
      },
  },
  ignoreDeadLinks: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      level: 'deep'
    },
    nav: [
      { text: 'Markdown语法', link: '/markdown' },
      { text: 'ISSUE', link: '/dev/issue', activeMatch: '/dev/'},
      { text: '使用说明', link: '/readme' },
      { text: '开发说明', link: '/dev/development' , activeMatch: '/dev/'},
      { text: '服务端', link: '/server/server', activeMatch: '/server/'},
      { text: '数据库', link: '/db/database', activeMatch: '/db/' },
      { text: '函数库', link: '/tools/tools', activeMatch: '/tools/' },
      { text: '设计逻辑', link: '/design/emotions', activeMatch: '/design/' },
    ],
    sidebar: {
      '/': { 
        items: [
          { text: 'Markdown', link: '/markdown' },
          { text: '开发说明', link: '/dev/development' },
          { text: '服务端', link: '/server/server' },
          { text: '数据库', link: '/db/database' },
          { text: '设计逻辑', link: '/design/emotions' },
        ],
      },

      '/dev/': { base: '/dev/', 
        items: [
          {
            text: '开发说明',
            collapsed: false,
            items: [
              { text: '开发须知', link: 'development' },
              { text: '后端开发指南', link: 'backend-guide' },
              { text: '后端项目地图', link: 'project-map-backend' },
              { text: '前端开发指南', link: 'frontend-guide' },
              { text: '前端项目地图', link: 'project-map-frontend' },
              { text: 'issue', link: 'issue' },
              { text: '版本更新', link: 'changelog' },
              { text: '工作流程', link: 'workflow' },
            ]
          },
          {
            text: '核心模块',
            collapsed: false,
            items: [
              { text: '板块与主线分析：BBlock.py', link: 'module-bblock' },
              { text: 'CBaseData', link: 'module-CBaseData' },
              { text: 'CConceptData', link: 'module-CConceptData' },
              { text: 'CDataDay', link: 'module-CDataDay' },
              { text: 'CDataTick', link: 'module-CDataTick' },
              { text: 'CExtentData', link: 'module-CExtentData' },
              { text: 'CFactorData', link: 'module-CFactorData' },
              { text: 'CFutureData', link: 'module-CFutureData' },
              { text: 'CIndexData', link: 'module-CIndexData' },
              { text: 'CIndustryData', link: 'module-CIndustryData' },
              { text: 'CMarket', link: 'module-CMarket' },
              { text: 'CRPSData', link: 'module-CRPSData' },
              { text: 'CStockData', link: 'module-CStockData' },
              { text: 'Parameter', link: 'module-Parameter' },
            ]
          },
          {
            text: '工具模块',
            collapsed: false,
            items: [
              { text: 'Tools', link: 'module-Tools' },
              { text: 'ToolsCRCData', link: 'module-ToolsCRCData' },
              { text: 'ToolsCheckData', link: 'module-ToolsCheckData' },
              { text: 'ToolsGMI', link: 'module-ToolsGMI' },
              {
                text: 'ToolsGetData',
                collapsed: false,
                items: [
                  { text: 'ToolsGetData', link: 'module-ToolsGetData' },
                  { text: '核心函数解析：get_open_select_stock_list', link: 'func-get-open-select-stock-list' },
                ]
              },
              { text: 'ToolsGetWebNews', link: 'module-ToolsGetWebNews' },
              { text: 'ToolsJianGuan', link: 'module-ToolsJianGuan' },
              { text: 'ToolsLhbData', link: 'module-ToolsLhbData' },
              { text: 'ToolsRedisData', link: 'module-ToolsRedisData' },
              { text: 'ToolsSaveAkshare', link: 'module-ToolsSaveAkshare' },
              { text: 'ToolsSaveData', link: 'module-ToolsSaveData' },
              { text: 'ToolsSaveLocalData', link: 'module-ToolsSaveLocalData' },
              { text: 'ToolsStrategyPools', link: 'module-ToolsStrategyPools' },
            ]
          },
        ],
      },

      '/server/': { base: '/server/', 
        items: [
          {
            text: '服务端',
            collapsed: false,
            items: [
              { text: '服务端说明', link: 'server' },
              { text: '函数说明', link: 'function' },
            ]
          },
          {
            text: 'celery 定时器',
            collapsed: false,
            items: [
              { text: 'celery 定时器', link: 'celery' },
            ]
          },
          {
            text: 'redis 缓存',
            collapsed: false,
            items:[
              { text: 'redis 缓存', link: 'redis'} ,
              { text: '缓存列表', base: '/server/', 
                items: [
                  { text: 'DataFrame_StockList', link: 'DataFrame_StockList' },
                  { text: 'DataFrame_BlockList', link: 'DataFrame_BlockList' },
                  { text: 'DataFrame_Concept', link: 'DataFrame_Concept' },
                  { text: 'DataFrame_BaseInfoList', link: 'DataFrame_BaseInfoList' },
                  { text: 'DataFrame_KZZbondList', link: 'DataFrame_KZZbondList' },
                  { text: 'DataFrame_IndexList', link: 'DataFrame_IndexList' },
                  { text: 'DataFrame_StockVRate', link: 'DataFrame_StockVRate' },
                  { text: 'DataFrame_StockVRateDay', link: 'DataFrame_StockVRateDay' },
                  { text: 'DataFrame_LimitUpTime', link: 'DataFrame_LimitUpTime' },
                  { text: 'datalimitup', link: 'datalimitup' },
                  { text: 'DataFrame_StockScoreDay', link: 'DataFrame_StockScoreDay' },
                  { text: 'DataFrame_Realtime', link: 'DataFrame_Realtime' },
                  { text: 'DataFrame_BlockYestoday', link: 'DataFrame_BlockYestoday' },
                  { text: 'stock_open_mins0', link: 'stock_open_mins0' },
                ]
              }
            ]
          },
          {
            text: '过滤器',
            collapsed: false,
            items: [
              { text: '过滤器', link: 'filter' },
            ]
          },
          {
            text: '发送数据',
            collapsed: false,
            items: [
              { text: '发送数据', link: 'senddata' },
              { text: '发送数据到前端服务器', link: 'send2server' },
              { text: '发送数据到 json', link: 'send2json' },
              { text: '发送数据到微信', link: 'send2wechat' },
            ]
          },
          {
            text: '部分算法逻辑',
            collapsed: false,
            items: [
              { text: '资金量预测', link: 'amountforecast' },
              { text: '龙虎榜', link: 'lhb' },
              { text: '龙虎榜数据', link: 'lbh' },
            ]
          },
        ]
      },
      '/db/': { base: '/db/',
        items: [
          {
            text: ' 数据库',
            collapsed: false,
            items: [
              { text: '数据库', link: 'database' },
              { text: '变更说明', link: 'changelog' },
              { text: '基础代码表', link: 'basecode' },
              { text: '财务数据', link: 'financial' },
              { text: '龙虎榜', link: 'lhb' },
            ]
          },
        ],
      },
      '/tools/': { base: '/tools/',
        items: [
          {
            text: '函数库',
            collapsed: false,
            items: [
              { text: '工具函数库', link: ' tools' },
            ]
          },
        ],
      },
      '/design/': { base: '/design/', 
        items: [
          { text: '情绪', link: 'emotions' },
          { text: '算法', link: 'algorithm' },
          {
            text: '游资心得',
            collapsed: false,
            items: [
              
                      { text: '不颜不语', link: 'thinks/byby' },
                      { text: '92科比', link: 'thinks/92kb' },
                    ]
                
            
          },
          {
            text: ' 设计逻辑',
            collapsed: false,
            items: [
              {
                text: '算法设计',
                collapsed: false,
                items: [
                  { 
                    text: '龙虎榜',
                    collapsed: false,
                    items: [
                      { text: '龙虎榜', link: 'al/lhb' },
                      { text: '龙虎榜 V1', link: 'al/lhbv1' },
                      { text: '游资', link: 'al/yq' },
                    ]
                  },
                ]
              },
              
              {
                text: '算法API',
                collapsed: false,
                items: [
                  { text: '龙虎榜', link: 'alapi/lhb' },
                  { text: '沪深京A股公告', link: 'alapi/report' },
                  { text: '市场风格', link: 'alapi/marktestyle' },
                ]
              },
              {
                text: '基础API',
                collapsed: false,
                items: [
                  { text: '获取数据', link: 'baseapi/GetData' },
                ]
              },
            ]
          },
        ],
      },


    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
