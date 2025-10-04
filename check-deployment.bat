@echo off
echo 🚀 SoftWire India - Google Cloud Deployment Status
echo.

echo Checking deployment status...
gcloud app describe --format="value(defaultHostname)"

echo.
echo 🌐 Your live website URLs:
echo.
echo Primary URL: https://softwireindia.el.r.appspot.com
echo.
echo 📊 Deployment Information:
gcloud app versions list --limit=1

echo.
echo 🔧 Useful Commands:
echo View logs: gcloud app logs tail -s default
echo Open in browser: gcloud app browse
echo View in console: https://console.cloud.google.com/appengine
echo.

echo 🎉 Testing your authentication system:
echo 1. Visit the URL above
echo 2. Click on authentication/login
echo 3. Test user registration
echo 4. Verify Firebase integration
echo.

pause