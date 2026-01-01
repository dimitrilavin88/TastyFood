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
    
    @Value("${spring.datasource.url}")
    private String dataSourceUrl;
    
    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;
    
    @Bean
    @Primary
    public DataSource dataSource() {
        // Convert postgresql:// to jdbc:postgresql:// if needed (for Render)
        String jdbcUrl = dataSourceUrl;
        if (jdbcUrl != null && jdbcUrl.startsWith("postgresql://")) {
            jdbcUrl = "jdbc:" + jdbcUrl;
            logger.info("Converted PostgreSQL URL to JDBC format");
        }
        
        logger.info("Connecting to database: {}", jdbcUrl.replaceAll(":[^:@]+@", ":****@"));
        
        return DataSourceBuilder.create()
                .url(jdbcUrl)
                .driverClassName(driverClassName)
                .build();
    }
}
