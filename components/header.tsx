"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { GithubIcon, XIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { SearchCommand } from "@/components/search-command";
import { MY_HANDLE, SITE_NAME } from "@/config/site";

export function SiteHeader({ children }: { children?: React.ReactNode }) {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full",
				"after:-translate-x-1/2 after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:w-screen after:border-b after:border-dashed after:border-border",
				{
					"bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
						scrolled,
				}
			)}
		>
			<nav className="cpx flex h-14 items-center justify-between">
				<div className="flex items-center gap-5">
					{children}
					<Link
						className="rounded-lg px-3 py-2.5 font-bold text-lg tracking-tight hover:bg-muted dark:hover:bg-muted/50"
						href="/"
					>
						due
					</Link>
					<DesktopNav />
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<SearchCommand />
					<div className="h-6 border-r border-dashed" />
					<Button asChild size="icon-sm" variant="outline">
						<Link
							aria-label="github"
							href="https://github.com/dobyte/due"
							target="_blank"
						>
							<GithubIcon />
						</Link>
					</Button>
					<ThemeToggle />
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}
