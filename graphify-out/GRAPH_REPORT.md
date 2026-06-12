# Graph Report - .  (2026-06-12)

## Corpus Check
- Large corpus: 128 files � ~786,013 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 564 nodes · 684 edges · 70 communities (52 shown, 18 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 108 edges (avg confidence: 0.91)
- Token cost: 18,048 input · 9,200 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Alerts & Activity Timeline|Alerts & Activity Timeline]]
- [[_COMMUNITY_App Router & Server Actions|App Router & Server Actions]]
- [[_COMMUNITY_Dependencies & Packages|Dependencies & Packages]]
- [[_COMMUNITY_HeroFooter Design Brainstorm|Hero/Footer Design Brainstorm]]
- [[_COMMUNITY_Dashboard Layout & Navigation|Dashboard Layout & Navigation]]
- [[_COMMUNITY_Landing Page & Marketing|Landing Page & Marketing]]
- [[_COMMUNITY_API Route Handlers|API Route Handlers]]
- [[_COMMUNITY_Contact Email Templates|Contact Email Templates]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Mobile App UI Mockups|Mobile App UI Mockups]]
- [[_COMMUNITY_Newsletter Email Templates|Newsletter Email Templates]]
- [[_COMMUNITY_Waitlist Email Templates|Waitlist Email Templates]]
- [[_COMMUNITY_Mobile Dashboard Features|Mobile Dashboard Features]]
- [[_COMMUNITY_Mock Data Generators|Mock Data Generators]]
- [[_COMMUNITY_Hero Marketing Image|Hero Marketing Image]]
- [[_COMMUNITY_Thigh Node Hardware|Thigh Node Hardware]]
- [[_COMMUNITY_Footer Lifestyle Photography|Footer Lifestyle Photography]]
- [[_COMMUNITY_Edge Gateway Product|Edge Gateway Product]]
- [[_COMMUNITY_Edge Gateway Hardware Detail|Edge Gateway Hardware Detail]]
- [[_COMMUNITY_Thigh Node Wearable|Thigh Node Wearable]]
- [[_COMMUNITY_Footer B&W Photography|Footer B&W Photography]]
- [[_COMMUNITY_Footer Hand Care Image|Footer Hand Care Image]]
- [[_COMMUNITY_SoterCare Centered Logo|SoterCare Centered Logo]]
- [[_COMMUNITY_SoterCare Primary Logo|SoterCare Primary Logo]]
- [[_COMMUNITY_React Native Stack|React Native Stack]]
- [[_COMMUNITY_Open Graph Social Images|Open Graph Social Images]]
- [[_COMMUNITY_Test Schema Scripts|Test Schema Scripts]]
- [[_COMMUNITY_Team Assets|Team Assets]]
- [[_COMMUNITY_Hero Background Photos|Hero Background Photos]]
- [[_COMMUNITY_SoterCare Healthcare Brand|SoterCare Healthcare Brand]]
- [[_COMMUNITY_Placeholder Footer Images|Placeholder Footer Images]]
- [[_COMMUNITY_PostgreSQL Database|PostgreSQL Database]]
- [[_COMMUNITY_Vercel Deployment Asset|Vercel Deployment Asset]]
- [[_COMMUNITY_Wrist Node Device|Wrist Node Device]]
- [[_COMMUNITY_Flask Backend|Flask Backend]]
- [[_COMMUNITY_NestJS Backend|NestJS Backend]]
- [[_COMMUNITY_404 Not Found Page|404 Not Found Page]]
- [[_COMMUNITY_SoterCare White Logo|SoterCare White Logo]]
- [[_COMMUNITY_Next.js SVG Asset|Next.js SVG Asset]]
- [[_COMMUNITY_Team Member Sanjula|Team Member Sanjula]]
- [[_COMMUNITY_Device Status Component|Device Status Component]]
- [[_COMMUNITY_Globe SVG Icon|Globe SVG Icon]]
- [[_COMMUNITY_Window SVG Icon|Window SVG Icon]]
- [[_COMMUNITY_WebSocket Test|WebSocket Test]]
- [[_COMMUNITY_Proxy Configuration|Proxy Configuration]]
- [[_COMMUNITY_Team Member Daham|Team Member Daham]]
- [[_COMMUNITY_Edge Impulse ML|Edge Impulse ML]]
- [[_COMMUNITY_ESP Microcontroller|ESP Microcontroller]]
- [[_COMMUNITY_Next.js Framework|Next.js Framework]]
- [[_COMMUNITY_Raspberry Pi|Raspberry Pi]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_File SVG Icon|File SVG Icon]]
- [[_COMMUNITY_Fetch Test Script|Fetch Test Script]]
- [[_COMMUNITY_Events Test Script|Events Test Script]]
- [[_COMMUNITY_Team Member Hirusha|Team Member Hirusha]]
- [[_COMMUNITY_Team Member Kanchana|Team Member Kanchana]]
- [[_COMMUNITY_API Test Script|API Test Script]]
- [[_COMMUNITY_VS Code Settings|VS Code Settings]]
- [[_COMMUNITY_Brainstorm Placeholder|Brainstorm Placeholder]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `proxyRequest()` - 16 edges
3. `useDeviceId()` - 12 edges
4. `useDashboardWebSocket()` - 11 edges
5. `proxyGet()` - 10 edges
6. `dashboardApi` - 9 edges
7. `Hero & Footer Redesign Design Spec` - 9 edges
8. `Home Screen - Dashboard with Vitals` - 9 edges
9. `Vitals Statistics Screen` - 8 edges
10. `herotest1.webp - Hero Marketing Image` - 8 edges

## Surprising Connections (you probably didn't know these)
- `SoterCareMain Hero Image` --conceptually_related_to--> `SoterCare Brand Identity`  [INFERRED]
  public/assets/SoterCareMain.webp → .superpowers/brainstorm/1126-1778937276/content/design-direction.html
- `SoterCare Brand Identity` --conceptually_related_to--> `Elderly Care`  [INFERRED]
  .superpowers/brainstorm/1126-1778937276/content/design-direction.html → public/assets/SoterCareMain.webp
- `src/components/Footer.tsx` --shares_data_with--> `Next.js Project (web-dev-v2)`  [INFERRED]
  docs/superpowers/specs/2026-05-16-hero-footer-redesign-design.md → README.md
- `contactAction()` --calls--> `ContactAutoReply()`  [INFERRED]
  src/app/actions.ts → src/emails/ContactAutoReply.tsx
- `Animation A — Line Mask Reveal` --semantically_similar_to--> `Take 1 — Architectural Grid`  [INFERRED] [semantically similar]
  .superpowers/brainstorm/1126-1778937276/content/animation-style.html → .superpowers/brainstorm/246-1778941414/content/refined-design.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Hero Redesign: Organic Dark + Line Mask Reveal + GSAP Timeline** — 246_1778941414_refined_design_organic_dark, 1126_1778937276_animation_style_line_mask_reveal, 2026_05_16_hero_footer_redesign_gsap_animation_sequence [EXTRACTED 1.00]
- **Three Animation Option Brainstorm (both sessions)** — 1126_1778937276_animation_style_line_mask_reveal, 1126_1778937276_animation_style_word_float, 1126_1778937276_animation_style_cinematic_blur_bloom [EXTRACTED 1.00]
- **Three Design Direction Options (Hero & Footer)** — 1126_1778937276_design_direction_editorial_dark, 1126_1778937276_design_direction_bold_centred, 1126_1778937276_design_direction_split_contrast [EXTRACTED 1.00]

## Communities (70 total, 18 thin omitted)

### Community 0 - "Alerts & Activity Timeline"
Cohesion: 0.09
Nodes (31): ActivityTimeline(), AlertCard(), AlertsPanel(), getAlertTheme(), StatsTimeline(), TABS, TemperatureStatistics(), VitalsDisplay() (+23 more)

### Community 1 - "App Router & Server Actions"
Cohesion: 0.05
Nodes (28): contactAction(), getResendClient(), joinWaitlistAction(), subscribeAction(), jsonLd, metadata, JsonLdProps, WaitlistPopupProps (+20 more)

### Community 2 - "Dependencies & Packages"
Cohesion: 0.05
Nodes (41): dependencies, gsap, @gsap/react, lenis, lucide-react, next, @portabletext/react, react (+33 more)

### Community 3 - "Hero/Footer Design Brainstorm"
Cohesion: 0.08
Nodes (34): Animation C — Cinematic Blur Bloom, GSAP Animation Style (brainstorm 1126), Animation A — Line Mask Reveal, Animation B — Word Float (Springy), Design Direction B — Bold & Centred (Refined), Design Direction A — Editorial Dark, Hero & Footer Design Direction (brainstorm 1126), Design Direction C — Split Contrast (+26 more)

### Community 4 - "Dashboard Layout & Navigation"
Cohesion: 0.09
Nodes (14): NAV, UserInfo, DashboardPage(), metadata, links, WebSocketProvider(), apiFetch(), authService (+6 more)

### Community 5 - "Landing Page & Marketing"
Cohesion: 0.07
Nodes (5): faqs, ViewState, technologies, plans, TEAM_MEMBERS

### Community 6 - "API Route Handlers"
Cohesion: 0.16
Nodes (13): PATCH(), GET(), POST(), GET(), GET(), PATCH(), GET(), proxyGet() (+5 more)

### Community 7 - "Contact Email Templates"
Cohesion: 0.10
Nodes (20): brandSection, brandText, button, buttonSection, ContactAutoReply(), ContactAutoReplyProps, container, contentHeading (+12 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+12 more)

### Community 9 - "Mobile App UI Mockups"
Cohesion: 0.17
Nodes (18): Activity Timeline Panel, Bottom Navigation Bar (Home, Timeline, AI Summary, Device, Profile), Device Connection Status (Thigh Band / Wrist Band Online), Export Report Button, Fall Detected Alert, Heart Rate Line Chart (Last 24 Hours), Heart Rate Widget (72 BPM), Home Screen - Dashboard with Vitals (+10 more)

### Community 10 - "Newsletter Email Templates"
Cohesion: 0.12
Nodes (15): brandSection, brandText, button, buttonSection, container, contentHeading, contentSection, copyright (+7 more)

### Community 11 - "Waitlist Email Templates"
Cohesion: 0.12
Nodes (15): brandSection, brandText, button, buttonSection, container, contentHeading, contentSection, copyright (+7 more)

### Community 12 - "Mobile Dashboard Features"
Cohesion: 0.23
Nodes (13): Activity Timeline, Dashboard Home Screen, Export Report Feature, Fall Detected Alert, Gait Analysis Feature, Gateway Online Status Indicator, Mobile App UI Mockup, Patient Monitoring System (+5 more)

### Community 13 - "Mock Data Generators"
Cohesion: 0.22
Nodes (6): ActivityDataPoint, DashboardAlert, GaitMetrics, TimelineEvent, UserProfile, VitalSigns

### Community 14 - "Hero Marketing Image"
Cohesion: 0.44
Nodes (9): Bedside Tablet Display / Dashboard, Healthcare IoT / Remote Patient Monitoring Concept, herotest1.webp - Hero Marketing Image, Home Patient Care Setting, Patient Mannequin (resting in bed), Wearable Patient Monitoring Device, Remote Health Monitoring Concept, SoterCare Brand Identity (+1 more)

### Community 15 - "Thigh Node Hardware"
Cohesion: 0.52
Nodes (7): Data/Power Connector Cable, Control Knob / Button, Electronic Enclosure Box, Power Switch (Toggle), Thigh Node Device, Thigh Strap / Wearable Band, Wearable Sensor Node

### Community 16 - "Footer Lifestyle Photography"
Cohesion: 0.40
Nodes (5): Children Playing, Family Garden Scene, Footer Visual Asset, Grandparent Figures, Wellness and Family Care Theme

### Community 17 - "Edge Gateway Product"
Cohesion: 0.40
Nodes (6): IoT Edge Gateway Concept, Local Data Processing at Edge, Edge Gateway Device (SoterCare Hardware), Hardware Enclosure with Stand, SoterCare Brand, Touchscreen Display Panel

### Community 18 - "Edge Gateway Hardware Detail"
Cohesion: 0.33
Nodes (6): Edge Gateway Hardware Device, Network Appliance / IoT Gateway, Product Feature Image for Edge Gateway, Status LED Indicator, USB Ports / Front Panel Connectors, Ventilation Grille (Cooling)

### Community 19 - "Thigh Node Wearable"
Cohesion: 0.33
Nodes (6): Coiled Cable with Connector, Thigh Node Wearable Device, The Thigh Node - Wearable Thigh Sensor Device Image, Embedded Sensor Module, Thigh Strap Band, Wearable Body Monitoring Concept

### Community 20 - "Footer B&W Photography"
Cohesion: 0.50
Nodes (4): Emotional Warmth and Care, Family Garden Scene, Website Footer Asset, Monochrome Photography Style

### Community 21 - "Footer Hand Care Image"
Cohesion: 0.50
Nodes (4): Compassion / Care Theme, Elderly Care Visual, Website Footer Section, Monochrome / Black-and-White Design Style

### Community 22 - "SoterCare Centered Logo"
Cohesion: 0.80
Nodes (5): Helping Hand Motif (Care Symbol), SoterCare Centered Logo (WebP), S Letterform (Logo Mark), Shield Motif (Protection Symbol), SoterCare Brand Identity

### Community 23 - "SoterCare Primary Logo"
Cohesion: 0.70
Nodes (5): Brand Blue Color Palette (Light Steel Blue), Caring Hand / Protective Gesture Icon, SoterCare Primary Logo (Brand Blue), Shield Icon (Logo Mark), SoterCare Brand Identity

### Community 24 - "React Native Stack"
Cohesion: 0.40
Nodes (5): Mobile Development Framework, React, React Native, Tech Logos Asset Directory, React Native Logo (WebP Image)

### Community 25 - "Open Graph Social Images"
Cohesion: 0.70
Nodes (5): Open Graph (OG) Social Share Image, SoterCare Brand Identity, SoterCare Logo, sotercare.com - Product Website, Wellness Simplified - Brand Tagline

### Community 26 - "Test Schema Scripts"
Cohesion: 0.50
Nodes (4): fetchPath(), fs, http, run()

### Community 27 - "Team Assets"
Cohesion: 0.50
Nodes (5): Team Assets Directory, Komudi - Team Member (Person), Komudi - Team Member Photo, Nimna - Team Member Person, Nimna - Team Member Photo

### Community 28 - "Hero Background Photos"
Cohesion: 0.67
Nodes (3): Elderly Care / Family Support Concept, Multi-generational family gathering scene, Hero Background Image (test variant 1)

### Community 29 - "SoterCare Healthcare Brand"
Cohesion: 0.83
Nodes (4): SoterCare Brand Identity, Healthcare / Caregiving Concept, SoterCare Primary Logo (WebP), Shield / Protection Symbol

### Community 30 - "Placeholder Footer Images"
Cohesion: 0.67
Nodes (4): Four-pointed Star Watermark - Decorative brand/UI overlay element, Family Garden Scene - Staged/AI-generated lifestyle photo, Footer/Hero Section Asset - Placeholder web content image, testfooter1.png - Lifestyle/Footer Placeholder Image

### Community 31 - "PostgreSQL Database"
Cohesion: 0.50
Nodes (4): PostgreSQL, Relational Database, Technology Logo Asset, PostgreSQL Logo (WebP Image)

### Community 32 - "Vercel Deployment Asset"
Cohesion: 0.50
Nodes (4): Static Public Asset, SVG Vector Graphic, Vercel Brand Identity, Vercel Logo SVG

### Community 33 - "Wrist Node Device"
Cohesion: 0.83
Nodes (4): The Wrist Node Feature Image, Sensor/Display Module on Wrist Device, Wearable Wrist Device (Fitness Band/Smartwatch), Wrist Node - IoT/Health Monitoring Node

### Community 34 - "Flask Backend"
Cohesion: 0.50
Nodes (4): Flask, Flask Logo, Python Web Framework, Tech Logos Collection

### Community 35 - "NestJS Backend"
Cohesion: 0.67
Nodes (4): NestJS Logo, NestJS Framework, Node.js Backend Framework, Project Technology Stack

### Community 37 - "SoterCare White Logo"
Cohesion: 1.00
Nodes (3): SoterCare Brand Identity, SoterCare Primary Logo (White Variant), White Logo Variant (for dark backgrounds)

### Community 39 - "Team Member Sanjula"
Cohesion: 0.67
Nodes (3): Team Member Assets, Sanjula (Team Member), Sanjula Team Photo

### Community 45 - "Team Member Daham"
Cohesion: 0.67
Nodes (3): Team Member Portrait Asset, Daham Dissanayake, Daham Team Member Photo

### Community 46 - "Edge Impulse ML"
Cohesion: 0.67
Nodes (3): Edge Impulse, Edge Impulse Logo, TinyML / Embedded Machine Learning

### Community 47 - "ESP Microcontroller"
Cohesion: 0.67
Nodes (3): ESP Microcontroller Platform, Espressif Systems, Espressif Logo Image

### Community 48 - "Next.js Framework"
Cohesion: 0.67
Nodes (3): Next.js Logo, Next.js Framework, React-based Web Framework

### Community 49 - "Raspberry Pi"
Cohesion: 0.67
Nodes (3): Raspberry Pi, Single-Board Computer Hardware Platform, Raspberry Pi Logo

## Knowledge Gaps
- **226 isolated node(s):** `http`, `http`, `http`, `fs`, `WebSocket` (+221 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `contactAction()` connect `App Router & Server Actions` to `Contact Email Templates`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `http`, `http`, `http` to the rest of the system?**
  _231 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Alerts & Activity Timeline` be split into smaller, more focused modules?**
  _Cohesion score 0.09438775510204081 - nodes in this community are weakly interconnected._
- **Should `App Router & Server Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.05087881591119334 - nodes in this community are weakly interconnected._
- **Should `Dependencies & Packages` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `Hero/Footer Design Brainstorm` be split into smaller, more focused modules?**
  _Cohesion score 0.08199643493761141 - nodes in this community are weakly interconnected._
- **Should `Dashboard Layout & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.08505747126436781 - nodes in this community are weakly interconnected._