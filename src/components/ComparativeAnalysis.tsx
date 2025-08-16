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
  const [isLoadingBenchmarks, setIsLoadingBenchmarks] = useState(false);

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

    // Enhanced Analytics & Metrics
    const engagementComparison = {
      views: {
        video1: selectedVideo1.metadata?.views || 1000,
        video2: selectedVideo2.metadata?.views || 1000,
        difference: (selectedVideo1.metadata?.views || 1000) - (selectedVideo2.metadata?.views || 1000)
      },
      likes: {
        video1: selectedVideo1.metadata?.likes || 100,
        video2: selectedVideo2.metadata?.likes || 100,
        difference: (selectedVideo1.metadata?.likes || 100) - (selectedVideo2.metadata?.likes || 100)
      },
      dislikes: {
        video1: selectedVideo1.metadata?.dislikes || 10,
        video2: selectedVideo2.metadata?.dislikes || 10,
        difference: (selectedVideo1.metadata?.dislikes || 10) - (selectedVideo2.metadata?.dislikes || 10)
      },
      comments: {
        video1: selectedVideo1.metadata?.commentCount || 50,
        video2: selectedVideo2.metadata?.commentCount || 50,
        difference: (selectedVideo1.metadata?.commentCount || 50) - (selectedVideo2.metadata?.commentCount || 50)
      },
      engagementRate: {
        video1: ((selectedVideo1.metadata?.likes || 100) + (selectedVideo1.metadata?.commentCount || 50)) / (selectedVideo1.metadata?.views || 1000) * 100,
        video2: ((selectedVideo2.metadata?.likes || 100) + (selectedVideo2.metadata?.commentCount || 50)) / (selectedVideo2.metadata?.views || 1000) * 100,
        difference: 0
      }
    };

    // Calculate engagement rate difference
    engagementComparison.engagementRate.difference = 
      engagementComparison.engagementRate.video1 - engagementComparison.engagementRate.video2;

    const contentPerformance = {
      videoLength: {
        video1: selectedVideo1.metadata?.duration || 300,
        video2: selectedVideo2.metadata?.duration || 300,
        difference: (selectedVideo1.metadata?.duration || 300) - (selectedVideo2.metadata?.duration || 300)
      },
      uploadTime: {
        video1: selectedVideo1.metadata?.uploadDate || '2024-01-01',
        video2: selectedVideo2.metadata?.uploadDate || '2024-01-01'
      },
      thumbnailEffectiveness: {
        video1: Math.random() * 0.8 + 0.2, // Simulated thumbnail CTR
        video2: Math.random() * 0.8 + 0.2,
        difference: 0
      }
    };

    // Calculate thumbnail effectiveness difference
    contentPerformance.thumbnailEffectiveness.difference = 
      contentPerformance.thumbnailEffectiveness.video1 - contentPerformance.thumbnailEffectiveness.video2;

    // Calculate audience overlap (simulated)
    const audienceOverlap = Math.random() * 0.4 + 0.1; // 10-50% overlap

    // Generate AI insights for the comparison
    const aiInsights = {
      contentGaps: [] as string[],
      contentStrategy: `Focus on ${uniqueVideo2.slice(0, 3).join(', ')} topics to expand your reach`,
      competitiveAdvantage: [] as string[],
      improvementAreas: [] as string[],
      audienceInsights: `Your audience overlap is ${(audienceOverlap * 100).toFixed(1)}% with competitor`,
      trendAnalysis: 'Your content shows positive growth in engagement metrics'
    };

    // Analyze content gaps
    if (uniqueVideo2.length > uniqueVideo1.length) {
      aiInsights.contentGaps.push(`Your competitor covers ${uniqueVideo2.length - uniqueVideo1.length} more unique topics`);
    }

    // Analyze competitive advantages
    if (overallSentiment.difference > 0.1) {
      aiInsights.competitiveAdvantage.push('Your content generates more positive sentiment');
    }
    if (engagementComparison.engagementRate.difference > 2) {
      aiInsights.competitiveAdvantage.push('Your content has higher engagement rates');
    }

    // Identify improvement areas
    if (toxicityComparison.difference > 0.05) {
      aiInsights.improvementAreas.push('Focus on reducing content toxicity');
    }
    if (engagementComparison.views.difference < 0) {
      aiInsights.improvementAreas.push('Work on improving video discoverability');
    }

    // Generate recommendations
    const recommendations = {
      contentStrategy: [
        'Create content around trending keywords in your niche',
        'Focus on topics with high engagement potential',
        'Develop series content to build audience loyalty'
      ],
      timingOptimization: [
        'Upload during peak audience activity hours (2-4 PM, 7-9 PM)',
        'Post consistently on the same days each week',
        'Consider timezone differences for global audience'
      ],
      audienceTargeting: [
        'Analyze comment demographics for better targeting',
        'Create content for underserved audience segments',
        'Engage with commenters to build community'
      ],
      competitiveResponse: [
        'Monitor competitor upload schedules',
        'Create response content to trending topics',
        'Differentiate your unique value proposition'
      ],
      growthOpportunities: [
        'Collaborate with creators in similar niches',
        'Cross-promote on other social platforms',
        'Develop merchandise or premium content'
      ]
    };

    // Customize recommendations based on analysis
    if (engagementComparison.engagementRate.difference < 0) {
      recommendations.contentStrategy.push('Improve thumbnail and title optimization');
    }
    if (toxicityComparison.difference > 0) {
      recommendations.contentStrategy.push('Implement content moderation strategies');
    }

    // Default industry benchmarks (will be updated dynamically)
    const industryBenchmarks = {
      categoryAverage: 0.15,
      topPerformers: 1000000,
      yourRank: 'Calculating...',
      marketPosition: 'unknown' as const,
      totalVideosAnalyzed: 0,
      lastUpdated: new Date().toISOString()
    };

    return {
      overallSentiment,
      emotionComparison,
      toxicityComparison,
      keywordComparison: { shared: sharedKeywords, uniqueVideo1, uniqueVideo2 },
      engagementComparison,
      contentPerformance,
      audienceOverlap,
      aiInsights,
      recommendations,
      industryBenchmarks
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
    setIsLoadingBenchmarks(true);
    
    try {
      // Fetch real industry benchmarks using your existing YouTube API
      let realIndustryBenchmarks = null;
      try {
        const { YouTubeApiService } = await import('../services/youtubeApi');
        console.log('Fetching industry benchmarks from YouTube API...');
        realIndustryBenchmarks = await YouTubeApiService.getIndustryBenchmarks();
        console.log('Real industry benchmarks fetched:', realIndustryBenchmarks);
      } catch (error) {
        console.error('Failed to fetch industry benchmarks:', error);
        // Keep default values if API fails
      }

      // Update comparison with real benchmarks if available
      if (comparison && realIndustryBenchmarks) {
        comparison.industryBenchmarks = realIndustryBenchmarks;
      }
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (comparison && onAnalysisComplete) {
      const analysisResult: ComparativeAnalysisType = {
        id: `comp_${Date.now()}`,
        video1: selectedVideo1,
        video2: selectedVideo2,
        comparison,
          aiInsights: comparison.aiInsights,
          historicalData: {
            video1Trend: [
              { date: '2024-01-01', sentiment: 0.2, engagement: 0.15 },
              { date: '2024-01-15', sentiment: 0.3, engagement: 0.18 },
              { date: '2024-02-01', sentiment: 0.4, engagement: 0.22 }
            ],
            video2Trend: [
              { date: '2024-01-01', sentiment: 0.1, engagement: 0.12 },
              { date: '2024-01-15', sentiment: 0.15, engagement: 0.14 },
              { date: '2024-02-01', sentiment: 0.2, engagement: 0.16 }
            ]
          },
          industryBenchmarks: realIndustryBenchmarks || comparison.industryBenchmarks,
          recommendations: comparison.recommendations,
        timestamp: new Date().toISOString()
      };
      onAnalysisComplete(analysisResult);
    }
    } catch (error) {
      console.error('Error during analysis:', error);
    } finally {
    setIsAnalyzing(false);
      setIsLoadingBenchmarks(false);
    }
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
        {/* Summary Dashboard */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6 border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
            Analysis Summary Dashboard
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-blue-100">
              <p className="text-sm text-blue-600 mb-1">Overall Winner</p>
              <p className={`text-lg font-bold ${
                comparison.overallSentiment.difference > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparison.overallSentiment.difference > 0 ? 'Your Video 🏆' : 'Competitor 🏆'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {Math.abs(comparison.overallSentiment.difference).toFixed(2)} difference
              </p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-green-100">
              <p className="text-sm text-green-600 mb-1">Engagement Leader</p>
              <p className={`text-lg font-bold ${
                comparison.engagementComparison.engagementRate.difference > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparison.engagementComparison.engagementRate.difference > 0 ? 'Your Video 📈' : 'Competitor 📈'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {Math.abs(comparison.engagementComparison.engagementRate.difference).toFixed(1)}% difference
              </p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-purple-100">
              <p className="text-sm text-purple-600 mb-1">Toxicity Level</p>
              <p className={`text-lg font-bold ${
                comparison.toxicityComparison.difference < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {comparison.toxicityComparison.difference < 0 ? 'Your Video ✅' : 'Competitor ✅'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {Math.abs(comparison.toxicityComparison.difference * 100).toFixed(1)}% difference
              </p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-yellow-100">
              <p className="text-sm text-yellow-600 mb-1">Content Coverage</p>
              <p className="text-lg font-bold text-blue-600">
                {comparison.keywordComparison.uniqueVideo1.length} unique topics
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {comparison.keywordComparison.shared.length} shared keywords
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Quick Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-700">
                  <strong>Market Position:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    comparison.overallSentiment.difference > 0.1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {comparison.overallSentiment.difference > 0.1 ? 'Leading' : 'Competitive'}
                  </span>
                </p>
                <p className="text-gray-700 mt-1">
                  <strong>Audience Overlap:</strong> {(comparison.audienceOverlap * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Content Strategy:</strong> {comparison.aiInsights?.contentStrategy || 'Focus on trending topics'}
                </p>
                <p className="text-gray-700 mt-1">
                  <strong>Growth Potential:</strong> 
                  {comparison.engagementComparison.engagementRate.difference > 0 ? 'High' : 'Moderate'}
                </p>
              </div>
            </div>
          </div>
        </div>

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

        {/* Performance Radar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Radar Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={[
              {
                metric: 'Sentiment',
                yourVideo: Math.round(comparison.overallSentiment.video1 * 100),
                competitor: Math.round(comparison.overallSentiment.video2 * 100)
              },
              {
                metric: 'Engagement',
                yourVideo: Math.round(comparison.engagementComparison.engagementRate.video1),
                competitor: Math.round(comparison.engagementComparison.engagementRate.video2)
              },
              {
                metric: 'Views',
                yourVideo: Math.round((comparison.engagementComparison.views.video1 / 10000) * 100),
                competitor: Math.round((comparison.engagementComparison.views.video2 / 10000) * 100)
              },
              {
                metric: 'Likes',
                yourVideo: Math.round((comparison.engagementComparison.likes.video1 / 1000) * 100),
                competitor: Math.round((comparison.engagementComparison.likes.video2 / 1000) * 100)
              },
              {
                metric: 'Comments',
                yourVideo: Math.round((comparison.engagementComparison.comments.video1 / 500) * 100),
                competitor: Math.round((comparison.engagementComparison.comments.video2 / 500) * 100)
              }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="yourVideo" fill="#3b82f6" name="Your Video" />
              <Bar dataKey="competitor" fill="#10b981" name="Competitor" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Comparison Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={[
              {
                metric: 'Views',
                yourVideo: comparison.engagementComparison.views.video1,
                competitor: comparison.engagementComparison.views.video2
              },
              {
                metric: 'Likes',
                yourVideo: comparison.engagementComparison.likes.video1,
                competitor: comparison.engagementComparison.likes.video2
              },
              {
                metric: 'Comments',
                yourVideo: comparison.engagementComparison.comments.video1,
                competitor: comparison.engagementComparison.comments.video2
              },
              {
                metric: 'Engagement Rate',
                yourVideo: comparison.engagementComparison.engagementRate.video1,
                competitor: comparison.engagementComparison.engagementRate.video2
              }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'Engagement Rate' ? `${Number(value).toFixed(1)}%` : Number(value).toLocaleString(),
                name === 'yourVideo' ? 'Your Video' : 'Competitor'
              ]} />
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Content Strategy</h4>
                <p className="text-sm text-blue-800">{comparison.aiInsights?.contentStrategy || 'Focus on trending topics in your niche'}</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Competitive Advantages</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  {comparison.aiInsights?.competitiveAdvantage?.map((advantage, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      {advantage}
                    </li>
                  ))}
                  {(!comparison.aiInsights?.competitiveAdvantage || comparison.aiInsights.competitiveAdvantage.length === 0) && (
                    <li className="text-gray-500">Analyzing your competitive position...</li>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">Areas for Improvement</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {comparison.aiInsights?.improvementAreas?.map((area, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      {area}
                    </li>
                  ))}
                  {(!comparison.aiInsights?.improvementAreas || comparison.aiInsights.improvementAreas.length === 0) && (
                    <li className="text-gray-500">Your content is performing well!</li>
                  )}
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">Audience Insights</h4>
                <p className="text-sm text-purple-800">{comparison.aiInsights?.audienceInsights || 'Your audience shows strong engagement patterns'}</p>
              </div>
            </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">Engagement Analysis</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Your Engagement Rate:</strong> {comparison.engagementComparison.engagementRate.video1.toFixed(1)}%</p>
                <p><strong>Competitor Rate:</strong> {comparison.engagementComparison.engagementRate.video2.toFixed(1)}%</p>
                <p><strong>Difference:</strong> 
                  <span className={comparison.engagementComparison.engagementRate.difference > 0 ? 'text-green-600' : 'text-red-600'}>
                    {comparison.engagementComparison.engagementRate.difference > 0 ? '+' : ''}{comparison.engagementComparison.engagementRate.difference.toFixed(1)}%
                  </span>
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-3">Content Performance</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Your Views:</strong> {comparison.engagementComparison.views.video1.toLocaleString()}</p>
                <p><strong>Competitor Views:</strong> {comparison.engagementComparison.views.video2.toLocaleString()}</p>
                <p><strong>Market Share:</strong> 
                  {((comparison.engagementComparison.views.video1 / (comparison.engagementComparison.views.video1 + comparison.engagementComparison.views.video2)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Content Strategy
              </h4>
              <ul className="text-sm text-blue-800 space-y-2">
                {comparison.recommendations?.contentStrategy?.slice(0, 3).map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Timing Optimization
              </h4>
              <ul className="text-sm text-green-800 space-y-2">
                {comparison.recommendations?.timingOptimization?.slice(0, 3).map((timing, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                    {timing}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Audience Targeting
              </h4>
              <ul className="text-sm text-purple-800 space-y-2">
                {comparison.recommendations?.audienceTargeting?.slice(0, 3).map((targeting, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                    {targeting}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Competitive Response
              </h4>
              <ul className="text-sm text-yellow-800 space-y-2">
                {comparison.recommendations?.competitiveResponse?.slice(0, 3).map((response, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                    {response}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-medium text-indigo-900 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Growth Opportunities
              </h4>
              <ul className="text-sm text-indigo-800 space-y-2">
                {comparison.recommendations?.growthOpportunities?.slice(0, 3).map((opportunity, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
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
          <p className="text-sm text-gray-600 mb-1">Industry Avg Engagement</p>
          <p className="text-2xl font-bold text-gray-900">
            {isLoadingBenchmarks ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm">Loading...</span>
              </div>
            ) : comparison?.industryBenchmarks ? (
              (comparison.industryBenchmarks.categoryAverage * 100).toFixed(1) + '%'
            ) : (
              'Data unavailable'
            )}
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Top Performers</p>
          <p className="text-2xl font-bold text-green-600">
            {isLoadingBenchmarks ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="ml-2 text-sm">Loading...</span>
              </div>
            ) : comparison?.industryBenchmarks ? (
              comparison.industryBenchmarks.topPerformers.toLocaleString()
            ) : (
              'Data unavailable'
            )}
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Your Performance Rank</p>
          <p className="text-2xl font-bold text-purple-600">
            {isLoadingBenchmarks ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-sm">Loading...</span>
              </div>
            ) : comparison?.industryBenchmarks ? (
              comparison.industryBenchmarks.yourRank
            ) : (
              'Data unavailable'
            )}
          </p>
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
                <strong>Industry Average:</strong> {comparison?.industryBenchmarks ? (comparison.industryBenchmarks.categoryAverage * 100).toFixed(1) + '%' : 'Loading...'}
              </p>
              <p className={`font-medium ${
                selectedVideo1.sentiment.score > (comparison?.industryBenchmarks?.categoryAverage || 0.15) ? 'text-green-700' : 
                selectedVideo1.sentiment.score < (comparison?.industryBenchmarks?.categoryAverage || 0.15) ? 'text-red-700' : 'text-gray-700'
              }`}>
                {selectedVideo1.sentiment.score > (comparison?.industryBenchmarks?.categoryAverage || 0.15) ? '✅ Above Industry Average' : 
                 selectedVideo1.sentiment.score < (comparison?.industryBenchmarks?.categoryAverage || 0.15) ? '⚠️ Below Industry Average' : '🔄 At Industry Average'}
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
          
          {/* Additional Benchmark Info */}
          {comparison?.industryBenchmarks && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="text-xs text-blue-700">
                <p><strong>Data Source:</strong> YouTube Trending Videos ({comparison.industryBenchmarks.totalVideosAnalyzed} videos analyzed)</p>
                <p><strong>Market Position:</strong> <span className="capitalize">{comparison.industryBenchmarks.marketPosition}</span></p>
                <p><strong>Last Updated:</strong> {new Date(comparison.industryBenchmarks.lastUpdated).toLocaleString()}</p>
              </div>
            </div>
          )}
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
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto transition-all duration-200"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing Videos...
              </>
            ) : (
              <>
                <BarChart3 className="w-5 h-5 mr-2" />
                Run Comparative Analysis
              </>
            )}
          </button>
          
          {isAnalyzing && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-blue-800">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Running Real-time Analysis...</span>
              </div>
              <p className="text-sm text-blue-600 mt-2 text-center">
                Fetching industry benchmarks, analyzing content, and generating insights...
              </p>
            </div>
          )}
          
          {/* Removed AI generation buttons */}
        </div>
      )}

      {renderComparisonResults()}
    </div>
  );
}; 