export type DocsNavItem = {
  title: string;
  href: string;
  label?: string;
};

export type DocsNavGroup = {
  title: string;
  items: DocsNavItem[];
};

export const docsNav: DocsNavGroup[] = [
  {
    title: "简介",
    items: [
      { title: "框架介绍", href: "/docs" },
      { title: "快速开始", href: "/docs/guide/quick-start" },
      { title: "项目示例", href: "/docs/guide/examples" },
      { title: "协作贡献", href: "/docs/guide/contribute" },
      { title: "常见问题", href: "/docs/guide/questions" },
    ],
  },
  {
    title: "框架设计",
    items: [
      { title: "架构设计", href: "/docs/framework/architecture" },
      { title: "通信协议", href: "/docs/framework/protocol" },
      { title: "路由机制", href: "/docs/framework/route" },
      { title: "启动配置", href: "/docs/framework/etc" },
      { title: "绑定网关", href: "/docs/framework/bind-gate" },
      { title: "绑定节点", href: "/docs/framework/bind-node" },
      { title: "单线程模型", href: "/docs/framework/single-thread" },
      { title: "多协程模型", href: "/docs/framework/multiple-coroutines" },
      { title: "Actor 模型", href: "/docs/framework/actor", label: "new" },
      { title: "运行模式", href: "/docs/framework/mode" },
      { title: "错误处理", href: "/docs/framework/error" },
      { title: "滚动更新", href: "/docs/framework/rolling-update" },
    ],
  },
  {
    title: "核心模块",
    items: [
      { title: "日志模块", href: "/docs/core/log" },
      { title: "网络模块", href: "/docs/core/network" },
      { title: "注册中心", href: "/docs/core/registry" },
      { title: "定位模块", href: "/docs/core/locate" },
      { title: "传输模块", href: "/docs/core/transport" },
      { title: "加密模块", href: "/docs/core/crypto" },
    ],
  },
  {
    title: "扩展模块",
    items: [
      { title: "分布式锁", href: "/docs/extensions/lock" },
      { title: "缓存模块", href: "/docs/extensions/cache" },
      { title: "配置中心", href: "/docs/extensions/config" },
      { title: "事件总线", href: "/docs/extensions/eventbus" },
    ],
  },
  {
    title: "集群服务",
    items: [
      { title: "网关服务", href: "/docs/cluster/gate" },
      { title: "节点服务", href: "/docs/cluster/node" },
      { title: "网格服务", href: "/docs/cluster/mesh" },
      { title: "Web服务", href: "/docs/cluster/web" },
      { title: "客户端", href: "/docs/cluster/client" },
    ],
  },
  {
    title: "三方组件",
    items: [
      { title: "GORM", href: "/docs/third-party/gorm" },
      { title: "Redis", href: "/docs/third-party/redis" },
      { title: "MongoDB", href: "/docs/third-party/mongo" },
      { title: "JWT", href: "/docs/third-party/jwt" },
      { title: "Casbin", href: "/docs/third-party/casbin" },
    ],
  },
];

export function flattenDocsNav(): DocsNavItem[] {
  return docsNav.flatMap((group) => group.items);
}
