# Deployment Guide: Document AI Learning Lab

This guide covers deploying the Document AI Learning Lab to Vercel for production use.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- [Vercel CLI](https://vercel.com/download) installed (`npm i -g vercel`)
- A [Vercel account](https://vercel.com/signup)
- A [GitHub account](https://github.com/signup) (recommended for automatic deployments)

## Option 1: Deploy via Vercel CLI (Quickest)

### Step 1: Prepare Your Project

```bash
# Navigate to project directory
cd document-ai-poc

# Install dependencies
npm install

# Test the build locally
npm run build
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

The CLI will prompt you for:
- **Project name**: Choose a name (e.g., `document-ai-lab`)
- **Framework**: Next.js (auto-detected)
- **Build settings**: Use defaults

Your site will be live at: `https://your-project-name.vercel.app`

---

## Option 2: Deploy via GitHub Integration (Recommended)

This method enables automatic deployments on every push to your repository.

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Document AI Learning Lab"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/document-ai-poc.git
git branch -M main
git push -u origin main
```

### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
5. Click **"Deploy"**

### Step 3: Configure Environment Variables (Optional)

If you need custom environment variables:

1. Go to **Project Settings** → **Environment Variables**
2. Add:
   ```
   NEXT_PUBLIC_APP_NAME=Document AI Lab
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

---

## Option 3: Deploy via Vercel Dashboard (Manual Upload)

### Step 1: Build Locally

```bash
npm run build
```

### Step 2: Upload to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import from Git"** or drag-and-drop your project folder
4. Configure and deploy

---

## Post-Deployment Configuration

### Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Click **"Add"**
3. Enter your custom domain (e.g., `docai-lab.yourdomain.com`)
4. Follow DNS configuration instructions
5. Vercel automatically provisions SSL certificates

### Analytics

Enable Vercel Analytics:

1. Go to **Project Settings** → **Analytics**
2. Click **"Enable Analytics"**
3. Analytics will be available in your dashboard

### Performance Monitoring

Enable Speed Insights:

1. Install the package:
   ```bash
   npm install @vercel/speed-insights
   ```

2. Add to `src/app/layout.tsx`:
   ```tsx
   import { SpeedInsights } from '@vercel/speed-insights/next';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <SpeedInsights />
         </body>
       </html>
     );
   }
   ```

3. Redeploy: `vercel --prod`

---

## Continuous Deployment (GitHub Integration)

Once connected to GitHub, deployments are automatic:

- **Push to `main` branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Automatic preview URLs in PR comments

### Branch Deployment URLs

- Production: `https://your-project.vercel.app`
- Preview: `https://your-project-git-branch-name-username.vercel.app`

---

## Rollback to Previous Version

If you need to rollback:

1. Go to **Deployments** tab in Vercel Dashboard
2. Find the previous working deployment
3. Click **"Promote to Production"**

---

## Environment-Specific Configuration

### Production Environment Variables

Set in Vercel Dashboard → **Project Settings** → **Environment Variables**:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=Document AI Lab
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Optional: Analytics
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
```

### Development vs Production

Next.js automatically handles environment differences. The app will:

- Use production optimizations in Vercel
- Enable developer features in `npm run dev`

---

## Troubleshooting

### Build Fails

**Error**: `Module not found` or `Cannot find module`

**Solution**:
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### 404 on Pages

**Error**: Pages show 404 after deployment

**Solution**: Ensure your `vercel.json` has proper rewrites:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

### API Routes Not Working

**Error**: API endpoints return 404 or 500

**Solution**:
1. Check that API routes are in `src/app/api/` directory
2. Verify Next.js API route syntax
3. Check Vercel function logs in Dashboard → **Functions** tab

### Build Timeout

**Error**: Build exceeds time limit

**Solution**:
1. Optimize images and assets
2. Remove unused dependencies
3. Consider upgrading to Vercel Pro plan for longer build times

---

## Performance Optimization

### Image Optimization

Use Next.js `<Image>` component:

```tsx
import Image from 'next/image';

<Image
  src="/samples/medico-invoice.png"
  alt="Invoice"
  width={800}
  height={600}
  priority
/>
```

### Bundle Analysis

Analyze your build:

```bash
npm install @next/bundle-analyzer

# In next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your config
});

# Run analysis
ANALYZE=true npm run build
```

### Caching

Vercel automatically caches:
- Static assets (CSS, JS, images)
- Serverless function responses (via headers)
- Edge network caching

---

## Security Best Practices

### CORS Configuration

Already configured in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

### Environment Secrets

**Never commit**:
- API keys
- OAuth secrets
- Database credentials

**Use Vercel Environment Variables instead.**

### Content Security Policy

Add CSP headers in `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ];
  }
};
```

---

## Monitoring & Logs

### View Deployment Logs

1. Go to **Deployments** tab
2. Click on a deployment
3. View **Build Logs** and **Function Logs**

### Real-time Function Logs

```bash
vercel logs [deployment-url] --follow
```

### Error Tracking

Integrate Sentry (optional):

```bash
npm install @sentry/nextjs

# Follow Sentry Next.js setup guide
npx @sentry/wizard@latest -i nextjs
```

---

## Cost Estimation

### Vercel Free Tier

Includes:
- Unlimited deployments
- 100 GB bandwidth/month
- 100 build hours/month
- 1,000 serverless function invocations/day

### Vercel Pro ($20/month)

Includes:
- Everything in Free
- Unlimited bandwidth
- Unlimited build hours
- Password protection
- Advanced analytics

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Discord**: https://vercel.com/discord
- **GitHub Issues**: https://github.com/vercel/next.js/issues

---

## Quick Reference Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Remove deployment
vercel remove [deployment-url]

# Link to existing project
vercel link

# List deployments
vercel ls

# Get deployment URL
vercel inspect [deployment-url]
```

---

## Next Steps

After deployment:

1. ✅ Test all pages and API routes
2. ✅ Set up custom domain (if desired)
3. ✅ Enable analytics
4. ✅ Share with your team or community
5. ✅ Monitor performance and errors

**Your Document AI Learning Lab is now live!** 🎉

Share the URL with developers who want to learn Salesforce Document AI.
