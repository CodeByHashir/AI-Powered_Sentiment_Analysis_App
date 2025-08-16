# 🚀 Advanced Sentiment Analysis Dashboard

> **Professional-grade content analytics platform with real-time insights, AI-powered recommendations, and interactive visualizations.**

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.0+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Supabase](https://img.shields.io/badge/Supabase-Edge%20Functions-orange)

## ✨ Features

### 🎯 **Core Analytics**
- **Real-time Sentiment Analysis** - Live content sentiment scoring
- **Advanced Performance Metrics** - Engagement rates, viral potential, brand safety
- **Interactive Visualizations** - Radar charts, area charts, bar charts
- **AI-Powered Insights** - Content recommendations and strategy optimization

### 📊 **Dashboard Capabilities**
- **Performance Scoring** - 0-100 content quality assessment
- **Audience Analytics** - Demographics, engagement patterns, growth metrics
- **Trend Analysis** - Real-time performance tracking and forecasting
- **Brand Safety Monitoring** - Toxicity detection and alerts

### 🔧 **Technical Features**
- **Real-time Updates** - Live data refresh every 30 seconds
- **Responsive Design** - Mobile-first, cross-platform compatibility
- **Professional UI/UX** - Modern design with smooth animations
- **Export Functionality** - PDF and CSV export capabilities

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development and better code quality
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Recharts** - Professional data visualization library
- **Lucide React** - Beautiful, customizable icons

### **Backend & APIs**
- **Supabase Edge Functions** - Serverless backend with Deno runtime
- **YouTube Data API v3** - Video analytics and metadata
- **Custom Trained BERT Model** - AI-powered sentiment analysis
- **Real-time Database** - Live data synchronization

### **Development Tools**
- **Vite** - Fast build tool and development server
- **ESLint & Prettier** - Code quality and formatting
- **Git** - Version control and collaboration

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Supabase account
- YouTube Data API key
- BERT Model Integration for Live Sentiments Anlalysis

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Sentiment-Analysis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your API keys to .env file
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# YouTube Data API
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Custom BERT Model Configuration
VITE_USE_CUSTOM_MODEL=true
VITE_MODEL_PATH=./models/sentiment-bert
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── SentimentDashboard.tsx    # Main dashboard
│   ├── ComparativeAnalysis.tsx   # Video comparison
│   └── ...
├── services/            # API services
│   ├── youtubeApi.ts   # YouTube API integration
│   └── ...
├── types/               # TypeScript interfaces
├── utils/               # Helper functions
└── App.tsx             # Main application
```

## 🎯 Usage Examples

### **Single Video Analysis**
```typescript
import { YouTubeApiService } from './services/youtubeApi';

const analysis = await YouTubeApiService.analyzeVideo('VIDEO_ID');
console.log('Sentiment Score:', analysis.sentiment.score);
```

### **Comparative Analysis**
```typescript
const comparison = await YouTubeApiService.compareVideos('VIDEO1_ID', 'VIDEO2_ID');
console.log('Performance Score:', comparison.contentScore);
```

## 📊 Dashboard Features

### **Overview Tab**
- **Performance Score** - Real-time content quality assessment
- **Engagement Metrics** - Live engagement rates and ratios
- **Brand Safety** - Toxicity monitoring and alerts
- **Viral Potential** - Content virality scoring

### **Performance Tab**
- **Radar Analysis** - Multi-dimensional performance visualization
- **Detailed Metrics** - Comprehensive performance breakdown
- **Real-time Updates** - Live metric calculations

### **Audience Tab**
- **Demographics** - Viewer insights and engagement patterns
- **Quality Scoring** - Audience relevance and retention
- **Growth Opportunities** - Strategic recommendations

### **Trends Tab**
- **Performance Tracking** - Real-time trend analysis
- **Volatility Metrics** - Performance stability indicators
- **Peak Analysis** - Best performance identification

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

### **Netlify**
```bash
npm run build
# Drag dist/ folder to Netlify
```

### **GitHub Pages**
```bash
npm run build
# Configure GitHub Actions for auto-deployment
```

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### **Code Quality**
- **ESLint** - Code linting and best practices
- **Prettier** - Code formatting
- **TypeScript** - Type safety and IntelliSense

## 📈 Performance Features

### **Real-time Analytics**
- **Live Updates** - Data refreshes every 30 seconds
- **Dynamic Calculations** - Real-time metric computation
- **Performance Scoring** - Live content quality assessment
- **Trend Analysis** - Continuous performance monitoring

### **Interactive Visualizations**
- **Responsive Charts** - Adapt to any screen size
- **Hover Tooltips** - Detailed information on demand
- **Smooth Animations** - Professional user experience
- **Multiple Chart Types** - Bar, line, area, and radar charts

## 🎨 UI/UX Features

### **Modern Design**
- **Clean Interface** - Professional, minimal appearance
- **Color-coded Metrics** - Intuitive performance indicators
- **Responsive Layout** - Works on all devices
- **Smooth Transitions** - Professional animations

### **User Experience**
- **Loading States** - Clear feedback during operations
- **Error Handling** - Graceful error management
- **Performance Alerts** - Smart notification system
- **Quick Actions** - One-click optimizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **YouTube Data API** - Video analytics and metadata
- **Hugging Face** - AI-powered sentiment analysis
- **Supabase** - Backend infrastructure and edge functions
- **Recharts** - Professional data visualization
- **Tailwind CSS** - Utility-first CSS framework

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the documentation
- Review the code examples

---

**⭐ Star this repository if you found it helpful!**

**🔗 Connect with me:**
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn]
- GitHub: [Your GitHub]

---

*Built with ❤️ using modern web technologies*
