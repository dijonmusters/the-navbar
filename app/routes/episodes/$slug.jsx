import { Client } from "@notionhq/client";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import { NotionToMarkdown } from "notion-to-md";

export const loader = async ({ params }) => {
  const resp = await fetch("https://cache.jonmeyers.workers.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetEpisode($slug: String!) {
          episode(slug: $slug) {
            audioUrl
            html
          }
        }
      `,
      variables: {
        slug: params.slug,
      },
    }),
  });

  const {
    data: { episode },
  } = await resp.json();
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
