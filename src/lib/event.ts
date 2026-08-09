import type { EventPerson, GDGEvent } from "@/types/event";

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
  "sponsors_list",
].join(",");

const GDG_API_BASE = "https://gdg.community.dev/api/event";

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

function cleanDescription(description?: string | null) {
  if (!description) return "";

  return description.replace(/<\/p>/gi, "\n\n");
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

  // Example:
  // https://www.slideshare.net/slideshow/example/123456
  // or URLs containing id=123456

  const match = slideshareUrl.match(/id=(\d+)/i);

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
    if (url.hostname.includes("youtu.be")) {
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

export async function getGDGEvent(
  slug: string
): Promise<GDGEvent | null> {
  if (!slug) return null;

  const upstream =
    `${GDG_API_BASE}/${encodeURIComponent(slug)}?fields=${GDG_FIELDS}`;

  try {
    const response = await fetch(upstream, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 360,
      },
    });

    if (!response.ok) {
      console.error(
        `GDG API returned ${response.status} for ${slug}`
      );

      return null;
    }

    const data: GDGEvent = await response.json();

    return {
      ...data,

      partners: processPartners(
        (data as any).partners_list
      ),

      sponsors: processPartners(
        (data as any).sponsors_list
      ),

      description: cleanDescription(
        data.description
      ),

      slideshare_url: getSlideshareEmbed(
        data.slideshare_url
      ),

      video_url: getYoutubeEmbed(
        data.video_url
      ),

      facilitators: processPeople(data.facilitators) as EventPerson[],
      hosts: processPeople(data.hosts) as EventPerson[],
      judges: processPeople(data.judges) as EventPerson[],
      mentors: processPeople(data.mentors) as EventPerson[],
      moderators: processPeople(data.moderators) as EventPerson[],
      panelists: processPeople(data.panelists) as EventPerson[],
      speakers: processPeople(data.speakers) as EventPerson[],
    };
  } catch (error) {
    console.error("Failed to fetch GDG event:", error);
    return null;
  }
}