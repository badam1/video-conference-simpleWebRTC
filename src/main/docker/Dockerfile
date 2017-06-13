FROM java:8-jre
EXPOSE 80 443
#install Spring Boot artifact
ADD video_chat-0.0.1-SNAPSHOT.jar video_chat.jar
ADD ./cert/keystore.p12 /cert/keystore.p12
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/video_chat.jar"]