/**
 * Update All Chapter Landing Pages with Scene Thumbnails
 * 
 * This script updates chapters 2-10 to match the enhanced Chapter 1 template
 * with scene thumbnail images and titles.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const BOOK002_DIR = path.join(PROJECT_ROOT, 'public-book002');

// Chapter metadata with scene titles
const CHAPTERS = {
  2: {
    title: "The Mist That Whispers",
    intro: "The morning sun rises over Gramps's cottage, but something unusual catches Sir James's attention - a mysterious mist that seems to whisper secrets.",
    scenes: [
      "Morning Discovery", "The Whispering Mist", "Claude's Warning",
      "Following the Sound", "The Hidden Path", "A Friend in Need",
      "The Brave Choice", "Lessons Learned"
    ]
  },
  3: {
    title: "The Bridge of Trust",
    intro: "Sir James encounters a rickety bridge over a deep ravine. To cross, he must learn to trust both himself and his loyal companion Claude.",
    scenes: [
      "The Ravine", "A Difficult Crossing", "Claude's Courage",
      "Taking the First Step", "Halfway There", "A Moment of Doubt",
      "Trust Rewarded", "Safe on the Other Side"
    ]
  },
  4: {
    title: "The Garden of Kindness",
    intro: "In a magical garden, Sir James discovers that kindness to all creatures - big and small - is the mark of a true knight.",
    scenes: [
      "The Hidden Garden", "Magical Creatures", "A Tiny Friend",
      "The Gardener's Test", "Helping Hands", "Seeds of Kindness",
      "The Garden's Gift", "Growing Together"
    ]
  },
  5: {
    title: "The Storm of Courage",
    intro: "A fierce storm threatens the village! Sir James must find the courage within himself to help those in need.",
    scenes: [
      "Dark Clouds Gather", "The Village in Danger", "Fear and Doubt",
      "Claude's Encouragement", "Into the Storm", "Helping the Villagers",
      "The Eye of the Storm", "Courage Shines Through"
    ]
  },
  6: {
    title: "The Mirror of Truth",
    intro: "In an ancient tower, Sir James discovers a magical mirror that shows not what you look like, but who you truly are inside.",
    scenes: [
      "The Abandoned Tower", "The Mirror Speaks", "Sir James's Reflection",
      "Claude's Reflection", "The Shadow Test", "Accepting Truth",
      "The Mirror's Gift", "Truth in Heart"
    ]
  },
  7: {
    title: "The Song of Friendship",
    intro: "Sir James learns that true friendship means being there for others, even when it's difficult.",
    scenes: [
      "A Friend's Call", "The Long Journey", "Obstacles Ahead",
      "Working Together", "A Moment of Joy", "The Test of Friendship",
      "Standing Together", "Friends Forever"
    ]
  },
  8: {
    title: "The Light in the Darkness",
    intro: "When darkness falls and fear creeps in, Sir James discovers that hope can be the brightest light of all.",
    scenes: [
      "Night Falls", "Shadows and Fears", "Claude Stays Close",
      "Finding Inner Light", "Guiding Others", "The Darkest Hour",
      "Hope Shines Bright", "Dawn Breaks"
    ]
  },
  9: {
    title: "The Mountain of Perseverance",
    intro: "The highest mountain stands before Sir James. Only by never giving up can he reach the summit.",
    scenes: [
      "The Towering Peak", "First Steps Up", "The Steep Climb",
      "Wanting to Give Up", "Claude's Support", "One Step at a Time",
      "Almost There", "The Summit Victory"
    ]
  },
  10: {
    title: "The Return Home",
    intro: "Sir James's greatest adventure ends where it began - at home, where he shares all he has learned with those he loves.",
    scenes: [
      "The Journey Back", "Memories Along the Way", "Gramps Awaits",
      "Sharing Stories", "The Lessons Learned", "A Knight's Heart",
      "Claude's Reward", "The Adventure Continues"
    ]
  }
};

function generateChapterHTML(chapterNum, chapterData) {
  const sceneCards = chapterData.scenes.map((title, index) => {
    const sceneNum = String(index + 1).padStart(3, '0');
    return `
            <div class="scene-card">
                <a href="scene-${sceneNum}/index.html" class="scene-link">
                    <img src="images/scene-${sceneNum}.png" alt="Scene ${index + 1}" class="scene-thumbnail" onerror="this.src='/assets/images/placeholder.png'">
                    <span>Scene ${index + 1}</span>
                    <div class="scene-title">${title}</div>
                </a>
            </div>`;
  }).join(' ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sir James Adventures - Chapter ${chapterNum}</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .chapter-container {
            max-width: 1000px;
            margin: 0 auto;
            background: rgba(0,0,0,0.3);
            padding: 40px;
            border-radius: 15px;
            -webkit-backdrop-filter: blur(10px);
            backdrop-filter: blur(10px);
        }
        .chapter-title {
            font-size: 2.5em;
            text-align: center;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .chapter-intro {
            font-size: 1.2em;
            line-height: 1.6;
            text-align: center;
            margin-bottom: 40px;
            font-style: italic;
        }
        .scene-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .scene-card {
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            transition: transform 0.3s ease;
            cursor: pointer;
        }
        .scene-card:hover {
            transform: translateY(-5px);
            background: rgba(255,255,255,0.2);
        }
        .scene-thumbnail {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .scene-link {
            color: white;
            text-decoration: none;
            font-size: 1em;
            font-weight: bold;
            display: block;
        }
        .scene-title {
            font-size: 0.85em;
            opacity: 0.8;
            margin-top: 5px;
        }
        .navigation {
            text-align: center;
            margin-top: 40px;
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        .nav-button {
            background: rgba(255,255,255,0.2);
            border: 2px solid white;
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            font-size: 1.1em;
            min-width: 150px;
        }
        .nav-button:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        .nav-button.secondary {
            background: transparent;
            border-color: rgba(255,255,255,0.5);
        }
    </style>
</head>
<body>
    <div class="chapter-container">
        <h1 class="chapter-title">Chapter ${chapterNum}: ${chapterData.title}</h1>
        
        <div class="chapter-intro">
            ${chapterData.intro}
        </div>
        
        <div class="scene-grid">${sceneCards}
        </div>
        
        <div class="navigation">
            <a href="../index.html" class="nav-button secondary">← Back to Chapters</a>
            <a href="scene-001/index.html" class="nav-button">Begin Chapter ${chapterNum} →</a>
        </div>
    </div>
</body>
</html>`;
}

async function updateAllChapters() {
  console.log('🎨 Updating all chapter landing pages with thumbnails...\n');
  
  for (const [chapterNum, chapterData] of Object.entries(CHAPTERS)) {
    const chapterDir = path.join(BOOK002_DIR, `chapter${String(chapterNum).padStart(2, '0')}`);
    const indexPath = path.join(chapterDir, 'index.html');
    
    // Check if chapter directory exists
    try {
      await fs.access(chapterDir);
    } catch {
      console.log(`⚠️  Chapter ${chapterNum} directory not found, skipping`);
      continue;
    }
    
    // Backup existing file
    try {
      const existing = await fs.readFile(indexPath, 'utf-8');
      const backupPath = path.join(chapterDir, `index-backup-${Date.now()}.html`);
      await fs.writeFile(backupPath, existing);
      console.log(`📦 Backed up Chapter ${chapterNum}`);
    } catch {
      // No existing file to backup
    }
    
    // Write new template
    const html = generateChapterHTML(chapterNum, chapterData);
    await fs.writeFile(indexPath, html);
    console.log(`✅ Updated Chapter ${chapterNum}: ${chapterData.title}`);
  }
  
  console.log('\n🎉 All chapter landing pages updated!');
  console.log('   Each chapter now has:');
  console.log('   - Scene thumbnail images');
  console.log('   - Scene titles');
  console.log('   - Back to Chapters navigation');
  console.log('   - Safari/iOS compatible styling');
}

updateAllChapters().catch(console.error);
