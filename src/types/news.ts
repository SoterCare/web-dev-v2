export type ContentBlock =
  | { type: 'text'; content: string }
  | { type: 'image'; src: string; caption: string };

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  bodyBlocks?: ContentBlock[];
  date: string; // YYYY-MM-DD
  coverImage: string;
  tags: string[];
  pinned?: boolean;
}

export interface NewsData {
  articles: NewsArticle[];
}
