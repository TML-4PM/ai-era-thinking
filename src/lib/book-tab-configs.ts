import { LucideIcon } from "lucide-react";

export interface BookTabConfig {
  path: string;
  label: string;
  icon?: string; // Icon name from lucide-react
}

export const BOOK_TAB_CONFIGS: Record<string, BookTabConfig[]> = {
  // WorkFamilyAI - Standalone book with executive team focus
  'workfamilyai': [
    { path: '', label: 'Overview', icon: 'Home' },
    { path: 'chapters', label: 'Chapters', icon: 'BookOpen' },
    { path: 'executive-team', label: 'Executive Team', icon: 'Users' },
    { path: 'alignment-tools', label: 'Alignment Tools', icon: 'Settings' },
    { path: 'resources', label: 'Resources', icon: 'FolderOpen' }
  ],

  // GCBAT Vignettes - Story-focused navigation
  'gcbat-vignettes': [
    { path: '', label: 'Overview', icon: 'Home' },
    { path: 'chapters', label: 'Stories', icon: 'BookOpen' },
    { path: 'characters', label: 'Characters', icon: 'Users' },
    { path: 'matrix', label: 'Story Matrix', icon: 'Grid' },
    { path: 'arcs', label: 'Story Arcs', icon: 'GitBranch' }
  ],

  // The Thinking Engine - Master framework with sections
  'thinking-engine': [
    { path: '', label: 'Overview', icon: 'Home' },
    { path: 'chapters', label: 'Chapters', icon: 'BookOpen' },
    { path: 'era-evolution', label: 'Era Evolution', icon: 'Calendar' },
    { path: 'master4500', label: 'Browse Exemplars', icon: 'Grid3x3' },
    { path: 'resources', label: 'Resources', icon: 'FolderOpen' }
  ],

  // Tech4Humanity volumes - Research-focused
  'tech-for-humanity-ethics-consent': [
    { path: '', label: 'Overview', icon: 'Home' },
    { path: 'chapters', label: 'Chapters', icon: 'BookOpen' },
    { path: 'leaders-live', label: 'Leaders Live', icon: 'Users' },
    { path: 'resources', label: 'Resources', icon: 'FolderOpen' }
  ],

  'tech-for-humanity-governance-policy': [
    { path: '', label: 'Overview', icon: 'Home' },
    { path: 'chapters', label: 'Chapters', icon: 'BookOpen' },
    { path: 'leaders-live', label: 'Leaders Live', icon: 'Users' },
    { path: 'resources', label: 'Resources', icon: 'FolderOpen' }
  ],

  'tech-for-humanity-healthcare-wellbeing': [
    { path: '', label: 'Overview', icon: 'Home' },
    { path: 'chapters', label: 'Chapters', icon: 'BookOpen' },
    { path: 'leaders-live', label: 'Leaders Live', icon: 'Users' },
    { path: 'resources', label: 'Resources', icon: 'FolderOpen' }
  ],

  'tech-for-humanity-climate-environment': [
    { path: '', label: 'Overview', icon: 'Home' },
    { path: 'chapters', label: 'Chapters', icon: 'BookOpen' },
    { path: 'leaders-live', label: 'Leaders Live', icon: 'Users' },
    { path: 'resources', label: 'Resources', icon: 'FolderOpen' }
  ],

  'tech-for-humanity-education-knowledge': [
    { path: '', label: 'Overview', icon: 'Home' },
    { path: 'chapters', label: 'Chapters', icon: 'BookOpen' },
    { path: 'leaders-live', label: 'Leaders Live', icon: 'Users' },
    { path: 'resources', label: 'Resources', icon: 'FolderOpen' }
  ],

  // Other framework books
  'quantum-logic-systems': [
    { path: '', label: 'Overview', icon: 'Home' },
    { path: 'chapters', label: 'Chapters', icon: 'BookOpen' },
    { path: 'leaders-live', label: 'Leaders Live', icon: 'Users' },
    { path: 'resources', label: 'Resources', icon: 'FolderOpen' }
  ],

  'regenerative-organization': [
    { path: '', label: 'Overview', icon: 'Home' },
    { path: 'chapters', label: 'Chapters', icon: 'BookOpen' },
    { path: 'leaders-live', label: 'Leaders Live', icon: 'Users' },
    { path: 'resources', label: 'Resources', icon: 'FolderOpen' }
  ],

  // Default configuration for any book not explicitly configured
  'default': [
    { path: '', label: 'Overview', icon: 'Home' },
    { path: 'chapters', label: 'Chapters', icon: 'BookOpen' },
    { path: 'leaders-live', label: 'Leaders Live', icon: 'Users' },
    { path: 'add-guru', label: 'Add Your Guru', icon: 'UserPlus' },
    { path: 'resources', label: 'Resources', icon: 'Settings' }
  ]
};

/**
 * Get tab configuration for a specific book
 */
export function getBookTabs(bookSlug: string): BookTabConfig[] {
  return BOOK_TAB_CONFIGS[bookSlug] || BOOK_TAB_CONFIGS.default;
}

/**
 * Check if a tab should be shown for a book
 */
export function shouldShowTabForBook(bookSlug: string, tabPath: string): boolean {
  const tabs = getBookTabs(bookSlug);
  return tabs.some(tab => tab.path === tabPath);
}
