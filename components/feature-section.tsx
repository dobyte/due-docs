import { FeatureCard } from "@/registry/blocks/feature/1/feature-card";
import { ZapIcon, CpuIcon, FingerprintIcon, PencilIcon, Settings2Icon, SparklesIcon } from "lucide-react";

export function FeatureSection() {
	return (
		<div className="mx-auto w-full max-w-5xl space-y-8">
			<div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-4">
				<h2 className="font-bold text-3xl tracking-tighter lg:text-4xl">
					先刷重点
				</h2>
				<p className="text-center text-muted-foreground text-sm">
					为构建高性能分布式游戏架构而准备的一切
				</p>
			</div>

			<div>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
					{features.map((feature) => (
						<FeatureCard feature={feature} key={feature.title} />
					))}
				</div>
			</div>
		</div>
	);
}

const features = [
	{
		title: "生而分布式",
		icon: ZapIcon,
		description: "天然支持集群部署，规模增长，无需重构",
	},
	{
		title: "自由组合",
		icon: CpuIcon,
		description: "模块按需加载，系统始终保持优雅",
	},
	{
		title: "规则即效率",
		icon: FingerprintIcon,
		description: "统一开发规范，复杂项目依然清晰",
	},
	{
		title: "扩展，不设边界",
		icon: PencilIcon,
		description: "清晰接口设计，功能接入简单直接",
	},
	{
		title: "稳定，是基础",
		icon: Settings2Icon,
		description: "历经真实业务验证，长期稳定运行",
	},
	{
		title: "只谈性能",
		icon: SparklesIcon,
		description: "单机 20W+ TPS，轻松支撑高并发",
	},
];
