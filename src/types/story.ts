/**
 * TypeScript types for Sir James Adventures Interactive Story Schema v3.0
 */

export type Virtue = 'courage' | 'wisdom' | 'trust';
export type SceneType = 'narrative' | 'decision' | 'climax' | 'introduction' | 'conclusion';

export interface StoryMetadata {
  title: string;
  book: string; // Pattern: Book###
  chapter: string; // Pattern: Chapter##
  author: string;
  created: string; // ISO date-time
  updated: string; // ISO date-time
  description?: string;
  tags?: string[];
}

export interface CharacterTraits {
  eye_color?: string;
  personality?: string[];
  [key: string]: unknown;
}

export interface Character {
  name: string;
  description: string;
  species?: string;
  traits?: CharacterTraits;
}

export interface SirJamesCharacter extends Character {
  name: 'Sir James';
  traits: CharacterTraits & {
    eye_color: 'blue';
  };
}

export interface SparkyCharacter extends Character {
  name: 'Sparky';
  species: 'squirrel';
}

export interface Characters {
  sir_james: SirJamesCharacter;
  sparky: SparkyCharacter;
  [key: string]: Character;
}

export interface Choice {
  id: string;
  text: string;
  virtue: Virtue;
  next_scene?: string; // Pattern: ch##_s###
  consequence?: string;
}

export interface Scene {
  id: string; // Pattern: ch##_s###
  scene_type: SceneType;
  title: string;
  content: string;
  characters?: string[];
  choices?: Choice[];
  next_scene?: string; // Pattern: ch##_s###
}

export interface Story {
  version: '3.0';
  metadata: StoryMetadata;
  characters: Characters;
  scenes: Scene[];
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}