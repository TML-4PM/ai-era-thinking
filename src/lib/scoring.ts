import type { Thinker } from '@/data/thinkers';
import type { ExpandedThinker } from '@/data/expanded-thinkers';
import { ERAS } from '@/data/eras';

// Topic areas for scoring
export const TOPIC_AREAS = {
  AGENTIC_AI: 'Agentic AI',
  AI_GENERAL: 'AI General',
  CLOUD_COMPUTING: 'Cloud Computing',
  ONPREM_SECURITY: 'On-Prem Security/Legislation'
} as const;

export type TopicArea = typeof TOPIC_AREAS[keyof typeof TOPIC_AREAS];

// Era scoring weights (higher = more recent/relevant)
const ERA_WEIGHTS: Record<string, number> = {
  'On-Premises Era': 1,
  'Cloud Native Era': 2,
  'Generative AI Era': 3,
  'Agentic AI Era': 4,
  'Brain-Computer Interface Era': 5
};

// Compute era-based relevance scores
export function computeEraScores(thinker: Thinker, expanded?: ExpandedThinker) {
  const scores: Record<string, number> = {};
  
  ERAS.forEach(era => {
    let score = 0;
    
    // Base score from thinker's core ideas
    if (thinker.coreIdea.toLowerCase().includes('system') || 
        thinker.coreIdea.toLowerCase().includes('organization')) {
      score += ERA_WEIGHTS[era.name] * 0.3;
    }
    
    if (thinker.coreIdea.toLowerCase().includes('decision') ||
        thinker.coreIdea.toLowerCase().includes('behavior')) {
      score += ERA_WEIGHTS[era.name] * 0.4;
    }
    
    // Enhanced scoring from expanded data
    if (expanded?.crossEraRelevance) {
      const eraKey = era.id.replace('-', '').replace('_', '').toLowerCase();
      let relevanceForEra = '';
      
      if (eraKey === 'onprem') relevanceForEra = expanded.crossEraRelevance.onPrem;
      else if (eraKey === 'cloudnative') relevanceForEra = expanded.crossEraRelevance.cloudNative;
      else if (eraKey === 'genai') relevanceForEra = expanded.crossEraRelevance.genAI;
      else if (eraKey === 'agentcai' || eraKey === 'agenticai') relevanceForEra = expanded.crossEraRelevance.agenticAI;
      else if (eraKey === 'bci') relevanceForEra = expanded.crossEraRelevance.bci;
      
      if (relevanceForEra && relevanceForEra.length > 20) { // Non-empty meaningful content
        score += (ERA_WEIGHTS[era.name] || 1) * 0.6;
      }
    }
    
    scores[era.name] = Math.min(score, 5); // Cap at 5
  });
  
  return scores;
}

// Compute topic-specific relevance scores
export function computeTopicScores(thinker: Thinker, expanded?: ExpandedThinker) {
  const scores: Record<TopicArea, number> = {
    [TOPIC_AREAS.AGENTIC_AI]: 0,
    [TOPIC_AREAS.AI_GENERAL]: 0,
    [TOPIC_AREAS.CLOUD_COMPUTING]: 0,
    [TOPIC_AREAS.ONPREM_SECURITY]: 0
  };
  
  const coreIdea = thinker.coreIdea.toLowerCase();
  const aiShift = thinker.aiShift.toLowerCase();
  const area = thinker.area.toLowerCase();
  
  // Agentic AI scoring
  if (coreIdea.includes('system') || coreIdea.includes('autonomous') || 
      aiShift.includes('agent') || aiShift.includes('autonomous')) {
    scores[TOPIC_AREAS.AGENTIC_AI] += 4;
  }
  if (thinker.lobe === 'Decision/Action' || thinker.lobe === 'Innovation/Strategy') {
    scores[TOPIC_AREAS.AGENTIC_AI] += 2;
  }
  
  // AI General scoring
  if (aiShift.includes('ai') || aiShift.includes('machine') || 
      area.includes('technology') || area.includes('computation')) {
    scores[TOPIC_AREAS.AI_GENERAL] += 3;
  }
  if (coreIdea.includes('decision') || coreIdea.includes('learning')) {
    scores[TOPIC_AREAS.AI_GENERAL] += 2;
  }
  
  // Cloud Computing scoring
  if (area.includes('technology') || area.includes('system') ||
      coreIdea.includes('network') || coreIdea.includes('distributed')) {
    scores[TOPIC_AREAS.CLOUD_COMPUTING] += 3;
  }
  if (aiShift.includes('scale') || aiShift.includes('infrastructure')) {
    scores[TOPIC_AREAS.CLOUD_COMPUTING] += 2;
  }
  
  // On-Prem Security/Legislation scoring
  if (area.includes('regulation') || area.includes('policy') ||
      coreIdea.includes('governance') || coreIdea.includes('control')) {
    scores[TOPIC_AREAS.ONPREM_SECURITY] += 4;
  }
  if (aiShift.includes('privacy') || aiShift.includes('security') || 
      aiShift.includes('compliance')) {
    scores[TOPIC_AREAS.ONPREM_SECURITY] += 3;
  }
  
  // Enhanced scoring from expanded data
  if (expanded) {
    Object.entries(scores).forEach(([topic, currentScore]) => {
      const practicalApps = Object.values(expanded.practicalApplications || {}).join(' ').toLowerCase();
      const usagePrompts = expanded.usagePrompts?.map(p => p.question + ' ' + p.context + ' ' + p.application).join(' ').toLowerCase() || '';
      
      if (practicalApps.includes(topic.toLowerCase()) || 
          usagePrompts.includes(topic.toLowerCase())) {
        scores[topic as TopicArea] += 1;
      }
    });
  }
  
  // Normalize scores to 0-5 range
  Object.keys(scores).forEach(topic => {
    scores[topic as TopicArea] = Math.min(scores[topic as TopicArea], 5);
  });
  
  return scores;
}

// Get composite score for a thinker based on topic and era
export function getCompositeScore(
  thinker: Thinker, 
  expanded: ExpandedThinker | undefined,
  options: { topic?: TopicArea; era?: string } = {}
): number {
  const topicScores = computeTopicScores(thinker, expanded);
  const eraScores = computeEraScores(thinker, expanded);
  
  let score = 0;
  let weights = 0;
  
  // Add topic score if specified
  if (options.topic) {
    score += topicScores[options.topic] * 0.6;
    weights += 0.6;
  }
  
  // Add era score if specified
  if (options.era) {
    score += (eraScores[options.era] || 0) * 0.4;
    weights += 0.4;
  }
  
  // If no specific filters, use general relevance
  if (weights === 0) {
    const avgTopicScore = Object.values(topicScores).reduce((a, b) => a + b, 0) / Object.values(topicScores).length;
    const avgEraScore = Object.values(eraScores).reduce((a, b) => a + b, 0) / Object.values(eraScores).length;
    score = (avgTopicScore + avgEraScore) / 2;
  } else {
    score = score / weights;
  }
  
  return Math.round(score * 10) / 10; // Round to 1 decimal
}