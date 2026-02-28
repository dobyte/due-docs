export type EcoCategory = {
	label: string;
	children: { label: string; href: string }[];
};

export const ecoLinks: EcoCategory[] = [
	{
		label: "相关项目",
		children: [
			{ label: "官方示例", href: "https://github.com/dobyte/due-examples" },
			{ label: "压测示例", href: "https://github.com/dobyte/due-benchmark" },
			{ label: "聊天室示例", href: "https://github.com/dobyte/due-chat" },
			{ label: "斗地主示例", href: "https://github.com/dobyte/due-doudizhu-desc" },
		],
	},
	{
		label: "相关工具库",
		children: [
			{ label: "JWT", href: "https://github.com/dobyte/jwt" },
			{ label: "Casbin", href: "https://github.com/dobyte/gorm-casbin" },
			{ label: "Http Client", href: "https://github.com/dobyte/http" },
			{ label: "Gorm Dao Generator", href: "https://github.com/dobyte/gorm-dao-generator" },
			{ label: "Mongo Dao Generator", href: "https://github.com/dobyte/mongo-dao-generator" },
		],
	},
	{
		label: "相关客户端",
		children: [
			{ label: "TS 客户端", href: "https://github.com/dobyte/due-client-ts" },
			{ label: "C# 客户端", href: "https://github.com/dobyte/due-client-shape" },
		],
	},
];
