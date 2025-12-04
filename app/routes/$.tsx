import type { Route } from "./+types/$";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  // Handle well-known paths by returning 404
  if (url.pathname.startsWith("/.well-known/")) {
    throw new Response("Not Found", { status: 404 });
  }

  // For other unmatched routes, also throw 404
  throw new Response("Not Found", { status: 404 });
}

export default function CatchAll() {
  // This should never render since we always throw in the loader
  return null;
}