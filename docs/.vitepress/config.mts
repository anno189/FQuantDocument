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
              { text: 'issue', link: 'issue' },
              { text: '版本更新', link: 'changelog' },
            ]
          },
        ],
      },

      '/server/': { base: '/server/', 
        items: [
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
