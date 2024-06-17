# Usa una imagen base de Node.js
FROM node

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package.json package-lock.json ./

# Instala las dependencias principales
RUN npm install

# Copia los archivos del proyecto
COPY . .

# Compila el frontend (Vite)
RUN turbo build

# Configuración del servidor de producción
EXPOSE 3000

# Comando para iniciar el proyecto
RUN turbo start