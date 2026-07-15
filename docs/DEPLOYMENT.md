# EstateOS — Deployment Guide

## Prerequisites

1. **Vercel account** — vercel.com (free tier)
2. **Supabase account** — supabase.com (free tier)
3. **Resend account** — resend.com (free tier, 100 emails/day)
4. **GitHub repo** — push code to GitHub

---

## Step 1: Supabase (Database + Storage)

### Create Project
1. Go to supabase.com → New Project
2. Choose region closest to Algeria (EU West / Paris)
3. Set a strong database password
4. Wait for project to be ready

### Get Credentials
1. Go to **Settings → API**
2. Copy:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **Anon Key** (public)
3. Go to **Settings → Database**
4. Copy **Connection string → URI** (Transaction mode, port 6543)

### Create Storage Bucket
1. Go to **Storage → New bucket**
2. Name: `property-images`
3. **Public bucket**: ON
4. Go to **Storage → Policies**
5. Add policy: `Allow authenticated uploads` (INSERT)
6. Add policy: `Allow public reads` (SELECT)

---

## Step 2: Resend (Email)

1. Go to resend.com → Sign up
2. Go to **API Keys** → Create API Key
3. Copy the key (starts with `re_`)
4. **Verify your domain** (optional but recommended):
   - Add DNS records to your domain
   - Use `noreply@yourdomain.com` as sender

---

## Step 3: Vercel (Hosting)

### Connect Repository
1. Go to vercel.com → New Project
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Root directory: `./`
5. Build command: `npx prisma generate && next build`
6. Output directory: `.next`

### Environment Variables
Add these in Vercel → Settings → Environment Variables:

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
BETTER_AUTH_SECRET=[generate-32-char-random-string]
BETTER_AUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_BUCKET=property-images
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=EstateOS <noreply@yourdomain.com>
SEED_SECRET=[generate-random-string]
```

### Generate BETTER_AUTH_SECRET
Run locally:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 4: Database Migration

After deploying, run Prisma migration on production:

```bash
# Option A: Run locally with production DATABASE_URL
DATABASE_URL="postgresql://..." npx prisma db push

# Option B: Use Vercel's build step (already in build command)
# prisma generate runs automatically, but db push needs to be run once
```

### Seed Demo Data (Optional)
```bash
# Set SEED_SECRET in .env, then:
curl -X POST https://your-domain.vercel.app/api/seed \
  -H "Content-Type: application/json" \
  -H "x-seed-key: your-seed-secret" \
  -d '{"email":"admin@estateos.dz","password":"admin123456"}'
```

---

## Step 5: Custom Domain (Optional)

1. Vercel → Settings → Domains
2. Add your domain (e.g., `estateos.dz`)
3. Update DNS records as shown
4. Update `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to new domain

---

## Post-Deployment Checklist

- [ ] Database migrated (prisma db push)
- [ ] Storage bucket created + policies set
- [ ] All env vars set in Vercel
- [ ] Site loads at Vercel URL
- [ ] Login works (`admin@estateos.dz` / `admin123456`)
- [ ] Can create new agency
- [ ] Can add property with images
- [ ] Public agency page loads
- [ ] Emails send (test lead submission)
- [ ] Super Admin dashboard works

---

## Free Tier Limits

| Service | Free Limit | Notes |
|---------|-----------|-------|
| Vercel | 100GB bandwidth/month | ~50k visits/month |
| Supabase | 500MB database, 1GB storage | ~1000 properties |
| Resend | 100 emails/day | Enough for 20 agencies |

**Estimated monthly cost: $0** until you exceed free tiers.
