import React, { useState } from 'react';
import { SentimentCategory } from '../types';
import { Globe, Loader2, Search, AlertCircle, Youtube } from 'lucide-react';
import { YouTubeApiService } from '../services/youtubeApi';

interface SearchFormProps {
  onSubmit: (url: string, category: SentimentCategory) => Promise<void>;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [category] = useState<SentimentCategory>('youtube');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [analyzeComments, setAnalyzeComments] = useState(true);
  const [maxComments, setMaxComments] = useState(100);
  const [detectedVideoId, setDetectedVideoId] = useState<string | null>(null);

  const validateUrl = (urlString: string): boolean => {
    if (!urlString.trim()) {
      setUrlError('URL is required');
      setDetectedVideoId(null);
      return false;
    }

    try {
      const urlObj = new URL(urlString);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setUrlError('URL must start with http:// or https://');
        setDetectedVideoId(null);
        return false;
      }
      // YouTube-specific validation: ensure a video ID can be extracted
      const id = YouTubeApiService.extractVideoId(urlString.trim());
      if (!id) {
        setUrlError('Please enter a valid YouTube video URL (watch, youtu.be, embed, or shorts)');
        setDetectedVideoId(null);
        return false;
      }
      setDetectedVideoId(id);
      setUrlError(null);
      return true;
    } catch {
      setUrlError('Please enter a valid URL');
      setDetectedVideoId(null);
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    // live-validate and show detected ID
    if (value.trim()) {
      validateUrl(value);
    } else {
      setUrlError(null);
      setDetectedVideoId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl(url)) {
      await onSubmit(url.trim(), category);
    }
  };

  const isFormValid = url.trim() && !urlError;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-lg mr-3 animate-bounce-in">
          <Youtube className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 transition-colors duration-300">YouTube Content Analysis</h2>
          <p className="text-sm text-gray-600 transition-colors duration-300">Analyze sentiment from YouTube videos, comments, and transcripts</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url-input" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-300">
            Enter YouTube URL to Analyze
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://www.youtube.com/watch?v=... or paste YouTube URL here..."
              className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 ${
                urlError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
              }`}
              required
            />
          </div>
          {detectedVideoId && !urlError && (
            <div className="mt-2 text-xs text-gray-500">Detected video ID: <span className="font-mono">{detectedVideoId}</span></div>
          )}
          {urlError && (
            <div className="flex items-center mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {urlError}
            </div>
          )}
        </div>

        {/* YouTube Analysis Options */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Youtube className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="font-semibold text-red-900">YouTube Analysis Options</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={analyzeComments}
                onChange={(e) => setAnalyzeComments(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-red-900">Analyze comments</span>
            </label>

            <div>
              <label className="block text-xs text-red-800 mb-1">Max comments</label>
              <input
                type="number"
                min={10}
                max={500}
                step={10}
                value={maxComments}
                onChange={(e) => setMaxComments(Number(e.target.value))}
                className="w-28 border rounded px-2 py-1 text-sm border-red-200 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Analyzing...
              </>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;