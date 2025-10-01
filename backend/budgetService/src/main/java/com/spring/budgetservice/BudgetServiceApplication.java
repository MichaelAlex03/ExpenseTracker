package com.spring.budgetservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BudgetServiceApplication {

    public static void main(String[] args) {

        String inDocker = System.getenv("IN_DOCKER");

        if(inDocker == null || !inDocker.equals("true")){
            Dotenv dotenv = Dotenv.load();

            System.setProperty("spring.datasource.url", dotenv.get("SPRING_DATASOURCE_URL"));
            System.setProperty("spring.datasource.username", dotenv.get("SPRING_DATASOURCE_USERNAME"));
            System.setProperty("spring.datasource.password", dotenv.get("SPRING_DATASOURCE_PASSWORD"));

        }
        SpringApplication.run(BudgetServiceApplication.class, args);
    }

}
