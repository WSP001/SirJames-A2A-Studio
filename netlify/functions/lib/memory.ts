/**
 * Memory System for Sir James Adventures
 * 
 * Integrates with Byterover MCP for persistent knowledge storage
 * and localStorage for client-side session data.
 * 
 * Commons Good Compliance:
 * - No PII stored
 * - Transparent data usage
 * - Cost tracking included
 */

import fs from 'fs/promises';
import path from 'path';

// Memory index path (server-side)
const MEMORY_PATH = process.env.VAULT_PATH 
  ? path.join(process.env.VAULT_PATH, 'memory_index.json')
  : path.join(process.cwd(), 'content', 'memory_index.json');

// Memory structure interface
export interface MemoryIndex {
  version: string;
  project: string;
  created: string;
  updated: string;
  user_preferences: {
    favorite_moods: string[];
    favorite_themes: string[];
    preferred_virtues: string[];
    session_count: number;
  };
  video_history: Array<{
    id: string;
    theme: string;
    mood: string;
    created: string;
  }>;
  feedback_log: Array<{
    type: 'thumbs_up' | 'thumbs_down';
    chapter: number;
    scene: number;
    timestamp: string;
  }>;
  virtue_progress: {
    courage: number;
    wisdom: number;
    trust: number;
  };
  chapter_progress: {
    completed: number[];
    current_chapter: number;
    current_scene: number;
  };
  parent_inputs: Array<{
    situation: string;
    theme: string;
    timestamp: string;
  }>;
  learning_insights: {
    patterns: string[];
    recommendations: string[];
  };
  commons_good: {
    total_cost_usd: number;
    images_generated: number;
    audio_generated: number;
    stories_created: number;
  };
}

// Default memory structure
const DEFAULT_MEMORY: MemoryIndex = {
  version: '1.0.0',
  project: 'Sir James Adventures Book002',
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  user_preferences: {
    favorite_moods: [],
    favorite_themes: [],
    preferred_virtues: ['courage', 'wisdom', 'trust'],
    session_count: 0
  },
  video_history: [],
  feedback_log: [],
  virtue_progress: { courage: 0, wisdom: 0, trust: 0 },
  chapter_progress: { completed: [], current_chapter: 1, current_scene: 1 },
  parent_inputs: [],
  learning_insights: { patterns: [], recommendations: [] },
  commons_good: { total_cost_usd: 0, images_generated: 0, audio_generated: 0, stories_created: 0 }
};

/**
 * Read memory from file system
 */
export async function readMemory(): Promise<MemoryIndex> {
  try {
    const data = await fs.readFile(MEMORY_PATH, 'utf-8');
    return JSON.parse(data) as MemoryIndex;
  } catch (error) {
    console.log('Memory file not found, returning default');
    return DEFAULT_MEMORY;
  }
}

/**
 * Write memory to file system
 */
export async function writeMemory(memory: MemoryIndex): Promise<void> {
  memory.updated = new Date().toISOString();
  await fs.writeFile(MEMORY_PATH, JSON.stringify(memory, null, 2));
}

/**
 * Store feedback from parent dashboard
 */
export async function storeFeedback(
  type: 'thumbs_up' | 'thumbs_down',
  chapter: number,
  scene: number
): Promise<void> {
  const memory = await readMemory();
  memory.feedback_log.push({
    type,
    chapter,
    scene,
    timestamp: new Date().toISOString()
  });
  await writeMemory(memory);
}

/**
 * Store parent input for story generation
 */
export async function storeParentInput(
  situation: string,
  theme: string
): Promise<void> {
  const memory = await readMemory();
  memory.parent_inputs.push({
    situation,
    theme,
    timestamp: new Date().toISOString()
  });
  memory.user_preferences.session_count++;
  await writeMemory(memory);
}

/**
 * Update virtue progress
 */
export async function updateVirtueProgress(
  virtue: 'courage' | 'wisdom' | 'trust',
  increment: number = 1
): Promise<void> {
  const memory = await readMemory();
  memory.virtue_progress[virtue] += increment;
  await writeMemory(memory);
}

/**
 * Track cost for Commons Good compliance
 */
export async function trackCost(
  costUsd: number,
  type: 'image' | 'audio' | 'story'
): Promise<void> {
  const memory = await readMemory();
  memory.commons_good.total_cost_usd += costUsd;
  if (type === 'image') memory.commons_good.images_generated++;
  if (type === 'audio') memory.commons_good.audio_generated++;
  if (type === 'story') memory.commons_good.stories_created++;
  await writeMemory(memory);
}

/**
 * Get learning insights based on feedback patterns
 */
export async function getLearningInsights(): Promise<string[]> {
  const memory = await readMemory();
  const insights: string[] = [];
  
  // Analyze feedback patterns
  const thumbsUp = memory.feedback_log.filter(f => f.type === 'thumbs_up').length;
  const thumbsDown = memory.feedback_log.filter(f => f.type === 'thumbs_down').length;
  
  if (thumbsUp > thumbsDown * 2) {
    insights.push('Child is highly engaged with current content style');
  }
  
  // Analyze virtue preferences
  const { courage, wisdom, trust } = memory.virtue_progress;
  const maxVirtue = Math.max(courage, wisdom, trust);
  if (maxVirtue === courage) insights.push('Shows strong preference for courage-based choices');
  if (maxVirtue === wisdom) insights.push('Shows strong preference for wisdom-based choices');
  if (maxVirtue === trust) insights.push('Shows strong preference for trust-based choices');
  
  return insights;
}

