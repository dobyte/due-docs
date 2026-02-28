import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";

export function SiteFooter() {
	return (
		<footer className="relative">
			<div
				className={cn(
					"mx-auto max-w-5xl lg:border-x lg:border-dashed",
					"dark:bg-[radial-gradient(35%_80%_at_25%_0%,--theme(--color-foreground/.1),transparent)]"
				)}
			>
				<div className="-translate-x-1/2 absolute left-1/2 w-screen border-t border-dashed border-border" />
				<div className="grid max-w-5xl grid-cols-6 gap-6 p-4">
					<div className="col-span-6 flex flex-col gap-4 pt-5 md:col-span-4">
						<Link
							className="-ml-3 w-fit rounded-lg px-3 py-2.5 font-bold text-lg tracking-tight hover:bg-muted dark:hover:bg-muted/50"
							href="/"
						>
							due
						</Link>
						<p className="max-w-sm text-balance text-muted-foreground text-sm">
							为高性能而生的分布式游戏服务器框架。简洁、可靠、随时可用
						</p>
						<Button asChild size="icon-sm" variant="outline">
							<a href="https://github.com/dobyte/due" target="_blank" rel="noopener noreferrer">
								<GithubIcon />
							</a>
						</Button>
					</div>
					<div className="col-span-3 w-full md:col-span-1">
						<span className="text-muted-foreground text-xs">Resources</span>
						<div className="mt-2 flex flex-col gap-2">
							{resources.map(({ href, title }) => (
								<a
									className="w-max text-sm hover:underline"
									href={href}
									key={title}
								>
									{title}
								</a>
							))}
						</div>
					</div>
					<div className="col-span-3 w-full md:col-span-1">
						<span className="text-muted-foreground text-xs">Company</span>
						<div className="mt-2 flex flex-col gap-2">
							{company.map(({ href, title }) => (
								<a
									className="w-max text-sm hover:underline"
									href={href}
									key={title}
								>
									{title}
								</a>
							))}
						</div>
					</div>
				</div>
				<div className="-translate-x-1/2 absolute left-1/2 w-screen border-t border-dashed border-border" />
				<div className="flex max-w-4xl flex-col justify-between gap-2 py-4">
					<p className="text-center font-light text-muted-foreground text-sm">
						&copy; {new Date().getFullYear()} dobyte, guowei · MIT Licensed
					</p>
				</div>
			</div>
		</footer>
	);
}

const company = [
	{
		title: "About Us",
		href: "#",
	},
	{
		title: "Careers",
		href: "#",
	},
	{
		title: "Brand assets",
		href: "#",
	},
	{
		title: "Privacy Policy",
		href: "#",
	},
	{
		title: "Terms of Service",
		href: "#",
	},
];

const resources = [
	{
		title: "Blog",
		href: "#",
	},
	{
		title: "Help Center",
		href: "#",
	},
	{
		title: "Contact Support",
		href: "#",
	},
	{
		title: "Community",
		href: "#",
	},
	{
		title: "Security",
		href: "#",
	},
];

