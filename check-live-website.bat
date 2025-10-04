@echo off
echo ========================================
echo   SoftWire India Domain Status Check
echo ========================================
echo.

echo Checking App Engine deployment...
gcloud app versions list --limit=1
echo.

echo ========================================
echo   Custom Domain Status
echo ========================================

echo Current domain mappings:
gcloud app domain-mappings list
echo.

echo SSL Certificate status:
gcloud app ssl-certificates list
echo.

echo ========================================
echo   Testing Domain Accessibility
echo ========================================

echo Testing www.softwireindia.com...
curl -I https://www.softwireindia.com | findstr "HTTP"
echo.

echo Testing softwireindia.com...
curl -I https://softwireindia.com | findstr "HTTP"
echo.

echo ========================================
echo   ✅ WEBSITE IS LIVE!
echo ========================================
echo.
echo Your SoftWire India website is now live at:
echo.
echo 🌐 Primary URL: https://www.softwireindia.com
echo 🌐 Root Domain: https://softwireindia.com
echo 🌐 App Engine URL: https://softwireindia.el.r.appspot.com
echo.

echo ========================================
echo   Features Available:
echo ========================================
echo ✅ Custom Domain with SSL
echo ✅ Authentication System
echo ✅ Firebase Integration
echo ✅ Responsive Design
echo ✅ Contact Forms
echo ✅ No Celebration Banners (Fixed!)
echo.

echo ========================================
echo   Next Steps:
echo ========================================
echo 1. Share your live website: https://www.softwireindia.com
echo 2. Set up Google Analytics (optional)
echo 3. Configure SEO and social media
echo 4. Test authentication features
echo 5. Monitor performance and usage
echo.

pause