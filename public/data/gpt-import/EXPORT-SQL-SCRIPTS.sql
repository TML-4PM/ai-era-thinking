-- ============================================================================
-- GPT IMPORT - PHASE 2 EXPORT SQL SCRIPTS
-- Run these queries in Supabase SQL Editor to export your data
-- ============================================================================

-- ============================================================================
-- EXPORT 1: Master 4500 Records (07-master-4500-records.json)
-- Estimated: 2,907 records, ~200,000 tokens
-- ============================================================================

SELECT json_build_object(
  'name', 'Master 4500 Records - Phase 2 Export',
  'version', '1.0',
  'description', 'Complete export of exemplar records from The Thinking Engine',
  'export_date', now()::text,
  'record_count', COUNT(*)::integer,
  'records', json_agg(
    json_build_object(
      'id', id,
      'name', title,
      'exemplar_type', exemplar_type,
      'book_slug', COALESCE(book_slug, 'thinking-engine'),
      'section_slug', COALESCE(section_slug, 'general'),
      'summary', COALESCE(description, title),
      'related_thinkers', COALESCE(related_thinkers, ARRAY[]::text[]),
      'related_frameworks', COALESCE(related_frameworks, ARRAY[]::text[]),
      'era_mapping', ARRAY[
        CASE WHEN era_on_prem IS NOT NULL THEN 'on-prem' END,
        CASE WHEN era_cloud_native IS NOT NULL THEN 'cloud-native' END,
        CASE WHEN era_gen_ai IS NOT NULL THEN 'gen-ai' END,
        CASE WHEN era_agentic_ai IS NOT NULL THEN 'agentic-ai' END,
        CASE WHEN era_bci IS NOT NULL THEN 'bci' END
      ]::text[],
      'core_framework', core_framework,
      'original_insight', COALESCE(original_insight, author_original_insight),
      'ai_relevance', COALESCE(ai_relevance, author_ai_relevance),
      'ai_era_shift', COALESCE(ai_era_shift, author_ai_era_shift),
      'cross_era_evolution', cross_era_evolution,
      'status', status,
      'progress', progress
    )
  )
)
FROM "4500 Master"
WHERE title IS NOT NULL;

-- Copy the output and save as: 07-master-4500-records.json

-- ============================================================================
-- EXPORT 2: GCBAT Characters (10-gcbat-characters.json)  
-- Estimated: 9 records, ~10,000 tokens
-- ============================================================================

SELECT json_build_object(
  'name', 'GCBAT Characters - Phase 2 Export',
  'version', '1.0',
  'description', 'Character profiles from GCBAT narrative vignettes',
  'export_date', now()::text,
  'character_count', COUNT(*)::integer,
  'characters', json_agg(
    json_build_object(
      'id', id,
      'name', name,
      'slug', slug,
      'role', role,
      'background', background,
      'character_arc', character_arc,
      'appearance', appearance,
      'voice_style', voice_style,
      'relationships', relationships,
      'gcbat_unit_alignment', gcbat_unit_alignment,
      'portrait_url', portrait_url,
      'exemplar_type', 'character',
      'book_slug', 'gcbat-vignettes'
    )
  )
)
FROM gcbat_characters;

-- Copy the output and save as: 10-gcbat-characters.json

-- ============================================================================
-- EXPORT 3: GCBAT Vignettes (09-gcbat-vignettes.json)
-- Estimated: 1000+ records, ~20,000 tokens  
-- ============================================================================

SELECT json_build_object(
  'name', 'GCBAT Vignettes - Phase 2 Export',
  'version', '1.0',
  'description', 'Narrative vignettes from GCBAT storylines',
  'export_date', now()::text,
  'vignette_count', COUNT(*)::integer,
  'vignettes', json_agg(
    json_build_object(
      'id', id,
      'title', title,
      'slug', slug,
      'content', content,
      'excerpt', excerpt,
      'author', author,
      'character_profiles', character_profiles,
      'related_technologies', related_technologies,
      'persona_name', persona_name,
      'persona_role', persona_role,
      'scenario_context', scenario_context,
      'challenge_description', challenge_description,
      'ai_solution', ai_solution,
      'outcome_description', outcome_description,
      'exemplar_type', 'narrative-vignette',
      'book_slug', 'gcbat-vignettes',
      'tags', COALESCE(tags, ARRAY[]::text[])
    )
  )
)
FROM vignettes
WHERE content IS NOT NULL;

-- Copy the output and save as: 09-gcbat-vignettes.json

-- ============================================================================
-- EXPORT 4: Statistics Summary
-- Quick overview of your data
-- ============================================================================

SELECT json_build_object(
  'name', 'Export Statistics',
  'export_date', now()::text,
  'statistics', json_build_object(
    'total_master_records', (SELECT COUNT(*) FROM "4500 Master" WHERE title IS NOT NULL),
    'by_exemplar_type', (
      SELECT json_object_agg(
        COALESCE(exemplar_type, 'unknown'),
        count
      )
      FROM (
        SELECT exemplar_type, COUNT(*) as count
        FROM "4500 Master"
        WHERE title IS NOT NULL
        GROUP BY exemplar_type
      ) t
    ),
    'by_book_slug', (
      SELECT json_object_agg(
        COALESCE(book_slug, 'unknown'),
        count
      )
      FROM (
        SELECT book_slug, COUNT(*) as count
        FROM "4500 Master"
        WHERE title IS NOT NULL
        GROUP BY book_slug
      ) t
    ),
    'gcbat_characters', (SELECT COUNT(*) FROM gcbat_characters),
    'gcbat_vignettes', (SELECT COUNT(*) FROM vignettes WHERE content IS NOT NULL)
  )
);

-- ============================================================================
-- NEXT STEPS AFTER EXPORT:
-- ============================================================================
-- 1. Run each query above in Supabase SQL Editor
-- 2. Copy the JSON output from each query
-- 3. Save to the corresponding filename
-- 4. For expanded thinkers (08-expanded-thinkers.json), use the export page at /admin/gpt-export
-- 5. For book content consolidation (11-consolidated-book-content.json), merge files from public/books/content/
-- 6. Once all Phase 2 files are ready, proceed to Phase 3 relationship extraction
--
-- See: public/data/gpt-import/IMPLEMENTATION-CHECKLIST.md for full details
-- ============================================================================
