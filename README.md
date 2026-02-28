# due-docs

[due](https://github.com/dobyte/due) 游戏服务器框架的官方中文文档站，基于 Next.js 构建。

## 技术栈

- [Next.js 16](https://nextjs.org/) (Turbopack)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [MDX](https://mdxjs.com/) 文档渲染 (next-mdx-remote-client)
- [Shiki](https://shiki.matsu.io/) 代码高亮
- [Radix UI](https://www.radix-ui.com/) 无障碍组件
- [Motion](https://motion.dev/) 动画

## 本地开发

### 前置要求

- Node.js >= 18
- [pnpm](https://pnpm.io/)

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

## 项目结构

```
├── app/                  # Next.js App Router 路由
│   ├── (app)/            # 首页、加入我们
│   └── (docs)/           # 文档页面
├── content/docs/         # MDX 文档内容
│   ├── guide/            # 快速开始、示例、贡献指南
│   ├── framework/        # 框架设计（架构、路由、协议等）
│   ├── core/             # 核心模块（日志、网络、注册中心等）
│   ├── extensions/       # 扩展模块（分布式锁、缓存等）
│   ├── cluster/          # 集群服务（网关、节点、网格等）
│   └── third-party/      # 三方组件（GORM、Redis、JWT 等）
├── components/           # React 组件
├── config/               # 站点与文档导航配置
├── lib/                  # 工具函数
└── public/               # 静态资源
```

## 编写文档

在 `content/docs/` 下新建 `.mdx` 文件，使用 frontmatter 声明标题：

```mdx
---
title: 页面标题
description: 页面描述（可选）
---

文档内容...
```

然后在 `config/docs.ts` 中添加对应的导航条目即可。

## 代码规范

```bash
# 检查
pnpm lint

# 格式化
pnpm format
```

## License

[MIT](./LICENCE.md)
