/**
 * WorkFamilyAI Terminology Mapping
 * Maps database schema names to user-facing display terms
 * 
 * Database schema uses "neural_ennead_*" for historical reasons,
 * but display layer uses "WorkFamilyAI" branding
 */

export const WORKFAMILY_TERMINOLOGY = {
  // Members/Agents
  member: 'WorkFamilyAI Agent',
  members: 'WorkFamilyAI Agents',
  memberShort: 'Agent',
  membersShort: 'Agents',
  
  // Families/Domains
  family: 'Domain',
  families: 'Domains',
  familyDescription: 'Work-Family Domain',
  
  // Teams
  team: 'Executive Team',
  teams: 'Executive Teams',
  teamMember: 'Team Member',
  
  // Alignment
  alignment: 'Work-Family Alignment',
  alignmentScore: 'Alignment Score',
  alignmentRationale: 'Alignment Rationale',
  
  // Contexts
  workContext: 'Professional Context',
  familyContext: 'Personal/Family Context',
  communityContext: 'Community Context',
  
  // Archetypes
  archetype: 'WorkFamily Archetype',
  archetypes: 'WorkFamily Archetypes',
  
  // System
  system: 'WorkFamilyAI System',
  framework: 'WorkFamilyAI Framework',
  
  // Documents
  documentation: 'Holo-Org Documentation',
  resources: 'WorkFamilyAI Resources'
};

/**
 * Get display term for a database field
 */
export function getWorkFamilyTerm(key: keyof typeof WORKFAMILY_TERMINOLOGY): string {
  return WORKFAMILY_TERMINOLOGY[key];
}

/**
 * Replace Neural Ennead terminology with WorkFamilyAI in text
 */
export function replaceNeuralEnneadTerms(text: string): string {
  return text
    .replace(/neural ennead member/gi, 'WorkFamilyAI Agent')
    .replace(/neural ennead family/gi, 'Domain')
    .replace(/neural ennead/gi, 'WorkFamilyAI')
    .replace(/ennead member/gi, 'Agent')
    .replace(/ennead family/gi, 'Domain');
}

/**
 * Check if context is WorkFamilyAI-related
 */
export function isWorkFamilyContext(context: string): boolean {
  const workfamilyKeywords = [
    'workfamily',
    'work-family',
    'neural_ennead',
    'holo-org',
    'holacracy',
    'organizational_alignment'
  ];
  return workfamilyKeywords.some(keyword => 
    context.toLowerCase().includes(keyword)
  );
}
