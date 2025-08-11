# YouTube API Setup Guide

## 🎥 Getting Your YouTube API Key

### Step 1: Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3

### Step 2: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key

### Step 3: Configure Environment
Create or update your `.env.local` file:

```bash
# YouTube API Configuration
VITE_YOUTUBE_API_KEY=your-actual-api-key-here
```

## 🔧 Features Added

### YouTube Video Analysis
- ✅ Extract video details (title, description, stats)
- ✅ Fetch and analyze comments
- ✅ Sentiment analysis of video content
- ✅ Comment sentiment breakdown
- ✅ Enhanced UI with YouTube branding

### Advanced UI Features
- ✅ YouTube-specific analysis options
- ✅ Comment filtering and sorting
- ✅ Enhanced sentiment statistics
- ✅ Interactive charts and visualizations
- ✅ Responsive design improvements

## 🚀 How to Use

1. **Select YouTube Category**: Choose "YouTube" from content type options
2. **Paste YouTube URL**: Enter any YouTube video URL
3. **Configure Options**: 
   - Enable/disable comment analysis
   - Set maximum comment count (50-500)
4. **Analyze**: Click "Analyze URL" to start analysis

## 📊 What You'll Get

- **Video Information**: Title, description, channel, stats
- **Content Sentiment**: AI-powered analysis of video content
- **Comment Analysis**: Sentiment breakdown of user comments
- **Statistics**: Detailed metrics and insights
- **Visual Charts**: Interactive sentiment distribution

## 🎯 Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/v/VIDEO_ID`

## ⚠️ Important Notes

- YouTube API has daily quotas (usually 10,000 units/day)
- Each video analysis uses ~1-2 API units
- Comment analysis uses additional API units
- Keep your API key secure and don't commit it to version control

## 🔍 Troubleshooting

### "API Key Invalid" Error
- Check your `.env.local` file
- Ensure the key is correct
- Verify YouTube Data API v3 is enabled

### "Quota Exceeded" Error
- Wait for quota reset (usually daily)
- Reduce comment analysis frequency
- Consider upgrading your Google Cloud plan

### "Video Not Found" Error
- Check if the video is public
- Verify the URL format
- Ensure the video hasn't been deleted

## 🎨 Customization

You can customize the analysis by modifying:
- `src/services/youtubeApi.ts` - API logic
- `src/components/YouTubeCommentsList.tsx` - Comment display
- `src/components/EnhancedSentimentStats.tsx` - Statistics display

## 📱 Next Steps

After setting up YouTube API:
1. Test with a YouTube video URL
2. Explore comment analysis features
3. Customize the UI to your preferences
4. Add more content type integrations

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify your API key is correct
3. Ensure all dependencies are installed
4. Check YouTube API quotas and status 