import { useState, useEffect, useMemo } from 'react'
import { games as initialGames } from './data/games.js'
import './App.css'

function App() {
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedGame, setSelectedGame] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [tgUser, setTgUser] = useState(null)

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

    const saved = localStorage.getItem('steamy-favorites')
    if (saved) setFavorites(JSON.parse(saved))

    const age = localStorage.getItem('steamy-age')
    if (age === 'yes') setAgeConfirmed(true)
  }, [])

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id]
      localStorage.setItem('steamy-favorites', JSON.stringify(next))
      return next
    })
  }

  const confirmAge = () => {
    localStorage.setItem('steamy-age', 'yes')
    setAgeConfirmed(true)
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
          {tgUser && <div className="user">@{tgUser.username || tgUser.first_name}</div>}
        </div>
        <input
          className="search"
          placeholder="Поиск игр, тегов, разработчиков..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="tabs">
          <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>
            Все игры ({initialGames.length})
          </button>
          <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')}>
            Избранное ({favorites.length})
          </button>
        </div>
      </header>

      <main className="grid">
        {filteredGames.length === 0 ? (
          <div className="empty">Ничего не найдено</div>
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
              <div className="tags">
                {selectedGame.tags.map(t => <span key={t}>{t}</span>)}
              </div>
              <p className="desc">{selectedGame.description}</p>
              <div className="modal-actions">
                <button className="btn-primary" onClick={() => openDownload(selectedGame.downloadUrl)}>
                  Скачать / Купить
                </button>
                <button
                  className={`btn-fav ${favorites.includes(selectedGame.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(selectedGame.id)}
                >
                  {favorites.includes(selectedGame.id) ? 'В избранном' : 'В избранное'}
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
