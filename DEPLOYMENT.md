# TastyFood Deployment Guide for Render

This guide will help you deploy your TastyFood application to Render.

## Prerequisites

1. A GitHub account with your TastyFood repository
2. A Render account (sign up at https://render.com)

## Deployment Steps

### Option 1: Using Render Blueprint (Recommended)

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Deploy via Render Blueprint:**
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will detect the `render.yaml` file and create all services automatically
   - Click "Apply" to deploy

3. **Wait for deployment** - This may take 10-15 minutes for the first deployment

### Option 2: Manual Deployment

#### Step 1: Deploy PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `tastyfood-db`
   - **Database**: `tastyfood`
   - **User**: `tastyfood_user`
   - **Region**: Oregon (or your preferred region)
   - **Plan**: Free
4. Click "Create Database"
5. **Note the connection details** - you'll need these for the backend

#### Step 2: Deploy Backend (Spring Boot)

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `tastyfood-backend`
   - **Region**: Oregon (same as database)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Environment**: `Java`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/backend-1.0.0.jar`
4. **Environment Variables**:
   - `SPRING_PROFILES_ACTIVE` = `production`
   - `SERVER_PORT` = `8080`
   - `JAVA_VERSION` = `17`
   - `SPRING_DATASOURCE_URL` = (from database service - Internal Database URL)
   - `SPRING_DATASOURCE_USERNAME` = (from database service - Database User)
   - `SPRING_DATASOURCE_PASSWORD` = (from database service - Database Password)
   - `SPRING_DATASOURCE_DRIVER_CLASS_NAME` = `org.postgresql.Driver`
   - `SPRING_JPA_DATABASE_PLATFORM` = `org.hibernate.dialect.PostgreSQLDialect`
   - `SPRING_JPA_HIBERNATE_DDL_AUTO` = `update`
5. Click "Create Web Service"
6. **Note the backend URL** (e.g., `https://tastyfood-backend.onrender.com`)

#### Step 3: Deploy Frontend (React)

1. Click "New +" → "Static Site" (or "Web Service" if you prefer)
2. Connect your GitHub repository
3. Configure:
   - **Name**: `tastyfood-frontend`
   - **Region**: Oregon (same as other services)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL` = `https://tastyfood-backend.onrender.com/api` (use your actual backend URL)
5. Click "Create Static Site"

## Post-Deployment

### Database Migration

On first deployment, the database will be empty. You have two options:

1. **Manual Data Entry**: Use the application UI to add menu items, categories, etc.

2. **Database Import**: If you have existing SQLite data:
   - Export data from your local SQLite database
   - Convert to PostgreSQL format
   - Import into Render's PostgreSQL database

### Verify Deployment

1. Visit your frontend URL (e.g., `https://tastyfood-frontend.onrender.com`)
2. Test the application:
   - Browse the menu
   - Create an account/login
   - Place a test order
   - Check admin dashboard

## Troubleshooting

### Backend Issues

- **Build fails**: Check the build logs in Render dashboard
- **Database connection errors**: Verify environment variables are set correctly
- **CORS errors**: The backend is configured to allow all origins, but you can restrict it in `CorsConfig.java`

### Frontend Issues

- **API calls fail**: Verify `VITE_API_URL` environment variable is set correctly
- **Build fails**: Check Node.js version compatibility (should be 18+)

### Database Issues

- **Connection timeout**: Free tier databases spin down after inactivity. First request may take longer.
- **Migration issues**: Check `SPRING_JPA_HIBERNATE_DDL_AUTO` is set to `update`

## Free Tier Limitations

- Services may spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Database has limited storage (1GB on free tier)
- Consider upgrading to paid plans for production use

## Custom Domain (Optional)

1. Go to your service settings in Render
2. Click "Custom Domains"
3. Add your domain
4. Follow DNS configuration instructions

## Environment Variables Reference

### Backend
- `SPRING_PROFILES_ACTIVE`: Set to `production`
- `SPRING_DATASOURCE_URL`: PostgreSQL connection string
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `SPRING_DATASOURCE_DRIVER_CLASS_NAME`: `org.postgresql.Driver`
- `SPRING_JPA_DATABASE_PLATFORM`: `org.hibernate.dialect.PostgreSQLDialect`
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update` (for auto-migration)

### Frontend
- `VITE_API_URL`: Backend API URL (e.g., `https://tastyfood-backend.onrender.com/api`)

## Support

For issues specific to Render, check:
- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com

