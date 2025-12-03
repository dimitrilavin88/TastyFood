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
        logger.info("Connecting to SQLite database: {}", dataSourceUrl);
        
        return DataSourceBuilder.create()
                .url(dataSourceUrl)
                .driverClassName(driverClassName)
                .build();
    }
}
