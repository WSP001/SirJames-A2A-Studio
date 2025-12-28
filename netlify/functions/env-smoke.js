/**
 * Environment Smoke Test Function
 * Verifies API keys are properly configured in Netlify
 * 
 * Usage: GET /.netlify/functions/env-smoke
 * 
 * Commons Good Compliance:
 * - No secrets exposed to browser
 * - Only returns boolean flags (has/doesn't have)
 */

export default async () => {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasEleven = !!process.env.ELEVENLABS_API_KEY;

  // Check key format validity (without exposing the key)
  const openAIValid = hasOpenAI && process.env.OPENAI_API_KEY.startsWith('sk-');
  const geminiValid = hasGemini && process.env.GEMINI_API_KEY.startsWith('AIza');
  const elevenValid = hasEleven && process.env.ELEVENLABS_API_KEY.startsWith('sk_');

  return new Response(JSON.stringify({
    ok: true,
    timestamp: new Date().toISOString(),
    project: "Sir James Adventures Book002",
    keys: {
      OPENAI_API_KEY: { present: hasOpenAI, validFormat: openAIValid },
      GEMINI_API_KEY: { present: hasGemini, validFormat: geminiValid },
      ELEVENLABS_API_KEY: { present: hasEleven, validFormat: elevenValid }
    },
    ready: hasOpenAI && hasGemini && hasEleven,
    message: (hasOpenAI && hasGemini && hasEleven) 
      ? "✅ All API keys configured! Ready for image/audio generation."
      : "⚠️ Missing API keys. Add them in Netlify Dashboard → Configuration → Environment Variables"
  }, null, 2), {
    headers: { "content-type": "application/json" }
  });
};
