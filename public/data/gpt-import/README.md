# GPT Import Package - The Thinking Engine Knowledge Base

## Overview

This directory contains structured JSON files designed for importing The Thinking Engine knowledge base into a GPT custom assistant. The files are organized in a phased approach to build up the knowledge systematically.

**Total Estimated Tokens: ~485,000**

## Import Sequence

### Phase 1: Core Taxonomy ✅ (COMPLETE)
*Import these files first to establish classification systems*

1. **00-master-config.json** (Start here!)
   - Central configuration and instructions
   - Query patterns and usage guidelines
   - Project overview and capabilities

2. **01-tag-mapping.json** (~80,000 tokens)
   - 38 tag categories with 150+ tags
   - Semantic relationships between tags
   - Tag expansion rules for search

3. **02-brain-lobes.json** (~5,000 tokens)
   - 5 cognitive domains (brain lobes)
   - Cognitive functions and example thinkers
   - Color coding and classification rules

4. **03-technological-eras.json** (~8,000 tokens)
   - 5 technological eras with characteristics
   - Timeline and key technologies
   - Era transition patterns

5. **04-book-hierarchy.json** (~10,000 tokens)
   - 10 books across 3 collections
   - 50+ sections/volumes
   - Navigation structure

6. **05-relationship-types.json** (~7,000 tokens)
   - Connection patterns between content
   - Relationship strength and directionality
   - Graph traversal rules

**Phase 1 Total: ~110,000 tokens**

---

### Phase 2: Content Indexing 🔄 (Requires Database Export)
*Load actual content with metadata*

**Estimated: ~380,000 tokens**

To complete Phase 2, you must export content from the database and file system:

7. **07-master-4500-records.json** (~200,000 tokens)
   - 4500+ thinker records
   - Export from Supabase `master_4500` table
   - See `06-database-export-guide.json` for SQL query

8. **08-expanded-thinkers.json** (~50,000 tokens)
   - 75+ deeply profiled thinkers
   - Extract from `src/data/expanded-thinkers.ts`
   - Convert TypeScript to JSON

9. **09-gcbat-vignettes.json** (~20,000 tokens)
   - GCBAT narrative vignettes
   - Export from Supabase `vignettes` table

10. **10-gcbat-characters.json** (~10,000 tokens)
    - GCBAT character profiles
    - Export from Supabase `gcbat_characters` table

11. **11-consolidated-book-content.json** (~100,000 tokens)
    - All book content from `public/books/content/*.json`
    - Consolidate into single structured file

**See `06-database-export-guide.json` for detailed export instructions**

---

### Phase 3: Relationship Mapping ✅ (COMPLETE)
*Build relationship graph after content is loaded*

**Estimated: ~70,000 tokens**

Files created:
- [x] **13-thinker-network.json** - Thinker influence relationships with examples
- [x] **14-framework-connections.json** - Thinker-to-Framework mappings
- [x] **15-era-evolution-paths.json** - Cross-era evolution tracking
- [x] **16-complete-graph.json** - Unified graph structure

---

### Phase 4: Query Optimization ✅ (COMPLETE)
*Enable advanced query patterns*

**Estimated: ~10,000 tokens**

File created:
- [x] **17-query-optimization-config.json** - Complete query configuration
  - Semantic search with tag expansion rules
  - Era filtering and comparison patterns
  - Brain-lobe classification queries
  - Book/section scoping logic
  - Relationship traversal patterns (influence networks, multi-hop queries)
  - Tag-based discovery and clustering
  - Advanced patterns (trend analysis, recommendations, citation networks)

---

## Quick Start Guide

### For GPT Configuration:

1. **Start with 00-master-config.json**
   - Read this first for complete context
   - Contains role definition and capabilities

2. **Import Phase 1 files (01-05)** ✅
   - Load in order listed above
   - Establishes all classification systems
   - **Status**: Ready

3. **Import Phase 3 relationship templates (13-16)** ✅
   - Provides graph structure and relationship patterns
   - **Status**: Ready

4. **Import Phase 4 query config (17)** ✅
   - Enables advanced query patterns
   - **Status**: Ready

5. **Complete Phase 2 exports (07-11)** ⏳
   - Follow EXPORT-SQL-SCRIPTS.sql for database exports
   - Use /admin/gpt-export for automated exports
   - Consolidate book content manually
   - **Status**: Awaiting manual exports

### For Spreadsheet Analysis:

See `../complete-taxonomy.csv` and related CSV files in parent directory.

---

## File Formats

All JSON files follow consistent structure:

```json
{
  "name": "Descriptive Name",
  "version": "1.0",
  "description": "Purpose of this file",
  "data_or_items": [ /* actual content */ ]
}
```

---

## Key Concepts

### Exemplar Types
- `thinker` - Individual thought leaders (4500+ records)
- `framework` - Mental models and analytical tools
- `technology` - Technologies across eras
- `narrative-vignette` - GCBAT story content

### Classification Dimensions
- **Brain Lobe**: Cognitive domain (5 lobes)
- **Era**: Technological era (5 eras, can span multiple)
- **Tags**: Semantic categories (150+ tags across 38 categories)
- **Book/Section**: Location in book hierarchy

### Relationships
- `related_thinkers`: Who influenced whom
- `related_frameworks`: Key frameworks by thinker
- `era_mapping`: Which eras a concept spans
- `tags`: Semantic connections

---

## Query Patterns Enabled

Once imported, GPT can answer:

- **Semantic**: "Find all thinkers tagged with systems-thinking"
- **Era-based**: "Show frameworks from Agentic AI era"
- **Cognitive**: "Find all Decision/Action domain thinkers"
- **Relational**: "Who influenced Kahneman? What frameworks did they create?"
- **Evolution**: "How did CRM evolve from On-Prem to Agentic era?"
- **Scoped**: "Find all exemplars in tech-for-humanity/ethics-consent"

---

## Token Budget Management

| Phase | Status | Tokens | Required? |
|-------|--------|--------|-----------|
| Phase 1 (Files 01-05) | ✅ Complete | 110,000 | ✅ Yes - Core taxonomy |
| Phase 2 (Files 07-11) | 🔄 Awaiting exports | 380,000 | ⚠️ Partial - Start with expanded thinkers |
| Phase 3 (Files 13-16) | ✅ Complete | 70,000 | ✅ Yes - Relationship templates |
| Phase 4 (File 17) | ✅ Complete | 10,000 | ✅ Yes - Query patterns |

**Current Ready for Import**: Phase 1 + Phase 3 + Phase 4 = ~190,000 tokens  
**Recommended Minimal Import**: Phase 1 + 08-expanded-thinkers.json (~160k tokens)  
**Full Import After Phase 2**: All phases = ~570,000 tokens

---

## Maintenance

### Updating Content
When new thinkers or content are added:
1. Re-export affected database tables
2. Update consolidated book content
3. Validate against taxonomy (tags, lobes, eras)

### Version Control
- Current version: 1.0
- Update version numbers in JSON when content changes
- Track schema changes in 00-master-config.json

---

## Support

For questions about:
- **File structure**: See 00-master-config.json
- **Export process**: See 06-database-export-guide.json
- **Tag definitions**: See 01-tag-mapping.json
- **Relationships**: See 05-relationship-types.json

---

## License & Attribution

The Thinking Engine Knowledge Base
Content covers 4500+ thinkers, frameworks, and technologies across history.
Structured for AI-assisted knowledge retrieval and relationship mapping.
