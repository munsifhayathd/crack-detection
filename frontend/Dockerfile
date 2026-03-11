FROM node:20-alpine

WORKDIR /app

# Install bun
RUN npm install -g bun

# Copy dependency files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy project files
COPY . .

EXPOSE 3000

# Dev server with hot reload
CMD ["bun", "run", "dev", "--hostname", "0.0.0.0"]
