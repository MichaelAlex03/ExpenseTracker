package com.example.userservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class UserServiceApplication {

	public static void main(String[] args) {

		String inDocker = System.getenv("IN_DOCKER");

		if(inDocker == null || !inDocker.equals("true")){
			Dotenv dotenv = Dotenv.load();

			System.setProperty("spring.datasource.url", dotenv.get("SPRING_DATASOURCE_URL"));
			System.setProperty("spring.datasource.username", dotenv.get("SPRING_DATASOURCE_USERNAME"));
			System.setProperty("spring.datasource.password", dotenv.get("SPRING_DATASOURCE_PASSWORD"));

			System.setProperty("aws.accessKeyId", dotenv.get("AWS_ACCESS_KEY_ID"));
			System.setProperty("aws.secretKeyId", dotenv.get("AWS_SECRET_ACCESS_KEY"));
			System.setProperty("aws.region", dotenv.get("S3_REGION"));
			System.setProperty("aws.bucketName", dotenv.get("S3_BUCKET_NAME"));

		}


		SpringApplication.run(UserServiceApplication.class, args);
	}

}
