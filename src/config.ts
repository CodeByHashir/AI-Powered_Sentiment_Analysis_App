// Configuration file for environment variables
export const config = {
  // YouTube API
  youtube: {
    apiKey: import.meta.env.VITE_YOUTUBE_API_KEY || 'YOUR_API_KEY',
    apiBase: 'https://www.googleapis.com/youtube/v3'
  },
  
  // Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://dunhogxoagqltvlccaus.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bmhvZ3hvbWFnbHFsdHZsY2NhdXMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDk5NzI5MCwiZXhwIjoyMDUwNTczMjkwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
  }
};

// Simple debug logging
if (import.meta.env.DEV) {
  console.log('🔧 Config loaded:', {
    hasYouTubeKey: !!config.youtube.apiKey,
    hasSupabaseUrl: !!config.supabase.url,
    hasSupabaseKey: !!config.supabase.anonKey,
    youtubeKeyLength: config.youtube.apiKey?.length || 0
  });
} 
