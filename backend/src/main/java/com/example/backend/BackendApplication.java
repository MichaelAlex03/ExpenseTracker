package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.load();

        System.setProperty("spring.datasource.url", dotenv.get("SPRING_DATASOURCE_URL"));
        System.setProperty("spring.datasource.username", dotenv.get("SPRING_DATASOURCE_USERNAME"));
        System.setProperty("spring.datasource.password", dotenv.get("SPRING_DATASOURCE_PASSWORD"));

        System.setProperty("security.jwt.accessSecret", dotenv.get("ACCESS_TOKEN_SECRET"));
        System.setProperty("security.jwt.refreshSecret", dotenv.get("REFRESH_TOKEN_SECRET"));

        SpringApplication.run(BackendApplication.class, args);
    }

}
