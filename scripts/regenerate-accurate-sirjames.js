#!/usr/bin/env node
/**
 * ACCURATE SIR JAMES REGENERATION
 * Based on REAL reference photos provided by user
 * 
 * Sir James is a REAL 5-year-old boy with:
 * - Short sandy/light brown hair
 * - Big bright blue-green eyes  
 * - Round chubby cheeks
 * - Small button nose
 * - Missing baby teeth smile
 * - Very small 5-year-old proportions
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ACCURATE CHARACTER BASED ON REAL PHOTOS
const SIR_JAMES = `a 5-year-old little boy with short sandy-brown hair, big bright blue-green eyes, round chubby cheeks, small button nose, sweet innocent smile showing small baby teeth, very small child proportions (about 3.5 feet tall), wearing a royal blue medieval tunic with silver Celtic knotwork trim and a brown leather belt, brown boots`;

const CLAUDE_DOG = `a Redbone Coonhound dog (sleek deep reddish-brown coat, long droopy floppy ears that hang past the jaw, soulful dark brown eyes, black nose, athletic hound body, wearing a blue collar with silver heart tag)`;

const GRAMPS = `a kind elderly grandfather with full white beard, warm twinkling blue eyes, gentle smile, wearing a forest-green tunic`;

const KING_ARTHUR = `a noble king with golden crown, purple royal robes, kind fatherly expression`;

const STYLE = `
STYLE: 3D Pixar/Disney animation, bright cheerful colors, soft warm lighting, child-friendly, magical whimsical atmosphere.
CRITICAL: The boy must look exactly 5 years old - kindergarten age, very small, chubby baby face, innocent expression.
NO TEXT in the image.
`;

// ALL 80 SCENES WITH ACCURATE PROMPTS
const ALL_SCENES = {
    1: [
        { scene: 1, prompt: `${SIR_JAMES} standing in a grand castle throne room before ${KING_ARTHUR} on a golden throne. The small 5-year-old boy looks up bravely. ${CLAUDE_DOG} sits loyally beside him. Tall stained glass windows, royal banners, polished stone floors. ${STYLE}` },
        { scene: 2, prompt: `${SIR_JAMES} in a sunny castle courtyard as ${CLAUDE_DOG} bounds toward him with tail wagging. The small 5-year-old opens his arms joyfully. Castle walls, colorful flowers, morning sunlight, butterflies. ${STYLE}` },
        { scene: 3, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} in a cozy castle room gathering adventure supplies. The small 5-year-old checks a rolled map and golden compass. Warm interior lighting, wooden table with gear. ${STYLE}` },
        { scene: 4, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} at massive castle gates opening to reveal beautiful landscape. The small 5-year-old looks out with wonder. Dramatic sunlight streaming through gates. ${STYLE}` },
        { scene: 5, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} walking down a winding cobblestone path away from castle. The small 5-year-old points at beautiful sunrise. Rolling green hills, wildflowers, golden morning light. ${STYLE}` },
        { scene: 6, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} walking through mysterious forest with ancient towering trees. The small 5-year-old stays close to Claude. Dappled light, moss-covered trees, mystical atmosphere. ${STYLE}` },
        { scene: 7, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} on a grassy hilltop looking at majestic purple mountains. The small 5-year-old points at distant peaks. Epic panorama, sunset colors, wind in hair. ${STYLE}` },
        { scene: 8, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} at cozy campsite beside gentle stream at dusk. The small 5-year-old studies treasure map by firelight. Small tent, stars appearing, peaceful atmosphere. ${STYLE}` }
    ],
    2: [
        { scene: 1, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} discovering a sparkling waterfall with rainbow in misty spray. The small 5-year-old points excitedly at hidden cave behind water. Enchanted forest, crystal clear water, magical sparkles. ${STYLE}` },
        { scene: 2, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} inside magical crystal cavern meeting a tall shimmering Crystal Guardian made of crystals. The small 5-year-old introduces himself bravely. Blue glow, rainbow reflections. ${STYLE}` },
        { scene: 3, prompt: `${SIR_JAMES} surrounded by floating crystals of every color that glow and hum. The small 5-year-old reaches thoughtfully to touch one. ${CLAUDE_DOG} nuzzles his hand. Mystical chamber. ${STYLE}` },
        { scene: 4, prompt: `${SIR_JAMES} approaching magnificent crystal throne with glowing Crystal of Truth. The small 5-year-old's face shows awe. ${CLAUDE_DOG} watches proudly. Crystal begins glowing brighter. ${STYLE}` },
        { scene: 5, prompt: `${SIR_JAMES} using glowing crystal to light way for small lost cave creatures. The small 5-year-old guides them kindly. ${CLAUDE_DOG} helps herd them. Dark tunnel with warm glow. ${STYLE}` },
        { scene: 6, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} crossing transparent crystal bridge over golden glowing river. The small 5-year-old walks bravely. Each step rings like bell. Ethereal lighting. ${STYLE}` },
        { scene: 7, prompt: `${SIR_JAMES} before ancient cave paintings of noble knights. The small 5-year-old traces paintings gently. ${CLAUDE_DOG} sits beside him. Glowing paintings, reverent atmosphere. ${STYLE}` },
        { scene: 8, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} emerging from crystal cavern into brilliant sunset. The small 5-year-old holds Crystal of Truth proudly. Sky in oranges and golds, rainbow arcing. ${STYLE}` }
    ],
    3: [
        { scene: 1, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} on misty mountain discovering friendly golden dragon resting on rocks. The small 5-year-old approaches bravely. Dragon has kind eyes. Warm sunlight. ${STYLE}` },
        { scene: 2, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} at dragon's cave with glowing golden runes. The small 5-year-old listens to riddle. Mystical atmosphere, glowing symbols. ${STYLE}` },
        { scene: 3, prompt: `${SIR_JAMES} sitting in mountain meadow of wildflowers, thinking deeply. ${CLAUDE_DOG} rests head on the small 5-year-old's lap. Peaceful, contemplative mood. ${STYLE}` },
        { scene: 4, prompt: `${SIR_JAMES} standing before wise dragon at sunset, announcing riddle answer. The small 5-year-old shows triumph. ${CLAUDE_DOG} wags tail. Sky in oranges and purples. ${STYLE}` },
        { scene: 5, prompt: `Wise dragon presenting glowing golden scale to ${SIR_JAMES}. The small 5-year-old receives it with wonder. ${CLAUDE_DOG} watches. Scale glows with inner light. ${STYLE}` },
        { scene: 6, prompt: `${SIR_JAMES} with hand over heart making vow to dragon. The small 5-year-old looks determined. ${CLAUDE_DOG} sits proudly. Sunset light, solemn moment. ${STYLE}` },
        { scene: 7, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} walking down mountain path, golden scale glowing in pocket. The small 5-year-old walks thoughtfully. Beautiful vista, golden hour. ${STYLE}` },
        { scene: 8, prompt: `${SIR_JAMES} running toward ${GRAMPS} at cottage garden gate. The small 5-year-old's face shows joy. ${CLAUDE_DOG} bounds alongside. Sunset, warm reunion. ${STYLE}` }
    ],
    4: [
        { scene: 1, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} discovering ancient wall covered in roses with hidden gate and golden key. The small 5-year-old points at key. Enchanted forest, magical flowers. ${STYLE}` },
        { scene: 2, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} stepping into magnificent magical garden with glowing flowers and crystal fountain. The small 5-year-old gasps in wonder. Ethereal beauty. ${STYLE}` },
        { scene: 3, prompt: `${SIR_JAMES} kneeling beside sad wilting rose. The small 5-year-old touches drooping petals gently. ${CLAUDE_DOG} nudges toward fountain. Caring expression. ${STYLE}` },
        { scene: 4, prompt: `${SIR_JAMES} carrying sparkling water cupped in small hands from fountain to rose. The small 5-year-old concentrates hard. ${CLAUDE_DOG} walks beside. Magic sparkles. ${STYLE}` },
        { scene: 5, prompt: `All magical flowers turning toward ${SIR_JAMES}, petals opening in gratitude. The small 5-year-old smiles warmly. ${CLAUDE_DOG} howls happily. Garden singing with joy. ${STYLE}` },
        { scene: 6, prompt: `${SIR_JAMES} meeting Garden Keeper made of flower petals and dew. The small 5-year-old bows respectfully. ${CLAUDE_DOG} sits attentively. Ethereal magical being. ${STYLE}` },
        { scene: 7, prompt: `Garden Keeper placing glowing star-like seed in ${SIR_JAMES}'s cupped palm. The small 5-year-old looks with wonder. ${CLAUDE_DOG} watches. Soft golden glow. ${STYLE}` },
        { scene: 8, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} leaving garden at sunset as flowers wave farewell. The small 5-year-old waves back. Magical seed glowing in pocket. ${STYLE}` }
    ],
    5: [
        { scene: 1, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} climbing winding mountain path with wind through ancient trees. The small 5-year-old looks up excitedly. Adventurous atmosphere. ${STYLE}` },
        { scene: 2, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} gazing at magnificent ancient oak tree with glowing windows like stars. The small 5-year-old points excitedly. Majestic tree library. ${STYLE}` },
        { scene: 3, prompt: `${SIR_JAMES} inside tree library meeting beautiful Wise Owl with golden eyes on golden branch. The small 5-year-old bows respectfully. ${CLAUDE_DOG} sits. Books everywhere. ${STYLE}` },
        { scene: 4, prompt: `${SIR_JAMES} sitting with Wise Owl as magical books float around them. The small 5-year-old asks earnestly. ${CLAUDE_DOG} lies beside. Intimate learning moment. ${STYLE}` },
        { scene: 5, prompt: `Wise Owl presenting glowing golden Book of Mistakes to ${SIR_JAMES}. The small 5-year-old looks with curiosity. ${CLAUDE_DOG} watches. Book glows from within. ${STYLE}` },
        { scene: 6, prompt: `Wise Owl gesturing toward ${CLAUDE_DOG} while ${SIR_JAMES} watches with new understanding. The small 5-year-old appreciates his dog. Warm library setting. ${STYLE}` },
        { scene: 7, prompt: `Wise Owl presenting glowing golden feather to ${SIR_JAMES}. The small 5-year-old receives with gratitude. ${CLAUDE_DOG} wags tail. Magical gift moment. ${STYLE}` },
        { scene: 8, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} descending mountain at beautiful sunrise. The small 5-year-old walks with quiet confidence. World painted gold and pink. ${STYLE}` }
    ],
    6: [
        { scene: 1, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} climbing winding stairs in old tower, dust dancing in golden light beams. The small 5-year-old discovers ornate mirror. Mysterious atmosphere. ${STYLE}` },
        { scene: 2, prompt: `${SIR_JAMES} before Mirror of Truth glowing with silvery light. The small 5-year-old looks intrigued. ${CLAUDE_DOG} watches. Shimmering reflections, mystical. ${STYLE}` },
        { scene: 3, prompt: `${SIR_JAMES} looking into Mirror of Truth, reflection glowing with warm golden light. The small 5-year-old looks surprised and pleased. ${CLAUDE_DOG} watches. ${STYLE}` },
        { scene: 4, prompt: `${CLAUDE_DOG} looking into Mirror of Truth, reflection showing glowing ruby heart. ${SIR_JAMES} claps with delight. The small 5-year-old praises his friend. ${STYLE}` },
        { scene: 5, prompt: `${SIR_JAMES} noticing small shadow in mirror reflection, looking concerned but thoughtful. The small 5-year-old touches chest. ${CLAUDE_DOG} nuzzles supportively. ${STYLE}` },
        { scene: 6, prompt: `${SIR_JAMES} placing small hand on Mirror of Truth glass, shadow shrinking as golden light grows. The small 5-year-old accepts truth. ${CLAUDE_DOG} stands proudly. ${STYLE}` },
        { scene: 7, prompt: `Small ornate hand mirror floating from great Mirror toward ${SIR_JAMES}. The small 5-year-old reaches to receive gift. ${CLAUDE_DOG} watches. Sparkles, gift-giving. ${STYLE}` },
        { scene: 8, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} descending tower stairs at sunset. The small 5-year-old carries mirror gift. World painted gold and pink through windows. ${STYLE}` }
    ],
    7: [
        { scene: 1, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} discovering hidden tower with magical spiral staircase, glowing runes lighting way. The small 5-year-old points at symbols. Mystical tower. ${STYLE}` },
        { scene: 2, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} at tower top gazing through open ceiling at spectacular starry sky. The small 5-year-old gasps, reaching toward stars. Breathtaking night. ${STYLE}` },
        { scene: 3, prompt: `Legendary Wishing Star - glowing silver orb - floating before ${SIR_JAMES}. The small 5-year-old looks up in awe. ${CLAUDE_DOG} amazed. Ethereal glow. ${STYLE}` },
        { scene: 4, prompt: `${SIR_JAMES} with eyes closed, hands clasped, making heartfelt wish to Wishing Star. The small 5-year-old wishes sincerely. ${CLAUDE_DOG} closes eyes too. Star glows. ${STYLE}` },
        { scene: 5, prompt: `Wishing Star creating glowing images in air showing ${SIR_JAMES} helping others. The small 5-year-old watches hopefully. ${CLAUDE_DOG} sees visions. Magical projections. ${STYLE}` },
        { scene: 6, prompt: `Wishing Star showing ${CLAUDE_DOG}'s dream - always by ${SIR_JAMES}'s side. The small 5-year-old hugs Claude emotionally. Dog licks face. Touching moment. ${STYLE}` },
        { scene: 7, prompt: `Wishing Star leaving glowing crystal in ${SIR_JAMES}'s cupped hands before rising to sky. The small 5-year-old thanks star. ${CLAUDE_DOG} watches. Stardust sparkles. ${STYLE}` },
        { scene: 8, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} descending spiral staircase, star crystal lighting way. The small 5-year-old walks thoughtfully. Wishing Star twinkles farewell above. ${STYLE}` }
    ],
    8: [
        { scene: 1, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} discovering river flowing with starlight in night forest. The small 5-year-old kneels at glowing water's edge amazed. Cosmic sparkles. ${STYLE}` },
        { scene: 2, prompt: `${SIR_JAMES} kneeling beside sad fireflies with dim fading lights by starlit river. The small 5-year-old looks concerned. ${CLAUDE_DOG} sniffs gently. Sympathetic scene. ${STYLE}` },
        { scene: 3, prompt: `${SIR_JAMES} looking between glowing River of Stars and sad fireflies, idea forming. The small 5-year-old's face lights up. ${CLAUDE_DOG} barks encouragingly. ${STYLE}` },
        { scene: 4, prompt: `${SIR_JAMES} cupping glowing starlight water in small hands, light swirling between fingers. The small 5-year-old offers to fireflies. ${CLAUDE_DOG} watches. Magical healing. ${STYLE}` },
        { scene: 5, prompt: `All fireflies glowing brightly again, dancing around ${SIR_JAMES} and ${CLAUDE_DOG}. The small 5-year-old laughs with joy. Triumphant, restored lights. ${STYLE}` },
        { scene: 6, prompt: `${SIR_JAMES}, ${CLAUDE_DOG}, and procession of glowing fireflies traveling through night forest following River of Stars. The small 5-year-old leads bravely. ${STYLE}` },
        { scene: 7, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} arriving at meadow where thousands of fireflies dance - fireflies' home. The small 5-year-old watches joyful reunion. Magical meadow. ${STYLE}` },
        { scene: 8, prompt: `Fireflies creating crown of living light, placing on ${SIR_JAMES}'s head. The small 5-year-old thanks them. ${CLAUDE_DOG} wags tail. Magical gift, farewell. ${STYLE}` }
    ],
    9: [
        { scene: 1, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} at moonlit amphitheater where magical friends gathered - dragon, owl, garden keeper, fireflies. The small 5-year-old looks delighted. Reunion. ${STYLE}` },
        { scene: 2, prompt: `Glowing moonbeam path appearing before ${SIR_JAMES}, leading to central platform. The small 5-year-old looks in wonder. ${CLAUDE_DOG} nudges forward. Mystical moonlight. ${STYLE}` },
        { scene: 3, prompt: `${SIR_JAMES} walking moonbeam path as magical images of past adventures float around. The small 5-year-old remembers each lesson. ${CLAUDE_DOG} beside. Nostalgic memories. ${STYLE}` },
        { scene: 4, prompt: `${SIR_JAMES} holding magical gifts - dragon scale, owl feather, star crystal - as they glow and rise together. The small 5-year-old amazed. ${CLAUDE_DOG} proud. ${STYLE}` },
        { scene: 5, prompt: `Magical gifts swirling into golden Medal of True Knighthood - heart with star - floating before ${SIR_JAMES}. The small 5-year-old reaches in awe. Triumphant. ${STYLE}` },
        { scene: 6, prompt: `All magical friends celebrating ${SIR_JAMES} - dragon breathing sparkles, fireflies dancing, flowers blooming. The small 5-year-old thanks everyone. ${CLAUDE_DOG} howls. ${STYLE}` },
        { scene: 7, prompt: `Moonlight on ${CLAUDE_DOG} as Medal of Loyal Friendship appears around neck. ${SIR_JAMES} claps proudly. The small 5-year-old beams. Dog's tail wags. ${STYLE}` },
        { scene: 8, prompt: `${SIR_JAMES} standing under full moon, Medal glowing on heart, making promise. The small 5-year-old looks determined. ${CLAUDE_DOG} with medal beside. Peaceful. ${STYLE}` }
    ],
    10: [
        { scene: 1, prompt: `${SIR_JAMES} and ${CLAUDE_DOG} walking familiar path toward home at sunset. The small 5-year-old points at ${GRAMPS} waiting at cottage door. Sky brilliant orange and gold. ${STYLE}` },
        { scene: 2, prompt: `${GRAMPS} with arms open as ${SIR_JAMES} runs into warm embrace. The small 5-year-old hugs grandfather. ${CLAUDE_DOG} dances happily. Loving reunion at cottage. ${STYLE}` },
        { scene: 3, prompt: `${SIR_JAMES} showing ${GRAMPS} glowing Medal of True Knighthood, and Claude's medal. The small 5-year-old beams with pride. Gramps's eyes glisten. ${STYLE}` },
        { scene: 4, prompt: `${SIR_JAMES} by warm fireplace with ${GRAMPS}, telling stories. The small 5-year-old gestures excitedly. ${CLAUDE_DOG} curled at feet. Cozy cottage interior. ${STYLE}` },
        { scene: 5, prompt: `${GRAMPS} speaking wisely by firelight to ${SIR_JAMES}. The small 5-year-old listens intently. ${CLAUDE_DOG} rests peacefully. Warm wisdom moment. ${STYLE}` },
        { scene: 6, prompt: `${SIR_JAMES} standing with hand over heart where medal glows, making solemn promise. The small 5-year-old looks determined. ${CLAUDE_DOG} barks agreement. ${STYLE}` },
        { scene: 7, prompt: `${SIR_JAMES}, ${GRAMPS}, and ${CLAUDE_DOG} at cottage window looking at starry sky, Wishing Star twinkling. The small 5-year-old points at friend in sky. ${STYLE}` },
        { scene: 8, prompt: `${SIR_JAMES} tucked into cozy bed by ${GRAMPS}, ${CLAUDE_DOG} at feet. The small 5-year-old smiles sleepily, medal warm on heart. Moonlight, peaceful ending. ${STYLE}` }
    ]
};

async function generateImage(prompt, outputPath) {
    console.log(`\n📝 Generating: ${path.basename(path.dirname(path.dirname(outputPath)))}/${path.basename(outputPath)}`);
    
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
    const startChapter = parseInt(process.argv[2]) || 1;
    const endChapter = parseInt(process.argv[3]) || 10;
    
    console.log('🎨 ACCURATE SIR JAMES REGENERATION');
    console.log('═'.repeat(60));
    console.log('👦 Sir James: 5yo, sandy-brown hair, blue-green eyes, chubby cheeks');
    console.log('🐕 Claude: Redbone Coonhound, deep red coat, long floppy ears');
    console.log(`📖 Processing Chapters ${startChapter}-${endChapter}`);
    console.log('═'.repeat(60));
    
    let totalGenerated = 0;
    let totalFailed = 0;
    const failedImages = [];
    
    for (let chapterNum = startChapter; chapterNum <= endChapter; chapterNum++) {
        const scenes = ALL_SCENES[chapterNum];
        if (!scenes) continue;
        
        const chapterFolder = chapterNum < 10 ? `chapter0${chapterNum}` : `chapter${chapterNum}`;
        const outputDir = path.join(__dirname, '..', 'public-book002', chapterFolder, 'images');
        
        console.log(`\n${'═'.repeat(60)}`);
        console.log(`📖 CHAPTER ${chapterNum}: ${scenes.length} scenes`);
        console.log('═'.repeat(60));
        
        for (const scene of scenes) {
            const filename = `scene-00${scene.scene}.png`;
            const outputPath = path.join(outputDir, filename);
            
            try {
                await generateImage(scene.prompt, outputPath);
                totalGenerated++;
                await new Promise(r => setTimeout(r, 2500));
            } catch (error) {
                console.error(`   ❌ Failed: ${error.message}`);
                totalFailed++;
                failedImages.push({ chapter: chapterNum, scene: scene.scene, error: error.message });
            }
        }
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log('🎉 REGENERATION COMPLETE!');
    console.log(`✅ Generated: ${totalGenerated} images`);
    console.log(`❌ Failed: ${totalFailed} images`);
    console.log(`💰 Total cost: ~$${(totalGenerated * 0.08).toFixed(2)}`);
    
    if (failedImages.length > 0) {
        console.log('\n⚠️  Failed images:');
        failedImages.forEach(f => console.log(`   - Chapter ${f.chapter} Scene ${f.scene}`));
    }
}

main().catch(console.error);
