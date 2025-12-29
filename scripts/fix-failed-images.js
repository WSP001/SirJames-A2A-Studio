#!/usr/bin/env node
/**
 * Fix the 3 failed images with adjusted prompts
 * Chapter 6 Scene 1, Chapter 8 Scene 4, Chapter 10 Scene 8
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const CHARACTERS = {
    sirJames: `Sir James (a VERY YOUNG 5-year-old boy, small child proportions, round chubby cheeks, big innocent brown eyes, messy brown hair with a cowlick, wearing a royal blue tunic with silver Celtic knotwork trim, brown leather belt with small pouch, brown boots)`,
    claude: `Claude (a loyal Redbone Coonhound dog with rich reddish-brown coat, long floppy ears, soulful brown eyes, wearing a blue collar with a silver heart-shaped tag)`,
    gramps: `Gramps (a kind elderly man with a full white beard, warm smile, twinkling eyes, wearing a forest-green tunic with brown leather belt)`
};

const STYLE = `
Style: 3D Pixar-style animation, bright vibrant colors, soft warm lighting, child-friendly, whimsical and magical.
Quality: High detail, cinematic composition.
Mood: Warm, adventurous, magical, age-appropriate for young children.
CRITICAL: Sir James MUST look like a 5-YEAR-OLD CHILD - very small stature, round baby face, chubby cheeks, innocent expression.
NO TEXT in the image.
`;

// Adjusted prompts to avoid safety filters
const FAILED_IMAGES = [
    {
        chapter: 6,
        scene: 1,
        outputPath: 'public-book002/chapter06/images/scene-001.png',
        prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} standing beside a beautiful calm lake surrounded by flowers. The small 5-year-old boy looks at his reflection in the crystal clear water with curiosity. Soft morning mist, magical atmosphere, peaceful forest setting.`
    },
    {
        chapter: 8,
        scene: 4,
        outputPath: 'public-book002/chapter08/images/scene-004.png',
        prompt: `${CHARACTERS.sirJames} gently helping a small baby deer cross a sparkling magical stream. The small 5-year-old boy shows kindness and care. ${CHARACTERS.claude} watches protectively. Beautiful forest setting with glowing flowers, warm sunlight.`
    },
    {
        chapter: 10,
        scene: 8,
        outputPath: 'public-book002/chapter10/images/scene-008.png',
        prompt: `${CHARACTERS.sirJames} peacefully sleeping in a cozy bed with ${CHARACTERS.claude} curled up at his feet. ${CHARACTERS.gramps} stands in the doorway smiling warmly. Moonlight streams through the window, creating a peaceful bedtime scene. Warm, safe, happy ending atmosphere.`
    }
];

async function generateImage(prompt, outputPath) {
    const fullPrompt = `${prompt}\n\n${STYLE}`;
    
    console.log(`\n📝 Generating: ${outputPath}`);
    
    const requestData = JSON.stringify({
        model: "dall-e-3",
        prompt: fullPrompt,
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
                    await downloadImage(imageUrl, path.join(__dirname, '..', outputPath));
                    console.log(`   ✅ Saved!`);
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
    console.log('🔧 Fixing 3 Failed Images');
    console.log('='.repeat(50));
    
    for (const img of FAILED_IMAGES) {
        try {
            await generateImage(img.prompt, img.outputPath);
            await new Promise(r => setTimeout(r, 2000));
        } catch (error) {
            console.error(`   ❌ Failed: ${error.message}`);
        }
    }
    
    console.log('\n✅ Fix complete!');
}

main().catch(console.error);
