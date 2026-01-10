# Используем официальный Nginx образ
FROM nginx:alpine

# Удаляем стандартную конфигурацию Nginx (опционально)
RUN rm /etc/nginx/conf.d/default.conf

# Копируем собственный конфигурационный файл (если нужен)
# COPY nginx.conf /etc/nginx/conf.d

# Копируем содержимое папки dist в директорию, откуда Nginx раздает файлы
COPY dist/bot-admin-panel/browser /usr/share/nginx/html

# Открываем порты (80 для HTTP и 443 для HTTPS)
EXPOSE 80
EXPOSE 443

# Команда запуска Nginx
CMD ["nginx", "-g", "daemon off;"]