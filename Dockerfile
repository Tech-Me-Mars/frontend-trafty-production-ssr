# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm (or use npm/yarn, ปรับตามโปรเจคคุณ)
RUN corepack enable

# Copy only package files for caching dependencies
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the code
COPY . .

# Build nuxt app (SSR)
RUN pnpm run build

# --- Production Stage ---
FROM node:20-alpine

WORKDIR /app

# Copy package.json and pnpm-lock.yaml for pnpm install --prod
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install only production dependencies
RUN corepack enable && pnpm install --prod

# Copy built files from builder
COPY --from=builder /app/.output ./.output

# Optionally: copy static files, public, etc. if needed

EXPOSE 3000

# Use node entrypoint for Nuxt 3 SSR
CMD ["node", ".output/server/index.mjs"]
