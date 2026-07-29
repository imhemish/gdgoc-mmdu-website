interface GDGEventSlim {
  title: string;
  start_date: string;
  event_type_title: string;
  cropped_picture_url: string;
  cropped_banner_url: string;
  url: string;
  cohost_registration_url: string;
  description: string;
  description_short: string;
  id: string;
}

interface GDGEventSlimResponse {
  count: number;
  links: { next: string | null; previous: string | null };
  pagination: {
    previous_page: number | null;
    current_page: number;
    next_page: number | null;
    page_size: number;
  };
  results: GDGEventSlim[];
}

export type { GDGEventSlim, GDGEventSlimResponse };