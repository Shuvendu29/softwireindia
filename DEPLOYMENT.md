# SoftWire India - Deployment Guide

This guide will help you deploy your SoftWire India coming soon page to Render.com and configure your BigRock domain.

## 🚀 Updated Deployment Process for www.softwireindia.com

### ✅ Code Updated Successfully!
- **Countdown now starts from 88 days** (October 2, 2025)
- **Code pushed to GitHub** and ready for deployment

### Step 1: Complete Render Deployment

1. **Go back to your Render dashboard**
   - Visit: [dashboard.render.com](https://dashboard.render.com)
   - Find your `softwireindia-coming-soon` service

2. **Fix Build Settings**
   - Go to Settings
   - **Build Command**: Clear completely (make it empty)
   - **Publish Directory**: Keep as `.`
   - **Auto-Deploy**: Keep as "On Commit"
   - **Save changes**

3. **Manual Deploy (if needed)**
   - Go to "Deploys" tab
   - Click "Manual Deploy" → "Deploy Latest Commit"
   - Wait for deployment to complete

4. **Get Your Render URL**
   - Copy your live URL (something like: `https://softwireindia-coming-soon.onrender.com`)
   - **Test this URL first** to ensure everything works

### Step 2: Configure DNS in BigRock for www.softwireindia.com

**Important:** Replace `YOUR-RENDER-URL` with your actual Render URL from Step 1.

**In your BigRock DNS Management:**

1. **Add A Record for Root Domain**
   ```
   Type: A
   Name: @ (or leave blank)
   Value: 216.24.57.1
   TTL: 3600
   ```

2. **Add CNAME Record for WWW**
   ```
   Type: CNAME
   Name: www
   Value: YOUR-RENDER-URL.onrender.com
   TTL: 3600
   ```

### Step 3: Add Custom Domain in Render

1. **In Render Dashboard → Settings → Custom Domains**
2. **Add these domains:**
   - `softwireindia.com`
   - `www.softwireindia.com`
3. **Save changes**

### Step 4: Wait for Propagation

- **DNS propagation**: 24-48 hours
- **SSL certificate**: Automatic from Render
- **Test URLs**:
  - `https://www.softwireindia.com`
  - `https://softwireindia.com`

## 🎯 What You'll See:

Your beautiful coming soon page with:
- ✅ **88-day countdown** starting from today
- ✅ **AI-themed animations** and particle effects
- ✅ **Email subscription form**
- ✅ **Complete Login/Registration system**
- ✅ **Google OAuth integration** (configurable)
- ✅ **Phone number verification** with OTP
- ✅ **Responsive design** for all devices
- ✅ **Professional branding** for SoftWire India

## 🔐 Authentication Features Added:

**New Files Created:**
- `auth.html` - Login and Registration page
- `css/auth.css` - Authentication styling
- `js/auth.js` - Authentication logic
- `js/auth-particles.js` - Background animations

**Features Include:**
- ✅ **Email/Password Registration**
- ✅ **Google Sign-In Integration**
- ✅ **Phone Number Registration**
- ✅ **OTP Verification System**
- ✅ **Password Strength Checking**
- ✅ **Form Validation**
- ✅ **Responsive Design**
- ✅ **Beautiful UI with animations**

**Demo Credentials:**
- Email: `demo@softwireindia.com`
- Password: `Demo123!`
- OTP: Any 6-digit number

**Google OAuth Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Replace `YOUR_GOOGLE_CLIENT_ID` in `auth.html`

**Access the Auth System:**
- Visit: `https://www.softwireindia.com/auth.html`
- Or click "Login/Register" on the homepage

## 🔧 Post-Deployment Configuration

### Analytics Setup (Optional)

1. **Google Analytics**
   - Create GA4 property
   - Add tracking code to `index.html`
   - Replace `GA_MEASUREMENT_ID` with your actual ID

2. **Search Console**
   - Add property in Google Search Console
   - Verify domain ownership
   - Submit sitemap.xml

### Email Integration (Optional)

1. **Choose Email Service**
   - Netlify Forms (free)
   - EmailJS (free tier)
   - Mailchimp API
   - SendGrid API

2. **Update Form Handler**
   - Replace mock submission in `js/main.js`
   - Add your chosen service integration

### Performance Optimization

1. **Image Optimization**
   - Convert images to WebP format
   - Use appropriate sizes for different devices
   - Implement lazy loading

2. **CDN Configuration**
   - Render automatically provides CDN
   - Monitor performance metrics

## 🛠️ Troubleshooting

### 🚨 URGENT: Site Access Issues from Other Devices

**Problem**: Cannot access www.softwireindia.com from other devices
**Status**: DNS is resolving correctly, but there may be deployment or configuration issues

**Immediate Actions Required:**

1. **Check Render Deployment Status**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Find your `softwireindia-coming-soon` service
   - Check if deployment is "Live" and green
   - If not, redeploy manually

2. **Verify Build Settings in Render**
   - Settings → Build Command: **MUST BE EMPTY**
   - Settings → Publish Directory: **MUST BE `.`**
   - Settings → Auto-Deploy: **MUST BE ENABLED**
   - Save changes and redeploy if needed

3. **Check Custom Domain Configuration**
   - In Render → Settings → Custom Domains
   - Ensure both domains are added and verified:
     - `softwireindia.com` ✅
     - `www.softwireindia.com` ✅
   - SSL status should be "Active"

4. **Test Direct Render URL First**
   - Visit your direct Render URL (e.g., `https://softwireindia-coming-soon.onrender.com`)
   - If this doesn't work, the issue is with your deployment
   - If this works, the issue is with DNS/custom domain

## 🔧 Complete Fix for Device Access Issues

### Quick Diagnostic Steps

**Step 1: Test Your Direct Render URL**
```bash
# Open this URL in any browser on any device
https://softwireindia-coming-soon.onrender.com
```

**Step 2: Check DNS Propagation**
```bash
# Windows Command Prompt
nslookup www.softwireindia.com
nslookup softwireindia.com
```

**Step 3: Clear DNS Cache**
```bash
# Windows
ipconfig /flushdns
```

### 🚀 Complete Fix Process

#### Fix 1: Ensure Render Deployment is Working

1. **Login to Render Dashboard**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Find your service: `softwireindia-coming-soon`

2. **Check Deployment Status**
   - Status should be "Live" with green indicator
   - If not, click "Manual Deploy" → "Deploy Latest Commit"

3. **Verify Settings**
   ```
   Build Command: [EMPTY - DELETE ANY CONTENT]
   Publish Directory: .
   Auto-Deploy: Yes
   ```

4. **Test Direct URL**
   - Copy your `.onrender.com` URL
   - Test on multiple devices
   - If this fails, your deployment is broken

#### Fix 2: Fix Custom Domain Configuration

1. **In Render Dashboard → Settings → Custom Domains**
   - Remove existing domains if any
   - Add fresh: `softwireindia.com`
   - Add fresh: `www.softwireindia.com`
   - Wait for SSL verification

2. **Verify DNS in BigRock**
   ```
   A Record:
   Name: @
   Value: 216.24.57.1
   TTL: 3600
   
   CNAME Record:
   Name: www
   Value: softwireindia-coming-soon.onrender.com
   TTL: 3600
   ```

#### Fix 3: Force DNS Refresh

1. **On Each Device**
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac/Linux
   sudo dscacheutil -flushcache
   
   # Mobile: Restart device or change to Google DNS
   ```

2. **Test Multiple DNS Servers**
   - Try 8.8.8.8 (Google)
   - Try 1.1.1.1 (Cloudflare)
   - Try your ISP's DNS

#### Fix 4: Browser-Specific Issues

1. **Clear Browser Cache**
   - Press `Ctrl + Shift + R` (hard refresh)
   - Clear all browsing data
   - Try incognito/private mode

2. **Test Different Browsers**
   - Chrome
   - Firefox
   - Safari
   - Edge

#### Fix 5: Network-Specific Issues

1. **Try Different Networks**
   - Mobile data vs WiFi
   - Different WiFi networks
   - VPN if available

2. **Check Firewall/Antivirus**
   - Temporarily disable
   - Add exception for the domain

### 🎯 Expected Results After Fix

Your site should load with:
- ✅ Beautiful AI-themed landing page
- ✅ 88-day countdown timer
- ✅ Smooth animations and particle effects
- ✅ Working email subscription form
- ✅ Responsive design on all devices

### 🔍 Advanced Debugging

If issues persist, check:

1. **Console Errors**
   - Press F12 → Console tab
   - Look for red error messages
   - Share screenshots if needed

2. **Network Tab**
   - F12 → Network tab
   - Reload page
   - Check for failed requests

3. **Security Issues**
   - Mixed content warnings
   - SSL certificate errors
   - CORS issues

### 📞 Get Help

**If you're still having issues:**

1. **Check Render Status**
   - Visit [status.render.com](https://status.render.com)
   - Look for platform issues

2. **Check BigRock Status**
   - Login to BigRock account
   - Verify domain is active
   - Check DNS management panel

3. **Contact Support**
   - Render support for deployment issues
   - BigRock support for DNS issues

---

## 🎉 Success Checklist

- [ ] Repository created and pushed to GitHub
- [ ] Site deployed successfully on Render
- [ ] Custom domain configured with BigRock
- [ ] DNS records pointing correctly
- [ ] SSL certificate active
- [ ] Site loading at https://softwireindia.com
- [ ] All animations working
- [ ] Mobile responsiveness verified
- [ ] Email form functional
- [ ] Performance optimized
- [ ] Analytics configured (optional)

**Congratulations! Your SoftWire India coming soon page is now live! 🚀**
