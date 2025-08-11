import { SentimentAnalysis, SentimentCategory } from '../types';
import { config } from '../config';

// YouTube API configuration
const YOUTUBE_API_KEY = config.youtube.apiKey;
const YOUTUBE_API_BASE = config.youtube.apiBase;

// Base URL for your deployed Supabase Edge Function
const SUPABASE_FUNCTION_URL = 'https://dunhogxoagqltvlccaus.supabase.co/functions/v1/analyze-text';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  thumbnail: string;
  duration: string;
}

export interface YouTubeComment {
  id: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
  updatedAt: string;
}

export interface YouTubeAnalysisRequest {
  url: string;
  category: SentimentCategory;
  analyzeComments?: boolean;
  maxComments?: number;
}

export class YouTubeApiService {
  // Validate API key
  private static validateApiKey(): void {
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'your-youtube-api-key') {
      console.error('YouTube API key not configured!');
      throw new Error('YouTube API key not configured');
    }
    
    if (YOUTUBE_API_KEY.length < 30) {
      console.error('YouTube API key appears to be invalid (too short)');
      throw new Error('YouTube API key appears to be invalid');
    }
  }

  // Extract video ID from YouTube URL
  static extractVideoId(url: string): string | null {
    // Helper to validate a YouTube video ID (11 chars)
    const isValidId = (candidate: string | undefined | null): boolean => {
      if (!candidate) return false;
      return /^[a-zA-Z0-9_-]{11}$/.test(candidate);
    };

    // Try structured URL parsing first
    try {
      const parsed = new URL(url);
      const hostnameRaw = parsed.hostname;
      const hostname = hostnameRaw.replace(/^www\./, '').toLowerCase(); // strip www. and normalize
      const pathname = parsed.pathname;
      const segments = pathname.split('/').filter(Boolean);

      // youtu.be short links → /VIDEO_ID
      if (hostname === 'youtu.be') {
        const candidate = segments[0];
        if (isValidId(candidate)) return candidate;
      }

      // youtube.com variants
      if (
        hostname.endsWith('youtube.com') ||
        hostname.endsWith('m.youtube.com') ||
        hostname.endsWith('music.youtube.com')
      ) {
        // /watch?v=VIDEO_ID
        const vParam = parsed.searchParams.get('v');
        if (isValidId(vParam)) return vParam as string;

        // /embed/VIDEO_ID, /v/VIDEO_ID, /shorts/VIDEO_ID, /live/VIDEO_ID
        if (segments.length >= 2) {
          const [first, second] = segments;
          if (['embed', 'v', 'shorts', 'live'].includes(first) && isValidId(second)) {
            return second;
          }
        }

        // Some mobile share URLs: /watch/VIDEO_ID (rare)
        if (segments.length >= 1 && isValidId(segments[0])) {
          return segments[0];
        }

        // Anchored regex fallbacks for youtube hosts only
        const anchoredPatterns = [
          /(?:youtube\.com\/watch\?[^\s]*[?&]v=)([a-zA-Z0-9_-]{11})/,
          /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
          /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
          /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
        ];
        for (const pattern of anchoredPatterns) {
          const m = url.match(pattern);
          if (m && isValidId(m[1])) return m[1];
        }

        // Final ultra-conservative fallback: only if URL is a youtube host
        const generic = url.match(/[a-zA-Z0-9_-]{11}/g);
        if (generic) {
          // Prefer tokens that appear after common markers
          const prioritized = generic.find(tok =>
            new RegExp(`(?:v=|/embed/|/v/|/shorts/|/watch/)${tok}`).test(url)
          );
          if (isValidId(prioritized)) return prioritized as string;
        }
      }
    } catch {
      // Ignore URL parsing errors and fall back to legacy patterns below
    }

    // Legacy broad patterns as an absolute last resort
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*&v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        // Sanitize to 11-char ID if possible
        const candidate = match[1].replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 11);
        if (/^[a-zA-Z0-9_-]{11}$/.test(candidate)) return candidate;
      }
    }

    return null;
  }

  // Fetch video details
  static async getVideoDetails(videoId: string): Promise<YouTubeVideo> {
    try {
      this.validateApiKey();
      
      const url = `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('YouTube API response error:', response.status, errorText);
        
        if (response.status === 403) {
          throw new Error('API key invalid or quota exceeded');
        } else if (response.status === 404) {
          throw new Error('Video not found');
        } else {
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error('Video not found');
      }

      const video = data.items[0];
      const snippet = video.snippet;
      const statistics = video.statistics;
      const contentDetails = video.contentDetails;

      return {
        id: video.id,
        title: snippet.title,
        description: snippet.description,
        channelTitle: snippet.channelTitle,
        publishedAt: snippet.publishedAt,
        viewCount: statistics.viewCount || '0',
        likeCount: statistics.likeCount || '0',
        commentCount: statistics.commentCount || '0',
        thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
        duration: contentDetails.duration || 'PT0S'
      };
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  }

  // Fetch video comments
  static async getVideoComments(videoId: string, maxResults: number = 100): Promise<YouTubeComment[]> {
    try {
      this.validateApiKey();
      
      console.log('Fetching comments for video ID:', videoId, 'Max results:', maxResults);
      
      const url = `${YOUTUBE_API_BASE}/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
      console.log('Comments API URL:', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('YouTube Comments API response error:', response.status, errorText);
        
        if (response.status === 403) {
          throw new Error('Comments disabled or API quota exceeded');
        } else if (response.status === 404) {
          throw new Error('Video comments not found');
        } else {
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('YouTube Comments API response:', data);
      
      if (!data.items) {
        console.log('No comments found for this video');
        return [];
      }

      return data.items.map((item: any) => {
        const snippet = item.snippet.topLevelComment.snippet;
        return {
          id: item.id,
          authorDisplayName: snippet.authorDisplayName,
          authorProfileImageUrl: snippet.authorProfileImageUrl,
          textDisplay: snippet.textDisplay,
          likeCount: snippet.likeCount || 0,
          publishedAt: snippet.publishedAt,
          updatedAt: snippet.updatedAt
        };
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Don't throw error for comments - just return empty array
      return [];
    }
  }

  // Analyze YouTube video and comments
  static async analyzeYouTubeContent(request: YouTubeAnalysisRequest): Promise<SentimentAnalysis> {
    try {
      const videoId = this.extractVideoId(request.url);
      
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Fetch video details
      const video = await this.getVideoDetails(videoId);
      
      // Fetch comments if requested
      let comments: YouTubeComment[] = [];
      if (request.analyzeComments) {
        comments = await this.getVideoComments(videoId, request.maxComments || 100);
      }

      // Analyze comment sentiments if we have comments
      let commentStats = { total: 0, positive: 0, negative: 0, neutral: 0 };
      let analyzedComments: any[] = [];
      
      if (comments.length > 0) {
        // Analyze each comment for sentiment
        for (const comment of comments) {
          try {
            // Call the Supabase Edge Function for sentiment analysis
            const response = await fetch(SUPABASE_FUNCTION_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNx43KQwkz-mxBLkH8ZXiG4wE16E'
              },
              body: JSON.stringify({ text: comment.textDisplay })
            });
            
            if (response.ok) {
              const sentimentData = await response.json();
              const sentiment = sentimentData.sentiment || 'neutral';
              
              analyzedComments.push({
                id: comment.id,
                text: comment.textDisplay,
                author: comment.authorDisplayName,
                timestamp: comment.publishedAt,
                sentiment: sentiment,
                likes: comment.likeCount,
                replies: 0
              });
              
              // Update comment stats
              if (sentiment === 'positive') commentStats.positive++;
              else if (sentiment === 'negative') commentStats.negative++;
              else commentStats.neutral++;
            } else {
              // Improved fallback sentiment analysis using basic text patterns
              const sentiment = this.analyzeBasicSentiment(comment.textDisplay);
              
              analyzedComments.push({
                id: comment.id,
                text: comment.textDisplay,
                author: comment.authorDisplayName,
                timestamp: comment.publishedAt,
                sentiment: sentiment,
                likes: comment.likeCount,
                replies: 0
              });
              
              // Update comment stats
              if (sentiment === 'positive') commentStats.positive++;
              else if (sentiment === 'negative') commentStats.negative++;
              else commentStats.neutral++;
            }
          } catch (error) {
            console.error('Error analyzing comment sentiment:', error);
            // Improved fallback sentiment analysis
            const sentiment = this.analyzeBasicSentiment(comment.textDisplay);
            
            analyzedComments.push({
              id: comment.id,
              text: comment.textDisplay,
              author: comment.authorDisplayName,
              timestamp: comment.publishedAt,
              sentiment: sentiment,
              likes: comment.likeCount,
              replies: 0
            });
            
            // Update comment stats
            if (sentiment === 'positive') commentStats.positive++;
            else if (sentiment === 'negative') commentStats.negative++;
            else commentStats.neutral++;
          }
        }
        
        commentStats.total = comments.length;
      }

      // Create analysis object
      const analysis: SentimentAnalysis = {
        id: `youtube-${videoId}-${Date.now()}`,
        url: request.url,
        category: request.category,
        title: `Analysis: ${video.title}`,
        text: video.description,
        sentiment: {
          score: 0, // Will be calculated by sentiment analysis
          label: 'neutral',
          confidence: 0.5
        },
        keywords: this.extractKeywords(video.title + ' ' + video.description),
        summary: `Analysis of YouTube video "${video.title}" by ${video.channelTitle}`,
        timestamp: new Date().toISOString(),
        modelVersion: 'YouTube + BERT v1.0',
        processingTime: 0,
        comments: analyzedComments,
        commentStats: commentStats
      };

      return analysis;
    } catch (error) {
      console.error('Error analyzing YouTube content:', error);
      throw new Error(`Failed to analyze YouTube content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Basic sentiment analysis fallback using text patterns
  private static analyzeBasicSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const lowerText = text.toLowerCase();
    
    // Positive indicators
    const positiveWords = [
      'love', 'great', 'awesome', 'amazing', 'excellent', 'fantastic', 'wonderful', 'brilliant',
      'perfect', 'best', 'good', 'nice', 'beautiful', 'outstanding', 'superb', 'incredible',
      'fabulous', 'marvelous', 'terrific', 'splendid', 'magnificent', 'glorious', 'divine',
      'heavenly', 'delightful', 'charming', 'lovely', 'sweet', 'kind', 'helpful', 'supportive',
      'encouraging', 'inspiring', 'motivating', 'uplifting', 'positive', 'optimistic', 'hopeful',
      'joyful', 'happy', 'pleased', 'satisfied', 'content', 'grateful', 'thankful', 'blessed',
      'lucky', 'fortunate', 'successful', 'achieved', 'accomplished', 'completed', 'finished',
      'improved', 'enhanced', 'upgraded', 'better', 'stronger', 'faster', 'smoother', 'easier'
    ];
    
    // Negative indicators
    const negativeWords = [
      'hate', 'terrible', 'awful', 'horrible', 'dreadful', 'atrocious', 'abysmal', 'appalling',
      'disgusting', 'revolting', 'nauseating', 'sickening', 'vile', 'foul', 'rotten', 'corrupt',
      'evil', 'wicked', 'sinful', 'immoral', 'unethical', 'dishonest', 'deceitful', 'treacherous',
      'betrayal', 'abandoned', 'rejected', 'excluded', 'isolated', 'lonely', 'alone', 'desperate',
      'hopeless', 'helpless', 'powerless', 'weak', 'fragile', 'vulnerable', 'exposed', 'defenseless',
      'defeated', 'conquered', 'overwhelmed', 'crushed', 'destroyed', 'ruined', 'wasted', 'lost',
      'failed', 'disappointed', 'frustrated', 'angry', 'furious', 'enraged', 'livid', 'irritated',
      'annoyed', 'bothered', 'troubled', 'worried', 'anxious', 'nervous', 'scared', 'frightened',
      'terrified', 'panicked', 'stressed', 'tired', 'exhausted', 'drained', 'burned', 'out'
    ];
    
    // Count positive and negative words
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) positiveCount += matches.length;
    });
    
    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) negativeCount += matches.length;
    });
    
    // Determine sentiment based on word counts
    if (positiveCount > negativeCount && positiveCount > 0) {
      return 'positive';
    } else if (negativeCount > positiveCount && negativeCount > 0) {
      return 'negative';
    } else {
      return 'neutral';
    }
  }

  // Extract keywords from text
  private static extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'they', 'have', 'from'];
    const keywords = words.filter(word => !commonWords.includes(word));
    
    return keywords.slice(0, 8); // Return top 8 keywords
  }

  // Format duration from ISO 8601 to readable format
  static formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    
    if (!match) return 'Unknown';
    
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    
    let result = '';
    if (hours) result += `${hours}:`;
    if (minutes) result += `${minutes.padStart(2, '0')}:`;
    else result += '00:';
    if (seconds) result += seconds.padStart(2, '0');
    else result += '00';
    
    return result;
  }
} 