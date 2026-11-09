# Google Drive Image Upload — Setup Guide & Code Changes

## What Was Updated

I found and fixed a **critical bug** across all frontends. Previously, every `<img>` tag hardcoded the path as `/uploads/${url}`. When Google Drive is enabled, the database stores full `https://drive.google.com/uc?id=...` URLs, so prepending `/uploads/` would break every image.

All 5 locations across the codebase now use smart detection:
- If the URL starts with `http` → use it directly (Google Drive)
- If not → prepend `/uploads/` (local storage)

### Files Modified
| File | What Changed |
|------|-------------|
| `.env` | Added `GOOGLE_DRIVE_FOLDER_ID` and `GOOGLE_APPLICATION_CREDENTIALS_JSON` placeholders |
| `apps/admin/src/pages/InventoryForm.jsx` | Fixed image `src` in the edit form gallery |
| `apps/admin/src/pages/InventoryList.jsx` | Fixed image `src` in the inventory table |
| `apps/web/src/pages/Inventory.jsx` | Fixed image `src` in the public gallery grid |
| `apps/web/src/pages/CarDetails.jsx` | Fixed main hero image and thumbnail `src` |

### Files Previously Created (No Changes Needed)
| File | Purpose |
|------|---------|
| `apps/api/src/services/gdriveService.js` | Handles authentication, upload, delete with Google Drive API |
| `apps/api/src/middleware/upload.js` | Automatically switches between local disk and memory storage |
| `apps/api/src/services/inventoryService.js` | Routes uploads to GDrive when enabled; handles deletion from both |
| `apps/api/src/config/env.js` | Reads `GOOGLE_DRIVE_FOLDER_ID` and `GOOGLE_APPLICATION_CREDENTIALS_JSON` |

---

## How to Connect Google Drive (Step-by-Step)

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top → **New Project**.
3. Name it `Forest Wheel Storage` → Click **Create**.
4. Make sure the new project is selected in the dropdown.

### Step 2: Enable the Google Drive API
1. In the left sidebar, go to **APIs & Services → Library**.
2. Search for **Google Drive API**.
3. Click on it → Click **Enable**.

### Step 3: Create a Service Account
1. Go to **APIs & Services → Credentials**.
2. Click **Create Credentials → Service Account**.
3. Name: `forestwheel-uploader` → Click **Create and Continue**.
4. Skip the optional role/access steps → Click **Done**.
5. You will see the new service account listed. Click on it.
6. Go to the **Keys** tab.
7. Click **Add Key → Create New Key → JSON** → Click **Create**.
8. A `.json` file will download to your computer. **Keep this file safe.**

### Step 4: Create a Google Drive Folder
1. Open [Google Drive](https://drive.google.com/) in your browser.
2. Create a new folder called `Forest Wheel Uploads`.
3. Right-click the folder → **Share**.
4. In the sharing dialog, paste the **service account email** (it looks like `forestwheel-uploader@your-project.iam.gserviceaccount.com`). You can find this email in the Google Cloud Console under the Service Account details.
5. Give it **Editor** access → Click **Send** (or **Share**).
6. Open the folder. Look at the URL in your browser's address bar:
   ```
   https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ
   ```
   The long string after `folders/` is your **Folder ID**. Copy it.

### Step 5: Update Your `.env` File
Open `e:\AI\forestwheel-web-ai\.env` and fill in the two Google Drive variables:

```env
GOOGLE_DRIVE_FOLDER_ID=1aBcDeFgHiJkLmNoPqRsTuVwXyZ
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"forest-wheel-storage","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"forestwheel-uploader@forest-wheel-storage.iam.gserviceaccount.com",...}
```

> [!WARNING]  
> The `GOOGLE_APPLICATION_CREDENTIALS_JSON` value must be the **entire content** of the downloaded `.json` file, all on **one line**. Open the `.json` file in a text editor, select all, copy, and paste it after the `=` sign.

### Step 6: Restart the API Server
1. Go to the terminal where `apps/api` is running.
2. Press `Ctrl+C` to stop it.
3. Run `npm run dev` again.

### Step 7: Test It!
1. Open the Admin portal at `http://localhost:5174/inventory`.
2. Click on any existing vehicle (or create a new one first).
3. Upload an image using the **Media Assets** section.
4. Open your Google Drive folder — the image should appear there!
5. Open the Web portal at `http://localhost:5173/inventory` — the image should render correctly from Google Drive.

---

> [!TIP]
> Your existing locally-stored images will continue to work! The system is backward-compatible. Only **new uploads** will go to Google Drive. Old images still reference the local `/uploads/` path and will render correctly.
