import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

export const revalidate = 3600;

const MAX_POSTS = 8;
const FIELDS = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "timestamp",
  "children{media_type,media_url,thumbnail_url}",
].join(",");

interface InstagramMediaLink {
  id: string;
  url: string;
  type: "image" | "video";
}

interface InstagramPost {
  shortcode: string;
  postType: "image" | "video" | "carousel";
  caption: string;
  taken_at_timestamp: number;
  media_count: number;
  video_duration: null;
  links: InstagramMediaLink[];
  isReel: boolean;
}

interface GraphMedia {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  children?: { data?: GraphMedia[] };
}

function mediaUrl(node: GraphMedia): string | null {
  return node.media_url || node.thumbnail_url || null;
}

function shortcodeFromPermalink(permalink: string): string {
  return permalink.match(/\/(?:p|reel|reels)\/([^/?#]+)/)?.[1] ?? "";
}

function toLink(node: GraphMedia, index: number): InstagramMediaLink | null {
  const url = mediaUrl(node);
  if (!url) return null;
  return {
    id: node.id ?? String(index),
    url,
    type: node.media_type === "VIDEO" ? "video" : "image",
  };
}

function mapItem(item: GraphMedia): InstagramPost | null {
  const carousel = item.media_type === "CAROUSEL_ALBUM";
  const nodes = carousel ? (item.children?.data ?? []) : [item];
  const links = nodes
    .map((node, index) => toLink(node, index))
    .filter((link): link is InstagramMediaLink => link !== null);

  const resolved = links.length > 0 ? links : [toLink(item, 0)].filter((link): link is InstagramMediaLink => link !== null);
  if (resolved.length === 0) return null;

  const permalink = item.permalink ?? "";
  const taken = item.timestamp ? Math.floor(Date.parse(item.timestamp) / 1000) : 0;

  return {
    shortcode: shortcodeFromPermalink(permalink),
    postType: carousel ? "carousel" : item.media_type === "VIDEO" ? "video" : "image",
    caption: item.caption ?? "",
    taken_at_timestamp: Number.isNaN(taken) ? 0 : taken,
    media_count: carousel ? Math.max(nodes.length, resolved.length, 1) : 1,
    video_duration: null,
    links: resolved,
    isReel: permalink.includes("/reel/"),
  };
}

function failure(error: string) {
  noStore();
  return NextResponse.json({ error }, { status: 500 });
}

export async function GET() {
  const token = process.env.IG_ACCESS_TOKEN;
  const userId = process.env.IG_USER_ID;

  if (!token || !userId) {
    return failure("IG_ACCESS_TOKEN and IG_USER_ID are required");
  }

  const upstream = new URL(`https://graph.instagram.com/v21.0/${encodeURIComponent(userId)}/media`);
  upstream.searchParams.set("fields", FIELDS);
  upstream.searchParams.set("limit", String(MAX_POSTS));
  upstream.searchParams.set("access_token", token);

  try {
    const response = await fetch(upstream, { next: { revalidate: 3600 } });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        body && typeof body === "object" && body.error && typeof body.error.message === "string"
          ? body.error.message
          : `Instagram API returned ${response.status}`;
      return failure(message);
    }

    const items: GraphMedia[] = Array.isArray(body?.data) ? body.data : [];
    const posts = items
      .slice(0, MAX_POSTS)
      .map(mapItem)
      .filter((post): post is InstagramPost => post !== null)
      .sort((a, b) => b.taken_at_timestamp - a.taken_at_timestamp);

    return NextResponse.json({ posts });
  } catch (err) {
    console.error(err);
    return failure(err instanceof Error ? err.message : "Unknown error");
  }
}
