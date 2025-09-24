# 🚀 SoftWire India - Google Cloud Platform Deployment Guide

Complete guide to deploy your SoftWire India website to Google Cloud Platform with custom domain setup.

## 📋 Overview

This guide will help you deploy your website to Google App Engine and configure your custom domain (www.softwireindia.com) with SSL certificates.

### What You'll Get
- ✅ Fast, scalable hosting on Google Cloud
- ✅ Automatic SSL certificates
- ✅ Global CDN distribution
- ✅ 99.95% uptime SLA
- ✅ Built-in security features
- ✅ Easy scaling and monitoring

## 🛠️ Prerequisites

### Required Tools
1. **Google Cloud CLI** - [Download here](https://cloud.google.com/sdk/docs/install)
2. **Google Cloud Account** - [Sign up here](https://cloud.google.com/)
3. **Domain ownership** - www.softwireindia.com (BigRock)

### System Requirements
- Windows, macOS, or Linux
- Internet connection
- Terminal/Command Prompt access

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)

**Windows:**
```bash
# Run the deployment script
deploy-gcp.bat
```

**Mac/Linux:**
```bash
# Make script executable
chmod +x deploy-gcp.sh

# Run deployment
./deploy-gcp.sh
```

### Option 2: Manual Deployment

Follow the step-by-step instructions below.

## 📖 Step-by-Step Manual Deployment

### Step 1: Install Google Cloud CLI

**Windows:**
1. Download from: https://cloud.google.com/sdk/docs/install-sdk
2. Run the installer
3. Open Command Prompt and verify: `gcloud version`

**Mac:**
```bash
# Using Homebrew
brew install --cask google-cloud-sdk

# Verify installation
gcloud version
```

**Linux:**
```bash
# Download and install
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Verify installation
gcloud version
```

### Step 2: Authenticate with Google Cloud

```bash
# Login to your Google account
gcloud auth login

# Set up application default credentials
gcloud auth application-default login
```

### Step 3: Create Google Cloud Project

```bash
# Create a new project
gcloud projects create softwire-india-web --name="SoftWire India Website"

# Set as active project
gcloud config set project softwire-india-web

# Enable required APIs
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Step 4: Create App Engine Application

```bash
# Create App Engine app (choose your preferred region)
gcloud app create --region=us-central

# Available regions:
# us-central (Iowa, USA)
# us-east1 (South Carolina, USA)  
# europe-west (Belgium)
# asia-northeast1 (Tokyo, Japan)
```

### Step 5: Deploy Your Application

```bash
# Navigate to your project directory
cd /path/to/softwireindia

# Deploy to App Engine
gcloud app deploy

# Follow the prompts and confirm deployment
```

### Step 6: Verify Deployment

```bash
# Open your deployed app in browser
gcloud app browse

# Or get the URL
gcloud app browse --no-launch-browser
```

Your site will be available at: `https://softwire-india-web.appspot.com`

## 🌐 Custom Domain Setup (www.softwireindia.com)

### Step 1: Add Custom Domain in Google Cloud

```bash
# Add your custom domain
gcloud app domain-mappings create www.softwireindia.com

# Add root domain (optional)
gcloud app domain-mappings create softwireindia.com
```

### Step 2: Get DNS Records

```bash
# Get the required DNS records
gcloud app domain-mappings describe www.softwireindia.com
```

You'll get output similar to:
```
creationTime: '2025-09-24T10:00:00.000Z'
id: www.softwireindia.com
name: apps/softwire-india-web/domainMappings/www.softwireindia.com
resourceRecords:
- name: www.softwireindia.com
  rrdata: ghs.googlehosted.com
  type: CNAME
- name: softwireindia.com
  rrdata: 216.239.32.21
  type: A
```

### Step 3: Update DNS in BigRock

Login to your BigRock account and update DNS:

**A Record (Root Domain):**
```
Type: A
Name: @
Value: 216.239.32.21
TTL: 3600
```

**CNAME Record (WWW):**
```
Type: CNAME  
Name: www
Value: ghs.googlehosted.com
TTL: 3600
```

### Step 4: Wait for DNS Propagation

- **Time**: 24-48 hours
- **Check**: Use [DNS Checker](https://dnschecker.org/) to monitor propagation
- **SSL**: Google automatically provisions SSL certificates after DNS verification

## 📊 Configuration Files Explained

### app.yaml
Main configuration file for App Engine deployment:
```yaml
runtime: python39
handlers:
  - url: /
    static_files: index.html
    upload: index.html
  # ... other handlers
```

### .gcloudignore
Specifies files to ignore during deployment:
```
.git/
node_modules/
*.md
setup-*
```

## 🔧 Advanced Configuration

### Environment Variables

Add environment variables in `app.yaml`:
```yaml
env_variables:
  NODE_ENV: production
  API_BASE_URL: https://api.softwireindia.com
```

### Custom Headers

Configure security headers:
```yaml
headers:
  - name: X-Frame-Options
    value: DENY
  - name: Strict-Transport-Security  
    value: "max-age=31536000; includeSubDomains"
```

### Scaling Configuration

Configure auto-scaling:
```yaml
automatic_scaling:
  min_instances: 0
  max_instances: 10
  min_idle_instances: 0
  max_idle_instances: 1
```

## 🎛️ Management Commands

### Deployment Management
```bash
# Deploy new version
gcloud app deploy

# Deploy specific version
gcloud app deploy --version=v2

# Set traffic allocation
gcloud app services set-traffic default --splits=v1=50,v2=50

# List versions
gcloud app versions list

# Delete old version
gcloud app versions delete v1
```

### Domain Management
```bash
# List domain mappings
gcloud app domain-mappings list

# Delete domain mapping
gcloud app domain-mappings delete www.softwireindia.com

# Update SSL certificate (automatic)
gcloud app ssl-certificates list
```

### Monitoring and Logs
```bash
# View live logs
gcloud app logs tail -s default

# View logs for specific version
gcloud app logs tail -s default --version=v1

# Read recent logs
gcloud app logs read -s default --limit=100
```

## 🔍 Troubleshooting

### Common Issues

**1. Deployment Fails**
```bash
# Check app.yaml syntax
gcloud app deploy --dry-run

# View detailed error logs
gcloud app logs read -s default --limit=50
```

**2. Domain Not Working**
- Verify DNS records are correct
- Check DNS propagation: [DNSChecker.org](https://dnschecker.org/)
- Wait 24-48 hours for full propagation
- Ensure domain mapping exists: `gcloud app domain-mappings list`

**3. SSL Certificate Issues**
- SSL certificates are automatically provisioned after DNS verification
- May take up to 24 hours after DNS propagation
- Check status: `gcloud app ssl-certificates list`

**4. 404 Errors**
- Check `app.yaml` handlers configuration
- Ensure files exist in deployment package
- Verify routing rules

**5. Performance Issues**
- Check instance scaling configuration
- Monitor via Google Cloud Console
- Consider upgrading instance class

### Debug Commands
```bash
# Check project configuration
gcloud config list

# Verify App Engine app
gcloud app describe

# Test domain mapping
nslookup www.softwireindia.com

# Check SSL certificate
curl -I https://www.softwireindia.com
```

## 💰 Pricing Information

### App Engine Pricing (Approximate)
- **Free Tier**: 28 instance hours/day
- **Standard Instances**: $0.05-0.20/hour
- **Bandwidth**: $0.12/GB (outbound)
- **Storage**: $0.026/GB/month

### Estimated Monthly Cost
For typical small business website:
- **Traffic**: 10,000 visits/month
- **Storage**: 1GB
- **Estimated Cost**: $5-15/month

## 🔐 Security Best Practices

### Implemented Security Features
- ✅ HTTPS enforcement
- ✅ Security headers (HSTS, X-Frame-Options)
- ✅ Content Security Policy
- ✅ Input validation
- ✅ CSRF protection ready

### Additional Recommendations
1. **Enable Cloud Armor** for DDoS protection
2. **Set up monitoring** with Cloud Monitoring
3. **Configure alerts** for unusual traffic
4. **Regular security updates**
5. **Backup important data**

## 📈 Performance Optimization

### Built-in Optimizations
- ✅ Global CDN distribution
- ✅ Automatic compression
- ✅ HTTP/2 support
- ✅ Image optimization
- ✅ Caching headers

### Additional Optimizations
1. **Enable Cloud CDN** for static assets
2. **Optimize images** (WebP format)
3. **Minify CSS/JS** files
4. **Implement service workers**
5. **Use lazy loading**

## 🎯 Production Checklist

Before going live:
- [ ] Test all functionality (forms, auth, animations)
- [ ] Verify custom domain setup
- [ ] Check SSL certificate
- [ ] Test mobile responsiveness  
- [ ] Verify Google Analytics (if configured)
- [ ] Test email form submission
- [ ] Check page loading speed
- [ ] Verify all links work
- [ ] Test Google OAuth integration
- [ ] Monitor error logs

## 📞 Support and Resources

### Documentation
- [Google App Engine Docs](https://cloud.google.com/appengine/docs)
- [Custom Domains Guide](https://cloud.google.com/appengine/docs/standard/mapping-custom-domains)
- [SSL Certificates](https://cloud.google.com/appengine/docs/standard/securing-custom-domains-with-ssl)

### Getting Help
1. **Google Cloud Support** (paid plans)
2. **Stack Overflow** (tag: google-app-engine)
3. **Google Cloud Community** 
4. **Official documentation**

### Monitoring Resources
- **Google Cloud Console**: https://console.cloud.google.com/
- **App Engine Dashboard**: Monitor traffic, errors, performance
- **Logging**: Real-time log viewing and analysis

## 🎉 Success!

After completing this guide, you'll have:
✅ **SoftWire India deployed** to Google Cloud Platform
✅ **Custom domain** (www.softwireindia.com) configured  
✅ **SSL certificate** automatically provisioned
✅ **Global CDN** distribution enabled
✅ **Enterprise-grade** hosting infrastructure
✅ **99.95% uptime** SLA
✅ **Automatic scaling** based on traffic

Your professional website is now live with enterprise-grade infrastructure!

---

## 🚀 Quick Commands Reference

```bash
# Deploy
gcloud app deploy

# View logs  
gcloud app logs tail -s default

# Open in browser
gcloud app browse

# Add custom domain
gcloud app domain-mappings create www.softwireindia.com

# Check status
gcloud app domain-mappings list
```

**Your SoftWire India website is now ready for the world! 🌍**