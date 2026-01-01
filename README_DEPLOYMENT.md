# Quick Start: Deploy to Render

## What's Been Prepared

✅ **Backend Configuration**
- Added PostgreSQL support alongside SQLite
- Environment variable configuration for production
- Production profile setup

✅ **Frontend Configuration**
- Centralized API configuration using environment variables
- All API calls now use `VITE_API_URL` environment variable
- Updated all components to use the centralized config

✅ **Deployment Files**
- `render.yaml` - Blueprint configuration for Render
- `DEPLOYMENT.md` - Detailed deployment guide

## Quick Deployment (3 Steps)

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Deploy via Render Blueprint
1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Click "Apply"

### 3. Set Frontend Environment Variable
After deployment, you'll need to manually set the frontend's `VITE_API_URL`:
1. Go to your `tastyfood-frontend` service
2. Go to "Environment" tab
3. Add: `VITE_API_URL` = `https://tastyfood-backend.onrender.com/api`
4. Save and redeploy

## Important Notes

⚠️ **Database Migration**: Your local SQLite database won't automatically transfer. You have 3 options:
1. **Use the migration script** (easiest): See `MIGRATION_QUICK_START.md`
2. **Manual export/import**: See `DATABASE_MIGRATION.md`
3. **Manual data entry**: Add data through the UI after deployment

⚠️ **First Deployment**: If you don't migrate data, the database will be empty. You'll need to:
- Add menu categories
- Add menu items
- Create user accounts

⚠️ **Free Tier**: Services spin down after 15 minutes of inactivity. First request may take 30-60 seconds.

⚠️ **Database**: Uses PostgreSQL on Render (not SQLite). Data structure will be created automatically on first run.

## Environment Variables Reference

### Backend (Auto-configured via render.yaml)
- Database connection (auto-set from database service)
- Spring profiles
- JPA settings

### Frontend (Manual setup required)
- `VITE_API_URL`: Your backend URL + `/api` (e.g., `https://tastyfood-backend.onrender.com/api`)

## Troubleshooting

**Backend won't start?**
- Check build logs in Render dashboard
- Verify Java 17 is being used
- Check database connection environment variables

**Frontend can't connect to backend?**
- Verify `VITE_API_URL` is set correctly
- Check CORS settings (should allow all origins)
- Ensure backend URL includes `/api` at the end

**Database connection errors?**
- Wait a few minutes after database creation
- Verify environment variables are set correctly
- Check database is in the same region as backend

For detailed instructions, see `DEPLOYMENT.md`

