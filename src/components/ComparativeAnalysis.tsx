import React, { useState, useMemo } from 'react';
import { Target, Users, BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SentimentAnalysis, ComparativeAnalysis as ComparativeAnalysisType } from '../types';

interface ComparativeAnalysisProps {
  video1?: SentimentAnalysis;
  video2?: SentimentAnalysis;
  onAnalysisComplete?: (comparison: ComparativeAnalysisType) => void;
}

export const ComparativeAnalysis: React.FC<ComparativeAnalysisProps> = ({
  video1,
  video2,
  onAnalysisComplete
}): JSX.Element => {
  const [selectedVideo1, setSelectedVideo1] = useState<SentimentAnalysis | undefined>(video1);
  const [selectedVideo2, setSelectedVideo2] = useState<SentimentAnalysis | undefined>(video2);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [video1Url, setVideo1Url] = useState('');
  const [video2Url, setVideo2Url] = useState('');
  const [isAnalyzingVideo1, setIsAnalyzingVideo1] = useState(false);
  const [isAnalyzingVideo2, setIsAnalyzingVideo2] = useState(false);
  const [video1Error, setVideo1Error] = useState('');
  const [video2Error, setVideo2Error] = useState('');

  const comparison = useMemo(() => {
    if (!selectedVideo1 || !selectedVideo2) return null;

    // Calculate overall sentiment comparison
    const overallSentiment = {
      video1: selectedVideo1.sentiment.score,
      video2: selectedVideo2.sentiment.score,
      difference: selectedVideo1.sentiment.score - selectedVideo2.sentiment.score
    };

    // Calculate emotion comparison
    const emotionComparison = {
      joy: {
        video1: selectedVideo1.emotionDistribution?.joy || 0,
        video2: selectedVideo2.emotionDistribution?.joy || 0,
        difference: (selectedVideo1.emotionDistribution?.joy || 0) - (selectedVideo2.emotionDistribution?.joy || 0)
      },
      sadness: {
        video1: selectedVideo1.emotionDistribution?.sadness || 0,
        video2: selectedVideo2.emotionDistribution?.sadness || 0,
        difference: (selectedVideo1.emotionDistribution?.sadness || 0) - (selectedVideo2.emotionDistribution?.sadness || 0)
      },
      anger: {
        video1: selectedVideo1.emotionDistribution?.anger || 0,
        video2: selectedVideo2.emotionDistribution?.anger || 0,
        difference: (selectedVideo1.emotionDistribution?.anger || 0) - (selectedVideo2.emotionDistribution?.anger || 0)
      },
      fear: {
        video1: selectedVideo1.emotionDistribution?.fear || 0,
        video2: selectedVideo2.emotionDistribution?.fear || 0,
        difference: (selectedVideo1.emotionDistribution?.fear || 0) - (selectedVideo2.emotionDistribution?.fear || 0)
      },
      surprise: {
        video1: selectedVideo1.emotionDistribution?.surprise || 0,
        video2: selectedVideo2.emotionDistribution?.surprise || 0,
        difference: (selectedVideo1.emotionDistribution?.surprise || 0) - (selectedVideo2.emotionDistribution?.surprise || 0)
      },
      disgust: {
        video1: selectedVideo1.emotionDistribution?.disgust || 0,
        video2: selectedVideo2.emotionDistribution?.disgust || 0,
        difference: (selectedVideo1.emotionDistribution?.disgust || 0) - (selectedVideo2.emotionDistribution?.disgust || 0)
      }
    };

    // Calculate toxicity comparison
    const toxicityComparison = {
      video1: selectedVideo1.toxicitySummary?.overall || 0,
      video2: selectedVideo2.toxicitySummary?.overall || 0,
      difference: (selectedVideo1.toxicitySummary?.overall || 0) - (selectedVideo2.toxicitySummary?.overall || 0)
    };

    // Calculate keyword comparison
    const sharedKeywords = (selectedVideo1.keywords || []).filter(keyword => 
      selectedVideo2.keywords?.includes(keyword)
    );
    const uniqueVideo1 = (selectedVideo1.keywords || []).filter(keyword => 
      !selectedVideo2.keywords?.includes(keyword)
    );
    const uniqueVideo2 = (selectedVideo2.keywords || []).filter(keyword => 
      !selectedVideo1.keywords?.includes(keyword)
    );

    return {
      overallSentiment,
      emotionComparison,
      toxicityComparison,
      keywordComparison: { shared: sharedKeywords, uniqueVideo1, uniqueVideo2 }
    };
  }, [selectedVideo1, selectedVideo2]);

  const validateYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleVideo1Analysis = async () => {
    if (!video1Url.trim()) return;
    
    setVideo1Error('');
    
    if (!validateYouTubeUrl(video1Url)) {
      setVideo1Error('Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=...)');
      return;
    }
    
    setIsAnalyzingVideo1(true);
    try {
      // Import the YouTube API service
      const { YouTubeApiService } = await import('../services/youtubeApi');
      
      const result = await YouTubeApiService.analyzeYouTubeContent({
        url: video1Url,
        category: 'youtube',
        analyzeComments: true,
        maxComments: 100
      });
      
      setSelectedVideo1(result);
      setVideo1Url('');
      setVideo1Error('');
    } catch (error) {
      console.error('Error analyzing video 1:', error);
      setVideo1Error('Failed to analyze video. Please check the URL and try again.');
    } finally {
      setIsAnalyzingVideo1(false);
    }
  };

  const handleVideo2Analysis = async () => {
    if (!video2Url.trim()) return;
    
    setVideo2Error('');
    
    if (!validateYouTubeUrl(video2Url)) {
      setVideo2Error('Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=...)');
      return;
    }
    
    setIsAnalyzingVideo2(true);
    try {
      // Import the YouTube API service
      const { YouTubeApiService } = await import('../services/youtubeApi');
      
      const result = await YouTubeApiService.analyzeYouTubeContent({
        url: video2Url,
        category: 'youtube',
        analyzeComments: true,
        maxComments: 100
      });
      
      setSelectedVideo2(result);
      setVideo2Url('');
      setVideo2Error('');
    } catch (error) {
      console.error('Error analyzing video 2:', error);
      setVideo2Error('Failed to analyze video. Please check the URL and try again.');
    } finally {
      setIsAnalyzingVideo2(false);
    }
  };

  const handleAnalysis = async () => {
    if (!selectedVideo1 || !selectedVideo2) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (comparison && onAnalysisComplete) {
      const analysisResult: ComparativeAnalysisType = {
        id: `comp_${Date.now()}`,
        video1: selectedVideo1,
        video2: selectedVideo2,
        comparison,
        timestamp: new Date().toISOString()
      };
      onAnalysisComplete(analysisResult);
    }
    
    setIsAnalyzing(false);
  };

  const renderVideoSelector = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Video 1 Selector */}
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Your Video
        </h3>
        {selectedVideo1 ? (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900">{selectedVideo1.title || 'Untitled'}</p>
              <p className="text-sm text-blue-600">Sentiment: {selectedVideo1.sentiment.score.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setSelectedVideo1(undefined)}
              className="w-full px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
            >
              Change Video
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <Target className="w-12 h-12 text-blue-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">Enter your video URL for analysis</p>
            </div>
            <div className="space-y-3">
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={video1Url}
                onChange={(e) => setVideo1Url(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  video1Error ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {video1Error && (
                <p className="text-sm text-red-600">{video1Error}</p>
              )}
              <button 
                onClick={handleVideo1Analysis}
                disabled={!video1Url.trim() || isAnalyzingVideo1}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isAnalyzingVideo1 ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  'Analyze Video'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Video 2 Selector */}
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-green-200">
        <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Competitor Video
        </h3>
        {selectedVideo2 ? (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-900">{selectedVideo2.title || 'Untitled'}</p>
              <p className="text-sm text-green-600">Sentiment: {selectedVideo2.sentiment.score.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setSelectedVideo2(undefined)}
              className="w-full px-3 py-2 text-sm text-green-600 border border-green-300 rounded-lg hover:bg-green-50"
            >
              Change Video
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <Users className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">Enter competitor video URL for analysis</p>
            </div>
            <div className="space-y-3">
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={video2Url}
                onChange={(e) => setVideo2Url(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  video2Error ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {video2Error && (
                <p className="text-sm text-red-600">{video2Error}</p>
              )}
              <button 
                onClick={handleVideo2Analysis}
                disabled={!video2Url.trim() || isAnalyzingVideo2}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isAnalyzingVideo2 ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  'Analyze Video'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderComparisonResults = () => {
    if (!comparison) return null;

    return (
      <div className="space-y-8">
        {/* Overall Sentiment Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Overall Sentiment Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Your Video</p>
              <p className="text-2xl font-bold text-blue-900">
                {comparison.overallSentiment.video1 > 0 ? '+' : ''}{comparison.overallSentiment.video1.toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Competitor</p>
              <p className="text-2xl font-bold text-green-900">
                {comparison.overallSentiment.video2 > 0 ? '+' : ''}{comparison.overallSentiment.video2.toFixed(2)}
              </p>
            </div>
            <div className={`text-center p-4 rounded-lg ${
              comparison.overallSentiment.difference > 0 ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <p className="text-sm mb-1">Difference</p>
              <p className={`text-2xl font-bold ${
                comparison.overallSentiment.difference > 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {comparison.overallSentiment.difference > 0 ? '+' : ''}{comparison.overallSentiment.difference.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Emotion Comparison Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emotion Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={Object.entries(comparison.emotionComparison).map(([emotion, data]) => ({
              emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
              yourVideo: Math.round(data.video1 * 100),
              competitor: Math.round(data.video2 * 100),
              difference: Math.round(data.difference * 100)
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="emotion" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="yourVideo" fill="#3b82f6" name="Your Video" />
              <Bar dataKey="competitor" fill="#10b981" name="Competitor" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Toxicity Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Toxicity Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Your Video</p>
              <p className="text-2xl font-bold text-blue-900">
                {(comparison.toxicityComparison.video1 * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Competitor</p>
              <p className="text-2xl font-bold text-green-900">
                {(comparison.toxicityComparison.video2 * 100).toFixed(1)}%
              </p>
            </div>
            <div className={`text-center p-4 rounded-lg ${
              comparison.toxicityComparison.difference < 0 ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <p className="text-sm mb-1">Difference</p>
              <p className={`text-2xl font-bold ${
                comparison.toxicityComparison.difference < 0 ? 'text-green-900' : 'text-red-900'
              }`}>
                {comparison.toxicityComparison.difference > 0 ? '+' : ''}{(comparison.toxicityComparison.difference * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Keyword Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Keyword Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-3">Shared Keywords</h4>
              <div className="space-y-2">
                {comparison.keywordComparison.shared.length > 0 ? (
                  comparison.keywordComparison.shared.map((keyword, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-blue-200 text-blue-800 text-sm rounded mr-2 mb-2">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No shared keywords found</p>
                )}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-3">Your Unique Keywords</h4>
              <div className="space-y-2">
                {comparison.keywordComparison.uniqueVideo1.map((keyword, index) => (
                  <span key={index} className="inline-block px-2 py-1 bg-green-200 text-green-800 text-sm rounded mr-2 mb-2">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-3">Competitor Unique Keywords</h4>
              <div className="space-y-2">
                {comparison.keywordComparison.uniqueVideo2.map((keyword, index) => (
                  <span key={index} className="inline-block px-2 py-1 bg-purple-200 text-purple-800 text-sm rounded mr-2 mb-2">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI-Generated Summary Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              AI Summary Insights
            </h3>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-sm text-center">
              AI insights generation is temporarily unavailable.
            </p>
          </div>
        </div>

        {/* Strategic Competitor Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Strategic Competitor Analysis
            </h3>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-sm text-center">
              AI competitor analysis is temporarily unavailable.
            </p>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Actionable Recommendations
            </h3>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-sm text-center">
              AI recommendations are temporarily unavailable.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderIndustryBenchmark = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Benchmark & Market Position</h3>
      <p className="text-gray-600 mb-6">Compare your performance against industry averages and understand your market positioning.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Industry Avg Sentiment</p>
          <p className="text-2xl font-bold text-gray-900">+0.15</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Industry Avg Toxicity</p>
          <p className="text-2xl font-bold text-green-600">12%</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Your Performance Rank</p>
          <p className="text-2xl font-bold text-purple-600">Top 25%</p>
        </div>
      </div>

      {/* Market Position Analysis */}
      {selectedVideo1 && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3">Market Position Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-700 mb-2">
                <strong>Your Sentiment:</strong> {selectedVideo1.sentiment.score > 0 ? '+' : ''}{selectedVideo1.sentiment.score.toFixed(2)}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Industry Average:</strong> +0.15
              </p>
              <p className={`font-medium ${
                selectedVideo1.sentiment.score > 0.15 ? 'text-green-700' : 
                selectedVideo1.sentiment.score < 0.15 ? 'text-red-700' : 'text-gray-700'
              }`}>
                {selectedVideo1.sentiment.score > 0.15 ? '✅ Above Industry Average' : 
                 selectedVideo1.sentiment.score < 0.15 ? '⚠️ Below Industry Average' : '🔄 At Industry Average'}
              </p>
            </div>
            <div>
              <p className="text-gray-700 mb-2">
                <strong>Your Toxicity:</strong> {selectedVideo1.toxicitySummary ? Math.round(selectedVideo1.toxicitySummary.overall * 100) : 0}%
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Industry Average:</strong> 12%
              </p>
              <p className={`font-medium ${
                (selectedVideo1.toxicitySummary?.overall || 0) < 0.12 ? 'text-green-700' : 
                (selectedVideo1.toxicitySummary?.overall || 0) > 0.12 ? 'text-red-700' : 'text-gray-700'
              }`}>
                {(selectedVideo1.toxicitySummary?.overall || 0) < 0.12 ? '✅ Below Industry Average (Better)' : 
                 (selectedVideo1.toxicitySummary?.overall || 0) > 0.12 ? '⚠️ Above Industry Average (Worse)' : '🔄 At Industry Average'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Comparative Analysis</h2>
        <p className="text-gray-600">Compare your content with competitors to gain strategic insights</p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-2xl mx-auto">
          <p className="text-sm text-blue-800">
            <strong>How it works:</strong> Enter YouTube video URLs for both videos. Our AI will analyze the content, 
            comments, and sentiment to provide detailed comparisons and industry benchmarks.
          </p>
        </div>
      </div>

      {renderVideoSelector()}
      {renderIndustryBenchmark()}

      {selectedVideo1 && selectedVideo2 && (
        <div className="text-center space-y-4">
          <button
            onClick={handleAnalysis}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="w-5 h-5 mr-2" />
                Run Comparative Analysis
              </>
            )}
          </button>
          
          {/* Removed AI generation buttons */}
        </div>
      )}

      {renderComparisonResults()}
    </div>
  );
}; 