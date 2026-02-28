import type React from "react";
import type { LucideIcon } from "lucide-react";
import { MessageCircleIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BASE_PATH } from "@/config/site";

export function JoinUs() {
	const socialLinks = [
		{
			icon: GithubIcon,
			href: "https://github.com/dobyte/due",
			label: "GitHub",
		},
		{
			icon: GithubIcon,
			href: "https://github.com/dobyte/due/issues",
			label: "Issues",
		},
	];

	return (
		<div className="mx-auto h-full min-h-screen max-w-5xl lg:border-x lg:border-dashed">
			<div className="flex grow flex-col justify-center px-4 py-18 md:items-center">
				<h1 className="font-bold text-4xl md:text-5xl">加入我们</h1>
				<p className="mb-5 text-base text-muted-foreground">
					与开发者一起交流分享
				</p>
			</div>
			<BorderSeparator />
			<div className="grid md:grid-cols-2">
				<Box
					description="实时交流，技术讨论。如发现二维码过期，请添加群主微信进群"
					icon={MessageCircleIcon}
					title="微信群"
				>
					<div className="flex flex-col items-center gap-3">
						<img
							alt="微信群二维码"
							className="w-40 rounded-lg border"
							src={`${BASE_PATH}/docs/images/group_qrcode.jpeg`}
						/>
						<span className="text-muted-foreground text-xs">
							扫码加入微信交流群
						</span>
					</div>
				</Box>
				<Box
					className="border-b-0 md:border-r-0"
					description="群主微信，直接拉到 due 开发群，添加时候简单说明下目的，感谢"
					icon={UserIcon}
					title="个人微信"
				>
					<div className="flex flex-col items-center gap-3">
						<img
							alt="个人微信二维码"
							className="w-40 rounded-lg border"
							src={`${BASE_PATH}/docs/images/personal_qrcode.jpeg`}
						/>
						<span className="text-muted-foreground text-xs">
							扫码添加个人微信
						</span>
					</div>
				</Box>
			</div>
			<BorderSeparator />
			<div className="z-1 flex h-full flex-col items-center justify-center gap-4 py-24">
				<h2 className="text-center font-medium text-2xl text-muted-foreground tracking-tight md:text-3xl">
					在这里 <span className="text-foreground">找到我们</span>
				</h2>
				<div className="flex flex-wrap items-center gap-2">
					{socialLinks.map((link) => (
						<a
							className="flex items-center gap-x-2 rounded-full border bg-card px-3 py-1.5 shadow hover:bg-accent"
							href={link.href}
							key={link.label}
							rel="noopener noreferrer"
							target="_blank"
						>
							<link.icon className="size-3.5 text-muted-foreground" />
							<span className="font-medium font-mono text-xs tracking-wide">
								{link.label}
							</span>
						</a>
					))}
				</div>
			</div>
		</div>
	);
}

function BorderSeparator({ className }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"absolute inset-x-0 h-px w-full border-b",
				className,
			)}
		/>
	);
}

type ContactBox = React.ComponentProps<"div"> & {
	icon: LucideIcon;
	title: string;
	description: string;
};

function Box({
	title,
	description,
	className,
	children,
	...props
}: ContactBox) {
	return (
		<div
			className={cn(
				"flex flex-col justify-between border-b md:border-r md:border-b-0",
				className,
			)}
		>
			<div className="flex items-center gap-x-3 border-b bg-secondary/50 p-4 dark:bg-secondary/20">
				<props.icon
					className="size-5 text-muted-foreground"
					strokeWidth={1}
				/>
				<h2 className="font-heading font-medium text-lg tracking-wider">
					{title}
				</h2>
			</div>
			<div className="flex items-center justify-center gap-x-2 p-4 py-12">
				{children}
			</div>
			<div className="border-t p-4">
				<p className="text-muted-foreground text-sm">{description}</p>
			</div>
		</div>
	);
}

const GithubIcon = (props: React.ComponentProps<"svg">) => (
	<svg fill="currentColor" viewBox="0 0 1024 1024" {...props}>
		<path
			clipRule="evenodd"
			d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
			fill="currentColor"
			fillRule="evenodd"
			transform="scale(64)"
		/>
	</svg>
);
