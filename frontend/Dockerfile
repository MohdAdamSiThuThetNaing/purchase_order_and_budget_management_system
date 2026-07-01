FROM node:22-alpine

LABEL maintainer="Adam"
LABEL application="purchase-order-budget-management-system"


RUN apk add --no-cache \
    bash \
    git \
    curl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=5173

ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]