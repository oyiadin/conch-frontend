FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
COPY dist/ /usr/share/nginx/html
