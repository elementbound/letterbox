FROM nginx:1.19

COPY nginx.conf /etc/nginx/

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]