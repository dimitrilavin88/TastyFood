package com.tastyfood.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TastyFoodApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(TastyFoodApplication.class, args);
    }
}
