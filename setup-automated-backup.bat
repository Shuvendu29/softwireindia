@echo off
echo ========================================
echo   Setting up Automated Firestore Backups
echo ========================================
echo.

set BACKUP_DATE=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%
set BACKUP_DATE=%BACKUP_DATE: =0%

echo Creating Firestore backup for: %BACKUP_DATE%
echo Backup location: gs://softwireindia.appspot.com/firestore-backups/%BACKUP_DATE%
echo.

echo Starting backup...
gcloud firestore export gs://softwireindia.appspot.com/firestore-backups/%BACKUP_DATE%

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS: Firestore backup completed!
    echo.
    echo Backup Details:
    echo - Date: %BACKUP_DATE%
    echo - Location: gs://softwireindia.appspot.com/firestore-backups/%BACKUP_DATE%
    echo - Project: softwireindia
    echo.
    echo This backup includes:
    echo - All user authentication data
    echo - User profiles and settings
    echo - Contact form submissions
    echo - Any custom collections
    echo.
) else (
    echo.
    echo ❌ ERROR: Backup failed!
    echo.
    echo Possible causes:
    echo 1. Insufficient permissions
    echo 2. Storage bucket access issues
    echo 3. Firestore not properly configured
    echo.
    echo To fix:
    echo 1. Ensure you have Firestore Admin role
    echo 2. Check storage bucket permissions
    echo 3. Verify project ID is correct
    echo.
)

echo ========================================
echo   Setting up Scheduled Backups
echo ========================================
echo.

echo To set up daily automated backups:
echo.
echo 1. Create a Cloud Scheduler job:
echo    gcloud scheduler jobs create app-engine backup-daily
echo      --schedule="0 2 * * *"
echo      --time-zone="Asia/Kolkata"
echo      --uri="/backup"
echo.
echo 2. Or use Windows Task Scheduler:
echo    - Schedule this script to run daily at 2 AM
echo    - Set it to run with your user account
echo    - Ensure gcloud is in PATH
echo.

echo ========================================
echo   Backup Verification
echo ========================================
echo.

echo Checking backup location...
gsutil ls gs://softwireindia.appspot.com/firestore-backups/

echo.
echo Recent backups:
gsutil ls -l gs://softwireindia.appspot.com/firestore-backups/ | tail -5

echo.
echo ========================================
echo   Data Recovery Information
echo ========================================
echo.
echo To restore from backup:
echo gcloud firestore import gs://softwireindia.appspot.com/firestore-backups/[BACKUP_FOLDER]
echo.
echo To list all backups:
echo gsutil ls gs://softwireindia.appspot.com/firestore-backups/
echo.
echo To delete old backups (after 90 days):
echo gsutil -m rm -r gs://softwireindia.appspot.com/firestore-backups/[OLD_BACKUP_FOLDER]
echo.

pause