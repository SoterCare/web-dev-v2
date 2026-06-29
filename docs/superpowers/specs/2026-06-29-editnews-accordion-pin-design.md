# EditNews Accordion + Pin Feature — Design Spec

**Date:** 2026-06-29  
**Approach:** A — `pinned` boolean on each article

---

## Summary

Three coordinated changes:
1. The `/editnews` editor becomes an accordion — blocks collapsed by default, date-sorted, with a pin toggle.
2. The public `/news` listing shows pinned articles first, then date-sorted.
3. The homepage `LatestNews` section fills its 3 slots with pinned-first, then latest non-pinned.

---

## Data Model

Add `pinned?: boolean` to `NewsArticle` in `src/types/news.ts`.

```ts
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  date: string;       // YYYY-MM-DD
  coverImage: string;
  tags: string[];
  pinned?: boolean;   // NEW — defaults to false/undefined
}
```

`news-store.ts` validation: accept `pinned` as an optional boolean; skip validation if absent (treat as `false`). No write-side enforcement needed — the editor enforces the cap.

---

## Sort Order (shared everywhere)

```
pinned articles (by date descending) → unpinned articles (by date descending)
```

A helper `sortArticles(articles: NewsArticle[]): NewsArticle[]` is extracted to `src/lib/news-sort.ts` so all three surfaces share identical logic.

---

## Editor (`/editnews`) — `NewsEditor.tsx`

### Ordering
- Remove `move()` function and ↑↓ buttons entirely.
- On mount and after every state change that affects date or pin, re-sort via `sortArticles`.

### Accordion
- Track `expandedId: string | null` in state (one open at a time).
- **Collapsed row** (default for all articles): `[Pin] · Title · Date badge · [Chevron] · [Delete]`
- **Expanded**: full form underneath the row, same card, smooth height transition.
- Clicking the collapsed row (except pin/delete buttons) toggles expansion.
- New article added via `addArticle()` auto-sets `expandedId` to the new article's id.

### Pin button
- Small `Pin` icon (Lucide) in the collapsed row, left of the title.
- Filled/accent color (`#3d7e93`) when pinned; muted when not.
- Clicking toggles `pinned`. If already at 3 pinned and user tries to pin a 4th, show a small inline toast/warning: *"Max 3 articles can be pinned."*
- After toggling pin, re-sort immediately so the article moves to its new position. `expandedId` follows the article (stays expanded after reorder).

### Remove
- ↑↓ ChevronUp/ChevronDown import and `move` function removed.
- Pin import added: `Pin` from lucide-react.

---

## Public `/news` page — `src/app/news/page.tsx`

Replace the current sort:
```ts
// before
const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));

// after
import { sortArticles } from '@/lib/news-sort';
const sorted = sortArticles(articles);
```

No other changes.

---

## Homepage `LatestNews` — `src/components/LatestNews.tsx`

Replace the current top-3 logic:
```ts
// before
.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)

// after
import { sortArticles } from '@/lib/news-sort';
sortArticles(articles).slice(0, 3)
```

`sortArticles` puts pinned-first so the first 3 results are: up to 3 pinned articles, then latest non-pinned to fill remaining slots.

No other visual changes to the component.

---

## New File: `src/lib/news-sort.ts`

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

---

## Files Changed

| File | Change |
|---|---|
| `src/types/news.ts` | Add `pinned?: boolean` |
| `src/lib/news-sort.ts` | New — shared sort helper |
| `src/lib/news-store.ts` | Accept optional `pinned` in validation |
| `src/app/editnews/NewsEditor.tsx` | Accordion UI, pin toggle, remove ↑↓, date-sort |
| `src/app/news/page.tsx` | Use `sortArticles` |
| `src/components/LatestNews.tsx` | Use `sortArticles` |

---

## Out of Scope

- Drag-to-reorder pinned articles (pin order is by date)
- Authentication for the editor (unchanged — dev-only)
- Any change to the article detail page (`/news/[slug]`)
