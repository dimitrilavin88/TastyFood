package com.tastyfood.backend;

import com.tastyfood.backend.service.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class TastyFoodApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(TastyFoodApplication.class, args);
    }
}
