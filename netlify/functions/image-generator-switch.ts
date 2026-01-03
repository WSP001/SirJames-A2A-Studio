// netlify/functions/image-generator-switch.ts
// Toggle between DALL-E and Gemini for image generation

import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ImageRequest {
  prompt: string;
  model?: 'dalle' | 'gemini';
  style?: 'cartoon' | 'realistic' | 'watercolor';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
}

interface ImageResponse {
  imageUrl: string;
  model: string;
  cost: number;
  prompt: string;
}

export async function handler(event: any) {
  try {
    const { prompt, model = 'dalle', style = 'cartoon', size = '1792x1024' } = JSON.parse(event.body) as ImageRequest;
    
    // Get model preference from env var or request
    const useModel = process.env.IMAGE_GENERATOR_MODEL || model;
    
    let response: ImageResponse;
    
    if (useModel === 'gemini') {
      response = await generateWithGemini(prompt, style);
    } else {
      response = await generateWithDalle(prompt, style, size);
    }
    
    // Log usage for tracking
    console.log(`Image generated with ${useModel}: ${response.cost} USD`);
    
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error('Image generation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

async function generateWithDalle(prompt: string, style: string, size: string): Promise<ImageResponse> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const dallePrompt = `${prompt}, ${style} style, Sir James Adventures, character consistent, bright colors, children's book illustration`;
  
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: dallePrompt,
    size: size as any,
    quality: 'hd',
    style: 'vivid',
    n: 1
  });
  
  return {
    imageUrl: response.data[0].url!,
    model: 'dall-e-3',
    cost: 0.04, // DALL-E 3 HD cost
    prompt: dallePrompt
  };
}

async function generateWithGemini(prompt: string, style: string): Promise<ImageResponse> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const geminiPrompt = `Generate a detailed image description for: ${prompt}, ${style} style, Sir James Adventures, 5-year-old boy with bright blue eyes, royal blue tunic, cartoon illustration`;
  
  const result = await model.generateContent(geminiPrompt);
  const imageDescription = result.response.text();
  
  // For now, return the description (Gemini doesn't generate images directly yet)
  // In production, you'd use this description with another image service
  return {
    imageUrl: `data:text/plain;base64,${Buffer.from(imageDescription).toString('base64')}`,
    model: 'gemini-1.5-flash',
    cost: 0.001, // Gemini text generation cost
    prompt: geminiPrompt
  };
}
