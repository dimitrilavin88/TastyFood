#!/usr/bin/env node

/**
 * Helper script to convert Supabase connection string to JDBC format
 * 
 * Usage: node convert-supabase-url.js "postgres://user:pass@host:port/db"
 */

const url = process.argv[2];

if (!url) {
    console.error('Usage: node convert-supabase-url.js "postgres://user:pass@host:port/db"');
    process.exit(1);
}

try {
    // Parse the postgres:// URL
    const match = url.match(/^postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/);
    
    if (!match) {
        throw new Error('Invalid postgres:// URL format');
    }
    
    const [, username, password, host, port, database] = match;
    
    // URL decode password if needed
    const decodedPassword = decodeURIComponent(password);
    
    // Build JDBC URL
    const jdbcUrl = `jdbc:postgresql://${host}:${port}/${database}?user=${username}&password=${decodedPassword}&sslmode=require`;
    
    console.log('\n✅ Converted JDBC URL:');
    console.log(jdbcUrl);
    console.log('\nUse this as your DATABASE_URL environment variable in Railway.\n');
    
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}

