#!/bin/sh

$(dirname $0)/echorun docker run --name letterbox-mq -d \
    --hostname letterbox-mq \
    -p 33080:5672 \
    -p 33090:15672 \
    rabbitmq:3-management
