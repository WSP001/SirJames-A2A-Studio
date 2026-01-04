// netlify/functions/character-consistency-generator.ts
// Ensures character consistency across all images using Character Bible

import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface CharacterImageRequest {
  character: 'sir_james' | 'claude' | 'gramps' | 'narrator';
  scene: string;
  emotion?: 'brave' | 'curious' | 'wise' | 'gentle' | 'happy' | 'thoughtful';
  style?: 'cartoon' | 'realistic' | 'watercolor';
  model?: 'dalle' | 'gemini';
}

interface CharacterImageResponse {
  imageUrl: string;
  characterSheet: string;
  prompt: string;
  model: string;
  cost: number;
  consistencyToken: string;
}

// CHARACTER BIBLE - The Source of Truth for Consistency
const CHARACTER_BIBLE = {
  sir_james: {
    base: `Sir James, a 5-year-old boy with BRIGHT BLUE eyes, sandy brown hair with a distinctive cowlick, wearing a royal blue tunic with silver Celtic trim, brown leather boots`,
    build: `small but sturdy build, round face with rosy cheeks`,
    expression: `brave and curious expression, determined look`,
    always: `always maintain the bright blue eyes, always show the silver Celtic trim on the tunic`
  },
  claude: {
    base: `Claude, a Redbone Coonhound with rich reddish-brown coat, long floppy ears, soulful brown eyes`,
    build: `medium-sized dog, athletic build, white patch on chest`,
    expression: `loyal and supportive expression, head slightly tilted`,
    always: `always maintain the reddish-brown coat, always show the floppy ears`
  },
  gramps: {
    base: `Gramps, a 65-70 year old man with silver/grey hair and matching beard, wearing simple brown robes`,
    build: `tall but slightly stooped, kind face with wrinkles around eyes`,
    expression: `gentle wisdom and pride in his eyes`,
    always: `always maintain the silver hair and beard, always show the brown robes`
  },
  narrator: {
    base: `The Narrator appears as a warm, grandfatherly figure in storytelling robes`,
    build: `stately presence, comforting posture`,
    expression: `warm and encouraging expression`,
    always: `always maintain the storyteller aura, never appears in scenes with characters`
  }
};

export async function handler(event: any) {
  try {
    const { character, scene, emotion = 'happy', style = 'cartoon', model = 'dalle' } = JSON.parse(event.body) as CharacterImageRequest;
    
    const characterData = CHARACTER_BIBLE[character];
    if (!characterData) {
      throw new Error(`Unknown character: ${character}`);
    }
    
    // Build the consistency prompt
    const consistencyPrompt = buildConsistencyPrompt(character, scene, emotion, style, characterData);
    
    let response: CharacterImageResponse;
    
    if (model === 'gemini') {
      response = await generateWithGemini(consistencyPrompt, character, style);
    } else {
      response = await generateWithDalle(consistencyPrompt, character, style);
    }
    
    // Add consistency metadata
    response.characterSheet = characterData.base;
    response.consistencyToken = generateConsistencyToken(character, emotion, style);
    
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error('Character generation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

function buildConsistencyPrompt(character: string, scene: string, emotion: string, style: string, bible: any): string {
  const emotionMap = {
    brave: 'brave and determined expression',
    curious: 'curious and inquisitive expression',
    wise: 'wise and thoughtful expression',
    gentle: 'gentle and kind expression',
    happy: 'happy and cheerful expression',
    thoughtful: 'thoughtful and contemplative expression'
  };
  
  const styleMap = {
    cartoon: 'Pixar-style 3D animation, bright colors, clean lines',
    realistic: 'Photorealistic, detailed textures, natural lighting',
    watercolor: 'Watercolor illustration, soft edges, flowing colors'
  };
  
  return `
${bible.base}, ${bible.build}, ${emotionMap[emotion]}, ${bible.always}

SCENE: ${scene}

STYLE: ${styleMap[style]}, children's book illustration, high quality, consistent character design

CRITICAL: Always maintain character consistency. ${bible.always}. The character must look identical in every scene - same eye color, same hair, same clothing, same proportions.
  `.trim();
}

async function generateWithDalle(prompt: string, character: string, style: string): Promise<CharacterImageResponse> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    size: '1792x1024',
    quality: 'hd',
    style: 'vivid',
    n: 1
  });
  
  return {
    imageUrl: response.data[0].url!,
    prompt: prompt,
    model: 'dall-e-3',
    cost: 0.04,
    consistencyToken: ''
  };
}

async function generateWithGemini(prompt: string, character: string, style: string): Promise<CharacterImageResponse> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const result = await model.generateContent(`Generate an image description for: ${prompt}`);
  const imageDescription = result.response.text();
  
  return {
    imageUrl: `data:text/plain;base64,${Buffer.from(imageDescription).toString('base64')}`,
    prompt: prompt,
    model: 'gemini-1.5-flash',
    cost: 0.001,
    consistencyToken: ''
  };
}

function generateConsistencyToken(character: string, emotion: string, style: string): string {
  // Creates a token that can be used to track consistency
  return `${character}_${emotion}_${style}_${Date.now()}`;
}
