# Imagen base oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos del proyecto
COPY package*.json ./
COPY . .

# Instalar dependencias
RUN npm install

# Exponer el puerto en el que corre el servidor (ajustar si usas otro)
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "start"]
