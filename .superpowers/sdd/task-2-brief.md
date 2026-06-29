### Task 2: Update public `/news` page and homepage

**Files:**
- Modify: `src/app/news/page.tsx`
- Modify: `src/components/LatestNews.tsx`

**Interfaces:**
- Consumes: `sortArticles(articles: NewsArticle[]): NewsArticle[]` from `@/lib/news-sort`

- [ ] **Step 1: Update `src/app/news/page.tsx`**

Add the import at the top of the file (after existing imports):
```ts
import { sortArticles } from '@/lib/news-sort';
```

Find the line:
```ts
const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
```

Replace with:
```ts
const sorted = sortArticles(articles);
```

- [ ] **Step 2: Update `src/components/LatestNews.tsx`**

Add import at the top (after `import type { NewsArticle } from '@/types/news';`):
```ts
import { sortArticles } from '@/lib/news-sort';
```

Find the current top-3 selection:
```ts
const articles = (newsJson.articles as NewsArticle[])
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 3);
```

Replace with:
```ts
const articles = sortArticles(newsJson.articles as NewsArticle[]).slice(0, 3);
```

- [ ] **Step 3: Type-check**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```
git add src/app/news/page.tsx src/components/LatestNews.tsx
git commit -m "feat: sort news by pinned-first then date on /news and homepage"
```
