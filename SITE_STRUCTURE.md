# Site Structure & Route Map

> Comprehensive documentation of all routes, pages, and functionality in the AI-Era Thinking Platform

Last Updated: October 18, 2025

---

## 🗺️ Complete Route Map

### Homepage & Main Navigation

| Route | Component | Status | Description |
|-------|-----------|--------|-------------|
| `/` | Books.tsx | ✅ Live | Main landing page - Book suite hub |
| `/books` | Books.tsx | ✅ Live | Same as homepage - book collection |
| `/explore` | Explore.tsx | ✅ Live | Era and thinker exploration |
| `/thinkers` | Thinkers.tsx | ✅ Live | Complete thinker directory |
| `/frameworks` | Frameworks.tsx | ✅ Live | Framework library |

### Book Routes

#### Core Book Pages
| Route | Component | Status | Description |
|-------|-----------|--------|-------------|
| `/books/tech-for-humanity` | BookLayout | ✅ Live | Ethics & human-centered AI |
| `/books/entangled-time` | BookLayout | ✅ Live | Temporal dynamics & causality |
| `/books/thinking-engine` | BookLayout | ✅ Live | Cognitive architectures |
| `/books/quantum-logic-systems` | BookLayout | ✅ Live | Advanced computational paradigms |
| `/books/regenerative-organization` | BookLayout | ✅ Live | Organizational transformation |
| `/books/workfamilyai` | BookLayout | ✅ Live | Neural Ennead framework |
| `/books/sovereign-systems` | BookLayout | ✅ Live | Governance & autonomy |
| `/books/gcbat-vignettes` | BookLayout | ✅ Live | BCI governance stories |

#### Book Sub-Routes (Nested under `/books/:slug/`)
| Route Pattern | Component | Status | Purpose |
|--------------|-----------|--------|---------|
| `/*` (index) | BookOverview | ✅ Live | Book landing page |
| `/chapters` | BookChapters | ✅ Live | Chapter list view |
| `/leaders-live` | BookLeadersLive | ✅ Live | Related thinkers |
| `/add-guru` | BookAddGuru | ✅ Live | Add custom thinkers |
| `/resources` | BookResources | ✅ Live | Additional materials |
| `/characters` | GCBATCharactersPage | ✅ Live | GCBAT characters (GCBAT book only) |
| `/matrix` | GCBATMatrixPage | ✅ Live | Story-character matrix (GCBAT book only) |

#### Chapter Reading Routes
| Route Pattern | Component | Status | Purpose |
|--------------|-----------|--------|---------|
| `/books/:slug/ch/:chapterOrder` | ChapterPage | ✅ Live | Database-driven chapters |
| `/books/:slug/chapter/:chapterNumber` | StaticChapterPage | ✅ Live | JSON-based static chapters |
| `/books/:bookSlug/sections/:sectionId` | SectionContent | ✅ Live | Individual sections |

#### Special GCBAT Routes
| Route | Component | Status | Description |
|-------|-----------|--------|-------------|
| `/books/gcbat-vignettes/arc/:arcNumber` | GCBATArcPage | ✅ Live | Story arcs (1-5) |

### Tools & Utilities

| Route | Component | Status | Description |
|-------|-----------|--------|-------------|
| `/tools` | Tools.tsx | ✅ Live | Implementation tools hub |
| `/calculators` | Calculators.tsx | ✅ Live | Assessment calculators |
| `/chat` | Chat.tsx | ✅ Live | AI thinker chat interface |
| `/workfamily` | WorkFamily.tsx | ✅ Live | Neural Ennead alignment |
| `/governance` | Governance.tsx | ✅ Live | Governance frameworks |

### User Management

| Route | Component | Status | Description |
|-------|-----------|--------|-------------|
| `/add-thinker` | AddThinker.tsx | ✅ Live | Add custom thinker profiles |
| `/favorites` | Favorites.tsx | ✅ Live | Saved favorites |
| `/auth` | Auth.tsx | ✅ Live | Authentication (if enabled) |
| `/cards` | Cards.tsx | ✅ Live | Thinker cards view |

### Resources & Learning

| Route | Component | Status | Description |
|-------|-----------|--------|-------------|
| `/resources` | Resources.tsx | ✅ Live | Resource hub |
| `/resources/workshops` | Workshops.tsx | 🚧 Coming | Workshop materials |
| `/resources/case-studies` | CaseStudies.tsx | 🚧 Coming | Case study library |

### Era Exploration

| Route Pattern | Component | Status | Description |
|--------------|-----------|--------|-------------|
| `/era/:eraId` | EraDetail.tsx | ✅ Live | Era deep-dive pages |

Valid era IDs:
- `on-prem` - On-Premise Era
- `cloud-native` - Cloud-Native Era
- `gen-ai` - Generative AI Era
- `agentic-ai` - Agentic AI Era
- `bci` - Brain-Computer Interface Era

### Legal & Information

| Route | Component | Status | Description |
|-------|-----------|--------|-------------|
| `/about` | About.tsx | ✅ Live | Mission & vision |
| `/contact` | Contact.tsx | 🚧 Coming | Contact form |
| `/privacy` | Privacy.tsx | 🚧 Coming | Privacy policy |
| `/terms` | Terms.tsx | 🚧 Coming | Terms of service |

### Admin Routes (Protected)

| Route | Component | Status | Description |
|-------|-----------|--------|-------------|
| `/admin/expand` | AdminExpand.tsx | ✅ Live | Bulk thinker expansion |
| `/admin/books` | AdminBooks.tsx | ✅ Live | Book management |

### Error Handling

| Route | Component | Status | Description |
|-------|-----------|--------|-------------|
| `*` (catch-all) | NotFound.tsx | ✅ Live | 404 error page |

---

## 🛡️ Route Guards & Protection

### Placeholder Parameter Guards
All dynamic routes with `:slug`, `:chapterOrder`, `:sectionId`, etc. include guards against literal placeholder values.

**Protected Routes:**
- `/books/:slug/*` - Redirects to `/books` if slug is placeholder
- `/books/:slug/ch/:chapterOrder` - Redirects if either param is placeholder
- `/books/:bookSlug/sections/:sectionId` - Redirects if either param is placeholder
- `/era/:eraId` - Protected against invalid era IDs
- `/books/gcbat-vignettes/arc/:arcNumber` - Validates arc numbers (1-5)

**Guard Implementation:**
```typescript
import { isPlaceholderParam } from "@/lib/route-guards";

if (!slug || isPlaceholderParam(slug)) {
  return <Navigate to="/books" replace />;
}
```

---

## 📚 Book Content Structure

### Content Sources

#### Static JSON Content (Public)
- Location: `public/books/content/*.json`
- Used by: Static chapter pages
- Examples:
  - `thinking-engine.json`
  - `quantum-logic-systems.json`
  - `tech-for-humanity.json`
  - `workfamilyai-ch1.json`, `workfamilyai-ch2.json`, etc.

#### Database-Driven Content (Supabase)
- Tables: `books`, `book_chapters`, `book_sections`
- Used by: Dynamic chapter pages, section pages
- Features: Draft/published status, premium content flags

#### Cover Images
- Location: `public/assets/covers/`
- Format: `.jpg`
- Naming: `{book-slug}.jpg`
- Required for all books

**Current Cover Images:**
- `tech-for-humanity-hub.jpg`
- `tech-for-humanity-ethics-consent.jpg` ✅ (recently fixed)
- `thinking-engine-hub.jpg`
- `entangled-time.jpg` / `time-tree.jpg`
- `quantum-logic-systems.jpg`
- `regenerative-organization.jpg`
- `workfamilyai.jpg`
- `sovereign-systems.jpg`
- `gcbat-vignettes.jpg`
- `placeholder.jpg` (fallback)

---

## 🎭 GCBAT Special Features

### Neural Ennead Characters (9 total)
1. **Aisha Okonkwo** - Guardian (Ethics & Safety)
2. **Marcus Chen** - Architect (Systems Design)
3. **Elena Vasquez** - Advocate (Human Rights)
4. **Dmitri Volkov** - Maverick (Innovation)
5. **Sarah Kim** - Sage (Knowledge)
6. **James Anderson** - Connector (Diplomacy)
7. **Maya Rodriguez** - Alchemist (Transformation)
8. **Raj Patel** - Steward (Resources)
9. **Yuki Tanaka** - Explorer (Discovery)

### Story Arcs (5 total)
1. **Arc 1**: Foundation & Early Adoption
2. **Arc 2**: Ethical Dilemmas & Governance
3. **Arc 3**: Scale & Societal Impact
4. **Arc 4**: Crisis & Response
5. **Arc 5**: Future Horizons

### Story Matrix
- 32 stories total
- Each story features multiple characters in different roles:
  - **P** - Protagonist
  - **S** - Supporting
  - **C** - Cameo

**Routes:**
- `/books/gcbat-vignettes/characters` - Character gallery
- `/books/gcbat-vignettes/matrix` - Interactive story-character matrix
- `/books/gcbat-vignettes/arc/:arcNumber` - Arc-specific stories (1-5)

---

## 🔍 SEO & Discoverability

### Sitemap
- Location: `/public/sitemap.xml`
- Updated: October 18, 2025
- Includes: All public routes, book pages, main navigation
- Change frequency: Daily (home), Weekly (books), Monthly (legal)

### Robots.txt
- Location: `/public/robots.txt`
- Allows: All public content
- Disallows: `/admin/`, `/auth/`, `/api/`
- Sitemap reference: Included

### Meta Tags
All pages include:
- `<title>` - Unique, descriptive titles
- `<meta name="description">` - SEO descriptions
- `<link rel="canonical">` - Canonical URLs
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags

**Example:**
```html
<Helmet>
  <title>Books - AI-Era Thinking Suite | Tech4Humanity</title>
  <meta name="description" content="Explore 8 interconnected books..." />
  <link rel="canonical" href="https://ai-thinker-flux.lovable.app/books" />
  <meta property="og:title" content="Books - AI-Era Thinking Suite" />
  <meta property="og:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
</Helmet>
```

---

## 🎨 Design System

### Color Tokens (HSL)
```css
--primary: 210 100% 50%      /* Blue */
--secondary: 280 80% 60%     /* Purple */
--accent: 150 70% 50%        /* Green */
--background: 0 0% 100%      /* White/Dark */
--foreground: 0 0% 10%       /* Text */
--muted: 0 0% 96%            /* Subtle */
--border: 0 0% 90%           /* Dividers */
```

### Component Library
- **Base**: shadcn/ui components
- **Custom**: Enhanced thinker modals, book layouts, GCBAT components
- **Icons**: Lucide React

---

## 🔧 Configuration Files

### Build & Development
- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Design system
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencies

### Deployment
- `vercel.json` - Vercel deployment config
- `.vercelignore` - Build exclusions

### Database
- `supabase/config.toml` - Supabase configuration
- `supabase/migrations/` - Database schema migrations

---

## 📊 Status Summary

### ✅ Fully Functional (Live)
- All book pages and chapters
- Thinker profiles and exploration
- GCBAT stories, characters, and matrix
- Tools and calculators hub
- Resource navigation
- SEO (sitemap, robots.txt, meta tags)
- Route guards and 404 handling

### 🚧 Coming Soon (Placeholder Pages)
- Contact form
- Privacy policy (full content)
- Terms of service (full content)
- Workshop materials
- Case studies
- Implementation guides
- Some calculator tools

### 🔒 Admin Only
- Bulk thinker expansion
- Book management interface

---

## 🚀 Performance Notes

### Optimizations
- Code splitting via React Router
- Lazy loading for images
- Static asset caching
- CDN delivery (Lovable platform)

### Monitoring
- Console error logging
- 404 tracking via NotFound component
- Route guard logging for debugging

---

## 📝 Maintenance Checklist

### Regular Updates
- [ ] Update sitemap.xml lastmod dates monthly
- [ ] Review and update README.md quarterly
- [ ] Check for broken links monthly
- [ ] Update book content as published
- [ ] Review route guards after new routes added
- [ ] Update GCBAT content as stories added

### Content Tasks
- [ ] Complete Privacy Policy
- [ ] Complete Terms of Service
- [ ] Add contact form functionality
- [ ] Populate workshop materials
- [ ] Create case studies
- [ ] Enable live calculators

---

## 🆘 Common Issues & Solutions

### Issue: 404 on Dynamic Routes
**Solution**: Check route guards, verify parameter is not literal placeholder

### Issue: Blank Page
**Solution**: Check component imports, verify data sources, check console for errors

### Issue: Book Cover Not Showing
**Solution**: Verify image exists in `/public/assets/covers/`, check filename matches book slug

### Issue: GCBAT Features Not Working
**Solution**: Verify book slug is exactly `gcbat-vignettes`, check character/story data

### Issue: Sitemap Not Updating
**Solution**: Manually edit `/public/sitemap.xml`, update lastmod dates

---

**Document Version**: 1.0  
**Last Audit**: October 18, 2025  
**Next Audit Due**: November 18, 2025