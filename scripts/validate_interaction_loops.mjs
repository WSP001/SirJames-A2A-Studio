#!/usr/bin/env node
/**
 * Validate Interaction Loops
 * 
 * Checks all chapter _interaction_loops.json files for:
 * - Valid JSON structure
 * - Required fields present
 * - Consistent scene IDs
 * - All loop states defined
 * 
 * Usage: node scripts/validate_interaction_loops.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const BASE_PATH = './public-book002';

const REQUIRED_CHAPTER_FIELDS = [
  'chapter_id',
  'book',
  'theme',
  'skill_focus',
  'virtue_focus',
  'scenes',
  'chapter_summary'
];

const REQUIRED_SCENE_FIELDS = [
  'scene_id',
  'title',
  'interaction_loop'
];

const REQUIRED_LOOP_FIELDS = [
  'challenge_id',
  'primary_prompt',
  'ui_type',
  'states'
];

const REQUIRED_STATES = [
  'idle_support',
  'success'
];

let totalErrors = 0;
let totalWarnings = 0;

function log(type, chapter, message) {
  const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
  console.log(`${prefix} Chapter ${chapter}: ${message}`);
  if (type === 'error') totalErrors++;
  if (type === 'warning') totalWarnings++;
}

function validateChapter(chapterNum) {
  const filePath = join(BASE_PATH, `chapter${String(chapterNum).padStart(2, '0')}`, '_interaction_loops.json');
  
  // Check file exists
  if (!existsSync(filePath)) {
    log('error', chapterNum, `File not found: ${filePath}`);
    return;
  }

  // Parse JSON
  let data;
  try {
    const content = readFileSync(filePath, 'utf-8');
    data = JSON.parse(content);
  } catch (e) {
    log('error', chapterNum, `Invalid JSON: ${e.message}`);
    return;
  }

  // Check required chapter fields
  for (const field of REQUIRED_CHAPTER_FIELDS) {
    if (!data[field]) {
      log('error', chapterNum, `Missing required field: ${field}`);
    }
  }

  // Check scenes
  if (!Array.isArray(data.scenes)) {
    log('error', chapterNum, 'scenes must be an array');
    return;
  }

  if (data.scenes.length < 3) {
    log('warning', chapterNum, `Only ${data.scenes.length} scenes (expected 5+)`);
  }

  // Validate each scene
  for (const scene of data.scenes) {
    // Check required scene fields
    for (const field of REQUIRED_SCENE_FIELDS) {
      if (!scene[field]) {
        log('error', chapterNum, `Scene missing field: ${field}`);
      }
    }

    const loop = scene.interaction_loop;
    if (!loop) continue;

    // Check required loop fields
    for (const field of REQUIRED_LOOP_FIELDS) {
      if (!loop[field]) {
        log('error', chapterNum, `Scene ${scene.scene_id} loop missing: ${field}`);
      }
    }

    // Check required states
    if (loop.states) {
      for (const state of REQUIRED_STATES) {
        if (!loop.states[state]) {
          log('warning', chapterNum, `Scene ${scene.scene_id} missing state: ${state}`);
        }
      }

      // Check idle_support has required fields
      if (loop.states.idle_support) {
        const idle = loop.states.idle_support;
        if (!idle.trigger) log('error', chapterNum, `Scene ${scene.scene_id} idle_support missing trigger`);
        if (!idle.actor) log('error', chapterNum, `Scene ${scene.scene_id} idle_support missing actor`);
        if (!idle.line && !idle.audio_file) log('warning', chapterNum, `Scene ${scene.scene_id} idle_support has no line or audio`);
        if (!idle.metric_flag) log('warning', chapterNum, `Scene ${scene.scene_id} idle_support missing metric_flag`);
      }

      // Check success has required fields
      if (loop.states.success) {
        const success = loop.states.success;
        if (!success.trigger) log('error', chapterNum, `Scene ${scene.scene_id} success missing trigger`);
        if (!success.line_fast && !success.metric_score && !success.metric_mapping) {
          log('warning', chapterNum, `Scene ${scene.scene_id} success has no line_fast or metric`);
        }
      }
    }
  }

  // Check chapter_summary
  if (data.chapter_summary) {
    if (!data.chapter_summary.parent_dashboard_metrics) {
      log('warning', chapterNum, 'chapter_summary missing parent_dashboard_metrics');
    }
    if (!data.chapter_summary.foreshadow && chapterNum < 10) {
      log('warning', chapterNum, 'chapter_summary missing foreshadow');
    }
  }

  log('success', chapterNum, `Validated ${data.scenes.length} scenes`);
}

console.log('');
console.log('🔍 VALIDATING INTERACTION LOOPS');
console.log('================================');
console.log('');

for (const chapter of CHAPTERS) {
  validateChapter(chapter);
}

console.log('');
console.log('================================');
console.log(`📊 SUMMARY: ${totalErrors} errors, ${totalWarnings} warnings`);
console.log('');

if (totalErrors === 0) {
  console.log('✅ All interaction loop files are valid!');
  console.log('');
  console.log('📁 Files validated:');
  for (const chapter of CHAPTERS) {
    const chapterStr = String(chapter).padStart(2, '0');
    console.log(`   public-book002/chapter${chapterStr}/_interaction_loops.json`);
  }
} else {
  console.log('❌ Please fix the errors above before proceeding.');
  process.exit(1);
}

console.log('');
console.log('🎯 Next steps for your team:');
console.log('   1. Frontend: Parse states object in scene engine');
console.log('   2. Backend: Accept metric_flag in /api/v1/scene-metrics');
console.log('   3. Writers: Record audio files for each loop line');
console.log('   4. QA: Test idle triggers and error states');
console.log('');
