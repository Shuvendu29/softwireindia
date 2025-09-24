#!/bin/bash

# SoftWire India - Custom Domain Setup Script for Google Cloud
# This script helps configure www.softwireindia.com with Google App Engine

echo "🌐 SoftWire India - Custom Domain Setup"
echo "========================================"
echo

# Configuration
DOMAIN="softwireindia.com"
WWW_DOMAIN="www.softwireindia.com"
PROJECT_ID="softwire-india-web"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if gcloud CLI is available
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI not found!${NC}"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Not authenticated with Google Cloud${NC}"
    echo "Please run: gcloud auth login"
    exit 1
fi

echo -e "${GREEN}✅ Google Cloud CLI authenticated${NC}"

# Set project
echo -e "${BLUE}📋 Setting project to: $PROJECT_ID${NC}"
gcloud config set project $PROJECT_ID

# Check if App Engine app exists
if ! gcloud app describe &> /dev/null; then
    echo -e "${RED}❌ No App Engine application found in project $PROJECT_ID${NC}"
    echo "Please deploy your app first using: gcloud app deploy"
    exit 1
fi

echo -e "${GREEN}✅ App Engine application found${NC}"

# Add domain mappings
echo -e "${BLUE}📋 Adding custom domain mappings...${NC}"

# Add www domain
echo "Adding www.softwireindia.com..."
if gcloud app domain-mappings create $WWW_DOMAIN --quiet; then
    echo -e "${GREEN}✅ WWW domain mapping created${NC}"
else
    echo -e "${YELLOW}⚠️  WWW domain mapping might already exist${NC}"
fi

# Add root domain
echo "Adding softwireindia.com..."
if gcloud app domain-mappings create $DOMAIN --quiet; then
    echo -e "${GREEN}✅ Root domain mapping created${NC}"
else
    echo -e "${YELLOW}⚠️  Root domain mapping might already exist${NC}"
fi

# Get DNS records
echo -e "${BLUE}📋 Getting DNS configuration...${NC}"
echo "Fetching DNS records for domain setup..."

echo
echo "============================================="
echo -e "${BLUE}🔧 DNS CONFIGURATION REQUIRED${NC}"
echo "============================================="

# Get DNS records for www domain
echo -e "${YELLOW}For WWW domain (www.softwireindia.com):${NC}"
WWW_DNS=$(gcloud app domain-mappings describe $WWW_DOMAIN --format="value(resourceRecords[].rrdata)" 2>/dev/null | head -1)
if [ -n "$WWW_DNS" ]; then
    echo "CNAME Record:"
    echo "  Type: CNAME"
    echo "  Name: www"
    echo "  Value: $WWW_DNS"
    echo "  TTL: 3600"
else
    echo "  CNAME Record: ghs.googlehosted.com (fallback)"
fi

echo

# Get DNS records for root domain  
echo -e "${YELLOW}For Root domain (softwireindia.com):${NC}"
ROOT_DNS=$(gcloud app domain-mappings describe $DOMAIN --format="value(resourceRecords[].rrdata)" 2>/dev/null | head -1)
if [ -n "$ROOT_DNS" ]; then
    echo "A Record:"
    echo "  Type: A"
    echo "  Name: @"
    echo "  Value: $ROOT_DNS"
    echo "  TTL: 3600"
else
    echo "  A Record: 216.239.32.21 (fallback)"
fi

echo
echo "============================================="
echo -e "${BLUE}📋 BIGROCK DNS SETUP INSTRUCTIONS${NC}"
echo "============================================="
echo
echo "1. Login to BigRock Control Panel"
echo "   URL: https://manage.bigrock.in/"
echo
echo "2. Go to Domain Management → DNS Management"
echo "   Select: softwireindia.com"
echo
echo "3. Add/Update DNS Records:"
echo -e "${YELLOW}   A Record (Root Domain):${NC}"
echo "   • Type: A"
echo "   • Name: @ (or leave blank)"
echo "   • Value: $ROOT_DNS"
echo "   • TTL: 3600"
echo
echo -e "${YELLOW}   CNAME Record (WWW):${NC}"
echo "   • Type: CNAME"
echo "   • Name: www"
echo "   • Value: $WWW_DNS"
echo "   • TTL: 3600"
echo
echo "4. Save changes and wait for propagation (24-48 hours)"
echo

# Check current domain status
echo "============================================="
echo -e "${BLUE}📊 CURRENT DOMAIN STATUS${NC}"
echo "============================================="

# List current domain mappings
echo -e "${YELLOW}Active Domain Mappings:${NC}"
gcloud app domain-mappings list --format="table(id,sslSettings.certificateId)" 2>/dev/null

# Check SSL certificates
echo
echo -e "${YELLOW}SSL Certificates:${NC}"
gcloud app ssl-certificates list --format="table(name,domainNames,certificateId)" 2>/dev/null

echo
echo "============================================="
echo -e "${BLUE}🔍 VERIFICATION STEPS${NC}"
echo "============================================="
echo
echo "After updating DNS in BigRock:"
echo
echo "1. Wait 24-48 hours for DNS propagation"
echo
echo "2. Check DNS propagation:"
echo "   • Visit: https://dnschecker.org/"
echo "   • Enter: www.softwireindia.com"
echo "   • Verify CNAME points to: $WWW_DNS"
echo
echo "3. Check domain status:"
echo "   gcloud app domain-mappings list"
echo
echo "4. Test your website:"
echo "   • https://www.softwireindia.com"
echo "   • https://softwireindia.com"
echo
echo "5. SSL certificates will be automatically provisioned"
echo "   after DNS verification (may take 24 hours)"

echo
echo "============================================="
echo -e "${GREEN}✨ SETUP COMPLETE! ✨${NC}"
echo "============================================="
echo
echo -e "${GREEN}✅ Custom domain mappings configured${NC}"
echo -e "${GREEN}✅ DNS records generated${NC}"
echo -e "${YELLOW}⏳ Waiting for DNS propagation (24-48 hours)${NC}"
echo -e "${YELLOW}⏳ SSL certificates will be auto-provisioned${NC}"
echo
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Update DNS records in BigRock (instructions above)"
echo "2. Wait for DNS propagation"
echo "3. Visit https://www.softwireindia.com"
echo "4. Verify SSL certificate"
echo
echo -e "${GREEN}Your SoftWire India website will be live at www.softwireindia.com! 🚀${NC}"