# Multi-stage Dockerfile: build React (Vite) app, then serve with NGINX

# ---------- Builder stage ----------
FROM node:20-alpine AS builder

# Work inside the actual Vite app directory
WORKDIR /app/eqforecast-site

# Build-time args for env injection
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Install deps first (better layer caching)
COPY eqforecast-site/package*.json ./

RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

# Copy the app source and build
COPY eqforecast-site .

# Write env file if args are provided (Vite reads .env.* at build time)
RUN if [ -n "$VITE_SUPABASE_URL" ] && [ -n "$VITE_SUPABASE_ANON_KEY" ]; then \
      printf "VITE_SUPABASE_URL=%s\nVITE_SUPABASE_ANON_KEY=%s\n" "$VITE_SUPABASE_URL" "$VITE_SUPABASE_ANON_KEY" > .env.production; \
    fi

# Vite/React build output goes to dist
RUN npm run build


# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runtime

# Copy custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to NGINX html directory
COPY --from=builder /app/eqforecast-site/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]


