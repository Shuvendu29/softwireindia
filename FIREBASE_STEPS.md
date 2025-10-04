# 🔥 FIREBASE AUTHENTICATION SETUP STEPS

## Based on your Firebase Console Screenshot

### STEP 1: Enable Authentication
1. In your Firebase project sidebar, click **"Authentication"**
2. Click **"Get started"** 
3. Go to **"Sign-in method"** tab
4. Click **"Email/Password"**
5. **Enable** the first toggle (Email/Password)
6. **Optional:** Enable "Email link (passwordless sign-in)"
7. Click **"Save"**

### STEP 2: Configure Authorized Domains
1. Still in Authentication, go to **"Settings"** tab
2. Scroll to **"Authorized domains"**
3. Add these domains:
   - `localhost` (for development)
   - `your-domain.com` (your production domain)
   - Any other domains you'll use

### STEP 3: Enable Firestore Database
1. In sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. **Start in test mode** (we'll secure it later)
4. **Choose location:** Select closest to your users (e.g., asia-south1 for India)
5. Click **"Done"**

### STEP 4: Set Up Database Security Rules
1. In Firestore Database, go to **"Rules"** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow public read access to company info (optional)
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

## STEP 5: Get Your Web App Configuration
After adding the web app, you'll get a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", 
  authDomain: "softwireindia.firebaseapp.com",
  projectId: "softwireindia",
  storageBucket: "softwireindia.appspot.com", 
  messagingSenderId: "...",
  appId: "1:...:web:..."
};
```

Copy this exact configuration!