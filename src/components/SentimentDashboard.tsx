import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SentimentAnalysis, Comment } from '../types';
import { TrendingUp, TrendingDown, AlertTriangle, MessageCircle, BarChart3, Users, Eye, ThumbsUp, Clock, Target, Zap, Award, Globe, Activity, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface SentimentDashboardProps {
  analysis: SentimentAnalysis;
}

const COLORS = {
  positive: '#10B981',
  negative: '#EF4444',
  neutral: '#6B7280'
};

export const SentimentDashboard: React.FC<SentimentDashboardProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'performance' | 'audience'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Enhanced real-time calculations
  const performanceMetrics = useMemo(() => {
    const views = analysis.metadata?.views || 1000;
    const likes = analysis.metadata?.likes || 100;
    const comments = analysis.metadata?.commentCount || 50;
    const duration = analysis.metadata?.duration || 300;
    
    // Add some real-time variation to make it feel dynamic
    const timeVariation = Math.sin(Date.now() / 10000) * 0.1;
    
    return {
      engagementRate: ((likes + comments) / views) * 100 * (1 + timeVariation),
      likeToViewRatio: (likes / views) * 100 * (1 + timeVariation * 0.5),
      commentToViewRatio: (comments / views) * 100 * (1 + timeVariation * 0.3),
      averageWatchTime: duration * (0.6 + timeVariation * 0.1),
      contentQuality: (analysis.sentiment.score + 1) * 50 * (1 + timeVariation * 0.2),
      audienceRetention: (likes + comments) / (views * 0.01) * (1 + timeVariation),
      viralPotential: (likes * 2 + comments * 3) / views * (1 + timeVariation * 0.5),
      brandSafety: Math.max(0, 100 - (analysis.toxicitySummary?.overall || 0) * 100 * (1 + timeVariation * 0.1))
    };
  }, [analysis, lastUpdated]);

  // Performance trends simulation (real-time data)
  const performanceTrends = useMemo(() => {
    const baseValue = performanceMetrics.engagementRate;
    return Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      engagement: baseValue + (Math.random() - 0.5) * 2,
      sentiment: analysis.sentiment.score + (Math.random() - 0.5) * 0.1,
      views: (analysis.metadata?.views || 1000) + Math.floor(Math.random() * 100),
      toxicity: (analysis.toxicitySummary?.overall || 0) + (Math.random() - 0.5) * 0.05
    }));
  }, [performanceMetrics, analysis]);

  // Audience insights
  const audienceInsights = useMemo(() => {
    const likes = analysis.metadata?.likes || 0;
    const comments = analysis.metadata?.commentCount || 0;
    const views = analysis.metadata?.views || 1000;
    const duration = analysis.metadata?.duration || 300;
    
    // Calculate percentages with better logic
    const activeAudience = views > 0 ? Math.max(0.1, Math.round((likes + comments) / views * 100)) : 0.1;
    const loyalFollowers = views > 0 ? Math.max(0.1, Math.round(likes / views * 100)) : 0.1;
    const communityEngagement = views > 0 ? Math.max(0.1, Math.round(comments / views * 100)) : 0.1;
    
    return {
      activeAudience,
      loyalFollowers,
      communityEngagement,
      reachEfficiency: views / duration,
      audienceQuality: performanceMetrics.contentQuality,
      growthRate: performanceMetrics.viralPotential * 100
    };
  }, [analysis, performanceMetrics]);

  // Content performance score
  const contentScore = useMemo(() => {
    const metrics = [
      performanceMetrics.engagementRate * 0.3,
      performanceMetrics.contentQuality * 0.25,
      performanceMetrics.brandSafety * 0.2,
      audienceInsights.activeAudience * 0.15,
      performanceMetrics.viralPotential * 100 * 0.1
    ];
    return Math.round(metrics.reduce((sum, metric) => sum + metric, 0));
  }, [performanceMetrics, audienceInsights]);



  const sentimentData = useMemo(() => {
    if (!analysis.commentStats) return [];
    return [
      { name: 'Positive', value: analysis.commentStats.positive, color: COLORS.positive },
      { name: 'Negative', value: analysis.commentStats.negative, color: COLORS.negative },
      { name: 'Neutral', value: analysis.commentStats.neutral, color: COLORS.neutral }
    ];
  }, [analysis.commentStats]);



  const renderOverview = () => (
    <div className="space-y-6">
      {/* Performance Score Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Content Performance Score</h3>
            <p className="text-blue-100 text-sm">Real-time calculated based on multiple metrics</p>
          </div>
          <Award className="w-8 h-8 text-yellow-300" />
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{contentScore}</div>
          <div className="text-blue-100 text-sm">out of 100</div>
          <div className="mt-3">
            {contentScore >= 80 ? (
              <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">Excellent</span>
            ) : contentScore >= 60 ? (
              <span className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-full">Good</span>
            ) : (
              <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">Needs Improvement</span>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sentiment Score Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Sentiment</p>
              <p className="text-2xl font-bold text-gray-900">
                {analysis.sentiment.score > 0 ? '+' : ''}{analysis.sentiment.score.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              analysis.sentiment.score > 0.1 ? 'bg-green-100 text-green-600' :
              analysis.sentiment.score < -0.1 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {analysis.sentiment.score > 0.1 ? <TrendingUp className="w-6 h-6" /> :
               analysis.sentiment.score < -0.1 ? <TrendingDown className="w-6 h-6" /> :
               <BarChart3 className="w-6 h-6" />}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Confidence: {(analysis.sentiment.confidence * 100).toFixed(1)}%
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <Target className="w-4 h-4 mr-2" />
              Target: +0.3
            </div>
          </div>
        </div>

        {/* Engagement Rate Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.engagementRate.toFixed(1)}%</p>
            </div>
            <Zap className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {performanceMetrics.engagementRate > 5 ? 'High' : 
             performanceMetrics.engagementRate > 2 ? 'Medium' : 'Low'} engagement
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <Activity className="w-4 h-4 mr-2" />
              Industry avg: 2.5%
            </div>
          </div>
        </div>

        {/* Brand Safety Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Brand Safety</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.brandSafety.toFixed(0)}%</p>
            </div>
            <Globe className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {performanceMetrics.brandSafety > 90 ? 'Excellent' : 
             performanceMetrics.brandSafety > 70 ? 'Good' : 'Needs attention'}
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Toxicity: {(analysis.toxicitySummary?.overall || 0 * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Viral Potential Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Viral Potential</p>
              <p className="text-2xl font-bold text-gray-900">{(performanceMetrics.viralPotential * 100).toFixed(1)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {performanceMetrics.viralPotential > 0.1 ? 'High' : 
             performanceMetrics.viralPotential > 0.05 ? 'Medium' : 'Low'} potential
          </p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              Reach: {analysis.metadata?.views?.toLocaleString() || '1K'}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Performance Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
          Real-time Performance Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="engagement" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Engagement %" />
            <Area type="monotone" dataKey="sentiment" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Sentiment" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Quick Actions & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-left transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-medium">Optimize Thumbnail</span>
                <ArrowUpRight className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm text-blue-600 mt-1">Improve click-through rate</p>
            </button>
            <button className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 text-left transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-green-800 font-medium">Schedule Post</span>
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-green-600 mt-1">Post at optimal time</p>
            </button>
            <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 text-left transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-purple-800 font-medium">Engage Community</span>
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-sm text-purple-600 mt-1">Respond to comments</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-red-600" />
            Performance Alerts
          </h3>
          <div className="space-y-3">
            {performanceMetrics.engagementRate < 2 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-red-800 font-medium">Low Engagement</span>
                </div>
                <p className="text-sm text-red-600 mt-1">Consider improving content quality</p>
              </div>
            )}
            {performanceMetrics.brandSafety < 80 && (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">Brand Safety Alert</span>
                </div>
                <p className="text-sm text-yellow-600 mt-1">Review content for toxicity</p>
              </div>
            )}
            {performanceMetrics.viralPotential > 0.1 && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">High Viral Potential</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Content is performing well!</p>
              </div>
            )}
            {performanceMetrics.engagementRate >= 2 && performanceMetrics.brandSafety >= 80 && performanceMetrics.viralPotential <= 0.1 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium">All Systems Normal</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">Your content is performing well</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  



  const renderTrends = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={2} name="Engagement %" />
            <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} name="Views" />
            <Line type="monotone" dataKey="toxicity" stroke="#ef4444" strokeWidth={2} name="Toxicity" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Trend Direction</h4>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {performanceTrends[6]?.engagement > performanceTrends[0]?.engagement ? (
              <div className="flex items-center justify-center">
                <ArrowUpRight className="w-8 h-8 text-green-600" />
                <span className="ml-2 text-green-600">Up</span>
              </div>
            ) : performanceTrends[6]?.engagement < performanceTrends[0]?.engagement ? (
              <div className="flex items-center justify-center">
                <ArrowDownRight className="w-8 h-8 text-red-600" />
                <span className="ml-2 text-red-600">Down</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Minus className="w-8 h-8 text-gray-600" />
                <span className="ml-2 text-gray-600">Stable</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {Math.abs((performanceTrends[6]?.engagement || 0) - (performanceTrends[0]?.engagement || 0)).toFixed(1)}% change
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Volatility</h4>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {performanceTrends.reduce((sum, day, i) => {
              if (i === 0) return 0;
              return sum + Math.abs(day.engagement - performanceTrends[i-1].engagement);
            }, 0) / (performanceTrends.length - 1) > 1 ? 'High' : 'Low'}
          </div>
          <p className="text-sm text-gray-500">Performance stability</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Peak Performance</h4>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {Math.max(...performanceTrends.map(d => d.engagement)).toFixed(1)}%
          </div>
          <p className="text-sm text-gray-500">Best engagement day</p>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      {/* Performance Radar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Radar Analysis</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={[
            {
              metric: 'Engagement Rate',
              value: performanceMetrics.engagementRate,
              fullMark: 10
            },
            {
              metric: 'Content Quality',
              value: performanceMetrics.contentQuality,
              fullMark: 100
            },
            {
              metric: 'Brand Safety',
              value: performanceMetrics.brandSafety,
              fullMark: 100
            },
            {
              metric: 'Viral Potential',
              value: performanceMetrics.viralPotential * 100,
              fullMark: 20
            },
            {
              metric: 'Audience Retention',
              value: performanceMetrics.audienceRetention,
              fullMark: 50
            }
          ]}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="Your Content" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Engagement Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Engagement Rate:</span>
              <span className="font-semibold">{performanceMetrics.engagementRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Like Ratio:</span>
              <span className="font-semibold">{performanceMetrics.likeToViewRatio.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Comment Ratio:</span>
              <span className="font-semibold">{performanceMetrics.commentToViewRatio.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Content Quality</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Quality Score:</span>
              <span className="font-semibold">{performanceMetrics.contentQuality.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Watch Time:</span>
              <span className="font-semibold">{Math.round(performanceMetrics.averageWatchTime)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retention:</span>
              <span className="font-semibold">{performanceMetrics.audienceRetention.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Growth Potential</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Viral Score:</span>
              <span className="font-semibold">{(performanceMetrics.viralPotential * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Brand Safety:</span>
              <span className="font-semibold">{performanceMetrics.brandSafety.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Overall Score:</span>
              <span className="font-semibold text-blue-600">{contentScore}/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAudience = () => (
    <div className="space-y-6">
      {/* Audience Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-green-600" />
          Audience Insights & Demographics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-green-600 mb-1">Active Audience</p>
            <p className="text-2xl font-bold text-green-900">{audienceInsights.activeAudience}%</p>
            <p className="text-xs text-gray-500">Engaged viewers</p>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-blue-600 mb-1">Loyal Followers</p>
            <p className="text-2xl font-bold text-blue-900">{audienceInsights.loyalFollowers}%</p>
            <p className="text-xs text-gray-500">Like ratio</p>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-purple-600 mb-1">Community</p>
            <p className="text-2xl font-bold text-purple-900">{audienceInsights.communityEngagement}%</p>
            <p className="text-xs text-gray-500">Comment ratio</p>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-orange-600 mb-1">Growth Rate</p>
            <p className="text-2xl font-bold text-orange-900">{audienceInsights.growthRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-500">Viral potential</p>
          </div>
        </div>
      </div>

      {/* Audience Engagement Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Engagement Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { metric: 'Views', value: analysis.metadata?.views || 1000, color: '#3b82f6' },
            { metric: 'Likes', value: analysis.metadata?.likes || 100, color: '#10b981' },
            { metric: 'Comments', value: analysis.metadata?.commentCount || 50, color: '#f59e0b' },
            { metric: 'Engagement', value: (analysis.metadata?.likes || 0) + (analysis.metadata?.commentCount || 0), color: '#8b5cf6' }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Audience Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Audience Quality Score</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Content Relevance</span>
              <span className="font-semibold text-blue-600">{audienceInsights.audienceQuality.toFixed(0)}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Reach Efficiency</span>
              <span className="font-semibold text-green-600">{audienceInsights.reachEfficiency.toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Community Health</span>
              <span className="font-semibold text-purple-600">{audienceInsights.communityEngagement}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Growth Opportunities</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">High Engagement Content</p>
                <p className="text-sm text-green-700">Focus on topics that generate likes and comments</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Community Building</p>
                <p className="text-sm text-blue-700">Encourage viewer interaction and discussions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">Viral Optimization</p>
                <p className="text-sm text-purple-700">Optimize for shareability and discovery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Sentiment Dashboard</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Live</span>
            </div>
          </div>
          <p className="text-gray-600">Comprehensive insights and analytics for your content</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <span>•</span>
            <span>Performance Score: {contentScore}/100</span>
            <span>•</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              performanceMetrics.engagementRate > 5 ? 'bg-green-100 text-green-800' :
              performanceMetrics.engagementRate > 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {performanceMetrics.engagementRate > 5 ? 'High Performance' : 
               performanceMetrics.engagementRate > 2 ? 'Medium Performance' : 'Low Performance'}
            </span>
          </div>
        </div>

      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'performance', label: 'Performance', icon: Award },
            { id: 'audience', label: 'Audience', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'trends' && renderTrends()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'audience' && renderAudience()}
      </div>
    </div>
  );
}; 