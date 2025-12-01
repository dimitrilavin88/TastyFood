package com.tastyfood.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);
    
    @Value("${spring.datasource.url:}")
    private String dataSourceUrl;
    
    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;
    
    @Bean
    @Primary
    public DataSource dataSource() {
        if (dataSourceUrl == null || dataSourceUrl.isEmpty() || dataSourceUrl.contains("your-")) {
            logger.error("SQLite Cloud connection URL is not properly configured!");
            logger.error("Please set the SQLITE_CLOUD_URL environment variable or update application.properties with your cloud SQLite connection string.");
            logger.error("Format: jdbc:sqlite:sqlitecloud://host:port/database?apikey=your-api-key");
            throw new IllegalStateException("SQLite Cloud connection URL must be configured to connect to database");
        }
        
        logger.info("Connecting to SQLite Cloud database: {}", maskUrl(dataSourceUrl));
        
        return DataSourceBuilder.create()
                .url(dataSourceUrl)
                .driverClassName(driverClassName)
                .build();
    }
    
    private String maskUrl(String url) {
        // Mask sensitive information like tokens and API keys in the URL for logging
        if (url == null) return "null";
        String masked = url.replaceAll("(token|password|authToken|apikey)=[^&\\s]*", "$1=***");
        return masked;
    }
}
