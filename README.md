# AI Sentiment Analyzer

A focused AI platform that analyzes sentiment from text and YouTube content using advanced BERT models.

![AI Sentiment Analyzer Screenshot](screenshot.png)

## Overview

This AI platform provides comprehensive sentiment analysis for:
- **General text input** - Direct text analysis with confidence scoring
- **YouTube comments** - Community sentiment analysis from video comments
- **YouTube video transcripts** - Content sentiment analysis from video transcripts

## Features

- **Text Analysis**: Analyze any text input for sentiment with confidence scores
- **YouTube Analysis**: Extract and analyze video transcripts and comments
- **Sentiment Visualization**: Clear visual representation of sentiment with confidence scores
- **Insights & Trends**: Keyword extraction, summary generation, and sentiment patterns
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**:
  - React with TypeScript
  - TailwindCSS for styling
  - Vite for development and building

- **Backend**:
  - Supabase Edge Functions (Deno runtime)
  - Custom BERT sentiment analysis model

## Sentiment Analysis Model

The platform uses a custom BERT-based sentiment analysis model that:

- Identifies positive, negative, and neutral sentiments
- Handles negations and context
- Provides confidence scores
- Returns normalized sentiment scores from -1 (negative) to +1 (positive)
- Extracts keywords and generates insights

## Installation

### Prerequisites

- Node.js 16+
- npm or yarn
- Deno (for local Edge Function development)
- Supabase CLI (for deploying Edge Functions)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/CodeByHashir/AI-Powered-Sentiment-Analysis-.git
   cd AI-Powered-Sentiment-Analysis-
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase URL and anon key

4. Run development server:
   ```
   npm run dev
   ```

5. In a separate terminal, run the Edge Function locally:
   ```
   cd supabase/functions/analyze-text
   deno run --allow-read --allow-net --allow-env index.ts
   ```

## Usage

### Text Analysis

1. Enter text in the "Text to Analyze" field
2. Click "Analyze Text"
3. View the sentiment results, including:
   - Sentiment classification (positive, negative, or neutral)
   - Confidence score
   - Keywords extracted
   - Summary insights

### YouTube Analysis

1. Enter a YouTube URL in the input field
2. Configure comment analysis options
3. Click "Analyze YouTube Content"
4. View comprehensive results including:
   - Video transcript sentiment
   - Comment sentiment analysis
   - Community engagement insights
   - Trend detection

## Deployment

### Frontend

Deploy to Vercel, Netlify or any static hosting service:

```
npm run build
```

Then deploy the contents of the `dist` folder.

### Edge Function

Deploy to Supabase:

```
cd supabase/functions/analyze-text
supabase functions deploy analyze-text
```

## Project Structure

```
/
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── types/            # TypeScript type definitions
│   ├── services/         # API services
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
├── supabase/
│   └── functions/
│       └── analyze-text/ # Edge Function for sentiment analysis
│           ├── index.ts  # Entry point for Edge Function
│           └── model.ts  # Sentiment analysis model implementation
├── public/               # Static assets
└── index.html            # HTML template
```

## Core Capabilities

### 1. Text Sentiment Analysis
- Real-time text processing
- Confidence scoring
- Keyword extraction
- Sentiment classification

### 2. YouTube Content Analysis
- Video transcript extraction
- Comment sentiment analysis
- Community engagement metrics
- Trend detection

### 3. AI-Powered Insights
- BERT model accuracy
- Context-aware analysis
- Comprehensive reporting
- Exportable results

## Future Enhancements

- User authentication for saving analysis results
- Advanced emotion categorization
- Multi-language support
- Real-time sentiment monitoring
- API rate limiting and optimization

## License

MIT License

## Acknowledgements

- [Supabase](https://supabase.com/) for the serverless backend
- [React](https://reactjs.org/) for the frontend framework
- [TailwindCSS](https://tailwindcss.com/) for styling
- [BERT Models](https://huggingface.co/) for AI-powered sentiment analysis
