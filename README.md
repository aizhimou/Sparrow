# Sparrow
A lightweight fullstack starter built with Spring Boot &amp; React, perfect for tool systems, admin panels and mini apps.

## 1. Key Features
- User login and registration
- User password reset with email verification
- Role-based access control
- Simple user management
- Configurable system settings

## 2. Key TechStack

### Backend
- Java 17
- [Spring Boot](https://spring.io/projects/spring-boot) 3.5.3
- [sa-token](https://github.com/dromara/Sa-Token) 1.44.0
- [mybatis-plus](https://baomidou.com/en/) 3.5.12

### Frontend
- [React](https://react.dev/) ^19.1.0
- [Vite](https://vite.dev/) ^8.2.0
- [Mantine UI](https://ui.mantine.dev/) ^8.2.1
- [Mantine DataTable](https://icflorescu.github.io/mantine-datatable/) ^8.2.0
- [tabler icons](https://tabler.io/icons) ^3.34.0

## 3. Deployment

### 3.1 Run with Docker
**You need to prepare a mysql database before you run the docker image.**

[Here](documents/deployment/docker-run.sh) is a sample `docker run command` that you can use to run Sparrow with your own MySQL.


### 3.2 Run with Docker Compose
With Docker Compose, you can easily set up both the Sparrow application and a MySQL database. 

[Here](documents/deployment/docker-compose.yml) is a sample `docker-compose.yml` file that you can use to run Sparrow.


### 3.3 Run with JAR
**Make sure you have Java 17 installed on your machine.**

Download the latest JAR file from the [releases page](https://github.com/aizhimou/sparrow/releases) and run it with [this](documents/deployment/jar-run.sh) command.


## 4. Development