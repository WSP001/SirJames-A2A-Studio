#!/usr/bin/env node
/**
 * BATCH Regenerate ALL Scene Images with Correct 5-Year-Old Sir James
 * Sir James Adventures Book002 - Chapters 3-10
 * 
 * CRITICAL: Sir James is a 5-YEAR-OLD BOY, NOT a teenager!
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

// STRICT CHARACTER DESCRIPTIONS - 5 YEAR OLD BOY
const CHARACTERS = {
    sirJames: `Sir James (a VERY YOUNG 5-year-old boy, small child proportions, round chubby cheeks, big innocent brown eyes, messy brown hair with a cowlick, wearing a royal blue tunic with silver Celtic knotwork trim, brown leather belt with small pouch, brown boots, small wooden practice sword)`,
    claude: `Claude (a loyal Redbone Coonhound dog with rich reddish-brown coat, long floppy ears, soulful brown eyes, wearing a blue collar with a silver heart-shaped tag)`,
    gramps: `Gramps (a kind elderly man with a full white beard, warm smile, twinkling eyes, wearing a forest-green tunic with brown leather belt)`,
    sparky: `Sparky (a small energetic red squirrel with a fluffy tail and bright curious eyes)`
};

const STYLE = `
Style: 3D Pixar-style animation, bright vibrant colors, soft warm lighting, child-friendly, whimsical and magical.
Quality: High detail, cinematic composition, 4K resolution.
Mood: Warm, adventurous, magical, age-appropriate for young children (ages 5-8).
CRITICAL REQUIREMENT: Sir James MUST look like a 5-YEAR-OLD CHILD - very small stature, round baby face, chubby cheeks, innocent wide-eyed expression. He is NOT a teenager, NOT a young adult, NOT tall. He is a SMALL CHILD.
NO TEXT in the image.
`;

// ALL CHAPTER SCENE PROMPTS (3-10)
const ALL_CHAPTERS = {
    3: [
        { scene: 1, title: "The Dragon's Cave", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} approaching a mysterious cave entrance with gentle smoke wisps. The small 5-year-old boy looks curious but brave. Magical forest surroundings, glowing mushrooms, soft morning light.` },
        { scene: 2, title: "Meeting the Dragon", prompt: `${CHARACTERS.sirJames} meeting a friendly, colorful baby dragon inside a cozy cave. The small 5-year-old boy extends his hand in friendship. ${CHARACTERS.claude} watches cautiously. Warm firelight, treasure glints in background.` },
        { scene: 3, title: "The Riddle Challenge", prompt: `${CHARACTERS.sirJames} sitting cross-legged thinking hard about a riddle, finger on chin. The small 5-year-old boy concentrates with determination. Friendly dragon watches expectantly. ${CHARACTERS.claude} tilts head. Magical symbols float in air.` },
        { scene: 4, title: "Solving Together", prompt: `${CHARACTERS.sirJames} and the friendly dragon working together on a puzzle. The small 5-year-old boy points excitedly at the solution. ${CHARACTERS.claude} wags tail. Glowing magical elements, warm cave interior.` },
        { scene: 5, title: "The Dragon's Gift", prompt: `Friendly dragon presenting a glowing magical gem to ${CHARACTERS.sirJames}. The small 5-year-old boy receives it with wonder and gratitude. ${CHARACTERS.claude} barks happily. Magical sparkles surround them.` },
        { scene: 6, title: "New Friendship", prompt: `${CHARACTERS.sirJames} hugging the friendly dragon goodbye. The small 5-year-old boy waves warmly. ${CHARACTERS.claude} and dragon touch noses. Sunset light at cave entrance, emotional farewell scene.` },
        { scene: 7, title: "Wisdom Learned", prompt: `${CHARACTERS.sirJames} walking away from the cave holding the magical gem, looking back with a smile. The small 5-year-old boy walks confidently. ${CHARACTERS.claude} trots beside him. Beautiful forest path, golden hour lighting.` },
        { scene: 8, title: "Continuing the Journey", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} on a hilltop looking toward new adventures. The small 5-year-old boy holds up the dragon's gem which glows softly. Panoramic fantasy landscape, hopeful sunset sky.` }
    ],
    4: [
        { scene: 1, title: "The Enchanted Garden Gate", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} discovering a magical overgrown garden gate covered in glowing flowers. The small 5-year-old boy reaches toward the gate with wonder. Mystical atmosphere, fairy lights.` },
        { scene: 2, title: "Garden Spirits", prompt: `${CHARACTERS.sirJames} meeting friendly garden spirits (small glowing beings) among giant colorful flowers. The small 5-year-old boy kneels to greet them. ${CHARACTERS.claude} sniffs curiously. Magical garden setting.` },
        { scene: 3, title: "The Wilting Flowers", prompt: `${CHARACTERS.sirJames} looking sad at wilting magical flowers. The small 5-year-old boy touches a drooping petal gently. ${CHARACTERS.claude} looks concerned. Garden spirits point to a dry fountain.` },
        { scene: 4, title: "Finding the Spring", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} searching for a hidden water spring in the garden. The small 5-year-old boy pushes aside magical vines. Discovery moment, light rays breaking through.` },
        { scene: 5, title: "Healing the Garden", prompt: `${CHARACTERS.sirJames} pouring magical water from a golden watering can onto flowers. The small 5-year-old boy smiles as flowers bloom instantly. ${CHARACTERS.claude} watches amazed. Magical transformation scene.` },
        { scene: 6, title: "Garden Celebration", prompt: `${CHARACTERS.sirJames} dancing with garden spirits among now-blooming giant flowers. The small 5-year-old boy laughs joyfully. ${CHARACTERS.claude} bounds through flower petals. Magical celebration, butterflies everywhere.` },
        { scene: 7, title: "The Garden's Thanks", prompt: `Garden spirits presenting ${CHARACTERS.sirJames} with a magical seed. The small 5-year-old boy cups it carefully in his small hands. ${CHARACTERS.claude} sits proudly. Warm gratitude scene.` },
        { scene: 8, title: "Leaving the Garden", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} walking through the restored garden gate. The small 5-year-old boy waves goodbye to spirits. Beautiful blooming garden behind them, magical atmosphere.` }
    ],
    5: [
        { scene: 1, title: "The Wise Owl's Tree", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} looking up at a massive ancient oak tree with a wise owl perched above. The small 5-year-old boy shades his eyes looking up. Moonlit forest, magical atmosphere.` },
        { scene: 2, title: "Meeting the Owl", prompt: `${CHARACTERS.sirJames} bowing respectfully to a majestic wise owl with spectacles. The small 5-year-old boy shows proper manners. ${CHARACTERS.claude} sits attentively. Cozy tree hollow library setting.` },
        { scene: 3, title: "The Lesson Begins", prompt: `${CHARACTERS.sirJames} sitting on a mushroom listening intently to the wise owl teaching. The small 5-year-old boy's eyes are wide with curiosity. ${CHARACTERS.claude} lies beside him. Magical books float nearby.` },
        { scene: 4, title: "Learning Patience", prompt: `${CHARACTERS.sirJames} carefully stacking magical blocks while the owl watches. The small 5-year-old boy concentrates hard, tongue sticking out slightly. ${CHARACTERS.claude} watches supportively. Soft moonlight.` },
        { scene: 5, title: "The Test", prompt: `${CHARACTERS.sirJames} facing a simple but meaningful challenge set by the owl. The small 5-year-old boy thinks carefully before acting. ${CHARACTERS.claude} encourages him. Magical forest clearing.` },
        { scene: 6, title: "Understanding", prompt: `${CHARACTERS.sirJames} having an "aha!" moment, face lighting up with understanding. The small 5-year-old boy raises his hand excitedly. Owl nods approvingly. ${CHARACTERS.claude} wags tail. Magical sparkles.` },
        { scene: 7, title: "The Owl's Blessing", prompt: `Wise owl touching ${CHARACTERS.sirJames}'s forehead with wing tip, bestowing wisdom. The small 5-year-old boy closes eyes peacefully. ${CHARACTERS.claude} watches reverently. Magical glow surrounds them.` },
        { scene: 8, title: "Wiser and Humble", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} leaving the owl's tree at dawn. The small 5-year-old boy walks with quiet confidence. Owl waves from branch. Beautiful sunrise through forest.` }
    ],
    6: [
        { scene: 1, title: "The Mirror Lake", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} discovering a perfectly still magical lake that reflects like a mirror. The small 5-year-old boy peers at his reflection curiously. Mystical atmosphere, soft mist.` },
        { scene: 2, title: "The Reflection Speaks", prompt: `${CHARACTERS.sirJames} startled but curious as his reflection in the lake begins to glow and speak. The small 5-year-old boy leans closer. ${CHARACTERS.claude} barks at the magic. Ethereal lighting.` },
        { scene: 3, title: "Facing Truth", prompt: `${CHARACTERS.sirJames} looking thoughtfully at the Mirror of Truth showing his inner self. The small 5-year-old boy touches his heart. ${CHARACTERS.claude} nuzzles him supportively. Magical mirror imagery.` },
        { scene: 4, title: "The Hard Question", prompt: `${CHARACTERS.sirJames} sitting by the lake, thinking deeply about an important question. The small 5-year-old boy hugs his knees. ${CHARACTERS.claude} rests head on his lap. Contemplative mood, soft lighting.` },
        { scene: 5, title: "Honest Answer", prompt: `${CHARACTERS.sirJames} speaking honestly to the Mirror of Truth, standing tall despite being small. The small 5-year-old boy's face shows sincerity. ${CHARACTERS.claude} stands beside him. Magical glow intensifies.` },
        { scene: 6, title: "The Mirror's Reward", prompt: `The Mirror of Truth revealing a beautiful vision to ${CHARACTERS.sirJames}. The small 5-year-old boy watches in wonder. ${CHARACTERS.claude} sees it too. Spectacular magical display over the lake.` },
        { scene: 7, title: "Self-Acceptance", prompt: `${CHARACTERS.sirJames} smiling at his reflection with newfound self-acceptance. The small 5-year-old boy waves at himself. ${CHARACTERS.claude} wags tail at his own reflection. Warm, happy atmosphere.` },
        { scene: 8, title: "Leaving Wiser", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} walking away from the Mirror Lake at sunset. The small 5-year-old boy looks back with gratitude. Beautiful reflection of sunset on water.` }
    ],
    7: [
        { scene: 1, title: "The Night Sky", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} lying on a grassy hill gazing up at a spectacular starry night sky. The small 5-year-old boy points at stars. Magical constellations visible, peaceful night scene.` },
        { scene: 2, title: "The Wishing Star", prompt: `${CHARACTERS.sirJames} spotting an especially bright wishing star. The small 5-year-old boy's eyes go wide with wonder. ${CHARACTERS.claude} looks up too. Star seems to twinkle just for them.` },
        { scene: 3, title: "Making a Wish", prompt: `${CHARACTERS.sirJames} closing his eyes tight, hands clasped, making a heartfelt wish. The small 5-year-old boy concentrates with all his might. ${CHARACTERS.claude} closes eyes too. Magical starlight surrounds them.` },
        { scene: 4, title: "Star Responds", prompt: `The wishing star descending closer, glowing warmly near ${CHARACTERS.sirJames}. The small 5-year-old boy reaches up toward it. ${CHARACTERS.claude} watches amazed. Magical stardust falls gently.` },
        { scene: 5, title: "Dream Vision", prompt: `${CHARACTERS.sirJames} seeing a beautiful vision of his dreams in the starlight. The small 5-year-old boy smiles at what he sees. ${CHARACTERS.claude} sees happy visions too. Dreamy, magical atmosphere.` },
        { scene: 6, title: "Star's Message", prompt: `The wishing star forming words of encouragement in the sky for ${CHARACTERS.sirJames}. The small 5-year-old boy reads them with hope. ${CHARACTERS.claude} barks happily. Magical sky writing.` },
        { scene: 7, title: "Stardust Gift", prompt: `${CHARACTERS.sirJames} catching magical stardust in his small cupped hands. The small 5-year-old boy's face glows with wonder. ${CHARACTERS.claude} has stardust on his nose. Magical sparkles everywhere.` },
        { scene: 8, title: "Dreams to Chase", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} walking toward the horizon at dawn, inspired by their wishes. The small 5-year-old boy walks with purpose. Beautiful sunrise, hopeful atmosphere.` }
    ],
    8: [
        { scene: 1, title: "The River of Stars", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} discovering a magical river that flows with starlight. The small 5-year-old boy kneels at the glowing water's edge. Mystical nighttime forest setting.` },
        { scene: 2, title: "Creatures in Need", prompt: `${CHARACTERS.sirJames} finding small magical creatures (baby unicorn, tiny phoenix) who need help crossing the river. The small 5-year-old boy looks concerned for them. ${CHARACTERS.claude} sniffs them gently.` },
        { scene: 3, title: "Building Together", prompt: `${CHARACTERS.sirJames} and forest animals working together to build a bridge. The small 5-year-old boy carries small logs. ${CHARACTERS.claude} helps. Teamwork scene, magical helpers.` },
        { scene: 4, title: "Kindness Shown", prompt: `${CHARACTERS.sirJames} gently carrying a tiny injured creature across the completed bridge. The small 5-year-old boy cradles it carefully. ${CHARACTERS.claude} walks protectively beside. Tender moment.` },
        { scene: 5, title: "The River's Magic", prompt: `The River of Stars glowing brighter in response to ${CHARACTERS.sirJames}'s kindness. The small 5-year-old boy watches in amazement. ${CHARACTERS.claude} and creatures celebrate. Magical light show.` },
        { scene: 6, title: "New Friends", prompt: `${CHARACTERS.sirJames} surrounded by grateful magical creatures who want to be his friends. The small 5-year-old boy laughs as they nuzzle him. ${CHARACTERS.claude} plays with baby unicorn. Joyful scene.` },
        { scene: 7, title: "Community Celebration", prompt: `${CHARACTERS.sirJames} at a magical celebration by the river with all the creatures. The small 5-year-old boy dances happily. ${CHARACTERS.claude} howls joyfully. Festive magical atmosphere.` },
        { scene: 8, title: "Bonds of Friendship", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} waving goodbye to their new friends at sunrise. The small 5-year-old boy promises to return. Emotional but happy farewell scene.` }
    ],
    9: [
        { scene: 1, title: "The Moonbeam Path", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} following a magical path made of moonbeams through an enchanted forest. The small 5-year-old boy steps carefully on the glowing path. Mystical night scene.` },
        { scene: 2, title: "Forest Gathering", prompt: `${CHARACTERS.sirJames} arriving at a magical clearing where woodland creatures are gathering for a celebration. The small 5-year-old boy looks around in wonder. ${CHARACTERS.claude} greets animal friends.` },
        { scene: 3, title: "The Celebration Begins", prompt: `${CHARACTERS.sirJames} joining woodland creatures in a moonlit dance. The small 5-year-old boy holds hands with friendly fairies. ${CHARACTERS.claude} dances too. Magical celebration atmosphere.` },
        { scene: 4, title: "Sharing Stories", prompt: `${CHARACTERS.sirJames} sitting in a circle with creatures, sharing adventure stories. The small 5-year-old boy gestures excitedly as he tells his tale. ${CHARACTERS.claude} acts out parts. Cozy campfire setting.` },
        { scene: 5, title: "The Moon's Blessing", prompt: `The full moon shining a special beam of light on ${CHARACTERS.sirJames}. The small 5-year-old boy looks up with reverence. ${CHARACTERS.claude} and creatures watch in awe. Magical blessing scene.` },
        { scene: 6, title: "Gifts Exchanged", prompt: `${CHARACTERS.sirJames} exchanging small meaningful gifts with woodland friends. The small 5-year-old boy gives and receives with joy. ${CHARACTERS.claude} gets a flower crown. Heartwarming scene.` },
        { scene: 7, title: "Claude's Honor", prompt: `${CHARACTERS.claude} receiving a special medal from the moon spirits while ${CHARACTERS.sirJames} watches proudly. The small 5-year-old boy claps for his dog. Magical medal ceremony.` },
        { scene: 8, title: "Dawn Farewell", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} leaving the celebration as dawn breaks. The small 5-year-old boy carries precious memories. Creatures wave goodbye. Beautiful sunrise through trees.` }
    ],
    10: [
        { scene: 1, title: "The Journey Home", prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} walking on a familiar path back toward home. The small 5-year-old boy recognizes landmarks with joy. Castle visible in distance. Warm afternoon light.` },
        { scene: 2, title: "Gramps's Welcome", prompt: `${CHARACTERS.gramps} opening his arms wide as ${CHARACTERS.sirJames} runs to hug him. The small 5-year-old boy's face shows pure joy. ${CHARACTERS.claude} bounds around them. Emotional reunion at cottage.` },
        { scene: 3, title: "Showing the Treasures", prompt: `${CHARACTERS.sirJames} showing ${CHARACTERS.gramps} all the magical items collected on the journey. The small 5-year-old boy presents each one proudly. ${CHARACTERS.claude} wags tail. Cozy cottage interior.` },
        { scene: 4, title: "By the Fireplace", prompt: `${CHARACTERS.sirJames} sitting on ${CHARACTERS.gramps}'s lap by a warm fireplace, telling adventure stories. The small 5-year-old boy gestures animatedly. ${CHARACTERS.claude} lies at their feet. Warm, cozy scene.` },
        { scene: 5, title: "Gramps's Pride", prompt: `${CHARACTERS.gramps} looking at ${CHARACTERS.sirJames} with immense pride and love. The small 5-year-old boy beams up at his grandfather. ${CHARACTERS.claude} between them. Emotional, loving moment.` },
        { scene: 6, title: "The Knight's Medal", prompt: `${CHARACTERS.gramps} pinning a special knight's medal on ${CHARACTERS.sirJames}'s tunic. The small 5-year-old boy stands tall and proud. ${CHARACTERS.claude} barks celebration. Ceremonial moment.` },
        { scene: 7, title: "Looking at Stars Together", prompt: `${CHARACTERS.sirJames}, ${CHARACTERS.gramps}, and ${CHARACTERS.claude} sitting outside looking at stars together. The small 5-year-old boy points at constellations. Peaceful night, warm family moment.` },
        { scene: 8, title: "The End and New Beginning", prompt: `${CHARACTERS.sirJames} tucked into bed by ${CHARACTERS.gramps}, ${CHARACTERS.claude} curled at his feet. The small 5-year-old boy smiles sleepily. Cozy bedroom, moonlight through window. "The End" feeling but also promise of more adventures.` }
    ]
};

async function generateImage(prompt, outputPath) {
    const fullPrompt = `${prompt}\n\n${STYLE}`;
    
    console.log(`\n📝 Generating: ${path.basename(path.dirname(path.dirname(outputPath)))}/${path.basename(outputPath)}`);
    
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
    console.log('🎨 Sir James BATCH Scene Image Regenerator');
    console.log('='.repeat(60));
    console.log('⚠️  CRITICAL: Sir James is a 5-YEAR-OLD BOY - NOT A TEENAGER!');
    console.log('📖 Processing Chapters 3-10 (64 images)');
    console.log('💰 Estimated cost: ~$5.12');
    console.log('⏱️  Estimated time: 30-40 minutes');
    console.log('='.repeat(60));
    
    let totalGenerated = 0;
    let totalFailed = 0;
    
    for (const [chapterNum, scenes] of Object.entries(ALL_CHAPTERS)) {
        const chapterFolder = parseInt(chapterNum) < 10 ? `chapter0${chapterNum}` : `chapter${chapterNum}`;
        const outputDir = path.join(__dirname, '..', 'public-book002', chapterFolder, 'images');
        const backupDir = path.join(outputDir, 'backup');
        
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📖 CHAPTER ${chapterNum}: ${scenes.length} scenes`);
        console.log('='.repeat(60));
        
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
            }
            
            try {
                await generateImage(scene.prompt, outputPath);
                totalGenerated++;
                
                // Rate limit - wait 2 seconds between requests
                await new Promise(r => setTimeout(r, 2000));
            } catch (error) {
                console.error(`   ❌ Failed: ${error.message}`);
                totalFailed++;
            }
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 BATCH REGENERATION COMPLETE!');
    console.log(`✅ Generated: ${totalGenerated} images`);
    console.log(`❌ Failed: ${totalFailed} images`);
    console.log(`💰 Total cost: ~$${(totalGenerated * 0.08).toFixed(2)}`);
    console.log('='.repeat(60));
}

main().catch(console.error);
