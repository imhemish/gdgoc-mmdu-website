export interface EventPicture {
  url: string;
  path: string;
  thumbnail_width: number;
  thumbnail_height: number;
  thumbnail_format: string;
  thumbnail_url: string;
}

export interface EventWrapupPhoto {
  id: number;
  order: number;
  picture: EventPicture;
}

export interface EventPerson {
  id: number;
  first_name: string;
  last_name: string;
  company: string;
  title: string;
  bio: string;
  picture: Omit<EventPicture, "thumbnail_width" | "thumbnail_height" | "thumbnail_format" | "thumbnail_url"> & {
    thumbnail_width: number;
    thumbnail_height: number;
    thumbnail_format: string;
    thumbnail_url: string;
  };
  personal_twitter: string;
  company_twitter: string;
  personal_linkedin_page: string;
  event_person_id: number;
}

export interface EventPartnerSponsor {
  id: number;
  name: string;
  url: string;
  logo: EventPicture;
}

export type AudienceType = "VIRTUAL" | "IN_PERSON" | "HYBRID";

export interface GDGEvent {
  id: number;
  title: string;
  description: string;
  audience_type: AudienceType;
  start_date: string; // ISO 8601
  end_date: string;   // ISO 8601
  url: string;
  static_url: string;
  video_url: string | null;
  slideshare_url: string | null;
  cropped_banner_url: string;
  cropped_picture_url: string;
  total_attendees: number;


  venue_name?: string;
  venue_address?: string;
  venue_city?: string;
  venue_state?: string;
  venue_zip_code?: string;

  event_wrapup_photos: EventWrapupPhoto[];

  facilitators: EventPerson[];
  hosts: EventPerson[];
  judges: EventPerson[];
  mentors: EventPerson[];
  moderators: EventPerson[];
  panelists: EventPerson[];
  speakers: EventPerson[];

  partners?: EventPartnerSponsor[];
  sponsors?: EventPartnerSponsor[];
}