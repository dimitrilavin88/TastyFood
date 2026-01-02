# Railway Deployment Guide for TastyFood

This guide will help you deploy your TastyFood application to Railway.

## Prerequisites

1. A Railway account (sign up at https://railway.app)
2. Your project pushed to a GitHub repository
3. PostgreSQL database (Railway provides this)

## Deployment Steps

### Step 1: Create a New Project on Railway

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your TastyFood repository

### Step 2: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create a PostgreSQL database
4. Note the connection details (you'll need these)

### Step 3: Deploy Backend Service

1. In your Railway project, click "New" → "GitHub Repo"
2. Select your repository again
3. Railway will detect it's a Java project
4. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/backend-1.0.0.jar`

### Step 4: Configure Backend Environment Variables

In your backend service settings, add these environment variables:

```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=${{Postgres.DATABASE_URL}}
PGUSER=${{Postgres.PGUSER}}
PGPASSWORD=${{Postgres.PGPASSWORD}}
PORT=8080
```

**Note**: Replace `Postgres` with your actual PostgreSQL service name if different.

### Step 5: Deploy Frontend Service

1. In your Railway project, click "New" → "GitHub Repo"
2. Select your repository again
3. Configure the service:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview` (or use a static file server)

**Alternative**: For better production setup, use a static file server:

- Install `serve`: `npm install -g serve`
- Start Command: `serve -s dist -l 3000`

### Step 6: Configure Frontend Environment Variables

In your frontend service settings, add:

```
VITE_API_BASE_URL=https://your-backend-service.railway.app/api
```

Replace `your-backend-service` with your actual backend Railway URL.

### Step 7: Update CORS Settings

The backend CORS config should already allow all origins. If you need to restrict it, update `CorsConfig.java` to include your frontend URL.

### Step 8: Initialize Database

After deployment, you'll need to initialize your database:

**Option 1: Use Hibernate to create tables (Easiest)**

1. Temporarily update `application-prod.properties`:
   - Change `spring.jpa.hibernate.ddl-auto=none` to `spring.jpa.hibernate.ddl-auto=update`
2. Redeploy the backend service
3. Hibernate will create all tables automatically
4. Change `ddl-auto` back to `none` and redeploy

**Option 2: Manual table creation**

1. Go to your PostgreSQL service in Railway
2. Click "Query" tab
3. Create tables manually based on your JPA entities
4. Run the SQL from `postgres_inserts.sql` to populate initial data

**Option 3: Use Railway's database viewer**

- Railway provides a built-in database viewer where you can run SQL queries
- Navigate to your PostgreSQL service → "Data" tab

### Step 9: Get Your URLs

1. Backend URL: Found in your backend service → Settings → Domains
2. Frontend URL: Found in your frontend service → Settings → Domains

## Important Notes

- **Database Migration**: The app uses `ddl-auto=none`, so you need to manually create tables or run migrations
- **Port**: Railway sets the `PORT` environment variable automatically
- **Database URL**: Railway provides `DATABASE_URL` automatically for PostgreSQL services
- **Free Tier**: Railway gives $5 credit/month, which should be enough for small projects

## Troubleshooting

### Backend won't start

- Check logs in Railway dashboard
- Verify environment variables are set correctly
- Ensure PostgreSQL is running and connected

### Frontend can't connect to backend

- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS settings in backend
- Ensure backend service is running

### Database connection errors

- Verify `DATABASE_URL` environment variable
- Check PostgreSQL service is running
- Ensure database tables are created

## Local Development

For local development, the app still uses SQLite. To use PostgreSQL locally:

1. Update `application.properties` to use PostgreSQL
2. Or use environment variables to override settings

## Production Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] PostgreSQL database created and connected
- [ ] Database tables created
- [ ] Initial data inserted (from postgres_inserts.sql)
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Frontend can connect to backend
- [ ] Test login functionality
- [ ] Test order creation
