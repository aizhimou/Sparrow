# !/bin/bash

# This script runs the Sparrow application in a standalone Java environment.
# Make sure you have Java installed and the Sparrow JAR file is available in the current directory.
# Make sure to replace the placeholders with your actual values.

java -jar sparrow-<version>.jar \
 -Dspring.datasource.url=jdbc:mysql://${your_mysql_host}:${your_mysql_port}/${your_database_name}?useUnicode=true&characterEncoding=UTF-8 \
 -Dspring.datasource.username=${your_mysql_username} \
 -Dspring.datasource.password=${your_mysql_password}