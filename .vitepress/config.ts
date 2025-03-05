import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
import { textAdPlugin } from './textAdMdPlugin'
import { withMermaid } from 'vitepress-plugin-mermaid'

const nav: ThemeConfig['nav'] = [
  { text: '文档', link: '/guide/', activeMatch: '/guide/' },
  { text: '部署', link: '/config/', activeMatch: '/config/' },
  {
    text: '相关项目',
    items: [
      { text: 'Team', link: '/team' },
      { text: 'Blog', link: '/blog' },
      { text: 'Releases', link: '/releases' },
      {
        items: [
          {
            text: '聊天室',
            link: 'https://github.com/dobyte/due-chat',
          },
          {
            text: '更新日志',
            link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md',
          },
          {
            text: '贡献指南',
            link: 'https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md',
          },
        ],
      },
    ]
  },
  {
    text: '版本',
    items: [
      {
        text: 'due v2 文档（中文）',
        link: 'https://due.github.com/v2'
      }
    ]
  }
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: '快如入门',
      items: [
        {
          text: '框架介绍',
          link: '/guide/index'
        },
        {
          text: '快速开始',
          link: '/guide/quick-start'
        },
      ]
    },
    {
      text: '功能开发',
      items: [
        {
          text: '通信协议',
          link: '/guide/protocol'
        },
        {
          text: '路由设计',
          link: '/guide/route'
        },
        {
          text: '启动配置',
          link: '/guide/etc'
        },
        {
          text: '网关服务器',
          link: '/guide/gate'
        },
        {
          text: '节点服务器',
          link: '/guide/node'
        },
        {
          text: '网格服务器',
          link: '/guide/mesh'
        },
        {
          text: 'Web服务器',
          link: '/guide/web'
        },
        {
          text: '测试客户端',
          link: '/guide/client'
        },
        {
          text: '单线程模型',
          link: '/guide/single-thread'
        },
        {
          text: '多协程模型',
          link: '/guide/multiple-coroutines'
        },
        {
          text: 'Actor模型',
          link: '/guide/actor'
        },
        {
          text: '运行模式',
          link: '/guide/mode'
        },
        {
          text: '错误处理',
          link: '/guide/error'
        },
        {
          text: '滚动更新',
          link: '/guide/rolling-update'
        },
      ]
    },
    {
      text: '核心模块',
      items: [
        {
          text: '注册中心',
          link: '/guide/registry'
        },
        {
          text: '配置中心',
          link: '/guide/config'
        },
        {
          text: '网络模块',
          link: '/guide/network'
        },
        {
          text: '传输模块',
          link: '/guide/transport'
        },
        {
          text: '日志模块',
          link: '/guide/log'
        },
        {
          text: '缓存模块',
          link: '/guide/performance',
        },
        {
          text: '加密模块',
          link: '/guide/crypto',
        },
        {
          text: '事件总线',
          link: '/guide/eventbus'
        },
        {
          text: '分布式锁',
          link: '/changes/',
        },
      ]
    },
  ]
}

export default withMermaid(defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,
  lang: 'zh-CN',
  title: 'due',
  description: 'due - 基于Go语言开发的高性能分布式游戏服务器框架',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],
  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:url', content: 'https://dobyte.github.io' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'due' }],
    ['meta', { property: 'og:description', content: 'due - 基于Go语言开发的高性能分布式游戏服务器框架' }]
  ],

  themeConfig: {
    nav,
    sidebar,
    // Placeholder of the i18n config for @vuejs-translations.
    // i18n,
    localeLinks: [
      {
        link: 'https://dobyte.github.io',
        text: '简体中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-cn'
      },
      {
        link: '/translations/',
        text: 'Help Us Translate!',
        isTranslationsDesc: true
      }
    ],
    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dobyte/due' }
    ],
    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `本中文文档采用 知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议 (CC BY-NC-SA 4.0) 进行许可。`
    }
  },

  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(headerPlugin).use(textAdPlugin)
    }
  },

  // your existing vitepress config...
  // optionally, you can pass MermaidConfig
  mermaid: {
    // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  },
  // optionally set additional config for plugin itself with MermaidPluginConfig
  mermaidPlugin: {
    class: "mermaid my-class", // set additional css classes for parent container 
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  }
}))
