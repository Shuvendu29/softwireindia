@echo off
REM SoftWire India - Google Cloud Platform Deployment Script (Windows)
REM This script automates the deployment process to Google App Engine

echo 🚀 SoftWire India - Google Cloud Deployment
echo ============================================
echo.

REM Configuration
set PROJECT_ID=softwire-india-web
set SERVICE_NAME=default
set VERSION=v1

REM Check if gcloud CLI is installed
gcloud version >nul 2>&1
if errorlevel 1 (
    echo ❌ Google Cloud CLI not found!
    echo Please install Google Cloud CLI from: https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

echo ✅ Google Cloud CLI found

REM Check if user is logged in
gcloud auth list --filter=status:ACTIVE --format="value(account)" | findstr "@" >nul
if errorlevel 1 (
    echo ⚠️  Not logged in to Google Cloud
    echo Please login first:
    echo gcloud auth login
    pause
    exit /b 1
)

echo ✅ Authenticated with Google Cloud

REM Set project
echo 📋 Setting up Google Cloud Project...
gcloud projects describe %PROJECT_ID% >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Project %PROJECT_ID% not found
    set /p CREATE_PROJECT=Do you want to create project '%PROJECT_ID%'? (y/n): 
    if /i "%CREATE_PROJECT%"=="y" (
        echo Creating project...
        gcloud projects create %PROJECT_ID% --name="SoftWire India Website"
        gcloud config set project %PROJECT_ID%
        echo ✅ Project created successfully
    ) else (
        set /p PROJECT_ID=Enter your Google Cloud Project ID: 
        gcloud config set project %PROJECT_ID%
    )
) else (
    echo ✅ Project %PROJECT_ID% exists
    gcloud config set project %PROJECT_ID%
)

REM Enable required APIs
echo 📋 Enabling required APIs...
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
echo ✅ APIs enabled

REM Create App Engine app if it doesn't exist
echo 📋 Setting up App Engine...
gcloud app describe >nul 2>&1
if errorlevel 1 (
    echo Creating App Engine application...
    echo Available regions:
    echo   us-central    (Iowa)
    echo   us-east1      (South Carolina)
    echo   europe-west   (Belgium)
    echo   asia-northeast1 (Tokyo)
    echo.
    set /p REGION=Enter your preferred region [us-central]: 
    if "%REGION%"=="" set REGION=us-central
    
    gcloud app create --region=%REGION%
    echo ✅ App Engine application created
) else (
    echo ✅ App Engine application already exists
)

REM Pre-deployment checks
echo 📋 Running pre-deployment checks...

REM Check if required files exist
if exist "index.html" (
    echo ✅ index.html found
) else (
    echo ❌ index.html not found
    pause
    exit /b 1
)

if exist "auth.html" (
    echo ✅ auth.html found
) else (
    echo ❌ auth.html not found
    pause
    exit /b 1
)

if exist "app.yaml" (
    echo ✅ app.yaml found
) else (
    echo ❌ app.yaml not found
    pause
    exit /b 1
)

REM Validate app.yaml
gcloud app deploy --dry-run --quiet >nul 2>&1
if errorlevel 1 (
    echo ❌ app.yaml has errors
    pause
    exit /b 1
) else (
    echo ✅ app.yaml is valid
)

REM Build and deploy
echo 🚀 Deploying to Google App Engine...
echo This may take several minutes...

gcloud app deploy --quiet --version=%VERSION%
if errorlevel 1 (
    echo ❌ Deployment failed
    pause
    exit /b 1
) else (
    echo ✅ Deployment successful!
)

REM Get the deployed URL
for /f "tokens=*" %%i in ('gcloud app browse --no-launch-browser 2^>nul ^| findstr "https://"') do set APP_URL=%%i
if "%APP_URL%"=="" set APP_URL=https://%PROJECT_ID%.appspot.com

echo.
echo 🎉 Deployment Complete!
echo ========================================
echo 📱 Your website is now live at:
echo %APP_URL%
echo.
echo 📋 Next Steps:
echo 1. Visit your website: %APP_URL%
echo 2. Test all functionality (auth, forms, animations)
echo 3. Set up custom domain: www.softwireindia.com
echo 4. Configure SSL certificate
echo 5. Update DNS settings
echo.
echo 🔧 Management Commands:
echo • View logs:     gcloud app logs tail -s default
echo • Open browser:  gcloud app browse
echo • Deploy again:  gcloud app deploy
echo • View versions: gcloud app versions list
echo.
echo ✨ SoftWire India is now live on Google Cloud! ✨
echo.
pause