import { json } from "@remix-run/cloudflare";
import { useLoaderData, Outlet } from "@remix-run/react";
import { Link } from "react-router-dom";

export const loader = async () => {
  const resp = await fetch("https://cache.jonmeyers.workers.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          episodes {
            id
            title
            slug
          }
        }
      `,
    }),
  });

  const {
    data: { episodes },
  } = await resp.json();
  return json({ episodes });
};

const Episodes = () => {
  const { episodes } = useLoaderData();

  return (
    <div className="min-h-screen flex max-w-7xl mx-auto">
      <div className="w-64 p-16">
        {episodes.map((episode) => (
          <Link
            key={episode.id}
            to={episode.slug}
            prefetch="intent"
            className="block"
          >
            {episode.title}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default Episodes;
