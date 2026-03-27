# Firestore Security Rules for Wippic

## Current Status: Test Mode (Insecure)
Your current rules likely allow anyone to read/write data, which is fine for testing but unsafe for production.

## Production Security Rules

### Option 1: Basic Security (Recommended for Launch)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access data
    match /entries/{entryId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Option 2: User-Based Access (More Secure)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own entries
    match /entries/{entryId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Option 3: Admin/User Role-Based Access (Most Secure)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admins can access all entries
    match /entries/{entryId} {
      allow read, write: if request.auth != null && (
        request.auth.token.role == 'admin' ||
        resource.data.userId == request.auth.uid
      );
    }
  }
}
```

## How to Update Rules

### Method 1: Firebase Console
1. Go to https://console.firebase.google.com
2. Select your project: `data-collection-app-fa95a`
3. Click "Firestore Database" in left menu
4. Click "Rules" tab
5. Replace rules with your choice above
6. Click "Publish"

### Method 2: Firebase CLI
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize in your project
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## Important Notes

⚠️ **Before Production:**
- Test rules thoroughly
- Ensure authentication is working
- Backup your data
- Consider data validation rules

🔒 **Security Best Practices:**
- Start with Option 1 for launch
- Upgrade to Option 2/3 as needed
- Monitor Firebase usage
- Set up alerts for unusual activity

## Current App Data Structure
Your app stores entries with these fields:
- firstName, lastName, phone, location
- invitedBy, invitedPhone (optional)
- timeCreated, EntryBy
- synced (boolean)

Make sure rules match your data structure!
