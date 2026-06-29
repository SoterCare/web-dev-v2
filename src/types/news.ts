export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  date: string; // YYYY-MM-DD
  coverImage: string;
  tags: string[];
  pinned?: boolean;
}

export interface NewsData {
  articles: NewsArticle[];
}
