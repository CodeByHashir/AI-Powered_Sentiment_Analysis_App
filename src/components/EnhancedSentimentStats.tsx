import React from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, PieChart, Activity } from 'lucide-react';

interface SentimentStats {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
}

interface EnhancedSentimentStatsProps {
  stats: SentimentStats;
  className?: string;
}

export default function EnhancedSentimentStats({ stats, className = '' }: EnhancedSentimentStatsProps) {
  const total = stats.total;
  const positivePercent = total > 0 ? (stats.positive / total) * 100 : 0;
  const negativePercent = total > 0 ? (stats.negative / total) * 100 : 0;
  const neutralPercent = total > 0 ? (stats.neutral / total) * 100 : 0;

  const getSentimentTrend = () => {
    // More accurate trend calculation
    if (positivePercent > 40) return { trend: 'up', color: 'text-green-600', icon: TrendingUp, label: 'Positive' };
    if (negativePercent > 40) return { trend: 'down', color: 'text-red-600', icon: TrendingDown, label: 'Negative' };
    if (neutralPercent > 60) return { trend: 'neutral', color: 'text-yellow-600', icon: Minus, label: 'Neutral' };
    
    // Mixed sentiment
    if (Math.abs(positivePercent - negativePercent) < 15) {
      return { trend: 'mixed', color: 'text-blue-600', icon: Minus, label: 'Mixed' };
    }
    
    // Default to highest percentage
    if (positivePercent > negativePercent && positivePercent > neutralPercent) {
      return { trend: 'up', color: 'text-green-600', icon: TrendingUp, label: 'Positive' };
    } else if (negativePercent > positivePercent && negativePercent > neutralPercent) {
      return { trend: 'down', color: 'text-red-600', icon: TrendingDown, label: 'Negative' };
    } else {
      return { trend: 'neutral', color: 'text-yellow-600', icon: Minus, label: 'Neutral' };
    }
  };

  const trend = getSentimentTrend();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Trend Indicator */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border-2 border-gray-200 shadow-md">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
          Sentiment Overview
        </h3>
        <div className={`flex items-center ${trend.color} bg-white px-4 py-2 rounded-full border-2 border-current shadow-sm`}>
          <trend.icon className="w-5 h-5 mr-2" />
          <span className="text-sm font-bold capitalize">
            {trend.label} Trend
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Positive Stats */}
        <div className="sentiment-card-positive p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-green-800">Positive</span>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-900 mb-1">{stats.positive}</div>
          <div className="text-lg font-semibold text-green-700 mb-3">{positivePercent.toFixed(1)}%</div>
          <div className="mb-2">
            <div className="w-full bg-green-300 rounded-full h-3 border border-green-400">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${positivePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Negative Stats */}
        <div className="sentiment-card-negative p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-red-800">Negative</span>
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-3xl font-bold text-red-900 mb-1">{stats.negative}</div>
          <div className="text-lg font-semibold text-red-700 mb-3">{negativePercent.toFixed(1)}%</div>
          <div className="mb-2">
            <div className="w-full bg-red-300 rounded-full h-3 border border-red-400">
              <div 
                className="bg-red-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${negativePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Neutral Stats */}
        <div className="sentiment-card-neutral p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-yellow-800">Neutral</span>
            <Minus className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-3xl font-bold text-yellow-900 mb-1">{stats.neutral}</div>
          <div className="text-lg font-semibold text-yellow-700 mb-3">{neutralPercent.toFixed(1)}%</div>
          <div className="mb-2">
            <div className="w-full bg-yellow-300 rounded-full h-3 border border-yellow-400">
              <div 
                className="bg-yellow-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${neutralPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-blue-600" />
          Distribution Chart
        </h4>
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            {/* Enhanced Pie Chart using CSS */}
            {positivePercent > 0 && (
              <div className="absolute inset-0 rounded-full border-8 border-green-500" 
                   style={{ 
                     clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * positivePercent / 100)}% ${50 + 50 * Math.sin(2 * Math.PI * positivePercent / 100)}%)` 
                   }} />
            )}
            {negativePercent > 0 && (
              <div className="absolute inset-0 rounded-full border-8 border-red-500" 
                   style={{ 
                     clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * (positivePercent + negativePercent) / 100)}% ${50 + 50 * Math.sin(2 * Math.PI * (positivePercent + negativePercent) / 100)}%)` 
                   }} />
            )}
            {neutralPercent > 0 && (
              <div className="absolute inset-0 rounded-full border-8 border-yellow-500" 
                   style={{ 
                     clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * (positivePercent + negativePercent + neutralPercent) / 100)}% ${50 + 50 * Math.sin(2 * Math.PI * (positivePercent + negativePercent + neutralPercent) / 100)}%)` 
                   }} />
            )}
            
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-white rounded-full w-20 h-20 flex items-center justify-center border-4 border-gray-200 shadow-md">
                <div>
                  <div className="text-xl font-bold text-gray-900">{total}</div>
                  <div className="text-xs text-gray-600 font-medium">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          {positivePercent > 0 && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2 border border-green-600"></div>
              <span className="text-sm font-medium text-gray-700">Positive</span>
            </div>
          )}
          {negativePercent > 0 && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2 border border-red-600"></div>
              <span className="text-sm font-medium text-gray-700">Negative</span>
            </div>
          )}
          {neutralPercent > 0 && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2 border border-yellow-600"></div>
              <span className="text-sm font-medium text-gray-700">Neutral</span>
            </div>
          )}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl border-2 border-blue-200 shadow-lg">
        <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Key Insights
        </h4>
        <div className="space-y-3">
          {positivePercent > 30 && (
            <div className="flex items-center text-green-800 bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Content shows predominantly positive sentiment</span>
            </div>
          )}
          {negativePercent > 30 && (
            <div className="flex items-center text-red-800 bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="w-3 h-3 bg-red-600 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Content shows predominantly negative sentiment</span>
            </div>
          )}
          {neutralPercent > 50 && (
            <div className="flex items-center text-yellow-800 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="w-3 h-3 bg-yellow-600 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Content shows predominantly neutral sentiment</span>
            </div>
          )}
          {Math.abs(positivePercent - negativePercent) < 20 && positivePercent > 0 && negativePercent > 0 && (
            <div className="flex items-center text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
              <span className="text-sm font-medium">Sentiment is well-balanced between positive and negative</span>
            </div>
          )}
          {total === 0 && (
            <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
              <span className="text-sm font-medium">No content analyzed yet</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 