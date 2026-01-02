# Railway Deployment Guide for TastyFood

This guide will help you deploy both the frontend and backend to Railway, connecting to a Supabase PostgreSQL database.

## Prerequisites

1. Railway account (sign up at https://railway.app)
2. Supabase account (sign up at https://supabase.com)
3. GitHub repository with your code

## Step 1: Set up Supabase Database

1. Create a new project in Supabase
2. Go to **Settings** → **Database**
3. Copy the **Connection String** (URI format: `postgres://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`)
4. You'll need to convert this to JDBC format for Spring Boot

### Converting Supabase Connection String

Supabase provides: `postgres://user:password@host:port/dbname`

For Spring Boot, you need: `jdbc:postgresql://host:port/dbname?user=user&password=password&sslmode=require`

**Example:**

- Supabase: `postgres://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
- JDBC: `jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres?user=postgres.xxxxx&password=password&sslmode=require`

## Step 2: Initialize Database Schema

1. In Supabase, go to **SQL Editor**
2. Run your schema creation SQL (you may need to create this from your domain entities)
3. Run your data migration SQL (`postgres_migration.sql`)

## Step 3: Deploy Backend to Railway

1. In Railway dashboard, click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your repository
4. Railway will auto-detect it's a Java project
5. Set the **Root Directory** to `backend`
6. Add the following environment variables:

   ```
   PORT=8080
   DATABASE_URL=jdbc:postgresql://db.vmmfzfrdjcjdtbttrnri.supabase.co:5432/postgres?user=postgres&password=Queencity%2312345&sslmode=require
   DATABASE_DRIVER=org.postgresql.Driver
   CORS_ALLOWED_ORIGINS=https://[YOUR-FRONTEND-URL].railway.app
   SPRING_PROFILES_ACTIVE=prod
   SHOW_SQL=false
   ```

   **Important:** Note that the `#` in your password has been URL-encoded as `%23`. If your password contains other special characters, they may also need encoding:

   - `#` → `%23`
   - `@` → `%40`
   - `%` → `%25`
   - `&` → `%26`
   - `+` → `%2B`
   - `=` → `%3D`
   - `?` → `%3F`

7. Railway will automatically build and deploy your backend
8. **Find your backend URL:**
   - After deployment completes, click on your backend service in Railway
   - Go to the **Settings** tab
   - Scroll down to **Networking** section
   - Under **Public Domain**, you'll see your backend URL (e.g., `https://tastyfood-backend-production.up.railway.app`)
   - **OR** you can find it in the **Deployments** tab - click on the latest deployment and look for the domain
   - Copy this URL - you'll need it for the frontend configuration

## Step 4: Deploy Frontend to Railway

1. In the same Railway project, click **+ New Service**
2. Select **Deploy from GitHub repo** (same repo)
3. **CRITICAL:** Set the **Root Directory** to `frontend`:
   - **BEFORE** Railway starts building, click on your frontend service
   - Go to **Settings** tab
   - Scroll to **Source** section
   - Set **Root Directory** to `frontend` (must be exactly `frontend`, no leading/trailing slashes)
   - Click **Save**
   - This ensures Railway uses the frontend's `railway.json` and `nixpacks.toml`, not the root ones
4. Railway will detect it's a Node.js project
5. **IMPORTANT:** If Railway already started building, you MUST:
   - Delete the service
   - Create a new service
   - Set Root Directory to `frontend` BEFORE it starts building
   - OR: Go to Settings → Source → Change Root Directory → Save → Redeploy
6. **CRITICAL:** Add the environment variable BEFORE the build starts:

   - Click on your frontend service in Railway
   - Go to the **Variables** tab (or **Settings** → **Variables**)
   - Click **+ New Variable** or **+ Raw Editor**
   - Add the following (use the backend URL you found in Step 3):

   ```
   Variable Name: VITE_API_BASE_URL
   Value: https://[YOUR-BACKEND-URL]/api
   ```

   **Example:** If your backend URL is `https://tastyfood-backend-production.up.railway.app`, then:

   ```
   VITE_API_BASE_URL=https://tastyfood-backend-production.up.railway.app/api
   ```

   **Important:**

   - Set this variable BEFORE Railway starts building
   - If the build already started, you'll need to trigger a new deployment after adding the variable
   - Go to **Deployments** tab → Click **Redeploy** after adding the variable

7. Railway will build and deploy your frontend
8. **Find your frontend URL:**
   - After deployment completes, click on your frontend service in Railway
   - Go to the **Settings** tab
   - Scroll down to **Networking** section
   - Under **Public Domain**, you'll see your frontend URL (e.g., `https://tastyfood-frontend-production.up.railway.app`)
   - Copy this URL - you'll need it for CORS configuration

## Step 5: Update CORS Settings

1. Go back to your backend service in Railway
2. Update the `CORS_ALLOWED_ORIGINS` environment variable to include your frontend URL:
   ```
   CORS_ALLOWED_ORIGINS=https://[YOUR-FRONTEND-URL].railway.app
   ```
3. Redeploy the backend

## Step 6: Verify Deployment

1. Visit your frontend URL
2. Test the application functionality
3. Check Railway logs for any errors

## Environment Variables Summary

### Backend

- `PORT` - Server port (usually 8080, Railway sets this automatically)
- `DATABASE_URL` - PostgreSQL JDBC connection string
- `DATABASE_DRIVER` - `org.postgresql.Driver`
- `CORS_ALLOWED_ORIGINS` - Your frontend URL
- `SPRING_PROFILES_ACTIVE` - `prod`
- `SHOW_SQL` - `false` (for production)

### Frontend

- `VITE_API_BASE_URL` - Your backend API URL (e.g., `https://backend.railway.app/api`)

## Troubleshooting

### Database Connection Issues

- Verify your Supabase connection string is correct
- Check that your Supabase database allows connections from Railway's IPs
- Ensure SSL mode is set to `require` in the JDBC URL

### CORS Errors

- Make sure `CORS_ALLOWED_ORIGINS` includes your exact frontend URL
- Check that the frontend is using the correct `VITE_API_BASE_URL`

### Build Failures

#### Frontend Build Error: "npm run build" failed

**Problem:** The build fails with a rollup/Vite error. This can happen if:

- `VITE_API_BASE_URL` environment variable is not accessible during build
- There are code syntax errors
- Railway isn't passing environment variables to the Docker build phase

**Solution:**

1. **Verify environment variable is set:**

   - Go to frontend service → **Variables** tab
   - Ensure `VITE_API_BASE_URL` is set with your backend URL
   - Format: `https://your-backend-url.railway.app/api` (no trailing slash)

2. **Set variable at project level (if service level doesn't work):**

   - Go to Railway project settings (not service settings)
   - Add the variable there - Railway will share it with all services

3. **Redeploy after setting variable:**

   - Go to **Deployments** tab
   - Click **Redeploy** to rebuild with the environment variable

4. **Check Railway logs for detailed error:**

   - Click on the failed deployment
   - Look for the specific error message
   - The error might reveal if it's an env var issue or code issue

5. **Alternative: Use a default value temporarily:**
   - The code already has a fallback to `http://localhost:8080/api`
   - If the build still fails, the issue might be code-related, not env var related
   - Check Railway logs for the actual error message

#### Other Build Issues

- Check Railway logs for specific error messages
- Verify all dependencies are correctly specified in `pom.xml` and `package.json`
- For frontend: Ensure Node.js version is compatible (Railway usually auto-detects)
