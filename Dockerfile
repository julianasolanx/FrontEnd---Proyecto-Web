# ==========================
# Etapa 1: build de Angular
# ==========================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar dependencias primero para aprovechar caché
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copiar el resto del proyecto
COPY . .

# Compilar Angular en modo producción
RUN npm run build -- --configuration production

# ==========================
# Etapa 2: runtime con Nginx
# ==========================
FROM nginx:1.27-alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build generado de Angular
COPY --from=build /app/dist/mi-proyecto/browser /usr/share/nginx/html

# Angular SSR genera index.csr.html en vez de index.html — sobreescribir el default de nginx
RUN cp /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
