import { NextResponse } from "next/server";
import { fetchBevyTeam } from "@/lib/bevyTeam";
import { enrichUser } from "@/lib/profileEnrichment";
import type { TeamApiResponse, TeamMember } from "@/types/team";

const cleanName = (name: string): string => {
  const parts = name.trim().split(/\s+/);

  if (parts.length > 1) {
    const last = parts[parts.length - 1];

    // Remove trailing "."
    if (last === ".") {
      parts.pop();
    }
    // Remove trailing digits
    else if (/\d/.test(last)) {
      parts.pop();
    }
  }

  return parts.join(" ").trim();
};

export async function GET(): Promise<NextResponse<TeamApiResponse>> {
  const scraped = await fetchBevyTeam();
  const enrichments = await Promise.all(
    scraped.map((m) => enrichUser(m.profileSlug))
  );
  const enrichMap = new Map(enrichments.map((e) => [e.profileSlug, e]));

  // first member in the list is the lead organizer
  const members: TeamMember[] = scraped.map((m, index) => {
    const enrich = enrichMap.get(m.profileSlug);
    return {
      name: cleanName(m.name),
      title: m.title,
      avatar: m.avatar,
      profileSlug: m.profileSlug,
      is_lead: index === 0,
      bio: enrich?.bio ?? null,
      linkedin: enrich?.linkedin ?? null,
      tags: enrich?.tags ?? [],
    };
  });

  return NextResponse.json(
    { members } satisfies TeamApiResponse,
  );
}