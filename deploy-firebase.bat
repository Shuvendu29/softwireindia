@echo off
echo 🚀 Deploying SoftWire India to Google Cloud (Firebase Hosting)
echo.

echo Step 1: Checking Firebase CLI installation...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI not found. Please install it first:
    echo npm install -g firebase-tools
    echo.
    echo If you have disk space issues, try:
    echo npx firebase-tools login
    echo npx firebase-tools deploy
    pause
    exit /b 1
)

echo ✅ Firebase CLI found
echo.

echo Step 2: Logging into Firebase...
firebase login --no-localhost
if %errorlevel% neq 0 (
    echo ❌ Firebase login failed
    pause
    exit /b 1
)

echo ✅ Successfully logged in
echo.

echo Step 3: Deploying to Firebase Hosting...
firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ❌ Deployment failed
    pause
    exit /b 1
)

echo.
echo 🎉 SUCCESS! Your SoftWire India website is now live!
echo 🌐 Visit: https://softwireindia.web.app
echo 🌐 Or: https://softwireindia.firebaseapp.com
echo.
echo Next steps:
echo 1. Test your live website
echo 2. Set up custom domain (softwireindia.com)
echo 3. Configure SSL certificate
echo.
pause