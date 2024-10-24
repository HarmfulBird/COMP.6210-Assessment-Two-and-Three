# Stage 1: Build
FROM node:lts-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the app
FROM node:lts-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

# Run the app
CMD ["serve", "-s", "dist"]
