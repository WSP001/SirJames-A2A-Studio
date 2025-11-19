import { useEffect, useState } from 'react';
import './CostMeter.css';

/**
 * CostMeter Component
 * 
 * Displays real-time cost tracking for Sir James chapter generation
 * Target: < $1.00 per chapter
 */

interface CostBreakdown {
  curator: number;
  narrator: number;
  voice: number;
  music: number;
  compiler: number;
  publisher: number;
}

interface TelemetryData {
  ok: boolean;
  metrics: {
    costs: {
      total_chapters: number;
      total_spent_usd: number;
      avg_per_chapter: number;
      under_budget_count: number;
    };
  };
}

export default function CostMeter() {
  const [totalCost, setTotalCost] = useState(0);
  const [avgPerChapter, setAvgPerChapter] = useState(0);
  const [isUnderBudget, setIsUnderBudget] = useState(true);

  useEffect(() => {
    // Fetch telemetry data
    const fetchCosts = async () => {
      try {
        const response = await fetch('/.netlify/functions/telemetry');
        const data: TelemetryData = await response.json();
        
        if (data.ok) {
          setTotalCost(data.metrics.costs.total_spent_usd);
          setAvgPerChapter(data.metrics.costs.avg_per_chapter);
          setIsUnderBudget(data.metrics.costs.avg_per_chapter <= 1.0);
        }
      } catch (error) {
        console.error('Failed to fetch cost metrics:', error);
      }
    };

    fetchCosts();
    // Refresh every 30 seconds
    const interval = setInterval(fetchCosts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`cost-meter ${isUnderBudget ? 'under-budget' : 'over-budget'}`}>
      <div className="cost-icon">
        {isUnderBudget ? '✅' : '⚠️'}
      </div>
      <div className="cost-details">
        <div className="cost-total">
          💰 <strong>${totalCost.toFixed(2)}</strong> total
        </div>
        <div className="cost-avg">
          📊 ${avgPerChapter.toFixed(2)} avg/chapter
          {isUnderBudget ? ' ✓' : ' (over $1.00 target)'}
        </div>
      </div>
    </div>
  );
}
