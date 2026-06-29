# EditNews Accordion + Pin Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add collapsible accordion blocks, date-based sorting, and a pin-to-top feature (max 3) to `/editnews`, with pinned articles surfaced first on `/news` and the homepage Latest News section.

**Architecture:** A new `pinned?: boolean` field on `NewsArticle` is the single source of truth. A shared `sortArticles()` helper in `src/lib/news-sort.ts` implements pinned-first, then date-descending ordering — imported by the editor, the public news page, and the homepage component. The editor becomes an accordion: all cards collapsed by default, one open at a time, manual ↑↓ buttons removed.

**Tech Stack:** Next.js 14 App Router, TypeScript, React, Tailwind CSS, Lucide React

## Global Constraints

- `pinned` is optional (`boolean | undefined`); absence means `false`
- Max 3 articles can be pinned simultaneously — enforced in the editor only
- Sort order everywhere: pinned articles (date desc) → unpinned (date desc)
- Editor: one article expanded at a time; new articles auto-expand
- No changes to `/news/[slug]` article detail page
- Dev-only editor guard unchanged (`process.env.NODE_ENV === 'production'` → 404)
- Lucide icon to use for pin: `Pin` (filled style via CSS when active)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/types/news.ts` | Modify | Add `pinned?: boolean` to `NewsArticle` |
| `src/lib/news-sort.ts` | Create | Shared `sortArticles()` helper |
| `src/lib/news-store.ts` | Modify | Accept optional `pinned` in validation |
| `src/app/editnews/NewsEditor.tsx` | Modify | Accordion UI, pin toggle, remove ↑↓ |
| `src/app/news/page.tsx` | Modify | Use `sortArticles` |
| `src/components/LatestNews.tsx` | Modify | Use `sortArticles` |

---

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

Open `src/lib/news-store.ts`. The `validateArticle` function currently checks specific keys. Add a check that `pinned`, when present, is a boolean. Replace the `validateArticle` function with:

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

---

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

---

### Task 3: Rewrite `NewsEditor.tsx` — accordion + pin + date sort

**Files:**
- Modify: `src/app/editnews/NewsEditor.tsx`

**Interfaces:**
- Consumes: `sortArticles(articles: NewsArticle[]): NewsArticle[]` from `@/lib/news-sort`
- Consumes: `NewsArticle`, `NewsData` from `@/types/news`
- Consumes: `saveNewsAction`, `uploadNewsImageAction` from `../dashboard/news-actions`

**Behaviour contract:**
- `expandedId: string | null` — only one article open at a time
- Clicking a collapsed row opens it (and closes any other)
- Pin toggle: if article is pinned → unpin; if not pinned and pinned count < 3 → pin; if not pinned and pinned count === 3 → show inline warning, do nothing
- After every pin toggle or date change, articles re-sort in place; `expandedId` stays on the same article (it moves, not resets)
- New article (via `addArticle`) auto-sets `expandedId` to the new article's id
- Delete confirmation unchanged

- [ ] **Step 1: Replace the full `NewsEditor.tsx`**

Replace the entire file content with the following. Read carefully — `ChevronUp`/`ChevronDown` are kept for the expand/collapse chevron (not reordering), `Pin` replaces the reorder role, `move` function is removed.

```tsx
"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDown, ChevronUp, Plus, Trash2, X,
  Save, Upload, Loader2, Newspaper, Pin,
} from 'lucide-react';
import type { NewsArticle, NewsData } from '@/types/news';
import { sortArticles } from '@/lib/news-sort';
import { saveNewsAction, uploadNewsImageAction } from '../dashboard/news-actions';

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function emptyArticle(): NewsArticle {
  return {
    id: crypto.randomUUID(),
    title: '',
    slug: '',
    summary: '',
    body: '',
    date: new Date().toISOString().split('T')[0],
    coverImage: '',
    tags: [],
    pinned: false,
  };
}

function TagInput({
  tags,
  onAdd,
  onRemove,
}: {
  tags: string[];
  onAdd: (t: string) => void;
  onRemove: (t: string) => void;
}) {
  const [input, setInput] = useState('');

  const commit = () => {
    const val = input.trim();
    if (val) { onAdd(val); setInput(''); }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 text-xs font-medium bg-[#a0cbdb]/20 text-[#3d7e93] px-2.5 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="hover:text-red-500 transition-colors"
              aria-label={`Remove tag ${tag}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
        onBlur={commit}
        placeholder="Type a tag and press Enter"
        className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
      />
    </div>
  );
}

function CoverUpload({
  value,
  onUpload,
}: {
  value: string;
  onUpload: (p: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const result = await uploadNewsImageAction(fd);
      onUpload(result.path);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-start gap-4">
      {value ? (
        <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-[var(--bg-panel)] flex-shrink-0 border border-black/5">
          <Image src={value} alt="Cover preview" fill className="object-cover" sizes="128px" />
        </div>
      ) : (
        <div className="w-32 h-20 rounded-xl bg-[var(--bg-panel)] border border-dashed border-black/10 flex items-center justify-center flex-shrink-0">
          <Upload size={16} className="text-[var(--text-muted)]" />
        </div>
      )}
      <div className="flex flex-col gap-2 flex-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-panel)] border border-black/5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors disabled:opacity-50 w-fit"
        >
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
          {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
        </button>
        {value && (
          <p className="text-xs text-[var(--text-muted)] font-mono truncate max-w-[220px]">{value}</p>
        )}
        {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}

export default function NewsEditor({ initialData }: { initialData: NewsData }) {
  const [articles, setArticles] = useState<NewsArticle[]>(() =>
    sortArticles(initialData.articles)
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pinWarning, setPinWarning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const pinnedCount = articles.filter((a) => a.pinned).length;

  const update = (id: string, patch: Partial<NewsArticle>) =>
    setArticles((prev) =>
      sortArticles(prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
    );

  const handleTitleChange = (id: string, title: string) => {
    setArticles((prev) =>
      sortArticles(
        prev.map((a) => {
          if (a.id !== id) return a;
          const autoSlug = a.slug === '' || a.slug === slugify(a.title);
          return { ...a, title, slug: autoSlug ? slugify(title) : a.slug };
        })
      )
    );
  };

  const togglePin = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (!article) return;
    if (!article.pinned && pinnedCount >= 3) {
      setPinWarning(true);
      setTimeout(() => setPinWarning(false), 3000);
      return;
    }
    update(id, { pinned: !article.pinned });
  };

  const addArticle = () => {
    const fresh = emptyArticle();
    setArticles((prev) => sortArticles([fresh, ...prev]));
    setExpandedId(fresh.id);
  };

  const removeArticle = (id: string) => {
    if (!confirm('Remove this article?')) return;
    setArticles((prev) => prev.filter((a) => a.id !== id));
    setExpandedId((prev) => (prev === id ? null : prev));
  };

  const addTag = (id: string, tag: string) =>
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id && !a.tags.includes(tag) ? { ...a, tags: [...a.tags, tag] } : a
      )
    );

  const removeTag = (id: string, tag: string) =>
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, tags: a.tags.filter((t) => t !== tag) } : a))
    );

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    setSaved(false);
    try {
      await saveNewsAction({ articles });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] relative">
      {/* Dotted background */}
      <div
        className="fixed top-0 left-0 z-0 h-full w-full pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#e5e7eb 2px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-[var(--bg-body)]/90 backdrop-blur border-b border-black/[0.06]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <Newspaper size={16} className="text-[#3d7e93] flex-shrink-0" />
              <span className="text-sm font-bold text-[var(--text)] tracking-tight truncate">
                <span className="hidden sm:inline">SoterCare — </span>News Editor
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-panel)] px-2 py-0.5 rounded-full border border-black/5 ml-0.5 flex-shrink-0">
                dev only
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link
                href="/news"
                target="_blank"
                className="hidden sm:block text-xs font-semibold text-[var(--text-muted)] hover:text-[#3d7e93] transition-colors"
              >
                View /news →
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#3d7e93] text-white hover:bg-[#2d6478] disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
          {/* Status strip */}
          {(saved || saveError || pinWarning) && (
            <div
              className={`text-center text-xs py-1 font-medium ${
                saveError
                  ? 'bg-red-50 text-red-600'
                  : pinWarning
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-[#a0cbdb]/10 text-[#3d7e93]'
              }`}
            >
              {saveError || (pinWarning ? 'Max 3 articles can be pinned.' : 'Saved successfully.')}
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-16">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-[var(--text)]">Articles</h1>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                {articles.length} article{articles.length !== 1 ? 's' : ''} · changes saved to{' '}
                <code className="font-mono text-[10px] bg-[var(--bg-panel)] px-1.5 py-0.5 rounded">
                  data/news.json
                </code>
                {pinnedCount > 0 && (
                  <span className="ml-2 text-[#3d7e93] font-semibold">
                    · {pinnedCount}/3 pinned
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={addArticle}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-m)] text-[var(--text-muted)] hover:text-[#3d7e93] transition-colors border border-black/[0.04]"
            >
              <Plus size={13} />
              Add article
            </button>
          </div>

          {/* Article list */}
          <div className="space-y-3">
            {articles.length === 0 && (
              <div className="text-center py-20 text-[var(--text-muted)]">
                <p className="font-medium">No articles yet.</p>
                <button
                  type="button"
                  onClick={addArticle}
                  className="mt-3 text-[#3d7e93] text-sm font-semibold hover:underline"
                >
                  Add your first article →
                </button>
              </div>
            )}

            {articles.map((article) => {
              const isOpen = expandedId === article.id;
              return (
                <div
                  key={article.id}
                  className={`bg-[var(--bg-card)] rounded-3xl shadow-[var(--shadow-m)] overflow-hidden border ${
                    article.pinned ? 'border-[#3d7e93]/20' : 'border-black/[0.03]'
                  }`}
                >
                  {/* Collapsed header row — always visible */}
                  <div
                    className="flex items-center gap-2 px-4 sm:px-5 py-3.5 cursor-pointer select-none"
                    onClick={() => setExpandedId(isOpen ? null : article.id)}
                  >
                    {/* Pin button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); togglePin(article.id); }}
                      className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                        article.pinned
                          ? 'text-[#3d7e93] bg-[#3d7e93]/10'
                          : 'text-[var(--text-muted)] hover:text-[#3d7e93] hover:bg-[var(--bg-panel)]'
                      }`}
                      aria-label={article.pinned ? 'Unpin article' : 'Pin article'}
                    >
                      <Pin size={13} className={article.pinned ? 'fill-[#3d7e93]' : ''} />
                    </button>

                    {/* Title + date */}
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text)] truncate">
                        {article.title || <span className="text-[var(--text-muted)] font-normal italic">Untitled</span>}
                      </span>
                      {article.date && (
                        <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--bg-panel)] px-2 py-0.5 rounded-full flex-shrink-0">
                          {article.date}
                        </span>
                      )}
                      {article.pinned && (
                        <span className="text-[10px] font-semibold text-[#3d7e93] bg-[#3d7e93]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                          Pinned
                        </span>
                      )}
                    </div>

                    {/* Delete + chevron */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeArticle(article.id); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                        aria-label="Remove article"
                      >
                        <Trash2 size={13} />
                      </button>
                      <span className="p-1.5 text-[var(--text-muted)]">
                        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    </div>
                  </div>

                  {/* Expanded form */}
                  {isOpen && (
                    <div className="px-4 sm:px-6 pb-6 pt-1 border-t border-black/[0.04]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Title</label>
                          <input
                            type="text"
                            value={article.title}
                            onChange={(e) => handleTitleChange(article.id, e.target.value)}
                            placeholder="Article title"
                            className="w-full px-4 py-2.5 text-base font-medium rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Slug</label>
                          <input
                            type="text"
                            value={article.slug}
                            onChange={(e) => update(article.id, { slug: e.target.value })}
                            placeholder="url-friendly-slug"
                            className="w-full px-4 py-2.5 text-sm font-mono rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Date</label>
                          <input
                            type="date"
                            value={article.date}
                            onChange={(e) => update(article.id, { date: e.target.value })}
                            className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Summary</label>
                          <textarea
                            value={article.summary}
                            onChange={(e) => update(article.id, { summary: e.target.value })}
                            rows={2}
                            placeholder="One or two sentence teaser shown on the card."
                            className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Body</label>
                          <textarea
                            value={article.body}
                            onChange={(e) => update(article.id, { body: e.target.value })}
                            rows={12}
                            placeholder="Full article content. Separate paragraphs with a blank line."
                            className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-panel)] border border-black/5 text-[var(--text)] placeholder:text-[var(--text-muted)] resize-y focus:outline-none focus:ring-1 focus:ring-[#a0cbdb]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Tags</label>
                          <TagInput
                            tags={article.tags}
                            onAdd={(t) => addTag(article.id, t)}
                            onRemove={(t) => removeTag(article.id, t)}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Cover Image</label>
                          <CoverUpload
                            value={article.coverImage}
                            onUpload={(p) => update(article.id, { coverImage: p })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Start dev server and verify visually**

```
npm run dev
```

Open `http://localhost:3000/editnews` and check:
- Articles render as collapsed rows (title + date badge visible, form hidden)
- Clicking a row expands the form; clicking again or clicking another row collapses it
- Pin icon (📌) appears left of each title; clicking it fills the icon and shows a "Pinned" badge
- Pinned articles move to the top of the list
- Trying to pin a 4th article shows the amber warning strip "Max 3 articles can be pinned."
- No ↑↓ reorder buttons anywhere
- "X/3 pinned" counter appears in the subtitle when any article is pinned
- Save still works; reloading the editor shows pinned state persisted

Open `http://localhost:3000/news`:
- Pinned articles appear before non-pinned ones

Open `http://localhost:3000` and scroll to Latest News:
- Pinned articles appear in the 3-slot grid first

- [ ] **Step 4: Commit**

```
git add src/app/editnews/NewsEditor.tsx
git commit -m "feat: accordion collapse, pin toggle, date sort in NewsEditor"
```

---

## Self-Review Checklist

- [x] `pinned?: boolean` added to type → Task 1 Step 1
- [x] `sortArticles` helper created → Task 1 Step 2
- [x] `news-store.ts` validation updated → Task 1 Step 3
- [x] `/news` page uses `sortArticles` → Task 2 Step 1
- [x] `LatestNews` uses `sortArticles` → Task 2 Step 2
- [x] Editor accordion (collapsed by default, one open at a time) → Task 3
- [x] Pin button with 3-cap and warning → Task 3
- [x] New article auto-expands → Task 3 (`addArticle` sets `expandedId`)
- [x] ↑↓ reorder buttons removed → Task 3 (not present in replacement)
- [x] Pinned articles re-sort immediately after toggle → Task 3 (`update` calls `sortArticles`)
- [x] `expandedId` survives re-sort (follows article by id) → Task 3
