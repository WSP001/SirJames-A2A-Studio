#!/usr/bin/env node
/**
 * Asset Integrity Validator for Sir James Adventures
 * Validates that all scenes have required images and audio files
 * 
 * Usage: node tools/validate-assets.js [--fix]
 * 
 * Checks:
 * - Every chapter has scene-001 through scene-008 folders
 * - Every scene references existing ../images/scene-XXX.png
 * - Every scene has expected audio files
 * - No invalid filenames for Netlify/CDN (# ? % etc.)
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public-book002');
const CHAPTERS = 10;
const SCENES_PER_CHAPTER = 8;

const INVALID_CHARS = /[#?%&{}\\<>*$!'":@+`|=]/;

let errors = [];
let warnings = [];

function log(type, message) {
    if (type === 'error') {
        errors.push(message);
        console.error(`❌ ${message}`);
    } else if (type === 'warn') {
        warnings.push(message);
        console.warn(`⚠️  ${message}`);
    } else {
        console.log(`✅ ${message}`);
    }
}

function checkInvalidFilename(filepath) {
    const filename = path.basename(filepath);
    if (INVALID_CHARS.test(filename)) {
        log('error', `Invalid filename characters: ${filepath}`);
        return false;
    }
    return true;
}

function validateChapter(chapterNum) {
    const chapterDir = path.join(PUBLIC_DIR, `chapter${String(chapterNum).padStart(2, '0')}`);
    
    if (!fs.existsSync(chapterDir)) {
        log('error', `Chapter ${chapterNum} directory missing: ${chapterDir}`);
        return;
    }
    
    // Check images folder
    const imagesDir = path.join(chapterDir, 'images');
    if (!fs.existsSync(imagesDir)) {
        log('warn', `Chapter ${chapterNum} images folder missing: ${imagesDir}`);
    }
    
    // Check audio folder
    const audioDir = path.join(chapterDir, 'audio');
    if (!fs.existsSync(audioDir)) {
        log('warn', `Chapter ${chapterNum} audio folder missing: ${audioDir}`);
    }
    
    // Check each scene
    for (let sceneNum = 1; sceneNum <= SCENES_PER_CHAPTER; sceneNum++) {
        validateScene(chapterNum, sceneNum, chapterDir, imagesDir, audioDir);
    }
}

function validateScene(chapterNum, sceneNum, chapterDir, imagesDir, audioDir) {
    const sceneId = String(sceneNum).padStart(3, '0');
    const sceneDir = path.join(chapterDir, `scene-${sceneId}`);
    const indexFile = path.join(sceneDir, 'index.html');
    
    // Check scene folder exists
    if (!fs.existsSync(sceneDir)) {
        log('error', `Chapter ${chapterNum} Scene ${sceneNum} folder missing: ${sceneDir}`);
        return;
    }
    
    // Check index.html exists
    if (!fs.existsSync(indexFile)) {
        log('error', `Chapter ${chapterNum} Scene ${sceneNum} index.html missing: ${indexFile}`);
        return;
    }
    
    // Read and validate HTML
    const html = fs.readFileSync(indexFile, 'utf8');
    
    // Check image reference
    const imageMatch = html.match(/src="([^"]*scene-\d+\.png)"/);
    if (imageMatch) {
        const imageSrc = imageMatch[1];
        
        // Check for malformed src (common bug)
        if (imageSrc.includes('src=')) {
            log('error', `Chapter ${chapterNum} Scene ${sceneNum}: Malformed image src attribute`);
        }
        
        // Resolve image path
        const imagePath = path.resolve(sceneDir, imageSrc);
        if (!fs.existsSync(imagePath)) {
            log('warn', `Chapter ${chapterNum} Scene ${sceneNum}: Image not found: ${imageSrc}`);
        }
    } else {
        log('warn', `Chapter ${chapterNum} Scene ${sceneNum}: No scene image found in HTML`);
    }
    
    // Check audio references
    const audioMatches = html.matchAll(/src="([^"]*\.mp3)"/g);
    for (const match of audioMatches) {
        const audioSrc = match[1];
        const audioPath = path.resolve(sceneDir, audioSrc);
        if (!fs.existsSync(audioPath)) {
            log('warn', `Chapter ${chapterNum} Scene ${sceneNum}: Audio not found: ${audioSrc}`);
        }
    }
    
    // Check navigation links
    if (sceneNum < SCENES_PER_CHAPTER) {
        // Should have "Next Scene" link
        const nextSceneId = String(sceneNum + 1).padStart(3, '0');
        if (!html.includes(`scene-${nextSceneId}`)) {
            log('warn', `Chapter ${chapterNum} Scene ${sceneNum}: Missing next scene navigation`);
        }
    } else {
        // Last scene should have "Chapter Complete" or "Next Chapter"
        if (!html.includes('Chapter') && !html.includes('Complete')) {
            log('warn', `Chapter ${chapterNum} Scene ${sceneNum}: Missing chapter complete section`);
        }
    }
    
    // Check for 48px touch targets
    if (!html.includes('min-height: 48px') && !html.includes('min-height:48px')) {
        log('warn', `Chapter ${chapterNum} Scene ${sceneNum}: May be missing 48px touch targets`);
    }
}

function validateFilenames(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        checkInvalidFilename(fullPath);
        
        if (item.isDirectory()) {
            validateFilenames(fullPath);
        }
    }
}

function generateManifest() {
    const manifest = {
        generated: new Date().toISOString(),
        chapters: []
    };
    
    for (let ch = 1; ch <= CHAPTERS; ch++) {
        const chapterDir = path.join(PUBLIC_DIR, `chapter${String(ch).padStart(2, '0')}`);
        const chapter = {
            number: ch,
            scenes: []
        };
        
        for (let sc = 1; sc <= SCENES_PER_CHAPTER; sc++) {
            const sceneId = String(sc).padStart(3, '0');
            const sceneDir = path.join(chapterDir, `scene-${sceneId}`);
            
            if (fs.existsSync(sceneDir)) {
                chapter.scenes.push({
                    number: sc,
                    path: `chapter${String(ch).padStart(2, '0')}/scene-${sceneId}/index.html`,
                    exists: true
                });
            }
        }
        
        manifest.chapters.push(chapter);
    }
    
    return manifest;
}

// Main
console.log('🔍 Sir James Adventures - Asset Integrity Validator\n');
console.log(`Checking ${PUBLIC_DIR}\n`);

// Validate all chapters
for (let ch = 1; ch <= CHAPTERS; ch++) {
    console.log(`\n📖 Chapter ${ch}`);
    validateChapter(ch);
}

// Check for invalid filenames
console.log('\n📁 Checking filenames...');
validateFilenames(PUBLIC_DIR);

// Generate manifest
console.log('\n📋 Generating manifest...');
const manifest = generateManifest();
const manifestPath = path.join(PUBLIC_DIR, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`✅ Manifest written to ${manifestPath}`);

// Summary
console.log('\n' + '='.repeat(50));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(50));
console.log(`❌ Errors: ${errors.length}`);
console.log(`⚠️  Warnings: ${warnings.length}`);

if (errors.length > 0) {
    console.log('\n❌ VALIDATION FAILED - Fix errors before deploying');
    process.exit(1);
} else if (warnings.length > 0) {
    console.log('\n⚠️  VALIDATION PASSED WITH WARNINGS');
    process.exit(0);
} else {
    console.log('\n✅ VALIDATION PASSED - All assets verified');
    process.exit(0);
}
