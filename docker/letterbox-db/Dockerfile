FROM mysql:5.7

COPY letterbox-init.sql /docker-entrypoint-initdb.d/

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 3306 33060
CMD ["mysqld"]