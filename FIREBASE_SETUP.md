# Firebase Setup Guide for RipplePay

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `ripplepay-hackathon`
4. Enable Google Analytics (optional for hackathon)
5. Click "Create project"

## Step 2: Get Firebase Configuration

1. In your Firebase project dashboard, click the Web icon (`</>`) to add a web app
2. Enter app name: `RipplePay`
3. Click "Register app"
4. Copy the `firebaseConfig` object - it will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "ripplepay-hackathon.firebaseapp.com",
  projectId: "ripplepay-hackathon",
  storageBucket: "ripplepay-hackathon.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 3: Update Your App Configuration

1. Open `src/App.jsx`
2. Replace the placeholder `firebaseConfig` object with your actual config
3. Save the file

## Step 4: Enable Authentication

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Anonymous" sign-in method
3. Save settings

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for hackathon)
4. Select a location (choose closest to your users)
5. Click "Enable"

## Step 6: Set Up Security Rules

In Firestore → Rules tab, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 7: Test Your App

1. Run `npm run dev` in your terminal
2. Open your browser to the provided URL (usually `http://localhost:5173`)
3. Try adding an expense - it should save to Firebase automatically!

## Troubleshooting

### "Firebase: No Firebase App '[DEFAULT]' has been created"
- Make sure you've replaced the placeholder config with your actual Firebase config
- Check that all required fields are present in the config object

### "Permission denied" errors
- Make sure Anonymous authentication is enabled
- Verify your Firestore security rules are correctly set
- Check that you're using the correct project ID

### "Network error" 
- Check your internet connection
- Verify your Firebase project is active and not disabled
- Make sure you're using the correct project ID in your config

## Production Deployment Tips

For production deployment, you should:

1. **Change Security Rules**: Restrict access more tightly
2. **Enable Google Analytics**: For user insights
3. **Set Up Functions**: For server-side logic if needed
4. **Configure Hosting**: For easy deployment with Firebase Hosting

## Quick Test

To verify everything works:

1. Add an expense with amount ₹500
2. Check the Ripple Result page shows correct calculations
3. Go to Insights page to see your spending breakdown
4. Refresh the page - your data should persist

Your RipplePay app is now fully functional with Firebase backend! 🎉
