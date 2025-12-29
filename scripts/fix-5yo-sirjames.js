#!/usr/bin/env node
/**
 * ULTRA-EXPLICIT 5-YEAR-OLD SIR JAMES REGENERATION
 * 
 * The problem: DALL-E keeps generating teenagers/adults despite prompts.
 * Solution: Use EXTREMELY explicit age descriptors that cannot be misinterpreted.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ULTRA-EXPLICIT CHARACTER - Cannot be misinterpreted as older
const SIR_JAMES = `a TINY KINDERGARTEN-AGE BOY (exactly 5 years old, TODDLER-LIKE proportions, standing only waist-high to adults, with a BIG ROUND HEAD on a small body, CHUBBY BABY CHEEKS, huge innocent doe eyes, button nose, missing baby teeth smile, messy brown hair with cowlick, wearing an oversized royal blue tunic that's too big for him with silver Celtic trim, brown boots)`;

const CLAUDE_DOG = `Claude the loyal Redbone Coonhound (reddish-brown coat, long floppy ears, soulful brown eyes, blue collar with silver heart tag)`;

const STYLE = `
STYLE: Pixar/Disney 3D animation style, bright cheerful colors, soft lighting.
AGE REQUIREMENT: The boy MUST look like a PRESCHOOLER/KINDERGARTENER - age 5. NOT a teenager. NOT a young adult. NOT a preteen. He should look like he belongs in kindergarten class.
PROPORTIONS: Child has a large head relative to body (like a toddler), short stubby limbs, round belly, chubby cheeks.
NO TEXT in the image.
`;

// Chapter 2 Scene 1: The Hidden Waterfall
// Script: "Following the winding forest path, Sir James and Claude discovered something magical - a sparkling waterfall that painted rainbows in the misty air."
const CHAPTER2_SCENE1_PROMPT = `
A TINY 5-YEAR-OLD KINDERGARTEN BOY (${SIR_JAMES}) and ${CLAUDE_DOG} discovering a magnificent sparkling waterfall in an enchanted forest.

The SMALL CHILD (who only comes up to the dog's shoulder height) points excitedly at a rainbow forming in the waterfall's misty spray. His face shows pure childlike wonder - big round eyes wide with amazement, mouth open in an excited "WOW!"

The waterfall cascades over mossy rocks into a crystal-clear pool. Behind the curtain of water, a mysterious cave entrance is barely visible. Magical sparkles dance in the mist. Lush green forest surrounds them.

${STYLE}
`;

async function generateImage(prompt, outputPath) {
    console.log(`\n📝 Generating: ${outputPath}`);
    console.log(`📋 Prompt preview: ${prompt.substring(0, 200)}...`);
    
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
                    
                    // Show revised prompt from DALL-E
                    if (response.data[0].revised_prompt) {
                        console.log(`\n🔄 DALL-E revised prompt to:\n${response.data[0].revised_prompt}\n`);
                    }
                    
                    await downloadImage(imageUrl, outputPath);
                    console.log(`✅ Saved to ${outputPath}`);
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
    console.log('🎨 ULTRA-EXPLICIT 5-YEAR-OLD SIR JAMES REGENERATION');
    console.log('═'.repeat(60));
    console.log('⚠️  Using KINDERGARTEN-AGE, TODDLER-LIKE descriptors');
    console.log('═'.repeat(60));
    
    const outputPath = path.join(__dirname, '..', 'public-book002', 'chapter02', 'images', 'scene-001.png');
    
    // Backup existing
    const backupPath = outputPath.replace('.png', '-backup.png');
    if (fs.existsSync(outputPath)) {
        fs.copyFileSync(outputPath, backupPath);
        console.log(`📦 Backed up existing image`);
    }
    
    try {
        await generateImage(CHAPTER2_SCENE1_PROMPT, outputPath);
        console.log('\n✅ SUCCESS! Image regenerated.');
        console.log('💰 Cost: ~$0.08');
    } catch (error) {
        console.error(`❌ Failed: ${error.message}`);
    }
}

main().catch(console.error);
