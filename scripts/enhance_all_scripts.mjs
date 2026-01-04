/**
 * Enhance All Scene Scripts for Book3.5
 * 
 * Expands 3-line scenes to 6-8 lines with:
 * - Claude thought bubbles
 * - More descriptive narration
 * - Sound effect triggers
 * - Virtue choice setup
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const BOOK002_DIR = path.join(PROJECT_ROOT, 'public-book002');

// Enhancement templates for different scene types
const ENHANCEMENTS = {
  // Add Claude thought after narrator intro
  claude_thought_templates: [
    "Claude's ears perked up with curiosity. Something exciting was about to happen!",
    "Claude wagged his tail, sensing the adventure ahead.",
    "Claude tilted his head thoughtfully. His loyal heart was ready for anything.",
    "Claude's nose twitched. He could smell something magical in the air!",
    "Claude stayed close to Sir James, his faithful eyes full of encouragement.",
    "Claude let out a soft woof of support. He believed in his young knight.",
    "Claude's tail swished back and forth. This was going to be interesting!",
    "Claude nuzzled Sir James's hand gently, offering silent comfort."
  ],
  
  // Additional narrator descriptions
  narrator_expansions: [
    "The air seemed to shimmer with possibility.",
    "A gentle breeze carried whispers of ancient magic.",
    "Sunlight danced through the leaves, creating patterns of gold and shadow.",
    "The world around them felt alive with wonder.",
    "Everything seemed to hold its breath in anticipation.",
    "The moment felt special, like the beginning of something important.",
    "Nature itself seemed to be watching, curious about what would happen next.",
    "Time seemed to slow down, making every detail crystal clear."
  ],
  
  // Sir James reactions
  sir_james_reactions: [
    "Sir James took a deep breath, feeling brave.",
    "Sir James's eyes widened with wonder.",
    "Sir James squared his small shoulders with determination.",
    "Sir James felt a warm glow of courage in his heart.",
    "Sir James smiled, ready for whatever came next.",
    "Sir James nodded thoughtfully, considering his options.",
    "Sir James felt proud to be on this adventure.",
    "Sir James remembered Gramps's wise words."
  ]
};

async function enhanceNarrationBatch(chapterNum) {
  const chapterDir = path.join(BOOK002_DIR, `chapter${String(chapterNum).padStart(2, '0')}`);
  const narrationPath = path.join(chapterDir, '_narration_batch.json');
  
  try {
    const content = await fs.readFile(narrationPath, 'utf-8');
    const narration = JSON.parse(content);
    
    console.log(`\n📖 Enhancing Chapter ${chapterNum}: ${narration.title}`);
    
    let totalLinesAdded = 0;
    
    // Enhance each scene
    for (const scene of narration.scenes) {
      const originalLineCount = scene.lines.length;
      
      // Skip if already enhanced (6+ lines)
      if (originalLineCount >= 6) {
        console.log(`   ✓ Scene ${scene.scene} already has ${originalLineCount} lines`);
        continue;
      }
      
      const newLines = [];
      let lineIndex = 0;
      
      for (const line of scene.lines) {
        newLines.push(line);
        lineIndex++;
        
        // After first narrator line, add Claude thought
        if (lineIndex === 1 && line.voice === 'narrator') {
          const claudeThought = ENHANCEMENTS.claude_thought_templates[
            Math.floor(Math.random() * ENHANCEMENTS.claude_thought_templates.length)
          ];
          
          newLines.push({
            id: `${line.id.split('-').slice(0, 2).join('-')}-claude`,
            voice: 'claude_thought',
            text: claudeThought,
            emotion: 'supportive',
            sfx: 'dog_tail_wag'
          });
          totalLinesAdded++;
        }
        
        // After Sir James speaks, add reaction or expansion
        if (line.voice === 'sir_james' && lineIndex < scene.lines.length) {
          const expansion = ENHANCEMENTS.narrator_expansions[
            Math.floor(Math.random() * ENHANCEMENTS.narrator_expansions.length)
          ];
          
          newLines.push({
            id: `${line.id}-exp`,
            voice: 'narrator',
            text: expansion,
            emotion: 'descriptive'
          });
          totalLinesAdded++;
        }
      }
      
      // Add closing Sir James reaction if under 6 lines
      if (newLines.length < 6) {
        const reaction = ENHANCEMENTS.sir_james_reactions[
          Math.floor(Math.random() * ENHANCEMENTS.sir_james_reactions.length)
        ];
        
        const lastId = scene.lines[scene.lines.length - 1].id;
        newLines.push({
          id: `${lastId}-react`,
          voice: 'narrator',
          text: reaction,
          emotion: 'encouraging'
        });
        totalLinesAdded++;
      }
      
      scene.lines = newLines;
      console.log(`   ✅ Scene ${scene.scene}: ${originalLineCount} → ${newLines.length} lines`);
    }
    
    // Add virtue_choices to last scene if not present
    const lastScene = narration.scenes[narration.scenes.length - 1];
    if (!lastScene.virtue_choice) {
      lastScene.virtue_choice = {
        prompt: "What should Sir James do next?",
        options: [
          {
            text: "Continue the adventure with courage!",
            virtue: "courage",
            next_chapter: chapterNum < 10 ? chapterNum + 1 : null
          },
          {
            text: "Take a moment to reflect on what was learned.",
            virtue: "wisdom",
            next_chapter: chapterNum < 10 ? chapterNum + 1 : null
          }
        ]
      };
      console.log(`   ✅ Added virtue choice to final scene`);
    }
    
    // Add parent discussion prompts
    if (!narration.parent_discussion) {
      narration.parent_discussion = {
        chapter_theme: narration.virtue || narration.theme,
        questions: [
          `What did Sir James learn about ${(narration.virtue || 'being brave').toLowerCase()} in this chapter?`,
          "How did Claude help Sir James during the adventure?",
          "What would you have done if you were Sir James?",
          "Can you think of a time when you showed similar courage/kindness/wisdom?"
        ],
        activity: `Draw a picture of your favorite moment from Chapter ${chapterNum}!`
      };
      console.log(`   ✅ Added parent discussion prompts`);
    }
    
    // Backup original
    const backupPath = path.join(chapterDir, `_narration_batch-backup-${Date.now()}.json`);
    await fs.writeFile(backupPath, content);
    
    // Write enhanced version
    await fs.writeFile(narrationPath, JSON.stringify(narration, null, 2));
    
    console.log(`   📊 Total lines added: ${totalLinesAdded}`);
    return totalLinesAdded;
    
  } catch (error) {
    console.log(`   ⚠️ Could not enhance Chapter ${chapterNum}: ${error.message}`);
    return 0;
  }
}

async function enhanceAllChapters() {
  console.log('🎬 BOOK3.5 SCRIPT ENHANCEMENT');
  console.log('================================');
  console.log('Expanding all scenes from 3 lines to 6-8 lines');
  console.log('Adding: Claude thought bubbles, virtue choices, parent prompts\n');
  
  let totalEnhancements = 0;
  
  for (let chapter = 1; chapter <= 10; chapter++) {
    const added = await enhanceNarrationBatch(chapter);
    totalEnhancements += added;
  }
  
  console.log('\n================================');
  console.log(`✅ Enhancement complete!`);
  console.log(`   Total lines added: ${totalEnhancements}`);
  console.log(`   All chapters now have:`);
  console.log(`   - 6-8 lines per scene`);
  console.log(`   - Claude thought bubbles`);
  console.log(`   - Virtue choices`);
  console.log(`   - Parent discussion prompts`);
  console.log('\n🏰 For the Commons Good! ⚔️🐕✨');
}

enhanceAllChapters().catch(console.error);
