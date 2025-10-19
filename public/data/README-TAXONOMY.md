# Comprehensive Taxonomy System - CSV Documentation

## Overview
This directory contains exhaustive CSV exports of the entire site taxonomy system, designed for GPT setup and spreadsheet analysis.

## File Descriptions

### 1. `complete-taxonomy.csv` (Main Reference)
**Purpose**: Complete taxonomy with all tags, categories, and metadata
**Rows**: ~100 entries
**Columns**:
- `Category` - High-level grouping (Research Tags, Brain Lobes, Eras, etc.)
- `Subcategory` - Mid-level classification
- `Tag/Item` - Specific tag or item identifier
- `Description` - Detailed explanation
- `Usage Context` - Where/how it's used
- `Related Items` - Comma-separated related tags

**Use Cases**:
- GPT training data import
- Tag relationship mapping
- Search keyword expansion
- Content categorization reference

---

### 2. `book-hierarchy.csv`
**Purpose**: Complete book collection structure
**Rows**: 10 books
**Columns**:
- `Collection` - Premier/In Development/Drawing Board
- `Book Title` - Full book name
- `Book Slug` - URL-safe identifier
- `Status` - Development status
- `Volumes/Chapters` - Content structure
- `Seeded Count` - Amount of content available
- `Primary Focus` - Main topic area
- `Related Eras` - Relevant technological eras
- `Key Themes` - Primary thematic tags

**Use Cases**:
- Book discovery and navigation
- Content maturity assessment
- Collection planning
- Era-based book filtering

---

### 3. `era-characteristics.csv`
**Purpose**: Detailed characteristics of each technological era
**Rows**: 5 eras
**Columns**:
- `Era Name` - Era identifier
- `Time Period` - Approximate years
- `Key Technologies` - Defining technologies
- `Architectural Patterns` - System design approaches
- `Business Models` - Revenue/deployment models
- `Human Role` - How humans interact
- `AI Capability` - AI sophistication level
- `Governance Approach` - Regulatory/oversight methods
- `Example Exemplars` - Real-world examples

**Use Cases**:
- Era-based content filtering
- Evolution tracking
- Comparative analysis
- Future forecasting

---

### 4. `tag-mapping-reference.csv`
**Purpose**: Detailed tag definitions with search optimization
**Rows**: ~40 core tags
**Columns**:
- `Category` - Research area
- `Tag` - Tag identifier (slug format)
- `Display Name` - Human-readable name
- `Description` - Full definition
- `Common Contexts` - Where typically used
- `Related Tags` - Semantically related tags
- `Search Keywords` - Additional search terms

**Use Cases**:
- Semantic search configuration
- Tag relationship graphs
- Content tagging guidelines
- Search query expansion

---

### 5. `gpt-setup-guide.csv`
**Purpose**: Step-by-step GPT implementation plan
**Rows**: 16 implementation steps
**Columns**:
- `Phase` - Implementation phase (1-4)
- `Priority` - Critical/High/Medium/Low
- `Item Type` - What's being imported
- `Item Name` - Specific item identifier
- `Data Source` - File or database location
- `Import Format` - JSON/CSV/Graph structure
- `Purpose` - Why it's needed
- `Dependencies` - What must be done first
- `Estimated Tokens` - Token budget estimate

**Use Cases**:
- GPT implementation roadmap
- Resource planning
- Token budget estimation
- Dependency management

**Total Token Estimate**: ~486,000 tokens for complete system

---

### 6. `content-relationships.csv`
**Purpose**: Relationship types and connection patterns
**Rows**: 20 relationship types
**Columns**:
- `Relationship Type` - Connection name
- `Source Type` - Starting node type
- `Source Example` - Example source
- `Target Type` - Ending node type
- `Target Example` - Example target
- `Relationship Description` - How they connect
- `Bidirectional` - Yes/No + reverse name
- `Strength` - Strong/Medium/Weak
- `Usage Context` - When to use

**Use Cases**:
- Knowledge graph construction
- Relationship-based queries
- Content recommendation
- Network analysis

---

## Import Sequence for GPT

### Phase 1: Core Taxonomy (Priority: Critical)
```
1. Load complete-taxonomy.csv → Filter for "Brain Lobes" rows
2. Load complete-taxonomy.csv → Filter for "Technological Eras" rows  
3. Load book-hierarchy.csv → All rows
4. Load tag-mapping-reference.csv → All rows
```
**Token Budget**: ~18,000 tokens

### Phase 2: Content Indexing (Priority: High)
```
5. Import master_4500 table from database
6. Import expanded-thinkers.ts data
7. Import GCBAT vignettes from database
8. Import all public/books/content/*.json files
```
**Token Budget**: ~380,000 tokens

### Phase 3: Relationship Mapping (Priority: Medium)
```
9. Load content-relationships.csv → Build relationship graph
10. Extract related_thinkers arrays → Build thinker network
11. Extract related_frameworks arrays → Build framework connections
12. Extract era_mapping fields → Build evolution paths
```
**Token Budget**: ~70,000 tokens

### Phase 4: Query Optimization (Priority: High/Medium)
```
13. Configure semantic search using tag relationships
14. Set up era comparison query templates
15. Configure lobe-based filtering
16. Set up book/section scoped queries
```
**Token Budget**: ~23,000 tokens

---

## GPT System Prompt Recommendations

### Core Instructions
```
You are an expert on [Site Name]'s comprehensive knowledge base covering:
- 4500+ thinkers and frameworks
- 15-volume Tech for Humanity series
- Thinking Engine cognitive systems guide
- GCBAT governance narrative vignettes
- WorkFamilyAI alignment framework

Tag System: Use the 38-category TAG_MAPPING for semantic search expansion.
When a user searches for "decision-making", also search: behavioral-economics, 
cognitive-bias, heuristics, bounded-rationality, decision-science.

Brain Lobes: Classify all queries by cognitive domain:
- Perception/Patterning
- Decision/Action  
- Innovation/Strategy
- Ethics/Governance
- Culture/Behaviour

Technological Eras: Always provide era-specific context:
- On-Prem Era (pre-2010)
- Cloud Native Era (2010-2020)
- Generative AI Era (2020-2024)
- Agentic AI Era (2024-2028)
- BCI Era (2028+)

Book Navigation: Understand the collection hierarchy:
- Premier Collection (seeded, ready to use)
- In Development (partial content)
- On the Drawing Board (scaffold only)
```

### Query Patterns
```
When user asks "Who influenced X?":
→ Check related_thinkers array + thinker network graph

When user asks "How did X evolve?":
→ Check era_mapping field + era transition graph

When user asks "What frameworks relate to X?":
→ Check related_frameworks array + framework connections

When user asks "Show me content about X":
→ Expand using TAG_MAPPING relationships
→ Search across book_slug + section_slug
→ Filter by era and lobe as needed
```

---

## Data Quality Notes

### Coverage Levels
- **Complete**: The Thinkers (4500+), GCBAT Vignettes (full narratives)
- **Substantial**: Thinking Engine (6/15 chapters), Tech for Humanity (5/15 volumes)
- **Partial**: WorkFamilyAI (3 chapters), Expanded Thinkers (75+ profiles)
- **Scaffold**: Quantum Logic, Regenerative Organization, Sovereign Systems, The Far Cage, Living Stack

### Known Gaps
1. Not all 4500 thinkers have expanded profiles (only ~75 do)
2. Some book sections have metadata but no detailed content yet
3. Era mappings may be incomplete for older/theoretical content
4. Some tags in TAG_MAPPING may not have corresponding content yet

### Recommended Handling
- For scaffold content: Acknowledge limited availability
- For partial content: Note which sections are complete
- For missing relationships: Suggest related content that IS available
- For undefined tags: Use semantically related tags from TAG_MAPPING

---

## Spreadsheet Analysis Tips

### Pivot Table Suggestions
1. **Tag Distribution**
   - Rows: Category, Subcategory
   - Values: Count of Tags
   - Purpose: See taxonomy balance

2. **Book Maturity Matrix**
   - Rows: Collection
   - Columns: Status
   - Values: Count of Books
   - Purpose: Track development progress

3. **Era Coverage**
   - Rows: Era Name
   - Columns: Book Slug
   - Values: Count of exemplars (from master_4500)
   - Purpose: Identify era gaps

4. **Relationship Network**
   - Use content-relationships.csv
   - Filter by Strength = "Strong"
   - Visualize as network graph
   - Purpose: Core knowledge structure

### Filter Combinations
- **Find AI Ethics content**: Filter tags for "ai-ethics" + related items
- **Find Cloud Era books**: Filter era-characteristics.csv for "Cloud Native Era" + book-hierarchy.csv
- **Find Decision Science thinkers**: Filter complete-taxonomy.csv for "Decision Science" domain
- **Find seeded content**: Filter book-hierarchy.csv for status="seeded"

---

## Integration with Existing Systems

### Database Tables (Supabase)
- `master_4500` - Main exemplar table (matches taxonomy structure)
- `books` - Book metadata (matches book-hierarchy.csv)
- `vignettes` / `enhanced_vignettes` - GCBAT narrative content
- `research_papers` / `book_research_links` - Research citation system

### Frontend Code
- `src/lib/tag-mapping-utils.ts` - TAG_MAPPING constant (38 categories)
- `src/data/eras.ts` - Era definitions
- `src/data/expanded-thinkers.ts` - Extended thinker profiles
- `src/hooks/useBooks.ts` - Book configuration
- `public/books/content/*.json` - Detailed book content

### API Endpoints
- Book content loaded from JSON files (static)
- Master 4500 loaded from Supabase (dynamic)
- Thinker profiles hybrid (static + database)

---

## Version Control
- **Created**: 2025-01-19
- **Last Updated**: 2025-01-19
- **Next Review**: When new books are seeded or major taxonomy changes occur

## Questions?
For questions about this taxonomy system or CSV structure, refer to:
1. `src/types/content.ts` - Type definitions
2. `src/lib/tag-mapping-utils.ts` - Tag system implementation
3. Database schema in Supabase dashboard
