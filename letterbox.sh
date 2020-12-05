#!/bin/sh

if [ -z "$AS_JOB" ]; then
    npm start
else
    npm run job
fi