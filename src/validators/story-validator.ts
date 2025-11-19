import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { Story, ValidationResult } from '../types/story.js';

export class StoryValidator {
  private ajv: Ajv;
  private schema: object;

  constructor() {
    this.ajv = new Ajv({ 
      allErrors: true, 
      verbose: true,
      strict: true
    });
    addFormats(this.ajv);
    
    // Load the JSON schema
    const schemaPath = resolve(process.cwd(), 'schemas/story-schema.json');
    this.schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
  }

  /**
   * Validate a story object against the schema
   */
  validateStory(story: unknown): ValidationResult {
    const validate = this.ajv.compile(this.schema);
    const valid = validate(story);

    if (valid) {
      return {
        valid: true,
        warnings: this.checkWarnings(story as Story)
      };
    }

    const errors = validate.errors?.map(error => {
      const path = error.instancePath || 'root';
      const message = error.message || 'Invalid data';
      return `${path}: ${message}`;
    }) || ['Unknown validation error'];

    return {
      valid: false,
      errors,
      warnings: this.checkWarnings(story as Story)
    };
  }

  /**
   * Validate a story from a JSON file
   */
  validateStoryFile(filePath: string): ValidationResult {
    try {
      const storyData = JSON.parse(readFileSync(filePath, 'utf-8'));
      const result = this.validateStory(storyData);
      
      // Add file-specific validations
      const fileWarnings = this.validateFileStructure(storyData, filePath);
      if (result.warnings) {
        result.warnings.push(...fileWarnings);
      } else {
        result.warnings = fileWarnings;
      }

      return result;
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to parse JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  /**
   * Check for potential issues that aren't schema violations
   */
  private checkWarnings(story: Story): string[] {
    const warnings: string[] = [];

    // Check scene ID consistency
    const sceneIds = story.scenes.map(scene => scene.id);
    const duplicateIds = sceneIds.filter((id, index) => sceneIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      warnings.push(`Duplicate scene IDs found: ${duplicateIds.join(', ')}`);
    }

    // Check for broken scene references
    for (const scene of story.scenes) {
      if (scene.next_scene && !sceneIds.includes(scene.next_scene)) {
        warnings.push(`Scene ${scene.id} references non-existent scene: ${scene.next_scene}`);
      }

      if (scene.choices) {
        for (const choice of scene.choices) {
          if (choice.next_scene && !sceneIds.includes(choice.next_scene)) {
            warnings.push(`Choice ${choice.id} in scene ${scene.id} references non-existent scene: ${choice.next_scene}`);
          }
        }
      }
    }

    // Check for orphaned scenes (scenes that can't be reached)
    const reachableScenes = new Set<string>();
    const firstScene = story.scenes[0];
    if (firstScene) {
      this.findReachableScenes(firstScene.id, story.scenes, reachableScenes);
    }

    const orphanedScenes = story.scenes
      .filter(scene => !reachableScenes.has(scene.id))
      .map(scene => scene.id);

    if (orphanedScenes.length > 0) {
      warnings.push(`Orphaned scenes (unreachable): ${orphanedScenes.join(', ')}`);
    }

    return warnings;
  }

  /**
   * Recursively find all reachable scenes
   */
  private findReachableScenes(sceneId: string, scenes: Story['scenes'], reachableScenes: Set<string>): void {
    if (reachableScenes.has(sceneId)) {
      return; // Already processed
    }

    reachableScenes.add(sceneId);
    const scene = scenes.find(s => s.id === sceneId);
    
    if (!scene) {
      return;
    }

    // Follow next_scene
    if (scene.next_scene) {
      this.findReachableScenes(scene.next_scene, scenes, reachableScenes);
    }

    // Follow choice paths
    if (scene.choices) {
      for (const choice of scene.choices) {
        if (choice.next_scene) {
          this.findReachableScenes(choice.next_scene, scenes, reachableScenes);
        }
      }
    }
  }

  /**
   * Validate file-specific structure
   */
  private validateFileStructure(story: Story, filePath: string): string[] {
    const warnings: string[] = [];

    // Check if filename matches book/chapter
    const filename = filePath.split('/').pop()?.replace('.json', '') || '';
    const expectedFilename = `${story.metadata.book.toLowerCase()}-${story.metadata.chapter.toLowerCase()}`;
    
    if (!filename.includes(expectedFilename)) {
      warnings.push(`Filename "${filename}" doesn't match expected pattern "${expectedFilename}"`);
    }

    return warnings;
  }
}