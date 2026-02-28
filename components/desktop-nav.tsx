import Link from "next/link";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { EcoNavContent } from "@/components/eco-nav-content";

export function DesktopNav() {
	return (
		<NavigationMenu className="hidden md:flex" viewport={false}>
			<NavigationMenuList>
				<NavigationMenuLink asChild className="px-4">
					<Link className="rounded-md p-2 hover:bg-accent" href="/docs">
						文档
					</Link>
				</NavigationMenuLink>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent">
						生态
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<EcoNavContent />
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuLink asChild className="px-4">
					<Link className="rounded-md p-2 hover:bg-accent" href="/join">
						加入我们
					</Link>
				</NavigationMenuLink>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
