import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../site";

export async function GET(context: { site: URL }) {
  const posts = (await getCollection("writing", ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const base = import.meta.env.BASE_URL;

  return rss({
    title: site.name,
    description: site.description,
    site: new URL(base, context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `${base}writing/${post.id}/`,
    })),
  });
}
