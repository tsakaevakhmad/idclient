FROM node:20

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем всё приложение
COPY . .

# Открываем порт CRA
EXPOSE 3000

# Запускаем dev-сервер
CMD ["npm", "start"]