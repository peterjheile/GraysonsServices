FROM node:22-alpine

# App directory
WORKDIR /frontend

# Copy node project dependencies
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

CMD ["sh"]