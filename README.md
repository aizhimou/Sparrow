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

### Run with JAR


## Development