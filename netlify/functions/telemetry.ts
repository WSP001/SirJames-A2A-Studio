import type { Handler } from '@netlify/functions';
import { getMetrics } from './lib/telemetry';

/**
 * TELEMETRY ENDPOINT
 * 
 * Returns aggregated metrics for all agents:
 * - Runtime performance
 * - Cost tracking
 * - Success/failure rates
 * 
 * GET /.netlify/functions/telemetry
 */

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'GET', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: 'method_not_allowed' }),
    };
  }

  try {
    const metrics = getMetrics();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        metrics,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Telemetry error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: false,
        error: 'telemetry_failed',
        detail: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};

export default handler;
