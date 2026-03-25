# GitHub Setup & Upload Instructions

This guide will help you push your Document AI Learning Lab to GitHub.

## Prerequisites

- [Git installed](https://git-scm.com/downloads) on your machine
- A [GitHub account](https://github.com/signup)
- GitHub CLI (optional, but recommended): `brew install gh` or download from [cli.github.com](https://cli.github.com)

---

## Option 1: Using GitHub CLI (Recommended)

### Step 1: Install GitHub CLI

```bash
# macOS
brew install gh

# Windows
winget install --id GitHub.cli

# Linux
# See: https://github.com/cli/cli/blob/trunk/docs/install_linux.md
```

### Step 2: Authenticate

```bash
gh auth login
```

Follow the prompts to authenticate with your GitHub account.

### Step 3: Create Repository and Push

```bash
# Navigate to your project
cd /Users/akshata.sawant/document-ai-poc

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Document AI Learning Lab

- Complete Next.js portal with 3 recipes
- Interactive Try It section with OAuth 2.0
- Python code reference and examples
- Sample pharmaceutical documents
- Comprehensive resources and chatbot
- Vercel deployment ready"

# Create GitHub repo and push (all in one command!)
gh repo create document-ai-poc --public --source=. --push

# Or for private repository
gh repo create document-ai-poc --private --source=. --push
```

**Done!** Your repository is now at: `https://github.com/YOUR_USERNAME/document-ai-poc`

---

## Option 2: Manual GitHub Setup

### Step 1: Initialize Git Repository

```bash
# Navigate to your project
cd /Users/akshata.sawant/document-ai-poc

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Document AI Learning Lab"
```

### Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `document-ai-poc`
3. Description: `A comprehensive learning portal for Salesforce Data Cloud Document AI`
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README (we already have one)
6. Click **"Create repository"**

### Step 3: Push to GitHub

GitHub will show you commands. Run them:

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/document-ai-poc.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Option 3: Using GitHub Desktop

### Step 1: Download GitHub Desktop

Download from [desktop.github.com](https://desktop.github.com)

### Step 2: Add Repository

1. Open GitHub Desktop
2. File → Add Local Repository
3. Choose `/Users/akshata.sawant/document-ai-poc`
4. Click **"Add Repository"**

### Step 3: Publish to GitHub

1. Click **"Publish repository"** button
2. Name: `document-ai-poc`
3. Description: `A comprehensive learning portal for Salesforce Data Cloud Document AI`
4. Choose Public or Private
5. Click **"Publish Repository"**

---

## Verify Upload

After pushing, verify your repository:

```bash
# View in browser
gh repo view --web

# Or manually visit:
# https://github.com/YOUR_USERNAME/document-ai-poc
```

### Expected Files

Your repository should contain:

```
✅ src/ (all app files)
✅ public/ (sample documents)
✅ package.json
✅ README.md
✅ DEPLOYMENT.md
✅ GITHUB_SETUP.md
✅ vercel.json
✅ next.config.ts
✅ tailwind.config.ts
✅ tsconfig.json
✅ .gitignore
```

### Files NOT in Repository (gitignored)

```
❌ node_modules/
❌ .next/
❌ .env*
❌ .DS_Store
❌ .sfdx/
```

---

## Set Up Repository Settings

### 1. Add Description and Topics

```bash
# Using GitHub CLI
gh repo edit --description "A comprehensive learning portal for Salesforce Data Cloud Document AI with step-by-step recipes, sample documents, and code examples"

gh repo edit --add-topic "salesforce"
gh repo edit --add-topic "document-ai"
gh repo edit --add-topic "data-cloud"
gh repo edit --add-topic "nextjs"
gh repo edit --add-topic "learning"
gh repo edit --add-topic "tutorial"
```

Or manually on GitHub:
1. Go to your repository
2. Click ⚙️ Settings
3. Add description and topics

### 2. Enable Issues and Discussions

In Repository Settings:
- ✅ Issues (for bug reports)
- ✅ Discussions (for community Q&A)

### 3. Add Repository Badges

Add to README.md:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/document-ai-poc)
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/document-ai-poc?style=social)](https://github.com/YOUR_USERNAME/document-ai-poc)
[![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/document-ai-poc?style=social)](https://github.com/YOUR_USERNAME/document-ai-poc)
```

---

## Connect to Vercel

After pushing to GitHub, connect to Vercel:

### Option A: Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure and deploy

### Option B: Vercel CLI

```bash
# Link to Git repository
vercel link

# Deploy
vercel --prod
```

Vercel will automatically deploy on every push to main branch!

---

## Future Updates

After initial setup, update your repository:

```bash
# Make changes to files

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add: New feature description"

# Push to GitHub
git push

# Vercel will automatically deploy the update!
```

### Commit Message Convention

Use clear, descriptive commit messages:

```
✨ Add: New sample documents for insurance industry
🐛 Fix: OAuth callback error handling
📝 Docs: Update API documentation
🎨 Style: Improve mobile responsiveness
♻️  Refactor: Simplify schema generation logic
🚀 Deploy: Update Vercel configuration
```

---

## Collaboration

### Invite Collaborators

```bash
# Using GitHub CLI
gh repo collaborator add USERNAME

# Or on GitHub:
# Settings → Collaborators → Add people
```

### Branch Protection

Protect your main branch:

1. Settings → Branches
2. Add rule for `main`
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass

---

## Troubleshooting

### Authentication Issues

```bash
# Re-authenticate GitHub CLI
gh auth login

# Configure git credentials
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### Large Files

If you get "file too large" errors:

```bash
# Check file sizes
du -sh node_modules .next

# Ensure .gitignore is properly set
cat .gitignore

# Remove files from staging
git rm --cached -r node_modules
git rm --cached -r .next
```

### Force Push (Use with Caution)

```bash
# Only if you need to overwrite remote
git push --force-with-lease
```

---

## Next Steps

After pushing to GitHub:

1. ✅ Verify all files are uploaded
2. ✅ Update README with your GitHub username
3. ✅ Deploy to Vercel
4. ✅ Add repository description and topics
5. ✅ Share with the community!

**Your Document AI Learning Lab is now open source!** 🎉

Share your repository:
- Twitter/X with #SalesforceDocumentAI #DataCloud
- LinkedIn with a post about what you built
- Salesforce Developer Community
- #dc-document-ai-support Slack channel

---

## Quick Reference Commands

```bash
# Check status
git status

# View remote URL
git remote -v

# View commit history
git log --oneline

# Create new branch
git checkout -b feature/new-feature

# Push new branch
git push -u origin feature/new-feature

# View repository in browser
gh repo view --web

# View latest releases
gh release list

# View issues
gh issue list
```

---

## Support

Need help?
- GitHub Docs: https://docs.github.com
- GitHub CLI Docs: https://cli.github.com/manual
- Git Documentation: https://git-scm.com/doc
