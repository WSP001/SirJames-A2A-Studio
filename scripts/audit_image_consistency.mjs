/**
 * Image Consistency Audit for Sir James Adventures
 * 
 * Checks all chapter images and generates a report of:
 * - Missing images
 * - Image file sizes (potential quality issues)
 * - Chapters that may need regeneration
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const BOOK002_DIR = path.join(PROJECT_ROOT, 'public-book002');

async function auditChapter(chapterNum) {
  const chapterDir = path.join(BOOK002_DIR, `chapter${String(chapterNum).padStart(2, '0')}`);
  const imagesDir = path.join(chapterDir, 'images');
  
  const report = {
    chapter: chapterNum,
    imagesFound: 0,
    imagesMissing: [],
    imageSizes: [],
    potentialIssues: []
  };
  
  try {
    // Check if images directory exists
    try {
      await fs.access(imagesDir);
    } catch {
      report.potentialIssues.push('No images directory found');
      return report;
    }
    
    // Check for scene images (scene-001.png through scene-008.png)
    for (let scene = 1; scene <= 8; scene++) {
      const sceneNum = String(scene).padStart(3, '0');
      const imagePath = path.join(imagesDir, `scene-${sceneNum}.png`);
      
      try {
        const stats = await fs.stat(imagePath);
        report.imagesFound++;
        report.imageSizes.push({
          scene: sceneNum,
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024)
        });
        
        // Flag very small images (< 100KB) as potential issues
        if (stats.size < 100000) {
          report.potentialIssues.push(`Scene ${sceneNum}: Image unusually small (${Math.round(stats.size / 1024)}KB)`);
        }
        
        // Flag very large images (> 5MB) as potential issues
        if (stats.size > 5000000) {
          report.potentialIssues.push(`Scene ${sceneNum}: Image very large (${Math.round(stats.size / 1024)}KB)`);
        }
        
      } catch {
        report.imagesMissing.push(`scene-${sceneNum}.png`);
      }
    }
    
  } catch (error) {
    report.potentialIssues.push(`Error accessing chapter: ${error.message}`);
  }
  
  return report;
}

async function runFullAudit() {
  console.log('🔍 SIR JAMES IMAGE CONSISTENCY AUDIT');
  console.log('=====================================\n');
  console.log('Checking all 10 chapters for image issues...\n');
  
  const allReports = [];
  let totalImages = 0;
  let totalMissing = 0;
  let totalIssues = 0;
  
  for (let chapter = 1; chapter <= 10; chapter++) {
    const report = await auditChapter(chapter);
    allReports.push(report);
    
    totalImages += report.imagesFound;
    totalMissing += report.imagesMissing.length;
    totalIssues += report.potentialIssues.length;
    
    // Print chapter summary
    const status = report.imagesMissing.length === 0 && report.potentialIssues.length === 0 
      ? '✅' : '⚠️';
    
    console.log(`${status} Chapter ${chapter}: ${report.imagesFound}/8 images`);
    
    if (report.imagesMissing.length > 0) {
      console.log(`   Missing: ${report.imagesMissing.join(', ')}`);
    }
    
    if (report.potentialIssues.length > 0) {
      for (const issue of report.potentialIssues) {
        console.log(`   ⚠️ ${issue}`);
      }
    }
  }
  
  // Summary
  console.log('\n=====================================');
  console.log('📊 AUDIT SUMMARY');
  console.log('=====================================');
  console.log(`Total images found: ${totalImages}/80`);
  console.log(`Missing images: ${totalMissing}`);
  console.log(`Potential issues: ${totalIssues}`);
  
  if (totalMissing === 0 && totalIssues === 0) {
    console.log('\n✅ All images present and properly sized!');
  } else {
    console.log('\n⚠️ Some issues found - review above for details');
  }
  
  // Character consistency reminder
  console.log('\n=====================================');
  console.log('🎨 CHARACTER CONSISTENCY REMINDER');
  console.log('=====================================');
  console.log('Sir James MUST be:');
  console.log('  - 5 years old (very young child)');
  console.log('  - Bright blue eyes');
  console.log('  - Brown hair with cowlick');
  console.log('  - Royal blue tunic with silver Celtic trim');
  console.log('\nClaude MUST be:');
  console.log('  - Redbone Coonhound');
  console.log('  - Reddish-brown coat');
  console.log('  - Amber/brown eyes');
  console.log('  - Long floppy ears');
  
  console.log('\n📝 To regenerate inconsistent images, run:');
  console.log('   node scripts/regenerate_chapter6_images.mjs');
  console.log('   (modify script for other chapters as needed)');
  
  // Save report to file
  const reportPath = path.join(PROJECT_ROOT, 'IMAGE_AUDIT_REPORT.json');
  await fs.writeFile(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      totalImages,
      totalMissing,
      totalIssues
    },
    chapters: allReports
  }, null, 2));
  
  console.log(`\n💾 Full report saved to: IMAGE_AUDIT_REPORT.json`);
}

runFullAudit().catch(console.error);
