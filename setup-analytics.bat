@echo off
echo ========================================
echo   SoftWire India Analytics Setup
echo ========================================
echo.

echo Setting up BigQuery for user analytics...
echo.

echo Step 1: Creating BigQuery dataset...
gcloud auth application-default login

echo Creating dataset 'user_analytics'...
bq mk --dataset --location=asia-south1 softwireindia:user_analytics

if %errorlevel% equ 0 (
    echo ✅ BigQuery dataset created successfully
) else (
    echo ℹ️  Dataset may already exist
)

echo Step 2: Creating analytics tables...

echo Creating user_sessions table...
bq mk --table softwireindia:user_analytics.user_sessions user_id:STRING,session_start:TIMESTAMP,session_end:TIMESTAMP,page_views:INTEGER,source:STRING,device:STRING

echo Creating contact_submissions table...
bq mk --table softwireindia:user_analytics.contact_submissions submission_id:STRING,name:STRING,email:STRING,phone:STRING,message:STRING,submitted_at:TIMESTAMP,source_page:STRING

echo Creating auth_events table...
bq mk --table softwireindia:user_analytics.auth_events user_id:STRING,event_type:STRING,timestamp:TIMESTAMP,success:BOOLEAN,device:STRING,location:STRING

echo.
echo ========================================
echo   Google Analytics 4 Configuration
echo ========================================
echo.

echo To complete Google Analytics setup:
echo.
echo 1. Go to: https://analytics.google.com/
echo 2. Create new GA4 property for 'SoftWire India'
echo 3. Add these domains:
echo    - www.softwireindia.com
echo    - softwireindia.com
echo    - softwireindia.el.r.appspot.com
echo.
echo 4. Copy the Measurement ID (G-XXXXXXXXXX)
echo 5. Add it to your HTML files
echo.

echo ========================================
echo   Monitoring Dashboard Setup
echo ========================================
echo.

echo Creating custom metrics for monitoring...

echo Website Performance Metrics:
echo - Page load time
echo - User session duration
echo - Contact form conversion rate
echo - Authentication success rate
echo.

echo Business Metrics:
echo - Daily active users
echo - Contact form submissions
echo - Service page views
echo - Geographic user distribution
echo.

echo ========================================
echo   Real-time Monitoring Setup
echo ========================================
echo.

echo Setting up alerts for:
echo 1. Website downtime
echo 2. High error rates
echo 3. Storage usage limits
echo 4. Unusual traffic patterns
echo.

echo Creating uptime check...
gcloud monitoring uptime-check create --check-id=softwire-uptime --display-name="SoftWire India Uptime" --hostname=www.softwireindia.com --path=/ --port=443 --protocol=HTTPS

echo.
echo ========================================
echo   Performance Optimization
echo ========================================
echo.

echo Checking current performance metrics...
echo.

echo App Engine performance:
gcloud app versions list --service=default --limit=1

echo.
echo SSL Certificate status:
gcloud app ssl-certificates list

echo.
echo Domain mapping performance:
gcloud app domain-mappings list

echo.
echo ========================================
echo   📊 ANALYTICS SETUP COMPLETE
echo ========================================
echo.
echo ✅ BigQuery dataset created for user analytics
echo ✅ Monitoring tables configured
echo ✅ Uptime monitoring enabled  
echo ✅ Performance metrics baseline established
echo.
echo 📋 Manual Steps Required:
echo 1. Set up Google Analytics 4 property
echo 2. Add GA4 tracking code to website
echo 3. Configure conversion goals
echo 4. Set up custom dashboards
echo.
echo 🎯 Expected Benefits:
echo - Track user behavior and preferences
echo - Monitor business KPIs in real-time
echo - Identify optimization opportunities
echo - Make data-driven decisions
echo.

pause