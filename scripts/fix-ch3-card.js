#!/usr/bin/env node
/**
 * Fix Chapter 3 Card Image - The Dragon's Riddle
 * Problem: Sir James portrait inconsistency on chapter card
 * Solution: Regenerate with ultra-explicit 5-year-old description
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ULTRA-EXPLICIT 5-YEAR-OLD SIR JAMES DESCRIPTION
const SIR_JAMES_5YO = `a tiny 5-year-old KINDERGARTEN boy (CRITICAL: must look like a preschooler/kindergartener, NOT a teenager, NOT a young adult, NOT older than 6):
- Very small child body (about 3 feet tall, waist-height to an adult)
- Round chubby baby face with pudgy cheeks
- Big innocent wide eyes (bright blue color)
- Short messy sandy-brown hair with a cowlick
- Small button nose
- Sweet innocent smile showing small baby teeth
- Tiny hands and short stubby fingers
- Wearing an oversized royal blue medieval tunic with silver Celtic knotwork (tunic looks big on his small frame)
- Brown leather belt cinched tight on his small waist
- Little brown boots
- Holding a small wooden toy sword`;

// CLAUDE THE REDBONE COONHOUND
const CLAUDE_DOG = `a noble Redbone Coonhound dog:
- Rich reddish-brown coat (like autumn leaves)
- Long floppy ears hanging down
- Soulful amber-brown eyes
- Wearing a royal blue collar with silver tag
- Loyal and protective posture near the boy
- Medium-large sized hound dog`;

// CHAPTER 3 SCENE 1: Meeting the Dragon
const SCENE_PROMPT = `Disney Pixar 3D animation style, 4K ultra-detailed, warm cinematic lighting, child-friendly:

Scene: High atop a misty mountain plateau, ${SIR_JAMES_5YO} stands bravely before a wise, friendly old dragon resting on sun-warmed rocks. ${CLAUDE_DOG} stands protectively beside the tiny boy.

The dragon is ancient and kind-looking with golden scales, wise golden eyes, and a gentle smile. The dragon is MUCH larger than the tiny 5-year-old boy, emphasizing how small and brave Sir James is.

Misty mountain peaks in the background, soft golden sunlight filtering through clouds, magical atmosphere.

CRITICAL: Sir James must look like a TINY 5-YEAR-OLD KINDERGARTENER - very small, chubby baby face, innocent expression. NOT a teenager or young adult.`;

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
  console.log('🐉 Fixing Chapter 3 Card Image - The Dragon\'s Riddle');
  console.log('━'.repeat(50));
  
  const imagePath = path.join(__dirname, '..', 'public-book002', 'chapter03', 'images', 'scene-001.png');
  
  // Backup existing image
  const backupPath = imagePath.replace('.png', `-backup-${Date.now()}.png`);
  if (fs.existsSync(imagePath)) {
    fs.copyFileSync(imagePath, backupPath);
    console.log(`📦 Backed up existing image to: ${path.basename(backupPath)}`);
  }
  
  console.log('\n🎨 Generating new Chapter 3 card with consistent 5-year-old Sir James...');
  console.log('Scene: Meeting the Dragon on the misty mountain');
  
  try {
    const imageUrl = await generateImage(SCENE_PROMPT);
    console.log('✅ Image generated successfully!');
    
    await downloadImage(imageUrl, imagePath);
    console.log(`💾 Saved to: ${imagePath}`);
    
    console.log('\n🎉 Chapter 3 card image fixed!');
    console.log('━'.repeat(50));
    console.log('The chapter card now shows a consistent 5-year-old Sir James');
    console.log('meeting the wise dragon on the misty mountain plateau.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Restore backup if generation failed
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, imagePath);
      console.log('📦 Restored backup image');
    }
    process.exit(1);
  }
}

main();
