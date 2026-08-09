import { fetchBevyTeam } from "@/lib/bevyTeam";
import { enrichUser } from "@/lib/profileEnrichment";
import type { TeamMember } from "@/types/team";

const cleanName = (name: string): string => {
  const parts = name.trim().split(/\s+/);

  if (parts.length > 1) {
    const last = parts[parts.length - 1];
    if (last === ".") {
      parts.pop();
    } else if (/\d/.test(last)) {
      parts.pop();
    }
  }

  return parts.join(" ").trim();
};

export async function getTeamMembers(): Promise<TeamMember[]> {
  const scraped = await fetchBevyTeam();
  const enrichments = await Promise.all(
    scraped.map((m) => enrichUser(m.profileSlug))
  );
  const enrichMap = new Map(enrichments.map((e) => [e.profileSlug, e]));

  return scraped.map((m, index) => {
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
}