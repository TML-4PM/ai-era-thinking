import { EXPANDED_THINKERS } from "@/data/expanded-thinkers";

/**
 * Utility functions for GPT export data preparation and validation
 */

export interface GPTExportFile {
  filename: string;
  name: string;
  description: string;
  estimatedTokens: number;
  phase: 1 | 2 | 3 | 4;
  status: 'ready' | 'pending' | 'manual';
  sourceType: 'file' | 'database' | 'code';
  downloadAction?: () => Promise<void>;
}

/**
 * Convert expanded thinkers TypeScript data to JSON format
 */
export const exportExpandedThinkers = () => {
  const transformedData = EXPANDED_THINKERS.map(thinker => ({
    name: thinker.name,
    area: thinker.area,
    core_idea: thinker.coreIdea,
    ai_shift: thinker.aiShift,
    lobe: thinker.lobe,
    bio: thinker.bio || '',
    core_framework: thinker.coreFramework,
    team_members: thinker.hardCodedTeam || [],
    cross_era_relevance: thinker.crossEraRelevance,
    usage_prompts: thinker.usagePrompts,
    related_thinkers: thinker.relatedThinkers,
    practical_applications: thinker.practicalApplications
  }));

  const output = {
    name: "Expanded Thinkers - Phase 2 Export",
    version: "1.0",
    description: `Detailed profiles of ${transformedData.length} key thinkers with AI-era analysis`,
    export_date: new Date().toISOString(),
    estimated_tokens: transformedData.length * 800,
    record_count: transformedData.length,
    thinkers: transformedData
  };

  return output;
};

/**
 * Consolidate all book content JSON files
 */
export const consolidateBookContent = async () => {
  const bookFiles = [
    'disciplines.json',
    'eras.json',
    'eras-time-canvas.json',
    'frameworks.json',
    'living-stack.json',
    'quantum-logic-systems.json',
    'regenerative-organization.json',
    'roles-humans-in-machine.json',
    'tech-for-humanity.json',
    'tech-for-humanity-climate-environment.json',
    'tech-for-humanity-education-knowledge.json',
    'tech-for-humanity-ethics-consent.json',
    'tech-for-humanity-governance-policy.json',
    'tech-for-humanity-healthcare-wellbeing.json',
    'technologies.json',
    'thinkers-brains-that-shaped-brains.json',
    'thinking-engine.json',
    'workfamilyai-ch1.json',
    'workfamilyai-ch2.json',
    'workfamilyai-ch3.json'
  ];

  const consolidatedContent: any[] = [];
  let totalTokens = 0;

  for (const filename of bookFiles) {
    try {
      const response = await fetch(`/books/content/${filename}`);
      if (response.ok) {
        const content = await response.json();
        consolidatedContent.push({
          source_file: filename,
          book_slug: filename.replace('.json', ''),
          content: content
        });
        // Rough token estimate: 100 tokens per book file
        totalTokens += 100;
      }
    } catch (error) {
      console.warn(`Could not load ${filename}:`, error);
    }
  }

  const output = {
    name: "Consolidated Book Content - Phase 2 Export",
    version: "1.0",
    description: `Consolidated content from ${consolidatedContent.length} book JSON files`,
    export_date: new Date().toISOString(),
    estimated_tokens: totalTokens,
    file_count: consolidatedContent.length,
    books: consolidatedContent
  };

  return output;
};

/**
 * Download JSON data as a file
 */
export const downloadJSON = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Validate GPT export data structure
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateExportData = (data: any, expectedFields: string[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required top-level fields
  if (!data.name) errors.push('Missing required field: name');
  if (!data.version) errors.push('Missing required field: version');
  if (!data.export_date) errors.push('Missing required field: export_date');
  
  // Check for data records
  const recordsField = Object.keys(data).find(key => 
    Array.isArray(data[key]) && key !== 'errors' && key !== 'warnings'
  );
  
  if (!recordsField) {
    errors.push('No data records found');
  } else if (data[recordsField].length === 0) {
    warnings.push('Export contains 0 records');
  }

  // Validate expected fields in records
  if (recordsField && data[recordsField].length > 0) {
    const sampleRecord = data[recordsField][0];
    expectedFields.forEach(field => {
      if (!(field in sampleRecord)) {
        warnings.push(`Missing expected field in records: ${field}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Get file list for GPT import package
 */
export const getGPTExportFiles = (): GPTExportFile[] => {
  return [
    // Phase 1: Core Taxonomy
    {
      filename: '00-master-config.json',
      name: 'Master Configuration',
      description: 'Central configuration and metadata',
      estimatedTokens: 5000,
      phase: 1,
      status: 'ready',
      sourceType: 'file'
    },
    {
      filename: '01-tag-mapping.json',
      name: 'Tag Mapping Reference',
      description: 'Comprehensive tag taxonomy and relationships',
      estimatedTokens: 15000,
      phase: 1,
      status: 'ready',
      sourceType: 'file'
    },
    {
      filename: '02-brain-lobes.json',
      name: 'Brain Lobes (Cognitive Domains)',
      description: 'Cognitive domain classification system',
      estimatedTokens: 8000,
      phase: 1,
      status: 'ready',
      sourceType: 'file'
    },
    {
      filename: '03-technological-eras.json',
      name: 'Technological Eras',
      description: 'Five eras of technological evolution',
      estimatedTokens: 20000,
      phase: 1,
      status: 'ready',
      sourceType: 'file'
    },
    {
      filename: '04-book-hierarchy.json',
      name: 'Book Hierarchy',
      description: 'Complete book and section structure',
      estimatedTokens: 12000,
      phase: 1,
      status: 'ready',
      sourceType: 'file'
    },
    {
      filename: '05-relationship-types.json',
      name: 'Relationship Types',
      description: 'Types of connections between entities',
      estimatedTokens: 10000,
      phase: 1,
      status: 'ready',
      sourceType: 'file'
    },
    // Phase 2: Content Indexing
    {
      filename: '07-master-4500-records.json',
      name: 'Master 4500 Records',
      description: 'Core exemplar records from database',
      estimatedTokens: 315000,
      phase: 2,
      status: 'pending',
      sourceType: 'database'
    },
    {
      filename: '08-expanded-thinkers.json',
      name: 'Expanded Thinkers',
      description: 'Detailed thinker profiles with AI analysis',
      estimatedTokens: 56000,
      phase: 2,
      status: 'pending',
      sourceType: 'code'
    },
    {
      filename: '09-gcbat-vignettes.json',
      name: 'GCBAT Vignettes',
      description: 'Narrative vignettes and stories',
      estimatedTokens: 45000,
      phase: 2,
      status: 'pending',
      sourceType: 'database'
    },
    {
      filename: '10-gcbat-characters.json',
      name: 'GCBAT Characters',
      description: 'Character profiles and personas',
      estimatedTokens: 30000,
      phase: 2,
      status: 'pending',
      sourceType: 'database'
    },
    {
      filename: '11-consolidated-book-content.json',
      name: 'Consolidated Book Content',
      description: 'All book content merged',
      estimatedTokens: 85000,
      phase: 2,
      status: 'pending',
      sourceType: 'file'
    },
    // Phase 3: Relationship Mapping
    {
      filename: '13-thinker-network.json',
      name: 'Thinker Network',
      description: 'Relationships between thinkers',
      estimatedTokens: 8000,
      phase: 3,
      status: 'ready',
      sourceType: 'file'
    },
    {
      filename: '14-framework-connections.json',
      name: 'Framework Connections',
      description: 'How frameworks relate to each other',
      estimatedTokens: 10000,
      phase: 3,
      status: 'ready',
      sourceType: 'file'
    },
    {
      filename: '15-era-evolution-paths.json',
      name: 'Era Evolution Paths',
      description: 'How concepts evolve across eras',
      estimatedTokens: 15000,
      phase: 3,
      status: 'ready',
      sourceType: 'file'
    },
    {
      filename: '16-complete-graph.json',
      name: 'Complete Knowledge Graph',
      description: 'Full relationship graph structure',
      estimatedTokens: 25000,
      phase: 3,
      status: 'ready',
      sourceType: 'file'
    },
    // Phase 4: Query Optimization
    {
      filename: '17-query-optimization-config.json',
      name: 'Query Optimization Config',
      description: 'Rules for GPT query processing',
      estimatedTokens: 12000,
      phase: 4,
      status: 'ready',
      sourceType: 'file'
    }
  ];
};

/**
 * Calculate completion statistics
 */
export const calculateCompletionStats = (files: GPTExportFile[]) => {
  const byPhase = {
    1: files.filter(f => f.phase === 1),
    2: files.filter(f => f.phase === 2),
    3: files.filter(f => f.phase === 3),
    4: files.filter(f => f.phase === 4)
  };

  const stats = {
    overall: {
      total: files.length,
      ready: files.filter(f => f.status === 'ready').length,
      pending: files.filter(f => f.status === 'pending').length,
      completionPercent: Math.round((files.filter(f => f.status === 'ready').length / files.length) * 100)
    },
    byPhase: Object.entries(byPhase).map(([phase, phaseFiles]) => ({
      phase: parseInt(phase),
      total: phaseFiles.length,
      ready: phaseFiles.filter(f => f.status === 'ready').length,
      pending: phaseFiles.filter(f => f.status === 'pending').length,
      completionPercent: Math.round((phaseFiles.filter(f => f.status === 'ready').length / phaseFiles.length) * 100)
    })),
    tokens: {
      total: files.reduce((sum, f) => sum + f.estimatedTokens, 0),
      ready: files.filter(f => f.status === 'ready').reduce((sum, f) => sum + f.estimatedTokens, 0),
      pending: files.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.estimatedTokens, 0)
    }
  };

  return stats;
};
