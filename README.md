# Steamy Store — Telegram Mini App

Каталог NSFW-игр внутри Telegram: карточки игр, поиск, фильтры, избранное и ссылки на Steam / itch.io.

Бот: https://t.me/SteamyStore_bot

## Стек

Vite 5 + React 18, статическое SPA без сервера. Данные игр хранятся в `src/data/games.js`.

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

## Деплой на Vercel

Подключите этот репозиторий на [Vercel](https://vercel.com). Фреймворк — Vite, команда сборки — `npm run build`, папка с результатом — `dist`. Затем в BotFather укажите URL задеплоенного приложения как Web App бота.

## Редактирование каталога

Игры, обложки, скриншоты и ссылки добавляются и правятся в файле `src/data/games.js`.
