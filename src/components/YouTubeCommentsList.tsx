import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, Calendar, User, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface YouTubeComment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  likes?: number;
  replies?: number;
}

interface YouTubeCommentsListProps {
  comments: YouTubeComment[];
  title?: string;
}

const YouTubeCommentsList: React.FC<YouTubeCommentsListProps> = ({ comments, title = 'Comments Analysis' }) => {
  const [sortBy, setSortBy] = useState<'time' | 'sentiment' | 'likes'>('time');
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-yellow-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'border-green-200 bg-green-50';
      case 'negative':
        return 'border-red-200 bg-red-50';
      case 'neutral':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredAndSortedComments = comments
    .filter(comment => filterSentiment === 'all' || comment.sentiment === filterSentiment)
    .sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'sentiment':
          const sentimentOrder = { positive: 3, neutral: 2, negative: 1 };
          return sentimentOrder[b.sentiment] - sentimentOrder[a.sentiment];
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

  const sentimentCounts = comments.reduce((acc, comment) => {
    acc[comment.sentiment] = (acc[comment.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-100 to-red-200 px-6 py-4 border-b-2 border-red-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-3 rounded-lg shadow-md">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-900">{title}</h3>
              <p className="text-base font-medium text-red-800">{comments.length} comments analyzed</p>
            </div>
          </div>
          
          {/* Sentiment Summary */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-green-300 shadow-sm">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-600"></div>
              <span className="text-sm font-bold text-green-800">{sentimentCounts.positive || 0}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-yellow-300 shadow-sm">
              <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-yellow-600"></div>
              <span className="text-sm font-bold text-yellow-800">{sentimentCounts.neutral || 0}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-red-300 shadow-sm">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-600"></div>
              <span className="text-sm font-bold text-red-800">{sentimentCounts.negative || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
              >
                <option value="time">Time</option>
                <option value="sentiment">Sentiment</option>
                <option value="likes">Likes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter:</label>
              <select
                value={filterSentiment}
                onChange={(e) => setFilterSentiment(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Comments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedComments.length} of {comments.length} comments
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAndSortedComments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredAndSortedComments.map((comment) => (
              <div
                key={comment.id}
                className={`p-4 border-l-4 ${getSentimentColor(comment.sentiment)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getSentimentIcon(comment.sentiment)}
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          comment.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          comment.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {comment.sentiment}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">{comment.text}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {comment.likes !== undefined && (
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{comment.likes}</span>
                        </div>
                      )}
                      
                      {comment.replies !== undefined && (
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{comment.replies} replies</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No comments match the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeCommentsList; 