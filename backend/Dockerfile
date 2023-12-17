FROM gradle:jdk17 as builder
WORKDIR /app
ADD . /app
RUN gradle build --stacktrace
RUN bash -c "ls -lah /app/build/libs"

FROM openjdk:17-oracle
EXPOSE 8080
WORKDIR /app
COPY --from=builder /app/build/libs/app-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar","app.jar"]