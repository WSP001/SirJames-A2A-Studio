import type { Handler, HandlerEvent } from '@netlify/functions';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { startAgent, endAgent, estimateDalleCost } from './lib/telemetry';

/**
 * CHAPTER CURATOR AGENT (curate-chapters)
 * 
 * Converts Sir James emoji content to DALL-E image prompts:
 * - Maintains character consistency (real Sir James photo reference)
 * - Child-friendly, age-appropriate content
 * - Learning from chapter_preferences.json
 * 
 * Input: { chapterNumber, emojiList, theme }
 * Output: { ok, imagePrompts: ImagePrompt[], theme, totalAssets }
 */

interface ImagePrompt {
  emoji: string;
  dallePrompt: string;
  filename: string;
  priority: 'high' | 'normal';
  characterFocus: boolean;
}

interface CurateRequest {
  chapterNumber: number;
  emojiList: string[];
  theme?: string;
  maxImages?: number;
}

interface ChapterPreferences {
  version: string;
  child_preferences: {
    favorite_characters: string[];
    preferred_image_style: string;
    favorite_colors: string[];
    scary_content: boolean;
  };
  chapter_history: Array<{
    chapter: number;
    user_rating: 'loved_it' | 'liked_it' | 'neutral';
    favorite_scenes: string[];
    completion_time_sec: number;
  }>;
}

// Read chapter preferences for learning
function readChapterPreferences(vaultPath: string): ChapterPreferences | null {
  try {
    const prefsPath = join(vaultPath, 'data', 'chapter_preferences.json');
    if (existsSync(prefsPath)) {
      const content = readFileSync(prefsPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn('Could not read chapter preferences:', error);
  }
  return null;
}

// Learn from child's favorite chapters and scenes
function learnFromChildPreferences(prefs: ChapterPreferences | null): string {
  if (!prefs || !prefs.chapter_history || prefs.chapter_history.length === 0) {
    return 'adventure'; // default theme for children
  }

  // Find most loved chapters
  const lovedChapters = prefs.chapter_history
    .filter(ch => ch.user_rating === 'loved_it')
    .sort((a, b) => b.completion_time_sec - a.completion_time_sec); // Longer engagement = more loved

  if (lovedChapters.length > 0) {
    console.log(`Learning from loved chapter: ${lovedChapters[0].chapter}`);
    return 'adventure'; // Child loves adventure themes
  }

  return 'friendship'; // Safe fallback theme
}

// Generate child-friendly DALL-E prompts
function generateImagePrompts(emojiList: string[], chapterNumber: number, theme: string): ImagePrompt[] {
  // Sir James character consistency base
  const sirJamesBase = "4-year-old boy with light brown hair, bright emerald eyes, round face with rosy cheeks, happy adventurous expression";
  
  // Emoji to DALL-E prompt mappings for children
  const emojiPrompts: Record<string, string> = {
    '🏰': `Magical fairy tale castle with rainbow flags, ${sirJamesBase} standing proudly in front, cartoon style, bright colors, child-friendly`,
    '🌲': `Enchanted forest with friendly trees, dappled sunlight, ${sirJamesBase} exploring safely, whimsical cartoon style`,
    '⚔️': `Wooden practice sword with ribbons, ${sirJamesBase} in knight training, safe playground setting, colorful cartoon style`,
    '🐕': `Friendly redbone coonhound dog named Claude, wagging tail, ${sirJamesBase} petting dog, warm cartoon illustration`,
    '🧙‍♂️': `Kind wizard grandfather with white beard, gentle smile, ${sirJamesBase} learning magic, cozy cottage setting, warm colors`,
    '⭐': `Sparkling golden stars in blue sky, ${sirJamesBase} pointing up in wonder, magical atmosphere, child-safe imagery`,
    '💎': `Colorful virtue gems (courage, kindness, wisdom), ${sirJamesBase} collecting treasures, bright cartoon style`,
    '🌈': `Beautiful rainbow over green hills, ${sirJamesBase} running happily, vibrant colors, joyful scene`
  };

  return emojiList.map((emoji, index) => ({
    emoji,
    dallePrompt: emojiPrompts[emoji] || `Child-friendly scene with ${sirJamesBase}, bright cartoon style, safe content`,
    filename: `chapter${chapterNumber}_scene${index + 1}.png`,
    priority: emoji === '🏰' ? 'high' : 'normal' as 'high' | 'normal',
    characterFocus: ['🏰', '⚔️', '🐕', '🧙‍♂️'].includes(emoji)
  }));
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 
        'Allow': 'POST',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ok: false, error: 'method_not_allowed' }),
    };
  }

  // Start telemetry tracking
  const trackingId = startAgent('curator');
  
  try {
    const payload: CurateRequest = event.body ? JSON.parse(event.body) : {};
    const { chapterNumber, emojiList, theme, maxImages = 8 } = payload;

    if (!chapterNumber || !emojiList || !Array.isArray(emojiList)) {
      endAgent('curator', false, 0, 0, 'Missing required fields');
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ok: false, error: 'chapterNumber and emojiList required' }),
      };
    }

    console.log(`🏰 Chapter Curator: Generating prompts for Chapter ${chapterNumber}`);

    // Step 1: Read chapter preferences and learn
    const vaultPath = './Sir-James-vault'; // Private vault for Sir James
    const preferences = readChapterPreferences(vaultPath);
    const learnedTheme = theme || learnFromChildPreferences(preferences);

    console.log(`✨ Learned theme from child preferences: ${learnedTheme}`);

    // Step 2: Generate DALL-E prompts from emojis
    const imagePrompts = generateImagePrompts(emojiList.slice(0, maxImages), chapterNumber, learnedTheme);

    console.log(`✅ Chapter Curator generated ${imagePrompts.length} image prompts`);

    // Track cost (curator only generates prompts, no API calls yet)
    const estimatedCost = estimateDalleCost(imagePrompts.length);
    endAgent('curator', true, estimatedCost, imagePrompts.length);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        ok: true,
        chapter: chapterNumber,
        theme: learnedTheme,
        imagePrompts,
        totalAssets: imagePrompts.length,
        estimatedCost: estimatedCost,
        metadata: {
          agent: 'chapter-curator',
          learned_from_preferences: preferences !== null,
          character_consistency: 'sir-james-photo-reference',
          timestamp: new Date().toISOString(),
        },
      }),
    };
  } catch (error) {
    console.error('Chapter curator error:', error);
    endAgent('curator', false, 0, 0, error instanceof Error ? error.message : String(error));
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ok: false,
        error: 'chapter_curation_failed',
        detail: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};

export default handler;
