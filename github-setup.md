# GitHub Setup Commands

## After installing Git, run these commands:

### 1. Initialize Git and Add Files
```bash
cd "c:\Users\Wilad\CascadeProjects\windsurf-project\data-collection-app"
git init
git add .
git commit -m "Initial commit - Wippic PWA with authentication and data collection"
```

### 2. Add Remote Repository
```bash
git remote add origin https://github.com/YOUR_USERNAME/wippic.git
git branch -M main
```

### 3. Push to GitHub
```bash
git push -u origin main
```

## Replace YOUR_USERNAME with your actual GitHub username

## After pushing:
1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Source: "Deploy from a branch"
4. Branch: "main" and "/ (root)"
5. Click "Save"
6. Your site will be live at: https://YOUR_USERNAME.github.io/wippic/
