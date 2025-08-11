#!/bin/bash

# Check if SUPABASE_ACCESS_TOKEN is set
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "Error: SUPABASE_ACCESS_TOKEN is not set"
    echo "Please set it with: export SUPABASE_ACCESS_TOKEN='your-token'"
    exit 1
fi

# Check if SUPABASE_PROJECT_ID is set
if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "Error: SUPABASE_PROJECT_ID is not set"
    echo "Please set it with: export SUPABASE_PROJECT_ID='your-project-id'"
    exit 1
fi

echo "Deploying Edge Function..."

# Deploy the function
supabase functions deploy analyze-text --project-ref $SUPABASE_PROJECT_ID

echo "Deployment complete!"
echo "Testing the function..."

# Test the function with a sample text
curl -X POST "https://$SUPABASE_PROJECT_ID.supabase.co/functions/v1/analyze-text" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test message. I love this product!"}' 