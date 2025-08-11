import React, { useState, useRef } from 'react';
import { Download, Share2, FileText, BarChart3, Image, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';
import { SentimentAnalysis, ExportOptions, ExportResult } from '../types';

interface ExportAndSharingProps {
  analysis: SentimentAnalysis;
  onExport?: (options: ExportOptions) => Promise<ExportResult>;
}

export const ExportAndSharing: React.FC<ExportAndSharingProps> = ({ analysis, onExport }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeComments: true,
    includeAnalysis: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [activeTab, setActiveTab] = useState<'export' | 'sharing'>('export');

  const handleExport = async () => {
    if (!onExport) return;
    
    setIsExporting(true);
    try {
      const result = await onExport(exportOptions);
      setExportResult(result);
      
      if (result.success && result.data) {
        // Handle successful export
        if (exportOptions.format === 'pdf' && result.data instanceof Blob) {
          const url = URL.createObjectURL(result.data);
          const link = document.createElement('a');
          link.href = url;
          link.download = result.filename || `sentiment-analysis-${Date.now()}.pdf`;
          link.click();
          URL.revokeObjectURL(url);
        } else if (exportOptions.format === 'csv' && typeof result.data === 'string') {
          const blob = new Blob([result.data], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = result.filename || `sentiment-analysis-${Date.now()}.csv`;
          link.click();
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      setExportResult({
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generateSocialShareContent = () => {
    const sentiment = analysis.sentiment.score > 0.1 ? 'positive' : 
                     analysis.sentiment.score < -0.1 ? 'negative' : 'neutral';
    
    const baseText = `Just analyzed "${analysis.title || 'my content'}" with AI Sentiment Analyzer!`;
    const sentimentText = `Overall sentiment: ${sentiment} (${analysis.sentiment.score.toFixed(2)})`;
    const hashtags = '#SentimentAnalysis #AI #ContentInsights';
    
    return {
      twitter: `${baseText} ${sentimentText} ${hashtags}`,
      facebook: `${baseText}\n\n${sentimentText}\n\n${hashtags}`,
      linkedin: `${baseText}\n\n${sentimentText}\n\n${hashtags}`,
      email: {
        subject: `Sentiment Analysis Results: ${analysis.title || 'Content Analysis'}`,
        body: `Hi,\n\nI just analyzed my content using AI Sentiment Analyzer and wanted to share the results:\n\nTitle: ${analysis.title || 'Untitled'}\nOverall Sentiment: ${sentiment} (${analysis.sentiment.score.toFixed(2)})\nConfidence: ${(analysis.sentiment.confidence * 100).toFixed(1)}%\n\nKey Insights:\n${analysis.keywords?.slice(0, 5).join(', ') || 'No keywords identified'}\n\nBest regards`
      }
    };
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'linkedin' | 'email') => {
    const content = generateSocialShareContent();
    
    switch (platform) {
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.twitter)}`;
        window.open(twitterUrl, '_blank');
        break;
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(content.facebook)}`;
        window.open(facebookUrl, '_blank');
        break;
      case 'linkedin':
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        window.open(linkedinUrl, '_blank');
        break;
      case 'email':
        const emailUrl = `mailto:?subject=${encodeURIComponent(content.email.subject)}&body=${encodeURIComponent(content.email.body)}`;
        window.open(emailUrl);
        break;
    }
  };

  const renderExportSection = () => (
    <div className="space-y-6">
      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Export Options
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
            <div className="space-y-3">
              {[
                { value: 'pdf', label: 'PDF Report', icon: FileText, description: 'Professional report with charts and insights' },
                { value: 'csv', label: 'CSV Data', icon: BarChart3, description: 'Raw data for further analysis' },
                { value: 'json', label: 'JSON Data', icon: BarChart3, description: 'Structured data for developers' }
              ].map((format) => (
                <label key={format.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value={format.value}
                    checked={exportOptions.format === format.value}
                    onChange={(e) => setExportOptions({ ...exportOptions, format: e.target.value as any })}
                    className="mt-1 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <format.icon className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="font-medium text-gray-900">{format.label}</span>
                    </div>
                    <p className="text-sm text-gray-500">{format.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Content Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Include Content</label>
            <div className="space-y-3">
              {[
                { key: 'includeCharts', label: 'Charts & Visualizations', description: 'Include all charts and graphs' },
                { key: 'includeComments', label: 'Comment Analysis', description: 'Include detailed comment breakdowns' },
                { key: 'includeAnalysis', label: 'Analysis Summary', description: 'Include AI-generated insights' }
              ].map((option) => (
                <label key={option.key} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportOptions[option.key as keyof ExportOptions] as boolean}
                    onChange={(e) => setExportOptions({ 
                      ...exportOptions, 
                      [option.key]: e.target.checked 
                    })}
                    className="mt-1 text-blue-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-6">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Export {exportOptions.format.toUpperCase()} Report
              </>
            )}
          </button>
        </div>

        {/* Export Result */}
        {exportResult && (
          <div className={`mt-4 p-4 rounded-lg ${
            exportResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <p className="font-medium">
              {exportResult.success ? 'Export successful!' : 'Export failed'}
            </p>
            {exportResult.error && <p className="text-sm mt-1">{exportResult.error}</p>}
          </div>
        )}
      </div>

      {/* Export Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Preview</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-gray-900">
              {analysis.title || 'Untitled Content'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              analysis.sentiment.score > 0.1 ? 'bg-green-100 text-green-800' :
              analysis.sentiment.score < -0.1 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {analysis.sentiment.score > 0.1 ? 'Positive' :
               analysis.sentiment.score < -0.1 ? 'Negative' : 'Neutral'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Sentiment Score:</span>
              <span className="ml-2 font-medium">{analysis.sentiment.score.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Confidence:</span>
              <span className="ml-2 font-medium">{(analysis.sentiment.confidence * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Comments:</span>
              <span className="ml-2 font-medium">{analysis.commentStats?.total || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Keywords:</span>
              <span className="ml-2 font-medium">{analysis.keywords?.length || 0}</span>
            </div>
          </div>

          {exportOptions.includeCharts && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="text-gray-600 text-sm">📊 Charts and visualizations will be included</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSharingSection = () => (
    <div className="space-y-6">
      {/* Social Media Sharing */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Share2 className="w-5 h-5 mr-2" />
          Share to Social Media
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { platform: 'twitter', icon: Twitter, color: 'bg-blue-500 hover:bg-blue-600', label: 'Twitter' },
            { platform: 'facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700', label: 'Facebook' },
            { platform: 'linkedin', icon: Linkedin, color: 'bg-blue-700 hover:bg-blue-800', label: 'LinkedIn' },
            { platform: 'email', icon: Mail, color: 'bg-gray-600 hover:bg-gray-700', label: 'Email' }
          ].map((social) => (
            <button
              key={social.platform}
              onClick={() => handleSocialShare(social.platform as any)}
              className={`${social.color} text-white p-4 rounded-lg flex flex-col items-center space-y-2 transition-colors`}
            >
              <social.icon className="w-6 h-6" />
              <span className="text-sm font-medium">{social.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Share Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Preview</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Twitter Preview</h4>
            <p className="text-sm text-blue-800">{generateSocialShareContent().twitter}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Facebook/LinkedIn Preview</h4>
            <p className="text-sm text-green-800 whitespace-pre-line">{generateSocialShareContent().facebook}</p>
          </div>
        </div>
      </div>

      {/* Creator-Friendly Features */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">Creator-Friendly Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Image className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <p className="font-medium text-purple-900">Visual Summaries</p>
              <p className="text-sm text-purple-700">Create shareable image summaries for your audience</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <BarChart3 className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <p className="font-medium text-purple-900">Performance Insights</p>
              <p className="text-sm text-purple-700">Track your content performance over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Export & Sharing</h2>
        <p className="text-gray-600">Export your analysis reports and share insights with your team</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'export', label: 'Export Reports', icon: Download },
            { id: 'sharing', label: 'Social Sharing', icon: Share2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 inline mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'export' && renderExportSection()}
        {activeTab === 'sharing' && renderSharingSection()}
      </div>
    </div>
  );
}; 