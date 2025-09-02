#베이스 이미지로 Java 17 사용
FROM openjdk:17-jdk-slim

# JAR 파일이 저장될 경로 인자로 받음
ARG JAR_FILE=build/libs/*.jar

# 위 경로의 JAR 파일을 app.jar 이름으로 컨테이너 내부 복사
COPY ${JAR_FILE} app.jar

# 컨테이너가 시작될 때 실행할 명령어
ENTRYPOINT ["java", "-jar", "/app.jar"]