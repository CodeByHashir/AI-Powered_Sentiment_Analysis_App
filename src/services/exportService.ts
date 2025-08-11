import { SentimentAnalysis, ExportOptions, ExportResult } from '../types';

export class ExportService {
  static async exportToPDF(analysis: SentimentAnalysis, options: ExportOptions): Promise<ExportResult> {
    try {
      // For now, we'll create a simple HTML-based PDF
      // In a production environment, you might want to use a more robust PDF library
      const htmlContent = this.generatePDFHTML(analysis, options);
      
      // Convert HTML to PDF using html2canvas and jsPDF
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');
      
      // Create a temporary div to render the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(tempDiv);
      
      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        width: 800,
        height: tempDiv.scrollHeight,
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      // Remove temporary div
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const pdfBlob = pdf.output('blob');
      
      return {
        success: true,
        data: pdfBlob,
        filename: `sentiment-analysis-${analysis.title?.replace(/[^a-z0-9]/gi, '-') || 'report'}-${Date.now()}.pdf`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PDF generation failed'
      };
    }
  }

  static async exportToCSV(analysis: SentimentAnalysis, options: ExportOptions): Promise<ExportResult> {
    try {
      let csvContent = 'Content Analysis Report\n\n';
      
      // Basic information
      csvContent += 'Title,Sentiment Score,Confidence,Category,Timestamp\n';
      csvContent += `"${analysis.title || 'Untitled'}",${analysis.sentiment.score},${analysis.sentiment.confidence},${analysis.category},${analysis.timestamp}\n\n`;
      
      // Sentiment details
      if (options.includeAnalysis) {
        csvContent += 'Sentiment Analysis\n';
        csvContent += 'Label,Score,Confidence\n';
        csvContent += `${analysis.sentiment.label},${analysis.sentiment.score},${analysis.sentiment.confidence}\n\n`;
        
        // Emotions if available
        if (analysis.emotionDistribution) {
          csvContent += 'Emotion Distribution\n';
          csvContent += 'Emotion,Percentage\n';
          Object.entries(analysis.emotionDistribution).forEach(([emotion, value]) => {
            csvContent += `${emotion},${(value * 100).toFixed(2)}%\n`;
          });
          csvContent += '\n';
        }
        
        // Toxicity if available
        if (analysis.toxicitySummary) {
          csvContent += 'Toxicity Analysis\n';
          csvContent += 'Type,Percentage\n';
          csvContent += `Hate Speech,${(analysis.toxicitySummary.hate_speech * 100).toFixed(2)}%\n`;
          csvContent += `Spam,${(analysis.toxicitySummary.spam * 100).toFixed(2)}%\n`;
          csvContent += `Offensive,${(analysis.toxicitySummary.offensive * 100).toFixed(2)}%\n`;
          csvContent += `Overall,${(analysis.toxicitySummary.overall * 100).toFixed(2)}%\n\n`;
        }
      }
      
      // Keywords
      if (analysis.keywords && analysis.keywords.length > 0) {
        csvContent += 'Keywords\n';
        csvContent += analysis.keywords.join(',') + '\n\n';
      }
      
      // Top points
      if (options.includeAnalysis) {
        if (analysis.topLovedPoints && analysis.topLovedPoints.length > 0) {
          csvContent += 'Most Loved Points\n';
          analysis.topLovedPoints.forEach((point, index) => {
            csvContent += `${index + 1},"${point}"\n`;
          });
          csvContent += '\n';
        }
        
        if (analysis.topCriticizedPoints && analysis.topCriticizedPoints.length > 0) {
          csvContent += 'Most Criticized Points\n';
          analysis.topCriticizedPoints.forEach((point, index) => {
            csvContent += `${index + 1},"${point}"\n`;
          });
          csvContent += '\n';
        }
      }
      
      // Comments
      if (options.includeComments && analysis.comments && analysis.comments.length > 0) {
        csvContent += 'Comment Analysis\n';
        csvContent += 'Author,Text,Sentiment,Likes,Replies,Timestamp\n';
        analysis.comments.forEach(comment => {
          const escapedText = comment.text.replace(/"/g, '""');
          csvContent += `"${comment.author}","${escapedText}",${comment.sentiment},${comment.likes || 0},${comment.replies || 0},${comment.timestamp}\n`;
        });
        csvContent += '\n';
      }
      
      // Comment statistics
      if (analysis.commentStats) {
        csvContent += 'Comment Statistics\n';
        csvContent += 'Total,Positive,Negative,Neutral\n';
        csvContent += `${analysis.commentStats.total},${analysis.commentStats.positive},${analysis.commentStats.negative},${analysis.commentStats.neutral}\n\n`;
      }
      
      // Summary
      if (analysis.summary) {
        csvContent += 'AI Generated Summary\n';
        csvContent += `"${analysis.summary}"\n\n`;
      }
      
      // Metadata
      csvContent += 'Analysis Metadata\n';
      csvContent += 'Model Version,Processing Time\n';
      csvContent += `${analysis.modelVersion || 'Unknown'},${analysis.processingTime || 'Unknown'}ms\n`;
      
      return {
        success: true,
        data: csvContent,
        filename: `sentiment-analysis-${analysis.title?.replace(/[^a-z0-9]/gi, '-') || 'report'}-${Date.now()}.csv`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'CSV generation failed'
      };
    }
  }

  static async exportToJSON(analysis: SentimentAnalysis, options: ExportOptions): Promise<ExportResult> {
    try {
      const exportData = {
        ...analysis,
        exportOptions: options,
        exportTimestamp: new Date().toISOString()
      };
      
      const jsonContent = JSON.stringify(exportData, null, 2);
      
      return {
        success: true,
        data: jsonContent,
        filename: `sentiment-analysis-${analysis.title?.replace(/[^a-z0-9]/gi, '-') || 'report'}-${Date.now()}.json`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'JSON generation failed'
      };
    }
  }

  private static generatePDFHTML(analysis: SentimentAnalysis, options: ExportOptions): string {
    const sentimentColor = analysis.sentiment.score > 0.1 ? '#10B981' : 
                           analysis.sentiment.score < -0.1 ? '#EF4444' : '#6B7280';
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px;">
          <h1 style="color: #1f2937; margin: 0; font-size: 28px;">Sentiment Analysis Report</h1>
          <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">AI-Powered Content Insights</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 22px; margin-bottom: 15px;">Content Overview</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">Title</p>
                <p style="margin: 0; color: #1f2937; font-weight: 600; font-size: 16px;">${analysis.title || 'Untitled'}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">Category</p>
                <p style="margin: 0; color: #1f2937; font-weight: 600; font-size: 16px;">${analysis.category}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">Analysis Date</p>
                <p style="margin: 0; color: #1f2937; font-weight: 600; font-size: 16px;">${new Date(analysis.timestamp).toLocaleDateString()}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">Processing Time</p>
                <p style="margin: 0; color: #1f2937; font-weight: 600; font-size: 16px;">${analysis.processingTime || 'Unknown'}ms</p>
              </div>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 22px; margin-bottom: 15px;">Sentiment Analysis</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center;">
              <div>
                <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">Overall Sentiment</p>
                <p style="margin: 0; color: ${sentimentColor}; font-weight: 700; font-size: 24px;">
                  ${analysis.sentiment.score > 0 ? '+' : ''}${analysis.sentiment.score.toFixed(2)}
                </p>
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">${analysis.sentiment.label}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">Confidence</p>
                <p style="margin: 0; color: #1f2937; font-weight: 700; font-size: 24px;">
                  ${(analysis.sentiment.confidence * 100).toFixed(1)}%
                </p>
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">AI Confidence</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">Comments</p>
                <p style="margin: 0; color: #1f2937; font-weight: 700; font-size: 24px;">
                  ${analysis.commentStats?.total || 0}
                </p>
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">Total Analyzed</p>
              </div>
            </div>
          </div>
        </div>
        
        ${options.includeAnalysis && analysis.keywords && analysis.keywords.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 22px; margin-bottom: 15px;">Key Insights</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px;">Top Keywords Identified</p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
              ${analysis.keywords.slice(0, 10).map(keyword => 
                `<span style="background: #e5e7eb; color: #374151; padding: 5px 10px; border-radius: 15px; font-size: 12px;">${keyword}</span>`
              ).join('')}
            </div>
          </div>
        </div>
        ` : ''}
        
        ${options.includeAnalysis && analysis.summary ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 22px; margin-bottom: 15px;">AI Summary</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <p style="margin: 0; color: #1f2937; font-size: 16px; line-height: 1.6;">${analysis.summary}</p>
          </div>
        </div>
        ` : ''}
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
          <p style="margin: 0;">Generated by AI Sentiment Analyzer</p>
          <p style="margin: 5px 0 0 0;">Report generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;
  }

  static async exportReport(analysis: SentimentAnalysis, options: ExportOptions): Promise<ExportResult> {
    switch (options.format) {
      case 'pdf':
        return this.exportToPDF(analysis, options);
      case 'csv':
        return this.exportToCSV(analysis, options);
      case 'json':
        return this.exportToJSON(analysis, options);
      default:
        return {
          success: false,
          error: 'Unsupported export format'
        };
    }
  }
} 