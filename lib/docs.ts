import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/docs");

export type DocFrontmatter = {
  title: string;
  description?: string;
};

export type Doc = {
  frontmatter: DocFrontmatter;
  content: string;
};

export function getDocBySlug(slug: string[]): Doc {
  const filePath = path.join(CONTENT_DIR, ...slug) + ".mdx";
  const indexPath = path.join(CONTENT_DIR, ...slug, "index.mdx");

  let raw: string;
  if (fs.existsSync(filePath)) {
    raw = fs.readFileSync(filePath, "utf-8");
  } else if (fs.existsSync(indexPath)) {
    raw = fs.readFileSync(indexPath, "utf-8");
  } else {
    throw new Error(`Doc not found: ${slug.join("/")}`);
  }

  const { data, content } = matter(raw);
  return {
    frontmatter: data as DocFrontmatter,
    content,
  };
}

export function getAllDocSlugs(): (string[] | undefined)[] {
  const slugs: (string[] | undefined)[] = [];

  function walk(dir: string, prefix: string[]) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...prefix, entry.name]);
      } else if (entry.name.endsWith(".mdx")) {
        const name = entry.name.replace(/\.mdx$/, "");
        if (name === "index") {
          slugs.push(prefix.length > 0 ? prefix : undefined);
        } else {
          slugs.push([...prefix, name]);
        }
      }
    }
  }

  walk(CONTENT_DIR, []);
  return slugs;
}

export type TocHeading = {
  depth: number;
  text: string;
  id: string;
};

export function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const text = match[2].trim();
    headings.push({
      depth: match[1].length,
      text,
      id: text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-"),
    });
  }

  return headings;
}
