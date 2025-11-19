#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { glob } from 'glob';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

/**
 * Validation script for Sir James Adventures story files
 * Usage: node scripts/validate.js [pattern]
 * Example: node scripts/validate.js "stories/\*\*.json"
 */

class StoryValidationScript {
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
    this.validate = this.ajv.compile(this.schema);
  }

  /**
   * Validate a single story file
   */
  validateFile(filePath) {
    console.log(`\n📖 Validating: ${filePath}`);
    
    try {
      const storyData = JSON.parse(readFileSync(filePath, 'utf-8'));
      const valid = this.validate(storyData);

      if (valid) {
        console.log(`✅ Valid: ${filePath}`);
        
        // Check for warnings
        const warnings = this.checkWarnings(storyData, filePath);
        if (warnings.length > 0) {
          console.log(`⚠️  Warnings:`);
          warnings.forEach(warning => console.log(`   - ${warning}`));
        }
        
        return { valid: true, warnings };
      } else {
        console.log(`❌ Invalid: ${filePath}`);
        console.log(`Errors:`);
        this.validate.errors?.forEach(error => {
          const path = error.instancePath || 'root';
          const message = error.message || 'Invalid data';
          console.log(`   - ${path}: ${message}`);
        });
        
        return { valid: false, errors: this.validate.errors };
      }
    } catch (error) {
      console.log(`❌ Parse Error: ${filePath}`);
      console.log(`   - ${error.message}`);
      return { valid: false, errors: [error.message] };
    }
  }

  /**
   * Check for warnings (non-critical issues)
   */
  checkWarnings(story, filePath) {
    const warnings = [];

    // Check scene ID consistency
    const sceneIds = story.scenes.map(scene => scene.id);
    const duplicateIds = sceneIds.filter((id, index) => sceneIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      warnings.push(`Duplicate scene IDs: ${duplicateIds.join(', ')}`);
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

    // Check filename consistency
    const filename = filePath.split('/').pop()?.replace('.json', '') || '';
    const expectedFilename = `${story.metadata.book.toLowerCase()}-${story.metadata.chapter.toLowerCase()}`;
    
    if (!filename.includes(expectedFilename)) {
      warnings.push(`Filename doesn't match expected pattern "${expectedFilename}"`);
    }

    return warnings;
  }

  /**
   * Validate multiple files based on pattern
   */
  async validateFiles(pattern) {
    let files = [];
    
    if (pattern) {
      // Use glob pattern
      try {
        files = await glob(pattern, { ignore: 'node_modules/**' });
      } catch (error) {
        console.error(`Error with glob pattern "${pattern}": ${error.message}`);
        process.exit(1);
      }
    } else {
      // Default: validate all JSON files in stories directory
      const storiesDir = resolve(process.cwd(), 'stories');
      try {
        files = readdirSync(storiesDir)
          .filter(file => file.endsWith('.json'))
          .map(file => join(storiesDir, file));
      } catch (error) {
        console.error(`Error reading stories directory: ${error.message}`);
        process.exit(1);
      }
    }

    if (files.length === 0) {
      console.log('⚠️  No story files found to validate.');
      return true;
    }

    console.log(`🔍 Found ${files.length} story file(s) to validate:`);
    files.forEach(file => console.log(`   - ${file}`));

    let allValid = true;
    let totalWarnings = 0;

    for (const file of files) {
      const result = this.validateFile(file);
      if (!result.valid) {
        allValid = false;
      }
      if (result.warnings) {
        totalWarnings += result.warnings.length;
      }
    }

    console.log(`\n📊 Validation Summary:`);
    console.log(`   - Files validated: ${files.length}`);
    console.log(`   - Valid files: ${files.filter(f => this.validateFile(f).valid).length}`);
    console.log(`   - Invalid files: ${files.filter(f => !this.validateFile(f).valid).length}`);
    console.log(`   - Total warnings: ${totalWarnings}`);

    if (allValid) {
      console.log(`\n✅ All story files are valid!`);
    } else {
      console.log(`\n❌ Some story files have validation errors.`);
    }

    return allValid;
  }

  /**
   * Run the validation script
   */
  async run() {
    const args = process.argv.slice(2);
    const pattern = args[0];

    console.log('🏰 Sir James Adventures Story Validator v3.0');
    console.log('===============================================');

    const success = await this.validateFiles(pattern);
    process.exit(success ? 0 : 1);
  }
}

// Add glob to dependencies if not available
import('glob').catch(() => {
  console.error('❌ Missing dependency: glob');
  console.error('Please install it with: npm install --save-dev glob');
  process.exit(1);
});

// Run the script
const validator = new StoryValidationScript();
validator.run().catch(error => {
  console.error('❌ Validation script failed:', error.message);
  process.exit(1);
});