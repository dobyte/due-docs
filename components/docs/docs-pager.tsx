import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { flattenDocsNav } from "@/config/docs";

export function DocsPager({ slug }: { slug: string[] }) {
  const items = flattenDocsNav();
  const href = slug[0] === "index" ? "/docs" : `/docs/${slug.join("/")}`;
  const currentIndex = items.findIndex((item) => item.href === href);

  const prev = currentIndex > 0 ? items[currentIndex - 1] : null;
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  return (
    <div className="flex items-center justify-between pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          {prev.title}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {next.title}
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
