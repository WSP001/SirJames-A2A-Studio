#!/usr/bin/env node
/**
 * Fix Final Images - Chapter 2 Scene 1 AND Chapter 3 Card
 * 
 * Problem 1: Chapter 2 Scene 1 shows a TEENAGER instead of 5-year-old
 * Problem 2: Chapter 3 card is too cartoonish compared to other cards
 * 
 * Solution: Use the EXACT same style as Chapter 1 and Chapter 2 cards
 * which show a realistic Pixar-style 5-year-old Sir James
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// REFERENCE: Chapter 1 and 2 cards show Sir James as:
// - Small 5-year-old boy (NOT a teenager)
// - Reddish-brown/auburn hair
// - Big expressive eyes (blue-green)
// - Rosy cheeks (not chubby, just healthy glow)
// - Royal blue tunic with silver Celtic knotwork trim
// - Brown leather belt with Celtic buckle
// - Brown boots
// - Small wooden sword at side
// - Realistic Pixar 3D animation style (like Brave, Coco)

const SIR_JAMES_STYLE = `a small 5-year-old boy (kindergarten age, about 3 feet tall):
- Reddish-brown auburn hair, slightly messy with natural waves
- Big expressive blue-green eyes with wonder and curiosity
- Rosy cheeks with healthy glow, sweet innocent smile
- Small child proportions (short arms, small hands)
- Royal blue medieval tunic with silver Celtic knotwork trim
- Brown leather belt with ornate Celtic buckle
- Brown leather boots
- Small wooden practice sword at his side
CRITICAL: Must look like a SMALL 5-YEAR-OLD CHILD, NOT a teenager or adult`;

const CLAUDE_STYLE = `a noble Redbone Coonhound dog:
- Rich reddish-brown coat
- Long floppy ears
- Soulful amber-brown eyes
- Royal blue collar with silver heart-shaped tag
- Loyal protective posture`;

const PIXAR_STYLE = `Pixar 3D animation style (like Brave, Coco, Luca), 
photorealistic lighting, warm cinematic colors, 4K ultra-detailed, 
soft ambient lighting, child-friendly, magical atmosphere`;

// CHAPTER 2 SCENE 1: The Hidden Waterfall
const CH2_SC1_PROMPT = `${PIXAR_STYLE}

Scene: A magical forest clearing with a sparkling waterfall in the background creating rainbows in the misty air.

${SIR_JAMES_STYLE} stands in wonder, pointing excitedly at something behind the waterfall. His expression shows pure childlike amazement and curiosity.

${CLAUDE_STYLE} stands beside him, tail wagging, ears perked up with excitement.

The waterfall sparkles with magical light, creating beautiful rainbow prisms in the mist. Lush green forest surrounds them. Hidden cave entrance visible behind the water curtain.

IMPORTANT: Sir James must be a TINY 5-YEAR-OLD CHILD standing next to the dog - the dog should be almost as tall as him. NOT a teenager.`;

// CHAPTER 3 SCENE 1: Meeting the Dragon
const CH3_SC1_PROMPT = `${PIXAR_STYLE}

Scene: High atop a misty mountain plateau at golden hour.

${SIR_JAMES_STYLE} stands bravely but with childlike wonder, looking up at a wise, friendly ancient dragon. The dragon has golden-bronze scales, kind wise eyes, and a gentle smile.

${CLAUDE_STYLE} stands protectively beside the tiny boy.

The dragon is MUCH larger than the small child, emphasizing how brave little Sir James is. Misty mountain peaks in background, warm golden sunlight filtering through clouds.

IMPORTANT: Sir James must look EXACTLY like the Chapter 1 and 2 cards - a small 5-year-old with reddish-brown hair, rosy cheeks, blue tunic. NOT cartoonish, realistic Pixar style.`;

async function generateImage(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1792x1024',
      quality: 'hd',
      style: 'vivid'
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.data[0].url);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('🎨 Fixing Final Images - Chapter 2 Scene 1 & Chapter 3 Card');
  console.log('━'.repeat(60));
  
  const images = [
    {
      name: 'Chapter 2 Scene 1 (Hidden Waterfall)',
      path: path.join(__dirname, '..', 'public-book002', 'chapter02', 'images', 'scene-001.png'),
      prompt: CH2_SC1_PROMPT
    },
    {
      name: 'Chapter 3 Scene 1 (Dragon\'s Riddle)',
      path: path.join(__dirname, '..', 'public-book002', 'chapter03', 'images', 'scene-001.png'),
      prompt: CH3_SC1_PROMPT
    }
  ];
  
  for (const img of images) {
    console.log(`\n📸 Generating: ${img.name}`);
    
    // Backup existing
    const backupPath = img.path.replace('.png', `-backup-${Date.now()}.png`);
    if (fs.existsSync(img.path)) {
      fs.copyFileSync(img.path, backupPath);
      console.log(`   📦 Backed up to: ${path.basename(backupPath)}`);
    }
    
    try {
      const imageUrl = await generateImage(img.prompt);
      console.log('   ✅ Generated successfully!');
      
      await downloadImage(imageUrl, img.path);
      console.log(`   💾 Saved to: ${img.path}`);
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      
      // Restore backup
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, img.path);
        console.log('   📦 Restored backup');
      }
    }
  }
  
  console.log('\n' + '━'.repeat(60));
  console.log('🎉 Done! Both images regenerated with consistent 5-year-old Sir James');
  console.log('   Style: Realistic Pixar (like Chapter 1 & 2 cards)');
  console.log('   Ready for deployment!');
}

main();
