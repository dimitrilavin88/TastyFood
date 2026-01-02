# Database Migration Guide: SQLite to PostgreSQL

This guide will help you migrate all your existing SQLite data to PostgreSQL on Railway.

## Option 1: Automated Migration (Recommended)

### Step 1: Export Data from SQLite

1. Make sure you have Python 3 installed
2. Run the migration script:

```bash
python migrate_sqlite_to_postgres.py TastyFoodFinal.db postgres_migration.sql
```

This will create a `postgres_migration.sql` file with all your data in PostgreSQL format.

### Step 2: Create Tables in PostgreSQL

You have two options:

#### Option A: Use Hibernate to Create Tables (Easiest)

1. **Temporarily** update `backend/src/main/resources/application-prod.properties`:
   ```properties
   spring.jpa.hibernate.ddl-auto=update
   ```

2. Deploy your backend to Railway (or restart if already deployed)
   - Hibernate will automatically create all tables based on your JPA entities

3. **Important**: After tables are created, change it back:
   ```properties
   spring.jpa.hibernate.ddl-auto=none
   ```

4. Redeploy to Railway

#### Option B: Create Tables Manually

1. Go to your PostgreSQL service in Railway
2. Click on the "Query" tab
3. Create tables manually based on your JPA entities (see table structure below)

### Step 3: Import Data to PostgreSQL

1. Go to your PostgreSQL service in Railway
2. Click on the "Query" tab (or "Data" tab → "Query")
3. Copy and paste the contents of `postgres_migration.sql`
4. Click "Run" to execute all INSERT statements

### Step 4: Verify Data

1. In Railway's PostgreSQL service, go to the "Data" tab
2. Browse your tables to verify data was imported correctly
3. Check row counts match your SQLite database

## Option 2: Manual Migration

If you prefer to do it manually:

### Step 1: Export from SQLite

You can use SQLite command-line tools:

```bash
sqlite3 TastyFoodFinal.db .dump > sqlite_dump.sql
```

### Step 2: Convert SQL Statements

The SQLite dump will need manual conversion:
- Remove SQLite-specific syntax
- Convert data types (SQLite is more flexible)
- Convert timestamps (SQLite uses milliseconds, PostgreSQL uses seconds)
- Handle boolean values (SQLite uses 0/1, PostgreSQL uses TRUE/FALSE)

### Step 3: Import to PostgreSQL

Use Railway's database query interface or `psql` command-line tool.

## Important Notes

### Data Type Conversions

- **Timestamps**: SQLite stores as milliseconds (integer), PostgreSQL uses `TIMESTAMP`. The migration script converts these automatically.
- **Booleans**: SQLite uses 0/1, PostgreSQL uses TRUE/FALSE. The script handles this.
- **Strings**: Both use similar string handling, but PostgreSQL is stricter about escaping.

### Table Creation Order

If creating tables manually, create them in this order (due to foreign keys):

1. `item_categories`
2. `menu_items`
3. `employees`
4. `login_credentials`
5. `drivers`
6. `delivery_address`
7. `orders`
8. `order_items`

### Foreign Key Constraints

Make sure foreign key constraints are satisfied:
- `orders.driver_id` references `drivers.driver_id`
- `orders.address_id` references `delivery_address.address_id`
- `order_items.order_id` references `orders.order_id`
- `order_items.item_id` references `menu_items.item_id`
- `menu_items.category_id` references `item_categories.category_id`
- `login_credentials.username` references `employees.username`

## Troubleshooting

### Error: "relation does not exist"
- Tables haven't been created yet. Use Hibernate (Option A) or create them manually.

### Error: "duplicate key value violates unique constraint"
- Data already exists. You may need to clear tables first or use `INSERT ... ON CONFLICT DO NOTHING`.

### Error: "invalid input syntax for type timestamp"
- Timestamp conversion issue. Check the migration script output.

### Error: "null value in column violates not-null constraint"
- Some required fields are missing. Check your source data.

## Verification Checklist

After migration, verify:

- [ ] All tables exist in PostgreSQL
- [ ] Row counts match SQLite database
- [ ] Foreign key relationships are intact
- [ ] Can log in with existing credentials
- [ ] Menu items display correctly
- [ ] Orders can be retrieved
- [ ] All relationships work (orders → order_items, etc.)

## Quick Reference: Table Row Counts

After migration, verify these counts match your SQLite database:

```sql
SELECT 'item_categories' as table_name, COUNT(*) FROM item_categories
UNION ALL
SELECT 'menu_items', COUNT(*) FROM menu_items
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'login_credentials', COUNT(*) FROM login_credentials
UNION ALL
SELECT 'drivers', COUNT(*) FROM drivers
UNION ALL
SELECT 'delivery_address', COUNT(*) FROM delivery_address
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items;
```

## Need Help?

If you encounter issues:
1. Check Railway logs for backend errors
2. Verify environment variables are set correctly
3. Check PostgreSQL connection in Railway dashboard
4. Review the migration script output for errors

