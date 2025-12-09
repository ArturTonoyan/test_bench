# Vercel Deployment Configuration

## Настройка проекта для развертывания на Vercel

Этот проект настроен для развертывания на Vercel.

### Структура проекта

- `front/` - React приложение (Create React App)
- `back/` - NestJS backend (не развертывается на Vercel, требуется отдельный хостинг)

### Переменные окружения

В настройках проекта Vercel необходимо добавить следующие переменные окружения:

1. **REACT_APP_API_URL** - URL бэкенд API
   - Для production: URL вашего развернутого бэкенда
   - Пример: `https://your-backend-api.vercel.app` или `https://api.yourdomain.com`

### Настройка в Vercel Dashboard

1. Подключите репозиторий к Vercel
2. В настройках проекта:
   - **Root Directory**: оставьте пустым (корень проекта)
   - **Framework Preset**: Create React App (автоопределение)
   - **Build Command**: `cd front && npm install && npm run build`
   - **Output Directory**: `front/build`
   - **Install Command**: `cd front && npm install`

3. Добавьте переменные окружения:
   - `REACT_APP_API_URL` = URL вашего бэкенд API

### Примечания

- Фронтенд будет развернут как статический сайт
- Бэкенд (NestJS) требует отдельного развертывания (например, на Railway, Render, или другом сервисе)
- Убедитесь, что CORS настроен на бэкенде для работы с доменом Vercel

