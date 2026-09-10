# Stage 1: Build stage (installs dependencies)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# Stage 2: Production stage (copies only necessary production files)
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy node_modules and application source code from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY server.js ./
COPY public/ ./public

EXPOSE 3000
CMD ["npm", "start"]
