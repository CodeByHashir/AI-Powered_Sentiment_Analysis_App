import { SentimentAnalysis, TextAnalysisRequest, SentimentCategory } from '../types';
import Sentiment from 'sentiment';

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Base URL for your deployed Supabase Edge Function
const SUPABASE_FUNCTION_URL = 'https://dunhogxoagqltvlccaus.supabase.co/functions/v1/analyze-text';

// Local development server URL
const LOCAL_SERVER_URL = 'http://localhost:3001/analyze-text';

export class SentimentApiService {
  // Analyze text using your Supabase Edge Function or fallback to local sentiment analysis
  static async analyzeText(request: TextAnalysisRequest): Promise<SentimentAnalysis> {
    try {
      console.log('🔍 Starting text analysis for:', request.text.substring(0, 100) + '...');
      
      // First, try to use the Supabase Edge Function
      try {
        console.log('🌐 Attempting Supabase Edge Function...');
        const response = await fetch(SUPABASE_FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNx43KQwkz-mxBLkH8ZXiG4wE16E'
          },
          body: JSON.stringify({ text: request.text })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Supabase Edge Function result:', result);
          
          // Transform the API response to match our frontend types
          const analysis: SentimentAnalysis = {
            id: `analysis-${Date.now()}`,
            category: request.category || 'general',
            title: 'Text Analysis (AI Model)',
            text: request.text,
            sentiment: {
              score: result.score || 0,
              label: result.sentiment || 'neutral',
              confidence: result.confidence || 0.5
            },
            keywords: this.extractKeywords(request.text),
            summary: this.generateSummary(request.text, result.sentiment, result.confidence),
            timestamp: new Date().toISOString(),
            modelVersion: result.model_version || 'BERT v1.0',
            processingTime: result.processing_time_ms || 0,
            comments: [{
              id: 'user-input',
              text: request.text,
              author: 'User Input',
              timestamp: new Date().toISOString(),
              sentiment: result.sentiment || 'neutral'
            }]
          };

          console.log('📊 Final analysis object:', analysis);
          return analysis;
        } else {
          console.warn('⚠️ Supabase Edge Function failed with status:', response.status);
          const errorText = await response.text();
          console.warn('Error details:', errorText);
        }
      } catch (supabaseError) {
        console.log('❌ Supabase Edge Function not available:', supabaseError);
      }

      // Try local server as second option
      try {
        console.log('🏠 Attempting local server...');
        const localResponse = await fetch(LOCAL_SERVER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: request.text })
        });

        if (localResponse.ok) {
          const result = await localResponse.json();
          console.log('✅ Local server result:', result);
          
          const analysis: SentimentAnalysis = {
            id: `analysis-${Date.now()}`,
            category: request.category || 'general',
            title: 'Text Analysis (Local Server)',
            text: request.text,
            sentiment: {
              score: result.score || 0,
              label: result.sentiment || 'neutral',
              confidence: result.confidence || 0.5
            },
            keywords: this.extractKeywords(request.text),
            summary: this.generateSummary(request.text, result.sentiment, result.confidence),
            timestamp: new Date().toISOString(),
            modelVersion: result.model_version || 'Local Server v1.0',
            processingTime: result.processing_time_ms || 0,
            comments: [{
              id: 'user-input',
              text: request.text,
              author: 'User Input',
              timestamp: new Date().toISOString(),
              sentiment: result.sentiment || 'neutral'
            }]
          };

          console.log('📊 Final analysis object:', analysis);
          return analysis;
        } else {
          console.warn('⚠️ Local server failed with status:', localResponse.status);
        }
      } catch (localError) {
        console.log('❌ Local server not available:', localError);
      }

      // Final fallback to built-in sentiment analysis
      console.log('🔄 Using built-in sentiment analysis as fallback...');
      const startTime = performance.now();
      const result = sentiment.analyze(request.text);
      const endTime = performance.now();
      
      console.log('📈 Built-in sentiment result:', result);
      
      // Convert sentiment score to our format
      const score = Math.max(-1, Math.min(1, result.score / 10)); // Normalize score
      let label: 'positive' | 'negative' | 'neutral';
      if (score > 0.1) label = 'positive';
      else if (score < -0.1) label = 'negative';
      else label = 'neutral';
      
      const confidence = Math.min(0.5 + Math.abs(score) * 0.5, 0.9); // Calculate confidence
      
      console.log('🎯 Processed sentiment:', { score, label, confidence });
      
      const analysis: SentimentAnalysis = {
        id: `analysis-${Date.now()}`,
        category: request.category || 'general',
        title: 'Text Analysis (Local)',
        text: request.text,
        sentiment: {
          score,
          label,
          confidence
        },
        keywords: this.extractKeywords(request.text),
        summary: this.generateSummary(request.text, label, confidence),
        timestamp: new Date().toISOString(),
        modelVersion: 'Local Sentiment v1.0',
        processingTime: Math.round(endTime - startTime),
        comments: [{
          id: 'user-input',
          text: request.text,
          author: 'User Input',
          timestamp: new Date().toISOString(),
          sentiment: label
        }]
      };

      console.log('📊 Final analysis object:', analysis);
      return analysis;
    } catch (error) {
      console.error('💥 Error analyzing text:', error);
      throw new Error('Failed to analyze text. Please try again.');
    }
  }

  // Analyze URL content with platform-specific integrations
  static async analyzeUrl(url: string, category: SentimentCategory): Promise<SentimentAnalysis> {
    try {
      // For now, treat all URLs as text content
      const mockText = `Content from ${url} - ${category} category`;
      const request: TextAnalysisRequest = { text: mockText, category };
      return await this.analyzeText(request);
    } catch (error) {
      console.error('Error analyzing URL:', error);
      throw new Error('Failed to analyze URL. Please try again.');
    }
  }

  // Helper method to extract keywords from text
  private static extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    // Simple keyword extraction - in production, you'd use NLP libraries
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const keywords = words.filter(word => !commonWords.includes(word));
    
    return keywords.slice(0, 5); // Return top 5 keywords
  }

  // Helper method to generate summary
  private static generateSummary(text: string, sentiment: string, confidence: number): string {
    const sentimentText = sentiment === 'positive' ? 'positive' : 
                         sentiment === 'negative' ? 'negative' : 'neutral';
    
    const confidenceText = confidence > 0.8 ? 'high confidence' :
                          confidence > 0.6 ? 'moderate confidence' : 'low confidence';
    
    return `Analysis of the provided text shows ${sentimentText} sentiment with ${confidenceText}. The content appears to convey ${sentimentText} emotions and opinions.`;
  }
} 