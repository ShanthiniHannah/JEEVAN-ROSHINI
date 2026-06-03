# ─────────────────────────────────────────────────
# Stage 1: build — install deps and compile assets
# ─────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency manifests first (layer cache optimisation)
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────
# Stage 2: dev — for local development with Vite HMR
# ─────────────────────────────────────────────────
FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ─────────────────────────────────────────────────
# Stage 3: production — serve compiled static assets
# ─────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g serve --silent

COPY --from=build /app/dist ./dist

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
