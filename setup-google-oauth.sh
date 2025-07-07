#!/bin/bash

# SoftWire India - Google OAuth Quick Setup Script
# This script helps you configure Google OAuth for your authentication system

echo "🚀 SoftWire India - Google OAuth Setup"
echo "========================================"
echo

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "🪟 Detected Windows environment"
    OPEN_CMD="start"
else
    echo "🐧 Detected Unix-like environment"
    OPEN_CMD="open"
fi

echo "This script will help you set up Google OAuth for your SoftWire India authentication system."
echo

# Step 1: Open Google Cloud Console
echo "📋 Step 1: Setting up Google Cloud Project"
echo "-------------------------------------------"
echo "1. I'll open Google Cloud Console for you"
echo "2. Create a new project named 'SoftWire India Auth'"
echo "3. Enable Google+ API"
echo
read -p "Press Enter to open Google Cloud Console..."
$OPEN_CMD https://console.cloud.google.com/

echo
echo "📋 Step 2: Create OAuth 2.0 Credentials"
echo "----------------------------------------"
echo "1. Go to 'APIs & Services' > 'Credentials'"
echo "2. Click 'Create Credentials' > 'OAuth 2.0 Client IDs'"
echo "3. Configure the OAuth consent screen if needed"
echo "4. Use these settings:"
echo
echo "   Application type: Web application"
echo "   Name: SoftWire India Web Client"
echo
echo "   Authorized JavaScript origins:"
echo "   - https://softwireindia.com"
echo "   - https://www.softwireindia.com"
echo "   - http://localhost:8000"
echo
echo "   Authorized redirect URIs:"
echo "   - https://softwireindia.com/auth.html"
echo "   - https://www.softwireindia.com/auth.html"
echo "   - http://localhost:8000/auth.html"
echo
read -p "Press Enter after you've created the OAuth credentials..."

echo
echo "📋 Step 3: Get Your Client ID"
echo "------------------------------"
echo "1. Copy the Client ID from Google Cloud Console"
echo "2. It should look like: 123456789-abcdef.apps.googleusercontent.com"
echo
read -p "Enter your Google OAuth Client ID: " CLIENT_ID

if [ -z "$CLIENT_ID" ]; then
    echo "❌ No Client ID provided. Please run this script again."
    exit 1
fi

echo
echo "📋 Step 4: Updating Configuration Files"
echo "---------------------------------------"

# Update auth.html
if [ -f "auth.html" ]; then
    # Create backup
    cp auth.html auth.html.backup
    
    # Replace the client ID
    sed -i.bak "s/YOUR_GOOGLE_CLIENT_ID\.apps\.googleusercontent\.com/$CLIENT_ID/g" auth.html
    
    echo "✅ Updated auth.html with your Client ID"
else
    echo "❌ auth.html not found. Make sure you're running this script from the project root."
    exit 1
fi

# Update auth.js
if [ -f "js/auth.js" ]; then
    # Create backup
    cp js/auth.js js/auth.js.backup
    
    # Replace the client ID in auth.js
    sed -i.bak "s/YOUR_GOOGLE_CLIENT_ID\.apps\.googleusercontent\.com/$CLIENT_ID/g" js/auth.js
    
    echo "✅ Updated js/auth.js with your Client ID"
else
    echo "❌ js/auth.js not found."
fi

# Create auth-config.js from template
if [ -f "js/auth-config.template.js" ]; then
    cp js/auth-config.template.js js/auth-config.js
    sed -i.bak "s/YOUR_GOOGLE_CLIENT_ID\.apps\.googleusercontent\.com/$CLIENT_ID/g" js/auth-config.js
    echo "✅ Created js/auth-config.js with your settings"
fi

echo
echo "📋 Step 5: Testing Your Setup"
echo "-----------------------------"
echo "1. Start your local server:"
echo "   npx http-server -p 8000 -o"
echo
echo "2. Open your browser to:"
echo "   http://localhost:8000/auth.html"
echo
echo "3. Click 'Continue with Google' and test the OAuth flow"
echo

echo
echo "🎉 Setup Complete!"
echo "=================="
echo "Your Google OAuth integration is now configured!"
echo
echo "📁 Files updated:"
echo "- auth.html (Client ID configured)"
echo "- js/auth.js (Client ID configured)"
echo "- js/auth-config.js (Configuration file created)"
echo
echo "📋 Next steps:"
echo "1. Test locally at http://localhost:8000/auth.html"
echo "2. Deploy to production"
echo "3. Test on live site at https://www.softwireindia.com/auth.html"
echo
echo "🔧 Troubleshooting:"
echo "If you encounter issues, check:"
echo "1. Client ID is correct"
echo "2. Authorized domains are properly configured"
echo "3. Google+ API is enabled in your Google Cloud project"
echo
echo "📞 Support:"
echo "Refer to GOOGLE_OAUTH_SETUP.md for detailed instructions"
echo

# Commit changes
echo "📋 Step 6: Committing Changes"
echo "-----------------------------"
read -p "Do you want to commit these changes to Git? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git add .
    git commit -m "Configure Google OAuth with Client ID: $CLIENT_ID"
    echo "✅ Changes committed to Git"
    
    read -p "Do you want to push to GitHub? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin main
        echo "✅ Changes pushed to GitHub"
        echo "🚀 Your live site will be updated automatically via Render"
    fi
fi

echo
echo "🎉 All done! Your Google OAuth integration is ready!"
echo "Visit https://www.softwireindia.com/auth.html to test it live."
