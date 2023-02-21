FROM node:18.14-alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]