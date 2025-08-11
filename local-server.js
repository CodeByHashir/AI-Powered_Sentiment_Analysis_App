const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple sentiment analysis function
function analyzeSentiment(text) {
  const words = text.toLowerCase().split(/\s+/);
  
  // Simple word-based sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'happy', 'delighted'];
  const negativeWords = ['bad', 'terrible', 'horrible', 'awful', 'poor', 'hate', 'dislike', 'unhappy', 'angry', 'upset'];
  
  let score = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) {
      score += 0.3;
      positiveCount++;
    } else if (negativeWords.includes(word)) {
      score -= 0.3;
      negativeCount++;
    }
  });
  
  // Normalize score to -1 to 1 range
  score = Math.max(-1, Math.min(1, score));
  
  // Determine sentiment label
  let sentiment = 'neutral';
  if (score > 0.1) sentiment = 'positive';
  else if (score < -0.1) sentiment = 'negative';
  
  // Calculate confidence
  const confidence = Math.min(0.5 + Math.abs(score) * 0.5, 0.95);
  
  return {
    sentiment,
    score,
    confidence,
    model_version: 'local-sentiment-v1.0',
    processing_time_ms: Math.floor(Math.random() * 100) + 50
  };
}

// API endpoint
app.post('/analyze-text', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    console.log(`Analyzing text: "${text}"`);
    
    const result = analyzeSentiment(text);
    console.log('Result:', result);
    
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Local sentiment analysis server is running' });
});

app.listen(port, () => {
  console.log(`🚀 Local sentiment analysis server running on http://localhost:${port}`);
  console.log(`📝 POST /analyze-text - Analyze text sentiment`);
  console.log(`❤️  GET /health - Check server status`);
}); 