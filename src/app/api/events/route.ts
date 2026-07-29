import { NextRequest, NextResponse } from "next/server";
import { GDGEventSlimResponse } from "@/types/events";

const GDG_BASE_URL = "https://gdg.community.dev/api/event_slim/for_chapter";

const FIELDS = [
  "title",
  "start_date",
  "end_date",
  "cropped_picture_url",
  "url",
  "description_short",
  "id"
].join(",");

export async function GET(request: NextRequest) {
  const chapterId = process.env.CHAPTER_ID;

  if (!chapterId) {
    return NextResponse.json(
      { error: "CHAPTER_ID environment variable is not set" },
      { status: 500 }
    );
  }

  const { searchParams } = request.nextUrl;

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("page_size") ?? "8", 10))
  );
  const status = searchParams.get("status") ?? ""; // e.g. "Completed", "Upcoming"
  const order = searchParams.get("order") ?? "-start_date";

  const upstream = new URL(`${GDG_BASE_URL}/${chapterId}/`);
  upstream.searchParams.set("fields", FIELDS);
  upstream.searchParams.set("include_cohosted_events", "true");
  upstream.searchParams.set("visible_on_parent_chapter_only", "true");
  upstream.searchParams.set("order", order);
  upstream.searchParams.set("page", String(page));
  upstream.searchParams.set("page_size", String(pageSize));
  if (status) upstream.searchParams.set("status", status);

  let data: GDGEventSlimResponse;

  try {
    const res = await fetch(upstream.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 60*60*24*3 }, // 3 days
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    data = await res.json();
  } catch (err) {
    console.error("[/api/events] fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch events from GDG" },
      { status: 502 }
    );
  }

  const totalPages = Math.ceil(data.count / pageSize);

  return NextResponse.json({
    results: data.results,
    pagination: {
      total: data.count,
      page,
      page_size: pageSize,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_previous: page > 1,
      next_page: page < totalPages ? page + 1 : null,
      previous_page: page > 1 ? page - 1 : null,
    },
  });
}