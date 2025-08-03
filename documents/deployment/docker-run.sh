# !/bin/bash

# This script runs the Sparrow application in a Docker container.
# Make sure to replace the placeholders with your actual values.

docker run -d \
 --name sparrow \
 -p ${your_host_port}:8080 \
 -e "SPRING_DATASOURCE_URL=jdbc:mysql://${your_mysql_host}:${your_mysql_port}/${your_database_name}?useUnicode=true&characterEncoding=UTF-8" \
 -e "SPRING_DATASOURCE_USERNAME=${your_mysql_username}" \
 -e "SPRING_DATASOURCE_PASSWORD=${your_mysql_password}" \
 ghcr.io/aizhimou/sparrow:main