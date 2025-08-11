import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeText } from "./model.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Starting server...");

serve(async (req) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Parsing request body...");
    const { text } = await req.json();
    console.log("Received text:", text);

    if (!text) {
      throw new Error('Text is required');
    }

    // Analyze text using our model
    console.log("Starting sentiment analysis...");
    const startTime = performance.now();
    const result = await analyzeText(text);
    const endTime = performance.now();

    // Add processing time
    result.processing_time_ms = Math.round(endTime - startTime);
    console.log("Analysis complete:", result);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze text', details: error.message }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
}, { port: 3000 });