/**
 * Telemetry & Cost Tracking for Sir James A2A Pipeline
 * 
 * Tracks:
 * - Agent execution times
 * - API costs per agent
 * - Success/failure rates
 * - Total chapter cost (target: <$1.00)
 */

export interface AgentMetrics {
  agent: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  success: boolean;
  costUSD: number;
  apiCalls: number;
  error?: string;
}

export interface ChapterCost {
  chapterNumber: number;
  totalCostUSD: number;
  breakdown: {
    curator: number;      // DALL-E image prompts
    narrator: number;     // GPT-4 narrative
    voice: number;        // ElevenLabs TTS
    music: number;        // Suno background
    compiler: number;     // Processing
    publisher: number;    // Deployment
  };
  timestamp: string;
}

// In-memory metrics store (could use Redis for production)
const metrics: AgentMetrics[] = [];
const chapterCosts: ChapterCost[] = [];

/**
 * Start tracking an agent execution
 */
export function startAgent(agent: string): string {
  const trackingId = `${agent}-${Date.now()}`;
  metrics.push({
    agent,
    startTime: Date.now(),
    success: false,
    costUSD: 0,
    apiCalls: 0,
  });
  return trackingId;
}

/**
 * End tracking and record cost
 */
export function endAgent(
  agent: string,
  success: boolean,
  costUSD: number,
  apiCalls: number = 1,
  error?: string
) {
  const metric = metrics.find(
    (m) => m.agent === agent && !m.endTime
  );
  
  if (metric) {
    metric.endTime = Date.now();
    metric.durationMs = metric.endTime - metric.startTime;
    metric.success = success;
    metric.costUSD = costUSD;
    metric.apiCalls = apiCalls;
    if (error) metric.error = error;
  }
  
  console.log(`📊 [${agent}] Cost: $${costUSD.toFixed(4)} | Duration: ${metric?.durationMs}ms | Success: ${success}`);
}

/**
 * Record chapter cost breakdown
 */
export function recordChapterCost(chapterNumber: number, breakdown: ChapterCost['breakdown']) {
  const totalCostUSD = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);
  
  const cost: ChapterCost = {
    chapterNumber,
    totalCostUSD,
    breakdown,
    timestamp: new Date().toISOString(),
  };
  
  chapterCosts.push(cost);
  
  // Alert if over budget
  if (totalCostUSD > 1.0) {
    console.warn(`⚠️ Chapter ${chapterNumber} OVER BUDGET: $${totalCostUSD.toFixed(2)} (target: <$1.00)`);
  } else {
    console.log(`✅ Chapter ${chapterNumber} cost: $${totalCostUSD.toFixed(2)} ✓`);
  }
  
  return cost;
}

/**
 * Get aggregated metrics
 */
export function getMetrics() {
  const successful = metrics.filter(m => m.success && m.endTime);
  const failed = metrics.filter(m => !m.success && m.endTime);
  
  return {
    agents: {
      total_runs: metrics.length,
      successful: successful.length,
      failed: failed.length,
      success_rate: (successful.length / metrics.length) * 100,
      avg_duration_ms: successful.reduce((sum, m) => sum + (m.durationMs || 0), 0) / successful.length,
      total_cost_usd: metrics.reduce((sum, m) => sum + m.costUSD, 0),
    },
    costs: {
      total_chapters: chapterCosts.length,
      total_spent_usd: chapterCosts.reduce((sum, c) => sum + c.totalCostUSD, 0),
      avg_per_chapter: chapterCosts.reduce((sum, c) => sum + c.totalCostUSD, 0) / chapterCosts.length,
      under_budget_count: chapterCosts.filter(c => c.totalCostUSD <= 1.0).length,
    },
    recent_failures: failed.slice(-5).map(m => ({
      agent: m.agent,
      error: m.error,
      timestamp: new Date(m.startTime).toISOString(),
    })),
  };
}

/**
 * Get cost estimate for OpenAI DALL-E 3
 */
export function estimateDalleCost(imageCount: number): number {
  return imageCount * 0.04; // $0.04 per image (1024x1024)
}

/**
 * Get cost estimate for ElevenLabs TTS
 */
export function estimateElevenLabsCost(characterCount: number): number {
  return (characterCount / 10000) * 0.30; // $0.30 per 10k characters
}

/**
 * Get cost estimate for GPT-4
 */
export function estimateGPT4Cost(tokens: number): number {
  // Assuming GPT-4 Turbo pricing: $0.01/1k input, $0.03/1k output
  const inputCost = (tokens / 1000) * 0.01;
  const outputCost = (tokens / 1000) * 0.03;
  return inputCost + outputCost;
}

/**
 * Get cost estimate for Suno music
 */
export function estimateSunoCost(durationSeconds: number): number {
  // Approximate: $0.10 per 60-second track
  return (durationSeconds / 60) * 0.10;
}
