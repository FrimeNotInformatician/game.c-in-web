# Utiliser Node.js 23 basé sur Alpine Linux
FROM node:23-alpine

# Définir le répertoire de travail
WORKDIR /app

# Installer les paquets nécessaires pour certaines dépendances npm
RUN apk add --no-cache python3 make g++

# Copier package.json et package-lock.json avant d'installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le reste du projet
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application
CMD ["node", "index.js"]
