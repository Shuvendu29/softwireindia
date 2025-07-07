# Google OAuth Setup Guide for SoftWire India

## 🚀 Complete Google OAuth Integration Setup

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Select a project" → "New Project"
   - Project name: `SoftWire India Auth`
   - Organization: (Leave as default)
   - Location: (Leave as default)
   - Click "Create"

3. **Wait for Project Creation**
   - It may take a few minutes
   - You'll see a notification when complete

### Step 2: Enable Google+ API

1. **Navigate to APIs & Services**
   - In the left sidebar, click "APIs & Services" → "Library"

2. **Search for Google+ API**
   - In the search box, type "Google+ API"
   - Click on "Google+ API" from results

3. **Enable the API**
   - Click "Enable" button
   - Wait for activation (few seconds)

### Step 3: Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - Click "APIs & Services" → "Credentials"

2. **Create Credentials**
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"

3. **Configure OAuth Consent Screen** (if first time)
   - Click "Configure Consent Screen"
   - Choose "External" user type
   - Click "Create"

4. **Fill OAuth Consent Screen**
   ```
   App name: SoftWire India
   User support email: your-email@gmail.com
   App domain: softwireindia.com
   Authorized domains: softwireindia.com
   Developer contact: your-email@gmail.com
   ```
   - Click "Save and Continue"
   - Skip "Scopes" → "Save and Continue"
   - Skip "Test Users" → "Save and Continue"
   - Review and click "Back to Dashboard"

5. **Create OAuth 2.0 Client ID**
   - Go back to "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: `SoftWire India Web Client`

6. **Add Authorized Domains**
   ```
   Authorized JavaScript origins:
   - https://softwireindia.com
   - https://www.softwireindia.com
   - http://localhost:8000 (for testing)
   
   Authorized redirect URIs:
   - https://softwireindia.com/auth.html
   - https://www.softwireindia.com/auth.html
   - http://localhost:8000/auth.html (for testing)
   ```

7. **Create and Save**
   - Click "Create"
   - **IMPORTANT**: Copy the Client ID (starts with something like: `123456789-abcdef.apps.googleusercontent.com`)

### Step 4: Update Your Code

1. **Replace Client ID in auth.html**
   - Find line with `YOUR_GOOGLE_CLIENT_ID`
   - Replace with your actual Client ID

2. **Update Meta Tag**
   ```html
   <meta name="google-signin-client_id" content="YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com">
   ```

### Step 5: Test the Integration

1. **Test Locally**
   - Open: http://localhost:8000/auth.html
   - Click "Continue with Google"
   - Should open Google sign-in popup

2. **Test on Live Site**
   - Visit: https://www.softwireindia.com/auth.html
   - Test Google OAuth flow

### Step 6: Security Configuration

1. **Restrict API Key** (Optional but recommended)
   - Go to "APIs & Services" → "Credentials"
   - Click on your OAuth 2.0 Client ID
   - Add domain restrictions

2. **Set up Production Settings**
   - In OAuth consent screen, change to "Internal" if for organization only
   - Or keep "External" and submit for verification for public use

### 🔐 Security Best Practices

1. **Never expose Client Secret** (we're using client-side OAuth)
2. **Use HTTPS only** in production
3. **Validate tokens** on your backend
4. **Set proper CORS policies**
5. **Monitor usage** in Google Cloud Console

### 🛠️ Troubleshooting

**Common Issues:**

1. **"Error: redirect_uri_mismatch"**
   - Check authorized redirect URIs match exactly
   - Include both www and non-www versions

2. **"Error: origin_mismatch"**
   - Check authorized JavaScript origins
   - Ensure protocol (https/http) matches

3. **"Error: access_denied"**
   - User cancelled sign-in
   - Handle gracefully in your code

4. **"Error: popup_closed_by_user"**
   - User closed popup
   - Provide retry option

### 📊 Usage Limits

- **Free Tier**: 100 requests/day
- **Paid Tier**: Contact Google for higher limits
- **Monitor usage** in Google Cloud Console

### 🔄 Testing Checklist

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Client ID updated in code
- [ ] Authorized domains added
- [ ] Local testing works
- [ ] Production testing works
- [ ] Error handling implemented

### 📞 Support

If you encounter issues:
- Check Google Cloud Console error logs
- Verify domain ownership
- Ensure APIs are enabled
- Check billing account (if applicable)

---

## 🎉 Success!

Once configured, users can:
- ✅ Sign in with Google account
- ✅ Register using Google profile
- ✅ Auto-populate user information
- ✅ Skip manual email verification
- ✅ Enjoy seamless authentication

Your SoftWire India authentication system will be fully functional with Google OAuth integration!
