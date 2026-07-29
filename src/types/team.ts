export interface ScrapedTeamMember {
  name: string;
  title: string;
  avatar: string;
  profileSlug: string;
}

export interface UserProfileEnrichment {
  profileSlug: string;
  bio: string | null;
  linkedin: string | null;
  tags: string[];
}

export interface TeamMember {
  name: string;
  title: string;
  avatar: string;
  profileSlug: string;
  is_lead: boolean;
  bio: string | null;
  linkedin: string | null;
  tags: string[];
}

export interface TeamApiResponse {
  members: TeamMember[];
}