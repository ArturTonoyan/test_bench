# Инструкция по развертыванию на Vercel

## Быстрый старт

1. **Подключение репозитория к Vercel**
   - Перейдите на [vercel.com](https://vercel.com)
   - Импортируйте ваш репозиторий `test_bench_2`

2. **Настройка Root Directory (ВАЖНО!)**
   В настройках проекта Vercel:
   - Перейдите в **Settings** → **General**
   - Найдите секцию **Root Directory**
   - Выберите **Edit** и укажите: `front`
   - Сохраните изменения

3. **Настройка переменных окружения**
   В настройках проекта Vercel → **Environment Variables** добавьте:
   - `REACT_APP_API_URL` - URL вашего бэкенд API
     - Пример: `https://your-backend-api.railway.app` или другой хостинг

4. **Настройки сборки в Vercel Dashboard** (опционально, если Root Directory не работает)
   - **Framework Preset**: Create React App
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

**Примечание:** После настройки Root Directory на `front`, Vercel будет использовать `front/vercel.json` вместо корневого `vercel.json`.

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

### Ошибка 404: NOT_FOUND
**Решение:**
1. Убедитесь, что в настройках проекта указан **Root Directory: `front`**
2. Проверьте, что файл `front/vercel.json` существует
3. Убедитесь, что `front/build` директория создается после сборки
4. Проверьте логи сборки в Vercel Dashboard

### Ошибка сборки
- Убедитесь, что Root Directory установлен на `front`
- Проверьте, что все зависимости установлены
- Проверьте логи сборки в Vercel Dashboard

### CORS ошибки
- Убедитесь, что `FRONTEND_URL` на бэкенде содержит URL Vercel домена
- Проверьте, что бэкенд разрешает запросы с вашего Vercel домена

### API не работает
- Проверьте переменную `REACT_APP_API_URL` в настройках Vercel
- Убедитесь, что бэкенд развернут и доступен
- Проверьте, что переменная окружения установлена для нужного окружения (Production, Preview, Development)

