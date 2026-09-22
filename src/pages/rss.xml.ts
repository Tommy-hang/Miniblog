import rss from "@astrojs/rss";
import { site } from "../site";
import { publishedWriting, slugOf } from "../lib/content";

export async function GET(context: { site: URL }) {
  const posts = await publishedWriting("zh");
  const base = import.meta.env.BASE_URL;

  return rss({
    title: `${site.name} — 公开地思考`,
    description: "一个关于技术、设计与做好小事所需的小系统的安静出版物。",
    site: new URL(base, context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `${base}writing/${slugOf(post)}/`,
    })),
  });
}
