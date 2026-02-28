import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { getDocBySlug, getAllDocSlugs } from "@/lib/docs";
import { mdxComponents } from "@/components/docs/mdx-components";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsPager } from "@/components/docs/docs-pager";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const resolvedSlug = slug ?? ["index"];
  try {
    const doc = getDocBySlug(resolvedSlug);
    return {
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
    };
  } catch {
    return {};
  }
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const resolvedSlug = slug ?? ["index"];

  let doc: ReturnType<typeof getDocBySlug>;
  try {
    doc = getDocBySlug(resolvedSlug);
  } catch {
    notFound();
  }

  return (
    <div className="flex w-full">
      <div className="min-w-0 flex-1 py-6 px-4 lg:px-6">
        <DocsBreadcrumb slug={resolvedSlug} />
        <Card className="mt-4">
          <CardHeader>
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              {doc.frontmatter.title}
            </h1>
            {doc.frontmatter.description && (
              <p className="text-base text-muted-foreground">
                {doc.frontmatter.description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div data-mdx-content>
              <MDXRemote
                source={doc.content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [rehypeAutolinkHeadings, { behavior: "wrap" }],
                      [rehypePrettyCode, { theme: { dark: "github-dark", light: "github-light" }, keepBackground: false }],
                    ],
                  },
                }}
                components={mdxComponents}
              />
            </div>
            <DocsPager slug={resolvedSlug} />
          </CardContent>
        </Card>
      </div>
      <DocsToc />
    </div>
  );
}
