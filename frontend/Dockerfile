# Cherry Tree frontend: Vite dev server, as used by docker-compose.yml
# (which bind-mounts ./frontend for live reload).
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]
