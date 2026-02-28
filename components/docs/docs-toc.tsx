"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = {
  id: string;
  text: string;
  depth: number;
};

export function DocsToc() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll("[data-mdx-content] h2, [data-mdx-content] h3")
    );

    const items: TocItem[] = elements.map((el) => ({
      id: el.id,
      text: el.textContent ?? "",
      depth: el.tagName === "H2" ? 2 : 3,
    }));

    setHeadings(items);

    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0 }
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-52 shrink-0 xl:block">
      <div className="h-full overflow-auto py-6 pr-4 lg:pr-6">
        <p className="mb-3 text-sm font-medium">本页目录</p>
        <nav>
          <ul className="space-y-1.5 text-sm">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "block text-muted-foreground transition-colors hover:text-foreground",
                    heading.depth === 3 && "pl-3",
                    activeId === heading.id && "text-foreground font-medium"
                  )}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
