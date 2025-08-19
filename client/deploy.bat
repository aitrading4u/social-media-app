@echo off
echo 🚀 Freedom Social - Global Deployment Script
echo =============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the app
echo 🔨 Building the app...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Build successful!

echo.
echo 🌍 Deployment Options:
echo 1. Deploy to Vercel (Recommended)
echo 2. Deploy to Netlify
echo 3. Deploy to GitHub Pages
echo 4. Just build (no deployment)
echo.

set /p choice="Choose an option (1-4): "

if "%choice%"=="1" (
    echo 🚀 Deploying to Vercel...
    vercel --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo 📦 Installing Vercel CLI...
        npm install -g vercel
    )
    vercel --prod
) else if "%choice%"=="2" (
    echo 🚀 Deploying to Netlify...
    netlify --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo 📦 Installing Netlify CLI...
        npm install -g netlify-cli
    )
    netlify deploy --prod --dir=build
) else if "%choice%"=="3" (
    echo 🚀 Deploying to GitHub Pages...
    echo 📦 Installing gh-pages...
    npm install --save-dev gh-pages
    npm run deploy
) else if "%choice%"=="4" (
    echo ✅ Build completed. Ready for manual deployment.
    echo 📁 Your built app is in the 'build' folder
) else (
    echo ❌ Invalid option. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment process completed!
echo 📱 Your app is now ready to share with friends worldwide!
echo.
echo 📖 For detailed instructions, see DEPLOYMENT_GUIDE.md
pause 