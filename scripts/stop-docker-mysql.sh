#!/bin/sh

$(dirname $0)/echorun docker stop letterbox-db letterbox-db-admin
$(dirname $0)/echorun docker rm letterbox-db letterbox-db-admin