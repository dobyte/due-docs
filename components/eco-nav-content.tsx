"use client";

import { useState } from "react";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { ecoLinks } from "@/components/nav-links";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";

export function EcoNavContent() {
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<div className="grid w-[420px] grid-cols-[140px_1fr]">
			<div className="space-y-1 border-r pr-1">
				{ecoLinks.map((cat, i) => (
					<div
						key={cat.label}
						className={cn(
							"flex items-center justify-between rounded-sm px-3 py-2 text-sm cursor-default transition-colors",
							i === activeIndex
								? "bg-accent text-accent-foreground"
								: "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
						)}
						onMouseEnter={() => setActiveIndex(i)}
					>
						{cat.label}
						<ChevronRightIcon className="size-3.5 opacity-50" />
					</div>
				))}
			</div>
			<div className="space-y-1 pl-1">
				{ecoLinks[activeIndex].children.map((link) => (
					<NavigationMenuLink asChild key={link.label}>
						<a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
						>
							<div className="font-medium text-sm">{link.label}</div>
						</a>
					</NavigationMenuLink>
				))}
			</div>
		</div>
	);
}
