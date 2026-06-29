import type { NewsArticle } from '@/types/news';

export function sortArticles(articles: NewsArticle[]): NewsArticle[] {
  return [...articles].sort((a, b) => {
    const aPinned = a.pinned ? 1 : 0;
    const bPinned = b.pinned ? 1 : 0;
    if (bPinned !== aPinned) return bPinned - aPinned;
    return b.date.localeCompare(a.date);
  });
}
