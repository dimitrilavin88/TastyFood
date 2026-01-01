# Quick Start: Migrate Your SQLite Data to PostgreSQL

## Prerequisites

1. Python 3.7+ installed
2. Your SQLite database file (`TastyFoodFinal.db`) in the project root
3. Your Render PostgreSQL connection string

## Step-by-Step Migration

### 1. Install Python Dependencies

```bash
pip install -r requirements_migration.txt
```

### 2. Get Your Render PostgreSQL Connection String

1. Deploy your app to Render first (or create just the database)
2. Go to your Render dashboard
3. Open your `tastyfood-db` service
4. Copy the **Internal Database URL** (looks like: `postgresql://user:password@host:port/database`)

### 3. Set Environment Variable

**On macOS/Linux:**
```bash
export POSTGRES_CONNECTION_STRING='postgresql://user:password@host:port/database'
```

**On Windows:**
```cmd
set POSTGRES_CONNECTION_STRING=postgresql://user:password@host:port/database
```

### 4. Run the Migration Script

```bash
python migrate_sqlite_to_postgres.py
```

The script will:
- ✅ Connect to your SQLite database
- ✅ Connect to your Render PostgreSQL database
- ✅ Migrate all tables in the correct order
- ✅ Preserve all your data

### 5. Verify Migration

1. Go to your deployed application
2. Check that menu items and categories appear
3. Try logging in with existing credentials
4. Verify all data is present

## Troubleshooting

**"SQLite database not found"**
- Make sure `TastyFoodFinal.db` is in the project root
- Or update `SQLITE_DB_PATH` in the script

**"Connection string not set"**
- Make sure you exported the `POSTGRES_CONNECTION_STRING` environment variable
- Get the connection string from Render dashboard

**"Table doesn't exist"**
- The PostgreSQL database needs to be created first
- Deploy your backend to Render - it will create the schema automatically
- Then run the migration script

**"Foreign key constraint error"**
- The script migrates tables in the correct order
- If you still get errors, you may need to temporarily disable foreign key checks
- Or manually fix the data

## Alternative: Manual Migration

If the script doesn't work, see `DATABASE_MIGRATION.md` for manual export/import instructions.

