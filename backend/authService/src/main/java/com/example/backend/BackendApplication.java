package com.example.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
 import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {

          String inDocker = System.getenv("IN_DOCKER");

          System.out.println(System.getenv("SPRING_DATASOURCE_PASSWORD"));
          System.out.println( System.getProperty("spring.datasource.url"));

          if(inDocker == null || !inDocker.equals("true")){
              Dotenv dotenv = Dotenv.load();

              System.setProperty("spring.datasource.url", dotenv.get("SPRING_DATASOURCE_URL"));
              System.setProperty("spring.datasource.username", dotenv.get("SPRING_DATASOURCE_USERNAME"));
              System.setProperty("spring.datasource.password", dotenv.get("SPRING_DATASOURCE_PASSWORD"));

              System.setProperty("security.jwt.accessSecret", dotenv.get("ACCESS_TOKEN_SECRET"));
              System.setProperty("security.jwt.refreshSecret", dotenv.get("REFRESH_TOKEN_SECRET"));

              System.setProperty("spring.security.oauth2.client.registration.google.client-id", dotenv.get("MY_GOOGLE_CLIENT_ID"));
              System.setProperty("spring.security.oauth2.client.registration.google.client-secret", dotenv.get("MY_GOOGLE_CLIENT_SECRET"));

              System.setProperty("spring.security.oauth2.client.registration.github.client-id", dotenv.get("MY_GITHUB_CLIENT_ID"));
              System.setProperty("spring.security.oauth2.client.registration.github.client-secret", dotenv.get("MY_GITHUB_CLIENT_SECRET"));
          }

        SpringApplication.run(BackendApplication.class, args);
    }

}
