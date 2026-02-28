import type { MDXComponents } from "next-mdx-remote-client/rsc";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BASE_PATH } from "@/config/site";
import { DocsBadges } from "@/components/docs/docs-badges";

export const mdxComponents: MDXComponents = {
  DocsBadges,
  h1: ({ className, ...props }) => (
    <h1 className={cn("mt-2 scroll-m-20 font-heading text-3xl font-bold tracking-tight", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn("mt-10 scroll-m-20 border-b pb-2 font-heading text-2xl font-semibold tracking-tight first:mt-0", className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mt-8 scroll-m-20 font-heading text-xl font-semibold tracking-tight", className)} {...props} />
  ),
  h4: ({ className, ...props }) => (
    <h4 className={cn("mt-8 scroll-m-20 font-heading text-lg font-semibold tracking-tight", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props} />
  ),
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ className, ...props }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn("m-0 border-t p-0 even:bg-muted", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th className={cn("border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right", className)} {...props} />
  ),
  td: ({ className, ...props }) => (
    <td className={cn("border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right", className)} {...props} />
  ),
  pre: ({ className, ...props }) => (
    <pre className={cn("mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted/50 p-4 text-sm leading-relaxed [&>code]:bg-transparent [&>code]:p-0", className)} {...props} />
  ),
  code: ({ className, ...props }) => (
    <code className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm", className)} {...props} />
  ),
  img: ({ src, alt }) => {
    const imgSrc = src?.startsWith("/") ? `${BASE_PATH}${src}` : src;
    return <img src={imgSrc ?? ""} alt={alt ?? ""} className="rounded-lg border" />;
  },
  a: ({ className, href, ...props }) => {
    if (href?.startsWith("/")) {
      return <Link href={href} className={cn("font-medium underline underline-offset-4", className)} {...props} />;
    }
    if (href?.startsWith("#")) {
      return <a href={href} className={cn("font-medium no-underline", className)} {...props} />;
    }
    return (
      <a
        href={href}
        className={cn("font-medium underline underline-offset-4", className)}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  },
};
