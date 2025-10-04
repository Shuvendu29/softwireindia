@echo off
echo ========================================
echo   Custom Domain Setup for softwire.com
echo ========================================
echo.

echo Step 1: Checking current App Engine domains...
gcloud app domain-mappings list
echo.

echo Step 2: Checking project configuration...
gcloud config get-value project
echo.

echo ========================================
echo   MANUAL STEPS REQUIRED FIRST:
echo ========================================
echo 1. Register domain 'softwire.com' with a registrar
echo 2. Verify domain ownership in Google Search Console:
echo    https://search.google.com/search-console
echo 3. Add the Google verification TXT record to DNS
echo.

set /p verified="Have you completed domain verification? (y/N): "
if /i "%verified%" neq "y" (
    echo.
    echo Please complete domain verification first.
    echo See CUSTOM_DOMAIN_SETUP.md for detailed instructions.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Creating Domain Mappings...
echo ========================================

echo Creating mapping for root domain...
gcloud app domain-mappings create softwire.com
if %errorlevel% neq 0 (
    echo Failed to create mapping for softwire.com
    echo Make sure domain is verified in Google Search Console
    pause
    exit /b 1
)

echo.
echo Creating mapping for www subdomain...
gcloud app domain-mappings create www.softwire.com
if %errorlevel% neq 0 (
    echo Failed to create mapping for www.softwire.com
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Domain Mappings Created Successfully!
echo ========================================

echo Checking created mappings...
gcloud app domain-mappings list

echo.
echo ========================================
echo   NEXT STEPS:
echo ========================================
echo 1. Configure DNS records in your domain registrar:
echo.
echo    For ROOT DOMAIN (softwire.com):
echo    Type: A
echo    Name: @ ^(or blank^)
echo    Values: 216.239.32.21
echo            216.239.34.21
echo            216.239.36.21
echo            216.239.38.21
echo.
echo    For WWW SUBDOMAIN (www.softwire.com):
echo    Type: CNAME
echo    Name: www
echo    Value: ghs.googlehosted.com
echo.
echo 2. Wait 15-60 minutes for SSL certificate provisioning
echo 3. Wait 24-48 hours for DNS propagation
echo 4. Test: https://www.softwire.com
echo.

echo ========================================
echo   Checking SSL Certificates...
echo ========================================
gcloud app ssl-certificates list

echo.
echo Setup complete! Monitor SSL certificate status.
echo Check CUSTOM_DOMAIN_SETUP.md for troubleshooting.
pause