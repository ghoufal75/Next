FROM node:20-alpine3.17
WORKDIR /app
RUN npm install -g @ionic/cli
ENTRYPOINT [ "ionic" ]
