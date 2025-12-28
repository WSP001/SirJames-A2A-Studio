#!/usr/bin/env node
/**
 * Regenerate Scene Images with Correct 5-Year-Old Sir James
 * Sir James Adventures Book002
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found');
    process.exit(1);
}

// STRICT CHARACTER DESCRIPTIONS
const CHARACTERS = {
    sirJames: `Sir James (a VERY YOUNG 5-year-old boy, small child proportions, round chubby cheeks, big innocent brown eyes, messy brown hair with a cowlick, wearing a royal blue tunic with silver Celtic knotwork trim, brown leather belt with small pouch, brown boots)`,
    claude: `Claude (a loyal Redbone Coonhound dog with rich reddish-brown coat, long floppy ears, soulful brown eyes, wearing a blue collar with a silver heart-shaped tag)`,
    gramps: `Gramps (a kind elderly man with a full white beard, warm smile, wearing a forest-green tunic with brown leather belt)`,
    kingArthur: `King Arthur (a noble king with golden crown, purple royal robes, kind fatherly expression)`
};

const STYLE = `
Style: 3D Pixar-style animation, bright vibrant colors, soft warm lighting, child-friendly, whimsical and magical.
Quality: High detail, cinematic composition, 4K resolution.
Mood: Warm, adventurous, magical, age-appropriate for young children (ages 5-8).
CRITICAL: Sir James MUST look like a 5-YEAR-OLD CHILD - very small, round face, chubby cheeks, innocent expression. NOT a teenager or adult.
NO TEXT in the image.
`;

// Chapter 1 Scene Prompts
const CHAPTER1_SCENES = [
    {
        scene: 1,
        title: "The Quest Begins",
        prompt: `${CHARACTERS.sirJames} standing proudly in a grand castle throne room with tall stained glass windows. ${CHARACTERS.kingArthur} hands him a golden scroll quest. ${CHARACTERS.claude} sits loyally beside the small boy. Sunlight streams through colorful windows creating magical atmosphere.`
    },
    {
        scene: 2,
        title: "Meeting Claude",
        prompt: `${CHARACTERS.sirJames} in a sunny castle courtyard filled with colorful flowers. ${CHARACTERS.claude} bounds toward the small 5-year-old boy with tail wagging excitedly. The little boy kneels down with arms open to greet his dog friend. Warm morning sunlight, butterflies in the air.`
    },
    {
        scene: 3,
        title: "Preparation",
        prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} in a cozy castle room packing adventure supplies. The small 5-year-old boy carefully places items into a leather satchel on a wooden table. Maps, scrolls, and provisions visible. Warm candlelight, stone walls with tapestries.`
    },
    {
        scene: 4,
        title: "Castle Gates",
        prompt: `Large wooden castle gates opening wide with golden morning sunlight streaming through. ${CHARACTERS.sirJames} and ${CHARACTERS.claude} stepping through into a new adventure. The small 5-year-old boy looks up in wonder at the massive gates. Epic perspective, hopeful atmosphere.`
    },
    {
        scene: 5,
        title: "First Steps",
        prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} taking their first steps on a winding cobblestone path leading away from the castle. The small 5-year-old boy walks confidently with his dog beside him. Beautiful sunrise in background, rolling green hills, wildflowers along the path.`
    },
    {
        scene: 6,
        title: "Forest Trail",
        prompt: `Dense enchanted forest trail with tall oak trees forming a natural archway. Dappled golden sunlight filtering through leaves creating magical light beams. ${CHARACTERS.sirJames} and ${CHARACTERS.claude} walking together on the forest path. The small 5-year-old boy looks around in wonder. Fireflies and magical sparkles in the air.`
    },
    {
        scene: 7,
        title: "Mountain View",
        prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} standing on a grassy hilltop overlooking distant purple mountains. Epic landscape panorama view with sunset colors of orange and pink. The small 5-year-old boy points excitedly at the horizon. Wind gently blowing his hair.`
    },
    {
        scene: 8,
        title: "Campsite Evening",
        prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} at a cozy campsite at dusk. The small 5-year-old boy studies a treasure map by warm firelight. ${CHARACTERS.claude} curled up beside him. Tent in background, stars beginning to appear in the purple sky. Warm, safe, magical atmosphere.`
    }
];

async function generateImage(prompt, outputPath) {
    const fullPrompt = `${prompt}\n\n${STYLE}`;
    
    console.log(`\n📝 Generating: ${path.basename(outputPath)}`);
    
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
                    console.log(`   ✅ Generated, downloading...`);
                    
                    await downloadImage(imageUrl, outputPath);
                    console.log(`   ✅ Saved: ${outputPath}`);
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
                    fileStream.on('finish', () => {
                        fileStream.close();
                        resolve();
                    });
                }).on('error', reject);
            } else {
                const fileStream = fs.createWriteStream(outputPath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve();
                });
            }
        }).on('error', reject);
    });
}

async function main() {
    const chapter = process.argv[2] || '1';
    
    console.log('🎨 Sir James Scene Image Regenerator');
    console.log('='.repeat(50));
    console.log('⚠️  CRITICAL: Sir James is a 5-YEAR-OLD BOY');
    console.log(`📖 Processing Chapter ${chapter}`);
    console.log('='.repeat(50));
    
    const scenes = CHAPTER1_SCENES; // For now, only Chapter 1
    const outputDir = path.join(__dirname, '..', 'public-book002', `chapter0${chapter}`, 'images');
    
    // Backup existing images
    const backupDir = path.join(outputDir, 'backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }
    
    for (const scene of scenes) {
        const filename = `scene-00${scene.scene}.png`;
        const outputPath = path.join(outputDir, filename);
        const backupPath = path.join(backupDir, filename);
        
        // Backup existing
        if (fs.existsSync(outputPath)) {
            fs.copyFileSync(outputPath, backupPath);
            console.log(`   📦 Backed up: ${filename}`);
        }
        
        try {
            await generateImage(scene.prompt, outputPath);
            console.log(`   💰 Cost: ~$0.08`);
            
            // Rate limit
            await new Promise(r => setTimeout(r, 2000));
        } catch (error) {
            console.error(`   ❌ Failed: ${error.message}`);
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Chapter 1 scene regeneration complete!');
    console.log(`💰 Total cost: ~$0.64 (8 images)`);
    console.log(`📁 Output: ${outputDir}`);
    console.log(`📦 Backups: ${backupDir}`);
}

main().catch(console.error);
