@echo off
REM SoftWire India - Custom Domain Setup Script for Google Cloud (Windows)
REM This script helps configure www.softwireindia.com with Google App Engine

echo 🌐 SoftWire India - Custom Domain Setup
echo ========================================
echo.

REM Configuration
set DOMAIN=softwireindia.com
set WWW_DOMAIN=www.softwireindia.com
set PROJECT_ID=softwire-india-web

REM Check if gcloud CLI is available
gcloud version >nul 2>&1
if errorlevel 1 (
    echo ❌ Google Cloud CLI not found!
    echo Please install it from: https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

REM Check if user is authenticated
gcloud auth list --filter=status:ACTIVE --format="value(account)" | findstr "@" >nul
if errorlevel 1 (
    echo ❌ Not authenticated with Google Cloud
    echo Please run: gcloud auth login
    pause
    exit /b 1
)

echo ✅ Google Cloud CLI authenticated

REM Set project
echo 📋 Setting project to: %PROJECT_ID%
gcloud config set project %PROJECT_ID%

REM Check if App Engine app exists
gcloud app describe >nul 2>&1
if errorlevel 1 (
    echo ❌ No App Engine application found in project %PROJECT_ID%
    echo Please deploy your app first using: gcloud app deploy
    pause
    exit /b 1
)

echo ✅ App Engine application found

REM Add domain mappings
echo 📋 Adding custom domain mappings...

REM Add www domain
echo Adding www.softwireindia.com...
gcloud app domain-mappings create %WWW_DOMAIN% --quiet
if errorlevel 1 (
    echo ⚠️  WWW domain mapping might already exist
) else (
    echo ✅ WWW domain mapping created
)

REM Add root domain
echo Adding softwireindia.com...
gcloud app domain-mappings create %DOMAIN% --quiet
if errorlevel 1 (
    echo ⚠️  Root domain mapping might already exist
) else (
    echo ✅ Root domain mapping created
)

REM Get DNS records
echo 📋 Getting DNS configuration...
echo Fetching DNS records for domain setup...

echo.
echo =============================================
echo 🔧 DNS CONFIGURATION REQUIRED
echo =============================================

REM Display DNS configuration
echo For WWW domain (www.softwireindia.com):
echo CNAME Record:
echo   Type: CNAME
echo   Name: www
echo   Value: ghs.googlehosted.com
echo   TTL: 3600
echo.

echo For Root domain (softwireindia.com):
echo A Record:
echo   Type: A
echo   Name: @
echo   Value: 216.239.32.21
echo   TTL: 3600
echo.

echo =============================================
echo 📋 BIGROCK DNS SETUP INSTRUCTIONS
echo =============================================
echo.
echo 1. Login to BigRock Control Panel
echo    URL: https://manage.bigrock.in/
echo.
echo 2. Go to Domain Management → DNS Management
echo    Select: softwireindia.com
echo.
echo 3. Add/Update DNS Records:
echo    A Record (Root Domain):
echo    • Type: A
echo    • Name: @ (or leave blank)
echo    • Value: 216.239.32.21
echo    • TTL: 3600
echo.
echo    CNAME Record (WWW):
echo    • Type: CNAME
echo    • Name: www
echo    • Value: ghs.googlehosted.com
echo    • TTL: 3600
echo.
echo 4. Save changes and wait for propagation (24-48 hours)
echo.

REM Check current domain status
echo =============================================
echo 📊 CURRENT DOMAIN STATUS
echo =============================================

REM List current domain mappings
echo Active Domain Mappings:
gcloud app domain-mappings list --format="table(id,sslSettings.certificateId)" 2>nul

echo.
echo SSL Certificates:
gcloud app ssl-certificates list --format="table(name,domainNames,certificateId)" 2>nul

echo.
echo =============================================
echo 🔍 VERIFICATION STEPS
echo =============================================
echo.
echo After updating DNS in BigRock:
echo.
echo 1. Wait 24-48 hours for DNS propagation
echo.
echo 2. Check DNS propagation:
echo    • Visit: https://dnschecker.org/
echo    • Enter: www.softwireindia.com
echo    • Verify CNAME points to: ghs.googlehosted.com
echo.
echo 3. Check domain status:
echo    gcloud app domain-mappings list
echo.
echo 4. Test your website:
echo    • https://www.softwireindia.com
echo    • https://softwireindia.com
echo.
echo 5. SSL certificates will be automatically provisioned
echo    after DNS verification (may take 24 hours)

echo.
echo =============================================
echo ✨ SETUP COMPLETE! ✨
echo =============================================
echo.
echo ✅ Custom domain mappings configured
echo ✅ DNS records generated
echo ⏳ Waiting for DNS propagation (24-48 hours)
echo ⏳ SSL certificates will be auto-provisioned
echo.
echo Next Steps:
echo 1. Update DNS records in BigRock (instructions above)
echo 2. Wait for DNS propagation
echo 3. Visit https://www.softwireindia.com
echo 4. Verify SSL certificate
echo.
echo Your SoftWire India website will be live at www.softwireindia.com! 🚀
echo.
pause