# Database Migration Guide: SQLite to PostgreSQL

Your local SQLite database won't automatically transfer to Render. You'll need to migrate your data to PostgreSQL.

## Option 1: Manual Data Entry (Easiest for Small Datasets)

If you don't have much data, you can simply:
1. Deploy to Render (database will be empty)
2. Use the application UI to add:
   - Menu categories
   - Menu items
   - Employees/staff accounts
   - Drivers

## Option 2: Export/Import SQL (Recommended)

### Step 1: Export Data from SQLite

Run this command to export your SQLite data:

```bash
cd /Users/dimitrilavin/TastyFood
sqlite3 TastyFoodFinal.db .dump > database_export.sql
```

Or if you want to export specific tables:

```bash
sqlite3 TastyFoodFinal.db <<EOF
.output categories.sql
.dump item_categories

.output menu_items.sql
.dump menu_items

.output employees.sql
.dump employees

.output login_credentials.sql
.dump login_credentials

.output drivers.sql
.dump drivers

.output delivery_address.sql
.dump delivery_address

.output orders.sql
.dump orders

.output order_items.sql
.dump order_items
EOF
```

### Step 2: Convert SQL for PostgreSQL

SQLite and PostgreSQL have some syntax differences. You'll need to:

1. **Remove SQLite-specific syntax**:
   - Remove `BEGIN TRANSACTION;` and `COMMIT;`
   - Remove `PRAGMA` statements
   - Convert `INTEGER PRIMARY KEY AUTOINCREMENT` to `SERIAL PRIMARY KEY` or use `GENERATED ALWAYS AS IDENTITY`

2. **Fix data types**:
   - SQLite's `TEXT` → PostgreSQL's `VARCHAR` or `TEXT`
   - SQLite's `INTEGER` → PostgreSQL's `INTEGER` or `BIGINT`
   - SQLite's `REAL` → PostgreSQL's `NUMERIC` or `DECIMAL`

### Step 3: Import to Render PostgreSQL

After deployment, connect to your Render PostgreSQL database:

1. **Get connection details** from Render dashboard:
   - Go to your `tastyfood-db` service
   - Copy the "Internal Database URL" or connection string

2. **Import using psql** (if you have PostgreSQL client):
   ```bash
   psql "your-render-postgresql-connection-string" < converted_database.sql
   ```

3. **Or use a database tool** like:
   - pgAdmin
   - DBeaver
   - TablePlus
   - Connect via Render's database dashboard

## Option 3: Use a Migration Script (Automated)

I can create a Python script that:
1. Reads from your SQLite database
2. Connects to Render PostgreSQL
3. Migrates all data automatically

Would you like me to create this script?

## Important Notes

⚠️ **Data Order Matters**: Import in this order to respect foreign keys:
1. `item_categories`
2. `menu_items`
3. `employees`
4. `login_credentials`
5. `drivers`
6. `delivery_address`
7. `orders`
8. `order_items`

⚠️ **Passwords**: If you have hashed passwords in SQLite, they should work in PostgreSQL if using the same hashing algorithm.

⚠️ **Auto-increment IDs**: PostgreSQL will generate new IDs. If you have foreign key relationships, you may need to update them.

⚠️ **Timestamps**: SQLite stores timestamps differently than PostgreSQL. You may need to convert them.

## Quick Migration Checklist

- [ ] Export SQLite data
- [ ] Convert SQL syntax for PostgreSQL
- [ ] Deploy application to Render
- [ ] Get PostgreSQL connection string from Render
- [ ] Import data to PostgreSQL
- [ ] Verify data in application UI
- [ ] Test login with existing credentials

## Need Help?

If you want me to create an automated migration script, let me know and I'll create a Python script that handles the conversion automatically.

