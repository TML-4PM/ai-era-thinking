// Volume type classification for conditional navigation in The Thinking Engine Hub

export type VolumeType = 'thinker' | 'institution' | 'principle' | 'technology' | 'cultural' | 'era' | 'unstructured';

export interface VolumeTabConfig {
  volumeType: VolumeType;
  tabs: Array<{
    path: string;
    label: string;
    icon: string;
    show: boolean;
  }>;
}

export const VOLUME_TAB_CONFIGS: Record<VolumeType, string[]> = {
  thinker: ['overview', 'chapters', 'leaders-live', 'add-guru', 'resources'],
  institution: ['overview', 'chapters', 'directory', 'resources'],
  principle: ['overview', 'chapters', 'framework-explorer', 'resources'],
  technology: ['overview', 'chapters', 'tech-stack', 'resources'],
  cultural: ['overview', 'chapters', 'perspectives', 'resources'],
  era: ['overview', 'chapters', 'timeline', 'resources'],
  unstructured: ['overview', 'chapters', 'contribute', 'resources']
};

export function getVolumeTypeFromSlug(slug: string): VolumeType | null {
  // Map section slugs to volume types
  const volumeTypeMap: Record<string, VolumeType> = {
    'frameworks': 'thinker',
    'thinkers-brains-that-shaped-brains': 'thinker',
    'thinking-engine-disciplines': 'thinker',
    'roles-humans-in-machine': 'thinker',
    'thinking-engine-institutions': 'institution',
    'thinking-engine-organizations': 'institution',
    'thinking-engine-principles': 'principle',
    'thinking-engine-doctrines': 'principle',
    'thinking-engine-technologies': 'technology',
    'thinking-engine-products': 'technology',
    'thinking-engine-cultures': 'cultural',
    'thinking-engine-environment': 'cultural',
    'thinking-engine-eras': 'era',
    'thinking-engine-energy-forces': 'unstructured',
    'thinking-engine-unstructured': 'unstructured'
  };
  
  return volumeTypeMap[slug] || null;
}

export function shouldShowTab(bookSlug: string, currentPath: string, tabName: string): boolean {
  // For non-thinking-engine books, show default tabs
  if (bookSlug !== 'thinking-engine') {
    return ['overview', 'chapters', 'leaders-live', 'add-guru', 'resources'].includes(tabName);
  }
  
  // For thinking engine, check if we're in a specific volume
  const volumeSlugMatch = currentPath.match(/\/books\/[^\/]+\/sections\/([^\/]+)/);
  if (!volumeSlugMatch) {
    // Show all tabs on main book page
    return true;
  }
  
  const volumeSlug = volumeSlugMatch[1];
  const volumeType = getVolumeTypeFromSlug(volumeSlug);
  
  if (!volumeType) {
    return true; // Show all tabs if type unknown
  }
  
  const allowedTabs = VOLUME_TAB_CONFIGS[volumeType];
  return allowedTabs.includes(tabName);
}
