# Sparrow
A lightweight fullstack starter built with Spring Boot &amp; React, perfect for tool systems, admin panels and mini apps.

## Key Features
- User login and registration
- User password reset with email verification
- Role-based access control
- Simple user management
- Configurable system settings

## Key TechStack

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

## Deployment

### Run with Docker
**You need to prepare a mysql database before you run the docker image, enter your database information in the following command, the database schema will be created automatically when the application starts.**

Replace the placeholders with your actual database details:
```bash
docker run -d \
 --name sparrow \
 -p ${your_host_port}:8080 \
 -e "SPRING_DATASOURCE_URL=jdbc:mysql://${your_mysql_host}:${your_mysql_port}/${your_database_name}?useUnicode=true&characterEncoding=UTF-8" \
 -e "SPRING_DATASOURCE_USERNAME=${your_mysql_username}" \
 -e "SPRING_DATASOURCE_PASSWORD=${your_mysql_password}" \
 ghcr.io/aizhimou/sparrow:main
```

### Run with Docker Compose
With Docker Compose, you can easily set up both the Sparrow application and a MySQL database. 

Below is a sample `docker-compose.yml` file that you can use to run Sparrow with MySQL.

```bash
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql
    restart: unless-stopped
    environment:
      # change this to your desired root password
      MYSQL_ROOT_PASSWORD: rootpassword
      # create a database named sparrow automatically
      MYSQL_DATABASE: sparrow
      # change this to your desired username
      MYSQL_USER: sparrow_user
      # change this to your desired password
      MYSQL_PASSWORD: sparrow_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - sparrow-net

  sparrow:
    image: ghcr.io/aizhimou/sparrow:main
    container_name: sparrow
    depends_on:
      - mysql
    restart: unless-stopped
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/sparrow?useUnicode=true&characterEncoding=UTF-8
      # keep the same username and password as in the mysql service
      SPRING_DATASOURCE_USERNAME: sparrow_user
      SPRING_DATASOURCE_PASSWORD: sparrow_pass
    ports:
      - "8080:8080"
    networks:
      - sparrow-net

volumes:
  mysql-data:

networks:
  sparrow-net:
```

### Run with JAR
Download the latest JAR file from the [releases page](https://github.com/aizhimou/sparrow/releases) and run it with the following command:

Make sure you have Java 17 installed on your machine. You can check your Java version with `java -version`.

Replace the placeholders with your actual database details:

```bash
java -jar sparrow-<version>.jar \
 -Dspring.datasource.url=jdbc:mysql://${your_mysql_host}:${your_mysql_port}/${your_database_name}?useUnicode=true&characterEncoding=UTF-8 \
 -Dspring.datasource.username=${your_mysql_username} \
 -Dspring.datasource.password=${your_mysql_password}
```

## Development