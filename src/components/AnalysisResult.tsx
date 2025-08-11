import React from 'react';
import { SentimentAnalysis, SentimentCategory } from '../types';
import { Clock, Globe, FileText, TrendingUp, TrendingDown, Minus, CheckCircle, XCircle, AlertCircle, Youtube, MessageCircle, Eye, ThumbsUp, Calendar } from 'lucide-react';
import SentimentMeter from './SentimentMeter';
import SentimentStats from './SentimentStats';
import EnhancedSentimentStats from './EnhancedSentimentStats';
import YouTubeCommentsList from './YouTubeCommentsList';

interface AnalysisResultProps {
  analysis: SentimentAnalysis;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'negative':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'neutral':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: SentimentCategory) => {
    switch (category) {
      case 'youtube':
        return '🎥';
      case 'text':
        return '📝';
      default:
        return '📄';
    }
  };

  const getCategoryLabel = (category: SentimentCategory) => {
    switch (category) {
      case 'youtube':
        return 'YouTube Content';
      case 'text':
        return 'Text Analysis';
      default:
        return 'Content Analysis';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-4 border-b-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-3 rounded-lg shadow-md">
              {analysis.url ? <Globe className="w-6 h-6 text-white" /> : <FileText className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {analysis.title || 'Sentiment Analysis Result'}
              </h2>
              <div className="flex items-center space-x-4 text-base text-gray-700 mt-2 font-medium">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getCategoryIcon(analysis.category)}</span>
                  <span className="capitalize">{analysis.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{formatDate(analysis.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`flex items-center space-x-2 px-4 py-3 rounded-full border-2 transition-colors duration-300 shadow-md ${
            analysis.sentiment.label === 'positive' 
              ? 'text-green-700 bg-green-100 border-green-300' 
              : analysis.sentiment.label === 'negative' 
              ? 'text-red-700 bg-red-100 border-red-300' 
              : 'text-yellow-700 bg-yellow-100 border-yellow-300'
          }`}>
            {getSentimentIcon(analysis.sentiment.label)}
            <span className="font-bold capitalize text-lg">{analysis.sentiment.label}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* YouTube Video Information */}
        {analysis.category === 'youtube' && analysis.url && (
          <div className="mb-8 bg-gradient-to-r from-red-100 to-red-200 rounded-xl p-6 border-2 border-red-300 animate-fade-in shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="bg-red-600 p-4 rounded-lg shadow-md">
                  <Youtube className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900 mb-4">YouTube Video Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analysis.commentStats && (
                    <>
                      <div className="bg-white rounded-lg p-4 border-2 border-red-300 shadow-md">
                        <div className="flex items-center space-x-3">
                          <MessageCircle className="w-5 h-5 text-red-600" />
                          <div>
                            <div className="text-lg font-bold text-red-900">{analysis.commentStats.total}</div>
                            <div className="text-sm text-red-700 font-medium">Comments</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border-2 border-green-300 shadow-md">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 text-green-600">👍</div>
                          <div>
                            <div className="text-lg font-bold text-green-900">{analysis.commentStats.positive}</div>
                            <div className="text-sm text-green-700 font-medium">Positive</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border-2 border-red-300 shadow-md">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 text-red-600">👎</div>
                          <div>
                            <div className="text-lg font-bold text-red-900">{analysis.commentStats.negative}</div>
                            <div className="text-sm text-red-700 font-medium">Negative</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border-2 border-yellow-300 shadow-md">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 text-yellow-600">⚖️</div>
                          <div>
                            <div className="text-lg font-bold text-yellow-900">{analysis.commentStats.neutral}</div>
                            <div className="text-sm text-yellow-700 font-medium">Neutral</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-6">
                  <a 
                    href={analysis.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md font-bold"
                  >
                    <Youtube className="w-5 h-5" />
                    <span>Watch on YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Sentiment Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sentiment Meter */}
          <div className="lg:col-span-2">
            <div className="bg-gray-100 rounded-xl p-6 transition-colors duration-300 border-2 border-gray-200 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sentiment Score</h3>
              <SentimentMeter 
                score={analysis.sentiment.score} 
                label={analysis.sentiment.label} 
                confidence={analysis.sentiment.confidence} 
              />
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div className="text-center bg-white p-4 rounded-lg border-2 border-blue-200 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">{Math.round(analysis.sentiment.confidence * 100)}%</div>
                  <div className="text-base text-gray-700 font-medium">Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">
                    {analysis.sentiment.score > 0 ? '+' : ''}{analysis.sentiment.score.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white animate-bounce-in">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Model Version</div>
                  <div className="text-lg font-semibold">{analysis.modelVersion || 'BERT v1.0'}</div>
                </div>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </div>

            {analysis.processingTime && (
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white animate-bounce-in">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm opacity-90">Processing Time</div>
                    <div className="text-lg font-semibold">{analysis.processingTime}ms</div>
                  </div>
                  <Clock className="w-8 h-8 opacity-80" />
                </div>
              </div>
            )}

            {analysis.url && (
              <div className="bg-gray-100 rounded-lg p-4 transition-colors duration-300">
                <div className="text-sm text-gray-600 mb-1">Analyzed URL</div>
                <div className="text-sm font-medium text-gray-900 break-all">
                  <a 
                    href={analysis.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {analysis.url}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Preview */}
        {analysis.text && (
          <div className="mb-8 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyzed Text</h3>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500 transition-colors duration-300">
              <p className="text-gray-700 leading-relaxed">{analysis.text}</p>
            </div>
          </div>
        )}

        {/* Keywords and Summary */}
        {(analysis.keywords || analysis.summary) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-slide-up">
            {analysis.keywords && analysis.keywords.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200 transition-colors duration-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.summary && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 transition-colors duration-300">
                  <p className="text-blue-900 leading-relaxed">{analysis.summary}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comments Analysis */}
        {analysis.comments && analysis.comments.length > 0 && (
          <div className="mb-8 space-y-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments Analysis</h3>
            
            {/* Enhanced Statistics */}
            {analysis.commentStats && (
              <EnhancedSentimentStats 
                stats={analysis.commentStats}
                className="mb-6"
              />
            )}
            
            {/* YouTube Comments List */}
            {analysis.category === 'youtube' && (
              <YouTubeCommentsList 
                comments={analysis.comments} 
                title="YouTube Comments"
              />
            )}
            
            {/* Regular Comments Display */}
            {analysis.category !== 'youtube' && analysis.comments && (
              <SentimentStats comments={analysis.comments} />
            )}
          </div>
        )}

        {/* Model Information */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-colors duration-300">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Analysis completed using advanced AI sentiment analysis</span>
            <span>ID: {analysis.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;