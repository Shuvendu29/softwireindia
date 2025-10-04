# 🌐 Custom Domain Setup for www.softwire.com

## Prerequisites
You need to complete these steps before setting up the custom domain:

### 1. 🏷️ Domain Registration
- Register the domain `softwire.com` through a domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
- Make sure you have administrative access to the domain's DNS settings

### 2. 🔍 Domain Verification with Google
**IMPORTANT**: You must verify domain ownership before mapping it to App Engine.

#### Step 2.1: Go to Google Search Console
1. Visit: https://search.google.com/search-console
2. Sign in with your Google account (`shuvendu.29@gmail.com`)

#### Step 2.2: Add Property
1. Click "Add Property"
2. Choose "Domain" (not URL prefix)
3. Enter: `softwire.com` (the root domain)

#### Step 2.3: Verify Ownership
Google will provide you with a TXT record to add to your domain's DNS:
- **Record Type**: TXT
- **Host/Name**: @ (or leave blank)
- **Value**: Something like `google-site-verification=abc123...`

Add this TXT record to your domain's DNS settings and wait for verification.

## 3. 🚀 Map Domain to App Engine

Once domain verification is complete, run these commands:

```bash
# Add domain mapping for root domain
gcloud app domain-mappings create softwire.com

# Add domain mapping for www subdomain
gcloud app domain-mappings create www.softwire.com
```

## 4. 📡 DNS Configuration

After domain mapping is created, you'll get DNS records to configure:

### For Root Domain (softwire.com):
```
Type: A
Name: @
Value: 216.239.32.21
Value: 216.239.34.21  
Value: 216.239.36.21
Value: 216.239.38.21
```

### For WWW Subdomain (www.softwire.com):
```
Type: CNAME
Name: www
Value: ghs.googlehosted.com
```

## 5. ✅ Verification Commands

After DNS setup, verify with:

```bash
# Check domain mappings
gcloud app domain-mappings list

# Check SSL certificates (may take 15-60 minutes)
gcloud app ssl-certificates list

# Test the domain
curl -I https://www.softwire.com
curl -I https://softwire.com
```

## 6. 🔒 SSL Certificate

Google automatically provisions SSL certificates for custom domains. This may take:
- **15-60 minutes** for the certificate to be issued
- DNS changes may take **24-48 hours** to propagate globally

## 7. 🌍 Final Testing

Once everything is set up:
1. Visit https://www.softwire.com
2. Verify SSL certificate (green lock icon)
3. Check that it redirects properly
4. Test on mobile devices

## ⚠️ Important Notes

1. **Domain Registration**: You must own `softwire.com` domain first
2. **DNS Propagation**: Changes can take 24-48 hours to propagate globally
3. **SSL Certificate**: Google automatically handles SSL, but it takes time
4. **Verification**: Domain verification in Google Search Console is mandatory

## 🔧 Troubleshooting

If you encounter issues:

```bash
# Check current project
gcloud config get-value project

# Check domain verification status
gcloud app domain-mappings describe www.softwire.com

# Check SSL certificate status
gcloud app ssl-certificates list
```

## 📞 Next Steps

1. **Register** `softwire.com` domain if not already done
2. **Verify** domain ownership in Google Search Console
3. **Run** the domain mapping commands above
4. **Configure** DNS records as provided
5. **Wait** for SSL certificate provisioning
6. **Test** the live website

---

**Current Status**: Domain mapping attempted but requires domain verification first.
**Action Required**: Complete domain registration and Google Search Console verification.