"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { FileTextIcon } from "lucide-react";

import { docsNav } from "@/config/docs";
import { Button } from "@/components/ui/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

export function SearchCommand() {
	const [open, setOpen] = React.useState(false);
	const router = useRouter();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const runCommand = React.useCallback((command: () => void) => {
		setOpen(false);
		command();
	}, []);

	return (
		<>
			<Button
				variant="outline"
				size="sm"
				className="text-muted-foreground gap-2"
				onClick={() => setOpen(true)}
			>
				<SearchIcon className="size-4" />
				<span className="hidden lg:inline">搜索文档</span>
				<kbd className="bg-muted pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
					<span className="text-xs">&#8984;</span>K
				</kbd>
			</Button>
			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				title="Search Documentation"
				description="Search for a documentation page to navigate to..."
				className="border-0"
			>
				<CommandInput placeholder="Type to search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					{docsNav.map((group) => (
						<CommandGroup key={group.title} heading={group.title}>
							{group.items.map((item) => (
								<CommandItem
									key={item.href}
									value={item.title}
									onSelect={() =>
										runCommand(() => router.push(item.href))
									}
								>
									<FileTextIcon className="size-4" />
									{item.title}
								</CommandItem>
							))}
						</CommandGroup>
					))}
				</CommandList>
			</CommandDialog>
		</>
	);
}
