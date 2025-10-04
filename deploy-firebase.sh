#!/bin/bash

echo "🚀 Deploying SoftWire India to Google Cloud (Firebase Hosting)"
echo ""

echo "Step 1: Checking Firebase CLI installation..."
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    echo ""
    echo "If you have disk space issues, try:"
    echo "npx firebase-tools login"
    echo "npx firebase-tools deploy"
    exit 1
fi

echo "✅ Firebase CLI found"
echo ""

echo "Step 2: Logging into Firebase..."
firebase login --no-localhost
if [ $? -ne 0 ]; then
    echo "❌ Firebase login failed"
    exit 1
fi

echo "✅ Successfully logged in"
echo ""

echo "Step 3: Deploying to Firebase Hosting..."
firebase deploy --only hosting
if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "🎉 SUCCESS! Your SoftWire India website is now live!"
echo "🌐 Visit: https://softwireindia.web.app"
echo "🌐 Or: https://softwireindia.firebaseapp.com"
echo ""
echo "Next steps:"
echo "1. Test your live website"
echo "2. Set up custom domain (softwireindia.com)"
echo "3. Configure SSL certificate"
echo ""