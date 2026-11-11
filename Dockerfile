FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Expose both 7860 (Hugging Face default) and 8080 (standard PaaS)
EXPOSE 7860
EXPOSE 8080

CMD ["npm", "start"]
