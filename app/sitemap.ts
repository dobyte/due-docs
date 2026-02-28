import type { MetadataRoute } from "next";
import { SITE_HOME_URL } from "@/config/site";
import { getAllDocSlugs } from "@/lib/docs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const date = new Date().toISOString();

  const docSlugs = getAllDocSlugs();
  const docRoutes = docSlugs
    .filter((slug): slug is string[] => slug !== undefined)
    .map((slug) => ({
      url: `${SITE_HOME_URL}/docs/${slug.join("/")}`,
      lastModified: date,
    }));

  return [
    { url: SITE_HOME_URL, lastModified: date },
    { url: `${SITE_HOME_URL}/join`, lastModified: date },
    ...docRoutes,
  ];
}
