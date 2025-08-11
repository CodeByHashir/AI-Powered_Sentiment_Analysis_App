import React from 'react';
import { ThumbsUp, ThumbsDown, Minus, Smile, Frown, Meh } from 'lucide-react';

interface SentimentMeterProps {
  score: number;
  label: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

const SentimentMeter: React.FC<SentimentMeterProps> = ({ score, label, confidence }) => {
  // Convert score from -1...1 to 0...100 for the meter
  const percentage = ((score + 1) / 2) * 100;
  
  // Get sentiment details
  const getSentimentDetails = () => {
    switch (label) {
      case 'positive':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-700',
          border: 'border-green-200',
          background: 'bg-green-50',
          icon: <Smile className="h-8 w-8 text-green-500 mr-3" />,
        };
      case 'negative':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-700',
          border: 'border-red-200',
          background: 'bg-red-50',
          icon: <Frown className="h-8 w-8 text-red-500 mr-3" />,
        };
      case 'neutral':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          border: 'border-yellow-200',
          background: 'bg-yellow-50',
          icon: <Meh className="h-8 w-8 text-yellow-500 mr-3" />,
        };
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          border: 'border-gray-200',
          background: 'bg-gray-50',
          icon: <Meh className="h-8 w-8 text-gray-500 mr-3" />,
        };
    }
  };

  const sentimentDetails = getSentimentDetails();

  return (
    <div className="w-full">
      {/* Prominent sentiment indicator */}
      <div className={`flex items-center p-4 rounded-lg mb-4 ${sentimentDetails.background} ${sentimentDetails.border} border`}>
        {sentimentDetails.icon}
        <div>
          <h3 className={`text-xl font-bold capitalize ${sentimentDetails.textColor}`}>
            {label} Sentiment
          </h3>
          <p className="text-gray-600">
            Confidence: <span className="font-bold">{(confidence * 100).toFixed(0)}%</span>
          </p>
        </div>
      </div>
      
      {/* Sentiment meter */}
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-red-500">Negative</span>
        <span className="text-sm font-medium text-yellow-500">Neutral</span>
        <span className="text-sm font-medium text-green-500">Positive</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className={`h-2.5 rounded-full ${sentimentDetails.color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm">
          <ThumbsDown size={16} className="text-red-500 mr-1" />
          <span>-1.0</span>
        </div>
        <div className="flex items-center text-sm">
          <Minus size={16} className="text-yellow-500 mr-1" />
          <span>0.0</span>
        </div>
        <div className="flex items-center text-sm">
          <ThumbsUp size={16} className="text-green-500 mr-1" />
          <span>+1.0</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm font-medium">
          Score: <span className={`font-bold ${sentimentDetails.textColor}`}>{score.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentMeter;