const moment = require("moment");
module.exports = {
  base: "/",
  title: "due",
  description: "due - 基于Go语言开发的高性能分布式游戏服务器框架",
  head: [
    ["link", { rel: "icon", href: "/icon.png" }],
    [
      "script",
      { type: "text/javascript" },
      `var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?c77f15742ac7b6883fb18421ee33a702";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
      `,
    ],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:url', content: 'https://dobyte.github.io' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'due' }],
    ['meta', { property: 'og:description', content: 'due - 基于Go语言开发的高性能分布式游戏服务器框架' }]
  ],
  markdown: {
    lineNumbers: true, // 代码块显示行号
  },
  themeConfig: {
    nav: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "文档",
        link: "/guide/v2/",
      },
      {
        text: "相关项目",
        items: [
          { text: "聊天室", link: "https://github.com/dobyte/due-chat" },
          { text: "斗地主", link: "https://github.com/dobyte/due-doudizhu-desc" },
        ],
      },
      {
        text: "加入我们",
        link: "/join/",
      },
      {
        text: "GitHub",
        link: "https://github.com/dobyte/due",
      },
    ],
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: "dobyte/due-docs",
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: "查看文档源码",
    // 假如文档不是放在仓库的根目录下：
    docsDir: "docs",
    // 假如文档放在一个特定的分支下：
    docsBranch: "master",
    editLinks: true,
    editLinkText: "在github.com上编辑此页",
    sidebar: {
      "/summary/": [""], //这样自动生成对应文章
      "/guide/v2/": [
        {
          title: "第1章 简介",
          collapsable: false, // 可选的, 默认值是 true,
          children: [
            "/guide/v2/1.1.quick-start",
            "/guide/v2/1.2.examples",
            "/guide/v2/1.3.contribute",
          ],
        },
        {
          title: "第2章 框架设计",
          collapsable: false, // 可选的, 默认值是 true,
          children: [
            "/guide/v2/2.1.architecture",
            "/guide/v2/2.2.protocol",
            "/guide/v2/2.3.route",
            "/guide/v2/2.4.bind-gate",
            "/guide/v2/2.5.bind-node",
            "/guide/v2/2.6.single-thread",
            "/guide/v2/2.7.multiple-coroutines",
            "/guide/v2/2.8.actor",
            "/guide/v2/2.9.etc",
            "/guide/v2/2.10.mode",
            "/guide/v2/2.11.error",
            "/guide/v2/2.12.rolling-update",
          ],
        },
        {
          title: "第3章 集群服务",
          collapsable: false, // 可选的, 默认值是 true,
          children: [
            "/guide/v2/3.1.gate",
            "/guide/v2/3.2.node",
            "/guide/v2/3.3.mesh",
            "/guide/v2/3.4.web",
          ],
        },
        {
          title: "第4章 核心模块",
          collapsable: false, // 可选的, 默认值是 true,
          children: [
            "/guide/v2/4.1.registry",
            "/guide/v2/4.2.config",
            "/guide/v2/4.3.network",
            "/guide/v2/4.4.transport",
            "/guide/v2/4.5.log",
            "/guide/v2/4.6.cache",
            "/guide/v2/4.7.crypto",
            "/guide/v2/4.8.eventbus",
            "/guide/v2/4.9.lock",
          ],
        },
        {
          title: "第5章 三方组件",
          collapsable: false, // 可选的, 默认值是 true,
          children: [
            "/guide/v2/5.1.gorm",
            "/guide/v2/5.2.redis",
            "/guide/v2/5.3.mongo",
            "/guide/v2/5.4.jwt",
          ],
        },
      ], //这样自动生成对应文章
    },
    sidebarDepth: 2,
    lastUpdated: "上次更新",
    serviceWorker: {
      updatePopup: {
        message: "发现新内容可用",
        buttonText: "刷新",
      },
    },
  },
  plugins: [
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp, lang) => {
          // 不要忘了安装 moment
          const moment = require("moment");
          moment.locale("zh-cn");
          return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
        },
        dateOptions: {
          hours12: true,
        },
      },
    ],
    "@vuepress/back-to-top",
    "@vuepress/active-header-links",
    "@vuepress/medium-zoom",
    "@vuepress/nprogress",
  ],
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.devServer = {
        hot: true, // 启用热模块替换
        open: true, // 自动打开浏览器
        host: 'localhost',
        port: 8082,
        before: app => { }
      };
    }
  }
};
