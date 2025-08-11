import React, { useState, useCallback } from 'react';
import { SentimentAnalysis, SentimentCategory, TextAnalysisRequest, ComparativeAnalysis } from './types';
import SearchForm from './components/SearchForm';
import TextAnalysisForm from './components/TextAnalysisForm';
import AnalysisResult from './components/AnalysisResult';
import { SentimentDashboard } from './components/SentimentDashboard';
import { ComparativeAnalysis as ComparativeAnalysisComponent } from './components/ComparativeAnalysis';
import { ExportAndSharing } from './components/ExportAndSharing';
import { SentimentApiService } from './services/sentimentApi';
import { YouTubeApiService } from './services/youtubeApi';
import { ExportService } from './services/exportService';
import { BarChart2, AlertCircle, Sparkles, Zap, TrendingUp, FileText, Youtube, BarChart3, Users, Download } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SentimentAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<SentimentAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState<'analysis' | 'dashboard' | 'comparison' | 'export'>('analysis');
  const [comparisonResult, setComparisonResult] = useState<ComparativeAnalysis | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAnalyze = async (url: string, category: SentimentCategory) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result: SentimentAnalysis;
      
      if (category === 'youtube') {
        console.log('Starting YouTube analysis for:', url);
        
        // Use YouTube API service for YouTube URLs
        result = await YouTubeApiService.analyzeYouTubeContent({
          url,
          category,
          analyzeComments: true,
          maxComments: 100
        });
        
        console.log('YouTube content fetched successfully:', result);
        
        // For YouTube, we already have sentiment analysis from the comments
        // No need for additional BERT analysis
        result.modelVersion = 'YouTube + BERT v1.0';
      } else {
        // Use regular API service for other URLs
        result = await SentimentApiService.analyzeUrl(url, category);
      }
      
      setAnalysisResult(result);
      setAnalysisHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 analyses
    } catch (err) {
      console.error('Detailed error in handleAnalyze:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to analyze the URL. Please try again.';
      
      if (err instanceof Error) {
        if (err.message.includes('Invalid YouTube URL')) {
          errorMessage = 'Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=...)';
        } else if (err.message.includes('API key')) {
          errorMessage = 'YouTube API key error. Please check your configuration.';
        } else if (err.message.includes('quota')) {
          errorMessage = 'YouTube API quota exceeded. Please try again later.';
        } else if (err.message.includes('not found')) {
          errorMessage = 'Video not found or may be private.';
        } else {
          errorMessage = `Analysis failed: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextAnalysis = async (request: TextAnalysisRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use real API service to analyze text
      const result = await SentimentApiService.analyzeText(request);
      
      setAnalysisResult(result);
      setAnalysisHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 analyses
    } catch (err) {
      console.error('Error in text analysis:', err);
      setError('Failed to analyze text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setError(null);
  };

  const handleExport = async (options: any) => {
    if (analysisResult) {
      return await ExportService.exportReport(analysisResult, options);
    }
  };

  const handleComparisonComplete = (comparison: ComparativeAnalysis) => {
    setComparisonResult(comparison);
    setActiveTab('comparison');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg mr-3">
                <BarChart2 className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">AI Sentiment Analyzer</h1>
            </div>
            
            {/* Navigation Tabs */}
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1" />
                Analysis
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-1" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'comparison'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 inline mr-1" />
                Comparison
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'export'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Download className="w-4 h-4 inline mr-1" />
                Export
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <div className="text-red-800">
                <p className="font-medium">{error}</p>
                <button
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800 underline text-sm mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'analysis' && (
          <>
            {/* Analysis Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <SearchForm onSubmit={handleAnalyze} isLoading={isLoading} />
              <TextAnalysisForm onSubmit={handleTextAnalysis} isLoading={isLoading} />
            </div>

            {/* Analysis Results */}
            {analysisResult && (
              <AnalysisResult
                analysis={analysisResult}
              />
            )}

            {/* Analysis History */}
            {analysisHistory.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Analyses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisHistory.slice(1).map((analysis, index) => (
                    <div
                      key={analysis.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setAnalysisResult(analysis)}
                    >
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {analysis.title || 'Text Analysis'}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{new Date(analysis.timestamp).toLocaleDateString()}</span>
                        <span>{Math.round(analysis.sentiment.confidence * 100)}% confidence</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Welcome State */}
            {!analysisResult && analysisHistory.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-lg p-12 max-w-3xl mx-auto border border-gray-100">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Sparkles size={48} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Analyze</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Get instant sentiment analysis for any text or YouTube content using our advanced AI models.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                      <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                        <Youtube className="w-5 h-5 mr-2 text-red-500" />
                        YouTube Analysis
                      </h3>
                      <ul className="text-red-800 space-y-2 text-sm">
                        <li className="flex items-center">
                          <Youtube className="w-4 h-4 mr-2 text-red-500" />
                          Video transcripts
                        </li>
                        <li>• Comment sentiment analysis</li>
                        <li>• Community engagement insights</li>
                        <li>• Trend detection</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Text Analysis
                      </h3>
                      <ul className="text-blue-800 space-y-2 text-sm">
                        <li>• Direct text input</li>
                        <li>• Real-time analysis</li>
                        <li>• Confidence scoring</li>
                        <li>• Keyword extraction</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'dashboard' && analysisResult && (
          <SentimentDashboard
            analysis={analysisResult}
            onExport={handleExport}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparativeAnalysisComponent
            video1={analysisResult || undefined}
            video2={undefined}
            onAnalysisComplete={handleComparisonComplete}
          />
        )}

        {activeTab === 'export' && analysisResult && (
          <ExportAndSharing
            analysis={analysisResult}
            onExport={async (options) => {
              const result = await handleExport(options);
              return result || { success: false, error: 'Export failed' };
            }}
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Sentiment Analyzer</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI-powered sentiment analysis for text and YouTube content.
              </p>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Features</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Real-time analysis</li>
                <li>• High accuracy BERT models</li>
                <li>• YouTube content analysis</li>
                <li>• Detailed insights</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Technology</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• React + TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• BERT AI Models</li>
                <li>• Modern Web APIs</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} AI Sentiment Analyzer. Built with modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;