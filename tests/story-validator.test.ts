import { describe, it, expect } from 'vitest';
import { StoryValidator } from '../src/validators/story-validator.js';
import type { Story, Virtue, SceneType } from '../src/types/story.js';

describe('StoryValidator', () => {
  const validator = new StoryValidator();

  const validStory: Story = {
    version: '3.0',
    metadata: {
      title: 'Test Story',
      book: 'Book003',
      chapter: 'Chapter01',
      author: 'Test Author',
      created: '2024-09-24T20:16:00Z',
      updated: '2024-09-24T20:16:00Z'
    },
    characters: {
      sir_james: {
        name: 'Sir James',
        description: 'A brave knight',
        traits: {
          eye_color: 'blue',
          personality: ['brave']
        }
      },
      sparky: {
        name: 'Sparky',
        species: 'squirrel',
        description: 'A clever squirrel'
      }
    },
    scenes: [
      {
        id: 'ch01_s001',
        scene_type: 'narrative',
        title: 'Test Scene',
        content: 'This is a test scene.',
        next_scene: 'ch01_s002'
      },
      {
        id: 'ch01_s002',
        scene_type: 'decision',
        title: 'Test Decision',
        content: 'Make a choice.',
        choices: [
          {
            id: 'choice1',
            text: 'Choose courage',
            virtue: 'courage',
            next_scene: 'ch01_s003'
          },
          {
            id: 'choice2',
            text: 'Choose wisdom',
            virtue: 'wisdom',
            next_scene: 'ch01_s003'
          }
        ]
      },
      {
        id: 'ch01_s003',
        scene_type: 'climax',
        title: 'Test Climax',
        content: 'The story concludes.'
      }
    ]
  };

  it('should validate a correct story', () => {
    const result = validator.validateStory(validStory);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should reject story with wrong version', () => {
    const invalidStory = { ...validStory, version: '2.0' };
    const result = validator.validateStory(invalidStory);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors![0]).toContain('version');
  });

  it('should reject story with invalid scene ID pattern', () => {
    const invalidStory = {
      ...validStory,
      scenes: [
        {
          ...validStory.scenes[0],
          id: 'invalid_id'
        }
      ]
    };
    const result = validator.validateStory(invalidStory);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should reject story without required Sir James traits', () => {
    const invalidStory = {
      ...validStory,
      characters: {
        ...validStory.characters,
        sir_james: {
          name: 'Sir James',
          description: 'A knight',
          traits: {
            eye_color: 'green' as const // Should be blue
          }
        }
      }
    };
    const result = validator.validateStory(invalidStory);
    expect(result.valid).toBe(false);
  });

  it('should reject choice with invalid virtue', () => {
    const invalidStory = {
      ...validStory,
      scenes: [
        ...validStory.scenes.slice(0, 1),
        {
          ...validStory.scenes[1],
          choices: [
            {
              id: 'choice1',
              text: 'Invalid choice',
              virtue: 'invalid_virtue' as Virtue,
              next_scene: 'ch01_s003'
            }
          ]
        },
        ...validStory.scenes.slice(2)
      ]
    };
    const result = validator.validateStory(invalidStory);
    expect(result.valid).toBe(false);
  });

  it('should detect broken scene references', () => {
    const storyWithBrokenRef = {
      ...validStory,
      scenes: [
        {
          ...validStory.scenes[0],
          next_scene: 'nonexistent_scene'
        },
        ...validStory.scenes.slice(1)
      ]
    };
    const result = validator.validateStory(storyWithBrokenRef);
    expect(result.warnings).toBeDefined();
    expect(result.warnings!.some(w => w.includes('references non-existent scene'))).toBe(true);
  });

  it('should validate scene types', () => {
    const validSceneTypes = ['narrative', 'decision', 'climax', 'introduction', 'conclusion'];
    
    validSceneTypes.forEach(sceneType => {
      const testStory = {
        ...validStory,
        scenes: [
          {
            ...validStory.scenes[0],
            scene_type: sceneType as SceneType
          }
        ]
      };
      const result = validator.validateStory(testStory);
      expect(result.valid).toBe(true);
    });
  });

  it('should validate virtue types in choices', () => {
    const validVirtues = ['courage', 'wisdom', 'trust'];
    
    validVirtues.forEach(virtue => {
      const testStory = {
        ...validStory,
        scenes: [
          {
            id: 'ch01_s001',
            scene_type: 'decision' as const,
            title: 'Test',
            content: 'Test',
            choices: [
              {
                id: 'test_choice',
                text: 'Test choice',
                virtue: virtue as Virtue
              }
            ]
          }
        ]
      };
      const result = validator.validateStory(testStory);
      expect(result.valid).toBe(true);
    });
  });
});