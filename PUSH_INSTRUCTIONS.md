# Instructions to Push to GitHub

## Step 1: Create a GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., "goldmine-pro")
3. Copy the repository URL

## Step 2: Update the Remote URL
Replace the placeholder URL with your actual GitHub repository URL:

```bash
cd /data/data/com.termux/files/home/goldmine-pro
git remote set-url origin YOUR_ACTUAL_REPOSITORY_URL_HERE
```

For example:
```bash
git remote set-url origin https://github.com/your-username/goldmine-pro.git
```

## Step 3: Push the Code
```bash
git branch -M main
git push -u origin main
```

## Alternative: Using GitHub Token (if needed)
If you encounter authentication issues, you can use a personal access token:

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

Your GitHub personal access token can be created at: https://github.com/settings/tokens