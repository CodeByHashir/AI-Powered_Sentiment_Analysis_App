import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SentimentAnalysis, Comment } from '../types';
import { TrendingUp, TrendingDown, AlertTriangle, Heart, MessageCircle, BarChart3 } from 'lucide-react';

interface SentimentDashboardProps {
  analysis: SentimentAnalysis;
  onExport?: (format: 'pdf' | 'csv') => void;
}

const COLORS = {
  positive: '#10B981',
  negative: '#EF4444',
  neutral: '#6B7280',
  joy: '#F59E0B',
  sadness: '#3B82F6',
  anger: '#DC2626',
  fear: '#7C3AED',
  surprise: '#EC4899',
  disgust: '#059669'
};

export const SentimentDashboard: React.FC<SentimentDashboardProps> = ({ analysis, onExport }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'emotions' | 'toxicity' | 'trends'>('overview');

  const emotionData = useMemo(() => {
    if (!analysis.emotionDistribution) return [];
    return Object.entries(analysis.emotionDistribution).map(([emotion, value]) => ({
      name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      value: Math.round(value * 100)
    }));
  }, [analysis.emotionDistribution]);

  const sentimentData = useMemo(() => {
    if (!analysis.commentStats) return [];
    return [
      { name: 'Positive', value: analysis.commentStats.positive, color: COLORS.positive },
      { name: 'Negative', value: analysis.commentStats.negative, color: COLORS.negative },
      { name: 'Neutral', value: analysis.commentStats.neutral, color: COLORS.neutral }
    ];
  }, [analysis.commentStats]);

  const toxicityData = useMemo(() => {
    if (!analysis.toxicitySummary) return [];
    return [
      { name: 'Hate Speech', value: Math.round(analysis.toxicitySummary.hate_speech * 100) },
      { name: 'Spam', value: Math.round(analysis.toxicitySummary.spam * 100) },
      { name: 'Offensive', value: Math.round(analysis.toxicitySummary.offensive * 100) }
    ];
  }, [analysis.toxicitySummary]);

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Sentiment Score Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
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
      </div>

      {/* Comments Stats Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Comments</p>
            <p className="text-2xl font-bold text-gray-900">{analysis.commentStats?.total || 0}</p>
          </div>
          <MessageCircle className="w-8 h-8 text-green-500" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Positive: {analysis.commentStats?.positive || 0}</span>
            <span className="text-red-600">Negative: {analysis.commentStats?.negative || 0}</span>
          </div>
        </div>
      </div>

      {/* Toxicity Alert Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Toxicity Level</p>
            <p className="text-2xl font-bold text-gray-900">
              {analysis.toxicitySummary ? Math.round(analysis.toxicitySummary.overall * 100) : 0}%
            </p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {analysis.toxicitySummary && analysis.toxicitySummary.overall > 0.3 ? 'High' :
           analysis.toxicitySummary && analysis.toxicitySummary.overall > 0.1 ? 'Medium' : 'Low'}
        </p>
      </div>

      {/* Keywords Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Key Insights</p>
            <p className="text-2xl font-bold text-gray-900">{analysis.keywords?.length || 0}</p>
          </div>
          <Heart className="w-8 h-8 text-purple-500" />
        </div>
        <p className="text-sm text-gray-500 mt-2">Keywords identified</p>
      </div>
    </div>
  );

  const renderEmotions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emotion Distribution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emotionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Top Emotions</h4>
            {emotionData
              .sort((a, b) => b.value - a.value)
              .slice(0, 3)
              .map((emotion, index) => (
                <div key={emotion.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{emotion.name}</span>
                  <span className="text-lg font-bold text-gray-900">{emotion.value}%</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Top Loved & Criticized Points */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Most Loved Points
          </h3>
          <div className="space-y-3">
            {analysis.topLovedPoints?.slice(0, 5).map((point, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 font-bold text-sm">{index + 1}</span>
                <p className="text-sm text-gray-700">{point}</p>
              </div>
            )) || (
              <p className="text-gray-500 text-sm">No specific positive points identified</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Most Criticized Points
          </h3>
          <div className="space-y-3">
            {analysis.topCriticizedPoints?.slice(0, 5).map((point, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <span className="text-red-600 font-bold text-sm">{index + 1}</span>
                <p className="text-sm text-gray-700">{point}</p>
              </div>
            )) || (
              <p className="text-gray-500 text-sm">No specific negative points identified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderToxicity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Toxicity Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={toxicityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {toxicityData.map((item) => (
          <div key={item.name} className="bg-white rounded-lg shadow-md p-6 text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h4>
            <p className={`text-3xl font-bold ${
              item.value > 30 ? 'text-red-600' : item.value > 15 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {item.value}%
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {item.value > 30 ? 'High Risk' : item.value > 15 ? 'Medium Risk' : 'Low Risk'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trends</h3>
      <div className="text-center py-12 text-gray-500">
        <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p>Trend analysis will be available when multiple analyses are performed over time.</p>
        <p className="text-sm">This feature tracks sentiment changes across different time periods.</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sentiment Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights and analytics for your content</p>
        </div>
        {onExport && (
          <div className="flex space-x-3">
            <button
              onClick={() => onExport('pdf')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export PDF
            </button>
            <button
              onClick={() => onExport('csv')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Export CSV
            </button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'emotions', label: 'Emotions & Insights', icon: Heart },
            { id: 'toxicity', label: 'Toxicity Detection', icon: AlertTriangle },
            { id: 'trends', label: 'Trends', icon: TrendingUp }
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
        {activeTab === 'emotions' && renderEmotions()}
        {activeTab === 'toxicity' && renderToxicity()}
        {activeTab === 'trends' && renderTrends()}
      </div>
    </div>
  );
}; 