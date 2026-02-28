"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { docsNav } from "@/config/docs";
import { Badge } from "@/components/ui/badge";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 md:block">
      <div className="h-full overflow-auto py-6 pl-4 pr-6 lg:pl-6">
        <DocsNavContent pathname={pathname} />
      </div>
    </aside>
  );
}

export function DocsNavContent({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-3">
      {docsNav.map((group) => (
        <Collapsible key={group.title} defaultOpen>
          <div>
            <CollapsibleTrigger className="group/collapsible flex w-full items-center justify-between py-1 text-sm font-medium">
              {group.title}
              <ChevronRight className="size-3.5 text-muted-foreground transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="mt-1 space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                        pathname === item.href
                          ? "bg-accent font-medium text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      {item.title}
                      {item.label && (
                        <Badge className="rounded-sm border-lime-500/20 bg-lime-500/10 px-1 py-0 text-[10px] text-lime-600 dark:text-lime-400">
                          {item.label}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
    </nav>
  );
}
