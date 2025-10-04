// 🔥 FIREBASE CONFIGURATION FOR SOFTWIRE INDIA
// ✅ PRODUCTION READY CONFIGURATION

const firebaseConfig = {
    apiKey: "AIzaSyDc1-VMmhP1QKkqReETVd5qLKTwv1VtNk",
    authDomain: "softwireindia.firebaseapp.com",
    projectId: "softwireindia",
    storageBucket: "softwireindia.appspot.com",
    messagingSenderId: "136752849825",
    appId: "1:136752849825:web:9f47bc8d1d40ced3d301c0"
};

// Initialize Firebase
let auth, db, analytics;

if (typeof firebase !== 'undefined') {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Initialize services
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Optional: Enable Firebase Analytics
    if (firebase.analytics) {
        analytics = firebase.analytics();
    }
    
    // Configure Firestore settings for better performance
    db.enablePersistence().catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
            console.warn('The current browser does not support all features required for persistence.');
        }
    });
    
    console.log('🔥 Firebase initialized successfully with Auth and Firestore');
    
    // Export globally for use in other scripts
    window.firebaseAuth = auth;
    window.firebaseDB = db;
    window.firebaseAnalytics = analytics;
    
} else {
    console.error('❌ Firebase SDK not loaded. Please include Firebase scripts in your HTML.');
}

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}