#!/bin/bash

echo "🚀 Freedom Social - Global Deployment Script"
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🔨 Building the app..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🌍 Deployment Options:"
echo "1. Deploy to Vercel (Recommended)"
echo "2. Deploy to Netlify"
echo "3. Deploy to GitHub Pages"
echo "4. Just build (no deployment)"
echo ""

read -p "Choose an option (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "📦 Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod --dir=build
        ;;
    3)
        echo "🚀 Deploying to GitHub Pages..."
        if ! command -v gh-pages &> /dev/null; then
            echo "📦 Installing gh-pages..."
            npm install --save-dev gh-pages
        fi
        npm run deploy
        ;;
    4)
        echo "✅ Build completed. Ready for manual deployment."
        echo "📁 Your built app is in the 'build' folder"
        ;;
    *)
        echo "❌ Invalid option. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo "📱 Your app is now ready to share with friends worldwide!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" 