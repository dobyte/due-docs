// https://motion-primitives.com/docs/infinite-slider

import { cn } from "@/lib/utils";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";

type Testimonial = {
	quote: string;
	image: string;
	name: string;
	role: string;
	company?: string;
};

const testimonials: Testimonial[] = [
	{
		quote:
			"最好的 Go 游戏开源项目，各模块接口清晰。从学习游戏后端的技术来说，也是不二之选。",
		image: "https://avatars.githubusercontent.com/u/62499904?v=4",
		name: "Guowei Gong",
		role: "游戏服务器",
		company: "南棠羽星溯",
	},
	{
		quote:
			"第一次学习游戏服务器就遇到它，少奋斗好几个月。",
		image: "/avatar/Sparrow.jpg",
		name: "Sparrow",
		role: "游戏客户端",
		company: "网易游戏",
	},
	{
		quote:
			"有一些设计我觉得还存在问题，但瑕不掩瑜，DUE 框架整体设计非常优秀，值得推荐。",
		image: "",
		name: "Feiyu Yi",
		role: "游戏服务器",
	},
	{
		quote:
			"一个字爽，两个字超爽，三个字超级爽。",
		image: "",
		name: "is2-Breakthrough",
		role: "游戏服务器",
		company: "远程"
	},
	{
		quote:
			"基础组件丰富，切换简单，能随意搭配，配置简单，快速上手容易，使用后只需要关注业务代码，无疑是 Go 游戏服务器首选",
		image: "https://avatars.githubusercontent.com/u/44959801?v=4",
		name: "Ricardo",
		role: "游戏服务器",
		company: "高图游戏",
	},
	{
		quote:
			"内置 Node Gateway Mesh 三个服务，非常方便，让我可以快速搭建一个游戏服务器。",
		image: "https://avatars.githubusercontent.com/u/52000718?v=4",
		name: "Zhiming Zhang",
		role: "游戏服务器",
		company: "远程"
	}
];

const firstColumn = testimonials.slice(0, Math.ceil(testimonials.length / 3));
const secondColumn = testimonials.slice(Math.ceil(testimonials.length / 3), Math.ceil((testimonials.length * 2) / 3));
const thirdColumn = testimonials.slice(Math.ceil((testimonials.length * 2) / 3));

export function TestimonialsSection() {
	return (
		<section className="relative py-10">
			<div className="mx-auto max-w-5xl">
				<div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-4">
					<h2 className="font-bold text-3xl tracking-tighter lg:text-4xl">
						他们选择了我们
					</h2>
					<p className="text-center text-muted-foreground text-sm">
						以及，为什么
					</p>
				</div>

				<div
					className={cn(
						"mt-10 flex max-h-160 justify-center gap-6 overflow-hidden",
						"mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]"
					)}
				>
					<InfiniteSlider direction="vertical" speed={30} speedOnHover={15}>
						{firstColumn.map((testimonial) => (
							<TestimonialsCard
								key={testimonial.name}
								testimonial={testimonial}
							/>
						))}
					</InfiniteSlider>
					<InfiniteSlider
						className="hidden md:block"
						direction="vertical"
						speed={50}
						speedOnHover={25}
					>
						{secondColumn.map((testimonial) => (
							<TestimonialsCard
								key={testimonial.name}
								testimonial={testimonial}
							/>
						))}
					</InfiniteSlider>
					<InfiniteSlider
						className="hidden lg:block"
						direction="vertical"
						speed={35}
						speedOnHover={17}
					>
						{thirdColumn.map((testimonial) => (
							<TestimonialsCard
								key={testimonial.name}
								testimonial={testimonial}
							/>
						))}
					</InfiniteSlider>
				</div>
			</div>
		</section>
	);
}

function TestimonialsCard({
	testimonial,
	className,
	...props
}: React.ComponentProps<"figure"> & {
	testimonial: Testimonial;
}) {
	const { quote, image, name, role, company } = testimonial;
	return (
		<figure
			className={cn(
				"w-full max-w-xs rounded-3xl border bg-card p-8 shadow-foreground/10 shadow-lg dark:bg-card/20",
				className
			)}
			{...props}
		>
			<blockquote>{quote}</blockquote>
			<figcaption className="mt-5 flex items-center gap-2">
				<Avatar className="size-8 rounded-full">
					<AvatarImage alt={`${name}'s profile picture`} src={image} />
					<AvatarFallback>{name.charAt(0)}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<cite className="font-medium not-italic leading-5 tracking-tight">
						{name}
					</cite>
					<span className="text-muted-foreground text-sm leading-5 tracking-tight">
						{role} {company && `, ${company}`}
					</span>
				</div>
			</figcaption>
		</figure>
	);
}
