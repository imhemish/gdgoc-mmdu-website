import type { NextRequest } from "next/server";
import type { GDGEvent } from "@/types/event";

function processPartners(list?: any[]) {
  if (!Array.isArray(list)) return [];

  return list
    .filter((item) => item.visible !== false)
    .map((item) => ({
      id: item.id,
      name: item.company,
      url: item.url,
      logo: item.logo,
    }));
}

const GDG_FIELDS = [
  "id",
  "title",
  "description",
  "audience_type",
  "start_date",
  "end_date",
  "url",
  "static_url",
  "video_url",
  "slideshare_url",
  "cropped_banner_url",
  "cropped_picture_url",
  "total_attendees",
  "venue_name",
  "venue_address",
  "venue_city",
  "venue_state",
  "venue_zip_code",
  "event_wrapup_photos",
  "facilitators",
  "hosts",
  "judges",
  "mentors",
  "moderators",
  "panelists",
  "speakers",
  "partners_list",
  "sponsors_list"
].join(",");

const GDG_API_BASE = "https://gdg.community.dev/api/event";

function cleanDescription(description?: string | null) {
  if (!description) return "";

  let text = description;

  // Convert paragraph endings
  text = text.replace(/<\/p>/gi, "\n\n");

  return text;
}

function normalizeLinkedIn(url?: string | null) {
  if (!url) return url;

  const value = url.trim();

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `https://linkedin.com/in/${value.replace(/^\/+/, "")}`;
}

function processPeople(people?: any[]) {
  if (!Array.isArray(people)) return people;

  return people.map((person) => ({
    ...person,
    personal_linkedin_page: normalizeLinkedIn(
      person.personal_linkedin_page
    ),
  }));
}

function getSlideshareEmbed(slideshareUrl?: string | null) {
  if (!slideshareUrl) return null;

  const match = slideshareUrl.match(/\[slideshare\s+id=(\d+)\]/i);

  if (!match) return slideshareUrl;

  return `https://www.slideshare.net/slideshow/embed_code/${match[1]}`;
}

function getYoutubeEmbed(videoUrl?: string | null) {
  if (!videoUrl) return null;

  try {
    const url = new URL(
      videoUrl.startsWith("http")
        ? videoUrl
        : `https://${videoUrl}`
    );

    let videoId: string | null = null;

    // youtube.com/watch?v=
    if (
      url.hostname.includes("youtube.com") &&
      url.searchParams.has("v")
    ) {
      videoId = url.searchParams.get("v");
    }

    // youtu.be/
    if (
      url.hostname.includes("youtu.be")
    ) {
      videoId = url.pathname.split("/")[1];
    }

    // youtube.com/embed/
    if (
      url.hostname.includes("youtube.com") &&
      url.pathname.startsWith("/embed/")
    ) {
      videoId = url.pathname.split("/")[2];
    }

    return videoId
      ? `https://www.youtube.com/embed/${videoId}`
      : videoUrl;
  } catch {
    return videoUrl;
  }
}

/* ---------------- Route ---------------- */

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return Response.json(
      { error: "Missing event slug" },
      { status: 400 }
    );
  }

  const upstream = `${GDG_API_BASE}/${slug}?fields=${GDG_FIELDS}`;

  let response: Response;

  try {
    response = await fetch(upstream, {
      headers: { Accept: "application/json" },
      next: { revalidate: 360 },
    });
  } catch {
    return Response.json(
      { error: "Failed to reach GDG API" },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return Response.json(
      { error: `GDG API returned ${response.status}` },
      { status: response.status }
    );
  }

  const data: GDGEvent = await response.json();

  const processed = {
    ...data,

    partners: processPartners((data as any).partners_list),
    sponsors: processPartners((data as any).sponsors_list),

    description: cleanDescription(data.description),

    slideshare_url: getSlideshareEmbed(
      data.slideshare_url
    ),

    video_url: getYoutubeEmbed(
      data.video_url
    ),

    facilitators: processPeople(data.facilitators),
    hosts: processPeople(data.hosts),
    judges: processPeople(data.judges),
    mentors: processPeople(data.mentors),
    moderators: processPeople(data.moderators),
    panelists: processPeople(data.panelists),
    speakers: processPeople(data.speakers),
  };

  return Response.json(processed, {
    status: 200,
  });
}