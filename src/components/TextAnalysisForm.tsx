import React, { useState } from 'react';
import { SentimentCategory, TextAnalysisRequest } from '../types';
import { FileText, Loader2, Send, Sparkles } from 'lucide-react';

interface TextAnalysisFormProps {
  onSubmit: (request: TextAnalysisRequest) => Promise<void>;
  isLoading: boolean;
}

const TextAnalysisForm: React.FC<TextAnalysisFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [category] = useState<SentimentCategory>('text');
  const [textError, setTextError] = useState<string | null>(null);

  const validateText = (textString: string): boolean => {
    if (!textString.trim()) {
      setTextError('Text is required');
      return false;
    }
    if (textString.trim().length < 10) {
      setTextError('Text must be at least 10 characters long');
      return false;
    }
    setTextError(null);
    return true;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    if (textError) {
      validateText(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateText(text)) {
      await onSubmit({
        text: text.trim(),
        category
      });
    }
  };

  const isFormValid = text.trim() && !textError;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg mr-3 animate-bounce-in">
          <FileText className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 transition-colors duration-300">Text Sentiment Analysis</h2>
          <p className="text-sm text-gray-600 transition-colors duration-300">Analyze sentiment from any text input using AI</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="text-input" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-300">
            Enter Text to Analyze
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your text here... (minimum 10 characters)"
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 resize-none ${
              textError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {textError && (
            <div className="flex items-center mt-2 text-red-600 text-sm">
              <Sparkles className="w-4 h-4 mr-1" />
              {textError}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isFormValid && !isLoading
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl'
              : 'bg-gray-400 cursor-not-allowed shadow-sm'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Analyzing Text...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Send className="w-5 h-5 mr-2" />
              Analyze Text
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default TextAnalysisForm;