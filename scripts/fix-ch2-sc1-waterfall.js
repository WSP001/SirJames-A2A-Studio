#!/usr/bin/env node
/**
 * Fix Chapter 2 Scene 1 - The Hidden Waterfall
 * Problem: DALL-E generated a teenager instead of a 5-year-old
 * Solution: Ultra-explicit age descriptors
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ULTRA-EXPLICIT 5-YEAR-OLD DESCRIPTION
// Using kindergarten-specific terms that DALL-E cannot misinterpret
const SIR_JAMES_5YO = `a tiny 5-year-old KINDERGARTEN boy (CRITICAL: must look like a preschooler/kindergartener, NOT a teenager, NOT a young adult, NOT older than 6):
- Very small child body (about 3 feet tall, waist-height to an adult)
- Round chubby baby face with pudgy cheeks
- Big innocent wide eyes (bright blue-green color)
- Short messy sandy-brown hair with a cowlick
- Small button nose
- Sweet innocent smile showing small baby teeth
- Tiny hands and short stubby fingers
- Wearing an oversized royal blue medieval tunic with silver Celtic knotwork (tunic looks big on his small frame)
- Brown leather belt cinched tight on his small waist
- Little brown boots
- Holding a small wooden toy sword`;

const CLAUDE_DOG = `a Redbone Coonhound dog standing next to the boy (the dog is almost as tall as the small child):
- Sleek deep reddish-brown coat
- Long droopy floppy ears hanging past the jaw
- Soulful dark brown eyes looking excited
- Black nose, wet and shiny
- Athletic hound body with long legs
- Wearing a blue collar with silver heart tag
- Tail wagging with excitement
- Alert posture, ears perked forward`;

const SCENE = `SCENE: The Hidden Waterfall Discovery
- Magical sparkling waterfall cascading down mossy rocks
- Beautiful rainbow arcing through the misty spray
- Hidden cave entrance visible behind the curtain of water
- Mysterious treasure chest partially visible in the cave
- Lush green forest surroundings
- Magical sparkles and light rays in the mist
- Warm golden afternoon sunlight`;

const STYLE = `STYLE REQUIREMENTS:
- 3D Pixar/Disney animation style
- Bright cheerful saturated colors
- Soft warm magical lighting
- Child-friendly whimsical atmosphere
- Professional broadcast quality
- 4K ultra-detailed

CRITICAL AGE REQUIREMENT: The boy MUST look exactly like a 5-year-old kindergartener - tiny, chubby-cheeked, innocent. He should look like he just started school. DO NOT make him look older than 6 years old under any circumstances.

NO TEXT OR WORDS IN THE IMAGE.`;

const FULL_PROMPT = `${SIR_JAMES_5YO}

${CLAUDE_DOG}

${SCENE}

${STYLE}`;

async function generateImage(prompt, outputPath) {
    console.log(`\n📝 Generating: Chapter 2 Scene 1 - The Hidden Waterfall`);
    console.log(`   Output: ${outputPath}`);
    
    const requestData = JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1792x1024",
        quality: "hd",
        style: "vivid"
    });

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.openai.com',
            path: '/v1/images/generations',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Length': Buffer.byteLength(requestData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', async () => {
                try {
                    const response = JSON.parse(data);
                    if (response.error) {
                        reject(new Error(response.error.message));
                        return;
                    }
                    
                    const imageUrl = response.data[0].url;
                    console.log(`   ⬇️  Downloading image...`);
                    await downloadImage(imageUrl, outputPath);
                    console.log(`   ✅ Saved successfully!`);
                    resolve(outputPath);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(requestData);
        req.end();
    });
}

function downloadImage(url, outputPath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                https.get(res.headers.location, (res2) => {
                    const fileStream = fs.createWriteStream(outputPath);
                    res2.pipe(fileStream);
                    fileStream.on('finish', () => { fileStream.close(); resolve(); });
                }).on('error', reject);
            } else {
                const fileStream = fs.createWriteStream(outputPath);
                res.pipe(fileStream);
                fileStream.on('finish', () => { fileStream.close(); resolve(); });
            }
        }).on('error', reject);
    });
}

async function main() {
    console.log('═'.repeat(60));
    console.log('🔧 FIXING CHAPTER 2 SCENE 1 - THE HIDDEN WATERFALL');
    console.log('═'.repeat(60));
    console.log('\n📋 Problem: Image shows teenager instead of 5-year-old');
    console.log('📋 Solution: Ultra-explicit kindergartener age descriptors\n');
    
    const outputPath = path.join(__dirname, '..', 'public-book002', 'chapter02', 'images', 'scene-001.png');
    
    // Backup existing image
    const backupPath = outputPath.replace('.png', `-backup-${Date.now()}.png`);
    if (fs.existsSync(outputPath)) {
        fs.copyFileSync(outputPath, backupPath);
        console.log(`📦 Backed up existing image`);
    }
    
    try {
        await generateImage(FULL_PROMPT, outputPath);
        console.log('\n' + '═'.repeat(60));
        console.log('✅ CHAPTER 2 SCENE 1 FIXED!');
        console.log('💰 Cost: ~$0.08');
        console.log('═'.repeat(60));
    } catch (error) {
        console.error(`\n❌ Failed: ${error.message}`);
        // Restore backup if generation failed
        if (fs.existsSync(backupPath)) {
            fs.copyFileSync(backupPath, outputPath);
            console.log('📦 Restored backup image');
        }
    }
}

main().catch(console.error);
