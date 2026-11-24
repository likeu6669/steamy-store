import { useState, useEffect, useMemo } from 'react'
import { games as initialGames } from './data/games.js'
import './App.css'

const translations = {
  ru: {
    all: "Все игры",
    favorites: "Избранное",
    search: "Поиск игр, тегов, разработчиков...",
    empty: "Ничего не найдено",
    download: "Скачать / Купить",
    addFav: "В избранное",
    inFav: "В избранном",
    screenshots: "Скриншоты",
    platforms: "Платформы",
    animation: "Анимация",
    yes: "Да",
    no: "Нет",
    russian: "Русский перевод",
    clearFav: "Очистить избранное",
    sort: "Сортировка",
    filter: "Фильтры",
    platform: "Платформа",
    any: "Любая",
    share: "Поделиться",
    copied: "Скопировано",
    top: "Наверх"
  },
  en: {
    all: "All games",
    favorites: "Favorites",
    search: "Search games, tags, developers...",
    empty: "Nothing found",
    download: "Download / Buy",
    addFav: "Add to favorites",
    inFav: "In favorites",
    screenshots: "Screenshots",
    platforms: "Platforms",
    animation: "Animation",
    yes: "Yes",
    no: "No",
    russian: "Russian translation",
    clearFav: "Clear favorites",
    sort: "Sort",
    filter: "Filters",
    platform: "Platform",
    any: "Any",
    share: "Share",
    copied: "Copied",
    top: "Top"
  }
}

function App() {
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedGame, setSelectedGame] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [tgUser, setTgUser] = useState(null)
  const [lang, setLang] = useState('ru')
  const [sortBy, setSortBy] = useState('rating')
  const [filterPlatform, setFilterPlatform] = useState('any')
  const [filterAnimation, setFilterAnimation] = useState('any')
  const [filterRussian, setFilterRussian] = useState('any')
  const [activeTag, setActiveTag] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState('dark')

  const t = translations[lang]

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
      const colorScheme = tg.colorScheme || 'dark'
      setTheme(colorScheme)
      tg.setHeaderColor(colorScheme === 'dark' ? '#0f0f0f' : '#ffffff')
      tg.setBackgroundColor(colorScheme === 'dark' ? '#0f0f0f' : '#ffffff')
      if (tg.initDataUnsafe?.user) setTgUser(tg.initDataUnsafe.user)
    }

    const savedFav = localStorage.getItem('steamy-favorites-v2')
    if (savedFav) setFavorites(JSON.parse(savedFav))

    const age = localStorage.getItem('steamy-age')
    if (age === 'yes') setAgeConfirmed(true)

    const savedLang = localStorage.getItem('steamy-lang')
    if (savedLang) setLang(savedLang)

    const savedTab = localStorage.getItem('steamy-tab')
    if (savedTab) setActiveTab(savedTab)

    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      localStorage.setItem('steamy-favorites-v2', JSON.stringify(next))
      return next
    })
  }

  const clearFavorites = () => {
    setFavorites([])
    localStorage.setItem('steamy-favorites-v2', JSON.stringify([]))
  }

  const confirmAge = () => {
    localStorage.setItem('steamy-age', 'yes')
    setAgeConfirmed(true)
  }

  const changeLang = (newLang) => {
    setLang(newLang)
    localStorage.setItem('steamy-lang', newLang)
  }

  const changeTab = (tab) => {
    setActiveTab(tab)
    localStorage.setItem('steamy-tab', tab)
  }

  const shareGame = (game) => {
    const text = `${game.title} — ${window.location.origin}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const filteredGames = useMemo(() => {
    let list = activeTab === 'favorites'
      ? initialGames.filter(g => favorites.includes(g.id))
      : initialGames

    if (filterPlatform !== 'any') {
      list = list.filter(g => g.platforms.includes(filterPlatform))
    }
    if (filterAnimation !== 'any') {
      list = list.filter(g => g.hasAnimation === (filterAnimation === 'yes'))
    }
    if (filterRussian !== 'any') {
      list = list.filter(g => g.hasRussian === (filterRussian === 'yes'))
    }
    if (activeTag) {
      list = list.filter(g => g.tags.includes(activeTag))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.developer.toLowerCase().includes(q) ||
        g.tags.some(tag => tag.toLowerCase().includes(q))
      )
    }

    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sortBy === 'year') list = [...list].sort((a, b) => b.year - a.year)
    if (sortBy === 'name') list = [...list].sort((a, b) => a.title.localeCompare(b.title))

    return list
  }, [search, activeTab, favorites, sortBy, filterPlatform, filterAnimation, filterRussian, activeTag])

  const openDownload = (url) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(url)
    } else {
      window.open(url, '_blank')
    }
  }

  if (!ageConfirmed) {
    return (
      <div className={`age-gate ${theme}`}>
        <div className="age-card animate-in">
          <div className="logo">🔥 Steamy Store</div>
          <h1>18+</h1>
          <p>Этот каталог содержит откровенный контент для взрослых.</p>
          <p>Подтверди, что тебе исполнилось 18 лет.</p>
          <button className="btn-primary" onClick={confirmAge}>Мне есть 18 лет</button>
          <button className="btn-secondary" onClick={() => window.Telegram?.WebApp?.close()}>Выйти</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <div className="header-top">
          <div className="logo">🔥 Steamy Store</div>
          <div className="header-right">
            <div className="lang-switch">
              <button className={lang === 'ru' ? 'active' : ''} onClick={() => changeLang('ru')}>RU</button>
              <button className={lang === 'en' ? 'active' : ''} onClick={() => changeLang('en')}>EN</button>
            </div>
            {tgUser && <div className="user">@{tgUser.username || tgUser.first_name}</div>}
          </div>
        </div>
        <input
          className="search"
          placeholder={t.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="controls">
          <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
            {t.filter} {showFilters ? '▲' : '▼'}
          </button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="rating">{t.sort}: Рейтинг</option>
            <option value="year">{t.sort}: Год</option>
            <option value="name">{t.sort}: Название</option>
          </select>
        </div>

        {showFilters && (
          <div className="filters animate-in">
            <div className="filter-row">
              <span>{t.platform}</span>
              <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}>
                <option value="any">{t.any}</option>
                <option value="PC">PC</option>
                <option value="Android">Android</option>
                <option value="Mac">Mac</option>
              </select>
            </div>
            <div className="filter-row">
              <span>{t.animation}</span>
              <select value={filterAnimation} onChange={e => setFilterAnimation(e.target.value)}>
                <option value="any">{t.any}</option>
                <option value="yes">{t.yes}</option>
                <option value="no">{t.no}</option>
              </select>
            </div>
            <div className="filter-row">
              <span>{t.russian}</span>
              <select value={filterRussian} onChange={e => setFilterRussian(e.target.value)}>
                <option value="any">{t.any}</option>
                <option value="yes">{t.yes}</option>
                <option value="no">{t.no}</option>
              </select>
            </div>
            {activeTag && (
              <button className="clear-tag" onClick={() => setActiveTag(null)}>
                Тег: {activeTag} ✕
              </button>
            )}
          </div>
        )}

        <div className="tabs">
          <button className={activeTab === 'all' ? 'active' : ''} onClick={() => changeTab('all')}>
            {t.all} ({initialGames.length})
          </button>
          <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => changeTab('favorites')}>
            {t.favorites} ({favorites.length})
          </button>
          {favorites.length > 0 && (
            <button className="clear-btn" onClick={clearFavorites}>{t.clearFav}</button>
          )}
        </div>
      </header>

      <main className="grid">
        {filteredGames.length === 0 ? (
          <div className="empty">{t.empty}</div>
        ) : (
          filteredGames.map((game, i) => (
            <div
              key={game.id}
              className="card animate-in"
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => setSelectedGame(game)}
            >
              <div className="cover-wrap">
                <img src={game.cover} alt={game.title} className="cover" />
                <button
                  className={`fav-btn ${favorites.includes(game.id) ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(game.id) }}
                >
                  {favorites.includes(game.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="card-info">
                <div className="title">{game.title}</div>
                <div className="meta">{game.year} · {game.developer}</div>
                <div className="tags">
                  {game.tags.slice(0, 3).map(tag => (
                    <span key={tag} onClick={(e) => { e.stopPropagation(); setActiveTag(tag); setShowFilters(true) }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {showTop && (
        <button className="to-top" onClick={scrollToTop}>{t.top}</button>
      )}

      {selectedGame && (
        <div className="modal" onClick={() => setSelectedGame(null)}>
          <div className="modal-content animate-in" onClick={e => e.stopPropagation()}>
            <img src={selectedGame.cover} alt="" className="modal-cover" />
            <div className="modal-body">
              <h2>{selectedGame.title}</h2>
              <div className="meta">{selectedGame.developer} · {selectedGame.year} · ⭐ {selectedGame.rating}</div>

              <div className="info-row"><span>{t.platforms}: {selectedGame.platforms.join(', ')}</span></div>
              <div className="info-row"><span>{t.animation}: {selectedGame.hasAnimation ? t.yes : t.no}</span></div>
              <div className="info-row"><span>{t.russian}: {selectedGame.hasRussian ? t.yes : t.no}</span></div>

              <div className="tags">
                {selectedGame.tags.map(tag => (
                  <span key={tag} onClick={() => { setActiveTag(tag); setSelectedGame(null); setShowFilters(true) }}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className="desc">{selectedGame.description[lang]}</p>

              {selectedGame.screenshots?.length > 0 && (
                <div className="screenshots">
                  <div className="screenshots-title">{t.screenshots}</div>
                  <div className="screenshots-row">
                    {selectedGame.screenshots.map((src, i) => (
                      <img key={i} src={src} alt="" className="screenshot" />
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button className="btn-primary" onClick={() => openDownload(selectedGame.downloadUrl)}>
                  {t.download}
                </button>
                <button className="btn-secondary" onClick={() => shareGame(selectedGame)}>
                  {copied ? t.copied : t.share}
                </button>
                <button
                  className={`btn-fav ${favorites.includes(selectedGame.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(selectedGame.id)}
                >
                  {favorites.includes(selectedGame.id) ? t.inFav : t.addFav}
                </button>
              </div>
            </div>
            <button className="close" onClick={() => setSelectedGame(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
