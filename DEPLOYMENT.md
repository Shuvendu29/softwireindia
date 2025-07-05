# SoftWire India - Deployment Guide

This guide will help you deploy your SoftWire India coming soon page to Render.com and configure your BigRock domain.

## 🚀 Complete Deployment Process

### Step 1: Prepare Your Repository

1. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SoftWire India coming soon page"
   ```

2. **Create GitHub Repository**
   - Go to GitHub.com
   - Create a new repository named `softwireindia`
   - Don't initialize with README (you already have one)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/softwireindia.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy on Render.com

1. **Sign up/Login to Render**
   - Go to [render.com](https://render.com)
   - Sign up or login with your GitHub account

2. **Create New Static Site**
   - Click "New +" button
   - Select "Static Site"
   - Choose "Connect a repository"
   - Select your `softwireindia` repository

3. **Configure Deployment Settings**
   ```
   Name: softwireindia-coming-soon
   Branch: main
   Build Command: (leave empty)
   Publish Directory: . (dot for root)
   Auto-Deploy: Yes
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Your site will be available at: `https://softwireindia-coming-soon.onrender.com`

### Step 3: Configure Custom Domain with BigRock

1. **Get Your Render Site URL**
   - From Render dashboard, copy your site URL
   - It will be something like: `softwireindia-coming-soon.onrender.com`

2. **Login to BigRock**
   - Go to [BigRock.com](https://bigrock.com)
   - Login to your account
   - Navigate to "Domain Management" or "DNS Management"

3. **Configure DNS Records**
   
   **For Root Domain (softwireindia.com):**
   ```
   Type: A
   Name: @
   Value: 216.24.57.1
   TTL: 3600
   ```
   
   **For WWW Subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: softwireindia-coming-soon.onrender.com
   TTL: 3600
   ```

4. **Add Custom Domain in Render**
   - Go to your Render dashboard
   - Select your deployed site
   - Go to "Settings" → "Custom Domains"
   - Add domain: `softwireindia.com`
   - Add domain: `www.softwireindia.com`

5. **SSL Certificate**
   - Render automatically provides SSL certificates
   - Wait 24-48 hours for DNS propagation
   - Your site will be available at: `https://softwireindia.com`

### Step 4: Verify Deployment

1. **Check Site Loading**
   - Visit `https://softwireindia.com`
   - Verify all animations work
   - Test responsive design on mobile

2. **Test Email Form**
   - Submit test email
   - Check console for errors
   - Verify form validation

3. **Performance Check**
   - Use Google PageSpeed Insights
   - Test loading speed
   - Check mobile performance

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

### Common Issues

1. **DNS Not Propagating**
   - Wait 24-48 hours
   - Clear DNS cache: `ipconfig /flushdns` (Windows)
   - Check propagation: use dnschecker.org

2. **Site Not Loading**
   - Check DNS records are correct
   - Verify Render deployment status
   - Check browser console for errors

3. **Animations Not Working**
   - Check JavaScript console for errors
   - Verify all script files are loading
   - Test on different browsers

4. **Mobile Issues**
   - Test on actual devices
   - Check responsive breakpoints
   - Verify touch interactions

### Performance Issues

1. **Slow Loading**
   - Optimize images
   - Minimize JavaScript
   - Reduce particle count on mobile

2. **High CPU Usage**
   - Check particle system performance
   - Reduce animation complexity
   - Implement performance monitoring

## 📊 Monitoring & Maintenance

### Regular Checks

1. **Weekly**
   - Check site uptime
   - Monitor form submissions
   - Review analytics data

2. **Monthly**
   - Update countdown date if needed
   - Check for broken links
   - Review performance metrics

3. **Quarterly**
   - Update dependencies
   - Review and optimize code
   - Check for accessibility issues

### Updates

1. **Content Updates**
   - Edit HTML directly
   - Commit and push changes
   - Auto-deploy will update site

2. **Design Changes**
   - Update CSS files
   - Test thoroughly
   - Deploy updates

## 🔐 Security Considerations

1. **HTTPS Only**
   - Render provides SSL automatically
   - Redirect HTTP to HTTPS

2. **Content Security Policy**
   - Review CSP headers
   - Restrict resource loading

3. **Regular Updates**
   - Keep dependencies updated
   - Monitor security advisories

## 📞 Support

If you encounter issues:

1. **Check Render Status**
   - Visit Render status page
   - Check for platform issues

2. **Review Logs**
   - Check deployment logs in Render
   - Review browser console

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
