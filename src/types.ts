export type SentimentCategory = 'youtube' | 'text' | 'ecommerce' | 'news' | 'social' | 'blog';
export type SentimentLabel = 'positive' | 'negative' | 'neutral';

// Enhanced sentiment analysis with detailed emotions
export interface SentimentResult {
  score: number;
  label: SentimentLabel;
  confidence: number;
  emotions?: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  toxicity?: {
    hate_speech: number;
    spam: number;
    offensive: number;
    overall: number;
  };
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  sentiment: SentimentLabel;
  likes?: number;
  replies?: number;
  emotions?: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  toxicity?: {
    hate_speech: number;
    spam: number;
    offensive: number;
    overall: number;
  };
}

export interface SentimentAnalysis {
  id: string;
  url?: string;
  category: SentimentCategory;
  title?: string;
  text?: string;
  sentiment: SentimentResult;
  keywords?: string[];
  summary?: string;
  timestamp: string;
  comments?: Comment[];
  commentStats?: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
  };
  modelVersion?: string;
  processingTime?: number;
  // New fields for enhanced analysis
  emotionDistribution?: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  topPositiveKeywords?: string[];
  topNegativeKeywords?: string[];
  topLovedPoints?: string[];
  topCriticizedPoints?: string[];
  toxicitySummary?: {
    hate_speech: number;
    spam: number;
    offensive: number;
    overall: number;
  };
  metadata?: {
    views?: number;
    likes?: number;
    dislikes?: number;
    commentCount?: number;
    duration?: number;
    uploadDate?: string;
    channel?: string;
    subscribers?: number;
  };
}

// Simplified text analysis request
export interface TextAnalysisRequest {
  text: string;
  category?: SentimentCategory;
}

export interface TextAnalysisResponse {
  id: string;
  sentiment: SentimentLabel;
  confidence: number;
  score: number;
  modelVersion: string;
  processingTime: number;
  keywords?: string[];
  summary?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Analysis history item
export interface AnalysisHistoryItem {
  id: string;
  title: string;
  category: SentimentCategory;
  sentiment: SentimentLabel;
  confidence: number;
  timestamp: string;
  text?: string;
  url?: string;
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  autoSave: boolean;
}

// New types for comparative analysis
export interface ComparativeAnalysis {
  id: string;
  video1: SentimentAnalysis;
  video2: SentimentAnalysis;
  comparison: {
    overallSentiment: {
      video1: number;
      video2: number;
      difference: number;
    };
    emotionComparison: {
      joy: { video1: number; video2: number; difference: number };
      sadness: { video1: number; video2: number; difference: number };
      anger: { video1: number; video2: number; difference: number };
      fear: { video1: number; video2: number; difference: number };
      surprise: { video1: number; video2: number; difference: number };
      disgust: { video1: number; video2: number; difference: number };
    };
    toxicityComparison: {
      video1: number;
      video2: number;
      difference: number;
    };
    keywordComparison: {
      shared: string[];
      uniqueVideo1: string[];
      uniqueVideo2: string[];
    };
    // Enhanced Analytics & Metrics
    engagementComparison: {
      views: { video1: number; video2: number; difference: number };
      likes: { video1: number; video2: number; difference: number };
      dislikes: { video1: number; video2: number; difference: number };
      comments: { video1: number; video2: number; difference: number };
      engagementRate: { video1: number; video2: number; difference: number };
    };
    contentPerformance: {
      videoLength: { video1: number; video2: number; difference: number };
      uploadTime: { video1: string; video2: string };
      thumbnailEffectiveness: { video1: number; video2: number; difference: number };
    };
    audienceOverlap: number;
    // AI-Powered Insights
    aiInsights: {
      contentGaps: string[];
      contentStrategy: string;
      competitiveAdvantage: string[];
      improvementAreas: string[];
      audienceInsights: string;
      trendAnalysis: string;
    };
    // Actionable Recommendations
    recommendations: {
      contentStrategy: string[];
      timingOptimization: string[];
      audienceTargeting: string[];
      competitiveResponse: string[];
      growthOpportunities: string[];
    };
    // Industry Benchmarks
    industryBenchmarks: IndustryBenchmarks;
  };
  // AI-Powered Insights
  aiInsights: {
    contentGaps: string[];
    contentStrategy: string;
    competitiveAdvantage: string[];
    improvementAreas: string[];
    audienceInsights: string;
    trendAnalysis: string;
  };
  // Advanced Comparison Features
  historicalData?: {
    video1Trend: { date: string; sentiment: number; engagement: number }[];
    video2Trend: { date: string; sentiment: number; engagement: number }[];
  };
  industryBenchmarks: IndustryBenchmarks;
  // Actionable Recommendations
  recommendations: {
    contentStrategy: string[];
    timingOptimization: string[];
    audienceTargeting: string[];
    competitiveResponse: string[];
    growthOpportunities: string[];
  };
  timestamp: string;
}

// New types for export functionality
export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  includeCharts: boolean;
  includeComments: boolean;
  includeAnalysis: boolean;
}

export interface ExportResult {
  success: boolean;
  data?: string | Blob;
  filename?: string;
  error?: string;
}

// Industry benchmarks interface
export interface IndustryBenchmarks {
  categoryAverage: number;
  topPerformers: number;
  yourRank: string;
  marketPosition: 'leader' | 'challenger' | 'follower' | 'niche' | 'unknown';
  totalVideosAnalyzed: number;
  lastUpdated: string;
}

// Industry benchmark data
export interface IndustryBenchmark {
  category: string;
  averageSentiment: number;
  averageToxicity: number;
  topKeywords: string[];
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
}