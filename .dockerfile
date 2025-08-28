# Use official Node.js runtime
FROM node:20-alpine AS builder

# Set working dir
WORKDIR /app

# Install deps
COPY package*.json tsconfig.json ./
RUN npm install

# Copy source and build
COPY src ./src
RUN npm run build

# ---- Runtime image ----
FROM node:20-alpine
WORKDIR /app

# Copy built files and only needed packages
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# Start the app
CMD ["node", "dist/main.js"]
