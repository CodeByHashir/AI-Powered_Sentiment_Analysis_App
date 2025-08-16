# 🚀 Setup Guide - Advanced Sentiment Analysis Dashboard

> **Complete setup instructions to get your dashboard running in minutes!**

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended
- **Modern Browser** - Chrome, Firefox, Safari, Edge

## 🔑 API Keys Setup

### **1. YouTube Data API v3**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key

### **2. Supabase Account**
1. Visit [Supabase](https://supabase.com/)
2. Sign up/Login with GitHub
3. Create a new project
4. Go to Settings → API
5. Copy Project URL and anon key

### **3. Custom BERT Model Setup**
1. Ensure your custom trained BERT model files are in the `models/` directory
2. Verify model files include: `config.json`, `pytorch_model.bin`, `tokenizer.json`
3. Check model compatibility with your Supabase Edge Functions
4. Test model inference locally before deployment

## 🛠️ Installation Steps

### **Step 1: Clone Repository**
```bash
git clone <your-repository-url>
cd Sentiment-Analysis
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Environment Configuration**
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your API keys
# Use your preferred text editor
```

### **Step 4: Add Your API Keys**
Edit the `.env` file and add your actual API keys:

```env
VITE_YOUTUBE_API_KEY=AIzaSyC...your_actual_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_USE_CUSTOM_MODEL=true
VITE_MODEL_PATH=./models/sentiment-bert
```

### **Step 5: Start Development Server**
```bash
npm run dev
```

### **Step 6: Open in Browser**
Navigate to: `http://localhost:5173`

## 🔧 Configuration Details

### **Environment Variables Explained**

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_YOUTUBE_API_KEY` | YouTube Data API key for video analysis | ✅ Yes |
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ Yes |
| `VITE_USE_CUSTOM_MODEL` | Enable custom BERT model | ✅ Yes |
| `VITE_MODEL_PATH` | Path to custom model files | ✅ Yes |
| `VITE_DEBUG_MODE` | Enable debug logging | ❌ No |
| `VITE_API_TIMEOUT` | API request timeout (ms) | ❌ No |

### **API Limits & Quotas**

#### **YouTube Data API v3**
- **Free Tier**: 10,000 requests/day
- **Quota Cost**: 1 unit per request
- **Rate Limit**: 1,000 requests/100 seconds

#### **Custom BERT Model**
- **Model Type**: Custom trained BERT for sentiment analysis
- **Inference**: Local processing via Supabase Edge Functions
- **Performance**: Optimized for your specific use case
- **Scalability**: Limited by Edge Function resources

#### **Supabase**
- **Free Tier**: 50,000 monthly active users
- **Database**: 500MB
- **Edge Functions**: 500,000 invocations/month

## 🚀 Development Workflow

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### **Code Quality Tools**
- **ESLint** - Code linting and best practices
- **Prettier** - Code formatting (auto-format on save)
- **TypeScript** - Type safety and IntelliSense

### **VS Code Extensions (Recommended)**
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**
- **TypeScript Importer**

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **1. "Module not found" errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **2. API key errors**
- Verify all API keys are correct in `.env`
- Check API quotas and limits
- Ensure APIs are enabled in respective dashboards

#### **3. Build errors**
```bash
# Clear build cache
npm run build --force
# or
rm -rf dist/
npm run build
```

#### **4. Port already in use**
```bash
# Kill process on port 5173
npx kill-port 5173
# or change port in vite.config.js
```

### **Debug Mode**
Enable debug mode in `.env`:
```env
VITE_DEBUG_MODE=true
```

This will show detailed API calls and responses in the console.

## 📱 Testing Your Setup

### **1. Basic Functionality Test**
1. Enter a YouTube video URL
2. Click "Analyze Video"
3. Verify sentiment analysis works
4. Check dashboard displays data

### **2. API Connectivity Test**
1. Open browser console (F12)
2. Look for API call logs
3. Verify no error messages
4. Check network tab for successful requests

### **3. Dashboard Features Test**
1. Navigate between all tabs
2. Verify charts render properly
3. Check real-time updates work
4. Test export functionality

## 🔒 Security Notes

### **API Key Protection**
- **Never commit** `.env` files to Git
- **Use environment variables** in production
- **Rotate API keys** regularly
- **Monitor API usage** for unusual activity

### **Production Deployment**
- Use environment variables in hosting platform
- Enable HTTPS
- Set up proper CORS policies
- Monitor error logs

## 📚 Next Steps

### **After Successful Setup**
1. **Explore Features** - Try all dashboard tabs
2. **Test with Different Videos** - Various content types
3. **Customize Dashboard** - Modify colors, layouts
4. **Deploy to Production** - Vercel, Netlify, etc.

### **Advanced Customization**
- Modify chart colors and styles
- Add new analytics metrics
- Integrate additional APIs
- Customize dashboard layout

## 🆘 Getting Help

### **Support Resources**
- **GitHub Issues** - Report bugs and request features
- **Documentation** - Check README.md for details
- **Code Examples** - Review component files
- **Community** - Stack Overflow, Discord, etc.

### **Useful Links**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/)

---

**🎉 Congratulations! Your dashboard is now running locally.**

**Next: Deploy to production and showcase your skills!**
