#!/usr/bin/env node
/**
 * FINAL FIX: Chapter 2 Scene 1 + Chapter 3 Scene 1
 * Regenerate with ultra-explicit prompts to match other chapter cards
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// SIR JAMES - 5-YEAR-OLD (matching other cards style)
const SIR_JAMES = `a 5-year-old boy with:
- Bright blue eyes (CRITICAL: must be BLUE, not green)
- Sandy brown messy hair with a slight cowlick
- Rosy cheeks with a sweet innocent smile
- Small child proportions (kindergarten age)
- Royal blue medieval tunic with silver Celtic knotwork trim
- Brown leather belt and brown boots
- Carrying a small wooden practice sword`;

// CLAUDE THE DOG
const CLAUDE = `a loyal Redbone Coonhound dog with:
- Rich reddish-brown coat
- Long floppy ears
- Soulful amber-brown eyes
- Royal blue collar with silver heart-shaped tag
- Standing protectively near the boy`;

// STYLE MATCHING OTHER CARDS
const STYLE = `Disney Pixar 3D animation style, photorealistic rendering, 4K ultra-detailed, warm golden hour lighting, magical fantasy atmosphere, child-friendly, professional quality matching other chapter cards in the series`;

const SCENES = [
  {
    chapter: 2,
    scene: 1,
    title: "The Hidden Waterfall",
    prompt: `${STYLE}

Scene: A magical forest clearing with a sparkling waterfall in the background creating rainbows in the misty air. ${SIR_JAMES} stands in wonder, looking at the waterfall with amazement. ${CLAUDE} stands beside him, tail wagging excitedly.

The setting is a lush enchanted forest with dappled sunlight filtering through the trees. The waterfall creates a magical, mystical atmosphere with rainbow light refracting through the mist.

CRITICAL: The boy must look like a TINY 5-YEAR-OLD with BRIGHT BLUE EYES and rosy cheeks - NOT a teenager or young adult. Match the realistic Pixar style of other chapter cards.`
  },
  {
    chapter: 3,
    scene: 1,
    title: "Meeting the Dragon",
    prompt: `${STYLE}

Scene: High atop a misty mountain plateau at golden sunset. ${SIR_JAMES} stands bravely before a wise, friendly ancient dragon with golden scales. ${CLAUDE} stands protectively beside the tiny boy.

The dragon is large and majestic but kind-looking with wise golden eyes and a gentle expression. The mountain setting has dramatic sunset colors with misty peaks in the background.

CRITICAL: The boy must look like a TINY 5-YEAR-OLD with BRIGHT BLUE EYES and rosy cheeks - NOT a teenager or young adult. Match the realistic Pixar style of other chapter cards (like Chapter 1, 2, 4, 5, etc).`
  }
];

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
  console.log('🎨 FINAL FIX: Chapter 2 & 3 Card Images');
  console.log('━'.repeat(50));
  
  for (const scene of SCENES) {
    const chapterStr = String(scene.chapter).padStart(2, '0');
    const imagePath = path.join(__dirname, '..', 'public-book002', `chapter${chapterStr}`, 'images', 'scene-001.png');
    
    // Backup existing
    const backupPath = imagePath.replace('.png', `-backup-final-${Date.now()}.png`);
    if (fs.existsSync(imagePath)) {
      fs.copyFileSync(imagePath, backupPath);
      console.log(`\n📦 Chapter ${scene.chapter}: Backed up existing image`);
    }
    
    console.log(`🎨 Chapter ${scene.chapter}: Generating "${scene.title}"...`);
    
    try {
      const imageUrl = await generateImage(scene.prompt);
      console.log(`✅ Chapter ${scene.chapter}: Image generated!`);
      
      await downloadImage(imageUrl, imagePath);
      console.log(`💾 Chapter ${scene.chapter}: Saved to ${path.basename(imagePath)}`);
      
    } catch (error) {
      console.error(`❌ Chapter ${scene.chapter}: Error - ${error.message}`);
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, imagePath);
        console.log(`📦 Chapter ${scene.chapter}: Restored backup`);
      }
    }
  }
  
  console.log('\n' + '━'.repeat(50));
  console.log('🎉 Done! Now deploy with: netlify deploy --prod --dir=public-book002');
}

main();
