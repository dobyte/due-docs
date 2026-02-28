import Link from "next/link";
import { cn } from "@/lib/utils/index";
import React from "react";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { Button } from "@/components/ui/button";
import { ecoLinks } from "@/components/nav-links";
import { XIcon, MenuIcon } from "lucide-react";

export function MobileNav() {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="md:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="md:hidden"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				<div
					className={cn(
						"transition-all",
						open ? "scale-100 opacity-100" : "scale-0 opacity-0"
					)}
				>
					<XIcon />
				</div>
				<div
					className={cn(
						"absolute transition-all",
						open ? "scale-0 opacity-0" : "scale-100 opacity-100"
					)}
				>
					<MenuIcon />
				</div>
			</Button>
			{open && (
				<Portal className="top-14">
					<PortalBackdrop />
					<div
						className={cn(
							"size-full overflow-y-auto p-4",
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in"
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="flex w-full flex-col gap-y-2">
							<Link className="rounded-lg p-2 text-sm font-medium active:bg-muted" href="/docs">文档</Link>
							{ecoLinks.map((cat) => (
								<div key={cat.label}>
									<span className="px-2 text-xs text-muted-foreground">{cat.label}</span>
									{cat.children.map((link) => (
										<a
											className="block rounded-lg px-2 py-1.5 text-sm active:bg-muted dark:active:bg-muted/50"
											key={link.label}
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
										>
											{link.label}
										</a>
									))}
								</div>
							))}
						</div>
						<Link className="rounded-lg p-2 text-sm font-medium active:bg-muted" href="/join">加入我们</Link>

					</div>
				</Portal>
			)}
		</div>
	);
}
