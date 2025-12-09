# Инструкция по развертыванию в Docker

## Требования
- Docker
- Docker Compose

## Быстрый старт

1. **Соберите и запустите контейнеры:**
   ```bash
   docker-compose up -d --build
   ```

2. **Приложение будет доступно:**
   - Frontend: http://localhost
   - Backend API: http://localhost:3001

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

## Настройка для продакшена

Для развертывания на сервере измените переменные окружения в `docker-compose.yml`:

```yaml
environment:
  - FRONTEND_URL=http://your-domain.com
```

И в секции build frontend:
```yaml
args:
  - REACT_APP_API_URL=http://your-domain.com:3001
```

## Структура

- `back/Dockerfile` - Dockerfile для NestJS backend
- `front/Dockerfile` - Dockerfile для React frontend
- `front/nginx.conf` - Конфигурация Nginx для frontend
- `docker-compose.yml` - Оркестрация контейнеров

## Порты

- Frontend: 80 (nginx)
- Backend: 3001

Если порты заняты, измените их в `docker-compose.yml` в секции `ports`.

