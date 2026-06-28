# SoterCare News Editor Guide

A step-by-step reference for running the dev environment and managing news articles through the built-in CMS at `/editnews`.

---

## 1. Running the Dev Server

### Prerequisites

- Node.js 18 or later
- npm (comes with Node)

### Install dependencies

Run this once after cloning or pulling new changes:

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

The site will be available at **http://localhost:3000**

### Other useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Start local development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint |

---

## 2. Opening the News Editor

With the dev server running, navigate to:

```
http://localhost:3000/editnews
```

> **Important:** The editor is only accessible in development mode. In production it returns a 404 — this is intentional. Never deploy the editor; it has no authentication.

The editor is a standalone page separate from the patient monitoring dashboard at `/dashboard`. It does not require any login.

---

## 3. Editor Layout

```
┌─────────────────────────────────────────────────────────┐
│  📰  News Editor   [dev only]          View /news →  Save │  ← top bar
├─────────────────────────────────────────────────────────┤
│  Articles   N articles · changes saved to data/news.json │
│                                          [ + Add article ]│
│  ┌───────────────────────────────────────────────────┐   │
│  │ ↑ ↓  #1  Article title                       🗑️  │   │
│  │  Title · Slug · Date · Summary · Body · Tags · Image │
│  └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

- **Top bar** — always visible. Hit **Save** to write changes to disk.
- **View /news →** — opens the public news page in a new tab.
- **↑ ↓** — reorder articles (display order on `/news` follows this).
- **🗑️** — delete an article (asks for confirmation).
- **+ Add article** — prepends a blank article to the top of the list.

---

## 4. Adding and Editing Articles

### Step-by-step

1. Click **+ Add article** — a blank form appears at the top.
2. Fill in the **Title** field first. The **Slug** auto-generates from the title while it's empty (e.g. "Our Latest Update" → `our-latest-update`). Edit the slug manually afterwards if needed.
3. Set the **Date** (YYYY-MM-DD picker).
4. Write a **Summary** — one or two sentences shown on the card and in search previews.
5. Write the full **Body**.
6. Add **Tags**.
7. Upload a **Cover Image** (see section 5 below).
8. Click **Save**.

### Field reference

| Field | Notes |
|---|---|
| **Title** | Shown as the card heading and article `<h1>`. |
| **Slug** | URL path segment — `your-slug` → `/news/your-slug`. Must be unique. Lowercase letters, numbers, hyphens only. Auto-filled from title while blank. |
| **Date** | ISO format `YYYY-MM-DD`. Used for sorting (newest first). |
| **Summary** | 1–2 sentences. Shown on listing cards and as the article pull-quote. Also used as the page `<meta description>`. |
| **Body** | Full article text. Separate paragraphs with a **blank line**. No Markdown, no HTML — plain text only. |
| **Tags** | Type a tag and press **Enter** or click away to add it. Click the ✕ on a chip to remove. |
| **Cover Image** | Displayed at the top of the article and as the card thumbnail. See section 5. |

### Body formatting tips

Paragraphs are split on blank lines:

```
This is the first paragraph.

This is the second paragraph.

This is the third paragraph.
```

Single line breaks within a paragraph are merged — they render as a single `<p>` block.

---

## 5. Cover Images — Use WebP

### The editor converts automatically

When you upload any image (JPG, PNG, HEIC, etc.) through the **Upload image** button, the editor runs it through Sharp and saves a `.webp` file at **quality 85** to `public/images/news/`. You do not need to pre-convert.

### Prepare images for best results

Even though conversion is automatic, starting from a high-quality source gives the best output:

| Recommendation | Detail |
|---|---|
| **Preferred format to upload** | WebP or PNG (lossless source → better q85 output) |
| **Aspect ratio** | 16:9 works best — cards display at `h-48` (192 px) and the article header at up to `h-80` (320 px) |
| **Minimum resolution** | 1200 × 675 px |
| **Ideal resolution** | 1600 × 900 px |
| **Maximum file size to upload** | Keep source under 10 MB |

### What happens on upload

1. File is sent to the server action `uploadNewsImageAction`.
2. Sharp decodes the source, resizes if oversized, encodes to WebP at quality 85.
3. File is saved to `public/images/news/<slugified-name>.webp`.
4. The path `/images/news/<name>.webp` is stored in the article's `coverImage` field.
5. The thumbnail preview updates instantly in the editor.

### Replacing a cover image

Click **Replace image** on any article that already has a cover. The old file stays on disk (safe to delete manually from `public/images/news/` if you want to clean up).

---

## 6. Saving

Click **Save** in the top-right corner. This writes all articles to:

```
data/news.json
```

This file is the single source of truth. The public `/news` page reads directly from it at build time (production) or on each request (dev). After saving in dev, refresh `/news` to see the changes live — no server restart needed.

> **Do not edit `data/news.json` by hand** while the editor is open. The editor holds state in memory and will overwrite your manual edits on next save.

---

## 7. Reordering Articles

Use the **↑** and **↓** buttons on each article card to change the display order. The `/news` listing page sorts by **date descending** regardless of order here, but the homepage **Latest News** section shows the 3 most recent by date — so date is what matters for visibility there.

---

## 8. Viewing Changes Live

- **Public news listing:** http://localhost:3000/news
- **Individual article:** http://localhost:3000/news/your-slug
- **Homepage section:** http://localhost:3000/#news

After clicking **Save**, refresh any of the above pages in your browser — no restart required in dev mode.

---

## 9. Data File Location

```
project-root/
├── data/
│   └── news.json          ← all article data (source of truth)
├── public/
│   └── images/
│       └── news/          ← uploaded cover images (WebP)
└── src/
    ├── app/
    │   ├── editnews/      ← the CMS editor (dev only)
    │   └── news/          ← public news pages
    └── components/
        └── LatestNews.tsx ← homepage "Latest News" section
```

---

## 10. Troubleshooting

| Problem | Fix |
|---|---|
| `/editnews` shows 404 | Make sure `NODE_ENV=development` — run `npm run dev`, not `npm run start`. |
| Image upload fails | Check that `public/images/news/` directory exists (a `.gitkeep` file keeps it tracked). |
| Changes not showing on `/news` | Click **Save** first, then hard-refresh the browser (`Ctrl+Shift+R`). |
| Slug conflict | Two articles cannot share the same slug. Edit one slug manually before saving. |
| Article not appearing on homepage | The homepage section shows the 3 articles with the **most recent date**. Update the date field. |
