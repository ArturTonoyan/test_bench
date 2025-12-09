# Исправление ошибки 404 на Vercel

## Проблема
При развертывании на Vercel появляется ошибка:
```
404: NOT_FOUND
Code: NOT_FOUND
```

## Решение

### Вариант 1: Использование Root Directory (РЕКОМЕНДУЕТСЯ)

1. Откройте ваш проект в [Vercel Dashboard](https://vercel.com)
2. Перейдите в **Settings** → **General**
3. Найдите секцию **Root Directory**
4. Нажмите **Edit** и введите: `front`
5. Сохраните изменения
6. Переразверните проект (Redeploy)

После этого Vercel будет использовать `front/vercel.json` и работать из директории `front/`.

### Вариант 2: Без Root Directory

Если вы не хотите использовать Root Directory, убедитесь что:

1. В корневом `vercel.json` правильно указаны пути:
   ```json
   {
     "buildCommand": "cd front && npm install && npm run build",
     "outputDirectory": "front/build"
   }
   ```

2. Переменные окружения установлены в Vercel Dashboard

3. Проект переразвернут после изменений

## Проверка

После применения исправлений:

1. Проверьте логи сборки в Vercel Dashboard
2. Убедитесь, что сборка проходит успешно
3. Проверьте, что файлы находятся в `front/build` после сборки
4. Убедитесь, что `index.html` существует в output директории

## Дополнительные шаги

Если проблема сохраняется:

1. **Проверьте логи сборки:**
   - Откройте Deployment → Runtime Logs
   - Убедитесь, что команда `npm run build` выполняется успешно

2. **Проверьте структуру файлов:**
   - После сборки должна существовать директория `front/build`
   - В ней должен быть файл `index.html`

3. **Очистите кеш:**
   - В Vercel Dashboard → Settings → General
   - Нажмите "Clear Build Cache"
   - Переразверните проект

4. **Проверьте переменные окружения:**
   - Убедитесь, что `REACT_APP_API_URL` установлена
   - Проверьте, что она доступна для нужного окружения (Production/Preview)

## Контакты

Если проблема не решена, проверьте:
- [Документацию Vercel по монoreпо](https://vercel.com/docs/monorepos)
- [Документацию по Create React App на Vercel](https://vercel.com/guides/deploying-react-with-vercel)

