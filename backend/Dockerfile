# First stage: Build the application
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy Maven wrapper and dependencies
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN chmod +x ./mvnw

# Build the dependencies first
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the project
RUN ./mvnw package -DskipTests

# Second stage: Create a slim runtime image
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the build jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Create required directories
RUN mkdir -p /app/jmeter/test-plans /app/jmeter/jtls /app/jmeter/jmx /app/jmeter/results

# Add a startup script that includes workarounds for JMeter DSL in Docker
RUN echo '#!/bin/sh\n\
exec java \
-Djava.security.properties=/dev/null \
-Djava.protocol.handler.pkgs=org.springframework.boot.loader \
-Dloader.path=/app/resources,/app/classes,/app/libs \
-jar app.jar\
' > /app/entrypoint.sh && chmod +x /app/entrypoint.sh

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=docker
ENV LANG=C.UTF-8

EXPOSE 8080
ENTRYPOINT ["/app/entrypoint.sh"]