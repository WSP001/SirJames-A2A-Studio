#!/usr/bin/env node
/**
 * FIX ALL INCONSISTENT IMAGES
 * - Chapter 2 Scene 1 (scene page shows teenager - needs 5yo)
 * - Chapter 3 Cover (card image - needs consistent style)
 * 
 * Commons Good Compliance:
 * - Cost: ~$0.08 (2 images @ $0.04 each)
 * - Attribution: DALL-E 3 by OpenAI
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ============================================
// CHARACTER CONSISTENCY BIBLE (from CONSISTENCY.md)
// ============================================
const SIR_JAMES_PROMPT = `Sir James: a tiny 5-year-old boy knight with:
- BRIGHT BLUE EYES (CRITICAL - must be vivid blue, NOT green or brown)
- Sandy brown messy hair with a slight cowlick on top
- Rosy pink cheeks with an innocent sweet smile
- Very small child proportions (kindergarten age, about 3.5 feet tall)
- Royal blue medieval tunic with silver Celtic knotwork trim
- Brown leather belt with a small pouch
- Brown leather boots
- Carrying a small wooden practice sword
- Expression: curious, brave, innocent`;

const CLAUDE_PROMPT = `Claude the dog: a loyal Redbone Coonhound with:
- Rich reddish-brown coat (NOT dark brown or black)
- Long floppy ears that hang past his chin
- Soulful amber-brown eyes with intelligence
- Royal blue collar with a silver heart-shaped tag
- Proud but friendly posture
- Standing protectively near Sir James`;

const STYLE_PROMPT = `Disney Pixar 3D animation style, photorealistic CGI rendering, 4K ultra-detailed, warm golden hour cinematic lighting, magical fantasy atmosphere, child-friendly, professional quality matching theatrical animation standards`;

// ============================================
// IMAGES TO FIX
// ============================================
const IMAGES_TO_FIX = [
  {
    name: "Chapter 2 Scene 1",
    outputPath: "public-book002/chapter02/images/scene-001.png",
    prompt: `${STYLE_PROMPT}

SCENE: A magical forest clearing with a sparkling hidden waterfall creating rainbows in the misty air. Sunlight filters through ancient trees with hanging moss and vines.

CHARACTERS:
${SIR_JAMES_PROMPT}
${CLAUDE_PROMPT}

ACTION: Sir James stands in wonder at the edge of a crystal-clear pool, gazing up at the magnificent waterfall with amazement. Claude stands beside him, tail wagging with excitement, ears perked forward.

ATMOSPHERE: Enchanted, mystical, discovery moment. Rainbow light refracts through the waterfall mist. Magical sparkles in the air.

CRITICAL: The boy MUST look like a TINY 5-YEAR-OLD (kindergarten age) with BRIGHT BLUE EYES. NOT a teenager, NOT a young adult. Very small child proportions.`
  },
  {
    name: "Chapter 3 Cover",
    outputPath: "public-book002/assets/covers/chapter03-cover.png",
    prompt: `${STYLE_PROMPT}

SCENE: A mystical dragon's cave with glowing blue crystals, ancient stone walls, and warm torchlight. A wise, friendly dragon with golden-purple scales rests in the background.

CHARACTERS:
${SIR_JAMES_PROMPT}
${CLAUDE_PROMPT}

ACTION: Sir James stands bravely but respectfully before the wise dragon, holding his wooden sword at his side (not threatening). Claude sits beside him, looking up at the dragon with curiosity. The dragon has kind, wise eyes and a gentle expression.

ATMOSPHERE: Magical, mysterious, but safe and child-friendly. The dragon is clearly friendly and wise, not scary.

CRITICAL: The boy MUST look like a TINY 5-YEAR-OLD (kindergarten age) with BRIGHT BLUE EYES. Match the realistic Pixar style of other chapter covers. NOT a teenager.`
  }
];

// ============================================
// API FUNCTIONS
// ============================================
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

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('🎨 FIX ALL INCONSISTENT IMAGES');
  console.log('━'.repeat(60));
  console.log('Target: 5-year-old Sir James with BRIGHT BLUE EYES');
  console.log('Style: Disney Pixar 3D, matching other chapter cards');
  console.log('━'.repeat(60));
  
  for (const image of IMAGES_TO_FIX) {
    const fullPath = path.join(__dirname, '..', image.outputPath);
    
    // Backup existing
    const timestamp = Date.now();
    const backupPath = fullPath.replace('.png', `-backup-${timestamp}.png`);
    if (fs.existsSync(fullPath)) {
      fs.copyFileSync(fullPath, backupPath);
      console.log(`\n📦 ${image.name}: Backed up existing image`);
    }
    
    console.log(`🎨 ${image.name}: Generating...`);
    console.log(`   Output: ${image.outputPath}`);
    
    try {
      const imageUrl = await generateImage(image.prompt);
      console.log(`✅ ${image.name}: Image generated!`);
      
      await downloadImage(imageUrl, fullPath);
      const stats = fs.statSync(fullPath);
      console.log(`💾 ${image.name}: Saved (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      
    } catch (error) {
      console.error(`❌ ${image.name}: Error - ${error.message}`);
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, fullPath);
        console.log(`📦 ${image.name}: Restored backup`);
      }
    }
  }
  
  console.log('\n' + '━'.repeat(60));
  console.log('🎉 Done! Deploy with: netlify deploy --prod --dir=public-book002');
  console.log('━'.repeat(60));
}

main();
