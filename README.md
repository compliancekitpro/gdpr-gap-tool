# GDPR Gap Assessment Tool

Free compliance checker for the GDPR Compliance Kit.

## Deploy to Vercel (5 minutes, free)

### Option A: Deploy via GitHub (recommended)

1. Create a free account at github.com
2. Create a new repository called `gdpr-gap-tool`
3. Upload all files in this folder to the repo
4. Go to vercel.com → Sign up free with your GitHub account
5. Click "Add New Project" → Import your `gdpr-gap-tool` repo
6. Click Deploy — Vercel auto-detects Vite/React
7. Your tool is live at: `https://gdpr-gap-tool.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# From this folder
vercel

# Follow prompts — choose defaults
# Your URL will be shown at the end
```

### After Deploying

1. Copy your live URL (e.g. `https://gdpr-gap-tool.vercel.app`)
2. Open `src/App.jsx`
3. Replace `YOUR_SHOP_NAME` in both Etsy URLs with your actual shop name
4. Redeploy

### Update README in your Etsy ZIP

Replace the Gap Assessment Tool placeholder URL in your README.pdf with your live Vercel URL.

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Build for Production

```bash
npm run build
# Output in /dist folder
```
