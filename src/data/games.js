export const games = [
  {
    id: 1,
    title: "Succubus",
    developer: "Madmind Studio",
    year: 2021,
    tags: ["Action", "Hack & Slash", "Demon"],
    description: "Стильная экшен-игра с демоном-суккубом. Много крови, сексуальности и хардкорных боёв.",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l2s.jpg",
    downloadUrl: "https://store.steampowered.com/app/1148590/Succubus/",
    rating: 4.2
  },
  {
    id: 2,
    title: "Subverse",
    developer: "Studio FOW",
    year: 2021,
    tags: ["RPG", "Shooter", "Sci-Fi"],
    description: "Космическая RPG-шутер с откровенными сценами и юмором. Классика жанра NSFW.",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
    downloadUrl: "https://store.steampowered.com/app/750920/Subverse/",
    rating: 4.5
  },
  {
    id: 3,
    title: "House Party",
    developer: "Eek! Games",
    year: 2022,
    tags: ["Adventure", "Simulation", "Adult"],
    description: "Симулятор вечеринки с возможностью соблазнения персонажей. Много контента и модов.",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2k8a.jpg",
    downloadUrl: "https://store.steampowered.com/app/611790/House_Party/",
    rating: 4.0
  },
  {
    id: 4,
    title: "Being a DIK",
    developer: "DrPinkCake",
    year: 2020,
    tags: ["Visual Novel", "Choices", "College"],
    description: "Одна из самых популярных визуальных новелл с глубоким сюжетом и множеством романтических линий.",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2j5p.jpg",
    downloadUrl: "https://www.patreon.com/drpinkcake",
    rating: 4.8
  },
  {
    id: 5,
    title: "Summertime Saga",
    developer: "DarkCookie",
    year: 2016,
    tags: ["Visual Novel", "Open World", "Adult"],
    description: "Долгоживущая визуальная новелла в открытом мире. Много персонажей и событий.",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1t4s.jpg",
    downloadUrl: "https://www.patreon.com/darkcookie",
    rating: 4.3
  },
  {
    id: 6,
    title: "Corruption of Champions II",
    developer: "Fenoxo",
    year: 2020,
    tags: ["RPG", "Text", "Fantasy"],
    description: "Текстовая RPG с огромным количеством фетишей и контента. Продолжение классики.",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8x.jpg",
    downloadUrl: "https://www.fenoxo.com/",
    rating: 4.4
  },
  {
    id: 7,
    title: "Degrees of Lewdity",
    developer: "Vrelnir",
    year: 2018,
    tags: ["RPG", "Text", "Survival"],
    description: "Очень откровенная текстовая RPG с элементами выживания и огромным количеством контента.",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2abc.jpg",
    downloadUrl: "https://vrelnir.blogspot.com/",
    rating: 4.6
  },
  {
    id: 8,
    title: "Treasure of Nadia",
    developer: "NLT Media",
    year: 2020,
    tags: ["Adventure", "Puzzle", "Adult"],
    description: "Приключенческая игра с головоломками и откровенными сценами на тропическом острове.",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2def.jpg",
    downloadUrl: "https://www.patreon.com/nltmedia",
    rating: 4.1
  },
  {
    id: 9,
    title: "Wild Life",
    developer: "Adeptus Steve",
    year: 2019,
    tags: ["Sandbox", "Adult", "Open World"],
    description: "Песочница в духе GTA с сильным упором на adult-контент.",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ghi.jpg",
    downloadUrl: "https://www.patreon.com/adeptussteve",
    rating: 3.9
  },
  {
    id: 10,
    title: "Carnal Instinct",
    developer: "Team Carnal Instinct",
    year: 2023,
    tags: ["Survival", "Open World", "Adult"],
    description: "Выживание в открытом мире с антропоморфными персонажами и adult-механиками.",
    cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2jkl.jpg",
    downloadUrl: "https://store.steampowered.com/app/1462770/Carnal_Instinct/",
    rating: 4.0
  },
  ...Array.from({ length: 20 }, (_, i) => ({
    id: 11 + i,
    title: `NSFW Game ${11 + i}`,
    developer: "Indie Studio",
    year: 2022 + (i % 4),
    tags: ["Adult", "Visual Novel", i % 2 === 0 ? "RPG" : "Adventure"],
    description: "Тестовая карточка игры для демонстрации каталога. Замените на реальные данные.",
    cover: `https://picsum.photos/seed/steamy${11 + i}/400/600`,
    downloadUrl: "https://example.com",
    rating: 3.5 + (i % 15) / 10
  }))
]
