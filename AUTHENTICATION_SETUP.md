# 🚀 SoftWire India Authentication Setup Guide

This guide will help you activate the registration and authentication system for your SoftWire India website.

## 🎯 **QUICK START OPTIONS**

You have **3 backend integration options**:

### **Option 1: Firebase Authentication (Recommended for beginners)**
### **Option 2: Custom Node.js API (Full control)**
### **Option 3: Third-party Service (Supabase, Auth0, etc.)**

---

## 📋 **PREREQUISITES**

- Your current website files
- A web browser for testing
- Internet connection
- Email account for verification emails

---

## 🔥 **OPTION 1: Firebase Authentication Setup**

### **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and name it "softwire-india"
3. Enable Google Analytics (optional)
4. Wait for project creation

### **Step 2: Enable Authentication**

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Configure authorized domains (add your domain)

### **Step 3: Get Firebase Configuration**

1. Go to **Project Settings** → **General** → **Your apps**
2. Click "Add app" → Web app icon
3. Register your app as "SoftWire India"
4. Copy the configuration object

### **Step 4: Update Firebase Config File**

1. Open `js/firebase-config.js` in your project
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "softwire-india.firebaseapp.com",
    projectId: "softwire-india",
    storageBucket: "softwire-india.appspot.com",
    messagingSenderId: "123456789012",
    appId: "your-actual-app-id"
};
```

### **Step 5: Include Firebase SDK**

Add these lines to your `auth-simple.html` **before** the `</head>` tag:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js"></script>
<script src="js/firebase-config.js"></script>
```

### **Step 6: Test Your Setup**

1. Start your development server:
   ```bash
   npx http-server -p 8000 -o
   ```

2. Navigate to `http://localhost:8000/auth-simple.html`
3. Try registering a new account
4. Check your email for verification
5. Try logging in with verified account

---

## 🖥️ **OPTION 2: Custom Node.js API Setup**

### **Step 1: Install Node.js Backend Dependencies**

```bash
# Install backend dependencies
npm install express bcryptjs jsonwebtoken nodemailer sqlite3 cors express-rate-limit nodemon
```

### **Step 2: Configure Environment Variables**

Create a `.env` file in your project root:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
FRONTEND_URL=http://localhost:8000
```

### **Step 3: Start the API Server**

```bash
# Start the backend server
node backend-api.js

# Or for development with auto-restart
npx nodemon backend-api.js
```

### **Step 4: Update Frontend API Endpoint**

In `js/auth-manager.js`, update the API endpoint:

```javascript
constructor() {
    this.apiEndpoint = 'http://localhost:3000/api'; // Your backend URL
    this.init();
}
```

### **Step 5: Test Your Setup**

1. Start both servers:
   - Backend: `node backend-api.js` (port 3000)
   - Frontend: `npx http-server -p 8000 -o` (port 8000)

2. Test registration and login functionality
3. Check that emails are being sent (configure your email provider)

---

## 🌐 **OPTION 3: Third-Party Services**

### **Supabase Setup (Alternative to Firebase)**

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Authentication → Settings
4. Enable email authentication
5. Get your project URL and anon key
6. Update the auth-manager.js to use Supabase client

### **Auth0 Setup (Enterprise solution)**

1. Go to [Auth0](https://auth0.com/)
2. Create a new application
3. Configure allowed URLs
4. Integrate Auth0 SDK into your frontend

---

## 🔧 **CONFIGURATION OPTIONS**

### **Email Verification Settings**

In your chosen backend, you can configure:

- **Email Templates**: Customize the verification email design
- **Token Expiry**: Set how long verification links are valid
- **Redirect URLs**: Where users go after verification
- **Rate Limiting**: Prevent spam registrations

### **Security Features**

Your authentication system includes:

- **Password Hashing**: Using bcrypt for secure password storage
- **JWT Tokens**: Secure session management
- **Rate Limiting**: Prevent brute force attacks
- **Email Verification**: Ensure valid email addresses
- **Input Validation**: Client and server-side validation

### **Customization Options**

You can customize:

- **Form Styling**: Update CSS in `auth-simple.html`
- **Validation Rules**: Modify password requirements
- **Email Templates**: Custom verification emails
- **Redirect Flows**: Where users go after login/registration

---

## 🧪 **TESTING YOUR SETUP**

### **Test Registration Flow**

1. Fill out the registration form with valid data
2. Check for validation messages
3. Verify email is sent (check spam folder)
4. Click verification link
5. Try logging in with verified account

### **Test Login Flow**

1. Use verified credentials to log in
2. Check for loading states and feedback
3. Verify redirect after successful login
4. Test "remember me" functionality

### **Test Error Handling**

1. Try invalid email formats
2. Use weak passwords
3. Attempt duplicate registrations
4. Test with network issues

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

1. **Firebase not loading**: Check internet connection and Firebase SDK URLs
2. **CORS errors**: Ensure your backend allows your frontend domain
3. **Email not sending**: Configure your email provider correctly
4. **Database errors**: Check file permissions for SQLite database

### **Debug Steps**

1. Open browser Developer Tools (F12)
2. Check Console for error messages
3. Verify Network requests are successful
4. Check that all required files are loaded

### **Getting Help**

- Check browser console for detailed error messages
- Verify all configuration values are correct
- Test with simple cases first
- Check network connectivity and firewall settings

---

## 🎉 **NEXT STEPS**

After your authentication is working:

1. **User Dashboard**: Create a protected dashboard page
2. **Profile Management**: Allow users to update their information
3. **Password Reset**: Implement forgot password functionality
4. **Social Login**: Add Google, Facebook, etc. login options
5. **Admin Panel**: Create user management interface

---

## 📚 **ADDITIONAL RESOURCES**

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Node.js Authentication Best Practices](https://nodejs.org/en/docs/guides/security/)
- [JWT Security Guidelines](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Email Verification Best Practices](https://postmarkapp.com/guides/email-verification)

---

## 💡 **PRO TIPS**

- **Start with Firebase** for quick setup, then consider custom backend later
- **Test thoroughly** before deploying to production
- **Use HTTPS** in production for security
- **Monitor authentication metrics** to track user engagement
- **Keep security dependencies updated**

---

**Ready to activate your authentication system? Choose your preferred option above and follow the step-by-step guide!** 🚀