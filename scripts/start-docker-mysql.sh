#!/bin/sh

USER="letterbox"
PASSWORD="XdC5tpJYNRKUYh3MtckL9awbQzTDA3wR"
HOST_ADDRESS="$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p' | head -n 1)"

$(dirname $0)/echorun docker run --name letterbox-db -d \
    -e MYSQL_ROOT_PASSWORD="$PASSWORD" \
    -p 33060:3306 \
    mysql:5.7

$(dirname $0)/echorun docker run --name letterbox-db-admin -d \
    -e PMA_ARBITRARY=1 \
    -p 33070:80 \
    phpmyadmin