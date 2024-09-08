import { defineConfig , type DefaultTheme } from 'vitepress'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FQuant Document",
  description: "FQuant Development Dcouments",
  markdown: {
    math: true,
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: {
      level: 'deep'
    },
    nav: [
      { text: 'Markdown语法', link: '/markdown' },
      { text: '使用说明', link: '/readme' },
      { text: '开发说明', link: '/dev/development' , activeMatch: '/dev/'},
      { text: '服务端', link: '/server/server', activeMatch: '/server/'},
      { text: '数据库', link: '/db/database', activeMatch: '/db/' },
      { text: '设计逻辑', link: '/design/design', activeMatch: '/design/' },
    ],
    sidebar: {
      '/': { 
        items: [
          { text: '开发说明', link: '/dev/development' },
          { text: '服务端', link: '/server/server' },
          { text: '数据库', link: '/db/database' },
          { text: '设计逻辑', link: '/design/design' },
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
              { text: '基础代码表', link: 'basecode' },
              { text: '龙虎榜', link: 'lhb' },
            ]
          },
        ],
      },
      '/design/': { base: '/design/', 
        items: [
          {
            text: ' 设计逻辑',
            collapsed: false,
            items: [
              {
                text: '算法设计',
                collapsed: false,
                items: [
                  { text: '龙虎榜', link: 'allhb' },
                ]
              },
              { text: '市场风格', link: 'a_marktestyle' },
              {
                text: 'API',
                collapsed: false,
                items: [
                  { text: '龙虎榜', link: 'lhb' },
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
