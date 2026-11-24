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
    clearFav: "Очистить избранное"
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
    clearFav: "Clear favorites"
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

  const t = translations[lang]

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
      tg.setHeaderColor('#0f0f0f')
      tg.setBackgroundColor('#0f0f0f')
      if (tg.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user)
      }
    }

    const savedFav = localStorage.getItem('steamy-favorites-v2')
    if (savedFav) setFavorites(JSON.parse(savedFav))

    const age = localStorage.getItem('steamy-age')
    if (age === 'yes') setAgeConfirmed(true)

    const savedLang = localStorage.getItem('steamy-lang')
    if (savedLang) setLang(savedLang)
  }, [])

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
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

  const filteredGames = useMemo(() => {
    let list = activeTab === 'favorites'
      ? initialGames.filter(g => favorites.includes(g.id))
      : initialGames

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.developer.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [search, activeTab, favorites])

  const openDownload = (url) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(url)
    } else {
      window.open(url, '_blank')
    }
  }

  if (!ageConfirmed) {
    return (
      <div className="age-gate">
        <div className="age-card">
          <div className="logo">🔥 Steamy Store</div>
          <h1>18+</h1>
          <p>Этот каталог содержит откровенный контент для взрослых.</p>
          <p>Подтверди, что тебе исполнилось 18 лет.</p>
          <button className="btn-primary" onClick={confirmAge}>
            Мне есть 18 лет
          </button>
          <button className="btn-secondary" onClick={() => window.Telegram?.WebApp?.close()}>
            Выйти
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
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
        <div className="tabs">
          <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>
            {t.all} ({initialGames.length})
          </button>
          <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')}>
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
          filteredGames.map(game => (
            <div key={game.id} className="card" onClick={() => setSelectedGame(game)}>
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
                  {game.tags.slice(0, 3).map(t => <span key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {selectedGame && (
        <div className="modal" onClick={() => setSelectedGame(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={selectedGame.cover} alt="" className="modal-cover" />
            <div className="modal-body">
              <h2>{selectedGame.title}</h2>
              <div className="meta">{selectedGame.developer} · {selectedGame.year} · ⭐ {selectedGame.rating}</div>
              
              <div className="info-row">
                <span>{t.platforms}: {selectedGame.platforms.join(', ')}</span>
              </div>
              <div className="info-row">
                <span>{t.animation}: {selectedGame.hasAnimation ? t.yes : t.no}</span>
              </div>
              <div className="info-row">
                <span>{t.russian}: {selectedGame.hasRussian ? t.yes : t.no}</span>
              </div>

              <div className="tags">
                {selectedGame.tags.map(t => <span key={t}>{t}</span>)}
              </div>
              <p className="desc">{selectedGame.description[lang]}</p>

              {selectedGame.screenshots && selectedGame.screenshots.length > 0 && (
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
