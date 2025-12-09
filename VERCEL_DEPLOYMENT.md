# Инструкция по развертыванию на Vercel

## Быстрый старт

1. **Подключение репозитория к Vercel**
   - Перейдите на [vercel.com](https://vercel.com)
   - Импортируйте ваш репозиторий `test_bench_2`
   - Vercel автоматически определит настройки из `vercel.json`

2. **Настройка переменных окружения**
   В настройках проекта Vercel добавьте:
   - `REACT_APP_API_URL` - URL вашего бэкенд API
     - Пример: `https://your-backend-api.railway.app` или другой хостинг

3. **Настройки сборки в Vercel Dashboard**
   - **Root Directory**: оставьте пустым (корень проекта)
   - **Framework Preset**: Create React App (автоопределяется)
   - **Build Command**: `cd front && npm install && npm run build`
   - **Output Directory**: `front/build`
   - **Install Command**: `cd front && npm install`

## Структура проекта

```
test_bench/
├── front/          # React приложение (развертывается на Vercel)
├── back/           # NestJS API (требует отдельного хостинга)
├── vercel.json     # Конфигурация Vercel
└── package.json    # Корневой package.json для монoreпо
```

## Важные замечания

### Фронтенд
- ✅ Развертывается на Vercel как статический сайт
- ✅ React Router настроен для SPA (Single Page Application)
- ✅ Все маршруты перенаправляются на `index.html`

### Бэкенд
- ⚠️ NestJS требует отдельного развертывания
- Рекомендуемые платформы:
  - [Railway](https://railway.app)
  - [Render](https://render.com)
  - [Fly.io](https://fly.io)
  - [Heroku](https://heroku.com)

### CORS
Бэкенд настроен для работы с:
- Локальным окружением (`http://localhost:3000`)
- Доменами Vercel (`.vercel.app`)
- Доменами, указанными в переменной `FRONTEND_URL`

## Переменные окружения

### Фронтенд (Vercel)
- `REACT_APP_API_URL` - URL бэкенд API

### Бэкенд (отдельный хостинг)
- `PORT` - Порт сервера (по умолчанию: 3001)
- `FRONTEND_URL` - URL фронтенда для CORS (можно указать несколько через запятую)

## Проверка развертывания

После развертывания проверьте:
1. ✅ Фронтенд доступен по URL Vercel
2. ✅ API запросы работают (проверьте в DevTools → Network)
3. ✅ CORS настроен правильно на бэкенде

## Troubleshooting

### Ошибка сборки
- Убедитесь, что `Build Command` указывает на `front/` директорию
- Проверьте, что все зависимости установлены

### CORS ошибки
- Убедитесь, что `FRONTEND_URL` на бэкенде содержит URL Vercel домена
- Проверьте, что бэкенд разрешает запросы с вашего Vercel домена

### API не работает
- Проверьте переменную `REACT_APP_API_URL` в настройках Vercel
- Убедитесь, что бэкенд развернут и доступен

