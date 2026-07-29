import type { UserProfileEnrichment } from "@/types/team";

const REVALIDATE = 60 * 60 * 24 * 30; // 30 days

function decodeUnicode(str: string) {
  return str.replace(
    /\\u([\dA-Fa-f]{4})/g,
    (_, code) => String.fromCharCode(parseInt(code, 16))
  );
}

export async function enrichUser(
  profileSlug: string
): Promise<UserProfileEnrichment> {
  try {
    const res = await fetch(
      `https://gdg.community.dev/u/${profileSlug}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,*/*",
          "Accept-Language": "en-US,en;q=0.9",
        },
        next: { revalidate: REVALIDATE },
      }
    );

    if (!res.ok) {
      return {
        profileSlug,
        bio: null,
        linkedin: null,
        tags: [],
      };
    }

    const html = await res.text();

    return {
      profileSlug,
      bio: extractBio(html),
      linkedin: extractLinkedIn(html),
      tags: extractTags(html),
    };
  } catch (error) {
    console.error(
      `[bevyProfile] Failed to enrich ${profileSlug}:`,
      error
    );

    return {
      profileSlug,
      bio: null,
      linkedin: null,
      tags: [],
    };
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeJsString(value: string): string {
  return value
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .replace(/\\t/g, "\t")
    .trim();
}

function extractBio(html: string): string | null {
  const match = html.match(
    /userprofile:\s*\{[\s\S]*?bio:\s*'((?:\\.|[^'])*)'/i
  );

  if (!match?.[1]) {
    return null;
  }

  const bio = decodeJsString(match[1]);
  
  return decodeUnicode(bio) || null;
}

function extractLinkedIn(html: string): string | null {
  const match = html.match(
    /<a[^>]+href="(https?:\/\/(?:www\.)?linkedin\.com\/[^"]+)"[^>]+class="[^"]*icon-linkedin[^"]*"/i
  );

  return match?.[1] ?? null;
}

function extractTags(html: string): string[] {
  const match = html.match(
    /<div\s+class="tags">[\s\S]*?<\/span>\s*([\s\S]*?)\s*<\/div>/i
  );

  if (!match?.[1]) {
    return [];
  }

  return stripHtml(match[1])
    .split("·")
    .map((tag) => tag.trim())
    .filter(Boolean);
}