import type { ScrapedTeamMember } from "@/types/team";
import * as cheerio from "cheerio";

const REVALIDATE = 60 * 60 * 24 * 20; // 20 days

export async function fetchBevyTeam(): Promise<ScrapedTeamMember[]> {
  const res = await fetch(process.env.CHAPTER_URL || '', {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,*/*",
      "Accept-Language": "en-US,en;q=0.9",
    },
    next: { revalidate: REVALIDATE },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch chapter page: ${res.status} ${res.statusText}`
    );
  }

  const html = await res.text();

  const members = parseOrganizers(html);

  /* console.log("[bevyTeam] parsed members:", members); */

  return members;
}

function parseOrganizers(html: string): ScrapedTeamMember[] {
  const $ = cheerio.load(html);

  const members: ScrapedTeamMember[] = [];

  const teamSection = $('[data-testid^="data-block-for-chapterTeam-"]');

  /* console.log(
    "[bevyTeam] team section found:",
    teamSection.length
  ); */

  teamSection
    .children('[data-testid^="container-block-"]')
    .each((_, card) => {
      const $card = $(card);

      const avatar =
        $card.find('img[src*="avatars"]').attr("src") ?? "";

      const profileHref =
        $card.find('a[href^="/u/"]').attr("href") ?? "";

      const profileSlug =
        profileHref.match(/\/u\/([^/]+)\//)?.[1] ?? "";

      const name = $card
        .find("strong")
        .map((_, el) => $(el).text().trim())
        .get()
        .find(
          text =>
            text &&
            text !== "View profile"
        ) ?? "";

      const title = $card
        .find("span")
        .map((_, el) => $(el).text().trim())
        .get()
        .find(
          text =>
            text &&
            text !== name &&
            text !== "View profile" &&
            !text.includes(name)
        ) ?? "";

     /*  console.log("[bevyTeam] member found:", {
        name,
        title,
        profileSlug,
        avatar,
      }); */

      if (!name || !profileSlug) {
        return;
      }

      members.push({
        name,
        title,
        avatar,
        profileSlug,
      });
    });

  return members;
}