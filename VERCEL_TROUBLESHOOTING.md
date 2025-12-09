# Диагностика ошибки 404 NOT_FOUND на Vercel

Согласно [официальной документации Vercel](https://vercel.com/docs/errors/NOT_FOUND), ошибка `404: NOT_FOUND` возникает когда запрашиваемый ресурс не найден.

## Пошаговая диагностика

### Шаг 1: Проверка URL развертывания ✅
- Убедитесь, что URL корректен и не содержит опечаток
- Проверьте, что вы используете правильный домен Vercel
- Убедитесь, что deployment не был удален

### Шаг 2: Проверка существования deployment ✅
- Откройте Vercel Dashboard → Deployments
- Убедитесь, что deployment существует и имеет статус "Ready"
- Проверьте, что deployment не был удален или не истек срок его хранения

### Шаг 3: Просмотр логов развертывания ✅
- Откройте Deployment → Build Logs
- Проверьте, что сборка прошла успешно
- Ищите ошибки компиляции или проблемы с зависимостями
- Убедитесь, что команда `npm run build` выполнилась без ошибок

### Шаг 4: Проверка структуры файлов ✅

После успешной сборки должны существовать:

**Если Root Directory = `front`:**
```
front/build/
  ├── index.html
  ├── static/
  │   ├── css/
  │   └── js/
  └── ...
```

**Если Root Directory не установлен:**
```
front/build/
  ├── index.html
  ├── static/
  │   ├── css/
  │   └── js/
  └── ...
```

Проверьте в Build Logs, что директория `build` создается.

### Шаг 5: Проверка конфигурации vercel.json ✅

**Если Root Directory = `front`:**
Используется `front/vercel.json`:
```json
{
  "version": 2,
  "buildCommand": "npm install && npm run build",
  "outputDirectory": "build",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Если Root Directory не установлен:**
Используется корневой `vercel.json`:
```json
{
  "version": 2,
  "buildCommand": "cd front && npm install && npm run build",
  "outputDirectory": "front/build",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Шаг 6: Проверка прав доступа ✅
- Убедитесь, что у вас есть необходимые права для доступа к deployment
- Проверьте, что проект не является приватным без соответствующих прав

## Быстрое решение

### Вариант 1: Использование Root Directory (РЕКОМЕНДУЕТСЯ)

1. Vercel Dashboard → Settings → General
2. Root Directory: `front`
3. Сохранить и переразвернуть

### Вариант 2: Без Root Directory

1. Убедитесь, что корневой `vercel.json` настроен правильно
2. Проверьте, что `outputDirectory` указывает на `front/build`
3. Переразверните проект

## Частые проблемы и решения

### Проблема: Build успешен, но 404 ошибка
**Решение:**
- Проверьте, что `outputDirectory` указывает на правильную директорию
- Убедитесь, что `index.html` существует в output директории
- Проверьте, что `rewrites` настроены для SPA

### Проблема: Build падает с ошибкой
**Решение:**
- Проверьте логи сборки на наличие ошибок
- Убедитесь, что все зависимости установлены
- Проверьте переменные окружения

### Проблема: Файлы не найдены после сборки
**Решение:**
- Проверьте, что команда `npm run build` выполняется успешно
- Убедитесь, что `package.json` содержит скрипт `build`
- Проверьте, что нет ошибок в процессе сборки

## Контакты поддержки

Если проблема не решена после выполнения всех шагов:
- [Свяжитесь с поддержкой Vercel](https://vercel.com/support)
- Предоставьте:
  - URL deployment
  - Логи сборки
  - Конфигурацию vercel.json
  - Информацию о Root Directory

## Полезные ссылки

- [Официальная документация по ошибке NOT_FOUND](https://vercel.com/docs/errors/NOT_FOUND)
- [Документация по монoreпо на Vercel](https://vercel.com/docs/monorepos)
- [Документация по Create React App на Vercel](https://vercel.com/guides/deploying-react-with-vercel)

