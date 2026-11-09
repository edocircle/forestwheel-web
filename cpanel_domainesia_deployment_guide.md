# DomaiNesia cPanel Deployment Guide (Updated)

Deploying a modern Monorepo (Node.js API + React Vite Frontends) to a traditional cPanel environment like DomaiNesia requires a few specific steps. Since cPanel uses Apache/LiteSpeed, we will host the frontends as static files and use the "Setup Node.js App" feature for the backend API.

Assuming your custom domain is `yourdomain.com`, we will set up the following structure:
* **Web Portal:** `https://yourdomain.com`
* **Admin Portal:** `https://admin.yourdomain.com`
* **Backend API:** `https://api.yourdomain.com`

---

## Step 1: Prepare Your Domains
Log into your DomaiNesia cPanel.

1. Go to **Domains** (or Subdomains).
2. Create a subdomain named `admin.yourdomain.com`. Make note of its Document Root (usually `public_html/admin` or `admin.yourdomain.com`).
3. Create another subdomain named `api.yourdomain.com`. Set its Document Root to a secure folder *outside* of `public_html` if possible, e.g., `/home/username/api.yourdomain.com`.
4. Ensure SSL certificates are issued for all three domains via the **Let's Encrypt SSL** section in cPanel.

---

## Step 2: Set Up PostgreSQL Database
The backend uses Prisma ORM which requires a PostgreSQL database. 

1. In cPanel, find **PostgreSQL Databases** (or use MySQL if Postgres is unavailable, but you must change Prisma provider in `schema.prisma`). Assuming Postgres:
2. **Create Database:** Create a new database. *Example:* `domainesiauser_forestwheel`
3. **Create User:** Create a new user and generate a strong password. *Example:* `domainesiauser_dbadmin` with password `MyS3cr3tP@ssw0rd!`
4. **Grant Privileges:** Add the user to the database and grant ALL PRIVILEGES.
5. **Construct your DB URL:** 
   Prisma requires a specific URL format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`
   * **USER:** `domainesiauser_dbadmin`
   * **PASSWORD:** `MyS3cr3tP@ssw0rd!` (if your password has special chars like `@`, `:` or `#`, you *must* URL-encode them. E.g. `@` becomes `%40`)
   * **HOST:** `localhost` (or `127.0.0.1`)
   * **PORT:** `5432` (default Postgres port)
   * **DATABASE:** `domainesiauser_forestwheel`

   **Final String:** `postgresql://domainesiauser_dbadmin:MyS3cr3tP@ssw0rd!@127.0.0.1:5432/domainesiauser_forestwheel?schema=public`

---

## Step 3: Cloudinary Setup (Media Storage)
Since cPanel file systems can be tricky and slow for serving heavy images, we are using Cloudinary to host vehicle images.

1. Go to [Cloudinary.com](https://cloudinary.com) and sign in.
2. Go to your **Dashboard**.
3. Locate your **Product Environment Credentials**:
   * **Cloud Name:** (e.g., `demqmcqky`)
   * **API Key:** (e.g., `123456789012345`)
   * **API Secret:** (e.g., `abc123xyz456...`)
4. Keep these handy for the next step.

---

## Step 4: Deploy the Backend API (Node.js)

### 4.1 Upload Files
1. On your local computer, zip the contents of the `apps/api` folder. **Do not include the `node_modules` folder.** Include `package.json`, `prisma`, `src`, etc.
2. In cPanel, go to **File Manager**. Navigate to the root directory you created for the API (e.g., `/home/username/api.yourdomain.com`).
3. Upload and extract your zip file here.

### 4.2 Setup Node.js App
1. In cPanel, search for **Setup Node.js App** (in the Software section).
2. Click **Create Application**.
3. **Node.js Version:** Select **18.x** or higher (ideally 20.x).
4. **Application mode:** Production
5. **Application root:** The folder where you uploaded your API (e.g., `api.yourdomain.com`).
6. **Application URL:** Select `api.yourdomain.com`.
7. **Application startup file:** `src/index.js`
8. Click **Create**.

### 4.3 Environment Variables
Scroll down on the Node.js App page to the **Environment variables** section. Add the following exact keys:

* `NODE_ENV`: `production`
* `DATABASE_URL`: `postgresql://...` (from Step 2)
* `JWT_SECRET`: `generate_a_long_random_string_here`
* `WEB_URL`: `https://yourdomain.com`
* `ADMIN_URL`: `https://admin.yourdomain.com`
* `CLOUDINARY_CLOUD_NAME`: `your_cloud_name` (from Step 3)
* `CLOUDINARY_API_KEY`: `your_api_key` (from Step 3)
* `CLOUDINARY_API_SECRET`: `your_api_secret` (from Step 3)

After adding them, scroll to the top and click **Run NPM Install**.

### 4.4 Run Database Migrations
Because we updated the database schema recently (adding Torque, Drive Type, Editorial, etc.), you must sync the schema to your production database.

1. Open the cPanel **Terminal** (under the Advanced section).
2. Navigate to your app folder: `cd /home/username/api.yourdomain.com`
3. Enter the virtual environment command shown at the top of your "Setup Node.js App" page (e.g., `source /home/user/nodevenv/api.yourdomain.com/18/bin/activate`).
4. Run: `npm run prisma:generate` (creates the Prisma client).
5. Run: `npx prisma migrate deploy` (creates the tables in Postgres).
6. Go back to the Node.js App page and click **Restart**.

---

## Step 5: Deploy the Frontends (React/Vite)

Because your frontends are built with Vite, they compile down to static HTML, CSS, and JS files. They do not need Node.js to run on the server!

### 5.1 Prepare the Code Locally
1. Open your local code editor.
2. **Web Portal:** 
   * Edit `apps/web/.env.production` (create it if it doesn't exist).
   * Add: `VITE_API_URL=https://api.yourdomain.com`
   * Run: `npm run build` inside the `apps/web` folder.
3. **Admin Portal:**
   * Edit `apps/admin/.env.production`.
   * Add: `VITE_API_URL=https://api.yourdomain.com`
   * Run: `npm run build` inside the `apps/admin` folder.

### 5.2 Upload to cPanel
1. When you run `npm run build`, Vite creates a `dist` folder inside `apps/web` and `apps/admin`.
2. Zip the *contents* of the `apps/web/dist` folder.
3. Go to cPanel **File Manager** and navigate to `public_html`. Delete everything currently there, and upload/extract your `web` zip file.
4. Zip the *contents* of the `apps/admin/dist` folder.
5. Navigate to the `admin.yourdomain.com` document root folder you created in Step 1. Upload/extract your `admin` zip file here.

### 5.3 Fix React Router on cPanel (Crucial Step)
Because React uses client-side routing, if someone refreshes `yourdomain.com/inventory`, Apache will throw a 404 error.
1. In `public_html` (Web), create a file named `.htaccess`. Add this code:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
2. Repeat this step: Create the exact same `.htaccess` file inside your `admin.yourdomain.com` folder.

---

## Verification
1. Visit `https://yourdomain.com` - Should load your public site.
2. Visit `https://api.yourdomain.com/health` - Should return a 200 OK or JSON status.
3. Visit `https://admin.yourdomain.com` - Login and create a test vehicle. Ensure you upload an image; verify that the image URL saves correctly via Cloudinary and displays on the public website.
