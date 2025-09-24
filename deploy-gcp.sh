#!/bin/bash

# SoftWire India - Google Cloud Platform Deployment Script
# This script automates the deployment process to Google App Engine

echo "🚀 SoftWire India - Google Cloud Deployment"
echo "============================================"
echo

# Configuration
PROJECT_ID="softwire-india-web"
SERVICE_NAME="default"
VERSION="v1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI not found!${NC}"
    echo "Please install Google Cloud CLI from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo -e "${GREEN}✅ Google Cloud CLI found${NC}"

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}⚠️  Not logged in to Google Cloud${NC}"
    echo "Please login first:"
    echo "gcloud auth login"
    exit 1
fi

echo -e "${GREEN}✅ Authenticated with Google Cloud${NC}"

# Function to check if project exists
check_project() {
    if gcloud projects describe $1 &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Set or create project
echo -e "${BLUE}📋 Setting up Google Cloud Project...${NC}"
if check_project $PROJECT_ID; then
    echo -e "${GREEN}✅ Project $PROJECT_ID exists${NC}"
    gcloud config set project $PROJECT_ID
else
    echo -e "${YELLOW}⚠️  Project $PROJECT_ID not found${NC}"
    read -p "Do you want to create project '$PROJECT_ID'? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Creating project..."
        gcloud projects create $PROJECT_ID --name="SoftWire India Website"
        gcloud config set project $PROJECT_ID
        echo -e "${GREEN}✅ Project created successfully${NC}"
    else
        echo "Please set your project ID:"
        read -p "Enter your Google Cloud Project ID: " PROJECT_ID
        gcloud config set project $PROJECT_ID
    fi
fi

# Enable required APIs
echo -e "${BLUE}📋 Enabling required APIs...${NC}"
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
echo -e "${GREEN}✅ APIs enabled${NC}"

# Create App Engine app if it doesn't exist
echo -e "${BLUE}📋 Setting up App Engine...${NC}"
if ! gcloud app describe &> /dev/null; then
    echo "Creating App Engine application..."
    echo "Available regions:"
    echo "  us-central    (Iowa)"
    echo "  us-east1      (South Carolina)"
    echo "  europe-west   (Belgium)"
    echo "  asia-northeast1 (Tokyo)"
    echo
    read -p "Enter your preferred region [us-central]: " REGION
    REGION=${REGION:-us-central}
    
    gcloud app create --region=$REGION
    echo -e "${GREEN}✅ App Engine application created${NC}"
else
    echo -e "${GREEN}✅ App Engine application already exists${NC}"
fi

# Pre-deployment checks
echo -e "${BLUE}📋 Running pre-deployment checks...${NC}"

# Check if required files exist
REQUIRED_FILES=("index.html" "auth.html" "app.yaml")
for file in "${REQUIRED_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo -e "${GREEN}✅ $file found${NC}"
    else
        echo -e "${RED}❌ $file not found${NC}"
        exit 1
    fi
done

# Validate app.yaml
if gcloud app deploy --dry-run --quiet &> /dev/null; then
    echo -e "${GREEN}✅ app.yaml is valid${NC}"
else
    echo -e "${RED}❌ app.yaml has errors${NC}"
    exit 1
fi

# Build and deploy
echo -e "${BLUE}🚀 Deploying to Google App Engine...${NC}"
echo "This may take several minutes..."

if gcloud app deploy --quiet --version=$VERSION; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Get the deployed URL
APP_URL=$(gcloud app browse --no-launch-browser 2>/dev/null | grep "https://")
if [ -z "$APP_URL" ]; then
    APP_URL="https://$PROJECT_ID.appspot.com"
fi

echo
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "========================================"
echo -e "${BLUE}📱 Your website is now live at:${NC}"
echo -e "${YELLOW}$APP_URL${NC}"
echo
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Visit your website: $APP_URL"
echo "2. Test all functionality (auth, forms, animations)"
echo "3. Set up custom domain: www.softwireindia.com"
echo "4. Configure SSL certificate"
echo "5. Update DNS settings"
echo
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "• View logs:     gcloud app logs tail -s default"
echo "• Open browser:  gcloud app browse"
echo "• Deploy again:  gcloud app deploy"
echo "• View versions: gcloud app versions list"
echo
echo -e "${GREEN}✨ SoftWire India is now live on Google Cloud! ✨${NC}"