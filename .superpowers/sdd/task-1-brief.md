### Task 1: Add `pinned` to type + create sort helper

**Files:**
- Modify: `src/types/news.ts`
- Create: `src/lib/news-sort.ts`
- Modify: `src/lib/news-store.ts`

**Interfaces:**
- Produces: `sortArticles(articles: NewsArticle[]): NewsArticle[]` — used by Tasks 2, 3, 4

- [ ] **Step 1: Add `pinned` field to `NewsArticle`**

Open `src/types/news.ts` and replace its entire content with:

```ts
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
```

- [ ] **Step 2: Create `src/lib/news-sort.ts`**

```ts
import type { NewsArticle } from '@/types/news';

export function sortArticles(articles: NewsArticle[]): NewsArticle[] {
  return [...articles].sort((a, b) => {
    const aPinned = a.pinned ? 1 : 0;
    const bPinned = b.pinned ? 1 : 0;
    if (bPinned !== aPinned) return bPinned - aPinned;
    return b.date.localeCompare(a.date);
  });
}
```

- [ ] **Step 3: Update `news-store.ts` validation to accept `pinned`**

Open `src/lib/news-store.ts`. Replace the `validateArticle` function with:

```ts
function validateArticle(a: unknown, i: number): asserts a is NewsArticle {
  const art = a as Record<string, unknown>;
  for (const key of ['id', 'title', 'slug', 'summary', 'body', 'date', 'coverImage']) {
    if (typeof art[key] !== 'string') {
      throw new Error(`Article[${i}].${key} must be a string`);
    }
  }
  for (const key of ['id', 'title', 'slug', 'summary', 'body', 'date']) {
    if ((art[key] as string).trim() === '') {
      throw new Error(`Article[${i}].${key} must not be empty`);
    }
  }
  if (!DATE_RE.test(art.date as string)) {
    throw new Error(`Article[${i}].date must match YYYY-MM-DD, got "${art.date}"`);
  }
  if (!Array.isArray(art.tags) || art.tags.some((t) => typeof t !== 'string')) {
    throw new Error(`Article[${i}].tags must be an array of strings`);
  }
  if (art.pinned !== undefined && typeof art.pinned !== 'boolean') {
    throw new Error(`Article[${i}].pinned must be a boolean if present`);
  }
}
```

- [ ] **Step 4: Type-check**

Run:
```
npx tsc --noEmit
```

Expected: no errors (or only pre-existing unrelated errors).

- [ ] **Step 5: Commit**

```
git add src/types/news.ts src/lib/news-sort.ts src/lib/news-store.ts
git commit -m "feat: add pinned field to NewsArticle and shared sortArticles helper"
```
