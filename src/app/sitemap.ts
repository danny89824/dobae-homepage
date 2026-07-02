import type { MetadataRoute } from "next";

const SITE_URL = "https://dobaeym.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/portfolio", "/guide", "/finder", "/stores", "/estimate", "/about"];
  const now = new Date();
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/estimate" || path === "/finder" ? 0.9 : 0.7,
  }));
}
