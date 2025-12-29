#!/usr/bin/env node
/**
 * FINAL COMPLETE IMAGE REGENERATION - Sir James Adventures Book002
 * 
 * This script reads the ACTUAL scene scripts and generates prompts that MATCH
 * the narrative exactly. Sir James is a 5-YEAR-OLD BOY, Claude is a ROYAL
 * Redbone Coonhound with noble bearing.
 * 
 * Cost: ~$6.40 for 80 images at $0.08 each
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

// ============================================================================
// STRICT CHARACTER DESCRIPTIONS - MUST BE CONSISTENT IN EVERY IMAGE
// ============================================================================

const CHARACTERS = {
    sirJames: `Sir James (a VERY YOUNG 5-year-old boy knight, SMALL child proportions - only 3 feet tall, round chubby baby face, big innocent brown eyes, messy brown hair with a cowlick, rosy cheeks, wearing a royal blue tunic with silver Celtic knotwork trim, brown leather belt with small pouch, brown boots, sometimes carrying a small wooden practice sword)`,
    
    claude: `Claude (a NOBLE Redbone Coonhound of ROYAL BLOODLINE, majestic reddish-brown coat that gleams like polished mahogany, long elegant floppy ears, soulful intelligent brown eyes that show wisdom beyond his years, proud bearing befitting his noble heritage, wearing a royal blue collar with a silver heart-shaped tag engraved with a crown)`,
    
    gramps: `Gramps (a kind elderly grandfather figure with a full white beard, warm twinkling blue eyes, gentle smile with laugh lines, wearing a forest-green tunic with brown leather belt, wise and loving expression)`,
    
    kingArthur: `King Arthur (a noble king with a golden crown, purple royal robes with gold trim, kind fatherly expression, majestic but approachable)`
};

const STYLE = `
STYLE: 3D Pixar/Disney-style animation, bright vibrant colors, soft warm lighting, child-friendly, whimsical and magical.
QUALITY: High detail, cinematic composition, professional illustration quality.
MOOD: Warm, adventurous, magical, age-appropriate for young children (ages 5-8).

CRITICAL REQUIREMENTS:
1. Sir James MUST look like a 5-YEAR-OLD CHILD - very small (3 feet tall), round baby face, chubby cheeks, innocent wide-eyed expression. He is NOT a teenager, NOT a young adult, NOT tall. He is a TINY SMALL CHILD.
2. Claude MUST look like a NOBLE, REGAL Redbone Coonhound - proud posture, intelligent eyes, royal bearing.
3. NO TEXT in the image whatsoever.
4. Characters must be clearly visible and recognizable.
`;

// ============================================================================
// ALL 80 SCENE PROMPTS - MATCHING THE ACTUAL SCRIPTS
// ============================================================================

const ALL_SCENES = {
    // CHAPTER 1: The Quest Begins
    1: [
        {
            scene: 1,
            title: "The Quest Begins",
            // Script: "In the great hall of Castle Brightstone, young Sir James stood before King Arthur himself."
            prompt: `${CHARACTERS.sirJames} standing in the grand hall of Castle Brightstone before ${CHARACTERS.kingArthur} who sits on a golden throne. The tiny 5-year-old boy looks up bravely at the king. ${CHARACTERS.claude} sits loyally beside the small child. Magnificent throne room with tall stained glass windows casting colorful light, royal banners, polished stone floors.`
        },
        {
            scene: 2,
            title: "Meeting Claude",
            // Script: "As Sir James prepared to leave, a familiar bark echoed through the courtyard."
            prompt: `${CHARACTERS.sirJames} in a sunny castle courtyard, turning with joy as ${CHARACTERS.claude} bounds toward him with tail wagging excitedly. The tiny 5-year-old boy opens his arms to greet his noble dog friend. Castle walls in background, colorful flowers, morning sunlight, butterflies in the air. Claude's bark echoes through the scene.`
        },
        {
            scene: 3,
            title: "Preparation",
            // Script: "Together, they gathered everything they would need for their adventure."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} in a cozy castle room gathering supplies for their adventure. The tiny 5-year-old boy checks items: a rolled map, a small bag of food, and a golden compass. Claude watches attentively. Warm interior lighting, adventure gear spread on a wooden table.`
        },
        {
            scene: 4,
            title: "Castle Gates",
            // Script: "The great castle gates creaked open, revealing the world beyond."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} standing at the massive castle gates as they slowly open, revealing a beautiful landscape beyond. The tiny 5-year-old boy looks out with wonder and determination. ${CHARACTERS.claude} stands alert beside him. Dramatic lighting as sunlight streams through the opening gates, adventure awaits.`
        },
        {
            scene: 5,
            title: "First Steps",
            // Script: "Their first steps took them down a winding path away from everything they knew."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} walking down a winding cobblestone path away from the castle. The tiny 5-year-old boy points excitedly at a beautiful sunrise. Castle visible in the background. Rolling green hills, wildflowers along the path, golden morning light, hopeful atmosphere.`
        },
        {
            scene: 6,
            title: "Forest Trail",
            // Script: "The forest trail was dark and mysterious, with ancient trees towering overhead."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} walking through a mysterious forest with ancient towering trees. The tiny 5-year-old boy stays close to Claude, looking around cautiously but bravely. Dappled light filtering through leaves, magical atmosphere, moss-covered trees, mystical forest setting.`
        },
        {
            scene: 7,
            title: "Mountain View",
            // Script: "From the hilltop, they could see mountains stretching to the horizon."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} standing on a grassy hilltop, looking out at majestic purple mountains stretching to the horizon. The tiny 5-year-old boy points toward the distant peaks. Epic panoramic landscape, sunset colors of orange and pink, wind gently blowing his hair, sense of adventure.`
        },
        {
            scene: 8,
            title: "Campsite Evening",
            // Script: "As stars began to twinkle, they made camp beside a gentle stream."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} at a cozy campsite beside a gentle stream at dusk. The tiny 5-year-old boy studies a treasure map by warm firelight. ${CHARACTERS.claude} curled up beside him contentedly. Small tent in background, stars beginning to appear in purple sky, peaceful and safe atmosphere.`
        }
    ],

    // CHAPTER 2: The Butterfly Garden (Crystal Cavern)
    2: [
        {
            scene: 1,
            title: "The Hidden Waterfall",
            // Script: "Following the winding forest path, Sir James and Claude discovered something magical - a sparkling waterfall that painted rainbows in the misty air."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} discovering a magnificent sparkling waterfall in an enchanted forest. The tiny 5-year-old boy points excitedly at a rainbow forming in the misty spray. ${CHARACTERS.claude} stands alert, tail wagging, spotting a hidden cave entrance behind the curtain of water. Crystal clear water cascading over mossy rocks, magical light rays and sparkles.`
        },
        {
            scene: 2,
            title: "The Crystal Guardian",
            // Script: "Inside the cavern, crystals glowed with a soft blue light. And there, standing tall and shimmering, was the Crystal Guardian."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} inside a magical crystal cavern meeting the Crystal Guardian - a tall, gentle, translucent being made of shimmering crystals. The tiny 5-year-old boy looks up in wonder, introducing himself bravely. Crystals of various colors line the cave walls casting rainbow reflections, ethereal blue glow illuminates the scene.`
        },
        {
            scene: 3,
            title: "The Crystal Puzzle",
            // Script: "Crystals of every color floated gently in the air around them. Each one hummed with its own special song."
            prompt: `${CHARACTERS.sirJames} surrounded by floating crystals of every color that glow and hum with magical energy. The tiny 5-year-old boy reaches out thoughtfully to touch one. ${CHARACTERS.claude} nuzzles his hand encouragingly. Magical chamber with crystals suspended in air, each glowing a different color, mystical atmosphere.`
        },
        {
            scene: 4,
            title: "The Crystal of Truth",
            // Script: "In the heart of the cavern stood a magnificent throne made entirely of crystals, and upon it rested a glowing gem."
            prompt: `${CHARACTERS.sirJames} approaching a magnificent crystal throne with a brilliant glowing gem - the Crystal of Truth - resting upon it. The tiny 5-year-old boy's face shows awe and wonder. ${CHARACTERS.claude} watches proudly. The crystal begins to glow brighter, recognizing the kindness in the boy's heart. Majestic crystal chamber setting.`
        },
        {
            scene: 5,
            title: "Helping the Lost Creatures",
            // Script: "Deeper in the cavern, Sir James heard tiny voices calling for help. Small cave creatures had lost their way in the dark."
            prompt: `${CHARACTERS.sirJames} using his glowing crystal to light the way for small lost cave creatures (tiny glowing sprites, baby crystal creatures). The tiny 5-year-old boy gently guides them with kindness. ${CHARACTERS.claude} helps herd them gently. Dark tunnel illuminated by the crystal's warm glow, grateful little creatures following.`
        },
        {
            scene: 6,
            title: "The Crystal Bridge",
            // Script: "Before them stretched a bridge made of pure crystal, spanning a river that glowed with soft golden light."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} crossing a magnificent transparent bridge made of pure crystal over a river that glows with soft golden light. The tiny 5-year-old boy walks bravely forward, one step at a time. Each step rings like a gentle bell. Ethereal blue and gold lighting, magical underground river below.`
        },
        {
            scene: 7,
            title: "The Ancient Knights",
            // Script: "On the cavern walls, ancient paintings told stories of knights who had come before."
            prompt: `${CHARACTERS.sirJames} standing before ancient cave paintings that depict stories of noble knights from long ago. The tiny 5-year-old boy traces the paintings gently with his finger, feeling connected to the brave knights before him. ${CHARACTERS.claude} sits attentively beside him. Glowing cave paintings, reverent atmosphere.`
        },
        {
            scene: 8,
            title: "Emerging Victorious",
            // Script: "As Sir James and Claude emerged from the crystal cavern, the setting sun painted the sky in brilliant oranges and golds."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} emerging triumphantly from the crystal cavern into brilliant sunset light. The tiny 5-year-old boy holds up the Crystal of Truth proudly, face glowing with joy. ${CHARACTERS.claude} bounds joyfully beside him. Beautiful forest landscape visible, sky painted in oranges and golds, rainbow arcing across the sky.`
        }
    ],

    // CHAPTER 3: The Dragon's Riddle
    3: [
        {
            scene: 1,
            title: "Meeting the Dragon",
            // Script: "High atop the misty mountain, Sir James and Claude discovered something extraordinary - a wise old dragon resting on sun-warmed rocks."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} on a misty mountain plateau discovering a wise, friendly old dragon with golden scales resting peacefully on sun-warmed rocks. The tiny 5-year-old boy approaches bravely, introducing himself. The dragon has kind golden eyes and a gentle smile. Misty mountain setting, warm sunlight.`
        },
        {
            scene: 2,
            title: "The First Riddle",
            // Script: "The dragon led them to a cave entrance where ancient runes glowed with soft golden light."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} at a dragon's cave entrance where ancient runes glow with soft golden light on the stone walls. The tiny 5-year-old boy listens thoughtfully as the dragon poses a riddle. Mystical atmosphere, glowing symbols, the wise dragon's silhouette visible.`
        },
        {
            scene: 3,
            title: "Thinking Together",
            // Script: "Sir James sat in a meadow of wildflowers, thinking deeply about the riddle. Claude rested his head on James's lap."
            prompt: `${CHARACTERS.sirJames} sitting in a beautiful mountain meadow full of colorful wildflowers, thinking deeply with finger on chin. ${CHARACTERS.claude} rests his noble head on the tiny boy's lap lovingly. The 5-year-old concentrates on solving the riddle. Peaceful meadow, soft afternoon light, contemplative mood.`
        },
        {
            scene: 4,
            title: "The Answer",
            // Script: "Sir James returned to the dragon as the sun painted the sky in brilliant oranges and purples."
            prompt: `${CHARACTERS.sirJames} standing confidently before the wise dragon at sunset, announcing his answer to the riddle. The tiny 5-year-old boy's face shows triumph and understanding. ${CHARACTERS.claude} wags his tail proudly. Dragon's eyes sparkle with delight. Sky painted in brilliant oranges and purples.`
        },
        {
            scene: 5,
            title: "The Dragon's Gift",
            // Script: "The dragon reached beneath his wing and pulled out a single golden scale that glowed with inner light."
            prompt: `The wise dragon presenting a single glowing golden scale to ${CHARACTERS.sirJames}. The tiny 5-year-old boy receives it with wonder and gratitude, cupping it carefully in his small hands. ${CHARACTERS.claude} watches the magical moment. The scale glows with warm inner light, magical sparkles surround them.`
        },
        {
            scene: 6,
            title: "A Promise Made",
            // Script: "Before leaving, Sir James placed his hand over his heart and looked up at the great dragon."
            prompt: `${CHARACTERS.sirJames} standing solemnly with his small hand over his heart, making a vow to the wise dragon. The tiny 5-year-old boy looks up with determination and sincerity. ${CHARACTERS.claude} sits proudly beside him. The dragon nods wisely. Sunset light, solemn and meaningful moment.`
        },
        {
            scene: 7,
            title: "The Journey Down",
            // Script: "As Sir James and Claude made their way down the mountain, the golden scale glowed softly in his pocket."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} walking down a mountain path, the golden dragon scale glowing softly in the tiny boy's pocket. The 5-year-old walks thoughtfully, having learned about honor. Beautiful mountain vista, golden hour lighting, peaceful descent.`
        },
        {
            scene: 8,
            title: "Gramps's Pride",
            // Script: "As they reached home, Gramps was waiting at the garden gate, his eyes twinkling with knowing pride."
            prompt: `${CHARACTERS.sirJames} running toward ${CHARACTERS.gramps} who waits at a cottage garden gate with arms open and eyes twinkling with pride. ${CHARACTERS.claude} bounds alongside the tiny 5-year-old boy. Cozy cottage in background, sunset light, warm family reunion, flowers in the garden.`
        }
    ],

    // CHAPTER 4: The Enchanted Garden
    4: [
        {
            scene: 1,
            title: "The Hidden Gate",
            // Script: "Deep in the forest, Sir James and Claude found an ancient stone wall covered in beautiful roses and flowering vines."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} discovering an ancient stone wall covered in magical roses and flowering vines, with a hidden gate and a golden key hanging from a rose bush. The tiny 5-year-old boy points excitedly at the key. Enchanted forest setting, magical atmosphere, glowing flowers.`
        },
        {
            scene: 2,
            title: "Entering the Garden",
            // Script: "As the gate swung open, Sir James gasped in wonder. The garden was alive with colors he had never seen before!"
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} stepping through the gate into a magnificent magical garden with glowing flowers of impossible colors and a crystal fountain. The tiny 5-year-old boy gasps in wonder, eyes wide. Magical garden alive with color, crystal fountain sparkling, ethereal beauty.`
        },
        {
            scene: 3,
            title: "The Wilting Rose",
            // Script: "In a quiet corner, Sir James noticed a single rose that was wilting, its petals drooping sadly."
            prompt: `${CHARACTERS.sirJames} kneeling beside a sad, wilting rose in a quiet corner of the magical garden, looking concerned. The tiny 5-year-old boy gently touches the drooping petals. ${CHARACTERS.claude} nudges him toward the crystal fountain, showing him the answer. Caring expression, soft lighting.`
        },
        {
            scene: 4,
            title: "The Healing Water",
            // Script: "Sir James cupped the sparkling water from the fountain in his hands and carefully carried it to the wilting rose."
            prompt: `${CHARACTERS.sirJames} carefully carrying sparkling magical water cupped in his small hands from the crystal fountain to the wilting rose. The tiny 5-year-old boy concentrates hard not to spill it. ${CHARACTERS.claude} walks beside him supportively. Water sparkles with healing magic.`
        },
        {
            scene: 5,
            title: "The Garden's Thanks",
            // Script: "Suddenly, all the flowers in the garden turned toward Sir James, their petals opening wide in thanks."
            prompt: `All the magical flowers in the garden turning toward ${CHARACTERS.sirJames}, their petals opening wide in gratitude. The tiny 5-year-old boy smiles warmly, arms spread in welcome. ${CHARACTERS.claude} howls happily. Garden singing with joy, magical transformation, flowers blooming everywhere.`
        },
        {
            scene: 6,
            title: "The Garden Keeper",
            // Script: "From behind the tallest sunflower stepped a gentle figure made of flower petals and morning dew."
            prompt: `${CHARACTERS.sirJames} meeting the Garden Keeper - a gentle fairy-like figure made of flower petals and sparkling morning dew - who steps from behind a tall sunflower. The tiny 5-year-old boy bows respectfully. ${CHARACTERS.claude} sits attentively. Magical being, ethereal beauty, wonder-filled scene.`
        },
        {
            scene: 7,
            title: "A Seed of Kindness",
            // Script: "The Garden Keeper placed a glowing seed in Sir James's palm. It sparkled like a tiny star."
            prompt: `The Garden Keeper placing a glowing magical seed that sparkles like a tiny star into ${CHARACTERS.sirJames}'s small cupped palm. The tiny 5-year-old boy looks at it with wonder, feeling its warmth. ${CHARACTERS.claude} watches the magical gift. Soft golden glow, meaningful moment.`
        },
        {
            scene: 8,
            title: "Carrying Kindness Home",
            // Script: "As Sir James and Claude left the enchanted garden, the flowers waved their petals in farewell."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} leaving the enchanted garden at sunset as all the flowers wave their petals in farewell. The tiny 5-year-old boy waves back with a smile, the magical seed glowing in his pocket. Beautiful sunset, magical farewell, flowers dancing.`
        }
    ],

    // CHAPTER 5: The Wise Owl's Lesson
    5: [
        {
            scene: 1,
            title: "The Mountain Path",
            // Script: "Sir James and Claude climbed the winding mountain path as the wind whispered secrets through the ancient trees."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} climbing a dramatic winding mountain path with wind blowing through ancient trees. The tiny 5-year-old boy looks up excitedly, talking about the wise owl. ${CHARACTERS.claude}'s ears perk up sensing magic ahead. Adventurous atmosphere, mystical trees, mountain vista.`
        },
        {
            scene: 2,
            title: "The Ancient Tree",
            // Script: "At the mountain's peak stood the most magnificent tree Sir James had ever seen - an ancient oak with windows that glowed like stars."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} gazing up at a magnificent ancient oak tree at the mountain peak, with glowing windows like stars and visible books inside. The tiny 5-year-old boy points excitedly at the magical tree library. Majestic tree, starlike windows, mystical atmosphere.`
        },
        {
            scene: 3,
            title: "Meeting the Wise Owl",
            // Script: "Inside the tree was a magnificent library, and perched on a golden branch sat the most beautiful owl Sir James had ever seen."
            prompt: `${CHARACTERS.sirJames} inside the magnificent tree library meeting a beautiful, majestic Wise Owl with golden eyes and silver-tipped feathers, perched on a golden branch. The tiny 5-year-old boy bows respectfully. ${CHARACTERS.claude} sits attentively. Books everywhere, warm golden light, reverent atmosphere.`
        },
        {
            scene: 4,
            title: "The First Question",
            // Script: "Books floated gently around them as the Wise Owl leaned closer to Sir James."
            prompt: `${CHARACTERS.sirJames} sitting with the Wise Owl as magical books float gently around them. The tiny 5-year-old boy asks earnestly how to become wise. ${CHARACTERS.claude} lies beside him. Floating books, magical library interior, intimate learning moment.`
        },
        {
            scene: 5,
            title: "The Book of Mistakes",
            // Script: "The Wise Owl flew to a shelf and returned with a golden book that seemed to glow from within."
            prompt: `The Wise Owl presenting a glowing golden book - the Book of Mistakes - to ${CHARACTERS.sirJames}. The tiny 5-year-old boy looks at it with curiosity and wonder. ${CHARACTERS.claude} watches intently. The book glows from within, magical atmosphere, important lesson moment.`
        },
        {
            scene: 6,
            title: "Learning from Claude",
            // Script: "The Wise Owl looked at Claude with knowing eyes. 'Your companion already understands this lesson.'"
            prompt: `The Wise Owl gesturing toward ${CHARACTERS.claude} while ${CHARACTERS.sirJames} watches with new understanding. The tiny 5-year-old boy looks at his noble dog with appreciation. Claude demonstrates patience and observation, sitting with wise dignity. Warm library setting, moment of realization.`
        },
        {
            scene: 7,
            title: "The Gift of Curiosity",
            // Script: "The Wise Owl plucked a single feather from her wing. It glowed with soft golden light."
            prompt: `The Wise Owl presenting a single glowing golden feather to ${CHARACTERS.sirJames}. The tiny 5-year-old boy receives it with gratitude and wonder. ${CHARACTERS.claude} wags his tail. The feather glows with soft golden light, magical gift, meaningful moment.`
        },
        {
            scene: 8,
            title: "Wisdom Earned",
            // Script: "As Sir James and Claude made their way down the mountain, the sunrise painted the world in gold and pink."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} descending the mountain at beautiful sunrise, the world painted in gold and pink. The tiny 5-year-old boy walks with quiet confidence, owl feather glowing in his pocket. ${CHARACTERS.claude} trots proudly beside him. Peaceful, enlightened atmosphere.`
        }
    ],

    // CHAPTER 6: The Mirror of Truth
    6: [
        {
            scene: 1,
            title: "The Abandoned Tower",
            // Script: "Sir James and Claude climbed the winding stairs of an old tower, where dust danced in beams of golden light."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} climbing winding stone stairs inside an old tower, dust particles dancing in beams of golden light streaming through windows. The tiny 5-year-old boy discovers a beautiful ornate mirror covered in dust. Mysterious atmosphere, ancient tower interior.`
        },
        {
            scene: 2,
            title: "The Mirror Speaks",
            // Script: "The mirror shimmered, and a gentle voice echoed through the tower. 'I am the Mirror of Truth.'"
            prompt: `${CHARACTERS.sirJames} standing before the Mirror of Truth which glows with silvery magical light and speaks to him. The tiny 5-year-old boy looks intrigued and curious. ${CHARACTERS.claude} watches the magical mirror. Shimmering reflections, mystical atmosphere, tower room setting.`
        },
        {
            scene: 3,
            title: "Sir James's Reflection",
            // Script: "Sir James looked into the mirror and saw something wonderful - his reflection glowed with warm, golden light."
            prompt: `${CHARACTERS.sirJames} looking into the Mirror of Truth, seeing his reflection glowing with warm golden light that shows his inner kindness and courage. The tiny 5-year-old boy looks surprised and pleased. ${CHARACTERS.claude} watches. Beautiful inner light visualization, magical mirror.`
        },
        {
            scene: 4,
            title: "Claude's Reflection",
            // Script: "Claude stepped forward and looked into the mirror. His reflection showed a heart that glowed like a ruby."
            prompt: `${CHARACTERS.claude} looking into the Mirror of Truth, his reflection showing a glowing ruby-red heart representing his loyal and loving nature. ${CHARACTERS.sirJames} watches joyfully, praising his noble friend. The tiny 5-year-old boy claps with delight. Heartwarming scene, magical mirror.`
        },
        {
            scene: 5,
            title: "The Shadow Test",
            // Script: "But then Sir James noticed a small shadow in the corner of his reflection. He felt worried."
            prompt: `${CHARACTERS.sirJames} noticing a small shadow in the corner of his mirror reflection, looking concerned but thoughtful. The tiny 5-year-old boy touches his chest, wondering about the shadow. ${CHARACTERS.claude} nuzzles him supportively. Contemplative moment, mirror showing both light and shadow.`
        },
        {
            scene: 6,
            title: "Accepting Truth",
            // Script: "Sir James placed his hand on the cool glass of the mirror and took a deep breath."
            prompt: `${CHARACTERS.sirJames} placing his small hand on the cool glass of the Mirror of Truth, accepting what he sees with wisdom and courage. The tiny 5-year-old boy's shadow shrinks as his golden light grows brighter. ${CHARACTERS.claude} stands proudly beside him. Uplifting moment, self-acceptance.`
        },
        {
            scene: 7,
            title: "The Mirror's Gift",
            // Script: "The great mirror shimmered, and a small hand mirror appeared, floating gently toward Sir James."
            prompt: `A small ornate hand mirror floating gently from the great Mirror of Truth toward ${CHARACTERS.sirJames}. The tiny 5-year-old boy reaches out to receive the magical gift with gratitude. ${CHARACTERS.claude} watches the magical moment. Floating mirror, sparkles, gift-giving scene.`
        },
        {
            scene: 8,
            title: "Truth in Heart",
            // Script: "As Sir James and Claude descended the tower stairs, the setting sun painted the world in shades of gold and pink."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} descending the tower stairs at sunset, the world visible through windows painted in gold and pink. The tiny 5-year-old boy carries the small mirror gift, heart full of truth. ${CHARACTERS.claude} walks beside him contentedly. Peaceful, enlightened atmosphere.`
        }
    ],

    // CHAPTER 7: The Wishing Star
    7: [
        {
            scene: 1,
            title: "The Spiral Staircase",
            // Script: "Sir James and Claude discovered a hidden tower with a spiral staircase that seemed to reach up to the stars themselves."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} discovering a hidden tower with a magical spiral staircase, glowing runes on the walls lighting their way upward toward the stars. The tiny 5-year-old boy points excitedly at the glowing symbols. Mystical tower, starward staircase, magical atmosphere.`
        },
        {
            scene: 2,
            title: "The Star Chamber",
            // Script: "At the top of the tower, Sir James gasped. The ceiling was open to the most beautiful night sky he had ever seen!"
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} at the top of the tower, gazing up through an open ceiling at the most spectacular starry night sky. The tiny 5-year-old boy gasps in wonder, reaching up as if to touch the stars. Breathtaking night sky, thousands of stars, magical atmosphere.`
        },
        {
            scene: 3,
            title: "The Wishing Star Appears",
            // Script: "The star floated gently before Sir James, glowing with warm silver light. It was the legendary Wishing Star!"
            prompt: `The legendary Wishing Star - a beautiful glowing orb of warm silver light - floating gently before ${CHARACTERS.sirJames}. The tiny 5-year-old boy looks up in awe, recognizing it from Gramps's stories. ${CHARACTERS.claude} watches amazed. Magical star, ethereal glow, wonder-filled scene.`
        },
        {
            scene: 4,
            title: "Making a Wish",
            // Script: "The Wishing Star floated closer. 'You may make one wish, young knight. What does your heart truly desire?'"
            prompt: `${CHARACTERS.sirJames} closing his eyes with hands clasped, making a heartfelt wish to the Wishing Star. The tiny 5-year-old boy wishes for courage to help others and be a true friend. ${CHARACTERS.claude} closes his eyes too. Star glows brighter, magical moment, sincere wish.`
        },
        {
            scene: 5,
            title: "The Star's Wisdom",
            // Script: "The Wishing Star created beautiful images in the air - pictures of Sir James helping friends and spreading kindness."
            prompt: `The Wishing Star creating beautiful glowing images in the air showing ${CHARACTERS.sirJames} helping others and spreading kindness in the future. The tiny 5-year-old boy watches hopefully, seeing possibilities. ${CHARACTERS.claude} sees happy visions too. Magical projections, hopeful atmosphere.`
        },
        {
            scene: 6,
            title: "Claude's Dream",
            // Script: "The star turned to Claude and showed his dream too - always being by Sir James's side, protecting and guiding."
            prompt: `The Wishing Star showing ${CHARACTERS.claude}'s dream - images of the noble dog always by ${CHARACTERS.sirJames}'s side, protecting and guiding him. The tiny 5-year-old boy hugs Claude emotionally. Claude licks his face joyfully. Touching moment, friendship written in stars.`
        },
        {
            scene: 7,
            title: "The Star's Gift",
            // Script: "Before returning to the sky, the Wishing Star left a small crystal that glowed with starlight in Sir James's hands."
            prompt: `The Wishing Star leaving a small crystal that glows with captured starlight in ${CHARACTERS.sirJames}'s cupped hands before rising back to the sky. The tiny 5-year-old boy thanks the star with gratitude. ${CHARACTERS.claude} watches the magical gift. Stardust sparkles, meaningful farewell.`
        },
        {
            scene: 8,
            title: "Dreams in Heart",
            // Script: "As Sir James and Claude walked down the spiral stairs, the star crystal lit their way with gentle silver light."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} descending the spiral staircase, the star crystal lighting their way with gentle silver light. The tiny 5-year-old boy walks thoughtfully, understanding that dreams are promises to himself. Above, the Wishing Star twinkles farewell. Peaceful, hopeful atmosphere.`
        }
    ],

    // CHAPTER 8: The River of Stars
    8: [
        {
            scene: 1,
            title: "The Celestial River",
            // Script: "Deep in the night forest, Sir James and Claude discovered something extraordinary - a river that flowed with starlight!"
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} discovering an extraordinary river that flows with actual starlight in a night forest. The tiny 5-year-old boy kneels at the glowing water's edge in amazement. The river sparkles and shimmers with cosmic light, tiny lights dancing through the darkness.`
        },
        {
            scene: 2,
            title: "The Lost Fireflies",
            // Script: "By the riverbank, Sir James noticed a group of fireflies whose lights had grown dim and sad."
            prompt: `${CHARACTERS.sirJames} kneeling beside a group of sad fireflies with dim, fading lights gathered by the starlit riverbank. The tiny 5-year-old boy looks concerned, asking what's wrong. ${CHARACTERS.claude} sniffs them gently. Sympathetic scene, dim fireflies, caring moment.`
        },
        {
            scene: 3,
            title: "A Plan to Help",
            // Script: "Sir James looked at the River of Stars and then at the sad fireflies. An idea began to form in his mind."
            prompt: `${CHARACTERS.sirJames} looking thoughtfully between the glowing River of Stars and the sad fireflies, an idea forming. The tiny 5-year-old boy's face lights up with inspiration. ${CHARACTERS.claude} barks encouragingly. Hopeful moment, problem-solving scene.`
        },
        {
            scene: 4,
            title: "Working Together",
            // Script: "Sir James gently cupped the glowing water in his hands. The starlight swirled and sparkled between his fingers."
            prompt: `${CHARACTERS.sirJames} gently cupping glowing starlight water from the river in his small hands, the light swirling and sparkling between his fingers. The tiny 5-year-old boy offers it to the fireflies. ${CHARACTERS.claude} watches supportively. Magical moment, healing scene.`
        },
        {
            scene: 5,
            title: "Lights Restored",
            // Script: "Soon all the fireflies were glowing brightly again, their little lights twinkling like tiny stars."
            prompt: `All the fireflies now glowing brightly again, dancing happily around ${CHARACTERS.sirJames} and ${CHARACTERS.claude}. The tiny 5-year-old boy laughs with joy as the fireflies twinkle like tiny stars. Triumphant moment, restored lights, celebration.`
        },
        {
            scene: 6,
            title: "The Journey Home",
            // Script: "Sir James, Claude, and the fireflies set off through the forest, following the River of Stars."
            prompt: `${CHARACTERS.sirJames}, ${CHARACTERS.claude}, and a procession of glowing fireflies traveling through the night forest, following the River of Stars. The tiny 5-year-old boy leads the way bravely. Claude's nose guides them. Magical procession, adventure scene.`
        },
        {
            scene: 7,
            title: "The Firefly Meadow",
            // Script: "At last, they reached a beautiful meadow where thousands of fireflies danced in the night air - the fireflies' home!"
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} arriving at a breathtaking meadow where thousands of fireflies dance in the night air - the fireflies' home. The tiny 5-year-old boy watches in wonder as the lost fireflies reunite with their family. Magical meadow, countless lights, joyful reunion.`
        },
        {
            scene: 8,
            title: "The Gift of Friendship",
            // Script: "To thank Sir James, the fireflies gathered together and created a beautiful crown of living light."
            prompt: `Fireflies gathering together to create a beautiful crown of living light, placing it on ${CHARACTERS.sirJames}'s head. The tiny 5-year-old boy thanks them gratefully. ${CHARACTERS.claude} wags his tail as they head home, the firefly crown glowing softly. Magical gift, grateful farewell.`
        }
    ],

    // CHAPTER 9: The Moonbeam Celebration
    9: [
        {
            scene: 1,
            title: "The Circle of Friends",
            // Script: "Sir James and Claude arrived at a beautiful moonlit amphitheater where all their friends from past adventures had gathered."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} arriving at a beautiful moonlit amphitheater where all their magical friends have gathered - the dragon, the Wise Owl, the Garden Keeper, fireflies. The tiny 5-year-old boy looks surprised and delighted. Magical reunion, moonlit setting.`
        },
        {
            scene: 2,
            title: "The Moonbeam Path",
            // Script: "A beautiful path of pure moonlight appeared before Sir James, stretching toward a glowing platform in the center."
            prompt: `A beautiful glowing path of pure moonlight appearing before ${CHARACTERS.sirJames}, leading to a central platform. The tiny 5-year-old boy looks at it in wonder. ${CHARACTERS.claude} nudges him forward encouragingly. Mystical moonbeam path, magical atmosphere.`
        },
        {
            scene: 3,
            title: "Remembering the Lessons",
            // Script: "As Sir James walked the moonbeam path, magical images of all his adventures floated around him like glowing memories."
            prompt: `${CHARACTERS.sirJames} walking the moonbeam path as magical images of all his past adventures float around him - the dragon, the crystals, the garden, the owl, the stars. The tiny 5-year-old boy remembers each lesson with joy. ${CHARACTERS.claude} walks beside him. Nostalgic, magical memories.`
        },
        {
            scene: 4,
            title: "The Gifts Unite",
            // Script: "Sir James reached into his pocket and found all the magical gifts he had received - the dragon scale, the owl feather, the star crystal."
            prompt: `${CHARACTERS.sirJames} holding all his magical gifts - the dragon scale, owl feather, star crystal, magical seed, hand mirror - as they all glow and rise into the air together. The tiny 5-year-old boy watches in amazement. ${CHARACTERS.claude} watches proudly. Magical convergence, glowing gifts.`
        },
        {
            scene: 5,
            title: "The Knight's Medal",
            // Script: "The swirling lights merged together and transformed into a beautiful golden medal shaped like a heart with a star in the center."
            prompt: `The magical gifts swirling together and transforming into a beautiful golden Medal of True Knighthood - heart-shaped with a star in the center - floating before ${CHARACTERS.sirJames}. The tiny 5-year-old boy reaches for it in awe. Triumphant transformation, magical medal.`
        },
        {
            scene: 6,
            title: "Friends Celebrate",
            // Script: "All the magical friends cheered! The dragon breathed sparkles, the fireflies danced, and the flowers bloomed with joy."
            prompt: `All the magical friends celebrating ${CHARACTERS.sirJames} - the dragon breathing sparkles, fireflies dancing, flowers blooming, the owl hooting. The tiny 5-year-old boy thanks everyone joyfully. ${CHARACTERS.claude} howls happily. Festive celebration, magical joy.`
        },
        {
            scene: 7,
            title: "Claude's Honor",
            // Script: "Then the moonlight shone directly on Claude. 'And you, faithful friend, deserve special recognition.'"
            prompt: `Moonlight shining directly on ${CHARACTERS.claude} as a smaller Medal of Loyal Friendship appears around his noble neck. ${CHARACTERS.sirJames} claps proudly for his best friend. The tiny 5-year-old boy beams with joy. Claude's tail wags with pride. Touching honor, special recognition.`
        },
        {
            scene: 8,
            title: "A Knight's Promise",
            // Script: "As the celebration continued, Sir James stood tall under the full moon, his medal glowing softly against his heart."
            prompt: `${CHARACTERS.sirJames} standing tall under the full moon, his Medal of True Knighthood glowing against his heart, making a solemn promise. The tiny 5-year-old boy looks determined and hopeful. ${CHARACTERS.claude} stands proudly beside him with his own medal. Peaceful, promising moment.`
        }
    ],

    // CHAPTER 10: The Knight's Triumph
    10: [
        {
            scene: 1,
            title: "The Journey Home",
            // Script: "As the sun set in brilliant oranges and golds, Sir James and Claude walked the familiar path toward home."
            prompt: `${CHARACTERS.sirJames} and ${CHARACTERS.claude} walking a familiar path toward home at sunset, the sky brilliant with oranges and golds. The tiny 5-year-old boy points excitedly at ${CHARACTERS.gramps} waiting at the cottage door in the distance. Homecoming scene, warm sunset.`
        },
        {
            scene: 2,
            title: "Gramps's Welcome",
            // Script: "Gramps opened his arms wide, and Sir James ran into his warm embrace. Claude danced happily around them."
            prompt: `${CHARACTERS.gramps} with arms open wide as ${CHARACTERS.sirJames} runs into his warm embrace. The tiny 5-year-old boy hugs his grandfather tightly. ${CHARACTERS.claude} dances happily around them both. Loving reunion, cottage door, emotional homecoming.`
        },
        {
            scene: 3,
            title: "Showing the Medal",
            // Script: "Sir James proudly showed Gramps the Medal of True Knighthood that glowed softly against his chest."
            prompt: `${CHARACTERS.sirJames} proudly showing ${CHARACTERS.gramps} the glowing Medal of True Knighthood on his chest, and Claude's Medal of Loyal Friendship. The tiny 5-year-old boy beams with pride. Gramps's eyes glisten with happy tears. Proud moment, medals glowing.`
        },
        {
            scene: 4,
            title: "By the Fireplace",
            // Script: "Inside the cozy cottage, they sat by the warm fireplace. Claude curled up at Sir James's feet."
            prompt: `${CHARACTERS.sirJames} sitting by a warm fireplace in the cozy cottage with ${CHARACTERS.gramps}, telling adventure stories. The tiny 5-year-old boy gestures excitedly. ${CHARACTERS.claude} curled up contentedly at his feet. Warm interior, crackling fire, cozy family scene.`
        },
        {
            scene: 5,
            title: "Gramps's Story",
            // Script: "The firelight danced as Gramps began to speak, his voice warm and full of love."
            prompt: `${CHARACTERS.gramps} speaking wisely by firelight to ${CHARACTERS.sirJames}, sharing wisdom about true knighthood. The tiny 5-year-old boy listens intently, absorbing every word. ${CHARACTERS.claude} rests peacefully. Warm firelight, wisdom being passed down.`
        },
        {
            scene: 6,
            title: "The Promise",
            // Script: "Sir James stood up straight and placed his hand over his heart, where his medal glowed warmly."
            prompt: `${CHARACTERS.sirJames} standing straight with his small hand over his heart where his medal glows, making a solemn promise to always be brave, kind, honest, and true. The tiny 5-year-old boy looks determined. ${CHARACTERS.claude} stands beside him, barking once in agreement. Solemn vow, meaningful moment.`
        },
        {
            scene: 7,
            title: "Looking at Stars",
            // Script: "Through the cottage window, the stars twinkled brightly. Sir James could see the Wishing Star winking at him."
            prompt: `${CHARACTERS.sirJames}, ${CHARACTERS.gramps}, and ${CHARACTERS.claude} looking out the cottage window at the starry night sky, the Wishing Star twinkling brightly. The tiny 5-year-old boy points at their friend in the sky. Peaceful night scene, stars through window, family moment.`
        },
        {
            scene: 8,
            title: "The End and Beginning",
            // Script: "As Sir James climbed into bed with Claude beside him, Gramps tucked them in with a gentle smile."
            prompt: `${CHARACTERS.sirJames} being tucked into a cozy bed by ${CHARACTERS.gramps}, with ${CHARACTERS.claude} curled up at his feet. The tiny 5-year-old boy smiles sleepily, medal warm against his heart. Moonlight streams through the window. Gramps smiles lovingly. Peaceful bedtime, sweet ending, promise of more adventures.`
        }
    ]
};

// ============================================================================
// IMAGE GENERATION FUNCTIONS
// ============================================================================

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

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
    const startChapter = parseInt(process.argv[2]) || 1;
    const endChapter = parseInt(process.argv[3]) || 10;
    
    console.log('🎨 SIR JAMES ADVENTURES - FINAL IMAGE REGENERATION');
    console.log('═'.repeat(60));
    console.log('⚠️  CRITICAL: Sir James is a 5-YEAR-OLD CHILD (3 feet tall)');
    console.log('⚠️  CRITICAL: Claude is a NOBLE ROYAL Redbone Coonhound');
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
        const backupDir = path.join(outputDir, 'backup');
        
        console.log(`\n${'═'.repeat(60)}`);
        console.log(`📖 CHAPTER ${chapterNum}: ${scenes.length} scenes`);
        console.log('═'.repeat(60));
        
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
                failedImages.push({ chapter: chapterNum, scene: scene.scene, title: scene.title, error: error.message });
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
        failedImages.forEach(f => console.log(`   - Chapter ${f.chapter} Scene ${f.scene}: ${f.title}`));
    }
    
    console.log('═'.repeat(60));
}

main().catch(console.error);
