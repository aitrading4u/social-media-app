#!/bin/bash

echo "🚀 Social Media App Deployment Script"
echo "====================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy Backend
echo "🔧 Deploying Backend..."
cd server
vercel --prod

# Get backend URL
BACKEND_URL=$(vercel ls | grep server | awk '{print $2}')
echo "✅ Backend deployed at: $BACKEND_URL"

# Deploy Frontend
echo "🎨 Deploying Frontend..."
cd ../client

# Update environment variables
echo "REACT_APP_API_URL=$BACKEND_URL" > .env
echo "REACT_APP_WS_URL=wss://$BACKEND_URL" >> .env

vercel --prod

# Get frontend URL
FRONTEND_URL=$(vercel ls | grep client | awk '{print $2}')
echo "✅ Frontend deployed at: $FRONTEND_URL"

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo "🌐 Your app is live at: $FRONTEND_URL"
echo "🔧 Backend API: $BACKEND_URL"
echo ""
echo "📱 Share this URL with your friends worldwide!"
echo "🌍 They can now register, post photos/videos, make calls, and chat!" 