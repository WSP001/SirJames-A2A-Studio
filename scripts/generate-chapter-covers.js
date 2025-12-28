#!/usr/bin/env node
/**
 * Generate Character-Consistent Chapter Cover Images
 * Sir James Adventures Book002
 * 
 * CRITICAL: Sir James is a 5-YEAR-OLD BOY, not a teenager!
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load API key from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in .env.local');
    process.exit(1);
}

// STRICT CHARACTER DESCRIPTIONS - DO NOT MODIFY
const CHARACTERS = {
    sirJames: `Sir James (a VERY YOUNG 5-year-old boy, small child proportions, round chubby cheeks, big innocent eyes, messy brown hair with a cowlick, wearing a royal blue tunic with silver Celtic trim, brown leather belt, brown boots, holding a small wooden practice sword)`,
    claude: `Claude (a loyal Redbone Coonhound dog with reddish-brown coat, long floppy ears, soulful brown eyes, wearing a blue collar with a silver tag)`,
    gramps: `Gramps (a kind elderly man with a full white beard and warm smile, wearing a forest-green tunic with brown leather belt)`,
    sparky: `Sparky (a small energetic red squirrel with a fluffy tail and bright eyes)`
};

const STYLE = `
Style: 3D Pixar-style animation, bright vibrant colors, soft lighting, child-friendly, whimsical.
Quality: High detail, 4K resolution.
Mood: Warm, adventurous, magical, age-appropriate for young children.
CRITICAL: Sir James MUST look like a 5-YEAR-OLD CHILD - small, round face, chubby cheeks, innocent expression. NOT a teenager or adult.
NO TEXT in the image.
`;

// Chapter-specific prompts
const CHAPTER_PROMPTS = [
    {
        chapter: 1,
        title: "The Quest Begins",
        theme: "Courage",
        prompt: `${CHARACTERS.sirJames} standing proudly in a grand castle throne room, receiving a quest scroll from a kind king. ${CHARACTERS.claude} sits loyally beside him. Sunlight streams through stained glass windows. The little boy looks excited but determined.`
    },
    {
        chapter: 2,
        title: "The Butterfly Garden",
        theme: "Patience",
        prompt: `${CHARACTERS.sirJames} in a magical butterfly garden filled with colorful flowers and glowing butterflies. The small 5-year-old boy is gently holding out his hand as a beautiful butterfly lands on it. ${CHARACTERS.claude} watches curiously. Soft golden sunlight.`
    },
    {
        chapter: 3,
        title: "The Dragon's Riddle",
        theme: "Wisdom",
        prompt: `${CHARACTERS.sirJames} facing a friendly, wise dragon in a mystical cave. The small 5-year-old boy looks up with wonder (not fear) at the dragon who has kind eyes. ${CHARACTERS.claude} stands protectively nearby. Magical crystals glow in the cave.`
    },
    {
        chapter: 4,
        title: "The Enchanted Garden",
        theme: "Stewardship",
        prompt: `${CHARACTERS.sirJames} helping tend a magical garden with glowing plants and talking flowers. The small 5-year-old boy is watering a plant with a tiny watering can. ${CHARACTERS.claude} digs playfully nearby. ${CHARACTERS.sparky} watches from a branch.`
    },
    {
        chapter: 5,
        title: "The Wise Owl's Lesson",
        theme: "Humility",
        prompt: `${CHARACTERS.sirJames} sitting on a tree branch listening to a wise old owl in a moonlit forest. The small 5-year-old boy looks up with curiosity and respect. ${CHARACTERS.claude} rests at the base of the tree. Fireflies twinkle around them.`
    },
    {
        chapter: 6,
        title: "The Mirror of Truth",
        theme: "Honesty",
        prompt: `${CHARACTERS.sirJames} looking into a magical glowing mirror in an ancient tower room. The small 5-year-old boy sees his reflection smiling back encouragingly. ${CHARACTERS.claude} sits beside him. Soft magical light emanates from the mirror.`
    },
    {
        chapter: 7,
        title: "The Wishing Star",
        theme: "Hope",
        prompt: `${CHARACTERS.sirJames} standing on a hilltop at night, reaching up toward a bright wishing star. The small 5-year-old boy's face is full of wonder and hope. ${CHARACTERS.claude} looks up at the sky beside him. A magical trail of stardust falls gently.`
    },
    {
        chapter: 8,
        title: "The River of Stars",
        theme: "Kindness",
        prompt: `${CHARACTERS.sirJames} helping a lost baby unicorn find its way across a magical river that reflects the stars. The small 5-year-old boy gently leads the unicorn by the mane. ${CHARACTERS.claude} wades through the shallow water beside them.`
    },
    {
        chapter: 9,
        title: "The Moonbeam Celebration",
        theme: "Faith",
        prompt: `${CHARACTERS.sirJames} at a magical forest celebration with friendly woodland creatures dancing in moonbeams. The small 5-year-old boy dances joyfully with ${CHARACTERS.claude}. ${CHARACTERS.sparky} and other animals celebrate around them. Magical lights float in the air.`
    },
    {
        chapter: 10,
        title: "The Knight's Triumph",
        theme: "Perseverance",
        prompt: `${CHARACTERS.sirJames} being celebrated as a true knight in a grand castle courtyard. The small 5-year-old boy stands proudly with his wooden sword raised, ${CHARACTERS.claude} by his side. ${CHARACTERS.gramps} watches proudly from behind. Colorful banners and confetti fill the air.`
    }
];

async function generateImage(prompt, outputPath) {
    const fullPrompt = `${prompt}\n\n${STYLE}`;
    
    console.log(`\n📝 Generating: ${outputPath}`);
    console.log(`   Prompt preview: ${prompt.substring(0, 100)}...`);
    
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
                    console.log(`   ✅ Image generated, downloading...`);
                    
                    // Download the image
                    await downloadImage(imageUrl, outputPath);
                    console.log(`   ✅ Saved to ${outputPath}`);
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
                // Follow redirect
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
    console.log('🎨 Sir James Adventures - Chapter Cover Generator');
    console.log('=' .repeat(50));
    console.log('⚠️  CRITICAL: Sir James is a 5-YEAR-OLD BOY');
    console.log('=' .repeat(50));
    
    const outputDir = path.join(__dirname, '..', 'public-book002', 'assets', 'covers');
    
    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate each chapter cover
    for (const chapter of CHAPTER_PROMPTS) {
        const outputPath = path.join(outputDir, `chapter${String(chapter.chapter).padStart(2, '0')}-cover.png`);
        
        try {
            await generateImage(chapter.prompt, outputPath);
            console.log(`   💰 Cost: ~$0.08 (DALL-E 3 HD)`);
            
            // Rate limit - wait 2 seconds between requests
            await new Promise(r => setTimeout(r, 2000));
        } catch (error) {
            console.error(`   ❌ Failed: ${error.message}`);
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Generation complete!');
    console.log(`📁 Output: ${outputDir}`);
    console.log('💰 Total estimated cost: ~$0.80 (10 images)');
}

main().catch(console.error);
