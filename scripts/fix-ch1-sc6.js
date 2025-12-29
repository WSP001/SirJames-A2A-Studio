#!/usr/bin/env node
/**
 * Fix Chapter 1 Scene 6 - Failed during batch regeneration
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SIR_JAMES = `a 5-year-old little boy with short sandy-brown hair, big bright blue-green eyes, round chubby cheeks, small button nose, sweet innocent smile showing small baby teeth, very small child proportions (about 3.5 feet tall), wearing a royal blue medieval tunic with silver Celtic knotwork trim and a brown leather belt, brown boots`;

const CLAUDE_DOG = `a Redbone Coonhound dog (sleek deep reddish-brown coat, long droopy floppy ears that hang past the jaw, soulful dark brown eyes, black nose, athletic hound body, wearing a blue collar with silver heart tag)`;

const STYLE = `
STYLE: 3D Pixar/Disney animation, bright cheerful colors, soft warm lighting, child-friendly, magical whimsical atmosphere.
CRITICAL: The boy must look exactly 5 years old - kindergarten age, very small, chubby baby face, innocent expression.
NO TEXT in the image.
`;

// Chapter 1 Scene 6: Walking through mysterious forest
const PROMPT = `${SIR_JAMES} and ${CLAUDE_DOG} walking through a mysterious enchanted forest with ancient towering trees. The small 5-year-old stays close to Claude for comfort. Dappled golden sunlight filters through the canopy, moss-covered trees, mystical atmosphere with soft magical sparkles in the air. ${STYLE}`;

async function generateImage(prompt, outputPath) {
    console.log(`\n📝 Generating: ${outputPath}`);
    
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
                    await downloadImage(imageUrl, outputPath);
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
    console.log('🔧 Fixing Chapter 1 Scene 6');
    
    const outputPath = path.join(__dirname, '..', 'public-book002', 'chapter01', 'images', 'scene-006.png');
    
    try {
        await generateImage(PROMPT, outputPath);
        console.log('\n✅ Fixed! Cost: ~$0.08');
    } catch (error) {
        console.error(`❌ Failed: ${error.message}`);
    }
}

main().catch(console.error);
