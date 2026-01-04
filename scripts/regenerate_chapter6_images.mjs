/**
 * Regenerate Chapter 6 Images with Age-Consistent Sir James
 * 
 * Problem: Sir James appears 8-10 years old in current images
 * Solution: Regenerate with explicit "5-year-old" in prompts
 * 
 * Character Bible (CONSISTENCY.md):
 * - Sir James: 5-year-old boy, bright blue eyes, brown hair with cowlick
 * - Royal blue tunic with silver Celtic trim, brown boots
 * - Claude: Redbone Coonhound, reddish-brown coat, amber eyes
 */

import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');

// Character Bible - IMMUTABLE
const CHARACTER_BIBLE = {
  sir_james: `A 5-year-old boy (MUST be exactly 5 years old, very young child proportions, round face, big eyes).
    - Bright blue eyes, wide and curious
    - Brown hair with a distinctive cowlick
    - Wearing a royal blue tunic with silver Celtic knotwork trim
    - Brown leather boots
    - Small wooden practice sword at his belt
    - Expression: innocent, curious, brave for his age`,
  
  claude: `A Redbone Coonhound dog (loyal companion).
    - Reddish-brown coat with smooth fur
    - Long floppy ears
    - Warm amber/brown eyes with soulful expression
    - Medium-large sized hound
    - Always near Sir James, protective and loving`,
  
  style: `Pixar-style 3D animation, warm lighting, child-friendly, 
    bright colors, magical atmosphere, suitable for ages 5-8`
};

// Chapter 6 Scene Prompts - Enhanced for 5yo Sir James
const CHAPTER_6_SCENES = [
  {
    scene: 'scene-001',
    title: 'The Abandoned Tower',
    prompt: `${CHARACTER_BIBLE.sir_james}
    
    Scene: A dusty ancient tower room with golden sunlight streaming through arched windows.
    ${CHARACTER_BIBLE.claude} stands beside the 5-year-old boy.
    
    An ornate magical mirror covered in dust stands against the wall.
    Dust particles dance in the beams of light.
    The 5-year-old Sir James looks up at the mirror with wonder and curiosity.
    
    ${CHARACTER_BIBLE.style}
    Camera angle: Wide shot showing the tower interior with Sir James and Claude small in frame.`
  },
  {
    scene: 'scene-005',
    title: 'The Shadow Test',
    prompt: `${CHARACTER_BIBLE.sir_james}
    
    Scene: The 5-year-old boy looks into the magical Mirror of Truth.
    His reflection shows a small shadow in the corner, representing self-doubt.
    ${CHARACTER_BIBLE.claude} sits beside him, looking concerned.
    
    The mirror glows with soft silvery light.
    Sir James has a worried but thoughtful expression on his young face.
    The tower room is dimly lit with mystical ambiance.
    
    ${CHARACTER_BIBLE.style}
    Camera angle: Medium shot focusing on Sir James's face and the mirror reflection.`
  }
];

async function regenerateImages() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not set');
    console.log('Set it with: $env:OPENAI_API_KEY = "sk-..."');
    process.exit(1);
  }
  
  const openai = new OpenAI({ apiKey });
  const outputDir = path.join(PROJECT_ROOT, 'public-book002', 'chapter06', 'images');
  
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });
  
  console.log('🎨 Regenerating Chapter 6 Images with 5-year-old Sir James\n');
  console.log('Character Bible enforced:');
  console.log('- Sir James: 5 years old, bright blue eyes, brown hair with cowlick');
  console.log('- Claude: Redbone Coonhound, reddish-brown coat\n');
  
  let totalCost = 0;
  
  for (const scene of CHAPTER_6_SCENES) {
    console.log(`\n📸 Generating ${scene.scene}: ${scene.title}`);
    console.log(`   Prompt length: ${scene.prompt.length} chars`);
    
    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: scene.prompt,
        n: 1,
        size: '1792x1024',
        quality: 'hd',
        style: 'vivid'
      });
      
      const imageUrl = response.data[0].url;
      const revisedPrompt = response.data[0].revised_prompt;
      
      console.log(`   ✅ Image generated`);
      console.log(`   Revised prompt: ${revisedPrompt?.substring(0, 100)}...`);
      
      // Download and save image
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      
      const filename = `${scene.scene}.png`;
      const filepath = path.join(outputDir, filename);
      
      // Backup old image
      try {
        const oldImage = await fs.readFile(filepath);
        const backupPath = path.join(outputDir, `${scene.scene}-backup-${Date.now()}.png`);
        await fs.writeFile(backupPath, oldImage);
        console.log(`   📦 Backed up old image`);
      } catch (e) {
        // No old image to backup
      }
      
      await fs.writeFile(filepath, imageBuffer);
      console.log(`   💾 Saved to: ${filepath}`);
      
      totalCost += 0.08; // DALL-E 3 HD cost
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log(`\n✅ Regeneration complete!`);
  console.log(`   Total cost: $${totalCost.toFixed(2)}`);
  console.log(`   Images saved to: ${outputDir}`);
}

// Run if called directly
regenerateImages().catch(console.error);
