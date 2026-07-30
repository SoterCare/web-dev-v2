# SoterCare — Website & Web Dashboard

The Next.js application behind **[sotercare.com](https://sotercare.com)**. It serves three things: the public product site, the [SoterCare Developers](https://sotercare.com/community) community page, and an authenticated dashboard for live monitoring data.

Built collaboratively by student developers. See [SoterCare Developers](https://github.com/SoterCare/community) for the community behind it.

## Features

- **Product site** — hero, mission, product, features, pricing, team, and FAQ sections with GSAP-driven scroll animation and Lenis smooth scrolling
- **Community page** — [`/community`](https://sotercare.com/community): the student developer community, its events, impact figures, partners, and GitHub links
- **News** — [`/news`](https://sotercare.com/news) index and per-article pages, statically generated from a JSON-backed store
- **Newsroom editor** — `/editnews`, a protected editor for creating and updating articles, with image cropping
- **Web dashboard** — `/dashboard`, authenticated; live vitals over Socket.IO, alerts, device list, activity timeline, and a recycle bin
- **SEO** — generated `sitemap.xml` and `robots.txt`, JSON-LD structured data, per-route metadata
- **Email** — transactional sending via Resend with React Email templates

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 16** (App Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** · `styled-components` |
| Animation | **GSAP** + `@gsap/react` · **Lenis** smooth scroll |
| Realtime | **socket.io-client** |
| Email | **Resend** + `@react-email/components` |
| Icons | **lucide-react** |
| Analytics | **@vercel/analytics** |

## Project structure

```
src/
  app/
    page.tsx            homepage
    community/          community page
    news/               news index + [slug] article pages
    dashboard/          authenticated dashboard (login, timeline, recycle-bin)
    editnews/           newsroom editor
    api/                alerts · auth · dashboard · devices · me · timeline
    sitemap.ts          generated sitemap
    robots.ts           generated robots.txt
  components/           page sections, popups, and dashboard widgets
  lib/                  data access helpers (news store, etc.)
data/
  news.json             news article source of truth
public/assets/          images, logos, and event photos
```

## Running locally

```bash
git clone https://github.com/SoterCare/web-dev-v2.git
cd web-dev-v2
npm install
npm run dev             # http://localhost:3000
```

Dashboard and email features need environment variables (API endpoint, auth secret, Resend key). Without them the public pages still render; the dashboard will not authenticate.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm start        # serve the production build
npm run lint     # ESLint
```

## Contributors

Built by student developers in the SoterCare Developers community — Daham, Hirusha, Komudi, Kaweesha, Nimna, and Sanjula. See the [contributors graph](https://github.com/SoterCare/web-dev-v2/graphs/contributors) for the full record.

## Related repositories

- [Mobile_App](https://github.com/SoterCare/Mobile_App) — the React Native (Expo) mobile client
- [community](https://github.com/SoterCare/community) — events, guides, and how to get involved

---

<sub>Maintained by <a href="https://github.com/SoterCare">SoterCare Developers</a>.</sub>
