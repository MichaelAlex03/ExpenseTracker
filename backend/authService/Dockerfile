# Use a builder image to compile the app
FROM gradle:8.4-jdk17 AS builder

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the Spring Boot JAR
RUN gradle clean bootJar --no-daemon

# Use a minimal JRE image to run the app
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose port 8080 (default Spring Boot port)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
