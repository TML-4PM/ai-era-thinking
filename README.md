# The Organ — Agentic AI Organ Map

A fast, elegant web app for exploring AI transformation through an “organ” metaphor across eras (On-Prem → Cloud-Native → Gen AI → Agentic AI → BCI). Browse top thinkers, filter by lobe and era, open deep profiles, and access governance tooling.

Live site: https://ai-thinker-flux.lovable.app/

- Tech stack: Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui, React Router, Helmet
- Hosting: Lovable (instant preview + publish)
- Data: TypeScript data objects + CSVs in public/

---

## Table of contents
- For engineers
  - Quickstart
  - Project structure
  - Styling & design system
  - Data model & content sources
  - SEO, social, and routing
  - Feature overview
  - Supabase (optional)
  - Contribution workflow
- For end users
  - What you can do
  - How search and filters work
  - Deep profiles and sharing
  - Governance & tools
  - Tips and keyboard shortcuts
- For marketing
  - Positioning & value props
  - SEO/SMO checklist
  - Content & assets
  - Analytics (optional)
  - Launch & growth checklist
- Roadmap
- FAQ & troubleshooting
- License

---

## For engineers

### Quickstart
- Prereqs: Node 18+ and npm
- Install: `npm i`
- Dev server: `npm run dev` → http://localhost:5173
- Build: `npm run build`
- Preview production build: `npm run preview`
- Deploy: In Lovable, click Share → Publish

### Project structure
```
.
├─ public/
│  ├─ og-share.jpg                # Social share image (Open Graph / Twitter)
│  ├─ organ_across_eras.csv       # Lobe × Era capability mapping
│  ├─ governance_risks_metrics.csv# Governance + metrics reference
│  └─ architecture_guts_by_era.csv# Supplemental data (optional)
├─ src/
│  ├─ assets/
│  │  └─ hero-organ.jpg
│  ├─ components/
│  │  ├─ EnhancedOrganMap.tsx     # Interactive organ map
│  │  ├─ EraTimeline.tsx          # Eras strip (On-Prem → BCI)
│  │  ├─ ThinkerCard.tsx          # Compact thinker card
│  │  ├─ ThinkerDetailModal.tsx   # Deep profile modal
│  │  ├─ SearchBar.tsx            # Search + filters (lobe/era)
│  │  └─ ui/*                     # shadcn/ui components
│  ├─ data/
│  │  ├─ thinkers.ts              # Top thinkers
│  │  ├─ expanded-thinkers.ts     # Deep profiles + prompts + relevance
│  │  ├─ eras.ts                  # Era definitions
│  │  ├─ governance.ts            # Governance model
│  │  ├─ governance-tools.ts      # Tools list
│  │  └─ workshop-materials.ts    # Materials catalog
│  ├─ hooks/                      # Common hooks
│  ├─ pages/
│  │  ├─ Index.tsx                # Landing & exploration
│  │  ├─ Governance.tsx           # Governance framework
│  │  ├─ Tools.tsx                # Implementation tools
│  │  └─ EraDetail.tsx            # Era deep-dive
│  ├─ integrations/supabase/      # Client scaffold (optional)
│  ├─ index.css                   # Design tokens + base styles
│  ├─ main.tsx, App.tsx           # App shell
│  └─ router (via react-router-dom)
└─ tailwind.config.ts, vite.config.ts, eslint.config.js
```

### Styling & design system
- Tailwind + shadcn/ui with semantic tokens (HSL) — avoid hardcoded colors.
- Tokens live in src/index.css and tailwind.config.ts; add/adjust tokens there.
- Create UI variants via shadcn primitives; don’t override components ad hoc.

Guidelines:
- Use semantic classes (bg-background, text-foreground, border, ring, etc.)
- Add new brand colors as CSS variables in HSL form only
- Keep components small, reusable, and responsive

### Data model & content sources
- Thinkers (src/data/thinkers.ts): base list with name, area, core idea, AI shift, lobe
- Expanded thinkers (src/data/expanded-thinkers.ts): deep profiles with prompts, cross-era relevance, related thinkers, and practical applications
- Eras (src/data/eras.ts): core metadata for each era
- CSVs in public/: supporting tables used for visuals and downloadable references

Updating content:
- Add a new thinker: add to THINKERS in thinkers.ts
- Add deep profile: add to EXPANDED_THINKERS in expanded-thinkers.ts (names must match)
- Update eras/lobes: edit eras.ts and supporting CSVs as needed

### SEO, social, and routing
- React Helmet is used to set title, description, canonical, and OG/Twitter tags per page
- Default share image: public/og-share.jpg
- robots.txt and sitemap.xml live in public/
- Clean, descriptive URLs (/, /governance, /tools, /era/:id)
- Images have descriptive alt text; non-critical images are lazy-loaded where possible

Adding a new page:
1) Create a page component in src/pages
2) Add a <Helmet> block (title < 60 chars; meta description < 160 chars)
3) Include canonical and OG/Twitter tags (use og-share.jpg or a page-specific image)
4) Wire route in App.tsx (react-router-dom)

### Feature overview
- Search & filter: query across names/areas; filter by lobe and era
- URL sync: lobe and era are encoded in the URL for deep links and shareability
- Interactive organ map: hover/press to explore lobes and capabilities across eras
- Era timeline: quick navigation by era
- Thinker cards: compact summaries; click to open deep profile
- Deep profiles: core contribution, AI shift, cross-era relevance, prompts, related thinkers; export/share buttons included
- Governance: risks, rules, and metrics with a clear structure
- Tools: actionable artifacts for implementation
- Theme toggle: light/dark

### Supabase (optional)
A client scaffold exists at src/integrations/supabase/client.ts, but no backend features are active. If you add auth or data:
- Use migrations (via Lovable Supabase tools) with RLS policies from day one
- Regenerate types in src/integrations/supabase/types.ts after schema changes
- Never commit secrets; Lovable does not use VITE_* env vars

### Contribution workflow
- Branching: feature/<name>, fix/<name>
- Lint: `npm run lint` (if configured in eslint.config.js)
- Commit: conventional messages recommended (feat:, fix:, docs:)
- PR review: focus on accessibility, responsiveness, and design tokens
- Avoid scope creep; prefer small, verifiable changes

---

## For end users

What you can do:
- Explore the Organ map across five eras
- Search for top thinkers and filter by lobe and era
- Open deep profiles with practical applications and prompts
- Navigate via the era timeline and themed lobe groupings
- Review governance and implementation tools
- Toggle light/dark themes

How search and filters work:
- Start typing to see suggestions; press Enter to apply
- Use the filter panel to select a lobe and/or era
- Filters sync to the URL so you can bookmark or share your exact view

Deep profiles and sharing:
- Click “Explore Deep Profile” on any thinker card
- Use Export/Share buttons within the modal
- Close with ESC or the Close button

Tips:
- Keyboard: ESC closes modals; TAB navigates controls; Enter selects
- Accessibility: color contrast adheres to design tokens; we aim for screen-reader friendly labels

---

## For marketing

Positioning:
- The Organ is a pragmatic lens for AI transformation, mapping capabilities across eras with direct links to the best thinkers and practices.
- It helps leaders move from theory to action with governance, metrics, and tools.

Primary audiences:
- Digital/AI transformation leaders, product teams, governance and risk leaders, innovation leads

Key value props:
- Clear mental model across eras
- Curated thinkers with actionable prompts
- Governance and safety aligned to operations
- Fast, beautiful, and shareable

SEO/SMO checklist:
- Titles < 60 chars with the main keyword (per page)
- Meta descriptions < 160 chars using natural keywords
- One H1 per page; semantic HTML (header/main/section/article/nav)
- OG/Twitter tags set (image: /og-share.jpg)
- robots.txt + sitemap.xml present
- Descriptive alt text for all images

Content & assets:
- Social image: public/og-share.jpg (1200×630 recommended)
- Hero visual: src/assets/hero-organ.jpg
- Quotes/blurbs: pull from deep profiles and governance summaries
- Visual Edits: for simple copy tweaks, use Lovable’s Visual Edits tool (no code required)
  Docs: https://docs.lovable.dev/features/visual-edit

Analytics (optional):
- Not enabled by default. Options: GA4 or Plausible
- Add the script in index.html or inject via Helmet per page (coordinate with engineering)
- Use UTM tags for campaigns

Launch & growth checklist:
- Publish latest build (Lovable → Share → Publish)
- Verify OG preview on Twitter/X and LinkedIn
- Announce with target use-cases and examples
- Track traffic and iterate copy via Visual Edits

---

## Roadmap
Backlog lives in public/expansion_backlog.csv. Snapshot:
- Update visual organ map — Five eras overlay and lobe flows
- One-pagers per thinker — Profile with prompts and usage
- Policy as code pack — Context integrity + overrides
- Agent safety harness — Recorder + kill switch
- Neural consent vault — Model + API
- Workshop deck — Half-day with role-based cases
- Live metrics dashboard — Surprise index + safety
- Microsite search — Across thinkers and lobes

---

## FAQ & troubleshooting
- Dev server won’t start: ensure Node 18+, delete node_modules and lockfile, reinstall
- Styles look off: verify tokens in src/index.css and tailwind.config.ts
- Social cards not updating: cache can take time; use platform debuggers (Twitter Card Validator, LinkedIn Post Inspector)
- New page not indexed: confirm sitemap.xml/robots.txt and canonical tag

---

## License
Copyright © The Organ team. All rights reserved.

If you need a specific OSS license, add it here and include a LICENSE file.

