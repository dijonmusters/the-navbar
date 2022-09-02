import { Client } from "@notionhq/client";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import { NotionToMarkdown } from "notion-to-md";

export const loader = async ({ params }) => {
  const notion = new Client({
    auth: NOTION_API_SECRET,
    notionVersion: "2022-02-22",
  });

  const page = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: "Slug",
      formula: {
        string: {
          equals: `/episodes/${params.slug}`,
        },
      },
    },
  });

  const [rawEpisode] = page.results;

  const n2m = new NotionToMarkdown({ notionClient: notion });
  const mdblocks = await n2m.pageToMarkdown(rawEpisode.id);
  const md = n2m.toMarkdownString(mdblocks);
  const html = marked.parse(md);

  const episode = {
    audioUrl: rawEpisode.properties["Audio URL"].url,
    html,
  };

  return json({ episode });
};

const Episode = () => {
  const { episode } = useLoaderData();

  return (
    <div className="flex-1 bg-slate-700 p-16">
      <audio src={episode.audioUrl} controls />
      <div
        className=" prose prose-invert"
        dangerouslySetInnerHTML={{ __html: episode.html }}
      />
    </div>
  );
};

export default Episode;
