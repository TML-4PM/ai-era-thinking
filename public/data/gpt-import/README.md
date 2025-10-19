# GPT Import Package - The Thinking Engine Knowledge Base

## Overview

This directory contains structured JSON files designed for importing The Thinking Engine knowledge base into a GPT custom assistant. The files are organized in a phased approach to build up the knowledge systematically.

**Total Estimated Tokens: ~485,000**

## Import Sequence

### Phase 1: Core Taxonomy ✅ (Complete)
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

### Phase 3: Relationship Mapping
*Build relationship graph after content is loaded*

**Estimated: ~70,000 tokens**

Extract from Phase 2 content:
- All `related_thinkers` arrays → Thinker-to-Thinker graph
- All `related_frameworks` arrays → Thinker-to-Framework graph
- All `era_mapping` fields → Era evolution paths
- GCBAT character-to-agent connections

---

### Phase 4: Query Optimization
*Enable advanced query patterns*

**Estimated: ~10,000 tokens**

Configure:
- Semantic search using TAG_MAPPING relationships
- Cross-era comparison queries
- Brain-lobe filtering
- Book/section scoping
- Tag expansion rules

---

## Quick Start Guide

### For GPT Configuration:

1. **Start with 00-master-config.json**
   - Read this first for complete context
   - Contains role definition and capabilities

2. **Import Phase 1 files (01-05)**
   - Load in order listed above
   - Establishes all classification systems

3. **Export and import Phase 2 content**
   - Follow 06-database-export-guide.json
   - Export database tables and consolidate files

4. **Phase 3 & 4 are derived**
   - No separate files needed
   - Built from Phase 2 relationships

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

| Phase | Tokens | Required? |
|-------|--------|-----------|
| Phase 1 (Files 01-05) | 110,000 | ✅ Yes - Core taxonomy |
| Phase 2 (Files 07-11) | 380,000 | ⚠️ Partial - Start with expanded thinkers + key books |
| Phase 3 (Derived) | 70,000 | Optional - For relationship queries |
| Phase 4 (Config) | 10,000 | Optional - For advanced queries |

**Recommended Minimal Import**: Phase 1 + 08-expanded-thinkers.json + key book content = ~200,000 tokens

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
