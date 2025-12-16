# 🔐 Authentication Setup Guide

## Step 1: Install Firebase
```bash
npm install firebase
```

## Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `recipe-finder`
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 3: Enable Authentication

1. In Firebase Console, click "Authentication"
2. Click "Get started"
3. Click "Email/Password" under Sign-in method
4. Enable "Email/Password"
5. Click "Save"

## Step 4: Enable Firestore Database

1. Click "Firestore Database" in sidebar
2. Click "Create database"
3. Select "Start in test mode"
4. Choose location closest to you
5. Click "Enable"

## Step 5: Get Firebase Config

1. Click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app name: `recipe-finder-web`
5. Copy the `firebaseConfig` values

## Step 6: Update .env File

Open `.env` in the root folder and replace with your values:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=recipe-finder-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=recipe-finder-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=recipe-finder-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
```

## Step 7: Run the App

```bash
npm run dev
```

## 🎯 Features Added

✅ **User Registration** - Email/password signup with role selection
✅ **User Login** - Secure authentication
✅ **Role-Based Access** - User or Admin roles
✅ **Protected Routes** - Must login to access app
✅ **User Profile** - Display email and role in header
✅ **Logout** - Sign out functionality

## 👥 User Roles

- **User**: Can search recipes and save favorites
- **Admin**: Same as user (extend with admin features later)

## 🔒 Security Rules (Optional)

Update Firestore rules for better security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## 🚀 Next Steps

- Add admin dashboard
- Add user management for admins
- Add recipe submission feature
- Sync favorites to Firestore
- Add password reset
- Add social login (Google, Facebook)
