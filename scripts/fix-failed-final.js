#!/usr/bin/env node
/**
 * Fix the 6 failed images from the main regeneration batch
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const CHARACTERS = {
    sirJames: `Sir James (a VERY YOUNG 5-year-old boy knight, SMALL child proportions - only 3 feet tall, round chubby baby face, big innocent brown eyes, messy brown hair with a cowlick, rosy cheeks, wearing a royal blue tunic with silver Celtic knotwork trim, brown leather belt with small pouch, brown boots)`,
    claude: `Claude (a NOBLE Redbone Coonhound of ROYAL BLOODLINE, majestic reddish-brown coat that gleams like polished mahogany, long elegant floppy ears, soulful intelligent brown eyes, proud bearing, wearing a royal blue collar with a silver heart-shaped tag)`,
    gramps: `Gramps (a kind elderly grandfather with a full white beard, warm twinkling blue eyes, gentle smile, wearing a forest-green tunic with brown leather belt)`
};

const STYLE = `
STYLE: 3D Pixar/Disney-style animation, bright vibrant colors, soft warm lighting, child-friendly, whimsical and magical.
QUALITY: High detail, cinematic composition.
CRITICAL: Sir James MUST look like a 5-YEAR-OLD CHILD - very small (3 feet tall), round baby face, chubby cheeks, innocent expression.
NO TEXT in the image.
`;

const FAILED_IMAGES = [
    {
        chapter: 1,
        scene: 2,
        title: "Meeting Claude",
        outputPath: 'public-book002/chapter01/images/scene-002.png',
        prompt: `${CHARACTERS.sirJames} in a sunny castle courtyard, turning with joy as ${CHARACTERS.claude} bounds toward him with tail wagging excitedly. The tiny 5-year-old boy opens his arms to greet his noble dog friend. Castle walls in background, colorful flowers, morning sunlight, butterflies in the air.`
    },
    {
        chapter: 1,
        scene: 3,
        title: "Preparation",
        outputPath: 'public-book002/chapter01/images/scene-003.png',
        prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} in a cozy castle room gathering supplies for their adventure. The tiny 5-year-old boy checks items: a rolled map, a small bag of food, and a golden compass. Claude watches attentively. Warm interior lighting, adventure gear on a wooden table.`
    },
    {
        chapter: 1,
        scene: 7,
        title: "Mountain View",
        outputPath: 'public-book002/chapter01/images/scene-007.png',
        prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} standing on a grassy hilltop, looking out at majestic purple mountains stretching to the horizon. The tiny 5-year-old boy points toward the distant peaks. Epic panoramic landscape, sunset colors of orange and pink, wind gently blowing his hair.`
    },
    {
        chapter: 4,
        scene: 7,
        title: "A Seed of Kindness",
        outputPath: 'public-book002/chapter04/images/scene-007.png',
        prompt: `A gentle Garden Keeper made of flower petals placing a glowing magical seed that sparkles like a tiny star into ${CHARACTERS.sirJames}'s small cupped palm. The tiny 5-year-old boy looks at it with wonder. ${CHARACTERS.claude} watches the magical gift. Soft golden glow, enchanted garden setting.`
    },
    {
        chapter: 6,
        scene: 3,
        title: "Sir James's Reflection",
        outputPath: 'public-book002/chapter06/images/scene-003.png',
        prompt: `${CHARACTERS.sirJames} looking into a magical Mirror of Truth, seeing his reflection glowing with warm golden light that shows his inner kindness and courage. The tiny 5-year-old boy looks surprised and pleased. ${CHARACTERS.claude} watches nearby. Beautiful magical mirror in an old tower room.`
    },
    {
        chapter: 7,
        scene: 3,
        title: "The Wishing Star Appears",
        outputPath: 'public-book002/chapter07/images/scene-003.png',
        prompt: `The legendary Wishing Star - a beautiful glowing orb of warm silver light - floating gently before ${CHARACTERS.sirJames} in a magical star chamber. The tiny 5-year-old boy looks up in awe. ${CHARACTERS.claude} watches amazed. Spectacular starry night sky visible through open ceiling.`
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
                    console.log(`   ✅ Saved`);
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
    console.log('🔧 FIXING 6 FAILED IMAGES');
    console.log('═'.repeat(50));
    
    let success = 0;
    let failed = 0;
    
    for (const img of FAILED_IMAGES) {
        try {
            await generateImage(img.prompt, img.outputPath);
            success++;
            await new Promise(r => setTimeout(r, 3000)); // 3 second delay
        } catch (error) {
            console.error(`   ❌ Failed: ${error.message}`);
            failed++;
        }
    }
    
    console.log('\n' + '═'.repeat(50));
    console.log(`✅ Fixed: ${success}/6 images`);
    console.log(`❌ Still failed: ${failed} images`);
    console.log(`💰 Cost: ~$${(success * 0.08).toFixed(2)}`);
}

main().catch(console.error);
