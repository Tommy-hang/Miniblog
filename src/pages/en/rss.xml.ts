import rss from "@astrojs/rss";
import { site } from "../../site";
import { publishedWriting, slugOf } from "../../lib/content";

export async function GET(context: { site: URL }) {
  const posts = await publishedWriting("en");
  const base = import.meta.env.BASE_URL;

  return rss({
    title: `${site.name} — ${site.title}`,
    description: site.description,
    site: new URL(`${base}en/`, context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `${base}en/writing/${slugOf(post)}/`,
    })),
  });
}
