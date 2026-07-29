interface ChapterPhotoItem {
  id: number;
  order: number;
  picture: { url: string; thumbnail_url: string };
  chapter: number;
}

interface ChapterPhotosResponse {
  count: number;
  results: ChapterPhotoItem[];
}

export type { ChapterPhotoItem, ChapterPhotosResponse };