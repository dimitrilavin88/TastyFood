#!/usr/bin/env python3
"""
SQLite to PostgreSQL Migration Script for TastyFood
This script exports data from SQLite and generates PostgreSQL-compatible INSERT statements
"""

import sqlite3
import sys
from datetime import datetime

def escape_string(value):
    """Escape single quotes for SQL"""
    if value is None:
        return 'NULL'
    return "'" + str(value).replace("'", "''") + "'"

def format_value(value, column_type):
    """Format value based on column type"""
    if value is None:
        return 'NULL'
    
    # Handle timestamps (convert from milliseconds to seconds for PostgreSQL)
    if 'timestamp' in column_type.lower() or 'time' in column_type.lower():
        if isinstance(value, (int, float)):
            # SQLite stores as milliseconds, PostgreSQL expects seconds
            return f"to_timestamp({value / 1000.0})"
        return escape_string(value)
    
    # Handle booleans
    if isinstance(value, bool):
        return 'TRUE' if value else 'FALSE'
    if isinstance(value, int) and column_type.lower() in ['boolean', 'bool']:
        return 'TRUE' if value == 1 else 'FALSE'
    
    # Handle numbers
    if isinstance(value, (int, float)):
        return str(value)
    
    # Handle strings
    return escape_string(value)

def export_table(cursor, table_name, output_file):
    """Export a table's data to PostgreSQL INSERT statements"""
    try:
        # Get table schema
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        
        if not columns:
            print(f"Warning: Table {table_name} not found or empty")
            return
        
        # Get column names and types
        col_names = [col[1] for col in columns]
        col_types = {col[1]: col[2] for col in columns}
        
        # Fetch all data
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        
        if not rows:
            print(f"Info: Table {table_name} is empty")
            return
        
        # Write INSERT statements
        output_file.write(f"\n-- Data for table: {table_name}\n")
        output_file.write(f"-- {len(rows)} rows\n\n")
        
        for row in rows:
            values = []
            for i, value in enumerate(row):
                col_name = col_names[i]
                col_type = col_types.get(col_name, 'TEXT')
                formatted_value = format_value(value, col_type)
                values.append(formatted_value)
            
            columns_str = ', '.join(col_names)
            values_str = ', '.join(values)
            output_file.write(f"INSERT INTO {table_name} ({columns_str}) VALUES ({values_str});\n")
        
        print(f"✓ Exported {len(rows)} rows from {table_name}")
        
    except Exception as e:
        print(f"✗ Error exporting {table_name}: {e}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python migrate_sqlite_to_postgres.py <sqlite_db_path> [output_file]")
        print("Example: python migrate_sqlite_to_postgres.py TastyFoodFinal.db postgres_migration.sql")
        sys.exit(1)
    
    sqlite_db = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'postgres_migration.sql'
    
    try:
        # Connect to SQLite
        conn = sqlite3.connect(sqlite_db)
        cursor = conn.cursor()
        
        # Get all table names
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
        tables = [row[0] for row in cursor.fetchall()]
        
        print(f"Found {len(tables)} tables: {', '.join(tables)}\n")
        
        # Open output file
        with open(output_file, 'w') as f:
            f.write(f"-- PostgreSQL Migration Script\n")
            f.write(f"-- Generated from SQLite database: {sqlite_db}\n")
            f.write(f"-- Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"-- \n")
            f.write(f"-- IMPORTANT: Run this AFTER creating tables (using Hibernate or manual schema)\n")
            f.write(f"-- \n\n")
            
            # Export each table
            for table in tables:
                export_table(cursor, table, f)
        
        conn.close()
        
        print(f"\n✓ Migration script created: {output_file}")
        print(f"\nNext steps:")
        print(f"1. Deploy your backend to Railway (tables will be created by Hibernate)")
        print(f"2. Or manually create tables using your JPA entities")
        print(f"3. Run the SQL in {output_file} in Railway's PostgreSQL database")
        
    except FileNotFoundError:
        print(f"Error: SQLite database file '{sqlite_db}' not found")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

