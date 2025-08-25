# 🔥 Firebase Setup Guide for Earthquake Database

## 📋 **Prerequisites**
- Google account
- Node.js and npm installed
- Firebase CLI (optional but recommended)

## 🚀 **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `eq-forecaster-db` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click **"Create project"**

## 🔑 **Step 2: Get Firebase Configuration**

1. In your Firebase project, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click **"Add app"** and select **"Web"** (</>)
5. Register app with nickname: `eq-forecaster-web`
6. Copy the **firebaseConfig** object

## ⚙️ **Step 3: Update Configuration File**

Replace the placeholder values in `src/Frontend/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## 🗄️ **Step 4: Enable Firestore Database**

1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location close to your users (e.g., `asia-southeast1`)
5. Click **"Done"**

## 🔒 **Step 5: Set Firestore Security Rules**

In Firestore Database → Rules, update to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /earthquakes/{document} {
      allow read, write: if true;  // For development - change later
    }
  }
}
```

## 🧪 **Step 6: Test the Integration**

1. Start your React app: `npm run dev`
2. Go to Admin Dashboard
3. Try adding an earthquake entry
4. Check Firebase Console → Firestore Database to see the data

## 📱 **Features You Now Have:**

✅ **Real-time Database**: Data syncs instantly across all users  
✅ **Persistent Storage**: Data survives app restarts  
✅ **CRUD Operations**: Create, Read, Update, Delete earthquakes  
✅ **Auto-generated IDs**: Firebase handles unique identifiers  
✅ **Timestamp Tracking**: Automatic creation/update timestamps  
✅ **Error Handling**: User-friendly error messages  
✅ **Loading States**: Visual feedback during operations  

## 🚨 **Important Security Notes:**

- **Test mode** allows anyone to read/write (OK for development)
- **Production**: Update security rules to restrict access
- **Authentication**: Consider adding user login for production

## 🔧 **Troubleshooting:**

**"Firebase: Error (auth/unauthorized-domain)"**
- Add your domain to Firebase Console → Authentication → Settings → Authorized domains

**"Firebase: Error (firestore/permission-denied)"**
- Check Firestore security rules
- Ensure you're in test mode for development

**"Firebase: Error (app/no-app)"**
- Check your firebase.js configuration
- Ensure Firebase is properly initialized

## 📚 **Next Steps:**

1. **Add Authentication**: User login/logout
2. **Data Validation**: Input sanitization and validation
3. **Export Features**: Download data as CSV/JSON
4. **Real-time Updates**: Live earthquake notifications
5. **Analytics**: Track usage and performance

## 🆘 **Need Help?**

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Quickstart](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Console](https://console.firebase.google.com/)

---

**🎉 Congratulations! Your earthquake database is now powered by Firebase!**
