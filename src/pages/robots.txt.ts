export function GET({ site }: { site: URL }) {
  const base = import.meta.env.BASE_URL;
  return new Response(`User-agent: *\nAllow: ${base}\nSitemap: ${new URL(`${base}sitemap-index.xml`, site)}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
