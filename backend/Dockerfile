FROM eclipse-temurin:21-jdk AS build

WORKDIR /workspace/app

# Copy maven executable to the image
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make the mvnw script executable
RUN chmod +x ./mvnw

# Build all the dependencies in preparation to go offline
RUN ./mvnw dependency:go-offline -B

# Copy the project source
COPY src src

# Package the application
RUN ./mvnw package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

# Second stage: minimal runtime
FROM eclipse-temurin:21-jre

VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency

# Copy the dependency application file from build stage
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

# Set the entry point
ENTRYPOINT ["java","-cp","app:app/lib/*","com.vn.ptit.duongvct.LoadTestingApplication"]