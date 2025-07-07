@echo off
REM SoftWire India - Google OAuth Quick Setup Script (Windows)
REM This script helps you configure Google OAuth for your authentication system

echo 🚀 SoftWire India - Google OAuth Setup
echo ========================================
echo.

echo This script will help you set up Google OAuth for your SoftWire India authentication system.
echo.

REM Step 1: Open Google Cloud Console
echo 📋 Step 1: Setting up Google Cloud Project
echo -------------------------------------------
echo 1. I'll open Google Cloud Console for you
echo 2. Create a new project named 'SoftWire India Auth'
echo 3. Enable Google+ API
echo.
pause
start https://console.cloud.google.com/

echo.
echo 📋 Step 2: Create OAuth 2.0 Credentials
echo ----------------------------------------
echo 1. Go to 'APIs & Services' ^> 'Credentials'
echo 2. Click 'Create Credentials' ^> 'OAuth 2.0 Client IDs'
echo 3. Configure the OAuth consent screen if needed
echo 4. Use these settings:
echo.
echo    Application type: Web application
echo    Name: SoftWire India Web Client
echo.
echo    Authorized JavaScript origins:
echo    - https://softwireindia.com
echo    - https://www.softwireindia.com
echo    - http://localhost:8000
echo.
echo    Authorized redirect URIs:
echo    - https://softwireindia.com/auth.html
echo    - https://www.softwireindia.com/auth.html
echo    - http://localhost:8000/auth.html
echo.
pause

echo.
echo 📋 Step 3: Get Your Client ID
echo ------------------------------
echo 1. Copy the Client ID from Google Cloud Console
echo 2. It should look like: 123456789-abcdef.apps.googleusercontent.com
echo.
set /p CLIENT_ID=Enter your Google OAuth Client ID: 

if "%CLIENT_ID%"=="" (
    echo ❌ No Client ID provided. Please run this script again.
    pause
    exit /b 1
)

echo.
echo 📋 Step 4: Updating Configuration Files
echo ---------------------------------------

REM Update auth.html
if exist "auth.html" (
    REM Create backup
    copy "auth.html" "auth.html.backup" >nul
    
    REM Replace the client ID using PowerShell
    powershell -Command "(Get-Content 'auth.html') -replace 'YOUR_GOOGLE_CLIENT_ID\.apps\.googleusercontent\.com', '%CLIENT_ID%' | Set-Content 'auth.html'"
    
    echo ✅ Updated auth.html with your Client ID
) else (
    echo ❌ auth.html not found. Make sure you're running this script from the project root.
    pause
    exit /b 1
)

REM Update auth.js
if exist "js\auth.js" (
    REM Create backup
    copy "js\auth.js" "js\auth.js.backup" >nul
    
    REM Replace the client ID in auth.js
    powershell -Command "(Get-Content 'js\auth.js') -replace 'YOUR_GOOGLE_CLIENT_ID\.apps\.googleusercontent\.com', '%CLIENT_ID%' | Set-Content 'js\auth.js'"
    
    echo ✅ Updated js\auth.js with your Client ID
) else (
    echo ❌ js\auth.js not found.
)

REM Create auth-config.js from template
if exist "js\auth-config.template.js" (
    copy "js\auth-config.template.js" "js\auth-config.js" >nul
    powershell -Command "(Get-Content 'js\auth-config.js') -replace 'YOUR_GOOGLE_CLIENT_ID\.apps\.googleusercontent\.com', '%CLIENT_ID%' | Set-Content 'js\auth-config.js'"
    echo ✅ Created js\auth-config.js with your settings
)

echo.
echo 📋 Step 5: Testing Your Setup
echo -----------------------------
echo 1. Start your local server:
echo    npx http-server -p 8000 -o
echo.
echo 2. Open your browser to:
echo    http://localhost:8000/auth.html
echo.
echo 3. Click 'Continue with Google' and test the OAuth flow
echo.

echo.
echo 🎉 Setup Complete!
echo ==================
echo Your Google OAuth integration is now configured!
echo.
echo 📁 Files updated:
echo - auth.html (Client ID configured)
echo - js\auth.js (Client ID configured)
echo - js\auth-config.js (Configuration file created)
echo.
echo 📋 Next steps:
echo 1. Test locally at http://localhost:8000/auth.html
echo 2. Deploy to production
echo 3. Test on live site at https://www.softwireindia.com/auth.html
echo.
echo 🔧 Troubleshooting:
echo If you encounter issues, check:
echo 1. Client ID is correct
echo 2. Authorized domains are properly configured
echo 3. Google+ API is enabled in your Google Cloud project
echo.
echo 📞 Support:
echo Refer to GOOGLE_OAUTH_SETUP.md for detailed instructions
echo.

REM Commit changes
echo 📋 Step 6: Committing Changes
echo -----------------------------
set /p COMMIT=Do you want to commit these changes to Git? (y/n): 
if /i "%COMMIT%"=="y" (
    git add .
    git commit -m "Configure Google OAuth with Client ID: %CLIENT_ID%"
    echo ✅ Changes committed to Git
    
    set /p PUSH=Do you want to push to GitHub? (y/n): 
    if /i "%PUSH%"=="y" (
        git push origin main
        echo ✅ Changes pushed to GitHub
        echo 🚀 Your live site will be updated automatically via Render
    )
)

echo.
echo 🎉 All done! Your Google OAuth integration is ready!
echo Visit https://www.softwireindia.com/auth.html to test it live.
echo.
pause
