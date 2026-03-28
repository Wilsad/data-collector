# GitHub Pages Fix Instructions

## The Problem
Your GitHub Pages is trying to load `/src/main.jsx` which doesn't exist on the server. This means it's serving an old version or wrong configuration.

## Solution: Update GitHub Pages Settings

### Step 1: Go to GitHub Pages Settings
1. Go to your repository: https://github.com/Wilsad/data-collector
2. Click "Settings" tab
3. Click "Pages" in the left menu

### Step 2: Change Source
1. **Source**: Change from "Deploy from a branch" to **"GitHub Actions"**
2. This will use the workflow we just created
3. Click "Save"

### Step 3: Wait for Deployment
1. Go to "Actions" tab
2. Wait for the "Deploy to GitHub Pages" workflow to complete
3. This should take 2-3 minutes

### Step 4: Test the Site
URL: https://wilsad.github.io/data-collector/

## Why This Works
- GitHub Actions builds the app properly
- Uses the correct `/data-collector/` base path
- Serves the built files, not source files
- Automatic deployment on every push

## If Still Issues
1. Clear browser cache (Ctrl+F5)
2. Open Developer Tools (F12) and check Console tab
3. Check Network tab for any 404 errors

## Test Credentials
- Admin: FLC-A3B
- User: FLC-K2M
