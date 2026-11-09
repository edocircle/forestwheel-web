# Cloudinary Image Storage — Setup Guide

Google Drive has been completely removed and replaced with **Cloudinary**. Cloudinary is much simpler — no service accounts, no JSON keys. Just 3 values from your dashboard.

---

## What Was Changed

| Action | File |
|--------|------|
| **Created** | `apps/api/src/services/cloudinaryService.js` — Upload & delete logic |
| **Deleted** | `apps/api/src/services/gdriveService.js` — No longer needed |
| **Updated** | `apps/api/src/config/env.js` — Replaced GDrive vars with Cloudinary vars |
| **Updated** | `apps/api/src/middleware/upload.js` — Toggle now checks `CLOUDINARY_CLOUD_NAME` |
| **Updated** | `apps/api/src/services/inventoryService.js` — Uses Cloudinary for upload/delete |
| **Updated** | `.env` — Replaced GDrive placeholders with Cloudinary placeholders |
| **Removed** | `googleapis` npm package — Replaced with `cloudinary` package |

---

## How to Set Up Cloudinary (Step-by-Step)

### Step 1: Log In to Cloudinary
Go to [https://console.cloudinary.com/](https://console.cloudinary.com/) and log into your account.

### Step 2: Get Your API Credentials
On the **Dashboard** page (the first page you see after login), you will see a section called **"API Environment variable"** or **"Product Environment Credentials"**. It shows three values:

| Label | What it is |
|-------|-----------|
| **Cloud Name** | Your unique Cloudinary identifier (e.g. `dxyz1abc2`) |
| **API Key** | A numeric key (e.g. `123456789012345`) |
| **API Secret** | A secret string (e.g. `abC1dEf2gHi3jKl4mNo5pQr6sT`) |

> [!IMPORTANT]
> Click the **"eye" icon** next to API Secret to reveal it. Copy all three values.

### Step 3: Paste Into Your `.env` File
Open `e:\AI\forestwheel-web-ai\.env` and fill in the three Cloudinary values:

```env
# Cloudinary Image Storage
CLOUDINARY_CLOUD_NAME=dxyz1abc2
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abC1dEf2gHi3jKl4mNo5pQr6sT
```

### Step 4: Restart Your API Server
1. Go to the terminal where `apps/api` is running.
2. Press `Ctrl+C` to stop it.
3. Run `npm run dev` again.

### Step 5: Test It!
1. Open the Admin portal at `http://localhost:5174/inventory`.
2. Edit any existing vehicle (or create a new one).
3. Upload an image using the **Media Assets** section on the sidebar.
4. Go to your Cloudinary Dashboard → **Media Library**. You should see a new folder called `forestwheel/vehicles` with your uploaded image.
5. Open the Web portal at `http://localhost:5173/inventory` — the image should render perfectly!

---

## How It Works

- When Cloudinary credentials are set, the upload middleware stores images in **memory** (instead of saving to disk).
- The backend then streams that buffer directly to Cloudinary's API.
- Cloudinary returns a **secure HTTPS URL** (e.g. `https://res.cloudinary.com/your-cloud/image/upload/...`).
- That URL is saved in the PostgreSQL database.
- The frontends detect that the URL starts with `http` and use it directly (no `/uploads/` prefix).
- When you delete a vehicle or image, Cloudinary is called to remove the file from the cloud too.

> [!TIP]
> **Cloudinary Free Tier** gives you **25 GB storage** and **25 GB bandwidth/month** — more than enough for a dealership website! Your existing locally-stored images will continue to work. Only new uploads go to Cloudinary.
