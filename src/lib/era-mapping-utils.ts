/**
 * Era Mapping Utilities for The Thinking Engine
 * Provides consistent color schemes, calculations, and transformations for the 5-era system
 */

export type EraName = 'on_prem' | 'cloud_native' | 'gen_ai' | 'agentic_ai' | 'bci';

export interface EraConfig {
  id: EraName;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
  description: string;
  timeframe: string;
}

export const ERA_CONFIGS: Record<EraName, EraConfig> = {
  on_prem: {
    id: 'on_prem',
    label: 'On-Premise',
    color: 'slate',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    borderColor: 'border-slate-300 dark:border-slate-600',
    textColor: 'text-slate-800 dark:text-slate-200',
    icon: 'Server',
    description: 'Traditional infrastructure and systems',
    timeframe: '1980-2010'
  },
  cloud_native: {
    id: 'cloud_native',
    label: 'Cloud-Native',
    color: 'blue',
    bgColor: 'bg-blue-100 dark:bg-blue-800',
    borderColor: 'border-blue-300 dark:border-blue-600',
    textColor: 'text-blue-800 dark:text-blue-200',
    icon: 'Cloud',
    description: 'Cloud computing and distributed systems',
    timeframe: '2010-2020'
  },
  gen_ai: {
    id: 'gen_ai',
    label: 'Gen AI',
    color: 'purple',
    bgColor: 'bg-purple-100 dark:bg-purple-800',
    borderColor: 'border-purple-300 dark:border-purple-600',
    textColor: 'text-purple-800 dark:text-purple-200',
    icon: 'Sparkles',
    description: 'Generative AI and large language models',
    timeframe: '2020-2025'
  },
  agentic_ai: {
    id: 'agentic_ai',
    label: 'Agentic AI',
    color: 'green',
    bgColor: 'bg-green-100 dark:bg-green-800',
    borderColor: 'border-green-300 dark:border-green-600',
    textColor: 'text-green-800 dark:text-green-200',
    icon: 'Bot',
    description: 'Autonomous AI agents and systems',
    timeframe: '2025-2028'
  },
  bci: {
    id: 'bci',
    label: 'BCI',
    color: 'rose',
    bgColor: 'bg-rose-100 dark:bg-rose-800',
    borderColor: 'border-rose-300 dark:border-rose-600',
    textColor: 'text-rose-800 dark:text-rose-200',
    icon: 'Brain',
    description: 'Brain-computer interfaces and neural tech',
    timeframe: '2028+'
  }
};

export const ALL_ERAS: EraName[] = ['on_prem', 'cloud_native', 'gen_ai', 'agentic_ai', 'bci'];

/**
 * Calculate what percentage of eras an exemplar covers
 */
export function calculateEraCoverage(exemplar: any): number {
  const eraFields = ['era_on_prem', 'era_cloud_native', 'era_gen_ai', 'era_agentic_ai', 'era_bci'];
  const coveredEras = eraFields.filter(field => exemplar[field] && exemplar[field].trim() !== '');
  return Math.round((coveredEras.length / eraFields.length) * 100);
}

/**
 * Get the badge color for an era
 */
export function getEraBadgeColor(eraName: EraName): string {
  return ERA_CONFIGS[eraName]?.color || 'slate';
}

/**
 * Get era configuration
 */
export function getEraConfig(eraName: EraName): EraConfig {
  return ERA_CONFIGS[eraName];
}

/**
 * Group exemplars by era relevance
 */
export function groupExemplarsByEra(exemplars: any[]): Record<EraName, any[]> {
  const grouped: Record<EraName, any[]> = {
    on_prem: [],
    cloud_native: [],
    gen_ai: [],
    agentic_ai: [],
    bci: []
  };

  exemplars.forEach(exemplar => {
    ALL_ERAS.forEach(era => {
      const fieldName = `era_${era}`;
      if (exemplar[fieldName] && exemplar[fieldName].trim() !== '') {
        grouped[era].push(exemplar);
      }
    });
  });

  return grouped;
}

/**
 * Extract evolution story from exemplar's era mappings
 */
export function traceEvolution(exemplar: any): { era: EraName; content: string }[] {
  const evolution: { era: EraName; content: string }[] = [];

  ALL_ERAS.forEach(era => {
    const fieldName = `era_${era}`;
    if (exemplar[fieldName] && exemplar[fieldName].trim() !== '') {
      evolution.push({
        era,
        content: exemplar[fieldName]
      });
    }
  });

  return evolution;
}

/**
 * Get chapter icon name
 */
export function getChapterIcon(chapterTitle: string): string {
  const iconMap: Record<string, string> = {
    'Principles': 'Scale',
    'Institutions': 'Building2',
    'Doctrines': 'BookText',
    'Frameworks': 'Grid3x3',
    'Thinkers': 'Brain',
    'Disciplines': 'GraduationCap',
    'Technologies': 'Cpu',
    'Organizations': 'Building',
    'Cultures': 'Globe',
    'Roles': 'Users',
    'Products': 'Package',
    'Eras': 'Calendar',
    'Environment': 'Trees',
    'Energy and Forces': 'Zap',
    'Unstructured': 'Sparkles'
  };
  
  return iconMap[chapterTitle] || 'BookOpen';
}

/**
 * Check if exemplar has any era content
 */
export function hasEraContent(exemplar: any): boolean {
  return ALL_ERAS.some(era => {
    const fieldName = `era_${era}`;
    return exemplar[fieldName] && exemplar[fieldName].trim() !== '';
  });
}

/**
 * Get era count for exemplar
 */
export function getEraCount(exemplar: any): number {
  return ALL_ERAS.filter(era => {
    const fieldName = `era_${era}`;
    return exemplar[fieldName] && exemplar[fieldName].trim() !== '';
  }).length;
}