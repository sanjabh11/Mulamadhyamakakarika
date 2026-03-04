# Whop Deployment Guide

## Overview

This document provides step-by-step instructions for deploying the Nāgārjuna's Quantum Reflections app to the Whop marketplace.

---

## Pre-Deployment Checklist

### Environment Variables Required

```env
# Whop SDK Configuration
NEXT_PUBLIC_WHOP_APP_ID=your_app_id
WHOP_API_KEY=your_api_key
WHOP_WEBHOOK_SECRET=your_webhook_secret

# Plan IDs (from Whop Dashboard)
NEXT_PUBLIC_WHOP_PLAN_SEEKER=plan_xxxxx
NEXT_PUBLIC_WHOP_PLAN_PRACTITIONER=plan_xxxxx
NEXT_PUBLIC_WHOP_PLAN_TEACHER=plan_xxxxx

# Redis Session Store (Required for Serverless)
UPSTASH_REDIS_REST_URL=rediss://your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_token

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Step 1: Create Whop App

1. Go to [Whop Developer Dashboard](https://dash.whop.com/developer)
2. Click "Create App"
3. Fill in details:
   - **Name**: Nāgārjuna's Quantum Reflections
   - **Category**: Courses & Education (Primary)
   - **Description**: 27-Day Quantum Enlightenment Journey
4. Copy your `APP_ID` and `API_KEY`

---

## Step 2: Configure Plans/Products

Create three plans in your Whop dashboard:

### Free (Explorer) Tier
- **Price**: $0
- **Features**: Chapters 1-5, Basic quizzes
- **Plan ID**: Save as `NEXT_PUBLIC_WHOP_PLAN_FREE`

### Seeker Tier
- **Price**: $9.99/month
- **Features**: Chapters 1-18, All quizzes, PDF downloads, Certificates
- **Plan ID**: Save as `NEXT_PUBLIC_WHOP_PLAN_SEEKER`

### Enlightened Tier
- **Price**: $19.99/month
- **Features**: All 27 chapters, Live sessions, VIP Discord
- **Plan ID**: Save as `NEXT_PUBLIC_WHOP_PLAN_ENLIGHTENED`

---

## Step 3: Deploy to Hosting

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add environment variables in Vercel Dashboard → Settings → Environment Variables.

### Option B: Netlify

```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

---

## Step 4: Configure Whop Webhook

1. In Whop Dashboard → Webhooks
2. Add webhook URL: `https://your-domain.com/api/whop-webhook`
3. Select events:
   - `membership.created`
   - `membership.updated`
   - `membership.cancelled`
   - `payment.completed`
4. Copy webhook secret to `WHOP_WEBHOOK_SECRET`

---

## Step 5: Test in Whop Iframe

1. In Whop Dashboard → App Settings
2. Set "App URL" to your deployed URL
3. Enable "Iframe Mode"
4. Test with "Preview App"

### Iframe Checklist

- [ ] App loads within 3 seconds
- [ ] No CORS errors in console
- [ ] Auth flows work correctly
- [ ] Animations play smoothly
- [ ] Mobile responsive in iframe

---

## Step 6: Discord Server Setup

### Create Discord Server

1. Create server: "Quantum Sangha"
2. Create channels:
   - `#daily-verse` - Daily verse bot
   - `#announcements` - Course announcements
   - `#achievements` - User achievements
   - `#general` - Community chat
   - `#chapter-discussions` - Study discussions
   - `#meditation-circle` - (Premium only)

### Create Webhooks

1. Channel Settings → Integrations → Webhooks
2. Create webhook for each channel
3. Copy URLs to environment variables

### Bot Configuration (Optional)

For daily verse automation, set up a cron job:

```javascript
// vercel.json or similar
{
  "crons": [{
    "path": "/api/cron/daily-verse",
    "schedule": "0 8 * * *"
  }]
}
```

---

## Step 7: Animation Performance Verification

### Run Performance Audit

```bash
# Lighthouse CI
npm run lighthouse

# Or manual check
# - First animation load: < 3 seconds
# - Subsequent loads: < 500ms (cached)
# - Time to Interactive: < 5 seconds
```

### Verify Caching

1. Open DevTools → Network
2. Load a chapter
3. Reload - animations should load from cache
4. Check Service Worker is registered

---

## Step 8: Submit for Review

1. In Whop Dashboard → Submit for Review
2. Provide:
   - **Demo video**: 2-3 min walkthrough
   - **Screenshots**: Course, Quiz, Certificate
   - **Description**: Detailed feature list
   - **Support contact**: Your email

### Review Criteria

Whop reviews for:
- [ ] App loads quickly
- [ ] No external auth UI visible
- [ ] Works in iframe
- [ ] Clear value proposition
- [ ] Professional appearance

---

## Post-Launch Checklist

- [ ] Monitor error logs
- [ ] Check Whop analytics
- [ ] Respond to user feedback
- [ ] Update Discord with launch announcement
- [ ] Schedule daily verse posts

---

## Troubleshooting

### "App won't load in iframe"

Check `next.config.js`:
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'ALLOW-FROM https://whop.com/' },
        { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://whop.com https://*.whop.com;" }
      ]
    }]
  }
}
```

### "Auth not working"

Ensure Whop SDK is initialized:
```javascript
// _app.js
import { MembershipProvider } from '../components/whop/MembershipTiers';
// Wrap app with MembershipProvider
```

### "Animations slow"

1. Check OptimizedAnimation component is used
2. Verify Service Worker is registered
3. Check CDN URLs are correct
4. Reduce quality for slow connections

---

## Support

- Whop Developer Discord: [discord.gg/whop](https://discord.gg/whop)
- Documentation: [docs.whop.com](https://docs.whop.com)

---

*Last updated: December 2024*
