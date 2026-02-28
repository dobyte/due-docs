import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-secondary/40 supports-[overflow:clip]:overflow-clip dark:bg-background">
      <div
        className={cn(
          "container relative flex min-h-screen flex-col",
          "before:absolute before:inset-y-0 before:-left-px before:z-40 before:border-border before:border-dashed xl:before:border-l",
          "after:absolute after:inset-y-0 after:-right-px after:z-40 after:border-border after:border-dashed xl:after:border-r"
        )}
      >
        <SiteHeader />
        <main className="relative grow">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
