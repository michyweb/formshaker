FROM node:18.16.1 as builder

COPY . /
RUN npm install && npm run build

FROM nginx

COPY --from=builder /docker/nginx.conf /etc/nginx/nginx.conf
WORKDIR /src/app/

COPY --from=builder /dist /src/app/
RUN mkdir /src/app/app
COPY --from=builder /logo.png /src/app/logo.png
RUN chmod 644 /src/app/logo.png && chmod -R 777 /var/log/nginx /var/cache/nginx /var/run \
     && chgrp -R 0 /etc/nginx \
     && chmod -R g+rwX /etc/nginx

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
