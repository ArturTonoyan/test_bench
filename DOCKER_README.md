# Инструкция по развертыванию в Docker

## Требования
- Docker
- Docker Compose

## Быстрый старт

1. **Создайте файл `.env` в корне проекта:**
   ```env
   FRONTEND_URL=http://localhost:80
   REACT_APP_API_URL=http://localhost:3001
   ```

2. **Соберите и запустите контейнеры:**
   ```bash
   docker-compose up -d --build
   ```

3. **Приложение будет доступно:**
   - Frontend: http://localhost
   - Backend API: http://localhost:3001

**Важно:** Без файла `.env` приложение может не работать корректно, так как переменные окружения обязательны.

## Команды управления

### Остановить контейнеры:
```bash
docker-compose down
```

### Просмотр логов:
```bash
# Все сервисы
docker-compose logs -f

# Только backend
docker-compose logs -f backend

# Только frontend
docker-compose logs -f frontend
```

### Пересобрать контейнеры:
```bash
docker-compose up -d --build
```

### Остановить и удалить контейнеры с volumes:
```bash
docker-compose down -v
```

## Настройка переменных окружения

**Обязательно** создайте файл `.env` в корне проекта:

```env
# Frontend URL for CORS (comma-separated for multiple origins)
# URL, который будет виден в браузере пользователя
FRONTEND_URL=http://localhost:80

# React App API URL
# URL бэкенд API, доступный из браузера пользователя
REACT_APP_API_URL=http://localhost:3001
```

**Важно:** 
- `FRONTEND_URL` - это URL фронтенда для настройки CORS на бэкенде (должен быть доступен из браузера)
- `REACT_APP_API_URL` - это URL бэкенда, который будет использоваться в React приложении (должен быть доступен из браузера)
- Для продакшена замените `localhost` на ваши реальные домены

## Настройка для продакшена

Для развертывания на сервере создайте файл `.env` с вашими доменами:

```env
FRONTEND_URL=https://your-domain.com
REACT_APP_API_URL=https://api.your-domain.com
```

Или измените переменные окружения в `docker-compose.yml` напрямую.

## Структура

- `back/Dockerfile` - Dockerfile для NestJS backend
- `front/Dockerfile` - Dockerfile для React frontend
- `front/nginx.conf` - Конфигурация Nginx для frontend
- `docker-compose.yml` - Оркестрация контейнеров

## Порты

- Frontend: 80 (nginx)
- Backend: 3001

Если порты заняты, измените их в `docker-compose.yml` в секции `ports`.

