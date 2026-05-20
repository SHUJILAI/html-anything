FROM node:20-alpine
WORKDIR /app

# Install deps first (cache layer)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# App code
COPY server.js styles.js optimizer.js lib.js ./
COPY public ./public

# Runtime dirs (mount as volumes if you want persistence)
RUN mkdir -p data shares

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
