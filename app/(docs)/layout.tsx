import { SiteHeader } from "@/components/header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsMobileNav } from "@/components/docs/docs-mobile-nav";
import { cn } from "@/lib/utils";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-secondary/40 supports-[overflow:clip]:overflow-clip dark:bg-background">
      <div
        className={cn(
          "container relative flex min-h-screen flex-col",
          "before:absolute before:inset-y-0 before:-left-px before:z-40 before:border-border before:border-dashed xl:before:border-l",
          "after:absolute after:inset-y-0 after:-right-px after:z-40 after:border-border after:border-dashed xl:after:border-r"
        )}
      >
        <SiteHeader>
          <DocsMobileNav />
        </SiteHeader>
        <div className="relative flex flex-1">
          <DocsSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
