#!/usr/bin/env python3
"""
SQLite to PostgreSQL Migration Script for TastyFood
This script migrates data from your local SQLite database to Render's PostgreSQL database.
"""

import sqlite3
import psycopg2
import sys
from psycopg2.extras import execute_values
import os

# Configuration
SQLITE_DB_PATH = 'TastyFoodFinal.db'  # Update if your SQLite file is elsewhere
POSTGRES_CONNECTION_STRING = os.getenv('POSTGRES_CONNECTION_STRING', '')

# Tables to migrate in order (respecting foreign key constraints)
TABLES = [
    'item_categories',
    'menu_items',
    'employees',
    'login_credentials',
    'drivers',
    'delivery_address',
    'orders',
    'order_items'
]

def connect_sqlite():
    """Connect to SQLite database"""
    if not os.path.exists(SQLITE_DB_PATH):
        print(f"Error: SQLite database not found at {SQLITE_DB_PATH}")
        print("Please update SQLITE_DB_PATH in the script or move your database file.")
        sys.exit(1)
    
    conn = sqlite3.connect(SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def connect_postgres():
    """Connect to PostgreSQL database"""
    if not POSTGRES_CONNECTION_STRING:
        print("Error: POSTGRES_CONNECTION_STRING environment variable not set")
        print("\nTo get your connection string:")
        print("1. Go to your Render dashboard")
        print("2. Open your 'tastyfood-db' service")
        print("3. Copy the 'Internal Database URL' or 'Connection String'")
        print("4. Set it as: export POSTGRES_CONNECTION_STRING='your-connection-string'")
        sys.exit(1)
    
    try:
        conn = psycopg2.connect(POSTGRES_CONNECTION_STRING)
        return conn
    except Exception as e:
        print(f"Error connecting to PostgreSQL: {e}")
        sys.exit(1)

def get_table_columns(cursor, table_name):
    """Get column names for a table"""
    cursor.execute(f"PRAGMA table_info({table_name})")
    return [row[1] for row in cursor.fetchall()]

def migrate_table(sqlite_conn, postgres_conn, table_name):
    """Migrate a single table from SQLite to PostgreSQL"""
    print(f"\nMigrating {table_name}...")
    
    sqlite_cursor = sqlite_conn.cursor()
    postgres_cursor = postgres_conn.cursor()
    
    # Check if table exists in SQLite
    sqlite_cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
        (table_name,)
    )
    if not sqlite_cursor.fetchone():
        print(f"  ⚠️  Table {table_name} not found in SQLite, skipping...")
        return
    
    # Get all data from SQLite
    sqlite_cursor.execute(f"SELECT * FROM {table_name}")
    rows = sqlite_cursor.fetchall()
    
    if not rows:
        print(f"  ℹ️  Table {table_name} is empty, skipping...")
        return
    
    # Get column names
    columns = get_table_columns(sqlite_cursor, table_name)
    column_names = ', '.join(columns)
    placeholders = ', '.join(['%s'] * len(columns))
    
    # Clear existing data in PostgreSQL (optional - comment out if you want to keep existing data)
    try:
        postgres_cursor.execute(f"TRUNCATE TABLE {table_name} CASCADE")
        print(f"  🗑️  Cleared existing data in {table_name}")
    except Exception as e:
        print(f"  ⚠️  Could not clear {table_name} (might not exist yet): {e}")
    
    # Prepare data for insertion
    data_to_insert = []
    for row in rows:
        row_data = []
        for col in columns:
            value = row[col]
            # Handle None values and convert types if needed
            if value is None:
                row_data.append(None)
            else:
                row_data.append(value)
        data_to_insert.append(tuple(row_data))
    
    # Insert data
    insert_query = f"INSERT INTO {table_name} ({column_names}) VALUES {placeholders}"
    
    try:
        # Use execute_values for bulk insert (more efficient)
        execute_values(
            postgres_cursor,
            f"INSERT INTO {table_name} ({column_names}) VALUES %s",
            data_to_insert
        )
        postgres_conn.commit()
        print(f"  ✅ Migrated {len(data_to_insert)} rows to {table_name}")
    except Exception as e:
        postgres_conn.rollback()
        print(f"  ❌ Error migrating {table_name}: {e}")
        print(f"     You may need to manually fix the data or table structure")
        raise

def main():
    """Main migration function"""
    print("=" * 60)
    print("TastyFood Database Migration: SQLite → PostgreSQL")
    print("=" * 60)
    
    # Connect to databases
    print("\n📦 Connecting to databases...")
    sqlite_conn = connect_sqlite()
    postgres_conn = connect_postgres()
    print("  ✅ Connected to both databases")
    
    # Migrate each table
    print("\n🚀 Starting migration...")
    for table in TABLES:
        try:
            migrate_table(sqlite_conn, postgres_conn, table)
        except Exception as e:
            print(f"\n❌ Migration failed for {table}")
            print(f"   Error: {e}")
            print("\nYou may need to:")
            print("1. Check that the PostgreSQL database schema exists")
            print("2. Verify data types match between SQLite and PostgreSQL")
            print("3. Check foreign key constraints")
            break
    
    # Close connections
    sqlite_conn.close()
    postgres_conn.close()
    
    print("\n" + "=" * 60)
    print("✅ Migration complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Verify data in your Render application")
    print("2. Test login with existing credentials")
    print("3. Check that menu items and categories are visible")

if __name__ == '__main__':
    main()

